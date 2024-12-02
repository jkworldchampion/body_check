"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { auth } from "@/app/firestore/firebase"; // 수정: Firebase 초기화된 auth 객체 가져오기
import { onAuthStateChanged } from "firebase/auth";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, login, logout } = useAuthStore();
    const isInitialized = useRef(false); // 중복 호출 방지용

    useEffect(() => {
        if (isInitialized.current) return; // 이미 초기화된 경우 실행 방지
        isInitialized.current = true;

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Firebase 사용자 인증됨:", user.uid);
                login(user.uid); // Zustand 상태 업데이트
            } else {
                console.log("Firebase 사용자 로그아웃됨");
                logout(); // Zustand 상태 초기화
                router.replace("/Login"); // 로그인 페이지로 리다이렉트
            }
        });

        return () => unsubscribe();
    }, [login, logout, router]);

    if (!isAuthenticated) {
        return <div>로딩 중...</div>;
    }

    return <>{children}</>;
}
