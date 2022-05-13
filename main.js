process.env.NODE_ENV = "production";

const url = require("url");
const path = require("path");
const electron = require("electron");
// const { session } = require("electron");

// const Promise = require("bluebird");
const AppDAO = require("./database/dao");
const TaskRepository = require("./database/task_repository");

const { app, BrowserWindow, Menu, ipcMain } = electron;
// const baseUrl = new URL("");

// const createMenuTemplate = require("./menu/menu-temp");
const menuTemp = require("./menu/menu-temp");
const createAddWindow = require("./add");
const editModule = require("./edit");
const console = require("console");

let mainWindow;
let dao;
let taskRepo;
let tasklist;
// let mainW = 11;

const startDB = function () {
  dao = new AppDAO("./database/database.sqlite3");
  taskRepo = new TaskRepository(dao);
  taskRepo
    .createTable()
    .then(() => {
      return taskRepo.getAll();
    })
    .then(tasks => {
      tasklist = tasks;
      if (!tasklist) tasklist = [];
    })
    .finally(() => {
      mainWindow.webContents.on("did-finish-load", function () {
        mainWindow.webContents.send("database:started", tasklist);
      });
    })
    .catch(err => {
      console.log(`Encountered an error: ${err}`);
    });
};

const bootLoader = function () {
  // Create a new window
  mainWindow = new BrowserWindow({
    webPreferences: {
      // enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.resolve(app.getAppPath(), "preload.js"),
      // icon: __dirname + "/assets/icons/todolist.png",
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

  mainWindow.setIcon(__dirname + "/assets/icons/todolist.png");

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

  startDB();

  if (global.addclosed) {
    mainWindow.webContents.send("add:closed");
  }

  // Quit app when closed
  mainWindow.on("closed", function () {
    app.quit();
  });

  // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: {
  //       ...details.responseHeaders,
  //       "Content-Security-Policy": ["default-src 'none'"],
  //     },
  //   });
  // });
};

// Listen for the app to be ready
app.on("ready", bootLoader);

// Catch item add
ipcMain.on("item:add", function (e, item) {
  mainWindow.webContents.send("item:add", item);
});

// Catch item add
ipcMain.on("item:edit", function (e, item) {
  mainWindow.webContents.send("item:edit", item);
});

ipcMain.on("add:opened", () => {
  mainWindow.webContents.send("main:disable");
});

ipcMain.on("add:closed", () => {
  mainWindow.webContents.send("main:enable");
});

ipcMain.on("edit:opened", () => {
  mainWindow.webContents.send("main:disable");
});

ipcMain.on("edit:closed", () => {
  mainWindow.webContents.send("main:enable");
});

ipcMain.on("items:clear:clicked", () => {
  mainWindow.webContents.send("item:clear");
});

ipcMain.on("item:add:clicked", () => {
  createAddWindow();
});

ipcMain.on("database:save", (e, item) => {
  taskRepo
    .create(item)
    .then(({ id }) => {
      return taskRepo.getById(id);
    })
    .then(item => {
      tasklist.push(item);
      mainWindow.webContents.send("database:saved", item);
    })
    .catch(err => console.error("Encountered an error: ", err));
});

ipcMain.on("database:delete", (e, id) => {
  tasklist.filter(item => {
    item.id !== id;
  });
  taskRepo.delete(id).catch(err => `Encountered an error: ${err}`);
});

ipcMain.on("database:clear", () => {
  tasklist = [];
  taskRepo.clearTable().catch(err => `Encountered an error: ${err}`);
});

ipcMain.on("database:update", (e, item) => {
  tasklist[tasklist.indexOf(itm => itm.id == item.id)] = item;
  taskRepo.update(item).catch(err => `Encountered an error: ${err}`);
});

ipcMain.on("itemstate:changed", (e, { id, itemstateindex }) => {
  const changedItem = tasklist.find(item => +item.id === +id);
  changedItem.taskstate = itemstateindex;
  taskRepo.update(changedItem).catch(err => `Encountered an error: ${err}`);
});

ipcMain.on("item:update", (e, id) => {
  editModule.createEditWindow(tasklist.find(item => item.id == id));
});

exports.activateWindow = function () {
  mainWindow.webContents.send("main:enable");
};

// console.log(mainWindows);
