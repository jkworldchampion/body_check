// src/app/signup/page.tsx
'use client'
import React, { FC } from 'react';
import { useSignupHandlers } from '../utils/signupUtils';
import styles from './Signup.module.css';

const Signup: FC = () => {
    const {
        states: {
            email, id, password, confirmPassword, name, gender, address,
            error, message, isEmailVerified, isIdUnique, isPasswordValid, isSignupComplete, isFormComplete
        },
        handlers: {
            setEmail, setId, setConfirmPassword, setName, setGender, setAddress,
            handleIdCheck, handleSendVerificationEmail, handlePasswordChange, handleCompleteSignup
        }
    } = useSignupHandlers();

    if (error) {
        alert(error);
    }
    if (message) {
        alert(message);
    }

    if (isSignupComplete) {
        return (
            <div className={styles.welcomeContainer}>
                <h1 className={styles.welcomeTitle}>WELCOME</h1>
                <h2 className={styles.welcomeSubtitle}>BODY : CHECK</h2>
                <p className={styles.welcomeMessage}>회원가입이 완료되었습니다.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>BODY : CHECK</h1>
            <h2 className={styles.subtitle}>회원가입</h2>
            <hr className={styles.line} />

            <form className={styles.form} onSubmit={handleCompleteSignup}>
                <div className={styles.field}>
                    <label className={styles.labelText}>*이메일</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isEmailVerified}
                        className={styles.input}
                        placeholder="이메일을 입력 후 인증을 완료해주세요."
                    />
                    <button
                        type="button"
                        onClick={handleSendVerificationEmail}
                        className={`${styles.button} ${isEmailVerified ? styles.disabled : ''}`}
                        disabled={isEmailVerified}  // 인증이 완료되면 비활성화
                    >
                        인증번호 요청
                    </button>
                    {isEmailVerified && <p className={styles.verified}>인증이 완료되었습니다!</p>}
                </div>

                <div className={styles.field}>
                    <label className={styles.labelText}>*아이디</label>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                        className={styles.input}
                        placeholder="영소문자, 숫자조합으로 입력해주세요"
                        disabled={!isEmailVerified}
                    />
                    <button
                        type="button"
                        onClick={handleIdCheck}
                        className={`${styles.button} ${!isEmailVerified || isIdUnique ? styles.disabled : ''}`}
                        disabled={!isEmailVerified || isIdUnique === false}
                    >
                        중복 확인
                    </button>
                </div>

                <div className={styles.field}>
                    <label className={styles.labelText}>*비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        required
                        className={styles.input}
                        placeholder="비밀번호는 숫자만, 6자리 이상 입력해주세요"
                        disabled={!isEmailVerified}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.labelText}>*비밀번호 확인</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={styles.input}
                        disabled={!isEmailVerified}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.labelText}>*이름</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={styles.input}
                        placeholder="이름을 입력해주세요"
                        disabled={!isEmailVerified}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.labelText}>*성별</label>
                    <div className={styles.genderButtons}>
                        <button
                            type="button"
                            onClick={() => setGender("남")}
                            className={`${styles.genderButton} ${gender === "남" ? styles.selected : ''}`}
                            disabled={!isEmailVerified}
                        >
                            남
                        </button>
                        <button
                            type="button"
                            onClick={() => setGender("여")}
                            className={`${styles.genderButton} ${gender === "여" ? styles.selected : ''}`}
                            disabled={!isEmailVerified}
                        >
                            여
                        </button>
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.labelText}>*주소</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className={styles.input}
                        placeholder="주소를 입력해주세요"
                        disabled={!isEmailVerified}
                    />
                </div>

                <button
                    type="submit"
                    className={`${styles.submitButton} ${isFormComplete ? styles.active : ''}`}
                    disabled={!isFormComplete}
                >
                    회원가입 완료
                </button>
            </form>
        </div>
    );
};

export default Signup;
