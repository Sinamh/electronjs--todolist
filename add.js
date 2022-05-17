const url = require("url");
const path = require("path");
const electron = require("electron");
const { BrowserWindow, ipcMain, app } = electron;

const mainModule = require("./main");

let addWindow;

// Handle create add window
const createAddWindow = function () {
  // Create a new window
  addWindow = new BrowserWindow({
    width: 500,
    minWidth: 500,
    maxWidth: 500,
    height: 190,
    minHeight: 190,
    maxHeight: 190,
    title: "Add ToDo Task",
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      alwaysOnTop: true,
      preload: path.resolve(app.getAppPath(), "preload.js"),
      // icon: __dirname + "/assets/icons/todolist.png",
    },
  });

  // Load html into the window
  addWindow.loadURL(
    url.pathToFileURL(path.join(__dirname, "views/add-window.html")).href
  );

  addWindow.setIcon(__dirname + "/assets/icons/todolist.png");

  if (process.env.NODE_ENV === "production") {
    addWindow.setMenuBarVisibility(false);
  }

  // Garbage collection handle
  addWindow.on("close", function () {
    mainModule.activateWindow();
    addWindow.destroy();
    // addWindow.webContents.send("add:close");
  });

  // addWindow.on("add:closed", () => {
  //   addWindow.destroy();
  // });

  // addWindow.webContents.on("did-finish-load", () => {
  //   addWindow.webContents.send("add:open");
  // });

  require("@electron/remote/main").enable(addWindow.webContents);
};

ipcMain.on("item:add", function (e, item) {
  if (item) addWindow.close();
});

module.exports = createAddWindow;
