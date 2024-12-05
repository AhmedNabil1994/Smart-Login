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
console.log(users, "users array after get from localstorage");

function createUser() {
  if (checkDuplicateEmail()) {
    return;
  }
  if (
    validateForm(usernameInput) &&
    validateForm(userEmailInput) &&
    validateForm(userPasswordInput)
  ) {
    let user = {
      name: usernameInput.value,
      email: userEmailInput.value,
      password: userPasswordInput.value,
    };
    users.push(user);
    setToLocalStorage("users", users);
    // clearForm();
    window.location.href = "../../index.html";
  }
  if (
    usernameInput.value.length === 0 &&
    userEmailInput.value.length === 0 &&
    userPasswordInput.value.length === 0
  ) {
    clearForm();
    document.querySelector("p.error-msg").classList.remove("d-none");
  } else {
    document.querySelector("p.error-msg").classList.add("d-none");
  }
}

if (signupBtn) {
  signupBtn.addEventListener("click", function () {
    createUser();
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
});

function clearForm() {
  usernameInput.value = null;
  userEmailInput.value = null;
  userPasswordInput.value = null;
  usernameInput.nextElementSibling.classList.add("d-none");
  userEmailInput.nextElementSibling.classList.add("d-none");
  userPasswordInput.nextElementSibling.classList.add("d-none");
}

function setToLocalStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function validateForm(input) {
  document.querySelector(".duplicate-email").classList.add("d-none");
  let regex = {
    name: /^[a-zA-z]{3,15}$/,
    email: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
  };
  let isValid = regex[input.id].test(input.value);
  if (isValid) {
    input.nextElementSibling.classList.replace("d-block", "d-none");
  } else {
    input.nextElementSibling.classList.replace("d-none", "d-block");
  }
  return isValid;
}

function handleInputClick() {
  let inputs = Array.from(document.querySelectorAll("input"));
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", function (e) {
      validateForm(e.target);
    });
  }
}
handleInputClick();

function checkDuplicateEmail() {
  const inputEmail = userEmailInput.value.trim().toLowerCase();
  for (let i = 0; i < users.length; i++) {
    const storedEmail = users[i].email.trim().toLowerCase();
    if (inputEmail === storedEmail) {
      document.querySelector(".duplicate-email").classList.remove("d-none");
      return true;
    }
  }
}
