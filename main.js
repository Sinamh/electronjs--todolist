const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow } = electron;
// const baseUrl = new URL("");

let mainWindow;

// Listen for the app to be ready
app.on("ready", function () {
  // Create a new window
  mainWindow = new BrowserWindow();
  // Load html into the window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "main-window.html"),
      protocol: "file",
      slashes: true,
    })
    // url.pathToFileURL(path.join(__dirname, "main-window.html")).href;
  );
});
// console.log(
//   url.format({
//     pathname: path.join(__dirname, "main-window.html"),
//     protocol: "file",
//     slashes: true,
//   })
// );
// console.log(url.pathToFileURL(path.join(__dirname, "main-window.html")).href);
