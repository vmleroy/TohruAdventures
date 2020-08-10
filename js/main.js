import PreloadScene from './scenes/preload-scene.js';
import GameScene1 from './scenes/game-scene-1.js';
import GameScene2 from './scenes/game-scene-2.js';
import GameScene3 from './scenes/game-scene-3.js';
import EndScene from './scenes/end-scene.js';
import HudScene from './scenes/hud-scene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'jogo-phaser',
    // scale: {
    //     mode: Phaser.Scale.RESIZE,
    //     mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
    //     autoCenter: Phaser.Scale.CENTER_BOTH,
    //     width: 800,
    //     height: 600
    // },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            debug: false
        }
    },
    scene: [
        PreloadScene,
        GameScene1,
        GameScene2,
        GameScene3,
        EndScene,
        HudScene
    ]
};

const game = new Phaser.Game(config);