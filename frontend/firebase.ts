// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADWMHajIW20OF1YClVSDcVedKJVo8HTMI",
  authDomain: "bao-f95c0.firebaseapp.com",
  projectId: "bao-f95c0",
  storageBucket: "bao-f95c0.firebasestorage.app",
  messagingSenderId: "923245839317",
  appId: "1:923245839317:web:f2b96d7776fe9583ac335c",
  measurementId: "G-C5FFS561G8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);