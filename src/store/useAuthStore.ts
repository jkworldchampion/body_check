//로그인
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface AuthState {
    isAuthenticated: boolean; // 로그인 여부
    userId: string | null;    // 사용자 ID
    login: (id: string) => void; // 로그인 처리
    logout: () => void;         // 로그아웃 처리
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            userId: null,
            login: (id) => {
                console.log("Zustand 로그인 호출:", id);
                set({ isAuthenticated: true, userId: id });
            },
            logout: () => {
                console.log("Zustand 로그아웃 호출");
                set({ isAuthenticated: false, userId: null });
            },
        }),
        {
            name: "auth-storage", // 로컬 스토리지에 저장될 키 이름
        }
    )
);

export default useAuthStore;
