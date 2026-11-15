import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC2TQFQKp09i-RmIwD-dXliS-ErPlH1Ho4",
  authDomain: "abestech123hardwareheroes2-0.firebaseapp.com",
  projectId: "abestech123hardwareheroes2-0",
  storageBucket: "abestech123hardwareheroes2-0.firebasestorage.app",
  messagingSenderId: "865851338352",
  appId: "1:865851338352:web:887d4e4753582b117d8eb5",
  measurementId: "G-MY9KRF1DPL"
};

const panel = document.getElementById("authArea");
const toggle = document.getElementById("authToggle");
if (!panel || !toggle) {
  const hash = window.location.hash;
  if (hash === "#authArea") {
    window.location.href = "index.html#authArea";
  }
} else {
  const auth = getAuth(initializeApp(firebaseConfig));
  const form = document.getElementById("authForm");
  const email = document.getElementById("emailInput");
  const password = document.getElementById("passwordInput");
  const status = document.getElementById("authStatus");
  const title = document.getElementById("authTitle");
  const subtitle = document.getElementById("authSubtitle");
  const accountState = document.getElementById("accountState");
  const accountEmail = document.getElementById("accountEmail");

  function openPanel(open) {
    panel.classList.toggle("visible", open);
    panel.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    if (open) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showStatus(message, kind) {
    status.textContent = message;
    status.classList.remove("hidden", "success", "error");
    status.classList.add(kind);
  }

  toggle.addEventListener("click", () => openPanel(!panel.classList.contains("visible")));

  document.getElementById("signUpBtn").addEventListener("click", async () => {
    const emailValue = email.value.trim();
    const passwordValue = password.value;
    if (!emailValue || !passwordValue) return showStatus("Please enter an email and password.", "error");
    try {
      await createUserWithEmailAndPassword(auth, emailValue, passwordValue);
      showStatus("Account created successfully.", "success");
    } catch (error) {
      showStatus(error.message, "error");
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const emailValue = email.value.trim();
    const passwordValue = password.value;
    if (!emailValue || !passwordValue) return showStatus("Please enter both email and password.", "error");
    try {
      await signInWithEmailAndPassword(auth, emailValue, passwordValue);
      showStatus("Signed in successfully.", "success");
    } catch (error) {
      showStatus(error.message, "error");
    }
  });

  document.getElementById("signOutBtn").addEventListener("click", async () => {
    try {
      await signOut(auth);
      showStatus("Signed out successfully.", "success");
      openPanel(false);
    } catch (error) {
      showStatus(error.message, "error");
    }
  });

  onAuthStateChanged(auth, (user) => {
    const signedIn = Boolean(user);
    form.classList.toggle("hidden", signedIn);
    document.getElementById("signInBtn").closest(".auth-actions").classList.toggle("hidden", signedIn);
    accountState.classList.toggle("hidden", !signedIn);
    if (signedIn) {
      title.textContent = "Your account";
      subtitle.textContent = "You’re signed in and ready to go.";
      accountEmail.textContent = user.email || "Signed-in account";
      toggle.textContent = "Account";
      openPanel(true);
    } else {
      title.textContent = "Welcome back";
      subtitle.textContent = "Sign in or create an account.";
      toggle.textContent = "Login";
      openPanel(false);
    }
  });

  if (window.location.hash === "#authArea") {
    openPanel(true);
  }
}
