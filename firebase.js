import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCai1yYu2E1V9FJIRyOhNzPBJ_hH4XORjg",
  authDomain: "sa-store-babc5.firebaseapp.com",
  projectId: "sa-store-babc5",
  storageBucket: "sa-store-babc5.firebasestorage.app",
  messagingSenderId: "199662682339",
  appId: "1:199662682339:web:61d4ce2e9904eb8cc5c5d6",
  measurementId: "G-JW6LBX5JMK",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);