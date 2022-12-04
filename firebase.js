// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB20R_m9uj4ppZFw2MNpJbFT0l29uJH02s",
    authDomain: "ikasi-b1dd8.firebaseapp.com",
    projectId: "ikasi-b1dd8",
    storageBucket: "ikasi-b1dd8.appspot.com",
    messagingSenderId: "299075589888",
    appId: "1:299075589888:web:02715499db364d135685e5"
  };

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();


//update firestore settings
firestore.settings({timestampsInSnapshots: true});

