// const { contextBridge } = require("electron");
const {
  getCurrentWindow,
  openMenu,
  minimizeWindow,
  unmaximizeWindow,
  maxUnmaxWindow,
  isWindowMaximized,
  closeWindow,
} = require("./menu/menu-functions");

// use this instead of adding to the window object
window.addEventListener("DOMContentLoaded", () => {
  // contextBridge.exposeInMainWorld("world", {
  //   getCurrentWindow: getCurrentWindow,
  //   openMenu: openMenu,
  //   minimizeWindow: minimizeWindow,
  //   unmaximizeWindow: unmaximizeWindow,
  //   maxUnmaxWindow: maxUnmaxWindow,
  //   isWindowMaximized: isWindowMaximized,
  //   closeWindow: closeWindow,
  // });
  window.getCurrentWindow = getCurrentWindow;
  window.openMenu = openMenu;
  window.minimizeWindow = minimizeWindow;
  window.unmaximizeWindow = unmaximizeWindow;
  window.maxUnmaxWindow = maxUnmaxWindow;
  window.isWindowMaximized = isWindowMaximized;
  window.closeWindow = closeWindow;
});
