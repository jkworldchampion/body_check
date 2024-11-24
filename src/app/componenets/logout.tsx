"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

const LogoutButton: React.FC = () => {
    const logout = useAuthStore((state) => state.logout); // zustand의 로그아웃 함수
    const router = useRouter(); // Next.js router

    const handleLogout = () => {
        logout(); // Zustand 상태 초기화 (로그아웃)
        router.push("/Login"); // /login 페이지로 이동
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
            로그아웃
        </button>
    );
};

export default LogoutButton;
