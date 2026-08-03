import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCUoC5ToBa8WyVUxMr5ex9C86wwQiiyMlE",
  authDomain: "internarea-839f7.firebaseapp.com",
  projectId: "internarea-839f7",
  storageBucket: "internarea-839f7.firebasestorage.app",
  messagingSenderId: "1004145145",
  appId: "1:1004145145:web:a39ae1e3d3b03f261fd528",
  measurementId: "G-ZTMY1PW6TN"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, analytics };
