"use client";

import React from "react";
import Link from "next/link";
import styles from "./sidebar.module.css";
import {FaHome, FaChartBar, FaMoon, FaBicycle} from "react-icons/fa";

interface SidebarProps {
    isOpen: boolean; // 사이드바 열림/닫힘 상태
    onClose: () => void; // 닫기 핸들러
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <>
            {isOpen && (
                <div className={styles.overlay} onClick={onClose}></div>
            )}

            <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
                <button onClick={onClose} className={styles.closeButton}>
                    ✕
                </button>
                <nav>
                    <ul className={styles.sidebarList}>
                        <li className={styles.sidebarLists}>
                            <Link href="/dashboard" onClick={onClose}>
                                <FaHome className="mr-2" />
                                 운동기록 보기
                            </Link>
                        </li>
                        <li className={styles.sidebarLists}>
                            <Link href="/changeBody" onClick={onClose}>
                                <FaChartBar className="mr-2" />
                                체형변화 사진 보기
                            </Link>
                        </li>
                        <li className={styles.sidebarLists}>
                            <Link href="/tracking" onClick={onClose}>
                                <FaBicycle className="mr-2" />
                                실시간 운동 트래킹
                            </Link>
                        </li>
                        <li className={styles.sidebarLists}>
                            <button
                                onClick={() => alert("다크모드 준비 중입니다!")}
                                className="flex items-center"
                            >
                                <FaMoon className="mr-2" />
                                다크모드
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}
