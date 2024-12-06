'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function HeroSection() {
    useEffect(() => {
        // 페이지 로드 시 일정 시간 후 스크롤
        const timer = setTimeout(() => {
            window.scrollTo({
                top: window.innerHeight * 0.2, // 화면의 20% 정도 아래로 스크롤
                behavior: 'smooth',
            });
        }, 1000); // 1초 뒤에 실행

        return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
    }, []);

    return (
        <div className="flex items-center justify-between h-screen px-10 bg-white">
            {/* 텍스트 컨테이너 */}
            <div className="max-w-[800px] ml-8">
                <p className="text-[30px] text-gray-800 m-0">체형맞춤형 운동추천</p>
                <h1 className="text-[80px] font-bold my-4">BODY : CHECK</h1>
                <Link href="/myBody" passHref>
                    <button className="px-8 py-4 text-black border-2 border-black rounded-full bg-transparent cursor-pointer hover:bg-black hover:text-white transition-colors duration-300 mt-5">
                        서비스 시작하기
                    </button>
                </Link>
            </div>
            {/* 로고 이미지 */}
            <img
                src="/images/mainImage.png"
                alt="logo"
                className="w-[500px] h-[500px] mr-8"
            />
        </div>
    );
}
