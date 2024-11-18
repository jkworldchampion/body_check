'use client';
import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firestore/firebase'; // Firestore 초기화 파일
import useAuthStore from '@/store/useAuthStore'; // Zustand 상태 관리
import styles from './login.module.css'; // 스타일 파일
import Link from 'next/link';
import LogoText from '@/app/componenets/logoText'; // 로고 컴포넌트

const Login: FC = () => {
    const { login } = useAuthStore(); // Zustand의 로그인 함수 가져오기
    const [id, setId] = useState(''); // 사용자 ID 입력 상태
    const [password, setPassword] = useState(''); // 비밀번호 입력 상태
    const [error, setError] = useState<string | null>(null); // 에러 메시지 상태
    const router = useRouter();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null); // 에러 상태 초기화

        try {
            // Firestore에서 사용자 조회 쿼리 실행
            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where('id', '==', id), where('password', '==', password));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Firestore에 사용자 존재 -> Zustand 상태 업데이트 및 대시보드 이동
                login(id); // Zustand 상태 업데이트
                router.push('/dashboard'); // 대시보드로 이동
            } else {
                // Firestore에서 사용자 정보를 찾을 수 없음
                setError('아이디 또는 비밀번호가 잘못되었습니다.');
            }
        } catch (error) {
            console.error('로그인 중 오류 발생:', error);
            setError('로그인 중 문제가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div className={styles.container}>
            <LogoText text="BODY : CHECK" />
            <h2 className={styles.subtitle}>로그인</h2>
            <hr className={styles.line} />

            <form className={styles.form} onSubmit={handleLogin}>
                {/* ID 입력 필드 */}
                <div className={styles.field}>
                    <label className={styles.inputlabel}>아이디</label>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                {/* 비밀번호 입력 필드 */}
                <div className={styles.field}>
                    <label className={styles.inputlabel}>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <hr className={styles.line} />

                {/* 로그인 버튼 */}
                <button type="submit" className={styles.loginButton}>
                    로그인
                </button>

                {/* 에러 메시지 */}
                {error && <p className={styles.error}>{error}</p>}

                {/* 기타 로그인 옵션 */}
                <Link href="/notfound">
                    <button type="button" className={styles.emailButton}>
                        이메일로 로그인
                    </button>
                </Link>
            </form>

            <hr />

            {/* 계정 찾기 및 가입 링크 */}
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
