import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// NOTE: These are placeholder/demo values. For production use:
// 1. Create a Firebase project at https://console.firebase.google.com/
// 2. Enable Authentication and Firestore
// 3. Get your config from Project Settings > General > Your apps
// 4. Replace these values with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD70AJnc2I4uOxUs51VjWWznEesliiHwtw",
  authDomain: "pillmatrix.firebaseapp.com",
  projectId: "pillmatrix",
  storageBucket: "pillmatrix.firebasestorage.app",
  messagingSenderId: "345780155851",
  appId: "1:345780155851:web:a999c5f6f357cc4539324e",
  measurementId: "G-J0LV2DDE1Q"
};

// Initialize Firebase - check if already initialized to avoid duplicate app error
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Cloud Storage
export const storage = getStorage(app);

export default app;
