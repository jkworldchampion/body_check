import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore"; // Zustand 스토어 사용
import { getBMICategory } from "@/data/bmiCategories"; // BMI 범주 매핑 로직 가져오기
import { getAgeGroup } from "../componenets/AgeCalculator"; // 연령대 계산 유틸리티 가져오기

const BMICalculator: React.FC = () => {
    const { userData, updateUser } = useUserStore(); // Zustand에서 사용자 데이터와 업데이트 함수 가져오기
    const [bmi, setBMI] = useState<number | null>(null);
    const [bmiCategory, setBMICategory] = useState<string | null>(null);

    useEffect(() => {
        const calculateAndUpdateBMI = async () => {
            if (userData && userData.height > 0 && userData.weight > 0) {
                // BMI 계산
                const calculatedBMI = userData.weight / ((userData.height / 100) ** 2);
                const roundedBMI = Number(calculatedBMI.toFixed(2)); // 소수점 2자리까지

                setBMI(roundedBMI); // BMI 상태 업데이트

                // Firestore 및 Zustand 업데이트
                try {
                    if (userData.id) {
                        await updateUser(userData.id, { bmi: roundedBMI });
                        console.log("Firestore에 BMI가 업데이트되었습니다:", roundedBMI);
                    } else {
                        console.error("유효하지 않은 사용자 ID:", userData.id);
                    }
                } catch (error) {
                    console.error("Firestore 업데이트 중 오류 발생:", error);
                }

                // BMI 범주 계산
                try {
                    const ageGroup = getAgeGroup(userData.age); // 나이 기반 연령대 계산
                    const category = getBMICategory(userData.gender as "남성" | "여성", ageGroup, roundedBMI);
                    setBMICategory(category);
                } catch (error) {
                    console.error("BMI 범주 계산 중 오류 발생:", error);
                }
            } else {
                console.warn("사용자 데이터가 올바르지 않습니다. 키와 몸무게를 확인하세요.");
            }
        };

        calculateAndUpdateBMI();
    }, [userData, updateUser]);

    return (
        <div>
            {bmi && <p>BMI: {bmi}</p>}
            {bmiCategory && <p>BMI 범주: {bmiCategory}</p>}
        </div>
    );
};

export default BMICalculator;
