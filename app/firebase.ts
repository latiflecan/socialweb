// firebase.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyANuo-i9dr9NRZGIej_WevsSmNL4TI1L8Q",
  authDomain: "latifsocial-70853.firebaseapp.com",
  projectId: "latifsocial-70853",
  storageBucket: "latifsocial-70853.appspot.com",
  messagingSenderId: "991636329075",
  appId: "1:991636329075:web:7b7c9e3f7ec30dc50ad006"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
