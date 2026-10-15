import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyANnfB28OeOzKCwhJ0d5frh9NyzqP9DweI",
  authDomain: "selectmyflight-f0c2b.firebaseapp.com",
  projectId: "selectmyflight-f0c2b",
  storageBucket: "selectmyflight-f0c2b.firebasestorage.app",
  messagingSenderId: "742998492643",
  appId: "1:742998492643:web:64e14ff0dc59493928ccd6",
  measurementId: "G-176MED24H1"
};

// Initialize Firebase safely without duplicate initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup };
export default app;
