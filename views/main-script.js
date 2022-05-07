const electron = require("electron");
const { ipcRenderer } = electron;
const ul = document.querySelector("ul");
const addbtn = document.querySelector(".addbtn");
const clearAllBtn = document.querySelector(".clearallbtn");
const bodyel = document.querySelector("body");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

ipcRenderer.on("main:disable", () => {
  bodyel.classList.add("unselect");
});

ipcRenderer.on("main:enable", () => {
  bodyel.classList.remove("unselect");
});

// add:item
ipcRenderer.on("item:add", function (e, item) {
  if (item) {
    const citem = capitalizeFirstLetter(item);
    const li = document.createElement("li");
    li.className = "collection-item";
    const itemText = document.createTextNode(citem + "    ");
    li.appendChild(itemText);
    const span = document.createElement("span");
    span.classList.add("item-tag");
    span.textContent = "ToDo";
    li.appendChild(span);
    const deletebtn = document.createElement("button");
    deletebtn.classList.add("item-delete-btn");
    const i = document.createElement("i");
    i.classList.add("fa");
    i.classList.add("fa-trash");
    deletebtn.appendChild(i);
    li.appendChild(deletebtn);
    li.setAttribute("data-itemstateindex", 1);
    li.classList.add("item-todo");
    ul.appendChild(li);
    ul.className = "collection";
  }
});

// clear:item
ipcRenderer.on("item:clear", function (e, item) {
  // console.log("called");
  ul.innerHTML = "";
  ul.className = "";
});

addbtn.addEventListener("click", () => {
  ipcRenderer.send("item:add:clicked");
});

clearAllBtn.addEventListener("click", () => {
  ipcRenderer.send("items:clear:clicked");
});

const removeItem = function (e) {
  // console.log("called");
  e.target.remove();
  if (ul.children.length === 0) {
    ul.className = "";
  }
};

ul.addEventListener("dblclick", removeItem);

const changeState = function (e) {
  const itemstateindex = e.target.dataset.itemstateindex;

  if (e.target.tagName.toLowerCase() != "li") return;

  e.target.setAttribute("data-itemstateindex", (itemstateindex + 1) % 3);

  switch (+itemstateindex) {
    case 0:
      e.target.classList.add("item-todo");
      e.target.classList.remove("item-doing");
      e.target.classList.remove("item-done");
      e.target.childNodes[1].textContent = "ToDo";
      break;
    case 1:
      e.target.classList.add("item-doing");
      e.target.classList.remove("item-todo");
      e.target.classList.remove("item-done");
      e.target.childNodes[1].textContent = "Doing";
      break;
    case 2:
      e.target.classList.add("item-done");
      e.target.classList.remove("item-todo");
      e.target.classList.remove("item-doing");
      e.target.childNodes[1].textContent = "Done";
      break;
    default:
  }
};

ul.addEventListener("click", changeState);

window.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menu-btn");
  const minimizeButton = document.getElementById("minimize-btn");
  const maxUnmaxButton = document.getElementById("max-unmax-btn");
  const closeButton = document.getElementById("close-btn");

  menuButton.addEventListener("click", e => {
    // Opens menu at (x,y) coordinates of mouse click on the hamburger icon.
    // window.openMenu(e.x, e.y);
    window.openMenu(5, 45);
  });

  minimizeButton.addEventListener("click", e => {
    window.minimizeWindow();
  });

  maxUnmaxButton.addEventListener("click", e => {
    const icon = maxUnmaxButton.querySelector("i.far");

    window.maxUnmaxWindow();

    // Change the middle maximize-unmaximize icons.
    if (window.isWindowMaximized()) {
      icon.classList.remove("fa-square");
      icon.classList.add("fa-clone");
    } else {
      icon.classList.add("fa-square");
      icon.classList.remove("fa-clone");
    }
  });

  closeButton.addEventListener("click", e => {
    window.closeWindow();
  });
});
