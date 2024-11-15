import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, User } from "firebase/auth";
import { auth, actionCodeSettings } from './firebase';

/*
 * 이메일과 비밀번호로 회원가입
 * @param email 사용자 이메일
 * @param password 사용자 비밀번호
 * @param id 사용자 id
 */

export const signUpWithEmail = async (email: string, password: string, ) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user; // 회원가입한 사용자 객체 반환
    } catch (error) {
        console.error("회원가입 실패:", error);
        throw error;
    }
};

/**
 * 이메일 인증 링크 전송
 * @param user Firebase 사용자 객체
 */
export const sendVerificationEmail = async (user: User) => {
    try {
        await sendEmailVerification(user, actionCodeSettings);
        console.log("인증 이메일 전송 완료:", user.email);
    } catch (error) {
        console.error("이메일 인증 전송 실패:", error);
        throw error;
    }
};
