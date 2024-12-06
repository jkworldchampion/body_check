'use client';
import React, { useRef, useEffect } from "react";
import { useObserver } from "../utils/useObserver";

export default function GraphSection() {
    const textRef = useRef(null);
    const graphRef = useRef(null);
    const { isVisible: isTextVisible } = useObserver({ target: textRef, option: { threshold: 0.3 } });
    const { isVisible: isGraphVisible } = useObserver({ target: graphRef, option: { threshold: 0.5 } });

    useEffect(() => {
        console.log("Text visible:", isTextVisible);
        console.log("Graph visible:", isGraphVisible);
    }, [isTextVisible, isGraphVisible]);

    return (
        <div className="flex flex-col items-center justify-center text-center h-[100vh] bg-black overflow-hidden">
            <div
                ref={textRef}
                className={`mb-10 w-full flex flex-col items-center justify-center text-center transition-opacity duration-1000 ease-out transform ${
                    isTextVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
            >
                <h2 className="text-[60px] text-amber-50 font-bold mt-[100px]">한눈에 보는 그래프</h2>
                <p className="text-amber-50 text-[30px] mt-10 leading-relaxed max-w-[450px]">
                    수치화된 통계 데이터로 몸의 변화를 보여드릴게요.
                </p>
            </div>
            <div
                ref={graphRef}
                className={`relative mt-10 w-full h-[90vh] flex px-0   transition-opacity duration-1000 ease-out transform ${
                    isGraphVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
            >
                <img
                    src="/images/computermockup.png"
                    alt="컴퓨터 프레임"
                    className="w-full h-full object-contain px-0"
                />
            </div>
        </div>
    );
}
