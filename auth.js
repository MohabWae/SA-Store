import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase";

// إنشاء حساب جديد
export const signupUser = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// تسجيل الدخول
export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// تسجيل الخروج
export const logoutUser = async () => {
  return await signOut(auth);
};

// متابعة حالة تسجيل الدخول
export const watchAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};