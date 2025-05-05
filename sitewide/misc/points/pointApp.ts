import { addApp, fetchApp } from "../../apps/applicationManager.js";
import { pointManager } from "./pointManager.js";

export default async function pointAppLoader(clock: HTMLSpanElement| HTMLLinkElement) {
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

    pointManager.subscribeToMilestones((milestone,trigger)=>{
		if (milestone >=1 && !trigger){
			const button = document.createElement("a"); // Or <button>
                button.id = clock.id; // Assign the same ID to the new element
                button.onclick = (e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    open(); 
                };
                button.innerHTML = clock.innerHTML;
				button.style.setProperty("text-decoration","underline")
				button.style.setProperty("cursor","pointer")
                clock?.replaceWith(button);
				clock = button;
				return true
		}
		return false
	},false)
}

export function open() {
        fetchApp("/sitewide/misc/points/pointApp.html", "pointApp").then(
            (app) => {
                addApp(app);
                const resetButton = document.getElementById("pointReset");
                if (resetButton) {
                    resetButton.onclick =
                        pointManager.resetState.bind(pointManager);
                }
            }
        ).catch(e=>{});
    
}
