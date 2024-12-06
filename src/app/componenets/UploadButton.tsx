'use client';

import React, { useState, useEffect } from 'react';
import useImageStore from '../../store/imageStore';

interface UploadOptions {
    cloudName: string;
    uploadPreset: string;
    sources: string[];
    cropping: boolean;
    transformation?: Array<Record<string, any>>;
}

const UploadButton: React.FC = () => {
    const setUploadedImageUrl = useImageStore((state) => state.setUploadedImageUrl);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
        if (window.cloudinary) {
            setIsScriptLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://upload-widget.cloudinary.com/global/all.js';
        script.async = true;
        script.onload = () => setIsScriptLoaded(true);
        script.onerror = () => console.error('Cloudinary script 로드 실패');
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleUpload = () => {
        if (!isScriptLoaded) {
            console.error('Cloudinary script is not loaded yet');
            return;
        }

        const widgetOptions: UploadOptions = {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
            sources: ['local', 'url', 'camera'],
            cropping: true,
            transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'auto' }]
        };

        const widget = window.cloudinary.createUploadWidget(widgetOptions, (error: any, result: any) => {
            if (error) {
                console.error('이미지 업로드 오류:', error);
                return;
            }

            if (result.event === 'success') {
                const uploadedUrl = result.info.secure_url;
                console.log('업로드된 이미지 URL:', uploadedUrl);

                setUploadedImageUrl(uploadedUrl); // Zustand에 이미지 URL 저장
            }
        });

        widget.open();
    };

    return (
        <button
            onClick={handleUpload}
            disabled={!isScriptLoaded}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
            {isScriptLoaded ? '이미지 업로드' : '로딩 중...'}
        </button>
    );
};

export default UploadButton;
