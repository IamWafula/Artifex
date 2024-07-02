import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth"

import {getDatabase, onValue, ref, set} from "firebase/database"

import { getDoc, getFirestore, setDoc, collection,doc, addDoc, getDocs  } from "firebase/firestore";


// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_KEY,
    authDomain: "basket-b5fb8.firebaseapp.com",
    projectId: "basket-b5fb8",
    storageBucket: "basket-b5fb8.appspot.com",
    messagingSenderId: "454921763756",
    appId: "1:454921763756:web:053228c03e3bf0ed87d809"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app)
const auth = getAuth()

const usersRef = collection(database, "users")

const newUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (user) {

        const data = {
            "id": user.uid,
            "email": user.email
        };
        console.log(data);

        const url = `${import.meta.env.VITE_DATABASE_URL}/user`;


        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(url, options);
        const resJson = await response.json();

        const user_data = {
            "id": user.id,
            "profileImage": "https://static-00.iconduck.com/assets.00/user-icon-512x512-r62xmy4p.png",
            "userName": user.email,
            "userRating": 5,
            "bids": [],
            "commissions": [],
            "posts": [],
            "images": []
        };

        return user_data;
    }
}


const existingUser = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (user) {

        const url = `${import.meta.env.VITE_DATABASE_URL}/user/${user.uid}`;

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        };

        const response = await fetch(url, options);
        const resJson = await response.json();

        return resJson;
    }
}

export {
    newUser,
    existingUser
}
