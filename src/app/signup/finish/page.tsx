// src/app/signup/finish/page.tsx
// 인증 완료 후에 리다이렉션 하기
// 아직 호스팅을 안해서 리다이렉션 불가능 한듯
'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../firestore/firebase';

const FinishSignUp = () => {
    const router = useRouter();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                await auth.currentUser?.reload(); // 인증 상태 새로고침
                if (auth.currentUser?.emailVerified) {
                    router.push('/login'); // 인증 완료 후 회원가입 페이지로 이동
                } else {
                    alert('이메일 인증이 완료되지 않았습니다. 이메일을 다시 확인해 주세요.');
                }
            } catch (error) {
                console.error("인증 확인 오류:", error);
            }
        };

        verifyEmail();
    }, [router]);

    return (
        <div>
            <h1>이메일 인증 확인 중...</h1>
        </div>
    );
};

export default FinishSignUp;
