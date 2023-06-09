// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcQwZzk8L8ItYCy4FrOzoJu6V65-bbXXQ",
  authDomain: "parking-highscores.firebaseapp.com",
  projectId: "parking-highscores",
  storageBucket: "parking-highscores.appspot.com",
  messagingSenderId: "686558785237",
  appId: "1:686558785237:web:131a33df7047d068bbbc5c",
  measurementId: "G-5220J3XBLJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);