"use client";

import React from "react";
import useSignupStore from "@/store/useSignupStore";
import styles from "./Signup.module.css";
import { useRouter } from "next/navigation";
import {
    handleInputChange,
    handleIdCheck,
    handleSignup,
    isFormValid,
} from "../utils/signingupUtils";
import LogoText from "@/app/componenets/logoText";
import BMICalculator from "@/app/componenets/BMICalculator";

export default function Signup() {
    const router = useRouter();
    const {
        id,
        password,
        confirmPassword,
        name,
        gender,
        height,
        age,
        weight,
        address,
        isIdUnique,
        isSignupComplete,
        passwordError,
        confirmPasswordError,
        types,
    } = useSignupStore();



    return (
        <div className={styles.container}>
            <LogoText text={"BODY : CHECK"} />
            <h2 className={styles.subtitle}>회원가입</h2>
            <hr className={styles.line} />

            <form className={styles.form} onSubmit={(e) => handleSignup(e, router)}>
                <div className={styles.field}>
                    <label className={styles.labelText}>*아이디</label>
                    <input
                        type="text"
                        value={id}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleInputChange("id", e.target.value)
                        }
                        required
                        className={styles.input}
                        placeholder="아이디를 입력하세요"
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
                        placeholder="비밀번호는 영소문자와 숫자 조합으로 8자리 이상 입력해주세요."
                    />
                    {passwordError && <p className={styles.error}>{passwordError}</p>}
                </div>

                <div className={styles.field}>
                    <label className={styles.labelText}>*비밀번호 확인</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        required
                        className={styles.input}
                        placeholder="비밀번호 확인"
                    />
                    {confirmPasswordError && <p className={styles.error}>{confirmPasswordError}</p>}
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
                    <label className={styles.labelText}>*회원유형</label>
                    <div className={styles.genderButtons}>
                        <button
                            type="button"
                            onClick={() => handleInputChange("types", "개인회원")}
                            className={`${styles.genderButton} ${
                                types === "개인회원" ? styles.selected : ""
                            }`}
                        >
                            개인회원
                        </button>
                        <button
                            type="button"
                            onClick={() => handleInputChange("types", "기업회원")}
                            className={`${styles.genderButton} ${
                                types === "기업회원" ? styles.selected : ""
                            }`}
                        >
                            기업회원
                        </button>
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.labelText}>*성별</label>
                    <div className={styles.genderButtons}>
                        <button
                            type="button"
                            onClick={() => handleInputChange("gender", "남")}
                            className={`${styles.genderButton} ${
                                gender === "남" ? styles.selected : ""
                            }`}
                        >
                            남
                        </button>
                        <button
                            type="button"
                            onClick={() => handleInputChange("gender", "여")}
                            className={`${styles.genderButton} ${
                                gender === "여" ? styles.selected : ""
                            }`}
                        >
                            여
                        </button>

                    </div>
                </div>
                <div className={styles.field}>
                    <label className={styles.labelText}>*나이</label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => handleInputChange("age", Number(e.target.value))}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.labelText}>*키</label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => handleInputChange("height", Number(e.target.value))}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.labelText}>*몸무게</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => handleInputChange("weight", Number(e.target.value))}
                        required
                        className={styles.input}
                    />
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
                    className={`${styles.submitButton} ${
                        isSignupComplete ? styles.active : styles.button
                    }`}
                    disabled={!isFormValid()}
                >
                    회원가입 완료
                </button>
            </form>
            <BMICalculator/>
        </div>
    );
}
