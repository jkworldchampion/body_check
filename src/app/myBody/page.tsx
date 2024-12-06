'use client';

import React from 'react';
import ImageUploader from '../componenets/ImageUploader';

const myBody: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">체형 분석하기</h1>
            <ImageUploader />
        </div>
    );
};

export default myBody;
