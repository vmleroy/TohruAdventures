export default class Stars {
    constructor (scene, positionX, positionY) {
        this.scene = scene;
        //this.sprite = scene.physics.add.sprite(positionX, positionY, 'stars');
        this.sprite = scene.physics.add.staticGroup();
        this.sprite.create(positionX, positionY, 'stars');
    }
}