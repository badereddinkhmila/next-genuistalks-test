// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GithubAuthProvider, GoogleAuthProvider, TwitterAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(firebase);
// Initialize Firebase Firestore
export const firestore = getFirestore();

// Initialise Social Logins
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({prompt: 'select_account'});
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

const githubProvider = new GithubAuthProvider();
githubProvider.addScope('repo');
export const signInWithGithub = () => signInWithPopup(auth, githubProvider);

const twitterProvider = new TwitterAuthProvider();
export const signInWithTwitter = () => signInWithPopup(auth, twitterProvider);

export default firebase;
