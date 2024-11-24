'use client';

import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firestore/firebase'; // Firebase 초기화 파일
import useAuthStore from '@/store/useAuthStore'; // Zustand 상태 관리
import Cookies from 'js-cookie'; // 클라이언트 쿠키 라이브러리
import styles from './login.module.css'; // 스타일 파일
import Link from 'next/link';
import LogoText from '@/app/componenets/logoText';

const Login: FC = () => {
    const { login } = useAuthStore(); // Zustand의 로그인 상태 함수
    const [id, setId] = useState(''); // 사용자 ID
    const [password, setPassword] = useState(''); // 사용자 비밀번호
    const [error, setError] = useState<string | null>(null); // 에러 메시지
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태
    const router = useRouter();

    // 로그인 핸들러
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null); // 에러 초기화
        setIsLoading(true); // 로딩 상태 시작

        try {
            // Firestore에서 사용자 확인
            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where('id', '==', id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const user = querySnapshot.docs[0].data();
                if (user && user.password === password) {
                    // Zustand 로그인 상태 업데이트
                    login(id);

                    // 쿠키 설정
                    Cookies.set('isAuthenticated', 'true', {
                        expires: 7, // 7일 유효
                        secure: process.env.NODE_ENV === 'production', // HTTPS 환경에서만 활성
                        sameSite: 'Strict', // SameSite 보안 설정
                        path: '/', // 전역 경로 유효
                    });
                    Cookies.set('userId', id, {
                        expires: 7,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'Strict',
                        path: '/',
                    });

                    // 대시보드 페이지로 이동
                    router.push('/dashboard');
                } else {
                    setError('아이디 또는 비밀번호가 잘못되었습니다.');
                }
            } else {
                setError('아이디 또는 비밀번호가 잘못되었습니다.');
            }
        } catch (err) {
            console.error('로그인 중 오류 발생:', err);
            setError('로그인 중 문제가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false); // 로딩 상태 종료
        }
    };

    return (
        <div className={styles.container}>
            <LogoText text="BODY : CHECK" />
            <h2 className={styles.subtitle}>로그인</h2>
            <hr className={styles.line} />

            <form className={styles.form} onSubmit={handleLogin}>
                {/* 사용자 ID 입력 */}
                <div className={styles.field}>
                    <label className={styles.inputlabel}>아이디</label>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => {
                            setId(e.target.value);
                            setError(null);
                        }}
                        required
                        className={styles.input}
                    />
                </div>

                {/* 사용자 비밀번호 입력 */}
                <div className={styles.field}>
                    <label className={styles.inputlabel}>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(null);
                        }}
                        required
                        autoComplete="current-password"
                        className={styles.input}
                    />
                </div>

                <hr className={styles.line} />

                {/* 로그인 버튼 */}
                <button type="submit" className={styles.loginButton} disabled={isLoading}>
                    {isLoading ? '로그인 중...' : '로그인'}
                </button>

                {/* 에러 메시지 */}
                {error && <p className={styles.error}>{error}</p>}

                {/* 이메일로 로그인 */}
                <Link href="/notfound">
                    <button type="button" className={styles.emailButton}>
                        이메일로 로그인
                    </button>
                </Link>
            </form>

            <hr />

            {/* 계정 찾기 및 가입 */}
            <div className={styles.findAccount}>
                <Link href="/signup">
                    <p className={styles.firstMeet}>서비스가 처음이신가요?</p>
                </Link>
                <section className={styles.rightLinks}>
                    <Link href="/findAccount">
                        <p className={styles.firstMeet}>아이디 찾기</p>
                    </Link>
                    <span className={styles.firstMeet}>|</span>
                    <Link href="/findAccount">
                        <p className={styles.firstMeet}>비밀번호 찾기</p>
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default Login;
