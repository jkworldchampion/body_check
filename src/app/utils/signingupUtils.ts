// src/utils/signup/utils.ts

import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firestore/firebase";
import useSignupStore from "@/store/useSignupStore";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {SignupFormState} from "@/store/useSignupStore";

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
export const handleInputChange = <T extends keyof SignupFormState>(
    field: T,
    value: SignupFormState[T]
) => {    const { setField, password, confirmPassword } = useSignupStore.getState();

    setField(field, value);

    // 비밀번호 유효성 및 확인 일치 검사
    if (field === "password") {
        // @ts-ignore
        if (!isPasswordValid(value)) {
            setField("passwordError", "비밀번호는 소문자와 숫자를 포함한 8자리 이상이어야 합니다.");
        } else {
            setField("passwordError", null);
        }
    }

    if (field === "confirmPassword") {
        // @ts-ignore
        if (!arePasswordsMatching(password, value)) {
            setField("confirmPasswordError", "비밀번호가 일치하지 않습니다.");
        } else {
            setField("confirmPasswordError", null);
        }
    }
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
export const handleSignup = async (
    e: React.FormEvent,
    router: AppRouterInstance // 타입 수정
) => {
    e.preventDefault();
    const { id, password, confirmPassword, name, types,gender, address,bmi,isIdUnique, height, weight,setField } = useSignupStore.getState();

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
                types,
                height,
                weight,
                bmi
            });

            setField("isSignupComplete", true);
            alert("회원가입이 완료되었습니다.");
            router.push("/Login"); // 회원가입 후 로그인 페이지로 이동
        } catch (error) {
            console.error("회원가입 실패:", error);
            alert("회원가입 중 오류가 발생했습니다.");
        }
    } else {
        alert("아이디 중복 확인을 해주세요.");
    }
};
// 모든 필드가 유효한지 확인하는 함수
export const isFormValid = (): "" | 0 | false | null | boolean => {
    const { id, password, types,confirmPassword, name, gender, address, isIdUnique,height,weight, } = useSignupStore.getState();
    return (
        id &&
        password &&
        types &&
        confirmPassword &&
        name &&
        gender &&
        types &&
        address &&
        height &&
        weight &&
        isIdUnique && // 아이디 중복 확인 완료
        isPasswordValid(password) &&
        arePasswordsMatching(password, confirmPassword)
    );
};


//

