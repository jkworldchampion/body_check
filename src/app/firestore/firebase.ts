// src/firestore/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { setPersistence, browserLocalPersistence } from "firebase/auth";




// Firebase 설정 객체
const firebaseConfig = {
    apiKey: "AIzaSyA26i3f-AcLDwS7OYZe_WX_YywbrdizUp8",
    authDomain: "bodycheck-e75b2.firebaseapp.com",
    projectId: "bodycheck-e75b2",
    storageBucket: "bodycheck-e75b2.appspot.com",
    messagingSenderId: "568418655449",
    appId: "1:568418655449:web:45335ac48599fbcbc6b2c8",
    measurementId: "G-JZP73GSNYJ",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);


// Analytics 초기화
let analytics = null;


setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Firebase 인증 세션이 로컬 스토리지에 저장되었습니다.");
    })
    .catch((error) => {
        console.error("Firebase 인증 지속성 설정 오류:", error);
    });

if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
            console.log("Firebase Analytics 초기화 성공");
        } else {
            console.warn("Firebase Analytics는 지원되지 않는 환경입니다.");
        }
    });
}

export { app, auth, firestore, analytics };
