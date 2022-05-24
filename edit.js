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
    width: 500,
    minWidth: 500,
    maxWidth: 500,
    height: 190,
    minHeight: 190,
    maxHeight: 190,
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

  editWindow.setIcon(__dirname + "/assets/icons/todolist.png");

  if (process.env.NODE_ENV === "production") {
    editWindow.setMenuBarVisibility(false);
  }

  // Garbage collection handle
  editWindow.on("close", function () {
    mainModule.activateWindow();
    editWindow.destroy();
  });

  require("@electron/remote/main").enable(editWindow.webContents);

  editWindow.webContents.on("did-finish-load", function () {
    editWindow.webContents.send("updateitem", item);
  });
};

ipcMain.on("item:edit", function (e, item) {
  if (item) editWindow.close();
});

exports.getdbinstance = function (db) {
  database = db;
};

exports.createEditWindow = createeditWindow;
