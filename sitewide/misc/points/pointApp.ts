import { addApp, fetchApp } from "../../apps/applicationManager.js";
import { pointManager } from "./pointManager.js";

/**
 * This is the true entrypoint for pointApp, which sets up some subscriptions to ensure
 * the point app only loads when it should.
 *
 * @param clock - The clock span element to show points initially
 */
export default async function pointAppLoader(
    clock: HTMLSpanElement | HTMLLinkElement
) {
    pointManager.subscribeToMilestones((milestone, triggered) => {
        if (milestone >= 1 && !triggered) {
            open();
            return true;
        }
        return false;
    }, false);

    pointManager.subscribePointState((state) => {
        clock
            ? (clock.innerHTML = `${state.currentSave.points
                  .toFixed(2)
                  .replace(".", ":")}`)
            : null;
    });

    pointManager.subscribeToMilestones((milestone, trigger) => {
        if (milestone >= 1 && !trigger) {
            const button = document.createElement("a"); // Or <button>
            button.id = clock.id; // Assign the same ID to the new element
            button.onclick = (e) => {
                e.preventDefault(); // Prevent default anchor behavior
                open();
            };
            button.innerHTML = clock.innerHTML;
            button.style.setProperty("text-decoration", "underline");
            button.style.setProperty("cursor", "pointer");
            clock?.replaceWith(button);
            clock = button;
            return true;
        }
        return false;
    }, false);
}

/**
 * Opens app and populates to DOM
 */
export function open() {
    fetchApp("/sitewide/misc/points/pointApp.html", "pointApp")
        .then((app) => {
            addApp(app);
            const resetButton = document.getElementById("pointReset");
            if (resetButton) {
                resetButton.onclick =
                    pointManager.resetState.bind(pointManager);
            }
            pointAppInit();
        })
        .catch((e) => {});
}

/**
 * This function only runs after a valid instance of pointApp has been populated into the dom, ensuring that the
 * elements requested by any ID's are available/exist
 */
function pointAppInit() {
    startCanvas();
}

function startCanvas() {
    const voidCanvas = document.getElementById(
        "voidCanvas"
    ) as HTMLCanvasElement;
    const ctx = voidCanvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.font = "50px serif";
    ctx.arc(0, 0, 120, 0, Math.PI);
    ctx.stroke();
    pointManager.subscribePointState((state) => {
        // TODO: setup main rendering loop (conditional to if the canvas is visible)
        ctx.reset()
        ctx?.strokeText(state.currentSave.points.toFixed(2), 20, 20)
        
    });
}
