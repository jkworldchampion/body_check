'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/app/firestore/firebase';
import useAuthStore from '@/store/useAuthStore';
import DashboardLayout from '@/app/componenets/dashboardLayout';
import Chart from '@/app/componenets/Chart';

interface WorkoutSet {
    reps: number;
    weight: string;
}

interface WorkoutSession {
    workout_type: string;
    sets: WorkoutSet[];
    date: string;
}

const Dashboard = () => {
    const userId = useAuthStore((state) => state.userId);
    const [userName, setUserName] = useState<string | null>(null);
    const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
    const [targetReps, setTargetReps] = useState<{ [key: string]: number }>({
        benchpress: 10,
        squat: 10,
        deadlift: 10,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserName = async () => {
        try {
            // @ts-ignore
            const userDoc = await getDoc(doc(firestore, 'users', userId));
            if (userDoc.exists()) {
                setUserName(userDoc.data().name);
            }
        } catch {
            console.error('사용자 이름 가져오기 오류');
        }
    };

    const fetchWorkoutSessions = async () => {
        try {
            const q = query(collection(firestore, 'workout_sessions'), where('user_id', '==', userId));
            const snapshot = await getDocs(q);
            const sessions = snapshot.docs.map((doc) => doc.data() as WorkoutSession);
            setWorkoutSessions(sessions);
        } catch {
            console.error('운동 세션 가져오기 오류');
        }
    };

    const updateTargetReps = (workoutType: string, newTarget: number) => {
        setTargetReps((prev) => ({ ...prev, [workoutType]: newTarget }));
    };

    useEffect(() => {
        fetchUserName();
        fetchWorkoutSessions();
        setIsLoading(false);
    }, [userId]);

    if (isLoading) {
        return <p className="text-center text-gray-500">데이터를 불러오는 중입니다...</p>;
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6 grid grid-cols-12 gap-6">
                <aside className="col-span-3 bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-4">운동 요약</h2>
                    <ul>
                        <li>총 세션: <span className="font-bold">{workoutSessions.length}</span></li>
                        <li>사용자: <span className="font-bold">{userName || '미정'}</span></li>
                    </ul>
                </aside>

                <main className="col-span-9 space-y-8">
                    <header className="bg-white p-4 rounded-lg shadow mb-6">
                        <h1 className="text-3xl font-bold">안녕하세요 {userName || '회원'}님 👋</h1>
                        <p className="text-lg text-gray-600">오늘의 운동 기록을 확인하세요!</p>
                    </header>

                    <Chart
                        workoutData={workoutSessions}
                        targetReps={targetReps}
                        onUpdateTargetReps={updateTargetReps}
                    />
                </main>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
