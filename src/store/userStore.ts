// src/store/userStore.ts
import {create} from "zustand";
import { getUserData, updateUserData } from "@/app/firestore/firestore";

export interface UserData {
    id: string;
    age: number;
    height: number;
    weight: number;
    address: string;
    [key: string]: string | number;
}
interface UserState {
    userData: UserData | null;
    isLoading: boolean;
    fetchUser: (userId: string) => Promise<void>;
    updateUser: (userId: string, updatedFields: Partial<UserData>) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    userData: null,
    isLoading: false,

    // Firestore에서 사용자 데이터 로드
    fetchUser: async (userId: string) => {
        set({ isLoading: true });
        try {
            const data = await getUserData(userId);
            if (data) {
                // @ts-ignore
                set({ userData: data, isLoading: false });
            } else {
                set({ userData: null, isLoading: false });
            }
        } catch (error) {
            console.error("사용자 데이터 로드 오류:", error);
            set({ isLoading: false });
        }
    },

    // Firestore에서 사용자 데이터 업데이트
    updateUser: async (userId: string, updatedFields: Partial<UserData>) => {
        try {
            await updateUserData(userId, updatedFields);
            set((state) => ({
                userData: { ...state.userData, ...updatedFields } as UserData,
            }));
        } catch (error) {
            console.error("상태 업데이트 오류:", error);
        }
    },
}));
