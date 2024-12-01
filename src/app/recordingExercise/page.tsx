"use client";
import DashboardLayout from "@/app/componenets/dashboardLayout";
import React, {useEffect, useState} from "react";
import styles from "@/app/dashboard/dashboard.module.css";
import useAuthStore from "@/store/useAuthStore";
import {doc, getDoc} from "firebase/firestore";
import {firestore} from "@/app/firestore/firebase";


export default function RecordingExercise() {
    const userId = useAuthStore((state) => state.userId); // Zustand에서 로그인된 사용자 ID 가져오기
    const [userName, setUserName] = useState<string | null>(null); // 사용자 이름 상태

    const fetchUserName = async () => {
        if (!userId) return;

        try {
            const userDoc = await getDoc(doc(firestore, 'users', userId));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserName(data.name); // Firestore의 이름 데이터를 가져옴
            } else {
                console.error('사용자 정보를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('사용자 이름을 가져오는 중 오류가 발생했습니다:', error);
        }
    };

    useEffect(() => {
        fetchUserName();

    }, [userId]);

    return (
        <DashboardLayout>

                <h1 className={styles.introTitle}>
                    안녕하세요 {userName || 'User'} 님!
                </h1>
                <p className={styles.introSubtitle}>오늘의 운동 기록을 확인해보세요! </p>


        </DashboardLayout>


    );
};
