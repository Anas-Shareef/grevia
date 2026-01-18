import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDAW_bfNcKUguIlf9It7rkMThfQP5Ic6NE",
    authDomain: "grevia-612f7.firebaseapp.com",
    projectId: "grevia-612f7",
    storageBucket: "grevia-612f7.firebasestorage.app",
    messagingSenderId: "34971289", // Placeholder/Unknown, usually not critical for Auth unless using Phone/FCM
    appId: "1:34971289:web:placeholder" // Placeholder/Unknown
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
