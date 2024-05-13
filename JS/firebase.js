import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

const firebaseConfig = { 
  apiKey : "AIzaSyBnXqLohscuhz74tTl4XXRYxBJFrg8xxnM" , 
  authDomain : "blogging-website-48c92.firebaseapp.com" , 
  projectId : "blogging-website-48c92" , 
  storageBucket : "blogging-website-48c92.appspot.com" , 
  messagingSenderId : "1091336465795" , 
  appId : "1:1091336465795:web:2605574cf7d90600a8dab6" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
