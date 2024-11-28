"use client";

import React, { useEffect, useState } from "react";
import useImageStore from "@/store/imageStore";

interface UploadOptions {
    cloudName: string;
    uploadPreset: string;
    sources: string[];
}

export default function HandleUpload() {
    const setUploadedImageUrl = useImageStore((state) => state.setUploadedImageUrl);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
        // Cloudinary 스크립트 로드 확인 및 로드 로직
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

        // Cleanup 시 스크립트 제거
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleUpload = () => {
        if (!isScriptLoaded) {
            console.error("Cloudinary script is not loaded yet");
            return;
        }

        const widgetOptions: UploadOptions = {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
            sources: ["local", "url", "camera", "image_search"], // 지원하는 업로드 소스
        };

        try {
            const widget = window.cloudinary.createUploadWidget(widgetOptions, (error: any, result: any) => {
                if (error) {
                    console.error("이미지 업로드 중 오류 발생:", error);
                    return;
                }
                if (result.event === "success") {
                    const uploadedUrl = result.info.secure_url;
                    console.log("업로드된 이미지 URL:", uploadedUrl);
                    setUploadedImageUrl(uploadedUrl); // 상태 저장
                }
            });

            widget.open(); // 위젯 열기
        } catch (error) {
            console.error("Cloudinary 위젯 초기화 중 오류 발생:", error);
        }
    };

    return (
        <div className="flex justify-center my-4">
            <button
                onClick={handleUpload}
                disabled={!isScriptLoaded}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isScriptLoaded ? "이미지 업로드" : "로딩 중..."}
            </button>
        </div>
    );
}
