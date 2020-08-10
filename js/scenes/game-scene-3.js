import Player from "../class/player.js";
import Mouse from "../class/mouse.js";
import Stars from "../class/stars.js";
import Spikes from "../class/spikes.js";
import Sound from "../class/sound.js";
import {addScore, changeScene, resetScore} from "../class/score-control.js";
import { createBlocks } from "../class/create-blocks.js";

export default class GameScene3 extends Phaser.Scene {
    constructor() {
        super( { key: "GameScene3" } );
    }

    preload() {
        this.spikeTouched = false;
        this.gameWidth = this.game.config.width;
        this.gameHeight = this.game.config.height;  
        // this.createPlatformsMax = 15;  
        // this.createPlatforms = 0;  
    }
    
    create() {    
        //Create player
        this.player = new Player(this, 0, 0, 'tohru');
        this.player.setJumpSpeed(220)

        //Create map
        this.tilemapCreate();

        //Set player details
        this.player.setPhysics(this.spawnPoint.x, this.spawnPoint.y);

        //Create collisions
        this.collisionCreate();

        //Set sounds
        this.coinSound = new Sound(this, 'coin');

        //Set cameras
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBackgroundColor("#1d212d");
            //this.cameras.main.setZoom(1.2);

        //Set mouse
        this.mouse = new Mouse(this, this.map);

        // Help text that has a "fixed" position on the screen
        this.add
        .text(16, 16, "WASD to move & jump\nSpace to punch\nLeft click to draw platforms\nB+Left click to remove\nFinish the level creating platforms", {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
        })
        .setScrollFactor(1);

        //Starting Hud Scene
        this.scene.launch("HudScene", true);
    }

    update() {  
        if (this.player.isDead) return;

        //Updating player
        this.player.update();

        //Updating mouse
        this.mouse.update();

        //Creating commands to create or remove platforms
        createBlocks(this);

        //Updating player if he dies
        if (this.player.sprite.y > this.platformsLayer.height || this.spikeTouched === true) {
            //Set if player is dead
            this.player.isDead = true;

            const cam = this.cameras.main;
            cam.shake(100, 0.05);
            cam.fade(250, 0, 0, 0);
      
            //Freeze player so he cant move
            this.player.freeze();
      
            cam.once("camerafadeoutcomplete", () => {
              this.player.destroy();
              
              resetScore();
              this.scene.restart();
            });            
        }
    }

    tilemapCreate() {
        //Set tilemap
        this.map = this.make.tilemap({ key: "map2" });
        this.tiles = this.map.addTilesetImage("0x72-industrial-tileset-32px-extruded", "industrialTileset");

        //Map layers
        this.backgroundLayer = this.map.createDynamicLayer("background", this.tiles);
        this.platformsLayer = this.map.createDynamicLayer("platforms", this.tiles);

        //Set spawn point
        this.spawnPoint = this.map.findObject("Spawn", obj => obj.name === "SpawnPoint");
        
        //Set exit point
        this.exit = this.physics.add.staticGroup();
        this.exitPoint;
        this.exitLayer = this.map.getObjectLayer("End")['objects'];
        this.exitLayer.forEach(object =>{
            if(this.map.findObject("End", obj => obj.name === "End") === object) {
                this.exitPoint = this.exit.create(object.x, object.y, '');
                this.exitPoint.setSize(64, 128)
                    .setOrigin(0)
                    .setOffset(16, 16)
                    .setVisible(false);
            }
        });

        //Set coins
        this.coins = [];
        this.coinsLayer = this.map.getObjectLayer("Coins")['objects'];
        this.coinsLayer.forEach(object => {
            this.coins.push(new Stars(this, object.x, object.y));
        });

        //Set spikes
        this.spikes = [];
        this.platformsLayer.forEachTile(tile => {
            if(tile.index === 77) {
                this.spikes.push(new Spikes(this, tile) );
                this.platformsLayer.removeTileAt(tile.x, tile.y);
            }
        });
        this.backgroundLayer.forEachTile(tile => {
            if(tile.index === 77) {
                this.spikes.push(new Spikes(this, tile) );
                this.backgroundLayer.removeTileAt(tile.x, tile.y);
            }
        });
    }

    collisionCreate() { 
        this.platformsLayer.setCollisionByProperty({ collides: true }); //collision plataforms collision true
        this.physics.world.addCollider(this.player.sprite, this.platformsLayer); //collision player - platform

        //Collision end game
        this.physics.add.overlap(this.player.sprite, this.exitPoint, this.changeSceneExit, null, this);

        for(let coin of this.coins) {
            this.physics.add.overlap(this.player.sprite, coin.sprite, this.collectCoins, null, this); //collision player - coins
        }      
        
        for(let spike of this.spikes) {
            this.physics.add.overlap(this.player.sprite, spike.sprite, this.hitSpike, null, this); //collision player - spikes
        }   
    }

    collectCoins(player, coin) {
        this.coinSound.play();
        coin.destroy(coin.x, coin.y);
        addScore(10);
    }

    hitSpike() {
        this.spikeTouched = true;
    }

    changeSceneExit(player, exit) {
        const cam = this.cameras.main;
            cam.fade(250, 0, 0, 0);
            this.scene.stop('GameScene3');
            this.scene.stop("HudScene");
            cam.once("camerafadeoutcomplete", () => {                
                this.scene.switch('EndScene');
            });
        console.log("EXIT")
    }
}