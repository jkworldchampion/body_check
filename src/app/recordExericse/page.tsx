"use client";

import React, { useRef, useState, useEffect } from "react";
import { firestore } from "@/app/firestore/firebase";
import { doc, getDoc } from "firebase/firestore";
import useAuthStore from "@/store/useAuthStore";
import DashboardLayout from "@/app/componenets/dashboardLayout";

const AnalyzeBody: React.FC = () => {
    const userId = useAuthStore((state) => state.userId); // 로그인한 사용자 ID 가져오기
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 업로드된 이미지 미리보기
    const [result, setResult] = useState<number[] | null>(null); // 서버에서 받아온 분석 결과
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태
    const [userData, setUserData] = useState<{ height: string; bmi: string } | null>(null); // Firestore 사용자 데이터

    // Firestore에서 사용자 데이터 가져오기
    const fetchUserData = async () => {
        if (!userId) return;

        try {
            const userDocRef = doc(firestore, "users", userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const data = userDoc.data() as { height: string; bmi: string };
                setUserData(data);
            } else {
                console.error("사용자 데이터를 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error("사용자 데이터 가져오는 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    // 파일 선택 핸들러
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    // 서버로 이미지 업로드 및 분석 결과 요청
    const handleSubmit = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file || !userData) {
            alert("이미지와 사용자 정보를 확인하세요.");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("height", userData.height); // Firestore에서 가져온 사용자 키
        formData.append("bmi", userData.bmi); // Firestore에서 가져온 사용자 BMI

        try {
            setIsLoading(true);
            setResult(null);

            const response = await fetch("/predict", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setResult(data.result); // 서버에서 반환된 결과 저장
            } else {
                console.error("서버에서 데이터를 가져오는 중 오류 발생");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 분석 결과에 표시할 항목 및 위치
    const selectedLabels = [
        { label: "목뒤높이", x: "50%", y: "10%" },
        { label: "엉덩이높이", x: "50%", y: "70%" },
        { label: "허리높이", x: "50%", y: "50%" },
        { label: "무릎높이", x: "50%", y: "85%" },
        { label: "머리둘레", x: "20%", y: "5%" },
        { label: "허리둘레", x: "50%", y: "55%" },
    ];

    return (
        <DashboardLayout>
            <div className="flex h-screen bg-gray-100 ">
                {/* 왼쪽: 이미지 업로드 */}
                <div className="w-1/3 bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                    <h2 className="text-2xl font-bold mb-6">체형 분석</h2>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="block w-full mb-4 border border-gray-300 rounded-md p-2"
                    />
                    {previewUrl && (
                        <div className="relative">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className={`w-full h-auto rounded-lg shadow-md mb-4 ${isLoading ? "opacity-50" : ""}`}
                            />
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                                    <span className="text-white text-xl font-bold animate-pulse">분석 중...</span>
                                </div>
                            )}
                        </div>
                    )}
                    <button
                        onClick={handleSubmit}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        disabled={isLoading}
                    >
                        {isLoading ? "분석 중..." : "결과 예측하기"}
                    </button>
                </div>

                {/* 오른쪽: 분석 결과 */}
                <div className="w-1/3 bg-white p-6 ml-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4">분석 결과</h3>
                    {result ? (
                        <div className="relative">
                            <img
                                src="/images/analyzeBody.png" // 기본 체형 이미지
                                alt="Body Template"
                                className="w-full h-auto"
                            />
                            {selectedLabels.map((pos, index) => (
                                <div
                                    key={index}
                                    className="absolute text-2xl text-black  bg-opacity-75 rounded-md px-2"
                                    style={{
                                        top: pos.y,
                                        left: pos.x,
                                        transform: "translate(-50%, -50%)",
                                    }}
                                >
                                    {pos.label}: {result[index]?.toFixed(2) || "N/A"}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">결과가 없습니다. 이미지를 업로드하세요.</p>
                    )}
                </div>
            </div>
            </DashboardLayout>
    );
};

export default AnalyzeBody;
