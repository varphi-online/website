// This is just so I may instantiate a single taskbar div wherever I choose and
// still benefit from html linting :3
import { initializeApplications } from "../apps/applicationManager.js";
// Realistically, I should create two separate navigation layouts, for desktop
// and mobile, and decide to import a specific version based on detected os.
fetch("/sitewide/taskbar/taskbar.html").then(response => response.text()).then(text => {
    // Get stylesheets for different sub modules
    // TODO: Switch to using anchor version of stylesheet when all major browsers support
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
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    // Grab taskbar for injection
    const taskbarDiv = doc.querySelector('#taskbar');
    document.body.appendChild(taskbarDiv);
    const musicPlayer = doc.querySelector('#musicPlayer');
    document.body.appendChild(musicPlayer);
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
    deferred.innerHTML = doc.querySelector('#deferred').innerHTML;
    document.body.appendChild(deferred);
    const windowTemplate = doc.querySelector('#windowTemplate');
    let [apps, zList] = initializeApplications(windowTemplate, taskbarDiv);
    //apps.push(webpageAsApp(windowTemplate,taskbarDiv,"https://youtube.com"));
    //zList.push(<Application>apps.at(-1));
});
