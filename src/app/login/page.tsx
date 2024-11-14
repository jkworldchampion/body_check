// src/app/login/page.tsx
'use client';
import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore } from '../firestore/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import styles from './login.module.css';
import Link from "next/link";
import LogoText from "@/app/componenets/logoText";

const Login: FC = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            // Firestore에서 입력된 ID와 비밀번호로 사용자 조회
            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where('id', '==', id), where('password', '==', password));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // 로그인 성공 - 메인 페이지로 이동
                router.push('/home');
            } else {
                // 로그인 실패 - 에러 메시지 출력
                setError('아이디 또는 비밀번호가 잘못되었습니다.');
            }
        } catch (error) {
            console.error('로그인 중 오류 발생:', error);
            setError('로그인 중 문제가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div className={styles.container}>
            <LogoText text={"BODY : CHECK"} />
            <h2 className={styles.subtitle}>로그인</h2>
            <hr className={styles.line} />

            <form className={styles.form} onSubmit={handleLogin}>
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

                <button type="submit" className={styles.loginButton}>
                    로그인
                </button>

                {error && <p className={styles.error}>{error}</p>}
                <Link href="/notfound">
                    <button className={styles.emailButton}>이메일로 로그인</button>
                </Link>
            </form>

            <hr />

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
