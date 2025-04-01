import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";   

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdW5NGED46QfeCQNESP3bq4Wyc6hr786w",
  authDomain: "sportify-auth-6d8d5.firebaseapp.com",
  projectId: "sportify-auth-6d8d5",
  storageBucket: "sportify-auth-6d8d5.appspot.com", 
  messagingSenderId: "210341700027",
  appId: "1:210341700027:web:de0e4e12327fbaa896649e",
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
