import React, { useEffect, useState } from "react";
import {useUserStore} from "@/store/userStore"; // userStore 사용
import { getBMICategory } from "@/data/bmiCategories"; // 범주 매핑 로직 가져오기
import { getAgeGroup } from "../componenets/AgeCalculator"; // 연령대 계산 유틸리티 가져오기

export const BMICalculator: React.FC = () => {
    const { userData, updateUser } = useUserStore(); // Zustand에서 사용자 데이터 및 업데이트 함수 가져오기
    const [bmi, setBMI] = useState<number | null>(null);
    const [bmiCategory, setBMICategory] = useState<string | null>(null);

    useEffect(() => {
        const calculateAndUpdateBMI = async () => {
            if (userData && userData.height > 0 && userData.weight > 0) {
                const calculatedBMI = userData.weight / ((userData.height / 100) * (userData.height / 100)); // BMI 계산
                const roundedBMI = Number(calculatedBMI.toFixed(2)); // 소수점 2자리까지

                setBMI(roundedBMI); // BMI 상태 업데이트

                // Firestore와 Zustand 업데이트
                try {
                    await updateUser(userData.id as string, { bmi: roundedBMI });
                    console.log("BMI가 Firestore에 업데이트되었습니다:", roundedBMI);
                } catch (error) {
                    console.error("BMI 업데이트 오류:", error);
                }

                // BMI 범주 계산
                const ageGroup = getAgeGroup(userData.age); // 나이 기반 연령대 계산
                const category = getBMICategory(userData.gender as "남성" | "여성", ageGroup, calculatedBMI);
                setBMICategory(category);
            }
        };

        calculateAndUpdateBMI();
    }, [userData, updateUser]);

    return (
        <div>

        </div>
    );
};

export default BMICalculator;
