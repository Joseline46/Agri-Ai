"use client"

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3AadxHpJuGA24Bpq24lL993eqlHUQ5NI",
  authDomain: "agri-ai-e1156.firebaseapp.com",
  projectId: "agri-ai-e1156",
  storageBucket: "agri-ai-e1156.firebasestorage.app",
  messagingSenderId: "242748080363",
  appId: "1:242748080363:web:fc0c0ebc5206ca4517feae"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);


// Initialize Firebase
const app = getApps().length? getApp() : initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app)
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Create a storage reference from our storage service
export const imageDb = getStorage(app);

// http://localhost:3000/api/auth/callback/google

export default app;