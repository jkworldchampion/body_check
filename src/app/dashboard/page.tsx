'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/app/componenets/dashboardLayout';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/app/firestore/firebase';
import useAuthStore from '@/store/useAuthStore';
import { useUserStore } from '@/store/userStore'; // Zustand에서 사용자 데이터 가져오기
import Chart from '../componenets/Chart'; // 기존 운동 기록 차트 컴포넌트
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import headerStyles from '@/app/utils/headerStyles';

// Chart.js 플러그인 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

const Dashboard = () => {
    const userId = useAuthStore((state) => state.userId); // Zustand에서 로그인된 사용자 ID 가져오기
    const { userData, fetchUser, isLoading: isUserLoading } = useUserStore(); // Zustand 상태
    const [userName, setUserName] = useState<string | null>(null); // 사용자 이름 상태
    const [workoutData, setWorkoutData] = useState<any[]>([]); // 운동 데이터
    const [isLoading, setIsLoading] = useState(true); // 운동 데이터 로딩 상태

    // Firestore에서 사용자 이름 가져오기
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

    // Firestore에서 운동 데이터 가져오기
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

    // 상태가 바뀔 때 렌더링 될 것들..
    // 만약에 데이터가 없으면 렌더링 될 텍스트
    useEffect(() => {
        fetchUserName();
        fetchWorkoutData();
        if (!userData && typeof userId === 'string') {
            fetchUser(userId);
        }
    }, [userId, fetchUser, userData]);

    if (isLoading || isUserLoading) return <p className="text-center text-gray-500">데이터를 불러오는 중입니다...</p>;




    // @ts-ignore
    // @ts-ignore
    return (
        <DashboardLayout>
            {/* 운동 기록 */}
            <div>
                <h1 style={headerStyles.introTitle}>
                    안녕하세요 {userName || 'User'} 님! 👋
                </h1>
                <p style={headerStyles.introSubTitle}>
                    오늘의 운동 기록을 확인해보세요!
                </p>
                <Chart workoutData={workoutData} />
            </div>

            {/* 체형 분석 */}

        </DashboardLayout>
    );
};

export default Dashboard;
