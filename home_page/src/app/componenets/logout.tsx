"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

const LogoutButton: React.FC = () => {
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    const handleLogout = () => {
        // Zustand 상태 초기화
        logout();

        // 리디렉션
        router.replace("/Login");
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
