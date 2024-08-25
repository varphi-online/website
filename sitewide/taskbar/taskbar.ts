// This is just so I may instantiate a single taskbar div wherever I choose and
// still benefit from html linting :3

import { initializeApplications } from "../apps/applicationManager.js";

// Realistically, I should create two separate navigation layouts, for desktop
// and mobile, and decide to import a specific version based on detected os.
fetch("/sitewide/taskbar/taskbar.html").then(response=> response.text()).then(text=>{
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');


    // Grab taskbar for injection
    const taskbarDiv = <HTMLDivElement>doc.querySelector('#taskbar');
    document.body.appendChild(taskbarDiv);
    const musicPlayer = <HTMLDivElement>doc.querySelector('#musicPlayer');
    document.body.appendChild(musicPlayer);

    // Get stylesheets for different sub modules
    const taskbarCSS = document.createElement("link");
    taskbarCSS.href = "/sitewide/taskbar/taskbar.css";
    taskbarCSS.type = "text/css";
    taskbarCSS.rel = "stylesheet";
    document.head.appendChild(taskbarCSS);

    const applicationCSS = document.createElement("link");
    applicationCSS.href = "/sitewide/apps/application.css";
    applicationCSS.type = "text/css";
    applicationCSS.rel = "stylesheet";
    document.head.appendChild(applicationCSS);

    // Get various scripts
    const musicPlayerScript = document.createElement("script");
    musicPlayerScript.src = "/sitewide/apps/musicPlayer/musicPlayer.js";
    document.head.appendChild(musicPlayerScript);

    const clockScript = document.createElement("script");
    clockScript.src = "https://melonking.net/scripts/swatchTime.js";
    document.head.appendChild(clockScript);
    
    // Super stupid fix but apparently just importing the script as a DOM node
    // directly will not execute, so i have to basically stringify and destring
    // to get this to run
    const deferred = document.createElement("script");
    deferred.innerHTML = (<HTMLScriptElement>doc.querySelector('#deferred')).innerHTML;
    document.body.appendChild(deferred);

    const windowTemplate = <HTMLDivElement>doc.querySelector('#windowTemplate');
    initializeApplications(windowTemplate, taskbarDiv);
});