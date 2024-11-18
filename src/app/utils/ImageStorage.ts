import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";
import { firestore } from "../firestore/firebase";

/**
 * Cloudinary URL에서 이미지를 다운로드하고 Firebase Storage에 업로드한 후 URL 반환 및 Firestore에 저장
 * @param cloudinaryUrl Cloudinary에서 반환된 이미지 URL
 * @param fileName Firebase Storage에 저장할 파일 이름
 * @param userId Firestore에 저장할 사용자 ID
 */
export const saveImageToFirebase = async (
    cloudinaryUrl: string,
    fileName: string,
    userId: string
) => {
    const storage = getStorage(); // Firebase Storage 초기화
    const storageRef = ref(storage, `images/${fileName}`); // 저장 경로 지정

    try {
        const response = await axios.get(cloudinaryUrl, { responseType: "arraybuffer" });
        const fileData = new Uint8Array(response.data); // 바이너리 데이터 변환

        await uploadBytes(storageRef, fileData);
        console.log("Firebase Storage 업로드 성공");

        const downloadUrl = await getDownloadURL(storageRef);
        console.log("Firebase Storage 다운로드 URL:", downloadUrl);

        await saveToFirestore(userId, downloadUrl);
        console.log("Firestore에 URL 저장 완료:", downloadUrl);

        return downloadUrl; // 다운로드 URL 반환
    } catch (error) {
        console.error("Firebase 업로드 또는 Firestore 저장 실패:", error);
        throw error;
    }
};

/**
 * Firestore에 업로드된 이미지 URL 저장
 * @param userId Firestore에 저장할 사용자 ID
 * @param downloadUrl Firebase Storage의 이미지 다운로드 URL
 */
const saveToFirestore = async (userId: string, downloadUrl: string) => {
    try {
        const userDoc = doc(firestore, "users", userId);
        await setDoc(
            userDoc,
            { profileImage: downloadUrl },
            { merge: true }
        );
        console.log("Firestore 저장 성공");
    } catch (error) {
        console.error("Firestore 저장 실패:", error);
        throw error;
    }
};
