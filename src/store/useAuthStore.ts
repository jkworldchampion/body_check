// src/store/useAuthStore.ts
import { create } from "zustand";

interface AuthState {
    isAuthenticated: boolean; // 로그인 여부
    userId: string | null;    // 사용자 ID
    login: (id: string) => void; // 로그인 처리
    logout: () => void;         // 로그아웃 처리
}

const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    userId: null,
    login: (id) => {
        // Zustand 상태 업데이트
        set({ isAuthenticated: true, userId: id });

        // 로그인 쿠키 설정 (상태와 쿠키 동기화)
        document.cookie = `isAuthenticated=true; path=/;`;
        document.cookie = `userId=${id}; path=/;`;
    },
    logout: () => {
        // Zustand 상태 초기화
        set({ isAuthenticated: false, userId: null });

        // 로그아웃 시 쿠키 삭제
        document.cookie = `isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        document.cookie = `userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    },
}));

export default useAuthStore;
