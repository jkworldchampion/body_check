"use client";

import React from "react";
import { uploadImageToCloudinary } from "../utils/ImageUpload";
import useImageStore from "@/store/imageStore";

export default function HandleUpload() {
    const setUploadedImageUrl = useImageStore((state) => state.setUploadedImageUrl);

    const handleUpload = () => {
        uploadImageToCloudinary(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
                sources: ["local", "url", "camera", "image_search"],
            },
            (url: string) => {
                console.log("업로드된 이미지 URL:", url);
                setUploadedImageUrl(url); // Zustand 상태 업데이트
            },
            (error: any) => {
                console.error("이미지 업로드 중 오류 발생:", error);
            }
        );
    };

    return (
        <div>
            <button onClick={handleUpload}>이미지 업로드</button>
        </div>
    );
}
