
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB6vzJoWpt3yT2eIvM_VlgUhcGu8O7Gd88",
  authDomain: "aziz-twitter.firebaseapp.com",
  projectId: "aziz-twitter",
  storageBucket: "aziz-twitter.firebasestorage.app",
  messagingSenderId: "839113026979",
  appId: "1:839113026979:web:dfbac092ad046fb566fe16"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


export const storage = getStorage(app);

