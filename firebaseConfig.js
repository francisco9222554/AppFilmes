import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD46DLy3gSvz8v7yEoaAcXgXZT_dS2pgDs",
  authDomain: "appfilmes-d140b.firebaseapp.com",
  projectId: "appfilmes-d140b",
  storageBucket: "appfilmes-d140b.firebasestorage.app",
  messagingSenderId: "367924037570",
  appId: "1:367924037570:web:4745976bd1a8044d2b785b",
  measurementId: "G-HPVG0RRB8W",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);