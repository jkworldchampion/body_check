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
        // 로그인 상태 업데이트
        set({ isAuthenticated: true, userId: id });
    },
    logout: () => {
        // 로그아웃 상태 초기화
        set({ isAuthenticated: false, userId: null });
    },
}));

export default useAuthStore;
