const url = require("url");
const path = require("path");
const electron = require("electron");
const { BrowserWindow, ipcMain, app } = electron;

const mainModule = require("./main");

let editWindow;

// Handle create add window
const createeditWindow = function (item) {
  // Create a new window
  editWindow = new BrowserWindow({
    width: 300,
    height: 115,
    minWidth: 300,
    minHeight: 115,
    title: "Edit This Task",
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      alwaysOnTop: true,
      preload: path.resolve(app.getAppPath(), "preload.js"),
    },
  });

  // Load html into the window
  editWindow.loadURL(
    url.pathToFileURL(path.join(__dirname, "views/edit-window.html")).href
  );

  if (process.env.NODE_ENV === "production") {
    editWindow.setMenuBarVisibility(false);
  }

  // Garbage collection handle
  editWindow.on("close", function () {
    mainModule.activateWindow();
    editWindow.destroy();
    // editWindow.webContents.send("add:close");
  });

  // editWindow.on("add:closed", () => {
  //   editWindow.destroy();
  // });

  // editWindow.webContents.on("did-finish-load", () => {
  //   editWindow.webContents.send("add:open");
  // });

  require("@electron/remote/main").enable(editWindow.webContents);
};

ipcMain.on("item:edit", function (e, item) {
  if (item) editWindow.close();
});

module.exports = createEditWindow;
