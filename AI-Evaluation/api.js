import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
    getDatabase, 
    ref, 
    set, 
    push, 
    update, 
    remove, 
    onValue 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyAVWZDBr-utiJfOBW0taiyA2i1IAn19sEg",
    authDomain: "time-tracker-cd132.firebaseapp.com",
    databaseURL: "https://time-tracker-cd132-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "time-tracker-cd132",
    storageBucket: "time-tracker-cd132.appspot.com",
    messagingSenderId: "835394723720",
    appId: "1:835394723720:web:b6573ad19bae5e3349a43d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// -----------------------------------------------------
//  AUTH FUNCTIONS
// -----------------------------------------------------

// Signup
export function userSignup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

// Login
export function userLogin(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

// Logout
export function userLogout() {
    return signOut(auth);
}


// -----------------------------------------------------
//  DATABASE FUNCTIONS
// -----------------------------------------------------

// Save activity for user on selected date
export function saveActivity(userId, date, activityObj) {
    const activityRef = ref(db, `users/${userId}/activities/${date}`);
    const newActivity = push(activityRef);
    return set(newActivity, activityObj);
}

// Get all activities for specific date
export function getActivities(userId, date, callback) {
    const activityRef = ref(db, `users/${userId}/activities/${date}`);

    onValue(activityRef, (snapshot) => {
        callback(snapshot.exists() ? snapshot.val() : {});
    });
}

// Update activity
export function updateActivity(userId, date, activityId, updatedObj) {
    const activityRef = ref(db, `users/${userId}/activities/${date}/${activityId}`);
    return update(activityRef, updatedObj);
}

// Delete activity
export function deleteActivity(userId, date, activityId) {
    const activityRef = ref(db, `users/${userId}/activities/${date}/${activityId}`);
    return remove(activityRef);
}

