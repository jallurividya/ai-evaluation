// firebase.js
// Place this file in your project root and fill firebaseConfig with your keys

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
  update,
  push,
  remove
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAVWZDBr-utiJfOBW0taiyA2i1IAn19sEg",
  authDomain: "time-tracker-cd132.firebaseapp.com",
  databaseURL: "https://time-tracker-cd132-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "time-tracker-cd132",
  storageBucket: "time-tracker-cd132.firebasestorage.app",
  messagingSenderId: "835394723720",
  appId: "1:835394723720:web:b6573ad19bae5e3349a43d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getDatabase(app);

// Re-export used functions for convenience
export {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  ref as dbRef,
  get as dbGet,
  set as dbSet,
  update as dbUpdate,
  push as dbPush,
  remove as dbRemove
};
