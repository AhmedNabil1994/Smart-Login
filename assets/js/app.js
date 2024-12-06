// DOM elements
const usernameInput = document.getElementById("name");
const userEmailInputSignup = document.querySelector(".signup input#email");
const userPasswordInputSignup = document.querySelector(
  ".signup input#password"
);
const userEmailInputlogin = document.querySelector(".login input#email");
const userPasswordInputlogin = document.querySelector(".login input#password");
const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const form = document.querySelector("form");
// arrays
let users = [];

(function retrieveUsers() {
  users = getFromLocalStorage("users") ? getFromLocalStorage("users") : users;
})();
console.log(users, "users array after get from localstorage");

function signupUser() {
  if (checkDuplicateEmail()) {
    return;
  }
  if (
    validateForm(usernameInput) &&
    validateForm(userEmailInputSignup) &&
    validateForm(userPasswordInputSignup)
  ) {
    let user = {
      name: usernameInput.value,
      email: userEmailInputSignup.value,
      password: userPasswordInputSignup.value,
    };
    users.push(user);
    setToLocalStorage("users", users);
    setToLocalStorage("signedup-user", user);
    window.location.href = "/index.html";
  }
  if (
    usernameInput.value.length === 0 &&
    userEmailInputSignup.value.length === 0 &&
    userPasswordInputSignup.value.length === 0
  ) {
    clearForm(usernameInput, userEmailInputSignup, userPasswordInputSignup);
    document.querySelector("p.error-msg").classList.remove("d-none");
  } else {
    document.querySelector("p.error-msg").classList.add("d-none");
  }
}

if (signupBtn) {
  signupBtn.addEventListener("click", function () {
    signupUser();
  });
}

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
  });
}

function clearForm(...inputs) {
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i]) {
      inputs[i].value = null;
      if (inputs[i].nextElementSibling) {
        inputs[i].nextElementSibling.classList.add("d-none");
      }
    }
  }
}

function setToLocalStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function validateForm(input) {
  if (document.querySelector(".duplicate-email")) {
    document.querySelector(".duplicate-email").classList.add("d-none");
  }
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
  if (document.querySelector(".login-error-msg")) {
    document.querySelector(".login-error-msg").classList.add("d-none");
  }
  document.querySelector(".error-msg").classList.add("d-none");
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
  const inputEmail = userEmailInputSignup.value.trim().toLowerCase();
  for (let i = 0; i < users.length; i++) {
    const storedEmail = users[i].email.trim().toLowerCase();
    if (inputEmail === storedEmail) {
      document.querySelector(".duplicate-email").classList.remove("d-none");
      return true;
    }
  }
}

(function retrieveSignedupUser() {
  let signedupUser = getFromLocalStorage("signedup-user");
  if (signedupUser) {
    userEmailInputlogin.value = signedupUser.email;
    userPasswordInputlogin.value = signedupUser.password;
  }
  localStorage.removeItem("signedup-user");
})();

function loginUser() {
  let loggedInUser = null;
  let emailExists = false;
  let passwordMatches = false;
  if (
    validateForm(userEmailInputlogin) &&
    validateForm(userPasswordInputlogin)
  ) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === userEmailInputlogin.value) {
        emailExists = true;
        if (users[i].password === userPasswordInputlogin.value) {
          loggedInUser = users[i];
          passwordMatches = true;
          break;
        }
      }
    }
    if (loggedInUser) {
      console.log(loggedInUser, "logged user");
      setToLocalStorage("loggedUser", loggedInUser);
      window.location.href = "/home.html";
    } else {
      if (!emailExists) {
        document.querySelector(".login-error-msg").innerHTML =
          "Email not found";
      } else if (!passwordMatches) {
        document.querySelector(".login-error-msg").innerHTML =
          "Incorrect password";
      }
      document.querySelector(".login-error-msg").classList.remove("d-none");
    }
  }
  if (
    userEmailInputlogin.value.length === 0 &&
    userPasswordInputlogin.value.length === 0
  ) {
    clearForm(userEmailInputlogin, userPasswordInputlogin);
    document.querySelector("p.error-msg").classList.remove("d-none");
  } else {
    document.querySelector("p.error-msg").classList.add("d-none");
  }
}

if (loginBtn) {
  loginBtn.addEventListener("click", function () {
    loginUser();
  });
}

(function setHomePageUser() {
  const loggedUser = getFromLocalStorage("loggedUser");
  if (loggedUser) {
    let username = loggedUser.name;
    welcomeUser(`${username.charAt(0).toUpperCase()}${username.slice(1)}`);
  }
})();

function welcomeUser(username) {
  document.querySelector("header h1 span").innerHTML = username;
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    logoutUser();
  });
}

function logoutUser() {
  localStorage.removeItem("loggedUser");
  window.location.href = "/index.html";
}

/**
 * Redirects the user to the login page if they are not logged in and attempting to access the home page.
 *
 * @description Checks if the user is logged in by retrieving their information from localStorage.
 * If the user is not logged in and the current page is `/home.html`, they will be redirected to `/index.html`.
 */
const preventUnauthorizedAccess = function () {
  const loggedUser = getFromLocalStorage("loggedUser");
  if (!loggedUser && window.location.pathname === "/home.html") {
    window.location.href = "/index.html";
  } else {
    document.body.classList.remove("d-none");
  }
};
preventUnauthorizedAccess();
