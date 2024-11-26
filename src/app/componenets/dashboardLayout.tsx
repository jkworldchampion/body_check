"use client";

import React, { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import styles from "./layout.module.css";
import ProtectedRoute from "@/app/protectedRoute";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className={styles.layoutContainer}>
            <ProtectedRoute isRestricted={true}>
                <Header
                    toggleSidebar={toggleSidebar}
                    isLoggedIn={true}
                    onLogout={() => alert("로그아웃 되었습니다!")}
                />
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                <main
                    className={`${styles.mainContent} ${
                        isSidebarOpen ? styles.shifted : ""
                    }`}
                >
                    {children}
                </main>
            </ProtectedRoute>

        </div>
    );
}
