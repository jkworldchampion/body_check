import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import {firestore} from "@/app/firestore/firebase"; // Firebase 설정 파일 경로에 맞게 수정
import useAuthStore from "@/store/useAuthStore";

// 사용자 나이를 기반으로 연령대를 계산하는 함수
export const getAgeGroup = (age: number): string => {
    if (age >= 20 && age < 30) return "20대";
    if (age >= 30 && age < 40) return "30대";
    if (age >= 40 && age < 50) return "40대";
    if (age >= 50 && age < 60) return "50대";
    if (age >= 60 && age < 70) return "60대";
    if (age >= 70 && age < 80) return "70대";
    if (age >= 80) return "80세 이상";
    return "전체"; // 20세 미만은 "전체"로 분류
};

// Firestore에서 나이를 가져와 연령대로 변환하는 컴포넌트
export const AgeCalculator: React.FC = () => {
    const userId = useAuthStore((state) => state.userId); // Zustand에서 로그인된 사용자 ID 가져오기
    const [ageGroup, setAgeGroup] = useState<string | null>(null); // 사용자 이름 상태
    const [error, setError] = useState<string | null>(null); // 오류 상태

    useEffect(() => {
        const fetchAgeFromFirestore = async () => {
            try {
                if (!userId) {
                    setError("사용자 ID가 없습니다.");
                    return;
                }

                // Firestore에서 사용자 데이터 가져오기
                const userDoc = await getDoc(doc(firestore, 'users', userId));

                if (!userDoc.exists()) {
                    setError("사용자 데이터를 찾을 수 없습니다.");
                    return;
                }

                const userData = userDoc.data();
                const age = userData.age;

                if (typeof age !== "number") {
                    setError("유효하지 않은 나이 데이터입니다.");
                    return;
                }

                // 연령대 계산
                const group = getAgeGroup(age);
                setAgeGroup(group);
            } catch (err) {
                console.error("Firestore에서 데이터를 가져오는 중 오류 발생:", err);
                setError("데이터를 가져오는 중 오류가 발생했습니다.");
            }
        };

        fetchAgeFromFirestore();
    }, [userId]);

    return (
        <div>
            {error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : ageGroup ? (
                <p>회원님은 <strong>{ageGroup}</strong> 연령대에 속합니다.</p>
            ) : (
                <p>연령대 정보를 가져오는 중...</p>
            )}
        </div>
    );
};

export default AgeCalculator;
