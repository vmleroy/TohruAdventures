import {createHeartSprites} from "../class/player-hp-control.js";
import {getGlobalScore, getActualSceneScore} from "../class/score-control.js";
import {getCreatePlatformsMax, getCreatePlatforms} from "../class/create-blocks.js";

export default class Hud extends Phaser.Scene {
    constructor() {
        super( { key: "HudScene"});
    }

    preload() {

    }

    create() {
        //Create Score Text
        this.scoreText = this.add
        .text(620, 16, "Score: " + (getGlobalScore() + getActualSceneScore()), {
        font: "18px monospace",
        fill: "#FFFFFF",
        padding: { x: 20, y: 10 },
        })
        .setScrollFactor(0);

        //Creating heart sprites
        if(this.scene.isActive("GameScene1"))
            createHeartSprites(this);     
            
        if(this.scene.isActive("GameScene3")) {
            this.createPlatformsText = this.add
            .text(580, 40, "Blocks to place: " + (getCreatePlatformsMax() - getCreatePlatforms()), {
            font: "18px monospace",
            fill: "#FFFFFF",
            padding: { x: 20, y: 10 },
            })
            .setScrollFactor(0);
        }
    }

    update() {
        //Updating score text
        this.scoreText.setText( 'Score: ' + (getGlobalScore() + getActualSceneScore()) );

        //Updating blocks placement
        if(this.scene.isActive("GameScene3"))
            this.createPlatformsText.setText( "Blocks to place: " + (getCreatePlatformsMax() - getCreatePlatforms()) );
    }

}