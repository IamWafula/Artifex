import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth"

import {getDatabase, onValue, set} from "firebase/database"
import {uploadString, getStorage, ref, getDownloadURL} from "firebase/storage"
import { getDoc, getFirestore, setDoc, collection,doc, addDoc, getDocs  } from "firebase/firestore";



// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_KEY,
    authDomain: "artifex-3eeb7.firebaseapp.com",
    projectId: "artifex-3eeb7",
    storageBucket: "artifex-3eeb7.appspot.com",
    messagingSenderId: "214715761411",
    appId: "1:214715761411:web:80be57874d578eb4b61f36"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app)
const storage = getStorage()
const auth = getAuth()

const usersRef = collection(database, "users")
const portfolioImages = ref(storage, 'portfolioImages')


const newUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (user) {

        const data = {
            "id": user.uid,
            "email": user.email
        };

        const url = `${import.meta.env.VITE_BACKEND_URL}/user`;


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

        const url = `${import.meta.env.VITE_BACKEND_URL}/user/${user.uid}`;

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

const addImage = async (blob, name, user_id) => {

    const newImageFirebase = ref(portfolioImages, name);

    if (blob){
        const metadata = {
            contentType : 'image/jpeg'
        }

        const snapshot = await uploadString(newImageFirebase, blob, 'data_url')
        const downloadUrl = await getDownloadURL(newImageFirebase, blob, 'data_url')


        return {
            id : snapshot.metadata.generation,
            imgUrl : downloadUrl,
            userId : user_id,
            postId : null,
            prompt : ""
        }
    }
}

export {
    newUser,
    existingUser,
    addImage
}
