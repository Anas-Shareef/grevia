import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import axios from "axios";

const firebaseConfig = {
    apiKey: "AIzaSyDAW_bfNcKUguIlf9It7rkMThfQP5Ic6NE",
    authDomain: "grevia-612f7.firebaseapp.com",
    projectId: "grevia-612f7",
    storageBucket: "grevia-612f7.firebasestorage.app",
    messagingSenderId: "34971289",
    appId: "1:34971289:web:3597d3a77fc9a1b63e5e4e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

