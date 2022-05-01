const electron = require("electron");
const { ipcRenderer } = electron;
const ul = document.querySelector("ul");

// add:item
ipcRenderer.on("item:add", function (e, item) {
  const li = document.createElement("li");
  li.className = "collection-item";
  const itemText = document.createTextNode(item);
  li.appendChild(itemText);
  if (itemText) {
    ul.appendChild(li);
    ul.className = "collection";
  }
});

// clear:item
ipcRenderer.on("item:clear", function (e, item) {
  ul.innerHTML = "";
  ul.className = "";
});

const removeItem = function (e) {
  e.target.remove();
  if (ul.children.length === 0) {
    ul.className = "";
  }
};

ul.addEventListener("dbclick", removeItem);

window.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menu-btn");
  const minimizeButton = document.getElementById("minimize-btn");
  const maxUnmaxButton = document.getElementById("max-unmax-btn");
  const closeButton = document.getElementById("close-btn");

  menuButton.addEventListener("click", e => {
    // Opens menu at (x,y) coordinates of mouse click on the hamburger icon.
    window.openMenu(e.x, e.y);
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
