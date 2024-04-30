import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const config = {
  clientId: process.env.REACT_APP_FIREBASE_CLIENT_ID,
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-R2HLT073YF",
  appName: "Hash 7 - CRM"
};

const firebase_app = initializeApp(config);

export const db = getFirestore(firebase_app);
export const auth = getAuth(firebase_app);
//export const storage = getStorage(firebase_app);
//export const app = firebase_app;
//export const provider = new GoogleAuthProvider();
export default firebase_app;