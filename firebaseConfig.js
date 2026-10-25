// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  authDomain: "appfilmes-d140b.firebaseapp.com",
  databaseURL: "https://appfilmes-d140b-default-rtdb.firebaseio.com",
  projectId: "appfilmes-d140b",
  storageBucket: "appfilmes-d140b.firebasestorage.app",
  messagingSenderId: "367924037570",
  appId: "1:367924037570:web:4745976bd1a8044d2b785b",
  measurementId: "G-HPVG0RRB8W"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);