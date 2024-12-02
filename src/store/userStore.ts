import { create } from "zustand";
import { getUserData, updateUserData } from "@/app/firestore/firestore";

export interface UserData {
    id: string;
    name:string;
    password:string;
    gender:string;
    age: number;
    types: string;
    height: number;
    weight: number;
    address: string;
    bmi: number;
    [key: string]: string | number;
}

interface UserState {
    userData: UserData | null;
    isLoading: boolean;
    fetchUser: (userId: string) => Promise<void>;
    updateUser: (userId: string, updatedFields: Partial<UserData>) => Promise<void>;
    calculateAndUpdateBMI: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
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

    // BMI 계산 및 Firestore 업데이트
    calculateAndUpdateBMI: async () => {
        const { userData, updateUser } = get();

        if (userData && userData.height > 0 && userData.weight > 0) {
            const calculatedBMI = userData.weight / ((userData.height / 100) ** 2);
            const roundedBMI = Number(calculatedBMI.toFixed(2));

            // Zustand 상태 업데이트 및 Firestore 동기화
            try {
                await updateUser(userData.id as string, { bmi: roundedBMI });
                console.log("Firestore에 BMI 업데이트 완료:", roundedBMI);
            } catch (error) {
                console.error("BMI 업데이트 중 오류 발생:", error);
            }
        } else {
            console.warn("사용자 데이터가 충분하지 않거나 잘못되었습니다.");
        }
    },
}));
