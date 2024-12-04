'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/app/firestore/firebase';
import {collection, query, where, getDocs, addDoc, doc, getDoc, orderBy} from 'firebase/firestore';
import useAuthStore from '@/store/useAuthStore';
import DashboardLayout from '@/app/componenets/dashboardLayout';
import styles from './changeBody.module.css';
import headerStyles from '@/app/utils/headerStyles';
import { Bar } from 'react-chartjs-2';
import { FatCalculator } from '../componenets/FatCalculator';
import { AgeCalculator } from '../componenets/AgeCalculator';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface UserData {
    weight: number;
    height: number;
    gender: string;
    age: number;
}

const Changebody = () => {
    const userId = useAuthStore((state) => state.userId);
    const [userImages, setUserImages] = useState<string[]>([]);
    const [visibleImages, setVisibleImages] = useState<number>(3);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [calculatedData, setCalculatedData] = useState<any>(null);
    const [weight, setWeight] = useState(0);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    // Firestore에서 사용자 데이터 가져오기
    const fetchUserData = async () => {
        if (!userId) return;

        try {
            const userDocRef = doc(firestore, 'users', userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const data = userDoc.data() as UserData;
                setUserData(data);

                // BMI 및 기타 데이터 계산
                const fatData = FatCalculator(data.weight, data.height, data.gender, data.age);
                const ageGroup = AgeCalculator(data.age);

                setCalculatedData({...fatData, ageGroup});
            } else {
                console.error('사용자 데이터를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('데이터 가져오는 중 오류 발생:', error);
        }
    };

    // Firestore에서 사용자 이미지 가져오기
    const fetchUserImages = async () => {
        if (!userId) return;

        try {
            const imagesRef = collection(firestore, 'images');
                const q = query(imagesRef, where('userId', '==', userId), orderBy('timestamp', 'asc')); // 저장된 순서대로 정렬
            const querySnapshot = await getDocs(q);

            const images = querySnapshot.docs.map((doc) => doc.data().imageUrl || '');
            setUserImages(images);
        } catch (error) {
            console.error('사용자 이미지 가져오는 중 오류 발생:', error);
        }
    };

    // Cloudinary 스크립트 로드
    const loadCloudinaryScript = () => {
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
    };

    useEffect(() => {
        fetchUserData();
        fetchUserImages();
        loadCloudinaryScript();
    }, [userId]);

    // 이미지 업로드
    const handleUpload = () => {
        if (!isScriptLoaded) {
            console.error('Cloudinary script가 아직 로드되지 않았습니다.');
            return;
        }

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
                sources: ['local', 'url', 'camera'],
            },
            async (error: any, result: any) => {
                if (error) {
                    console.error('이미지 업로드 중 오류 발생:', error);
                    return;
                }

                if (result.event === 'success') {
                    const uploadedUrl = result.info.secure_url;

                    try {
                        const imagesRef = collection(firestore, 'images');
                        await addDoc(imagesRef, {
                            userId: userId,
                            imageUrl: uploadedUrl,
                            timestamp: new Date(),
                        });

                        setUserImages((prevImages) => [...prevImages, uploadedUrl]);
                    } catch (firestoreError) {
                        console.error('Firestore에 이미지 저장 중 오류 발생:', firestoreError);
                    }
                }
            }
        );

        widget.open();
    };

    // 그래프 데이터 생성 함수
    const generateChartData = (label: string, value: number, color: string) => ({
        labels: [label],
        datasets: [
            {
                label,
                data: [value],
                backgroundColor: [color],
                borderWidth: 1,
            },
        ],
    });

    const chartOptions = {
        responsive: true,
        indexAxis: 'y',
        maintainAspectRatio: false,

        x: {
            ticks: {
                stepSize: 5, // 눈금 간격 설정
                callback: (value: any) => `${value}`, // 눈금 레이블 커스터마이징
            },
            min: 0, // 최소값 설정
            max: 50, // 최대값 설정
        },
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <DashboardLayout>
            <div>
                <h1 style={headerStyles.introTitle}>오늘도 열심히 운동하셨군요! 💪</h1>

                {calculatedData && (
                    <>
                        <div className={styles.chartSection}>
                            <h2 className={styles.h2Font}>BMI</h2>
                            <div style={{height: '200px', width: '100%'}}>
                                <Bar
                                    data={generateChartData('BMI', calculatedData.bmi, '#CEDFF6')}
                                    options={chartOptions}
                                />
                            </div>
                        </div>

                        <div className={styles.chartSection}>
                            <h2 className={styles.h2Font}>체지방률 (%)</h2>
                            <div style={{height: '200px', width: '100%'}}>
                                <Bar
                                    data={generateChartData('체지방률', calculatedData.fatPercentage, '#CEDFF6')}
                                    options={chartOptions}
                                />
                            </div>
                        </div>

                        <div className={styles.chartSection}>
                            <h2 className={styles.h2Font}>체중 (kg)</h2>
                            <div style={{height: '200px', width: '100%'}}>
                                <Bar
                                    data={generateChartData('체중', userData!.weight, '#CEDFF6')} // Firestore의 weight 사용
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false, // 고정 높이를 유지하기 위해 비율 유지 비활성화
                                        indexAxis: 'y',
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                        },
                                        x: {
                                            ticks: {
                                                stepSize: 10, // 눈금 간격 설정
                                                align: 'start'
                                            },
                                            min: 0, // 최소값 설정
                                            max: 100, // 최대값 설정
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className={styles.pageContainer}>
                <h2 className={styles.h2Font}>운동 사진</h2>

                <div>
                    {Array.from({length: Math.ceil(visibleImages / 3)}).map((_, rowIndex) => (
                        <div key={rowIndex} className={styles.boxContainer}>
                            {userImages
                                .slice(rowIndex * 3, rowIndex * 3 + 3)
                                .map((image, index) => (
                                    <div key={index} className={styles.imageBox}>
                                        <img src={image} alt={`운동 사진 ${index}`} className={styles.image}/>
                                    </div>
                                ))}

                            {/* 빈 박스 로직 */}
                            {userImages.slice(rowIndex * 3, rowIndex * 3 + 3).length < 3 &&
                                Array(3 - userImages.slice(rowIndex * 3, rowIndex * 3 + 3).length)
                                    .fill(0)
                                    .map((_, emptyIndex) => (
                                        <div key={`empty-${rowIndex}-${emptyIndex}`} className={styles.imageBox}>
                                            <span>사진을 첨부하세요</span>
                                        </div>
                                    ))}
                        </div>
                    ))}
                </div>

                {/* 버튼 영역 */}
                <div className={styles.ButtonBox}>
                    {userImages.length > visibleImages ? (
                        <button
                            onClick={() => setVisibleImages((prev) => prev + 3)} // "사진 더보기" 버튼
                            className={styles.moreButton}
                        >
                            사진 더보기...
                        </button>
                    ) : visibleImages > 3 ? ( // 모든 사진이 표시된 경우 "접어두기" 버튼 활성화
                        <button
                            onClick={() => setVisibleImages(3)} // 초기 상태로 리셋
                            className={styles.collapseButton}
                        >
                            접어두기
                        </button>
                    ) : null}
                </div>

                {/* 업로드 버튼 */}
                <div className={styles.ButtonBox}>
                    <button
                        onClick={handleUpload}
                        disabled={!isScriptLoaded}
                        className={styles.uploadButton}
                    >
                        이미지 업로드
                    </button>
                </div>
            </div>


        </DashboardLayout>
    );
};


export default Changebody;
