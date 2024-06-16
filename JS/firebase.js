
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {  query, where,  deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCenT_6GCkDOtnh8ZuTzVFoBKm5ZkaVouc",
  authDomain: "blogging-website-46277 .firebaseapp.com",
  projectId: "blogging-website-46277",
  storageBucket: "blogging-website-46277.appspot.com",
  messagingSenderId: "78510713062",
  appId: "1:78510713062:web:ba62029ae5f5609f827327"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
auth.languageCode = 'it';
const provider = new  GoogleAuthProvider();

// References to storage paths
const imagesRef = ref(storage, 'images');

export { db, imagesRef, auth, collection, doc, getDoc, getDocs,  provider, createUserWithEmailAndPassword, signInWithEmailAndPassword, query, where,  deleteDoc };
