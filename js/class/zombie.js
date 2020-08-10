import Sound from "../class/sound.js";

export default class Zombies {
    constructor (scene, positionX, positionY) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(positionX, positionY, 'zombies');
        this.sprite.body.setSize(38,45);
        this.createAnimations();
        this.walk();    

        this.distance = 0;
        this.alive = true;    
        this.score = 30;

        this.zombieDieSound = new Sound(this.scene, 'zombieDie');
    }
    
    createAnimations() {
        this.scene.anims.create({
            key: 'zombieWalk',
            frames: this.scene.anims.generateFrameNumbers('zombies', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        }); 
    }

    walk() {
        const zombie = this.sprite;        
        var speed = 60;

        if(this.distance < 500 && this.alive == true) {
            zombie.setVelocityX(speed);
            zombie.setFlip(true, false);
            zombie.anims.play('zombieWalk', true);
            this.distance++;
            //console.log(this.distance);
        }
        else {
            if(this.distance < 1000 && this.alive == true) {
                zombie.setVelocityX(-speed);   
                zombie.setFlip(false, false);  
                zombie.anims.play('zombieWalk', true);
                this.distance++;
            }
            else
            this.distance = 0;
        }
    }

    destroy() {
        if(this.alive == false) {
            this.zombieDieSound.play();
            this.sprite.destroy();
            const zombieIndex = this.scene.zombies.indexOf(this);
            this.scene.zombies.splice(zombieIndex, 1);
        }
    }

}