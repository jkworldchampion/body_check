// src/store/useAuthStore.ts
import { create } from "zustand";

interface AuthState {
    isAuthenticated: boolean; // 로그인 여부
    userId: string | null;    // 로그인된 사용자 ID
    login: (id: string) => void; // 로그인 함수
    logout: () => void;         // 로그아웃 함수
}

const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    userId: null,
    login: (id) => set({ isAuthenticated: true, userId: id }),
    logout: () => set({ isAuthenticated: false, userId: null }),
}));

export default useAuthStore;
