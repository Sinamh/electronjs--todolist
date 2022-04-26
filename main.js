const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;
// const baseUrl = new URL("");

process.env.NODE_ENV = "production";

// Catch item add
ipcMain.on("item:add", function (e, item) {
  console.log(item);
  mainWindow.webContents.send("item:add", item);
  addWindow.close();
});

// Create menu template
const createMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        accelerator: process.platform === "darwin" ? "A" : "A",
        click() {
          createAddWindow();
        },
      },
      {
        label: "Clear Items",
        click() {
          mainWindow.webContents.send("item:clear");
        },
      },
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

// If mac add empty object to menu
if (process.platform === "darwin") {
  createMenuTemplate.unshift({});
}

// Add developer tools if not in production
if (process.env.NODE_ENV !== "production") {
  createMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform === "darwin" ? "command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  });
}

let mainWindow;
let addWindow;

// Listen for the app to be ready
app.on("ready", function () {
  // Create a new window
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // Load html into the window
  mainWindow.loadURL(
    url.pathToFileURL(path.join(__dirname, "main-window.html")).href
  );

  // Quit app when closed
  mainWindow.on("closed", function () {
    app.quit();
  });

  // Build menu from the template
  const mainMenu = Menu.buildFromTemplate(createMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

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
    url.pathToFileURL(path.join(__dirname, "add-window.html")).href
  );

  if (process.env.NODE_ENV !== "production") {
    addWindow.setMenuBarVisibility(false);
  }

  // Garbage collection handle
  addWindow.on("close", function () {
    addWindow.destroy();
  });
};
