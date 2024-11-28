// src/app/signup/personal/page.tsx
"use client";

import React from "react";
import useSignupStore from "@/store/useSignupStore";
import styles from "../Signup.module.css";
import { useRouter } from "next/navigation";
import {
    handleInputChange,
    handleIdCheck,
    handleSignup,
} from "../../utils/signingupUtils";

export default function Signup() {
    const router = useRouter();
    const {
        id,
        password,
        confirmPassword,
        name,
        gender,
        address,
        isIdUnique,
        isSignupComplete,
    } = useSignupStore();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>BODY CHECK</h1>
            <h2 className={styles.subtitle}>회원가입</h2>
            <hr className={styles.line} />

            <form className={styles.form} onSubmit={(e) => handleSignup(e, router)}>
                <div className={styles.field}>
                    <label className={styles.labelText}>*아이디</label>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => handleInputChange("id", e.target.value)}
                        required
                        className={styles.input}
                    />
                    <button
                        type="button"
                        onClick={handleIdCheck}
                        className={`${styles.button} ${isIdUnique ? styles.disabled : ""}`}
                        disabled={isIdUnique === true}
                    >
                        중복 확인
                    </button>
                    {isIdUnique === true && <p className={styles.verified}>아이디 확인 완료!</p>}
                </div>

                <div className={styles.field}>
                    <label className={styles.labelText}>*비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.labelText}>*비밀번호 확인</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.labelText}>*이름</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.labelText}>*성별</label>
                    <div className={styles.genderButtons}>
                        <button
                            type="button"
                            onClick={() => handleInputChange("gender", "남")}
                            className={`${styles.genderButton} ${gender === "남" ? styles.selected : ""}`}
                        >
                            남
                        </button>
                        <button
                            type="button"
                            onClick={() => handleInputChange("gender", "여")}
                            className={`${styles.genderButton} ${gender === "여" ? styles.selected : ""}`}
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
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <button
                    type="submit"
                    className={`${styles.submitButton} ${isSignupComplete ? styles.active : ""}`}
                    disabled={!isIdUnique}
                >
                    회원가입 완료
                </button>
            </form>
        </div>
    );
}
