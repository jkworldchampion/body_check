'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/app/firestore/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import useAuthStore from '@/store/useAuthStore';
import DashboardLayout from '@/app/componenets/dashboardLayout';
import styles from './changeBody.module.css'; // 스타일 모듈 import

const ChangeBody = () => {
    const userId = useAuthStore((state) => state.userId);
    const [userImages, setUserImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

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
            console.error('Cloudinary script is not loaded yet');
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

    return (
        <DashboardLayout>
            <div className={`${styles.introBox} mb-6`}>
                <h1 className={styles.introTitle}>
                    그동안의 오운완 💪 ! 사진을 확인해보세요 !
                </h1>
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
