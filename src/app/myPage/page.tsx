'use client';

import React, { useState, useEffect, ChangeEvent } from "react";
import { useUserStore } from "@/store/userStore";
import useAuthStore from "@/store/useAuthStore";
import { FaEdit } from "react-icons/fa";
import styles from "./MyPage.module.css";
import DashboardLayout from '@/app/componenets/dashboardLayout';


interface UserData {
    id: string;
    age?: number; // 누락되었을 수도 있기 때문에 선택적 필드로 처리해줌..
    height?: number;
    weight?: number;
    address?: string;
    [key: string]: string | number | undefined;
    // 객체에 어떤 키가 정확히 있을지 모르기 때문에
    // 다른 키들이 동적으로 작동할 수 있게 하기 위하여 인덱스 시그니처 객체 사용함
    // 정의된 필드 이외의 임의의 키를 가지는 것을 허용하지 않게 함!
}

const MyPage: React.FC = () => {
    const { userId } = useAuthStore();
    const { userData, isLoading, fetchUser, updateUser } = useUserStore();
    const [editableField, setEditableField] = useState<string | null>(null);
    const [editedValue, setEditedValue] = useState<string | number>("");

    useEffect(() => {
        if (userId) {
            fetchUser(userId);
        }
    }, [userId, fetchUser]);

    const enableEdit = (field: keyof UserData, currentValue: string | number) => {
        // @ts-ignore
        setEditableField(field);
        setEditedValue(currentValue);
    };

    const handleSave = async () => {
        if (!editableField) return;
        try {
            if (typeof userId === "string") {
                await updateUser(userId, {[editableField]: editedValue});
            }
            alert(`성공적으로 업데이트되었습니다.`);
        } catch (error) {
            console.error("수정 오류:", error);
            alert("수정 중 오류가 발생했습니다.");
        } finally {
            setEditableField(null);
        }
    };

    const renderField = (
        label: string,
        field: keyof UserData,
        type: "text" | "number"
    ) => {
        const value = userData?.[field];
        //?. = 옵셔널 체이닝 : userData 가 null 또는 undefined 인 경우에 실행을 중단하고 undefined 를 반환함
        // userData 가 null이나 undfined 라면 실행을 중단하고 value 에 undefined 할당
        // > 런타임 오류방지


        return (
            <div className={styles.fieldGroup}>
                <label className={styles.label}>{label}:</label>
                <div className={styles.valueContainer}>
                    {editableField === field ? (
                        <>
                            <input
                                type={type}
                                value={editedValue}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setEditedValue(
                                        type === "number"
                                            ? parseInt(e.target.value, 10)
                                            : e.target.value
                                    )
                                }
                                className={styles.input}
                            />
                            <button
                                onClick={handleSave}
                                className={styles.saveButton}
                            >
                                저장
                            </button>
                        </>
                    ) : value !== undefined && value !== null ? (
                        <>
                            <span className={styles.value}>{value}</span>
                            <FaEdit
                                onClick={() => enableEdit(field, value)}
                                className={styles.editIcon}
                                size={18}
                            />
                        </>
                    ) : (
                        <>
                            <span className={styles.value}>데이터가 없습니다</span>
                            <FaEdit
                                onClick={() => enableEdit(field, "")}
                                className={styles.editIcon}
                                size={18}
                            />
                        </>
                    )}
                </div>
            </div>
        );
    };

    if (isLoading) return <p className="text-center text-gray-500">로딩 중...</p>;

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>회원 정보 수정</h1>
                <p className={styles.description}>
                    회원정보를 수정한 뒤,
                    수정완료 버튼을 눌러야 저장됩니다 !
                </p>
                <hr className={styles.line}/>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>아이디:</label>
                    <div className={styles.valueContainer}>
                        <span className={styles.value}>
                            {userData?.id || "데이터가 없습니다"}
                        </span>
                    </div>
                </div>
                {renderField("나이", "age", "number")}
                {renderField("키", "height", "number")}
                {renderField("몸무게", "weight", "number")}
                {renderField("주소", "address", "text")}
                <button
                    className={styles.completeButton}
                    onClick={() => alert("수정 완료!")}
                >
                    수정 완료
                </button>
            </div>
        </DashboardLayout>
    );
};

export default MyPage;
