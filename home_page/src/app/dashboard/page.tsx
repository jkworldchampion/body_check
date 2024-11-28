'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/app/componenets/dashboardLayout';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/app/firestore/firebase';
import useAuthStore from '@/store/useAuthStore';
import Chart from '../componenets/Chart'; // 차트 컴포넌트 import
import styles from './dashboard.module.css';

const Dashboard = () => {
    const userId = useAuthStore((state) => state.userId); // Zustand에서 로그인된 사용자 ID 가져오기
    const [userName, setUserName] = useState<string | null>(null); // 사용자 이름 상태
    const [workoutData, setWorkoutData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const fetchWorkoutData = async () => {
        try {
            const workoutRef = collection(firestore, 'workout_sessions');
            const q = query(workoutRef, where('user_id', '==', userId)); // 사용자 ID로 필터링
            const querySnapshot = await getDocs(q);

            const fetchedData: any[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedData.push(data);
            });

            setWorkoutData(fetchedData);
        } catch (error) {
            console.error('운동 데이터를 가져오는 중 오류가 발생했습니다:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserName();
        fetchWorkoutData();
    }, [userId]);

    if (isLoading) return <p className="text-center text-gray-500">로딩 중...</p>;

    return (
        <DashboardLayout>
            <div className={`${styles.introBox} mb-6`}>
                <h1 className={styles.introTitle}>
                    안녕하세요 {userName || 'User'} 님! 👋
                </h1>
                <p className={styles.introSubtitle}>오늘의 운동 기록을 확인해보세요! </p>
            </div>

            {/* 차트 렌더링 */}
            <Chart workoutData={workoutData} />
        </DashboardLayout>
    );
};

export default Dashboard;
