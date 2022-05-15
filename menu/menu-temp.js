const electron = require("electron");
const { app } = electron;

const createAddWindow = require("../add");

const isMac = process.platform === "darwin";

// const mainWindow = window.getCurrentWindow();
let mainWindow;

// Create menu template
const createMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        accelerator: isMac ? "Shift+A" : "Shift+A",
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
        accelerator: isMac ? "Cmd+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

// If mac add empty object to menu
if (isMac) {
  createMenuTemplate.unshift({});
}

// Add developer tools if not in production
if (process.env.NODE_ENV !== "production") {
  createMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: isMac ? "command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          // focusedWindow.toggleDevTools();
          focusedWindow.openDevTools({ detached: true });
        },
      },
      {
        role: "reload",
      },
    ],
  });
}

// console.log(mainWindow);

exports.getWindowReference = function (thewindow) {
  // console.log(thewindow);
  mainWindow = thewindow;
};
exports.createMenuTemplate = () => createMenuTemplate;
