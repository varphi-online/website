export function initializeApplications(windowTemplate, taskbar) {
    /*
      Here we loop through each application element to format it into a window
      we define
      */
    // Create some primitives that are replicated in every window.
    let title = (windowTemplate.getElementsByClassName("windowTitle")[0]);
    let applications = Array.from(document.getElementsByClassName("app"));
    applications.forEach((element) => {
        initializeApplication(element, windowTemplate, taskbar);
    });
}
export function initializeApplication(element, windowTemplate, taskbar) {
    let windowTemplateInstance = (windowTemplate.cloneNode(true));
    // Get some unique ID from the window header, to be used in all other places
    let applicationID = element.dataset.window_title.replace(/\s+/g, "_");
    element.id = applicationID + "-window";
    // Window template parts we want to change.
    let title = (windowTemplateInstance.getElementsByClassName("windowTitle")[0]);
    let surface = (windowTemplateInstance.getElementsByClassName("windowSurface")[0]);
    let window = (windowTemplateInstance.getElementsByClassName("window")[0]);
    // Store contained html for usage later.
    const windowContent = element.innerHTML;
    element.innerHTML = "";
    element.appendChild(window);
    title.innerHTML = element.dataset.window_title;
    surface.innerHTML = windowContent;
    // Remove the close window button if the applet does not explicitly state
    // it should be closable.
    if (element.dataset.closable?.toLowerCase() === "false") {
        let close = (element.getElementsByClassName("windowMaximize")[0]);
        (element
            .getElementsByClassName("windowTitlebarInteractableArea")[0]
            .removeChild(close));
    }
    if (element.dataset.state?.toLowerCase() === "dynamic") {
        makeDraggable(element);
    }
    // Create a taskbar button that is linked.
    let newTaskbarIcon = document.createElement("input");
    newTaskbarIcon.className = "taskbarIcon win95";
    newTaskbarIcon.type = "checkbox";
    // Procedurally create and populate the label elements
    newTaskbarIcon.id = applicationID + "-taskbarEntryCheckbox";
    let newTaskbarIconLabel = document.createElement("label");
    newTaskbarIconLabel.htmlFor = newTaskbarIcon.id;
    newTaskbarIconLabel.className = "win95";
    let taskbarIconImage = document.createElement("img");
    taskbarIconImage.src =
        "/sitewide/images/icons/" + element.dataset.icon;
    let taskbarIconText = document.createElement("p");
    taskbarIconText.innerHTML = element.dataset.icon_name;
    newTaskbarIconLabel.appendChild(taskbarIconImage);
    newTaskbarIconLabel.appendChild(taskbarIconText);
    if (element.style.display !== "none") {
        newTaskbarIcon.checked = true;
    }
    // On minimize, the window should hide and uncheck the button
    element
        .getElementsByClassName("windowMinimize")[0]
        .addEventListener("click", () => {
        newTaskbarIcon.checked = false;
        element.style.display = "none";
    });
    // On click, hide the window if entering an unchecked state.
    newTaskbarIconLabel.onclick = () => {
        if (newTaskbarIcon.checked) {
            element.style.display = "none";
        }
        else {
            element.style.display = "block";
        }
    };
    taskbar.appendChild(newTaskbarIcon);
    taskbar.appendChild(newTaskbarIconLabel);
}
function makeDraggable(element) {
    let shadow = document.createElement('div');
    shadow.className = "movingWindow";
    shadow.style.display = "none";
    shadow.style.position = "absolute";
    element.insertAdjacentElement("afterend", shadow);
    element.style.position = "absolute";
    let initialDivPosition = [
        0, 0
    ];
    let initialMousePosition = [0, 0];
    let mouseDownOnApp = false;
    let titlebar = (element.getElementsByClassName("windowTitleArea")[0]);
    titlebar.style.cursor = "pointer";
    titlebar.addEventListener("mousedown", (mouseEvent) => {
        mouseEvent.preventDefault();
        shadow.style.width = String(parseInt(getComputedStyle(element).width, 10)) + 'px';
        shadow.style.height = String(parseInt(getComputedStyle(element).height, 10)) + 'px';
        initialDivPosition = [
            parseInt(getComputedStyle(element).top, 10),
            parseInt(getComputedStyle(element).left, 10),
        ];
        initialMousePosition = [mouseEvent.clientX, mouseEvent.clientY];
        mouseDownOnApp = true;
    });
    window.addEventListener('mousemove', (mouseEvent) => {
        if (mouseDownOnApp) {
            mouseEvent.preventDefault();
            shadow.style.display = "inline-block";
            shadow.style.top = String(initialDivPosition[0] - initialMousePosition[1] + mouseEvent.clientY) + "px";
            shadow.style.left = String(initialDivPosition[1] - initialMousePosition[0] + mouseEvent.clientX) + "px";
        }
    });
    window.addEventListener('mouseup', async (mouseEvent) => {
        mouseEvent.preventDefault();
        shadow.style.display = "none";
        mouseDownOnApp = false;
        await new Promise(resolve => setTimeout(resolve, 100));
        initialDivPosition = [
            parseInt(getComputedStyle(shadow).top, 10),
            parseInt(getComputedStyle(shadow).left, 10),
        ];
        element.style.top = String(initialDivPosition[0]) + "px";
        element.style.left = String(initialDivPosition[1]) + "px";
    });
}
// TODO STATIC MOVEMENT
