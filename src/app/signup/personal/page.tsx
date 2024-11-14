// src/app/signup/personal/page.tsx
"use client";

import React from "react";
import useSignupStore from "@/store/useSignupStore";
import styles from "../Signup.module.css";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { firestore } from "../../firestore/firebase";
import { useRouter } from "next/navigation";

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
        setField,
    } = useSignupStore();

    // 입력 변경 핸들러
    const handleInputChange = (field: keyof typeof useSignupStore, value: string) => {
        setField(field, value);
    };

    // ID 중복 확인 핸들러
    const handleIdCheck = async () => {
        const docRef = doc(firestore, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setField("isIdUnique", false);
            alert("이미 사용 중인 아이디입니다.");
        } else {
            setField("isIdUnique", true);
            alert("아이디 확인 완료!");
        }
    };

    // 회원가입 핸들러
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (isIdUnique) {
            try {
                // Firestore에 사용자 정보 저장
                await setDoc(doc(firestore, "users", id), {
                    id,
                    name,
                    gender,
                    address,
                    password,
                });

                setField("isSignupComplete", true);
                alert("회원가입이 완료되었습니다.");
                router.push("/login"); // 회원가입 후 로그인 페이지로 이동
            } catch (error) {
                console.error("회원가입 실패:", error);
                alert("회원가입 중 오류가 발생했습니다.");
            }
        } else {
            alert("아이디 중복 확인을 해주세요.");
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>BODY CHECK</h1>
            <h2 className={styles.subtitle}>회원가입</h2>
            <hr className={styles.line} />

            <form className={styles.form} onSubmit={handleSignup}>
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
