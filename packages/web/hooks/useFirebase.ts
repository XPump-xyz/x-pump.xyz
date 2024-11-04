import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCecTek01CsDjBgBqdR39agPLY-6ARGmy8",
  authDomain: "zupad-fed4f.firebaseapp.com",
  projectId: "zupad-fed4f",
  storageBucket: "zupad-fed4f.appspot.com",
  messagingSenderId: "9821747683",
  appId: "1:9821747683:web:78cf26382eddb3fd9dc8d6",
  measurementId: "G-B4VG9MBJH1",
};
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage();
