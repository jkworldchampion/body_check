"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, login } = useAuthStore();

    useEffect(() => {
        // 쿠키 읽기
        const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
            const [key, value] = cookie.split("=");
            acc[key] = value;
            return acc;
        }, {} as Record<string, string>);

        // 쿠키와 Zustand 상태 동기화
        if (cookies.isAuthenticated === "true" && !isAuthenticated) {
            login(cookies.userId); // Zustand 상태 업데이트
        }

        // 비로그인 상태 처리
        if (cookies.isAuthenticated !== "true") {
            router.replace("/Login");
        }
    }, [isAuthenticated, login, router]);

    // 로그인 상태 확인 중
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
