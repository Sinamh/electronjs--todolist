// process.env.NODE_ENV = "production";

const url = require("url");
const path = require("path");
const electron = require("electron");
const { session } = require("electron");

const { app, BrowserWindow, Menu, ipcMain } = electron;
// const baseUrl = new URL("");

// const createMenuTemplate = require("./menu/menu-temp");
const menuTemp = require("./menu/menu-temp");
const createAddWindow = require("./add");

let mainWindow;
// let mainW = 11;

const bootLoader = function () {
  // Create a new window
  mainWindow = new BrowserWindow({
    webPreferences: {
      // enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.resolve(app.getAppPath(), "preload.js"),
    },
    height: 500,
    minHeight: 500,
    width: 800,
    minWidth: 640,
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

  menuTemp.getWindowReference(mainWindow);

  // Build menu from the template
  const mainMenu = Menu.buildFromTemplate(menuTemp.createMenuTemplate());

  // Insert menu
  Menu.setApplicationMenu(mainMenu);

  // Register an event listener. When ipcRenderer sends mouse click co-ordinates, show menu at that position.
  var isWindows = process.platform === "win32";

  // mainWindows = 968;
  // console.log(mainW);

  ipcMain.on(`display-app-menu`, function (e, args) {
    if (isWindows && mainWindow) {
      mainMenu.popup({
        window: mainWindow,
        x: args.x,
        y: args.y,
      });
    }
  });

  require("@electron/remote/main").enable(mainWindow.webContents);
  require("@electron/remote/main").initialize();

  // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: {
  //       ...details.responseHeaders,
  //       "Content-Security-Policy": ["default-src 'none'"],
  //     },
  //   });
  // });

  if (global.addclosed) {
    mainWindow.webContents.send("add:closed");
  }
};

// Listen for the app to be ready
app.on("ready", bootLoader);

// Catch item add
ipcMain.on("item:add", function (e, item) {
  mainWindow.webContents.send("item:add", item);
});

ipcMain.on("add:opened", () => {
  mainWindow.webContents.send("main:disable");
});

ipcMain.on("add:closed", () => {
  mainWindow.webContents.send("main:enable");
});

ipcMain.on("items:clear:clicked", () => {
  mainWindow.webContents.send("item:clear");
});

ipcMain.on("item:add:clicked", () => {
  createAddWindow();
});

exports.activateWindow = function () {
  mainWindow.webContents.send("main:enable");
};

// console.log(mainWindows);
