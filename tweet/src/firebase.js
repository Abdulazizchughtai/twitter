// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxCMxlFc73nmpWkfXqYXIeI7s8grd-30I",
  authDomain: "aziz-tech-5afec.firebaseapp.com",
  projectId: "aziz-tech-5afec",
  storageBucket: "aziz-tech-5afec.firebasestorage.app",
  messagingSenderId: "994827158551",
  appId: "1:994827158551:web:875c2eae340c0b9b720852"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth instance to export
export const auth = getAuth(app);