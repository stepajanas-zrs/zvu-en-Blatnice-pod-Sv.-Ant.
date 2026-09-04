import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase konfigurace - automaticky nastaveno pro Blatnickou rezervaci
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoKeyForLocalDevelopment",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "blatnice-rezervace.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "blatnice-rezervace",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "blatnice-rezervace.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000"
};

// Inicializace Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Logování pro debug
if (typeof window !== 'undefined') {
  console.log('🔥 Firebase inicializován:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
  });
}

export { app, db };
