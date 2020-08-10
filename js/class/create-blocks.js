var createPlatformsMax = 15;
var createPlatforms = 0;

export function createBlocks(scene) {
    //Creating commands to create or remove platforms
    const { B } = Phaser.Input.Keyboard.KeyCodes;
    const keys = scene.input.keyboard.addKeys({
            b: B,
    });
    const pointer = scene.input.activePointer;
    const worldPoint = pointer.positionToCamera(scene.cameras.main);

    //Creating platforms
    if (pointer.isDown) {
        if(keys.b.isDown  &&  scene.platformsLayer.getTileAtWorldXY(worldPoint.x, worldPoint.y) != null && scene.platformsLayer.getTileAtWorldXY(worldPoint.x, worldPoint.y).index == 6) {
            if(createPlatforms > 0) {
                scene.platformsLayer.removeTileAtWorldXY(worldPoint.x, worldPoint.y);
                createPlatforms--;
            }
        }
        else {                
            if(createPlatforms >= 0  &&  createPlatforms < createPlatformsMax  &&  scene.platformsLayer.getTileAtWorldXY(worldPoint.x, worldPoint.y) === null  &&  keys.b.isUp) {
                const tile = scene.platformsLayer.putTileAtWorldXY(6, worldPoint.x, worldPoint.y);
                tile.setCollision(true);
                createPlatforms++;
            }
        }
    }
}

export function getCreatePlatformsMax() {
    return createPlatformsMax;
}

export function getCreatePlatforms() {
    return createPlatforms;
}