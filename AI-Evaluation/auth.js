// auth.js
import {
  auth,
  provider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "./firebase.js";

// Utility to show error (if element present)
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.innerText = msg || "";
}

// SIGNUP page actions
const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    showError("signup-error", "");
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    if (!email || !password) return showError("signup-error", "Enter email & password.");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (err) {
      showError("signup-error", err.message);
    }
  });
}

// LOGIN page actions
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    showError("login-error", "");
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    if (!email || !password) return showError("login-error", "Enter email & password.");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (err) {
      showError("login-error", err.message);
    }
  });
}

// Optional: if you have a Google sign-in button on any page, id = googleSignIn
const googleBtn = document.getElementById("googleSignIn");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "dashboard.html";
    } catch (err) {
      alert("Google sign-in failed: " + err.message);
    }
  });
}
