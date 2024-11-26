//BMI 계산 컴포넌트
import React, { useEffect, useState } from "react";
import useSignupStore from "@/store/useSignupStore";

const BMICalculator: React.FC = () => {
    const { height, weight, setField } = useSignupStore();
    const [bmi, setBMI] = useState<number | null>(null);

    useEffect(() => {
        if (height > 0 && weight > 0) {
            const calculatedBMI = weight / ((height / 100) * (height / 100)); // height를 m로 변환
            setBMI(Number(calculatedBMI.toFixed(2))); // 소수점 2자리까지 표시
            setField("bmi", Number(calculatedBMI.toFixed(2))); // 상태에 BMI 저장
        }
    }, [height, weight, setField]);

    return (
        <div>
            
        </div>
    );
};

export default BMICalculator;
