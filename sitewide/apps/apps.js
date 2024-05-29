// Wait for page to load

window.addEventListener("DOMContentLoaded", () => {
  var collection = document.getElementsByClassName("app");
  var taskbarDoc = document.getElementById("taskbar");

  // wait for tb to load
  taskbarDoc.addEventListener("load", function () {
    var bar = taskbarDoc.contentWindow.document;
    //get appicons flexbox
    bar = bar.getElementsByClassName("bar")[0];
    bar = bar.childNodes[1];

    for (let i = 0; i < collection.length; i++) {
      injectElem(collection[i]);
    }

    function injectElem(elmnt) {
      var window = elmnt.getElementsByClassName("window")[0];

      var button = document.createElement("button");
      button.className = "taskbarEntry";
      button.id = window.id.toString() + "TB";

      button.onclick = function () {
        var button1 = document.getElementById(window.id);
        var button2 = taskbarDoc.contentWindow.document.getElementById(
          button.id
        );
        var style = document.defaultView.getComputedStyle(button1);
        if (style.display === "none") {
          button1.style.display = "block";
          if (true) {
            button2.classList.add("indent");
          }
        } else {
          button1.style.display = "none";
          if (true) {
            button2.classList.remove("indent");
          }
        }
      };

      var paragraph = document.createElement("p");

      if (elmnt.dataset.title) {
        paragraph.innerHTML = elmnt.dataset.title;
      } else {
        paragraph.innerHTML =
          elmnt.getElementsByClassName("windowHeader")[0].innerHTML;
      }

      // Toggle visibility of window through paragraph

      if (window.style.display !== "none") {
        button.classList.add("indent");
      }

      //image is referenced as data-icon="<link to some image>" as an attribute in the app div
      var image = document.createElement("img");
      if (elmnt.dataset.icon) {
        image.src = "/sitewide/apps/icons/" + elmnt.dataset.icon;
        console.log(image.src);
      } else {
        image.src = "/sitewide/taskbar/Program.ico";
      }
      button.appendChild(image);
      button.appendChild(paragraph);
      button.style.display = "inline-flex";
      bar.appendChild(button);
    }
  });
});
