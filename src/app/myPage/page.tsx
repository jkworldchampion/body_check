'use client';

import React, { useState, useEffect, ChangeEvent } from "react";
import { useUserStore } from "@/store/userStore";
import useAuthStore from "@/store/useAuthStore";
import DashboardLayout from '@/app/componenets/dashboardLayout';


interface UserData {
    id: string;
    age?: number; // 누락되었을 수도 있기 때문에 선택적 필드로 처리해줌..
    height?: number;
    weight?: number;
    password?: string;
    address?: string;
    [key: string]: string | number | undefined;
    // 객체에 어떤 키가 정확히 있을지 모르기 때문에
    // 다른 키들이 동적으로 작동할 수 있게 하기 위하여 인덱스 시그니처 객체 사용함
    // 정의된 필드 이외의 임의의 키를 가지는 것을 허용하지 않게 함!
}

const MyPage: React.FC = () => {
    const { userId } = useAuthStore();
    const { userData, isLoading, fetchUser, updateUser } = useUserStore();
    const [formData, setFormData] = useState<UserData>({
        id: "",
        age: undefined,
        height: undefined,
        weight: undefined,
        address: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
    });

    useEffect(() => {
        if (userId) {
            fetchUser(userId);
        }
    }, [userId, fetchUser]);

    useEffect(() => {
        if (userData) {
            setFormData({
                id: userData.id || "",
                age: userData.age || undefined,
                height: userData.height || undefined,
                weight: userData.weight || undefined,
                address: userData.address || "",
                password: "",
                confirmPassword: "",
                phoneNumber: userData.phoneNumber || "",
            });
        }
    }, [userData]);

    const handleChange = (
        field: keyof UserData,
        value: string | number
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            if (typeof userId === "string") {
                await updateUser(userId, formData);
                alert("성공적으로 업데이트되었습니다.");
            }
        } catch (error) {
            console.error("수정 오류:", error);
            alert("수정 중 오류가 발생했습니다.");
        }
    };


    const renderField = (
        label: string,
        field: keyof UserData,
        type: "text" | "number" | "password",
        description?: string
    ) => (
        <div className="flex items-center py-3 border-b border-gray-300">
            <div className="w-1/3 text-gray-700 font-medium">{label}</div>
            <div className="w-2/3">
                <input
                    type={type}
                    value={formData[field] || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(
                            field,
                            type === "number"
                                ? parseInt(e.target.value, 10)
                                : e.target.value
                        )
                    }
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {description && <p className="text-sm text-red-500 mt-1">{description}</p>}
            </div>
        </div>
    );

    if (isLoading) return <p className="text-center text-gray-500">로딩 중...</p>;

    return (
        <DashboardLayout>
            <div className="mt-10 max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">나의 정보</h1>
                <p className="text-2xl text-gray-500 mb-6">
                    고객님 정보를 확인하고 수정하세요. <br />
                    정확한 정보 입력이 안전한 서비스 이용을 도와줍니다.
                </p>

                <div className="text-2xl border-t border-gray-300 mt-7 mb-6"></div>

                {renderField("아이디", "id", "text")}
                {renderField("나이", "age", "number")}
                {renderField("키", "height", "number")}
                {renderField("몸무게", "weight", "number")}
                {renderField("주소", "address", "text")}
                {renderField(
                    "비밀번호",
                    "password",
                    "password",
                    "소문자와 숫자를 포함한 8자리 이상이여야 합니다.."
                )}
                {renderField(
                    "비밀번호 확인",
                    "confirmPassword",
                    "password",
                    "비밀번호를 한 번 더 입력해주세요."
                )}

                <button
                    onClick={handleSave}
                    className="text-2xl w-full bg-blue-500 text-white py-3 px-6 mt-8 rounded-lg font-medium hover:bg-blue-600 transition"
                >
                    수정 완료
                </button>
            </div>
        </DashboardLayout>
    );
};

export default MyPage;
