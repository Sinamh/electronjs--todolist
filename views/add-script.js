const electron = require("electron");
const { ipcRenderer } = electron;

const form = document.querySelector("form");
const close = document.querySelector(".close-btn");

ipcRenderer.send("add:opened");

const submitForm = function (e) {
  e.preventDefault();
  const item = document.querySelector("#item").value;
  // console.log(item);
  ipcRenderer.send("add:closed");
  ipcRenderer.send("item:add", item);
};

form.addEventListener("submit", submitForm);

close.addEventListener("click", () => {
  ipcRenderer.send("add:closed");
  window.closeWindow();
});
