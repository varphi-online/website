export class Application {
    public appDiv: HTMLDivElement;
    public titleBar: HTMLDivElement;
    public title: HTMLParagraphElement;
    public surface: HTMLDivElement;
    public appWindow: HTMLDivElement;
    public titleBarInteractiveArea: HTMLDivElement;
    public externButton: HTMLButtonElement;
    public minimizeButton: HTMLButtonElement;
    public maximizeButton: HTMLButtonElement;
    public closeButton: HTMLButtonElement;
    public applicationID: string;
    public taskbarIcon: HTMLInputElement;
    public taskbarLabel: HTMLLabelElement;
    public shadow: Shadow;
    public zList: Application[];

    constructor(
        element: HTMLDivElement,
        windowTemplate: HTMLDivElement,
        taskbar: HTMLDivElement,
        allowMultiple?: boolean
    ) {
        this.appDiv = element;
        this.zList = [];
        let windowTemplateInstance = windowTemplate.cloneNode(
            true
        ) as HTMLDivElement;

        // Get some unique ID from the window header, to be used in all other places
        this.applicationID = (<string>this.appDiv.dataset.window_title).replace(
            /\s+/g,
            "_"
        ) + String(Math.floor(Math.random() * 1000)); // Almost garuntees uniqueness

        // "Singleton" enforcement
        if (
            !allowMultiple &&
            window.appManager.apps.some(
                (a) => a.applicationID === this.applicationID
            )
        ) {
            console.warn(
                // Use warn instead of error for less noise
                `Application with ID: ${this.applicationID} already exists and multiple are not allowed. Aborting creation.`
            );
            throw new Error();
        }

        this.appDiv.id = this.applicationID + "-window";

        // Window template parts we want to change.
        [
            this.title,
            this.surface,
            this.appWindow,
            this.titleBarInteractiveArea,
            this.titleBar,
        ] = [
            windowTemplateInstance.getElementsByClassName("windowTitle")[0],
            windowTemplateInstance.getElementsByClassName("windowSurface")[0],
            windowTemplateInstance.getElementsByClassName("window")[0],
            windowTemplateInstance.getElementsByClassName(
                "windowTitlebarInteractableArea"
            )[0],
            windowTemplateInstance.getElementsByClassName("windowTitlebar")[0],
        ] as [
                HTMLParagraphElement,
                HTMLDivElement,
                HTMLDivElement,
                HTMLDivElement,
                HTMLDivElement
            ];

        [
            this.minimizeButton,
            this.maximizeButton,
            this.closeButton,
            this.externButton,
        ] = [
            this.titleBarInteractiveArea.getElementsByClassName(
                "windowMinimize"
            )[0],
            this.titleBarInteractiveArea.getElementsByClassName(
                "windowMaximize"
            )[0],
            this.titleBarInteractiveArea.getElementsByClassName(
                "windowClose"
            )[0],
            this.titleBarInteractiveArea.getElementsByClassName(
                "windowExtern"
            )[0],
        ] as [
                HTMLButtonElement,
                HTMLButtonElement,
                HTMLButtonElement,
                HTMLButtonElement
            ];

        // Store contained html for usage later.
        this.surface.innerHTML = this.appDiv.innerHTML;
        this.appDiv.innerHTML = "";
        this.appDiv.appendChild(this.appWindow);
        this.title.innerHTML = <string>this.appDiv.dataset.window_title;

        // Remove the close window button if the applet does not explicitly state
        // it should be closable.
        if (!this.appDiv.hasAttribute("data-closable")) {
            this.closeButton.style.display = "none";
        }
        // Remove maximize window button if maximizing is not possible
        if (!this.appDiv.hasAttribute("data-fullScreenCapable")) {
            this.maximizeButton.style.display = "none";
        } else {
            // Change where the width and height of the app are stored so we can
            // maximize and still look good
            this.surface.style.width = this.appDiv.style.width;
            this.surface.style.height = this.appDiv.style.height;
            this.appDiv.style.width = "fit-content";
            this.appDiv.style.height = "fit-content";
        }

        if (!this.appDiv.hasAttribute("data-link")) {
            this.externButton.style.display = "none";
        }

        [this.taskbarIcon, this.taskbarLabel] = this.makeForTaskbar();
        this.shadow = new Shadow(this);

        this.addAppWindowEvents();
        this.addButtonEvents();
        let appIconDiv: HTMLDivElement = <HTMLDivElement>(
            taskbar.querySelector("#appIcons")
        );
        appIconDiv.appendChild(this.taskbarIcon);
        appIconDiv.appendChild(this.taskbarLabel);
    }

    makeForTaskbar(): [HTMLInputElement, HTMLLabelElement] {
        // Create elements of a taskbar icon
        let [iconCheckbox, iconLabel, iconImage, iconText] = [
            "input",
            "label",
            "img",
            "p",
        ].map((val) => document.createElement(val)) as [
                HTMLInputElement,
                HTMLLabelElement,
                HTMLImageElement,
                HTMLParagraphElement
            ];

        Object.assign(iconCheckbox, {
            className: "taskbarIcon win95",
            type: "checkbox",
            id: this.applicationID + "-taskbarEntryCheckbox",
        });

        // Procedurally create and populate the label elements
        iconLabel.htmlFor = iconCheckbox.id;
        iconLabel.className = "win95";

        if (this.appDiv.dataset.icon) {
            let src = <string>this.appDiv.dataset.icon;
            iconImage.src = src.includes("/")
                ? src
                : "/sitewide/images/icons/" + src;
        } else {
            ("/sitewide/images/icons/Program.ico");
        }
        iconImage.alt = "";
        iconText.innerHTML = <string>this.appDiv.dataset.icon_name;
        iconLabel.appendChild(iconImage);
        iconLabel.appendChild(iconText);

        if (this.appDiv.style.display !== "none") {
            iconCheckbox.checked = true;
        }

        // On click, hide the window if entering an unchecked state.
        iconLabel.onclick = () => {
            if (iconCheckbox.checked) {
                this.appDiv.style.display = "none";
            } else {
                this.appDiv.style.display = "block";
                this.moveToFront();
            }
        };

        return [iconCheckbox, iconLabel];
    }

    addButtonEvents() {
        const self = this;

        // Function to prevent double-firing on mobile devices
        const handleButtonAction = (target: HTMLElement) => {
            switch (target) {
                case self.minimizeButton:
                    self.taskbarIcon.checked = false;
                    self.appDiv.style.display = "none";
                    break;
                case self.maximizeButton:
                    self.surface.classList.toggle("maximizedSurface");
                    self.titleBar.classList.toggle("maximizedTitlebar");
                    self.appDiv.classList.toggle("maximizedWindow");
                    if (
                        !self.titleBar.classList.contains("maximizedTitlebar")
                    ) {
                        self.maximizeButton.innerHTML = "⧠";
                    } else {
                        self.maximizeButton.innerHTML = "⧉";
                    }
                    break;
                case self.closeButton:
                    this.delete();
                    break;
                case self.externButton:
                    window
                        .open(<string>this.appDiv.dataset.link, "_blank")
                        ?.focus();
                default:
                    self.moveToFront();
                    break;
            }
        };

        // Add touch events for buttons
        [
            this.minimizeButton,
            this.maximizeButton,
            this.closeButton,
            this.externButton,
        ].forEach((button) => {
            if (button) {
                button.addEventListener("touchstart", (e: TouchEvent) => {
                    e.preventDefault();
                });

                button.addEventListener("touchend", (e: TouchEvent) => {
                    e.preventDefault();
                    handleButtonAction(e.target as HTMLElement);
                });

                button.addEventListener("click", (e: MouseEvent) => {
                    if (
                        !(
                            "ontouchstart" in window ||
                            navigator.maxTouchPoints > 0
                        )
                    ) {
                        handleButtonAction(e.target as HTMLElement);
                    }
                });
            }
        });
    }

    delete() {
        if (this.appDiv && this.appDiv.parentNode) {
            this.appDiv.remove();
        }
        if (this.taskbarIcon && this.taskbarIcon.parentNode) {
            this.taskbarIcon.remove();
        }
        if (this.taskbarLabel && this.taskbarLabel.parentNode) {
            this.taskbarLabel.remove();
        }
        if (
            this.shadow &&
            this.shadow.object &&
            this.shadow.object.parentNode
        ) {
            this.shadow.object.remove();
        }

        if (window.appManager) {
            const appIndex = window.appManager.apps.indexOf(this);
            if (appIndex > -1) {
                window.appManager.apps.splice(appIndex, 1);
            }

            const zIndex = window.appManager.zList.indexOf(this);
            if (zIndex > -1) {
                window.appManager.zList.splice(zIndex, 1);
            }
        }
    }

    addAppWindowEvents() {
        // Using event delegation
        let self = this;

        if (this.appDiv.hasAttribute("data-movable")) {
            this.appDiv.style.position = "absolute";

            // mobile functionality
            if (!("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
                this.titleBar.addEventListener("mousedown", (mouseEvent) => {
                    self.shadow.mouseDown(mouseEvent);
                });
                window.addEventListener("mousemove", (mouseEvent) => {
                    if (self.shadow.mouseDownOnApp) {
                        mouseEvent.preventDefault();
                        self.shadow.mouseMove(mouseEvent);
                    }
                });
                window.addEventListener("mouseup", async () => {
                    if (self.shadow.mouseDownOnApp) {
                        self.moveToFront();
                        self.shadow.mouseUp();
                    }
                });
            } else {
                let initialTouchPos: { x: number; y: number };
                let initialWindowPos: { x: number; y: number };

                this.titleBar.addEventListener(
                    "touchstart",
                    (e: TouchEvent) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        initialTouchPos = {
                            x: touch.clientX,
                            y: touch.clientY,
                        };
                        initialWindowPos = {
                            x: this.appDiv.offsetLeft,
                            y: this.appDiv.offsetTop,
                        };
                        self.moveToFront();
                    }
                );

                this.titleBar.addEventListener("touchmove", (e: TouchEvent) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const deltaX = touch.clientX - initialTouchPos.x;
                    const deltaY = touch.clientY - initialTouchPos.y;

                    const newTop =
                        ((initialWindowPos.y + deltaY) / window.innerHeight) *
                        100;
                    const newLeft =
                        ((initialWindowPos.x + deltaX) / window.innerWidth) *
                        100;

                    this.appDiv.style.top = `${newTop}vh`;
                    this.appDiv.style.left = `${newLeft}vw`;
                });

                this.titleBar.addEventListener("touchend", () => { });
            }
        }
    }

    moveToFront() {
        const highestZValue = 950;
        this.zList.unshift(this.zList.splice(this.zList.indexOf(this), 1)[0]);
        let currentZ = highestZValue;
        this.zList.forEach((app) => {
            app.appDiv.style.zIndex = String(currentZ);
            currentZ -= 1;
        });
    }
}

class Shadow {
    /* This class is used in the dragging of windows, visually it is the grey
    box that indicates to the user where the window will be placed after a drag
    and drop, but it also contains info about styles and movement.
    */
    public object: HTMLDivElement;
    public initialDivPosition: [number, number];
    public initialMousePosition: [number, number];
    public mouseDownOnApp: boolean;
    public attachedApp: Application;

    constructor(app: Application) {
        this.attachedApp = app;
        this.object = document.createElement("div");
        this.object.className = "windowShadow";

        Object.assign(this.object.style, {
            display: "none",
            position: "absolute",
            zIndex: "999",
        });

        app.appDiv.insertAdjacentElement("afterend", this.object);

        //element.style.position = "absolute";
        this.initialDivPosition = [0, 0];
        this.initialMousePosition = [0, 0];
        this.mouseDownOnApp = false;

        app.titleBar.style.cursor = "pointer";
    }

    mouseDown(event: MouseEvent) {
        this.object.style.width =
            String(
                parseInt(getComputedStyle(this.attachedApp.appDiv).width, 10)
            ) + "px";
        this.object.style.height =
            String(
                parseInt(getComputedStyle(this.attachedApp.appDiv).height, 10)
            ) + "px";
        this.initialDivPosition = [
            parseInt(getComputedStyle(this.attachedApp.appDiv).top, 10),
            parseInt(getComputedStyle(this.attachedApp.appDiv).left, 10),
        ];
        this.initialMousePosition = [event.clientX, event.clientY];
        this.mouseDownOnApp = true;
    }

    mouseMove(event: MouseEvent) {
        this.object.style.display = "inline-block";

        // Move the shadow object according to the mouse in terms of viewHeight
        // and viewWidth
        this.object.style.top =
            String(
                (100 *
                    (this.initialDivPosition[0] -
                        this.initialMousePosition[1] +
                        event.clientY)) /
                window.innerHeight
            ) + "vh";

        this.object.style.left =
            String(
                (100 *
                    (this.initialDivPosition[1] -
                        this.initialMousePosition[0] +
                        event.clientX)) /
                window.innerWidth
            ) + "vw";
    }

    async mouseUp() {
        this.object.style.display = "none";
        this.mouseDownOnApp = false;

        // Delay the move by 100ms to add some authentic '95 crunch
        await new Promise((resolve) => setTimeout(resolve, 100));

        this.initialDivPosition = [
            parseInt(getComputedStyle(this.object).top, 10),
            parseInt(getComputedStyle(this.object).left, 10),
        ];

        this.attachedApp.appDiv.style.top = this.object.style.top;
        this.attachedApp.appDiv.style.left = this.object.style.left;
    }
}

export const appInitEvent = new Event("applicationsInitialized");

export function initializeApplications(
    windowTemplate: HTMLDivElement,
    taskbar: HTMLDivElement
) {
    /*
        Here we loop through each application element to format it into a window
        we define
        */

    // Create some primitives that are replicated in every window.
    let appDefinitions = Array.from(
        document.getElementsByClassName("app")
    ) as Array<HTMLDivElement>;

    let apps: Application[] = [];
    let zList: Application[] = [];

    window.appManager = {
        apps,
        zList,
        windowTemplate,
        taskbar,
        instantiateApp,
    };

    appDefinitions.forEach((element) => {
        let app: Application = new Application(
            element,
            windowTemplate,
            taskbar
        );
        apps.unshift(app);
        zList.unshift(app);
        app.zList = zList;
    });

    initSelector();

    document.dispatchEvent(appInitEvent);
    console.log(window.appManager);
}

export function addApp(app: Application, allowMultiple?: boolean) {
    if (
        !allowMultiple &&
        window.appManager.apps.some(
            (a) => a.applicationID === app.applicationID
        )
    )
        throw new Error("App with associated ID already exists");
    window.appManager.apps.unshift(app);
    window.appManager.zList.unshift(app);
    app.zList = window.appManager.zList;
}

export async function fetchApp(
    url: string,
    appId: string,
    allowMultiple?: boolean
): Promise<Application> {
    const response = await fetch(url);
    const parser = new DOMParser();
    if (response.ok) {
        const parsedDoc = parser.parseFromString(
            await response.text(),
            "text/html"
        );
        const appElement = parsedDoc.getElementById(appId);
        if (appElement === null) throw new Error("app id does not exist");
        document.body.appendChild(appElement);
        return new Application(
            appElement as HTMLDivElement,
            window.appManager.windowTemplate,
            window.appManager.taskbar
        );
    } else {
        throw new Error("failed to fetch");
    }
}

export async function fetchAppFromDocument(
    parsedDoc: Document,
    appId: string,
    allowMultiple?: boolean
): Promise<Application> {
    const appElement = parsedDoc.getElementById(appId);
    if (appElement === null) throw new Error("app id does not exist");
    document.body.appendChild(appElement);
    return new Application(
        appElement as HTMLDivElement,
        window.appManager.windowTemplate,
        window.appManager.taskbar
    );
}

export function webpageAsApp(
    link: string,
    style?: string,
    windowTitle?: string,
    icon?: string,
    iconTitle?: string
) {
    let div = document.createElement("div");
    let embed = document.createElement("iframe");
    embed.src = link;
    embed.style.cssText = "height: 100%; width: 100%";
    div.appendChild(embed);
    div.className = "app";
    div.style.cssText = style || "";
    div.dataset.window_title = windowTitle || "Webpage";
    div.dataset.icon_name = iconTitle || "Web App";
    div.dataset.icon = icon || "";
    div.dataset.link = link;
    div.setAttribute("data-movable", "");
    div.setAttribute("data-fullScreenCapable", "");
    div.setAttribute("data-closable", "");
    document.body.appendChild(div);
    let app = new Application(
        div,
        window.appManager.windowTemplate,
        window.appManager.taskbar
    );
    addApp(app);
}

/**
 * Single object wrapper for creating web applications as apps.
 */
export function instantiateApp({
    link,
    style,
    windowTitle,
    icon,
    iconTitle,
}: {
    link: string;
    style?: string;
    windowTitle?: string;
    icon?: string;
    iconTitle?: string;
}) {
    webpageAsApp(link, style, windowTitle, icon, iconTitle);
}

declare global {
    interface Window {
        appManager: {
            apps: Application[];
            zList: Application[];
            windowTemplate: HTMLDivElement;
            taskbar: HTMLDivElement;
            instantiateApp: typeof instantiateApp;
        };

        desktopSelected: typeof selected
    }
}


//------ Desktop Like Selection Handling --------//

/**
 * Data object of select in px
 */
const selectData: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} = { startX: 0, startY: 0, endX: 0, endY: 0 };

export const desktopSelect = new CustomEvent("desktopSelect", {
    detail: selectData,
});

export function selected(
    x: number,
    y: number,
    selectorData?: typeof selectData
): boolean {
    if (!selectorData) selectorData = selectData;
    const minX = Math.min(selectorData.startX, selectorData.endX);
    const maxX = Math.max(selectorData.startX, selectorData.endX);
    const minY = Math.min(selectorData.startY, selectorData.endY);
    const maxY = Math.max(selectorData.startY, selectorData.endY);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

window.desktopSelected = selected;

function initSelector() {
    const selectorDiv = document.createElement("div");
    document.body.appendChild(selectorDiv);
    selectorDiv.id = "selector";
    selectorDiv.className = "windowShadow";

    Object.assign(selectorDiv.style, {
        display: "none",
        position: "absolute",
        zIndex: "500",
        border: "2px dashed rgba(90,90,90,0.9)",
        background: "rgba(90,90,90,0.1)",
        boxSizing: "border-box",
    });

    document.addEventListener("mousedown", (event: MouseEvent) => {
        if (event.target != document.documentElement) return;
        event.preventDefault();

        selectData.startX = event.clientX;
        selectData.startY = event.clientY;
        selectData.endX = event.clientX;
        selectData.endY = event.clientY;
        document.dispatchEvent(desktopSelect);

        selectorDiv.style.display = "block";

        selectorDiv.style.left = selectData.startX + "px";
        selectorDiv.style.top = selectData.startY + "px";
        selectorDiv.style.width = "0px";
        selectorDiv.style.height = "0px";
    });

    document.addEventListener("mousemove", (event: MouseEvent) => {
        if (selectorDiv.style.display != "block") return;

        selectData.endX = event.clientX;
        selectData.endY = event.clientY;
        document.dispatchEvent(desktopSelect);

        const newLeft = Math.min(selectData.startX, selectData.endX);
        const newTop = Math.min(selectData.startY, selectData.endY);

        const newWidth = Math.abs(selectData.endX - selectData.startX);
        const newHeight = Math.abs(selectData.endY - selectData.startY);

        selectorDiv.style.left = newLeft + "px";
        selectorDiv.style.top = newTop + "px";
        selectorDiv.style.width = newWidth + "px";
        selectorDiv.style.height = newHeight + "px";
    });

    document.addEventListener("mouseup", () => {
        selectorDiv.style.display = "none";
    });
}