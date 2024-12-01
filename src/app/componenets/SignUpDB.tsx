//  회원가입 핸들러 컴포넌트 분리
// 아직 안했음...


import { doc, setDoc } from "firebase/firestore";
import {firestore} from "@/app/firestore/firebase";

// Firebase에 사용자 데이터 저장 함수
export const SignUpDB = async (userData: {
    id: string;
    name: string;
    gender: string;
    address: string;
    password: string;
    types: string[];
    height: number;
    weight: number;
    bmi: number;
    age: number;
}): Promise<void> => {
    const { id } = userData;
    await setDoc(doc(firestore, "users", id), userData);
};
