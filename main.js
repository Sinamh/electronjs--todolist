process.env.NODE_ENV = "production";

const url = require("url");
const path = require("path");
const electron = require("electron");

const { app, BrowserWindow, Menu, ipcMain } = electron;
// const baseUrl = new URL("");

const createMenuTemplate = require("./menu-temp");

let mainWindow;

// Listen for the app to be ready
app.on("ready", function () {
  // Create a new window
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    frame: false,
  });
  // Load html into the window
  mainWindow.loadURL(
    url.pathToFileURL(path.join(__dirname, "views/main-window.html")).href
  );

  // Quit app when closed
  mainWindow.on("closed", function () {
    app.quit();
  });

  // Build menu from the template
  const mainMenu = Menu.buildFromTemplate(createMenuTemplate());
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

// Catch item add
ipcMain.on("item:add", function (e, item) {
  mainWindow.webContents.send("item:add", item);
});
