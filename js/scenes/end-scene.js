export default class EndScene extends Phaser.Scene {
    constructor() {
        super( { key: "EndScene" } );
    }

    preload() {

    }
    
    create() {
        this.add.image(280, 180, 'youwin').setOrigin(0);

        this.scoreText = this.add
        .text(250, 400, "To reset the game press F5", {
        font: "18px monospace",
        fill: "#FFFFFF",
        padding: { x: 20, y: 10 },
        })
        .setScrollFactor(0);
    }

    update() {

    }


}