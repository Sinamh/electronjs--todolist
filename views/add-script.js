const electron = require("electron");
const { ipcRenderer } = electron;

const form = document.querySelector("form");

const submitForm = function (e) {
  e.preventDefault();
  const item = document.querySelector("#item").value;
  console.log(item);
  ipcRenderer.send("item:add", item);
};

form.addEventListener("submit", submitForm);
