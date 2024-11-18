"use client";

import React, { useEffect, useState } from "react";
import { firestore } from "@/app/firestore/firebase";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import HandleUpload from "@/app/utils/handleImage";
import Header from "../componenets/header";
import useAuthStore from "@/store/useAuthStore";
import useImageStore from "@/store/imageStore";

export default function Dashboard() {
    const userId = useAuthStore((state) => state.userId); // Zustand에서 로그인된 사용자 ID 가져오기
    const [userName, setUserName] = useState<string | null>(null); // 사용자 이름 상태
    const uploadedImageUrl = useImageStore((state) => state.uploadedImageUrl); // Zustand 이미지 상태
    const [userImages, setUserImages] = useState<string[]>([]); // 유저가 업로드한 이미지 리스트

    useEffect(() => {
        const fetchUserName = async () => {
            if (!userId) return;

            try {
                const userDoc = await getDoc(doc(firestore, "users", userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserName(userData.name);
                } else {
                    console.error("사용자 정보를 찾을 수 없습니다.");
                }
            } catch (error) {
                console.error("사용자 정보 가져오는 중 오류 발생:", error);
            }
        };

        fetchUserName();
    }, [userId]);

    const handleImageSave = async (imageUrl: string) => {
        if (!userId) {
            console.error("로그인 정보가 없습니다.");
            return;
        }

        try {
            await setDoc(doc(firestore, "images", `${userId}_${Date.now()}`), {
                userId,
                imageUrl,
                uploadedAt: new Date().toISOString(),
            });
            console.log("이미지가 성공적으로 저장되었습니다.");
            fetchUserImages(); // 이미지 저장 후 갱신
        } catch (error) {
            console.error("이미지 URL 저장 중 오류 발생:", error);
        }
    };

    const fetchUserImages = async () => {
        if (!userId) return;

        try {
            const imagesRef = collection(firestore, "images");
            const q = query(imagesRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            const images: string[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.imageUrl) {
                    images.push(data.imageUrl);
                }
            });

            setUserImages(images);
        } catch (error) {
            console.error("사용자 이미지 가져오는 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        if (uploadedImageUrl) {
            handleImageSave(uploadedImageUrl); // Firestore에 이미지 저장
        }
    }, [uploadedImageUrl]);

    useEffect(() => {
        fetchUserImages(); // 컴포넌트가 마운트될 때 유저 이미지 가져오기
    }, [userId]);

    if (!userId) return <p>로딩 중...</p>;

    return (
        <div>
            <Header />

            <h1>안녕하세요 {userName || "User"} 님!</h1>
            <p>오늘도 운동하러 오셨군요!</p>

            <HandleUpload />



            {userImages.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h3>내가 업로드한 이미지:</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {userImages.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`사진업로드 ${index + 1}`}
                                style={{ maxWidth: "200px", borderRadius: "5px" }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
