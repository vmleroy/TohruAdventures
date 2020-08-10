export default class Spikes {
    constructor(scene, tile) {
        this.scene = scene
        this.sprite = scene.physics.add.staticGroup();
        
        const spike = this.sprite.create(tile.getCenterX(), tile.getCenterY(), "spikes");
        
        spike.rotation = tile.rotation;
        if (spike.angle === 0) spike.body.setSize(32, 6).setOffset(0, 26);
        else if (spike.angle === -90) spike.body.setSize(6, 32).setOffset(26, 0);
        else if (spike.angle === 90) spike.body.setSize(6, 32).setOffset(0, 0);
        if (spike.angle === -180) spike.body.setSize(32, 6).setOffset(0, 0);
    }
}