// 이메일 로직을 위한 건데... 오류가 너무 많이 나서 일단 뺌
import { useRouter } from 'next/navigation';
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { auth } from '../firestore/firebase';

export const useSignupHandlers = () => {
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState(''); // password 상태 추가
    const [confirmPassword, setConfirmPassword] = useState(''); // confirmPassword 상태 추가
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isSignupComplete, setIsSignupComplete] = useState(false);
    const [types, setTypes] = useState<number[]>([]);
    const router = useRouter();

    // 추가한 clearMessage와 clearError 함수
    const clearMessage = () => setMessage(null);
    const clearError = () => setError(null);

    useEffect(() => {
        // 이메일 링크를 통해 돌아왔는지 확인
        if (isSignInWithEmailLink(auth, window.location.href)) {
            const storedEmail = Cookies.get('emailForSignIn');
            if (storedEmail) {
                setEmail(storedEmail);
                // 이메일 링크를 통해 인증 처리
                signInWithEmailLink(auth, storedEmail, window.location.href)
                    .then(() => {
                        setIsEmailVerified(true);
                        setMessage("이메일 인증이 완료되었습니다.");
                        Cookies.remove('emailForSignIn'); // 인증 후 쿠키 삭제
                    })
                    .catch((error: any) => {
                        console.error("이메일 인증 오류:", error);
                        setError("이메일 인증 중 오류가 발생했습니다.");
                    });
            } else {
                setError("이메일이 확인되지 않았습니다. 다시 시도해주세요.");
            }
        }
    }, [router]);

    const handleSendVerificationEmail = async () => {
        setError(null);
        setMessage(null);

        if (!email) {
            setError('이메일을 입력해 주세요.');
            return;
        }

        const actionCodeSettings = {
            url: 'http://localhost:3001/signup',
            handleCodeInApp: true,
        };

        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            Cookies.set('emailForSignIn', email, { path: '/' }); // 쿠키에 이메일 저장
            setMessage('인증 이메일이 전송되었습니다. 이메일을 확인하여 인증 링크를 클릭해 주세요.');
        } catch (error) {
            console.error('이메일 전송 오류:', error);
            setError('이메일 전송 중 문제가 발생했습니다.');
        }
    };

    const handleCompleteSignup = (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        if (!isEmailVerified) {
            setError('이메일 인증이 완료되지 않았습니다.');
            return;
        }

        // 추가 사용자 정보 저장 로직 작성
        setIsSignupComplete(true);
        setTimeout(() => router.push('/login'), 2000); // 2초 후 로그인 페이지로 이동
    };

    return {
        states: {
            email, id, name, gender, types,address, password, confirmPassword,
            error, message, isEmailVerified, isSignupComplete
        },
        handlers: {
            setEmail, setId, setName, setTypes,setGender, setAddress,
            setPassword, setConfirmPassword, // 비밀번호 관련 핸들러 추가
            handleSendVerificationEmail, handleCompleteSignup,
            clearMessage, // clearMessage 추가
            clearError    // clearError 추가
        }
    };
};
