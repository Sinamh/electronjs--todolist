const url = require("url");
const path = require("path");
const electron = require("electron");
const { BrowserWindow, ipcMain } = electron;

let addWindow;

// Handle create add window
const createAddWindow = function () {
  // Create a new window
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add ToDo Task",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load html into the window
  addWindow.loadURL(
    url.pathToFileURL(path.join(__dirname, "views/add-window.html")).href
  );

  if (process.env.NODE_ENV === "production") {
    addWindow.setMenuBarVisibility(false);
  }

  // Garbage collection handle
  addWindow.on("close", function () {
    addWindow.destroy();
  });
};

ipcMain.on("item:add", function (e, item) {
  addWindow.close();
});

module.exports = createAddWindow;
