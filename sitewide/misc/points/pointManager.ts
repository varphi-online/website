import {
    addApp,
    appInitEvent,
    fetchApp,
} from "../../apps/applicationManager.js";
import pointAppLoader, { open } from "./pointApp.js";

// /**
//  * Applies a bonus to the current save data and updates the flags.
//  * @param bonus - The bonus values to be added to the current save data
//  * @param flagKey - The key to be used in the flags object
//  * @param repeatable - Whether the bonus can be triggered multiple times
//  */
// export function triggerBonus(
//     bonus: Omit<saveData, "milestone" | "time">,
//     flagKey: string,
//     repeatable: boolean
// ) {
//     flags[flagKey] = !repeatable;
//     for (const key in window.pointManager.currentSave) {
//         if (
//             key in bonus &&
//             key in window.pointManager.currentSave &&
//             key !== "milestone" &&
//             key !== "time"
//         ) {
//             window.pointManager.currentSave[key as keyof typeof bonus] +=
//                 bonus[key as keyof typeof bonus];
//         }
//     }
//     pointChecker(window.pointManager.currentSave);
// }

//-------------------------------------------------

interface milestone {
    req: number;
    bonus: number;
    multAdd: number;
    incrAdd: number;
}

interface saveData {
    points: number;
    time: number;
    multiplier: number;
    increment: number;
    milestone: number;
}

interface flagData {
    [key: string]: boolean;
}

interface PointState {
    currentSave: saveData;
    flags: flagData;
}

function milestone(
    req: number,
    bonus: number,
    multAdd: number,
    incrAdd: number
): milestone {
    return { req, bonus, multAdd, incrAdd };
}

/**
 * `[index].req` is the time in seconds needed to get a milestone,
 *
 * `[index ].bonus` is the bonus points to be added upon achieving for that milestone,
 *
 * `[index].multAdd` is the multiplier to be added upon achieving for that milestone.
 */
const milestoneBonuses: milestone[] = [
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
    private state: PointState = {
        currentSave: defaultSave,
        flags: {},
    };
    private subscribers: Set<(state: Readonly<PointState>) => void> = new Set();
    private milestoneSubscribers: Set<{
        callback: (milestoneIndex: number, triggered: boolean) => boolean;
        triggered: boolean;
    }> = new Set();
    private updateIntervalId: ReturnType<typeof setInterval> | null = null;
    private lastUpdateTime: number = 0;

    constructor() {
        this.load();
        window.addEventListener("beforeunload", () => {
            this.saveToLocalStorage();
        });
    }

    start() {
        if (this.updateIntervalId !== null) return;
        console.log("Starting point loop...");
        this.lastUpdateTime = performance.now();
        // Update every 5s using delta time
        this.updateIntervalId = setInterval(this.updateLoop.bind(this), 50);
    }

    public getState(): Readonly<PointState> {
        return Object.freeze({ ...this.state });
    }

    private updateLoop() {
        const now = performance.now();
        const deltaTime = now - this.lastUpdateTime;
        if (deltaTime <= 0) return;
        let stateChanged = false;

        const pointsEarned =
            (this.state.currentSave.multiplier *
                this.state.currentSave.increment *
                deltaTime) /
            1000;

        if (pointsEarned > 0) {
            this.state.currentSave.points += pointsEarned;
            stateChanged = true;
        }

        this.state.currentSave.time += deltaTime / 1000;

        const nextMilestone =
            milestoneBonuses[this.state.currentSave.milestone];
        if (nextMilestone && this.state.currentSave.time + 1 >= nextMilestone.req) {
            console.log(
                `Milestone ${this.state.currentSave.milestone + 1} reached!`
            );
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

    public subscribePointState(
        callback: (state: Readonly<PointState>) => void
    ): () => void {
        this.subscribers.add(callback);
        callback(this.state); // Immediately notify with current state
        return () => this.subscribers.delete(callback); // Return an unsubscribe function
    }

    public subscribeToMilestones(
        callback: (milestoneIndex: number, triggered: boolean) => boolean,
        triggerOnLoad: boolean
    ): () => void {
        let entry = { callback, triggered: false };
        this.milestoneSubscribers.add(entry);
        callback(this.state.currentSave.milestone, triggerOnLoad);
        return () => this.milestoneSubscribers.delete(entry);
    }

    private encode(data: string): string {
        return data;
    }

    private decode(data: string): string {
        return data;
    }

    private saveToLocalStorage() {
        try {
            localStorage.setItem(
                "saveData",
                this.encode(JSON.stringify(this.state))
            );
            console.log("Save data persisted.");
        } catch (error) {
            console.error("Failed to persist save data:", error);
        }
    }

    private load() {
        const savedState = localStorage.getItem("saveData");
        if (savedState) {
            try {
                const parsedState: PointState = JSON.parse(
                    this.decode(savedState)
                );
                if (
                    typeof parsedState.currentSave.points === "number" &&
                    typeof parsedState.currentSave.multiplier === "number"
                ) {
                    this.state = {
                        ...{ currentSave: defaultSave, flags: {} },
                        ...parsedState,
                    }; // Merge defaults with loaded
                } else {
                    console.warn(
                        "Invalid saved state format found, using defaults."
                    );
                    this.state = {
                        currentSave: structuredClone(defaultSave),
                        flags: {},
                    };
                }
            } catch (error) {
                console.error(
                    "Failed to parse/load saved data:",
                    error,
                    "Using defaults."
                );
                this.state = {
                    currentSave: structuredClone(defaultSave),
                    flags: {},
                };
            }
        }
    }

    public notifySubscribers() {
        const stateToNotify = Object.freeze({ ...this.state });
        this.subscribers.forEach((callback) => callback(stateToNotify));
    }

    public notifyMilestoneSubscribers(milestoneIndex: number) {
        this.milestoneSubscribers.forEach((entry) => {
            entry.triggered = entry.callback(milestoneIndex, entry.triggered);
        });
    }

    public resetState() {
        console.log("resetting state");
        this.state.currentSave = structuredClone(defaultSave);
        window.location.reload();
    }
}

export const pointManager = new PointManager();

document.addEventListener(appInitEvent.type, () => {
    let clock = document.getElementById("pointClock") as
        | HTMLSpanElement
        | HTMLLinkElement;
    pointAppLoader(clock);
});
