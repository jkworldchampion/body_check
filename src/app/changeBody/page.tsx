'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/app/firestore/firebase';
import { collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import useAuthStore from '@/store/useAuthStore';
import DashboardLayout from '@/app/componenets/dashboardLayout';
import styles from './changeBody.module.css';
import headerStyles from '@/app/utils/headerStyles';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

const ChangeBody = () => {
    const userId = useAuthStore((state) => state.userId);
    const [userImages, setUserImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [bmi, setBMI] = useState<number | null>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    // BMI 데이터 가져오기
    const fetchBMIData = async () => {
        if (!userId) return;

        try {
            const userDocRef = doc(firestore, 'users', userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setBMI(userData.bmi || 0); // 기본값 설정
            } else {
                console.error('사용자 데이터를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('BMI 데이터를 가져오는 중 오류가 발생했습니다:', error);
        }
    };

    // 사용자 이미지 가져오기
    const fetchUserImages = async () => {
        if (!userId) return;

        try {
            const imagesRef = collection(firestore, 'images');
            const q = query(imagesRef, where('userId', '==', userId));
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
        fetchUserImages();
        fetchBMIData();
        loadCloudinaryScript();
    }, [userId]);

    // 이미지 업로드
    const handleUpload = () => {
        if (!isScriptLoaded) {
            console.error('cloudinary script가 아직 로드되지 않았습니다.');
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

                        setUserImages((prevImages) => [...prevImages, uploadedUrl]);
                    } catch (firestoreError) {
                        console.error('Firestore에 이미지 저장 중 오류 발생:', firestoreError);
                    }
                }
            }
        );

        widget.open();
    };

    // 이미지 캐러셀 상태 계산
    const getCarouselClass = (index: number) => {
        if (index === currentIndex) return styles.activeImage;
        if (index === (currentIndex - 1 + userImages.length) % userImages.length) return styles.prevImage;
        if (index === (currentIndex + 1) % userImages.length) return styles.nextImage;
        return styles.hiddenImage;
    };

    // 차트 데이터와 옵션
    const analyzeData = {
        labels: ['BMI'],
        datasets: [
            {
                label: `사용자의 BMI: ${bmi || '데이터 없음'}`,
                data: [bmi],
                borderWidth: 1,
                barThickness: 30,
                backgroundColor: '#ADD8E6',
            },
        ],
    };

    const analyzeOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true },
            tooltip: {
                callbacks: {
                    label: (context: any) => `BMI: ${context.raw}`,
                },
            },
        },
        scales: {
            x: {
                type: 'linear',
                min: 10,
                max: 55,
                ticks: { stepSize: 5 },
            },
            y: {
                type: 'category',
                labels: ['BMI'],
            },
        },
    };

    return (
        <DashboardLayout>
            <div>
                <h1 style={headerStyles.introTitle}>오늘도 열심히 운동하셨군요!</h1>
                <div className={styles.analyzeSection}>
                    <Bar data={analyzeData} options={analyzeOptions} />
                </div>
            </div>
            <div className={styles.pageContainer}>
                <div className={styles.carouselContainer}>
                    {userImages.length > 0 ? (
                        <>
                            <button className={`${styles.arrowButton} ${styles.left}`} onClick={() => setCurrentIndex((currentIndex - 1 + userImages.length) % userImages.length)}>
                                ❮
                            </button>
                            {userImages.map((image, index) => (
                                <div key={index} className={`${styles.imageContainer} ${getCarouselClass(index)}`}>
                                    <img src={image} alt={`이미지 ${index}`} className={styles.image} />
                                </div>
                            ))}
                            <button className={`${styles.arrowButton} ${styles.right}`} onClick={() => setCurrentIndex((currentIndex + 1) % userImages.length)}>
                                ❯
                            </button>
                        </>
                    ) : (
                        <p>아직 사진이 없습니다. 지금 사진을 올려주세요!</p>
                    )}
                </div>
                <button onClick={handleUpload} disabled={!isScriptLoaded}>
                    {isScriptLoaded ? '이미지 업로드' : '로딩 중...'}
                </button>
            </div>
        </DashboardLayout>
    );
};

export default ChangeBody;
