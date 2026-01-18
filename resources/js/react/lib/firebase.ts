import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import axios from "axios";

const firebaseConfig = {
    authDomain: "auth.grevia.in", // Updated to custom domain
    projectId: "grevia-612f7",
    storageBucket: "grevia-612f7.firebasestorage.app",
    messagingSenderId: "34971289",
    appId: "1:34971289:web:placeholder"
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
