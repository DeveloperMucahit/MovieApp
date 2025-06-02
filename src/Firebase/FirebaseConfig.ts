import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLWFVOsadK1UwrEycij1fOjzhywa2YLIk",
  authDomain: "movieapp-f6c71.firebaseapp.com",
  projectId: "movieapp-f6c71",
  storageBucket: "movieapp-f6c71.firebasestorage.app",
  messagingSenderId: "788866020194",
  appId: "1:788866020194:web:1e4fabb20a89799981b23b"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
