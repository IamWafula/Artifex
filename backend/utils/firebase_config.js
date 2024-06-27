// Import the functions you need from the SDKs you need
const {initializeApp} = require("firebase/app")
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${process.env.FIREBASE_KEY}`,
  authDomain: "artifex-3eeb7.firebaseapp.com",
  projectId: "artifex-3eeb7",
  storageBucket: "artifex-3eeb7.appspot.com",
  messagingSenderId: "214715761411",
  appId: "1:214715761411:web:80be57874d578eb4b61f36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = app;
