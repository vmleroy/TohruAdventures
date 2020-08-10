const playerHp = 5;
var actualPlayerHp = 5;

var invincibilityTime;
var delta = 0;

var heartSprite = [];

export function decreaseHp() {
    if(actualPlayerHp > 0) {
        actualPlayerHp--;
        deleteHeartSprite();
    }
    else if(actualPlayerHp <= 0) {
        deleteHeartSprite();
        return true;
    }
}

export function increaseHp() {
    if(actualPlayerHp >= playerHp) {
        addHeartSprite()
        return false;
    }
    else if(actualPlayerHp > 0) {
        actualPlayerHp++;
        addHeartSprite()
    }
}

export function getHp() {
    return actualPlayerHp;
}

export function setHp(hp) {
    actualPlayerHp = hp;
}

export function getInvincibilityTime() {
    return invincibilityTime;
}

export function setInvincibilityTime(time) {
    invincibilityTime = time;
}

export function invincibilityCh(player) {
    if(delta == invincibilityTime) {
        delta = 0;
        player.invincibility = false;
    }
    delta++;
}




export function createHeartSprites(scene) {
    let x = 650
    for(let i=0;i<actualPlayerHp;i++) {
        heartSprite[i] = scene.add.image(x, 60, 'heart').setScrollFactor(0);
        x += 10;
    }
}

function addHeartSprite() {
    heartSprite[actualPlayerHp].visible = true;
}

function deleteHeartSprite() {
    heartSprite[actualPlayerHp].visible = false;
}