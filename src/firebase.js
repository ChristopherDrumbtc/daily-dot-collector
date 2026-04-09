import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ══════════════════════════════════════════════════════
// ISTRUZIONI SETUP:
// 1. Vai su https://console.firebase.google.com
// 2. Crea un nuovo progetto (nome: "dot-collector" o simile)
// 3. Vai su Project Settings > General > Your apps > Web app
// 4. Copia le credenziali qui sotto
// 5. Vai su Authentication > Sign-in method > abilita Google
// 6. Vai su Firestore Database > Create database > Start in test mode
// ══════════════════════════════════════════════════════

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
