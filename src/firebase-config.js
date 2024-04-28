import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY + '',
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: "hash-7",
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: "G-R2HLT073YF",
  name: "Hash 7 - CRM"
};

export const config = {
  // GCP OAuth2.0
  apiKey: process.env.REACT_APP_API_KEY,
  clientId: process.env.REACT_APP_CLIENT_ID,
  appName: "Hash 7 - CRM",
  serverBackendUrl: process.env.REACT_APP_SERVER_URL
};

const firebase_app = initializeApp(firebaseConfig);
export const db = getFirestore(firebase_app);
export const auth = getAuth(firebase_app);
export const provider = new GoogleAuthProvider();
export default firebase_app;