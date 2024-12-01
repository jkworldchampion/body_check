// BMICalculator.tsx
import React, { useEffect, useState } from "react";
import useSignupStore from "@/store/useSignupStore";
import { getBMICategory } from "@/data/bmiCategories"; // 범주 매핑 로직 가져오기
import { getAgeGroup } from "../componenets/AgeCalculator"; // 연령대 계산 유틸리티 가져오기

export const BMICalculator: React.FC = () => {
    const { height, weight, setField, gender, age } = useSignupStore(); // Zustand 상태 가져오기
    const [bmi, setBMI] = useState<number | null>(null);
    const [bmiCategory, setBMICategory] = useState<string | null>(null);

    useEffect(() => {
        if (height > 0 && weight > 0) {
            const calculatedBMI = weight / ((height / 100) * (height / 100)); // height를 m로 변환
            setBMI(Number(calculatedBMI.toFixed(2))); // 소수점 2자리까지 표시
            setField("bmi", Number(calculatedBMI.toFixed(2))); // 상태에 BMI 저장

            // 연령대 및 범주 계산
            const ageGroup = getAgeGroup(age); // 나이 기반 연령대 계산
            const category = getBMICategory(gender as "남성" | "여성", ageGroup, calculatedBMI);
            setBMICategory(category);

            if (gender === "남성" || gender === "여성") {
                const ageGroup = getAgeGroup(age);
                const category = getBMICategory(gender, ageGroup, calculatedBMI);
                setBMICategory(category);
            }
        }
    }, [height, weight, setField, gender, age]);

    return (
        <div>
            {bmi ? (
                <p>
                    회원님의 BMI는 <strong>{bmi}</strong>입니다. 현재 <strong>{bmiCategory}</strong> 범주에 속합니다.
                </p>
            ) : (
                <p>BMI를 계산 중입니다...</p>
            )}
        </div>
    );
};

export default BMICalculator;
