// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyeXOYoPz9mIBFKxLfOyL1VtkA2qcAO5U",
  authDomain: "hspantryapp-d0095.firebaseapp.com",
  projectId: "hspantryapp-d0095",
  storageBucket: "hspantryapp-d0095.appspot.com",
  messagingSenderId: "87805143077",
  appId: "1:87805143077:web:0832829e992d19feabb7cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {app, firestore}