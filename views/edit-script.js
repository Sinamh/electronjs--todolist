const electron = require("electron");
const { ipcRenderer } = electron;

const form = document.querySelector("form");
const close = document.querySelector(".close-btn");

// ipcRenderer.on("add:open", () => {
// alert("ddddddd");
//   ipcRenderer.send("add:opened");
// });

ipcRenderer.send("add:opened");

// ipcRenderer.on("add:close", () => {
//   ipcRenderer.send("add:closed");
// });

const submitForm = function (e) {
  e.preventDefault();
  const item = document.querySelector("#item").value;
  // console.log(item);
  ipcRenderer.send("add:closed");
  ipcRenderer.send("item:add", item);
};

form.addEventListener("submit", submitForm);

close.addEventListener("click", () => {
  // console.log("here");
  ipcRenderer.send("add:closed");
  window.closeWindow();
});
