// src/app/signup/page.tsx
/*
'use client'
import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithEmail, sendVerificationEmail } from '../../firestore/auth';
import { addUserData } from '../../firestore/firestore';
import { auth } from '../../firestore/firebase';

const businessSignup: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 상태
    const [user, setUser] = useState<any | null>(null); // 회원가입 후의 사용자 객체 저장
    const router = useRouter();

    // 이메일 인증 요청 함수
    const handleSendVerificationEmail = async () => {
        setError(null);
        setMessage(null);

        if (!email) {
            setError("이메일을 입력해 주세요.");
            return;
        }

        try {
            // 임시 사용자 등록 후 이메일 인증 링크 전송
            const newUser = await signUpWithEmail(email, "temporary_password"); // 임시 비밀번호로 사용자 생성
            if (newUser) {
                setUser(newUser);
                await sendVerificationEmail(newUser);
                setMessage('이메일 인증 링크가 전송되었습니다. 이메일을 확인하여 인증을 완료해 주세요.');
            } else {
                setError("이메일 인증 요청에 실패하였습니다. 다시 시도해주세요!");
            }
        } catch (error) {
            console.error("이메일 인증 요청 오류:", error);
            setError("이메일 인증 중 문제가 발생했습니다.");
        }
    };

    // 이메일 인증 상태 확인 함수
    const checkEmailVerification = async () => {
        setError(null);
        setMessage(null);

        try {
            await auth.currentUser?.reload(); // Firebase에서 사용자 정보 갱신
            if (auth.currentUser?.emailVerified) {
                setIsEmailVerified(true); // 이메일 인증 완료 상태로 설정
                setMessage("이메일 인증이 완료되었습니다. 비밀번호를 설정해 주세요.");
            } else {
                setError("이메일 인증이 완료되지 않았습니다. 이메일을 확인해 주세요.");
            }
        } catch (error) {
            console.error("이메일 인증 확인 오류:", error);
            setError("이메일 인증 상태 확인 중 문제가 발생했습니다.");
        }
    };

    // 최종 회원가입 처리 함수
    const handleCompleteSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!isEmailVerified) {
            setError("이메일 인증이 완료되지 않았습니다.");
            return;
        }

        try {
            // Firestore에 유저 데이터 저장
            await addUserData(auth.currentUser?.uid!, { email });
            setMessage("회원가입이 완료되었습니다! 로그인해 주세요.");
            router.push('/login'); // 로그인 페이지로 이동
        } catch (error) {
            console.error("회원가입 완료 처리 중 오류:", error);
            setError("회원가입 완료 중 문제가 발생했습니다. 다시 시도해 주세요.");
        }
    };

    return (
        <div>
            <h1>회원가입 페이지</h1>

            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isEmailVerified} // 이메일 인증 완료 후 비활성화
                />
                {!isEmailVerified && (
                    <button onClick={handleSendVerificationEmail}>
                        이메일 인증 받기
                    </button>
                )}
            </div>

            {user && !isEmailVerified && (
                <button onClick={checkEmailVerification}>
                    이메일 인증 완료 확인
                </button>
            )}
            <form onSubmit={handleCompleteSignup}>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">회원가입 완료</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default businessSignup;
*/

