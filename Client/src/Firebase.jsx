// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuSBYHdlJ6NlqcjcroL-qno7cnpzy_v0w",
  authDomain: "anayaagate-ac3ea.firebaseapp.com",
  databaseURL: "https://anayaagate-ac3ea-default-rtdb.firebaseio.com",
  projectId: "anayaagate-ac3ea",
  storageBucket: "anayaagate-ac3ea.firebasestorage.app",
  messagingSenderId: "503389085812",
  appId: "1:503389085812:web:d392edace7c44c3f97b121",
  measurementId: "G-2YMR7H9246"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);