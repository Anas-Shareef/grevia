import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import axios from "axios";

// Firebase disabled - uncomment and add valid config to enable
/*
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "auth.grevia.in",
    projectId: "grevia-612f7",
    storageBucket: "grevia-612f7.firebasestorage.app",
    messagingSenderId: "34971289",
    appId: "1:34971289:web:placeholder"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
*/

// Dummy auth export to prevent import errors
export const auth = null as any;
