"use client";

import React, { useEffect, useState } from "react";
import { firestore } from "@/app/firestore/firebase";
import { collection, query, where, getDocs, addDoc, doc, getDoc, orderBy } from "firebase/firestore";
import useAuthStore from "@/store/useAuthStore";
import DashboardLayout from "@/app/componenets/dashboardLayout";
import { Bar } from "react-chartjs-2";
import { FatCalculator } from "../componenets/FatCalculator";
import { AgeCalculator } from "../componenets/AgeCalculator";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

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
    const [visibleImages, setVisibleImages] = useState<number>(6);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [calculatedData, setCalculatedData] = useState<any>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    // Firestore에서 사용자 데이터 가져오기
    const fetchUserData = async () => {
        if (!userId) return;

        try {
            const userDocRef = doc(firestore, "users", userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const data = userDoc.data() as UserData;
                setUserData(data);

                const fatData = FatCalculator(data.weight, data.height, data.gender, data.age);
                const ageGroup = AgeCalculator(data.age);

                setCalculatedData({ ...fatData, ageGroup });
            } else {
                console.error("사용자 데이터를 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error("데이터 가져오는 중 오류 발생:", error);
        }
    };

    const fetchUserImages = async () => {
        if (!userId) return;

        try {
            const imagesRef = collection(firestore, "images");
            const q = query(imagesRef, where("userId", "==", userId), orderBy("timestamp", "asc"));
            const querySnapshot = await getDocs(q);

            const images = querySnapshot.docs.map((doc) => doc.data().imageUrl || "");
            setUserImages(images);
        } catch (error) {
            console.error("사용자 이미지 가져오는 중 오류 발생:", error);
        }
    };

    const loadCloudinaryScript = () => {
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

        return () => {
            document.body.removeChild(script);
        };
    };

    useEffect(() => {
        fetchUserData();
        fetchUserImages();
        loadCloudinaryScript();
    }, [userId]);

    const handleUpload = () => {
        if (!isScriptLoaded) {
            console.error("Cloudinary script가 아직 로드되지 않았습니다.");
            return;
        }

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
                sources: ["local", "url", "camera"],
            },
            async (error: any, result: any) => {
                if (error) {
                    console.error("이미지 업로드 중 오류 발생:", error);
                    return;
                }

                if (result.event === "success") {
                    const uploadedUrl = result.info.secure_url;

                    try {
                        const imagesRef = collection(firestore, "images");
                        await addDoc(imagesRef, {
                            userId: userId,
                            imageUrl: uploadedUrl,
                            timestamp: new Date(),
                        });

                        setUserImages((prevImages) => [...prevImages, uploadedUrl]);
                    } catch (firestoreError) {
                        console.error("Firestore에 이미지 저장 중 오류 발생:", firestoreError);
                    }
                }
            }
        );

        widget.open();
    };

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
        indexAxis: "y",
        maintainAspectRatio: false,
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">오늘도 열심히 운동하셨군요! 💪</h1>

                {calculatedData && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-2">BMI</h2>
                            <div className="h-48">
                                <Bar
                                    data={generateChartData("BMI", calculatedData.bmi, "#CEDFF6")}
                                    options={chartOptions}
                                />
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-2">체지방률 (%)</h2>
                            <div className="h-48">
                                <Bar
                                    data={generateChartData("체지방률", calculatedData.fatPercentage, "#CEDFF6")}
                                    options={chartOptions}
                                />
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-2">체중 (kg)</h2>
                            <div className="h-48">
                                <Bar
                                    data={generateChartData("체중", userData!.weight, "#CEDFF6")}
                                    options={chartOptions}
                                />
                            </div>
                        </div>
                    </>
                )}

                <h2 className="text-xl font-semibold mb-4">운동 사진</h2>

                <div className="grid grid-cols-3 gap-4">
                    {userImages.slice(0, visibleImages).map((image, index) => (
                        <div key={index} className="w-full h-64 bg-gray-200 rounded-md overflow-hidden">
                            <img src={image} alt={`운동 사진 ${index}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-4">
                    {userImages.length > visibleImages ? (
                        <button
                            onClick={() => setVisibleImages((prev) => prev + 6)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            사진 더보기...
                        </button>
                    ) : visibleImages > 6 ? (
                        <button
                            onClick={() => setVisibleImages(6)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                            접어두기
                        </button>
                    ) : null}
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleUpload}
                        disabled={!isScriptLoaded}
                        className={`px-6 py-3 border-2 border-black text-black rounded-full transition ${
                            isScriptLoaded ? "hover:bg-gray-100" : "cursor-not-allowed bg-gray-300"
                        }`}
                    >
                        이미지 업로드
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Changebody;
