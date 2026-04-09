import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAo1mw-UHPCG860vmTdj_CfqdLeJX8bCLI",
  authDomain: "more-productivity.firebaseapp.com",
  projectId: "more-productivity",
  storageBucket: "more-productivity.firebasestorage.app",
  messagingSenderId: "1015642215031",
  appId: "1:1015642215031:web:d7c90d2f0c539a4885ac72",
  measurementId: "G-PY20TDM9JG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
