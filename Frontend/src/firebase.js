// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBeO_tcf-zEUkMXNnwWXfVqS8h8amLjlsc",
  authDomain: "campus-utilities.firebaseapp.com",
  projectId: "campus-utilities",
  storageBucket: "campus-utilities.firebasestorage.app",
  messagingSenderId: "1061416190540",
  appId: "1:1061416190540:web:49c45c223a6fd761be6ae9",
  measurementId: "G-0X77QFRR36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }; 