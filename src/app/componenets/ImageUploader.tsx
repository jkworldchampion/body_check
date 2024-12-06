'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const ImageUploader: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [result, setResult] = useState<number[] | null>(null);
    const [height, setHeight] = useState<string>('');
    const [bmi, setBmi] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const bodyMeasurementLabels = [
        '목뒤높이',
        '엉덩이높이',
        '겨드랑높이',
        '허리높이',
        '샅높이',
        '무릎높이',
        '머리둘레',
        '목둘레',
        '젖가슴둘레',
        '허리둘레',
        '배꼽수준 허리둘레',
        '엉덩이둘레',
        '넓다리둘레',
        '무릎둘레',
        '장딴지둘레',
        '종아리 최소둘레',
        '발목둘레',
        '편평복사둘레',
        '손목둘레',
        '위팔길이',
        '팔길이',
        '어깨사이 너비',
        '머리수직길이',
        '얼굴수직 길이',
        '발크기',
        '발너비',
        '얼굴 너비',
        '손 직선 길이',
        '손바닥 직선길이',
        '손 안쪽 각주 직선 길이',
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleSubmit = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            alert('이미지 파일을 선택해주세요.');
            return;
        }
        if (!height) {
            alert('키를 입력해주세요.');
            return;
        }
        if (!bmi) {
            alert('BMI를 입력해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('height', height);
        formData.append('bmi', bmi);

        try {
            setIsLoading(true);
            setResult(null);

            const response = await fetch('/predict', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('서버 원본 데이터:', data.result);
                setResult(data.result);
            } else {
                setResult(null);
            }
        } catch (error) {
            console.error('Error:', error);
            setResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const normalizedResult = bodyMeasurementLabels.map((label, index) => {
        if (!result) return 'N/A';
        return result[index] !== undefined ? result[index].toFixed(2) : 'N/A';
    });

    return (
        <div className="flex flex-col md:flex-row items-start justify-center gap-8 p-4 bg-gray-100 min-h-screen">
            {/* 이미지 업로드 섹션 */}
            <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-black">신체 분석하기</h2>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="mb-6 block w-full border border-gray-300 rounded-lg p-2"
                />
                {previewUrl && (
                    <div className="mb-6">
                        <img src={previewUrl} alt="Preview" className="w-full h-auto rounded-lg shadow-md" />
                    </div>
                )}
                <input
                    type="number"
                    placeholder="키(cm)"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="mb-4 block w-full border border-gray-300 rounded-lg p-2"
                />
                <input
                    type="number"
                    placeholder="BMI"
                    value={bmi}
                    onChange={(e) => setBmi(e.target.value)}
                    className="mb-6 block w-full border border-gray-300 rounded-lg p-2"
                />
                <button
                    onClick={handleSubmit}
                    className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                    disabled={isLoading}
                >
                    {isLoading ? '로딩중...' : '결과 예측하기'}
                </button>
            </div>

            {/* 결과 표시 섹션 */}
            {result && (
                <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-black text-center">예측결과</h3>
                    <table className="w-full border-collapse border border-gray-300 text-sm text-black">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2 text-left">항목</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">값</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bodyMeasurementLabels.map((label, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2">{label}</td>
                                <td className="border border-gray-300 px-4 py-2 text-right">
                                    {normalizedResult[index]}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* 애니메이션 버튼 */}
                    <div className="mt-6 flex justify-center animate-fade-in">
                        <button
                            onClick={() => router.push('/Login')}
                            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                        >
                            <p>서비스 시작</p>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
