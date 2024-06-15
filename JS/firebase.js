
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {  query, where,  deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

/ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
auth.languageCode = 'it';
const provider = new  GoogleAuthProvider();

// References to storage paths
const imagesRef = ref(storage, 'images');

export { db, imagesRef, auth, collection, doc, getDoc, getDocs,  provider, createUserWithEmailAndPassword, signInWithEmailAndPassword, query, where,  deleteDoc };


