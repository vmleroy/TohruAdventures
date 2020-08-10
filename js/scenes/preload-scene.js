export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super( { key: "PreloadScene" } );
    }

    preload() {
        const gameWidth = this.game.config.width;
        const gameHeight = this.game.config.height;
        const loadingBar = this.add.graphics();
        // Create progress bar with the event
        const barWidth = 0.8 * gameWidth;
        this.load.on('progress', (percent) => {
            loadingBar.clear();
            // Color of the bar
            loadingBar.fillStyle(0xffffff, 1);
            loadingBar.fillRect((gameWidth - barWidth) / 2, gameHeight / 2, barWidth * percent, 20);
            // Yellow line arround the bar
            loadingBar.lineStyle(4, 0xffff00, 1);
            loadingBar.strokeRect((gameWidth - barWidth) / 2, gameHeight / 2, barWidth, 20);
        });

        this.load.on('complete', () => {
            this.scene.start('GameScene1');
        });

        //Loading images
        this.load.image('youwin', 'assets/sprites/youwin.png');
        this.load.image('button', 'assets/sprites/button.png');     
        this.load.image('stars', 'assets/sprites/star.png');     
        this.load.image('heart', 'assets/sprites/heart.png');     
        this.load.image('spikes', 'assets/sprites/0x72-industrial-spike.png');     
        this.load.image('marioTiles', 'assets/tilesets/super-mario-nes-arrow-32px.png');
        this.load.image('industrialTileset', 'assets/tilesets/0x72-industrial-tileset-32px-extruded.png');

        //Loading sprites
        this.load.spritesheet('tohru', 'assets/spritesheets/tohru.png', {frameWidth: 70, frameHeight: 70});
        this.load.spritesheet('zombies', 'assets/spritesheets/zombie.png', {frameWidth: 38, frameHeight: 48});

        //Loading tilemaps
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1_top_1.json');
        this.load.tilemapTiledJSON('map_underground', 'assets/tilemaps/level1_underground.json')
        this.load.tilemapTiledJSON('map2', 'assets/tilemaps/level2.json')

        //Loading audio
        this.load.audio('coin', 'assets/audio/coin.wav');
        this.load.audio('loseHp', 'assets/audio/tohru-losing-life.wav');
        this.load.audio('zombieDie', 'assets/audio/zombie-dying.wav');
    }
    
    create() {

    }

    update() {

    }
}