"use strict";
var cube = (document.getElementsByClassName("cube")[0]);
let container = (document.getElementsByClassName("main")[0]);
container.style.transform = `translate(0%,0%);`;
let prim = {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    containerWidth: parseInt(getComputedStyle(container).width, 10),
    containerHeight: parseInt(getComputedStyle(container).height, 10),
};
//
let pos = [
    parseInt(getComputedStyle(container).left, 10) - prim.containerWidth / 2,
    parseInt(getComputedStyle(container).top, 10) - prim.containerHeight / 2,
];
let dir = [1, 1];
var rotate = [0, 0, 0];
let speed = 5;
function play() {
    cube.style.transform = `translateZ(0px) rotateY(${rotate[0]}deg) rotateX(${rotate[1]}deg) rotateZ(${rotate[2]}deg)`;
    container.style.transform = `translate(0%,0%)`;
    if (pos[0] + prim.containerWidth > prim.windowWidth || pos[0] <= 0) {
        dir[0] = dir[0] * -1;
    }
    if (pos[1] + prim.containerHeight > prim.windowHeight || pos[1] <= 0) {
        dir[1] = dir[1] * -1;
    }
    pos = [pos[0] + dir[0] * speed, pos[1] + dir[1] * speed];
    container.style.left = `${pos[0]}px`;
    container.style.top = `${pos[1]}px`;
    rotate[0] = rotate[0] + 0.6 * 2;
    rotate[1] = rotate[1] + 0.4 * 2;
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function pause() {
    await sleep(1000);
    setInterval(play, 100);
}
pause();
window.addEventListener("resize", () => {
    prim.windowWidth = window.innerWidth;
    prim.windowHeight = window.innerHeight;
    if (pos[0] + prim.containerWidth > prim.windowWidth) {
        pos[0] = prim.windowWidth - prim.containerWidth - 10;
    }
    if (pos[1] + prim.containerHeight > prim.windowHeight) {
        pos[1] = prim.windowHeight - prim.containerHeight - 10;
    }
});
