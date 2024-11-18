// src/firestore/firestore.ts
import { firestore } from './firebase';
import {collection, addDoc, getDoc, doc, query, where, getDocs, setDoc} from 'firebase/firestore';


/**
 * Firestore에서 유저 데이터를 조회
 * @param userId 유저의 고유 ID
 */
export const getUserData = async (userId: string) => {
    try {
        const userDocRef = doc(firestore, "users", userId);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
            return userSnapshot.data();
        } else {
            console.log("정보없음!");
            return null;
        }
    } catch (error) {
        console.error("에러 표시", error);
        throw error;
    }
};

/**
 * Firestore에서 아이디 중복 여부를 확인
 * @param id 확인할 아이디
 * @returns 아이디가 존재하면 true, 존재하지 않으면 false
 */
export const checkIdExists = async (id: string): Promise<boolean> => {
    try {
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("id", "==", id)); // id 필드로 중복 검사
        const querySnapshot = await getDocs(q);

        return !querySnapshot.empty; // 결과가 비어있지 않으면 중복된 아이디가 존재
    } catch (error) {
        console.error("Error checking ID existence:", error);
        throw error;
    }
};


/**
 * Firestore에서 이메일 중복을 확인하는 함수
 * @param email 체크할 이메일 주소
 * @returns 중복된 이메일이 있으면 true, 없으면 false 반환
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
        const usersRef = collection(firestore, 'users'); // 'users' 컬렉션 참조
        const q = query(usersRef, where('email', '==', email)); // 이메일이 일치하는 문서 조회
        const querySnapshot = await getDocs(q);

        return !querySnapshot.empty; // 문서가 있으면 true, 없으면 false
    } catch (error) {
        console.error("이메일 중복 확인 오류:", error);
        throw error;
    }
};

/**
 * Firestore에 새로운 유저 데이터를 추가
 * @param userId 유저의 고유 ID
 * @param data Firestore에 저장할 유저 데이터
 */
export const addUserData = async (userId: string, data: any) => {
    try {
        await setDoc(doc(firestore, 'users', userId), data);
        console.log("User added with ID:", userId);
    } catch (error) {
        console.error("Error adding document:", error);
        throw error;
    }
};
export { firestore };
