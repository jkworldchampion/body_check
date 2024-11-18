'use client';
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/app/firestore/firebase';
import withAuth from '../hoc/withAuth';
import useAuthStore from '@/store/useAuthStore';

const DashboardPage = () => {
    const userId = useAuthStore((state) => state.userId); // Zustand에서 로그인된 사용자 ID 가져오기
    const [userName, setUserName] = useState<string | null>(null); // 사용자 이름 상태

    useEffect(() => {
        const fetchUserName = async () => {
            if (!userId) return;

            try {
                // Firestore에서 사용자 데이터 가져오기
                const userDoc = await getDoc(doc(firestore, 'users', userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserName(userData.name); // 사용자 이름 설정
                } else {
                    console.error('정보없음.');
                }
            } catch (error) {
                console.error('에러:', error);
            }
        };

        fetchUserName();
    }, [userId]);

    if (!userId) return <p>로딩중...</p>;

    return (
        <div>
            <h1>안녕하세요, {userName || 'User'}!</h1>
            <p>오늘도 운동하러 오셨군요 .</p>
        </div>
    );
};

export default withAuth(DashboardPage);
