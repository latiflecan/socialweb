import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyANuo-i9dr9NRZGIej_WevsSmNL4TI1L8Q",
  authDomain: "latifsocial-70853.firebaseapp.com",
  projectId: "latifsocial-70853",
  storageBucket: "latifsocial-70853.appspot.com",
  messagingSenderId: "991636329075",
  appId: "1:991636329075:web:7b7c9e3f7ec30dc50ad006"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
