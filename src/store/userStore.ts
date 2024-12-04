import { create } from "zustand";
import { getUserData, updateUserData } from "@/app/firestore/firestore";
import {FatCalculator} from "../app/componenets/FatCalculator";

export interface UserData {
    id: string;
    name: string;
    password: string;
    gender: string;
    age: number;
    types: string;
    height: number;
    weight: number;
    address: string;
    bmi: number;
    fat: number; // 체지방률 추가
    [key: string]: string | number;
}

interface UserState {
    userData: UserData | null;
    isLoading: boolean;
    fetchUser: (userId: string) => Promise<void>;
    updateUser: (userId: string, updatedFields: Partial<UserData>) => Promise<void>;
    calculateAndUpdateMetrics: () => Promise<void>; // BMI 및 체지방률 계산
    calculateFatOnly: () => Promise<void>; // 체지방률만 계산
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

    // BMI 및 체지방률 계산 및 상태 업데이트
    calculateAndUpdateMetrics: async () => {
        const { userData, updateUser } = get();

        if (userData && userData.height > 0 && userData.weight > 0) {
            // BMI 계산
            const calculatedBMI = userData.weight / ((userData.height / 100) ** 2);
            const roundedBMI = Number(calculatedBMI.toFixed(2));

            // 체지방률 계산
            const bodyFatPercentage = FatCalculator(roundedBMI, userData.age, userData.gender, data.age);
            // @ts-ignore
            const roundedBodyFat = Number(bodyFatPercentage.toFixed(2));

            // Zustand 상태 업데이트 및 Firestore 동기화
            try {
                await updateUser(userData.id, {
                    bmi: roundedBMI,
                    fat: roundedBodyFat,
                });
                console.log("Firestore에 BMI 및 체지방률 업데이트 완료:", {
                    bmi: roundedBMI,
                    fat: roundedBodyFat,
                });
            } catch (error) {
                console.error("BMI/체지방률 업데이트 중 오류 발생:", error);
            }
        } else {
            console.warn("사용자 데이터가 충분하지 않거나 잘못되었습니다.");
        }
    },

    // 체지방률만 계산 및 상태 업데이트
    calculateFatOnly: async () => {
        const { userData, updateUser } = get();

        if (userData && userData.bmi > 0) {
            // 체지방률 계산
            const bodyFatPercentage = FatCalculator(userData.bmi, userData.age, userData.gender, data.age);
            // @ts-ignore
            const roundedBodyFat = Number(bodyFatPercentage.toFixed(2));

            // Zustand 상태 업데이트 및 Firestore 동기화
            try {
                await updateUser(userData.id, {
                    fat: roundedBodyFat,
                });
                console.log("Firestore에 체지방률 업데이트 완료:", {
                    fat: roundedBodyFat,
                });
            } catch (error) {
                console.error("체지방률 업데이트 중 오류 발생:", error);
            }
        } else {
            console.warn("BMI 데이터가 부족하거나 잘못되었습니다.");
        }
    },
}));
