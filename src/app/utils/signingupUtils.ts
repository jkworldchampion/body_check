// src/utils/signup/utils.ts

import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firestore/firebase";
import useSignupStore from "@/store/useSignupStore";
import { Router } from "next/router";

// 비밀번호 유효성 검사 함수
export const isPasswordValid = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/;
    return passwordRegex.test(password);
};

// 비밀번호 일치 검사 함수
export const arePasswordsMatching = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
};

// 아이디 중복 확인 함수
export const checkIdAvailability = async (id: string): Promise<boolean> => {
    const docRef = doc(firestore, "users", id);
    const docSnap = await getDoc(docRef);
    return !docSnap.exists(); // 존재하지 않으면 true 반환
};

// 입력 변경 핸들러
export const handleInputChange = (field: keyof ReturnType<typeof useSignupStore>, value: string) => {
    const { setField } = useSignupStore.getState(); // Zustand store의 상태 가져오기
    setField(field, value);
};

// ID 중복 확인 핸들러
export const handleIdCheck = async () => {
    const { id, setField } = useSignupStore.getState();
    const isAvailable = await checkIdAvailability(id);
    if (isAvailable) {
        setField("isIdUnique", true);
        alert("아이디 확인 완료!");
    } else {
        setField("isIdUnique", false);
        alert("이미 사용 중인 아이디입니다.");
    }
};

// 회원가입 핸들러
export const handleSignup = async (e: React.FormEvent, router: Router) => {
    e.preventDefault();
    const { id, password, confirmPassword, name, gender, address, isIdUnique, setField } = useSignupStore.getState();

    if (!isPasswordValid(password)) {
        alert("비밀번호는 영문 소문자와 숫자를 포함하여 8자리 이상이어야 합니다.");
        return;
    }

    if (!arePasswordsMatching(password, confirmPassword)) {
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
