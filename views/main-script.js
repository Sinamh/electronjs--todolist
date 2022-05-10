const electron = require("electron");
const { ipcRenderer } = electron;
const ul = document.querySelector("ul");
const addbtn = document.querySelector(".addbtn");
const clearAllBtn = document.querySelector(".clearallbtn");
const bodyel = document.querySelector("body");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function addItemToDom(id, item) {
  const li = document.createElement("li");
  const ptag = document.createElement("p");
  const citem = capitalizeFirstLetter(item);
  const itemText = document.createTextNode(citem + "    ");
  const span = document.createElement("span");
  const itembtncontainer = document.createElement("div");
  const modifybtn = document.createElement("button");
  const deletebtn = document.createElement("button");
  const iedit = document.createElement("i");
  const itrash = document.createElement("i");
  ul.classList.add("collection");
  li.setAttribute("id", id);
  li.setAttribute("data-itemstateindex", 1);
  li.classList.add("collection-item");
  li.classList.add("item-todo");
  ptag.classList.add("item-text-paragraph");
  span.classList.add("item-tag");
  span.textContent = "ToDo";
  itembtncontainer.classList.add("del-modify-container");
  modifybtn.classList.add("item-modify-btn");
  iedit.classList.add("modifybutton");
  iedit.classList.add("fa");
  iedit.classList.add("fa-pen");
  deletebtn.classList.add("item-delete-btn");
  itrash.classList.add("deletebutton");
  itrash.classList.add("fa");
  itrash.classList.add("fa-trash");
  li.appendChild(ptag);
  ptag.appendChild(itemText);
  ptag.appendChild(span);
  modifybtn.appendChild(iedit);
  deletebtn.appendChild(itrash);
  itembtncontainer.appendChild(modifybtn);
  itembtncontainer.appendChild(deletebtn);
  li.appendChild(itembtncontainer);
  ul.appendChild(li);
}

function loadDOM(list) {
  list.map(item => {
    addItemToDom(item.id, item.description);
  });
}

ipcRenderer.on("database:started", (e, tasklist) => {
  loadDOM(tasklist);
});

ipcRenderer.on("main:disable", () => {
  bodyel.classList.add("unselect");
});

ipcRenderer.on("main:enable", () => {
  bodyel.classList.remove("unselect");
});

// add:item
ipcRenderer.on("item:add", function (e, item) {
  if (item) {
    ipcRenderer.send("database:save", item);
  }
});

ipcRenderer.on("database:saved", (e, item) => {
  addItemToDom(item.id, item.description);
});

// clear:item
ipcRenderer.on("item:clear", function (e, item) {
  ul.innerHTML = "";
  ul.className = "";
  ipcRenderer.send("database:clear");
});

addbtn.addEventListener("click", () => {
  ipcRenderer.send("item:add:clicked");
});

clearAllBtn.addEventListener("click", () => {
  ipcRenderer.send("items:clear:clicked");
});

const removeItem = function (e) {
  if (e.target.classList.contains("deletebutton")) {
    e.target.parentNode.parentNode.parentNode.remove();
    const id = e.target.parentNode.parentNode.parentNode.id;
    ipcRenderer.send("database:delete", id);
  }
  if (ul.children.length === 0) {
    ul.className = "";
  }
};

ul.addEventListener("click", removeItem);
// ul.addEventListener("dblclick", removeItem);

const changeState = function (e) {
  const itemstateindex = e.target.dataset.itemstateindex;

  if (e.target.tagName.toLowerCase() != "li") return;

  e.target.setAttribute("data-itemstateindex", (itemstateindex + 1) % 3);

  switch (+itemstateindex) {
    case 0:
      e.target.classList.add("item-todo");
      e.target.classList.remove("item-doing");
      e.target.classList.remove("item-done");
      e.target.childNodes[0].childNodes[1].textContent = "ToDo";
      break;
    case 1:
      e.target.classList.add("item-doing");
      e.target.classList.remove("item-todo");
      e.target.classList.remove("item-done");
      e.target.childNodes[0].childNodes[1].textContent = "Doing";
      break;
    case 2:
      e.target.classList.add("item-done");
      e.target.classList.remove("item-todo");
      e.target.classList.remove("item-doing");
      e.target.childNodes[0].childNodes[1].textContent = "Done";
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
