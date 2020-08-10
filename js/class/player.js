import {decreaseHp, increaseHp, getHp, setHp, getInvincibilityTime, setInvincibilityTime} from './player-hp-control.js';
import Sound from "../class/sound.js";

export default class Player {
    constructor(scene, x, y, characterName) {
        this.scene = scene;

        //Basic info about player
        this.sprite;
        this.characterName = characterName;
        this.isDead = false;
        this.punching;
        this.jumpSpeed;
        this.invincibility = false;
        this.hp = getHp();
        this.invincibilityTime = 300;

        this.loseHpSound = new Sound(this.scene, 'loseHp');
       
        //Setting up animation and keyboard maps
        this.keyboardMap();
        this.animationMap(characterName);
        this.setPlayerHpConfig(this.hp, this.invincibilityTime);
    }

    setPhysics(x, y) {
        this.sprite = this.scene.physics.add
            .sprite(x, y, this.characterName, 0)            
            .setDrag(600, 0)
            .setMaxVelocity(200, 300)
            .setSize(40, 45)
    }

    keyboardMap() {
        const { A, D, W, SPACE } = Phaser.Input.Keyboard.KeyCodes;
        this.keys = this.scene.input.keyboard.addKeys({
            a: A,
            d: D,
            w: W,
            space: SPACE
        });
    }

    animationMap(characterName) {
        const anims = this.scene.anims;
        anims.create({
            key: "player-idle",
            frames: anims.generateFrameNumbers(characterName, { start: 24, end: 24 }),
            frameRate: 3,
            repeat: -1
        });
        anims.create({
            key: "player-run",
            frames: anims.generateFrameNumbers(characterName, { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1
        });
        anims.create({
            key: "player-jump",
            frames: anims.generateFrameNumbers(characterName, { start: 8, end: 15 }),
            frameRate: 3,
            repeat: -1
        });
        anims.create({
            key: "player-punch",
            frames: anims.generateFrameNumbers(characterName, { start: 24, end: 27 }),
            frameRate: 6,
            repeat: -1
        })
    }

    update() {
        const keys = this.keys;
        const sprite = this.sprite;
        const onGround = sprite.body.blocked.down;
        const acceleration = onGround ? 300 : 200;
        const accelerationWhileJumping = 100;
        const jump = -this.jumpSpeed;

        // Apply horizontal acceleration when left/a or right/d are applied
        if (keys.a.isDown) {
            if(onGround)
                sprite.setAccelerationX(-acceleration);
            else
                sprite.setAccelerationX(-accelerationWhileJumping);
            // No need to have a separate set of graphics for running to the left & to the right. Instead
            // we can just mirror the sprite.
            sprite.setFlipX(true);  
        } 
        else if (keys.d.isDown) {
            if(onGround)
                sprite.setAccelerationX(acceleration);
            else
                sprite.setAccelerationX(accelerationWhileJumping);
            sprite.setFlipX(false);
        } 
        else {
            sprite.setAccelerationX(0);
        }

        //Only allow the player to punch if they are on the ground
        if (onGround && (keys.space.isDown)) {
            sprite.anims.play("player-punch", true);
            sprite.anims.stopOnRepeat();
            this.punching = 1;
        }

        // Only allow the player to jump if they are on the ground
        if (onGround && (keys.w.isDown)) {
            //sprite.setVelocityY(-180);
            sprite.setVelocityY(jump);
        }

        // Update the animation/texture based on the state of the player
        if (onGround) {
            if (sprite.body.velocity.x !== 0 && sprite.anims.getCurrentKey() !== "player-punch")
                sprite.anims.play("player-run", true);
            else if (sprite.anims.getCurrentKey() !== "player-punch")
                sprite.anims.play("player-idle", true);
            // else if(sprite.anims.getCurrentKey() === "player-punch" && sprite.anims.getProgress() >= 0.6 && sprite.anims.getProgress() <= 0.7)
            //     this.punching = 1;
            else if(sprite.anims.getCurrentKey() === "player-punch" && sprite.anims.getProgress() === 1) {
                sprite.anims.play("player-idle", true);
                this.punching = 0;
            }            
        } 
        else {
            sprite.anims.play("player-jump", true);
            //sprite.anims.stop();
            //sprite.setTexture("player", 10);
        }
    }

    loseHp() {
        this.loseHpSound.play();
        decreaseHp();
    }

    increaseHp() {
        increaseHp();
    }

    setPlayerHpConfig(hp, invincibilityTime) {
        setHp(hp);
        setInvincibilityTime(invincibilityTime);
    }
    
    setJumpSpeed(jumpSpeed) {
        this.jumpSpeed = jumpSpeed;
    }

    moveToOtherPlace(x, y) {
        this.sprite.setPosition(x, y);
    }

    freeze() {
        this.sprite.body.moves = false;
    }

    unfreeze() {
        this.sprite.body.moves = true;
    }

    destroy() {
        this.sprite.destroy();
    }
}