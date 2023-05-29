const { ipcRenderer } = require("electron");

function getCurrentWindow() {
  return require("@electron/remote").getCurrentWindow();
}

function openMenu(x, y) {
  ipcRenderer.send(`display-app-menu`, { x, y });
}

function minimizeWindow(browserWindow = getCurrentWindow()) {
  if (browserWindow.minimizable) {
    browserWindow.minimize();
  }
}

function maximizeWindow(browserWindow = getCurrentWindow()) {
  if (browserWindow.maximizable) {
    browserWindow.maximize();
  }
}

function unmaximizeWindow(browserWindow = getCurrentWindow()) {
  browserWindow.unmaximize();
}

function maxUnmaxWindow(browserWindow = getCurrentWindow()) {
  if (browserWindow.isMaximized()) {
    browserWindow.unmaximize();
  } else {
    browserWindow.maximize();
  }
}

function closeWindow(browserWindow = getCurrentWindow()) {
  browserWindow.close();
}

function isWindowMaximized(browserWindow = getCurrentWindow()) {
  return browserWindow.isMaximized();
}

module.exports = {
  getCurrentWindow,
  openMenu,
  minimizeWindow,
  maximizeWindow,
  unmaximizeWindow,
  maxUnmaxWindow,
  isWindowMaximized,
  closeWindow,
};
