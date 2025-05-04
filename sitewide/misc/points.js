const defaultSave = { points: 0, time: 0, multiplier: 1, increment: 0.01, milestone: 0 };
const stringDefaultSave = JSON.stringify(defaultSave);
function milestone(req, bonus, multAdd, incrAdd) {
    return { req, bonus, multAdd, incrAdd };
}
/**
 * `[index].req` is the time in seconds needed to get the next milestone,
 *
 * `[index ].bonus` is the bonus points to be added upon achieving for that milestone,
 *
 * `[index].multAdd` is the multiplier to be added upon achieving for that milestone.
 */
const milestoneBonuses = [milestone(60, 60, 0, 0)];
function loadSave() {
    const saved = localStorage.getItem("saveData");
    let save = JSON.parse(saved || stringDefaultSave);
    if (!save || !save.points || !save.time || !save.multiplier || !save.increment || !save.milestone) {
        save = defaultSave;
    }
    if (save.time > 0) {
        save = pointChecker(save);
    }
    localStorage.setItem("saveData", JSON.stringify(save));
    return save;
}
function persistSave() {
    localStorage.setItem("saveData", JSON.stringify(currentSave));
}
window.addEventListener("beforeunload", persistSave);
let currentSave = defaultSave;
export default function startSaveLoop() {
    currentSave = loadSave();
    setInterval(() => {
        persistSave();
    }, 120000);
    return setInterval(() => {
        pointChecker(currentSave);
    }, 1000);
}
function pointChecker(save) {
    console.log(save);
    save.time += 1;
    save.points += save.multiplier * save.increment;
    if (save.time >= milestoneBonuses[save.milestone]?.req) {
        save.points += milestoneBonuses[save.milestone].bonus;
        save.multiplier += milestoneBonuses[save.milestone].multAdd;
        save.milestone++;
    }
    return save;
}
