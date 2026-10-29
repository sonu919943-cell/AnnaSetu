import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBOhzN6sD0PY5FARm3iPGUFU_3B5mzvuO0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "annasetux.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "annasetux",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "annasetux.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "942752877606",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:942752877606:web:3011980cef1a03c8212ae7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
