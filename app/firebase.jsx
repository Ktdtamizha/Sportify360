import { initializeApp, getApps } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
export default firebaseConfig = {
  apiKey: "AIzaSyDoOHztepbM5OIGapZEPPUcW69xB2R52x0",
  authDomain: "sportifylogin-5fc30.firebaseapp.com",
  projectId: "sportifylogin-5fc30",
  storageBucket: "sportifylogin-5fc30.appspot.com", // Fix the incorrect storage bucket domain
  messagingSenderId: "432220010392",
  appId: "1:432220010392:web:cb41803b0d755a446c9ded"
};

// Initialize Firebase app (only if not already initialized)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

// Export Firebase services correctly
export { app, auth, db };
