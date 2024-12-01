// src/firestore/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported} from "firebase/analytics";
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
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

// 이메일 인증 링크 설정 후에 리다이렉트 할 페이지 인증 설정
/*
export const actionCodeSettings = {
    url: 'https://bodycheck-e86de.firebaseapp.com/signup/finish',
    handleCodeInApp: true,
};
*/

/*

// 이메일 링크 인증 설정
export const actionCodeSettings = {
    //url: 'https://bodycheck-e86de.firebaseapp.com/signup',
    url: 'http://localhost:3001/signup',
    handleCodeInApp: true,
};
*/

// Analytics 초기화 (브라우저 환경에서만)

// @ts-ignore
let analytics: ReturnType<typeof getAnalytics> | null = null;

if (typeof window !== "undefined") {
    // 브라우저 환경인지 확인
        isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
            console.log("firebae 오류.");
        } else {
            console.warn("Firebase Analytics 오류.");
        }
    });
}


export { app, analytics, auth, firestore };
