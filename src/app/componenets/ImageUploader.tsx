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
    const [showLoginButton, setShowLoginButton] = useState(false); // 로그인 버튼 표시 상태
    const router = useRouter();

    const bodyMeasurementLabels = [
        '목뒤높이', '엉덩이높이', '겨드랑높이', '허리높이', '샅높이', '무릎높이',
        '머리둘레', '목둘레', '젖가슴둘레', '허리둘레', '배꼽수준 허리둘레', '엉덩이둘레',
        '넓다리둘레', '무릎둘레', '장딴지둘레', '종아리 최소둘레', '발목둘레', '편평복사둘레',
        '손목둘레', '위팔길이', '팔길이', '어깨사이 너비', '머리수직길이', '얼굴수직 길이',
        '발크기', '발너비', '얼굴 너비', '손 직선 길이', '손바닥 직선길이', '손 안쪽 각주 직선 길이',
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
        if (!file || !height || !bmi) {
            alert('이미지와 정보를 모두 입력해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('height', height);
        formData.append('bmi', bmi);

        try {
            setIsLoading(true); // "사진 분석 중..." 상태 시작
            setResult(null);

            const response = await fetch('/predict', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('서버 원본 데이터:',data.result);

                setTimeout(() => {
                    setResult(data.result); // 결과 설정
                    setIsLoading(false); // "사진 분석 중..." 종료
                }, 3000); // 3초 지연
            } else {
                setResult(null);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setResult(null);
            setIsLoading(false);
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            setShowLoginButton(true); // 스크롤 끝에 도달하면 버튼 표시
        }
    };

    return (
        <div className=" md:grid-cols-2 gap-8 p-12 bg-gray-100 min-h-screen">
            {/* 이미지 업로드 섹션 */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">이미지 업로드</h2>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="mb-6 block w-full border border-gray-300 rounded-lg p-2"
                />
                <div className="relative">
                    {previewUrl && (
                        <div className="relative">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className={`w-full h-auto rounded-lg shadow-md mb-6 ${isLoading ? 'opacity-50' : ''}`}
                            />
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                                    <div className="text-white text-xl font-bold animate-pulse">사진 분석 중...</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
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
                    className="w-full px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
                    disabled={isLoading}
                >
                    {isLoading ? '분석 중...' : '결과 예측하기'}
                </button>
            </div>

            {/* 결과 섹션 */}
            {result && (
                <div
                    className="bg-white p-8 rounded-lg shadow-lg overflow-y-auto h-96"
                    onScroll={handleScroll}
                >
                    <h3 className="text-xl font-bold mb-4">예측 결과</h3>
                    <table className="w-full border-collapse border border-gray-300 text-sm">
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
                                    {result[index]?.toFixed(2) || 'N/A'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 로그인 버튼 */}
            {showLoginButton && (
                <div
                    className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out ${
                        showLoginButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <button
                        onClick={() => router.push('/Login')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg shadow-lg hover:bg-blue-700 transition transform scale-105"
                    >
                        로그인하고
                        결과 더보기
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
