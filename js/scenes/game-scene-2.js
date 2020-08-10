import Player from "../class/player.js";
import Stars from "../class/stars.js";
import Sound from "../class/sound.js";
import {getHp, invincibilityCh} from "../class/player-hp-control.js";
import {addScore, changeScene} from "../class/score-control.js";

export default class GameScene2 extends Phaser.Scene {
    constructor() {
        super( { key: "GameScene2" } );
    }

    preload() { 
        this.gameWidth = this.game.config.width;
        this.gameHeight = this.game.config.height;
    }

    create() {
        //Create player
        this.player = new Player(this, 0, 0, 'tohru');
        this.player.setJumpSpeed(250);

        //Create map
        this.tilemapCreate();

        //Set player details
        this.player.setPhysics(this.tubeEntrance.x, this.tubeEntrance.y);

        //Create collisions
        this.collisionCreate();

        //Set sounds
        this.coinSound = new Sound(this, 'coin');

        //Set cameras
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player.sprite);
        //this.cameras.main.setZoom(1.2);
    }

    update() {
        this.player.update();
    }

    tilemapCreate() {
        //Set tilemap
        this.map = this.make.tilemap({ key: "map_underground" });
        this.tiles = this.map.addTilesetImage("super-mario-nes-arrow-32px", "marioTiles");

        //Map layers
        this.backgroundLayer = this.map.createStaticLayer("Background", this.tiles);
        this.platformsLayer = this.map.createStaticLayer("Platforms", this.tiles);

        //Set spawn point
            //this.spawnPoint = this.map.findObject("Spawn", obj => obj.name === "SpawnPoint");
        
        //Set tubes
        this.tube = this.physics.add.staticGroup();
        this.tubeEntrance;
        this.tubeExit;
        this.tubesLayer = this.map.getObjectLayer("Tubes")['objects'];
        this.tubesLayer.forEach(object =>{
            if(this.map.findObject("Tubes", obj => obj.name === "Entry") === object) {
                this.tubeEntrance = this.tube.create(object.x, object.y, '');
                this.tubeEntrance.setSize(64, 32)
                    .setOrigin(0)
                    .setOffset(16, 32)
                    .setVisible(false);
            }
            else {
                this.tubeExit = this.tube.create(object.x, object.y, '');
                this.tubeExit.setSize(32, 64)                    
                    .setOrigin(0)
                    .setOffset(32, 16)
                    .setVisible(false);
            }
        });

        //Set coins
        this.coins = [];
        this.coinsLayer = this.map.getObjectLayer("Coins")['objects'];
        this.coinsLayer.forEach(object => {
            this.coins.push(new Stars(this, object.x, object.y));
        });
    }

    collisionCreate() { 
        this.platformsLayer.setCollisionByProperty({ collides: true }); //collision plataforms collision true
        this.physics.world.addCollider(this.player.sprite, this.platformsLayer); //collision player - platform
        
        //Setting tubes collision
        this.physics.add.overlap(this.player.sprite, this.tubeExit, this.changeSceneTube, null, this);
            //this.physics.add.overlap(this.player.sprite, this.tubeEntrance, this.changeSceneTube, null, this);

        for(let coin of this.coins) {
            this.physics.add.overlap(this.player.sprite, coin.sprite, this.collectCoins, null, this); //collision player - coins
        }  
    }

    collectCoins(player, coin) {
        this.coinSound.play();
        coin.destroy(coin.x, coin.y);
        addScore(10);
    }

    changeSceneTube() {
        this.player.moveToOtherPlace(this.tubeEntrance.x, this.tubeEntrance.y);
        this.scene.switch('GameScene1');        
        //console.log("ENTRANCE")
    }
}