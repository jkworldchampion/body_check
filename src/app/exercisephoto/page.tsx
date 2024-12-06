"use client";

import React, { useEffect, useState } from "react";
import { firestore } from "@/app/firestore/firebase";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, orderBy } from "firebase/firestore";
import useAuthStore from "@/store/useAuthStore";
import DashboardLayout from "@/app/componenets/dashboardLayout";

interface UserImage {
    id: string; // Firestore 문서 ID
    imageUrl: string;
    timestamp: string;
}

const ExercisePhotoPage = () => {
    const userId = useAuthStore((state) => state.userId); // 현재 로그인된 사용자 ID 가져오기
    const [userImages, setUserImages] = useState<UserImage[]>([]); // 사용자 이미지 상태
    const [isScriptLoaded, setIsScriptLoaded] = useState(false); // Cloudinary 스크립트 로드 상태
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null); // 선택된 이미지 ID

    // Cloudinary 스크립트 로드
    const loadCloudinaryScript = () => {
        if (window.cloudinary) {
            setIsScriptLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.async = true;
        script.onload = () => setIsScriptLoaded(true);
        script.onerror = () => console.error("Cloudinary script 로드 실패");
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    };

    // Firestore에서 사용자 이미지 가져오기
    const fetchUserImages = async () => {
        if (!userId) return;

        try {
            const imagesRef = collection(firestore, "images");
            const q = query(imagesRef, where("userId", "==", userId), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);

            const images = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                imageUrl: doc.data().imageUrl || "",
                timestamp: doc.data().timestamp
                    ? new Date(doc.data().timestamp.toMillis()).toLocaleString()
                    : "알 수 없음",
            }));
            setUserImages(images);
        } catch (error) {
            console.error("사용자 이미지 가져오는 중 오류 발생:", error);
        }
    };

    // 이미지 업로드 처리
    const handleUpload = () => {
        if (!isScriptLoaded) {
            console.error("Cloudinary script가 아직 로드되지 않았습니다.");
            return;
        }

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
                sources: ["local", "url", "camera"],
            },
            async (error: any, result: any) => {
                if (error) {
                    console.error("이미지 업로드 중 오류 발생:", error);
                    return;
                }

                if (result.event === "success") {
                    const uploadedUrl = result.info.secure_url;

                    try {
                        const imagesRef = collection(firestore, "images");
                        const timestamp = new Date();

                        const docRef = await addDoc(imagesRef, {
                            userId: userId,
                            imageUrl: uploadedUrl,
                            timestamp,
                        });

                        setUserImages((prevImages) => [
                            { id: docRef.id, imageUrl: uploadedUrl, timestamp: timestamp.toLocaleString() },
                            ...prevImages,
                        ]);
                    } catch (firestoreError) {
                        console.error("Firestore에 이미지 저장 중 오류 발생:", firestoreError);
                    }
                }
            }
        );

        widget.open();
    };

    // Firestore에서 이미지 삭제
    const handleDeleteImage = async (imageId: string) => {
        try {
            const imageRef = doc(firestore, "images", imageId);
            await deleteDoc(imageRef);

            setUserImages((prevImages) => prevImages.filter((image) => image.id !== imageId));
            setSelectedImageId(null); // 선택 상태 초기화
        } catch (error) {
            console.error("이미지 삭제 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        fetchUserImages();
        loadCloudinaryScript();
    }, [userId]);

    return (
        <DashboardLayout>
            <div className="flex flex-col items-center w-full px-4 bg-gray-100 min-h-screen">
                <div className="grid grid-cols-3 gap-6 w-full ">
                    {/* "+" 버튼이 가장 앞에 위치 */}
                    <div
                        className="w-full h-[500px] bg-gray-200 rounded-md flex items-center justify-center cursor-pointer"
                        onClick={handleUpload}
                    >
                        <div className="w-20 h-20 flex items-center justify-center border-2 border-black rounded-full">
                            <span className="text-4xl font-bold">+</span>
                        </div>
                    </div>

                    {/* 사용자 이미지 렌더링 */}
                    {userImages.map((image) => (
                        <div
                            key={image.id}
                            className="relative w-full h-[500px] bg-gray-200 rounded-md overflow-hidden flex flex-col"
                            onClick={() => setSelectedImageId(image.id === selectedImageId ? null : image.id)} // 이미지 선택
                        >
                            <img
                                src={image.imageUrl}
                                alt={`운동 사진`}
                                className="w-full h-[90%] object-cover"
                            />
                            <div className="text-center text-sm text-gray-600 py-2">
                                {image.timestamp}
                            </div>

                            {/* 삭제 버튼 */}
                            {selectedImageId === image.id && (
                                <button
                                    className="absolute top-2 right-2 bg-red-500 text-white text-sm px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition"
                                    onClick={() => handleDeleteImage(image.id)}
                                >
                                    삭제
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ExercisePhotoPage;
