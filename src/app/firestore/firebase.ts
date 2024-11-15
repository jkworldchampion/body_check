// src/firestore/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase 설정 객체
const firebaseConfig = {
    apiKey: "AIzaSyBryNxpjoIA_9G6kNRXFmKphm8j9pkl7-4",
    authDomain: "bodycheck-e86de.firebaseapp.com",
    databaseURL: "https://bodycheck-e86de-default-rtdb.firebaseio.com",
    projectId: "bodycheck-e86de",
    storageBucket: "bodycheck-e86de.firebasestorage.app",
    messagingSenderId: "309136002804",
    appId: "1:309136002804:web:1af5ee6db441885c0118a1",
    measurementId: "G-EXK9RQJREX"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

// 이메일 인증 링크 설정
/*
export const actionCodeSettings = {
    url: 'https://bodycheck-e86de.firebaseapp.com/signup/finish',
    handleCodeInApp: true,
};
*/

// 이메일 링크 인증 설정
export const actionCodeSettings = {
    //url: 'https://bodycheck-e86de.firebaseapp.com/signup',
    url: 'http://localhost:3001/signup',
    handleCodeInApp: true,
};
export { app, analytics, auth, firestore };
