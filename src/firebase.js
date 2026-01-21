import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // --- PASTE YOUR FIREBASE KEYS HERE ---
  apiKey: "AIzaSyD5kaN0KzLd4pwEQb5WODAD6VNpWLoAHpg",
  authDomain: "possystem-149d2.firebaseapp.com",
  projectId: "possystem-149d2",
  storageBucket: "possystem-149d2.firebasestorage.app",
  messagingSenderId: "412304351173",
  appId: "1:412304351173:web:683889f51c603d560735ac"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// --- FEATURE: OFFLINE MODE ---
// This keeps the app working even if booth WiFi dies.
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.log('Persistence failed: Multiple tabs open.');
  } else if (err.code == 'unimplemented') {
    console.log('Persistence is not available in this browser.');
  }
});