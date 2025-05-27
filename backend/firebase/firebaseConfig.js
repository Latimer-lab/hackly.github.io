// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAhqF7t5-3pKVf5a3O8xR60OokawSRuiK0",
    authDomain: "hackly-mvp.firebaseapp.com",
    projectId: "hackly-mvp",
    storageBucket: "hackly-mvp.firebasestorage.app",
    messagingSenderId: "827934530206",
    appId: "1:827934530206:web:74e3b56884475c871bf98f",
    measurementId: "G-J140SVTKRV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 