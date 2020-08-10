var scoreGlobal = 0;
var scoreActualScene = 0;

export function addScore(score) {
    scoreActualScene += score;
}

export function removeScore(score) {
    scoreActualScene -= score;
}

export function resetScore() {
    scoreActualScene = 0;
}

export function changeScene() {
    scoreGlobal += scoreActualScene;
    scoreActualScene = 0;
}

export function getGlobalScore() {
    return scoreGlobal;
}

export function getActualSceneScore() {
    return scoreActualScene;
}