// DOM elements
let usernameInput = document.getElementById("name");
let userEmailInput = document.getElementById("email");
let userPasswordInput = document.getElementById("password");
let signupBtn = document.getElementById("signup");
let loginBtn = document.getElementById("login");
let form = document.querySelector("form");
// arrays
let users = [];

(function retrieveUsers() {
  users = getFromLocalStorage("users") ? getFromLocalStorage("users") : users;
})();
console.log(users, "after get from localstorage");

function createUser() {
  let user = {
    name: usernameInput.value,
    email: userEmailInput.value,
    password: userPasswordInput.value,
  };
  users.push(user);
  // console.log(users);
  setToLocalStorage("users", users);
  clearForm();
}

signupBtn.addEventListener("click", function () {
  createUser();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
});

function clearForm() {
  usernameInput.value = null;
  userEmailInput.value = null;
  userPasswordInput.value = null;
}

function setToLocalStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
