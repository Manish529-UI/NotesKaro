import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // <-- FIX: GoogleAuthProvider yahan import karna zaroori tha

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "authlumina.firebaseapp.com",
  projectId: "authlumina",
  storageBucket: "authlumina.firebasestorage.app",
  messagingSenderId: "843155600357",
  appId: "1:843155600357:web:a6a9e8ace2df3c1cc4f50c"
};

const app = initializeApp(firebaseConfig);

// <-- FIX: Direct export const use karo taaki Auth.jsx me {} ke sath perfectly chal jaye
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();