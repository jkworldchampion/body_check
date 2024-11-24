"use client";

import React from "react";
import { FaBars } from "react-icons/fa";
import styles from "./Header.module.css";
import LogoText from "@/app/componenets/logoText";

interface HeaderProps {
    toggleSidebar: () => void; // 사이드바 토글 핸들러
    isLoggedIn: boolean; // 로그인 상태
    onLogout: () => void; // 로그아웃 핸들러
}

export default function Header({ toggleSidebar, isLoggedIn, onLogout }: HeaderProps) {
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
            <LogoText  text={'BODY : CHECK'}/>

            {/* 네비게이션 */}
            <nav className={styles.nav}>
                {isLoggedIn ? (
                    <>
                        <a href="/dashboard">마이페이지</a>
                        <button onClick={onLogout} className={styles.navButton}>
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
