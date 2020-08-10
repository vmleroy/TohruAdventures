import Player from "../class/player.js";
import Stars from "../class/stars.js";
import Zombies from "../class/zombie.js";
import Sound from "../class/sound.js";
import {getHp, invincibilityCh} from "../class/player-hp-control.js";
import {addScore, changeScene, resetScore} from "../class/score-control.js";

export default class GameScene1 extends Phaser.Scene {
    constructor() {
        super( { key: "GameScene1" } );
    }

    preload() {
        this.isPlayerDead;
        this.gameWidth = this.game.config.width;
        this.gameHeight = this.game.config.height;
        this.start = 0;        
    }
    
    create() {    
        //Create player
        this.player = new Player(this, 0, 0, 'tohru');
        this.player.setJumpSpeed(220);

        //Create map
        this.tilemapCreate();

        //Set player details
        if(this.start == 0)
            this.player.setPhysics(this.spawnPoint.x, this.spawnPoint.y);
        else 
            this.player.setPhysics(this.tubeExit.x, this.tubeExit.y);
            //this.physics.world.addCollider(this.player.sprite, this.platformsLayer);

        //Create collisions
        this.collisionCreate();

        //Set sounds
        this.coinSound = new Sound(this, 'coin');

        //Set cameras
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBackgroundColor("#6b8cff");
            //this.cameras.main.setZoom(1.2);

        // Help text that has a "fixed" position on the screen
        this.add
        .text(16, 56, "WASD to move & jump\nSpace to punch\nJust finish the level :)", {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
        })
        .setScrollFactor(1);

        //Launch HUD
        this.scene.launch("HudScene", true);
    }

    update() {  
        if (this.player.isDead) return;
        if (this.player.invincibility == true) invincibilityCh(this.player);

        this.player.update();
        //console.log(this.player.sprite.anims.getProgress());

        for(let zombie of this.zombies) {
            if(zombie.alive == true)
                zombie.walk();
        } 

        if (this.player.sprite.y > this.platformsLayer.height || getHp() <= 0) {
            //Set if player is dead
            this.player.isDead = true;

            const cam = this.cameras.main;
            cam.shake(100, 0.05);
            cam.fade(250, 0, 0, 0);
      
            //Freeze player so he cant move
            this.player.freeze();
      
            cam.once("camerafadeoutcomplete", () => {
              this.player.destroy();
              this.player.setPlayerHpConfig(this.player.hp, this.player.invincibilityTime);
              resetScore();
              this.scene.stop("GameScene2");
              this.scene.restart();
            });            
        }
    }

    tilemapCreate() {
        //Set tilemap
        this.map = this.make.tilemap({ key: "map" });
        this.tiles = this.map.addTilesetImage("super-mario-nes-arrow-32px", "marioTiles");

        //Map layers
        this.backgroundLayer = this.map.createStaticLayer("background", this.tiles);
        this.platformsLayer = this.map.createStaticLayer("Platforms", this.tiles);

        //Set spawn point
        this.spawnPoint = this.map.findObject("Spawn", obj => obj.name === "SpawnPoint");
        
        //Set exit point
        this.exit = this.physics.add.staticGroup();
        this.exitPoint;
        this.exitLayer = this.map.getObjectLayer("End")['objects'];
        this.exitLayer.forEach(object =>{
            if(this.map.findObject("End", obj => obj.name === "End") === object) {
                this.exitPoint = this.exit.create(object.x, object.y, '');
                this.exitPoint.setSize(32, 160)
                    .setOrigin(0)
                    .setOffset(16, 16)
                    .setVisible(false);
            }
        });

        //Set tubes
        this.tube = this.physics.add.staticGroup();
        this.tubeEntrance;
        this.tubeExit;
        this.tubesLayer = this.map.getObjectLayer("Tubes")['objects'];
        this.tubesLayer.forEach(object =>{
            if(this.map.findObject("Tubes", obj => obj.name === "Entry") === object) {
                this.tubeEntrance = this.tube.create(object.x, object.y, '');
                this.tubeEntrance.setSize(32, 64)
                    .setOrigin(0)
                    .setOffset(32, 16)
                    .setVisible(false);
            }
            else {
                this.tubeExit = this.tube.create(object.x, object.y, '');
                this.tubeExit.setSize(64, 32)
                    .setOrigin(0)
                    .setOffset(16, 32)
                    .setVisible(false);
            }
        });

        //Set coins
        this.coins = [];
        this.coinsLayer = this.map.getObjectLayer("Coins")['objects'];
        this.coinsLayer.forEach(object => {
            this.coins.push(new Stars(this, object.x, object.y));
        });

        //Set zombies
        this.zombies = [];
        this.zombiesLayer = this.map.getObjectLayer("Zombies")['objects'];
        this.zombiesLayer.forEach(object => {
            this.zombies.push(new Zombies(this, object.x, object.y - 30));
        });
    }

    collisionCreate() { 
        this.platformsLayer.setCollisionByProperty({ collides: true }); //collision plataforms collision true
        this.physics.world.addCollider(this.player.sprite, this.platformsLayer); //collision player - platform
        
        //Setting tubes collision
        this.physics.add.overlap(this.player.sprite, this.tubeEntrance, this.changeSceneTube, null, this);
            //this.physics.add.overlap(this.player.sprite, this.tubeExit, this.changeSceneTube, null, this);

        //Collision end game
        this.physics.add.overlap(this.player.sprite, this.exitPoint, this.changeSceneExit, null, this);

        for(let coin of this.coins) {
            this.physics.add.overlap(this.player.sprite, coin.sprite, this.collectCoins, null, this); //collision player - coins
        }    
        
        for(let zombie of this.zombies) {
            this.physics.add.collider(zombie.sprite, this.platformsLayer);
            this.physics.add.overlap(this.player.sprite, zombie.sprite, this.hitZombie, null, this); //collision player - zombies
        }                
    }

    collectCoins(player, coin) {
        coin.destroy(coin.x, coin.y);
        this.coinSound.play()
        addScore(10);
    }

    hitZombie(player, zombie) {
        const zombieInstance = this.zombies.find( z => z.sprite == zombie);
        if(this.player.punching == 1) {
            zombieInstance.alive = false;
            zombieInstance.destroy();
            addScore(zombieInstance.score);
        }
        else {
            if(this.player.invincibility == false) {
                //console.log("LOSE LIFE");
                this.player.invincibility = true;
                this.player.loseHp();
            }            
        }
    }

    changeSceneTube(player, tube) {
        const cam = this.cameras.main;
            cam.fade(250, 0, 0, 0);
            this.player.freeze();
            cam.once("camerafadeoutcomplete", () => {
                this.player.moveToOtherPlace(this.tubeExit.x, this.tubeExit.y);
                this.player.unfreeze();
                cam.fadeIn(250, 0, 0, 0);
                this.scene.switch('GameScene2');                
            });            

        //console.log("ENTRANCE")
    }

    changeSceneExit(player, exit) {
        const cam = this.cameras.main;
            cam.fade(250, 0, 0, 0);
            cam.once("camerafadeoutcomplete", () => { 
                this.scene.stop('GameScene1');
                this.scene.stop('GameScene2');        
                this.scene.stop("HudScene");     
                this.scene.switch('GameScene3');
                changeScene();
            });
        //console.log("EXIT")
    }
}