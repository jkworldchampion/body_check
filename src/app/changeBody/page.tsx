'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/app/firestore/firebase';
import {collection, query, where, getDocs, addDoc, doc, getDoc} from 'firebase/firestore';
import useAuthStore from '@/store/useAuthStore';
import DashboardLayout from '@/app/componenets/dashboardLayout';
import styles from './changeBody.module.css'; // 스타일 모듈 import
import headerStyles from "@/app/utils/headerStyles";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Bar } from 'react-chartjs-2'; // Chart.js

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);




const ChangeBody = () => {
    const userId = useAuthStore((state) => state.userId);
    const [userImages, setUserImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [bmi, setBMI] = useState<number | null>(null); // 사용자 BMI
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);


    // firestore 에서 bmi 데이터 가져오기
    const fetchBMIData = async () => {
        try {
            const userDocRef = doc(firestore, 'users', userId); // `users` 컬렉션의 특정 문서 참조
            const userDoc = await getDoc(userDocRef); // 문서 가져오기

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setBMI(userData.bmi); // Firestore에서 BMI 값을 가져와 상태에 저장
            } else {
                console.error('사용자 데이터를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('BMI 데이터를 가져오는 중 오류가 발생했습니다:', error);
        } finally {
        }
    };

    useEffect(() => {
        const fetchUserImages = async () => {
            if (!userId) return;

            try {
                const imagesRef = collection(firestore, 'images');
                const q = query(imagesRef, where('userId', '==', userId));
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
                console.error('사용자 이미지 가져오는 중 오류 발생:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserImages();
        fetchBMIData();

    }, [userId]);

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
            console.error('cloudinary script 가 아직 로드되지 않았습니다. ');
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
                    console.log('업로드된 이미지 URL:', uploadedUrl);

                    try {
                        const imagesRef = collection(firestore, 'images');
                        await addDoc(imagesRef, {
                            userId: userId,
                            imageUrl: uploadedUrl,
                            timestamp: new Date(),
                        });

                        setUserImages((prevImages) => [...prevImages, uploadedUrl]); // 상태 즉시 갱신
                    } catch (firestoreError) {
                        console.error('Firestore에 이미지 저장 중 오류 발생:', firestoreError);
                    }
                }
            }
        );

        widget.open();
    };


    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % userImages.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + userImages.length) % userImages.length);
    };



    const analyzeData = {
        labels:['bmi'],
        datasets: [
            {
                label: `사용자의 BMI: ${bmi || '데이터 없음'}`,
                data: [bmi], // 평균 데이터
                borderWidth:1,
                barThickness: 30,
                backgroundColor: '#ADD8E6',
            },
        ],
    };

    // 옵션지정하기
    const analyzeOptions = {
        indexAxis: "y",// 가로 방향 막대 그래프
        responsive: true,
        maintainAspectRatio: false, // 크기 비율을 강제로 조정 가능하도록 설정
        plugins: {
            legend: { // 범례 설정
                display: true, // 범례 활성
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `BMI: ${context.raw}`, // 툴팁에 BMI 값 표시
                },
            },
        },
        scales: {
            x: {
                type: "linear", // X축을 숫자형 스케일로 설정
                min: 10, // X축 최소값
                max: 55, // X축 최대값
                ticks: {
                    stepSize: 5, // X축 값 간격
                    callback: (value: number) => {
                        // X축 커스텀 레이블
                        const labelsMap: { [key: number]: string } = {
                            10: '10',
                            18.5: '18.5(저체중)',
                            25: '25 (정상)',
                            30: '30(과체중)',
                            55: '55',
                        };
                        return labelsMap[value] || value.toString();
                    },
                },
                title: { display: true, text: 'BMI 값' }, // X축 제목
            },
            y: {
                type: 'category', // Y축을 카테고리형으로 설정
                labels: ['BMI'], // Y축 레이블
                title: { display: false }, // Y축 제목 제거
            },
        },
    };

    // @ts-ignore
    return (
        <DashboardLayout>
            <div>
                <h1 style={headerStyles.introTitle}>
                    오늘도 열심히 운동하셨군요!
                </h1>
                <p style={headerStyles.introSubTitle}>
                    열심히 운동한 당신 !
                    매일매일 기록하는 오운완 사진을 확인해보세요
                </p>
                <div className={styles.analyzeSection}>
                    <h2 className={styles.analyzeTitle}>체형 분석</h2>
                    <div className={styles.chartContainer}>
                        <Bar data={analyzeData} options={analyzeOptions}/>
                    </div>
                </div>


            </div>


            <div className={styles.pageContainer}>
                <div className={styles.carouselContainer}>
                    {userImages.length > 0 ? (
                        <>
                            {/* 이전 버튼 */}
                            <button className={`${styles.arrowButton} ${styles.left}`} onClick={handlePrev}>
                                ❮
                            </button>

                            {/* 이미지 렌더링 */}
                            {userImages.map((image, index) => {
                                const position =
                                    index === currentIndex
                                        ? `${styles.activeImage}`
                                        : index === (currentIndex - 1 + userImages.length) % userImages.length
                                            ? `${styles.prevImage}`
                                            : index === (currentIndex + 1) % userImages.length
                                                ? `${styles.nextImage}`
                                                : `${styles.hiddenImage}`;

                                return (
                                    <div key={index} className={`${styles.imageContainer} ${position}`}>
                                        <img src={image} alt={`이미지 ${index}`} className={styles.image}/>
                                    </div>
                                );
                            })}

                            {/* 다음 버튼 */}
                            <button className={`${styles.arrowButton} ${styles.right}`} onClick={handleNext}>
                                ❯
                            </button>
                        </>
                    ) : (
                        <p className="text-center text-gray-500">
                            아직 사진이 없습니다. 지금 사진을 올려주세요!
                        </p>
                    )}
                </div>

                {/* 이미지 업로드 버튼 */}
                <div className={styles.ButtonBox}>
                    <button
                        onClick={handleUpload}
                        disabled={!isScriptLoaded}
                        className={styles.uploadButton}
                    >
                        {isScriptLoaded ? '이미지 업로드' : '로딩 중...'}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ChangeBody;
