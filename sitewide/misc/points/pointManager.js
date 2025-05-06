import { appInitEvent, } from "../../apps/applicationManager.js";
import pointAppLoader from "./pointApp.js";
function milestone(req, bonus, multAdd, incrAdd) {
    return { req, bonus, multAdd, incrAdd };
}
/**
 * `[index].req` is the time in seconds needed to get a milestone,
 *
 * `[index ].bonus` is the bonus points to be added upon achieving for that milestone,
 *
 * `[index].multAdd` is the multiplier to be added upon achieving for that milestone.
 */
const milestoneBonuses = [
    milestone(60, 0.4, 0, 0), // set it to the next full point so the "clock" doesn't look weird
    milestone(120, 0, 0, 0), // clock looks weird now, incr milestone
];
export const defaultSave = {
    points: 0,
    time: 0,
    multiplier: 1,
    increment: 0.01,
    milestone: 0,
};
class PointManager {
    state = {
        currentSave: defaultSave,
        flags: {},
    };
    subscribers = new Set();
    milestoneSubscribers = new Set();
    updateIntervalId = null;
    lastUpdateTime = 0;
    constructor() {
        this.load();
        window.addEventListener("beforeunload", () => {
            this.saveToLocalStorage();
        });
    }
    start() {
        if (this.updateIntervalId !== null)
            return;
        console.log("Starting point loop...");
        this.lastUpdateTime = performance.now();
        // Update every 5s using delta time
        this.updateIntervalId = setInterval(this.updateLoop.bind(this), 50);
    }
    getState() {
        return Object.freeze({ ...this.state });
    }
    updateLoop() {
        const now = performance.now();
        const deltaTime = now - this.lastUpdateTime;
        if (deltaTime <= 0)
            return;
        let stateChanged = false;
        const pointsEarned = (this.state.currentSave.multiplier *
            this.state.currentSave.increment *
            deltaTime) /
            1000;
        if (pointsEarned > 0) {
            this.state.currentSave.points += pointsEarned;
            stateChanged = true;
        }
        this.state.currentSave.time += deltaTime / 1000;
        const nextMilestone = milestoneBonuses[this.state.currentSave.milestone];
        if (nextMilestone && this.state.currentSave.time + 1 >= nextMilestone.req) {
            console.log(`Milestone ${this.state.currentSave.milestone + 1} reached!`);
            this.state.currentSave.points += nextMilestone.bonus;
            this.state.currentSave.multiplier += nextMilestone.multAdd;
            this.state.currentSave.increment += nextMilestone.incrAdd; // Apply increment add if defined
            this.state.currentSave.milestone++;
            stateChanged = true;
            this.notifyMilestoneSubscribers(this.state.currentSave.milestone);
        }
        if (stateChanged) {
            this.notifySubscribers();
        }
        this.lastUpdateTime = now;
    }
    subscribePointState(callback) {
        this.subscribers.add(callback);
        callback(this.state); // Immediately notify with current state
        return () => this.subscribers.delete(callback); // Return an unsubscribe function
    }
    subscribeToMilestones(callback, triggerOnLoad) {
        let entry = { callback, triggered: false };
        this.milestoneSubscribers.add(entry);
        callback(this.state.currentSave.milestone, triggerOnLoad);
        return () => this.milestoneSubscribers.delete(entry);
    }
    encode(data) {
        return data;
    }
    decode(data) {
        return data;
    }
    saveToLocalStorage() {
        try {
            localStorage.setItem("saveData", this.encode(JSON.stringify(this.state)));
            console.log("Save data persisted.");
        }
        catch (error) {
            console.error("Failed to persist save data:", error);
        }
    }
    load() {
        const savedState = localStorage.getItem("saveData");
        if (savedState) {
            try {
                const parsedState = JSON.parse(this.decode(savedState));
                if (typeof parsedState.currentSave.points === "number" &&
                    typeof parsedState.currentSave.multiplier === "number") {
                    this.state = {
                        ...{ currentSave: defaultSave, flags: {} },
                        ...parsedState,
                    }; // Merge defaults with loaded
                }
                else {
                    console.warn("Invalid saved state format found, using defaults.");
                    this.state = {
                        currentSave: structuredClone(defaultSave),
                        flags: {},
                    };
                }
            }
            catch (error) {
                console.error("Failed to parse/load saved data:", error, "Using defaults.");
                this.state = {
                    currentSave: structuredClone(defaultSave),
                    flags: {},
                };
            }
        }
    }
    notifySubscribers() {
        const stateToNotify = Object.freeze({ ...this.state });
        this.subscribers.forEach((callback) => callback(stateToNotify));
    }
    notifyMilestoneSubscribers(milestoneIndex) {
        this.milestoneSubscribers.forEach((entry) => {
            entry.triggered = entry.callback(milestoneIndex, entry.triggered);
        });
    }
    resetState() {
        console.log("resetting state");
        this.state.currentSave = structuredClone(defaultSave);
        window.location.reload();
    }
}
export const pointManager = new PointManager();
document.addEventListener(appInitEvent.type, () => {
    let clock = document.getElementById("pointClock");
    pointAppLoader(clock);
});
