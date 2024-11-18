// src/store/useSignupStore.ts
import { create } from "zustand";

interface SignupFormState {
    id: string;
    password: string;
    confirmPassword: string;
    name: string;
    gender: string;
    address: string;
    isIdUnique: boolean | null;
    isSignupComplete: boolean;
    setField: (field: keyof SignupFormState, value: string | boolean | null) => void;
    passwordError: string | null;          // 비밀번호 오류 메시지
    confirmPasswordError: string | null;    // 비밀번호 확인 오류 메시지
}

const useSignupStore = create<SignupFormState>((set) => ({
    id: "",
    password: "",
    confirmPassword: "",
    name: "",
    gender: "",
    address: "",
    isIdUnique: null,
    isSignupComplete: false,
    passwordError: null,
    confirmPasswordError: null,
    setField: (field, value) =>
        set((state) => ({
            ...state,
            [field]: value,
        })),
}));



interface VisibilityState {
    isVisible: boolean;
    setIsVisible: (visible: boolean) => void;
}

export const useVisibilityStore = create<VisibilityState>((set) => ({
    isVisible: false,
    set IsVisible: (visible) => set({ isVisible: visible }),
}));


export default useSignupStore;
