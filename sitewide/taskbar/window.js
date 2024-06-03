// Make the DIV element draggable:
// https://www.w3schools.com/howto/howto_js_draggable.asp

// Edited from original script to iterate across all movableWindow classes on
// a page instead of hard-coding it
window.addEventListener('DOMContentLoaded', () => {
var collection = document.getElementsByClassName("movableWindow");

for (let i = 0; i < collection.length; i++) {
  dragElement(collection[i]);
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header") && screen.width > 600) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").style.cursor = "move";
    document.getElementById(elmnt.id + "header").onpointerdown = dragPointerDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onpointerdown = dragPointerDown;
  }

  function dragPointerDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the pointer cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onpointerup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onpointermove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when pointer button is released:
    document.onpointerup = null;
    document.onpointermove = null;
  }
}
});