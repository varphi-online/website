// This is just so I may instantiate a single taskbar div wherever I choose and
// still benefit from html linting :3

// Realistically, I should create two separate navigation layouts, for desktop
// and mobile, and decide to import a specific version based on detected os.
fetch("/sitewide/taskbar/taskbar_refactor.html").then(response=> response.text()).then(text=>{
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    const taskbarDiv = doc.querySelector('#taskbar');
    document.body.appendChild(taskbarDiv);

    const link = document.createElement("link");
    link.href = "/sitewide/taskbar/taskbar2.css";
    link.type = "text/css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    
    // Super stupid fix but apparently just importing the script as a DOM node
    // directly will not execute, so i have to basically stringify and destring
    // to get this to run
    const deferred = document.createElement("script");
    deferred.innerHTML = doc.querySelector('#deferred').innerHTML;
    document.body.appendChild(deferred);
});

