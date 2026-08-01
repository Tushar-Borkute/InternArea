// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUoC5ToBa8WyVUxMr5ex9C86wwQiiyMlE",
  authDomain: "internarea-839f7.firebaseapp.com",
  projectId: "internarea-839f7",
  storageBucket: "internarea-839f7.firebasestorage.app",
  messagingSenderId: "1004145145",
  appId: "1:1004145145:web:a39ae1e3d3b03f261fd528",
  measurementId: "G-ZTMY1PW6TN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getauth(app);
const provider = new GoogleAuthProvider();
export{auth, provider};
