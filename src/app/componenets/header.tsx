"use client";

import React from "react";
import { FaBars } from "react-icons/fa";
import { useRouter } from "next/navigation";
import  useAuthStore  from "../../store/useAuthStore"; // Zustand 스토어
import styles from "./Header.module.css";
import LogoText from "@/app/componenets/logoText";

interface HeaderProps {
    toggleSidebar: () => void; // 사이드바 토글 핸들러
}


export default function Header({ toggleSidebar }: HeaderProps) {
    const router = useRouter();
    const { isAuthenticated, logout } = useAuthStore(); // Zustand 상태 및 메서드

    const handleLogout = () => {
        logout(); // Zustand에서 로그아웃 처리
        router.push("/Login"); // 로그아웃 페이지로 이동
    };

    const handleNavigation = () => {
        router.push("/dashboard");
    };

    return (
        <header className={styles.header}>
            {/* 햄버거 버튼 */}
            <button
                onClick={toggleSidebar}
                className={styles.menuButton}
                aria-label="메뉴 열기"
            >
                <FaBars size={24} />
            </button>

            {/* 로고 */}
            <LogoText text={"BODY : CHECK"} />

            {/* 네비게이션 */}
            <nav className={styles.nav}>
                {isAuthenticated ? (
                    <>
                        <button onClick={handleNavigation}>마이페이지</button>
                        <button onClick={handleLogout} className={styles.navButton}>
                            로그아웃
                        </button>
                    </>
                ) : (
                    <>
                        <a href="/login" className={styles.navButton}>
                            로그인
                        </a>
                        <a href="/inquiry" className={styles.navButton}>
                            문의사항
                        </a>
                    </>
                )}
            </nav>
        </header>
    );
}
