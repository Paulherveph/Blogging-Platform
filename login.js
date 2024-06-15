import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from './firebase.js';

// Ensure the DOM is fully loaded before accessing elements
document.addEventListener("DOMContentLoaded", function() {
  // Form Elements
  const loginForm = document.getElementById("loginFormElement");
  const registerForm = document.getElementById("registerFormElement");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const registerEmail = document.getElementById("registerEmail");
  const registerPassword = document.getElementById("registerPassword");
  const confirmPassword = document.getElementById("confirmPassword");

  // Toggle Forms
  document.getElementById("showRegister").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
  });

  document.getElementById("showLogin").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
  });

  // Register User
  registerForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const email = registerEmail.value;
    const password = registerPassword.value;
    const confirmPass = confirmPassword.value;

    if (password === confirmPass) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          alert("Registration Successful");
          window.location.href = "/admin"; // Redirect to Dashboard
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      alert("Passwords do not match");
    }
  });

  // Login User
  loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const email = loginEmail.value;
    const password = loginPassword.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Login Successful");
        window.location.href = "/admin"; // Redirect to Dashboard
      })
      .catch((error) => {
        alert(error.message);
      });
  });
});
