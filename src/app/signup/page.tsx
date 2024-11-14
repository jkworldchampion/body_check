// src/app/signup/page.tsx
'use client'
import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithEmail, sendVerificationEmail } from '../firestore/auth';
import { addUserData } from '../firestore/firestore';
import { auth } from '../firestore/firebase';

const Signup: FC = () => {
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [user, setUser] = useState<any | null>(null);
    const router = useRouter();


    const handleSendVerificationEmail = async () => {
        setError(null);
        setMessage(null);

        if (!email) {
            setError("이메일을 입력해 주세요.");
            return;
        }

        try {

            const newUser = await signUpWithEmail(email, password);
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


    const checkEmailVerification = async () => {
        setError(null);
        setMessage(null);

        try {
            await auth.currentUser?.reload();
            if (auth.currentUser?.emailVerified) {
                setIsEmailVerified(true);
                setMessage("이메일 인증이 완료되었습니다. 비밀번호를 설정해 주세요.");
            } else {
                setError("이메일 인증이 완료되지 않았습니다. 이메일을 확인해 주세요.");
            }
        } catch (error) {
            console.error("이메일 인증 확인 오류:", error);
            setError("이메일 인증 상태 확인 중 문제가 발생했습니다.");
        }
    };

    // Finalize signup
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

            await addUserData(auth.currentUser?.uid!, { email, id });
            setMessage("회원가입이 완료되었습니다! 로그인해 주세요.");
            router.push('/login'); // Redirect to login page
        } catch (error) {
            console.error("회원가입 완료 처리 중 오류:", error);
            setError("회원가입 완료 중 문제가 발생했습니다. 다시 시도해 주세요.");
        }
    };

    return (
        <div>
            <h1>회원가입 페이지</h1>

            <div>
                <label>*이메일:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isEmailVerified} // Disable email input after verification
                />
                {!isEmailVerified && (
                    <button onClick={handleSendVerificationEmail}>
                        이메일 인증 받기
                    </button>
                )}
            </div>

            <div>
                <label>*아이디:</label>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                />
            </div>

            {user && !isEmailVerified && (
                <button onClick={checkEmailVerification}>
                    이메일 인증 완료 확인
                </button>
            )}
            <form onSubmit={handleCompleteSignup}>
                <div>
                    <label>*비밀번호:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>*비밀번호 확인:</label>
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

export default Signup;
