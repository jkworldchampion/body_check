'use client';

import React from 'react';
import ImageUploader from '../componenets/ImageUploader';

const myBody: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-3">체형 분석하기</h1>
            <p className="mb-6 mt-0">사진을 업로드하고 결과지를 받아보세요 </p>
            <ImageUploader/>
        </div>
    );
};

export default myBody;
