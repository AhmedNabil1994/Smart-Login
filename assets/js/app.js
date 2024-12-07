"use strict";
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

/**
 * @description Retrieves users from local storage and assigns them to the global `users` variable.
 * This IIFE checks if the `users` key exists in local storage. If it does, it loads the data;
 * otherwise, it retains the existing `users` value.
 * @global {Array|Object} users - A global variable to store the retrieved users data.
 */
const retrieveUsers = (function () {
  users = getFromLocalStorage("users") ? getFromLocalStorage("users") : users;
})();

/**
 *@description Handles user signup by validating form inputs, checking for duplicate emails, and storing user data.
 * This function performs the following actions:
 * - Checks if the provided email already exists in the users' list.
 * - Validates the username, email, and password inputs.
 * - Creates a user object and adds it to the global `users` list if the form is valid.
 * - Stores the updated users list and the signed-up user in local storage.
 * - Redirects the user to the home page upon successful signup.
 * - Clears the form and displays an error message if any input fields are empty.
 * @global {Array} users - The global list of user objects.
 */
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
  checkNullInputs(
    [usernameInput, userEmailInputSignup, userPasswordInputSignup],
    "p.error-msg"
  );
}

/**
 * @description Validates if all input fields are empty, clears them if they are, and toggles the visibility of an error message.
 * @param {HTMLInputElement[]} inputs - An array of input elements to validate.
 * @param {string} errMsgSelector - A CSS selector for the error message element to show or hide.
 */
function checkNullInputs(inputs, errMsgSelector) {
  const allEmpty = inputs.every((input) => input.value.length === 0);
  if (allEmpty) {
    clearForm(...inputs);
    document.querySelector(errMsgSelector).classList.remove("d-none");
  } else {
    document.querySelector(errMsgSelector).classList.add("d-none");
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

/**
 * @description Clears the values of the provided input fields and hides associated error messages.
 * This function accepts any number of input elements and performs the following actions:
 * - Sets the value of each input field to `null` (clears the input).
 * - Hides the associated error message by adding the `d-none` class to the next sibling element (if it exists).
 * @param {...HTMLInputElement} inputs - A list of input elements whose values will be cleared.
 */
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

/**
 * @description Validates a form input based on its type and displays corresponding error messages.
 * This function performs the following actions:
 * - Validates the input based on predefined regular expressions (for name, email, or password).
 * - Remove login error message or empty field message to show validating one
 * - Displays an error message if the input value doesn't match the expected pattern.
 * - Hides the error message if the input is valid.
 * @param {HTMLInputElement} input - The form input element to be validated.
 * @returns {boolean} `true` if the input is valid, `false` otherwise.
 */
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

/**
 * @description Adds event listeners to all input elements to validate form inputs on user interaction.
 * This IIFE collects all `input` elements from the document and attaches an `input` event listener to each.
 * When the value of any input changes, it triggers the `validateForm` function to validate the input.
 */
const handleInputClick = (function () {
  let inputs = Array.from(document.querySelectorAll("input"));
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", function (e) {
      validateForm(e.target);
    });
  }
})();

/**
 * @description Checks if the provided email already exists in the list of users.
 * This function compares the email entered in the signup form (`userEmailInputSignup`) with
 * the emails of the existing users stored in the `users` array. If a duplicate email is found,
 * it displays an error message by removing the `d-none` class from the `.duplicate-email` element.
 * @returns {boolean} `true` if the email already exists in the users list.
 */
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

/**
 * @description Populates the login form with the email and password of the signed-up user from local storage.
 * This IIFE retrieves the `signedup-user` object from local storage, and if the object exists, it
 * populates the email and password fields of the login form with the values from the signed-up user.
 * After the data is retrieved and used, the `signedup-user` item is removed from local storage.
 */
const populateLoginFormWithSignedUpUser = (function () {
  let signedupUser = getFromLocalStorage("signedup-user");
  if (signedupUser) {
    userEmailInputlogin.value = signedupUser.email;
    userPasswordInputlogin.value = signedupUser.password;
  }
  localStorage.removeItem("signedup-user");
})();

/**
 * @description Handles user login by validating the email and password and checking against stored user data.
 * This function validates the email and password inputs. If both are valid, it checks if the email
 * exists in the `users` array and if the password matches the stored password for that email.
 * If the login is successful, it stores the logged-in user in local storage and redirects to the home page.
 * If there are any errors (email not found or incorrect password), appropriate error messages are displayed.
 */
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
  checkNullInputs([userEmailInputlogin, userPasswordInputlogin], "p.error-msg");
}

if (loginBtn) {
  loginBtn.addEventListener("click", function () {
    loginUser();
  });
}

/**
 * @description Populates the home page with the logged-in user's name if available in local storage.
 * This IIFE retrieves the `loggedUser` object from local storage. If a logged-in user is found, it extracts
 * the user's name, capitalizes the first letter, and passes it to the `welcomeUser` function to display
 * a welcome message on the home page.
 */
const populateHomePageWithLoggedUser = (function () {
  const loggedUser = getFromLocalStorage("loggedUser");
  if (loggedUser) {
    let username = loggedUser.name;
    welcomeUser(`${username.charAt(0).toUpperCase()}${username.slice(1)}`);
  }
})();

/**
 * @description Updates the home page header with a personalized welcome message.
 * This function takes a `username` as an argument and updates the text content of the
 * `<span>` element inside the `<h1>` tag in the page's header with the provided username.
 * Typically, this is used to welcome the logged-in user by displaying their name.
 * @param {string} username - The name of the user to be displayed in the header.
 */
function welcomeUser(username) {
  document.querySelector("header h1 span").innerHTML = username;
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    logoutUser();
  });
}

/**
 * @description Logs the user out by clearing their session data from local storage and redirecting to the login page.
 * This function removes the `loggedUser` item from local storage, effectively logging the user out,
 * and then redirects the user to the `/index.html` page (typically the login page).
 */
function logoutUser() {
  localStorage.removeItem("loggedUser");
  window.location.href = "/index.html";
}

/**
 * Redirects the user to the login page if they are not logged in and attempting to access the home page.
 * @description Checks if the user is logged in by retrieving their information from localStorage.
 * If the user is not logged in and the current page is `/home.html`, they will be redirected to `/index.html`.
 */
const preventUnauthorizedAccess = (function () {
  const loggedUser = getFromLocalStorage("loggedUser");
  if (!loggedUser && window.location.pathname === "/home.html") {
    window.location.href = "/index.html";
  } else {
    document.body.classList.remove("d-none");
  }
})();
