export default class Sound {
    constructor(scene, name) {
        this.scene = scene;
        this.sound = this.scene.sound.add(name);
    }

    play() {
        this.sound.play();
    }

    stop() {
        this.sound.stop();
    }

    pause() {
        this.sound.pause();
    }

    resume() {
        this.sound.resume();
    }
}