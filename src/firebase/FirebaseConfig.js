// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { query } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyAP-mZxxpWRE8oejc25BF6At76qv0Q0ic8",
  authDomain: "sabidos-fc654.firebaseapp.com",
  projectId: "sabidos-fc654",
  storageBucket: "sabidos-fc654.firebasestorage.app",
  messagingSenderId: "772561215621",
  appId: "1:772561215621:web:75565099dd2b2ef48b09ec"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { addDoc, collection };
export { onSnapshot };
export { query };

export default app;
