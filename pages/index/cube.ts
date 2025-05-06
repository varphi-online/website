import {
    desktopSelect,
    selected,
} from "../../sitewide/apps/applicationManager.js";

var cube: HTMLDivElement = <HTMLDivElement>(
    document.getElementsByClassName("cube")[0]
);
let container: HTMLDivElement = <HTMLDivElement>(
    document.getElementsByClassName("main")[0]
);
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

let dir = [0, 0];

let rotSpeed = [0, 0];

let impulsed: boolean = false;

function clamp(num: number, lower: number, upper: number) {
    return Math.min(Math.max(num, lower), upper);
}

const dirSpeedDiv = 7;
const rotSpeedDiv = 4;

let isItemCurrentlySelected = false;
const baseFilter = "url(#pixelate2)";
const selectedFilter = "url(#pixelate2) invert(1)";

document.addEventListener(desktopSelect.type, (e) => {
    const detail = (e as CustomEvent<typeof desktopSelect.detail>).detail;
    if (!detail) return; // Type guard
    const nowSelected = selected(
        pos[0] + prim.containerWidth / 2,
        pos[1] + prim.containerHeight / 2,
        detail
    );
    if (nowSelected && !isItemCurrentlySelected) {
        container.style.filter = selectedFilter;
        isItemCurrentlySelected = true;
        console.log("Item selected, applying filter:", selectedFilter);
    } else if (!nowSelected && isItemCurrentlySelected) {
        container.style.filter = baseFilter;
        isItemCurrentlySelected = false;
        console.log("Item deselected, applying filter:", baseFilter);
    }
});

cube.addEventListener("mousemove", (event) => {
	if (!impulsed) {
		// Only add speed if coming from the same direction
		if (Math.sign(dir[0]) == Math.sign(event.movementX)) {
			dir[0] += event.movementX / dirSpeedDiv;
			rotSpeed[0] += event.movementX / rotSpeedDiv;
		} else {
			dir[0] = event.movementX / dirSpeedDiv;
			rotSpeed[0] = event.movementX / rotSpeedDiv;
		}
		if (Math.sign(dir[1]) == Math.sign(event.movementY)) {
			dir[1] += event.movementY / dirSpeedDiv;
			rotSpeed[1] -= event.movementY / rotSpeedDiv;
		} else {
			dir[1] = event.movementY / dirSpeedDiv;
			rotSpeed[1] = -event.movementY / rotSpeedDiv;
		}
		dir = [clamp(dir[0], -20, 20), clamp(dir[1], -20, 20)];
		rotSpeed = [clamp(rotSpeed[0], -10, 10), clamp(rotSpeed[1], -10, 10)];
		impulsed = true;
	}
});

cube.addEventListener("mouseleave", () => {
    impulsed = false;
});

var rotate = [0, 0, 0];
let speed = 5;

function playMovement() {
    container.style.transform = `translate(0%,0%)`;
    if (pos[0] + prim.containerWidth > prim.windowWidth || pos[0] <= 0) {
        dir[0] = dir[0] * -1;
    }
    if (pos[1] + prim.containerHeight > prim.windowHeight || pos[1] <= 0) {
        dir[1] = dir[1] * -1;
    }
    pos = [pos[0] + (dir[0] / 2) * speed, pos[1] + (dir[1] / 2) * speed];
    container.style.left = `${pos[0]}px`;
    container.style.top = `${pos[1]}px`;
}

function playRotation() {
    cube.style.transform = `translateZ(calc(9vw - 146.3px)) rotateY(${rotate[0]}deg) rotateX(${rotate[1]}deg) rotateZ(${rotate[2]}deg)`;
    rotate[0] = rotate[0] + 0.6 * 2 + rotSpeed[0];
    rotate[1] = rotate[1] + 0.4 * 2 + rotSpeed[1];
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pause() {
    setInterval(playMovement, 100);
    setInterval(playRotation, 100);
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
