'use client';

import React, { useRef } from "react";
import { useObserver } from "../utils/useObserver";

export default function RecordSection() {
    const imageRef = useRef(null);
    const textRef = useRef(null);

    const { isVisible: isImageVisible } = useObserver({ target: imageRef, option: { threshold: 0.3 } });
    const { isVisible: isTextVisible } = useObserver({ target: textRef, option: { threshold: 0.3 } });

    return (
        <div className="flex flex-row items-center justify-between h-[79vh] bg-gray-300 overflow-hidden">
            {/* 이미지 섹션 */}
            <div
                ref={imageRef}
                className={`relative flex items-center justify-end w-[65%] transition-opacity duration-1000 ease-out transform ${
                    isImageVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                }`}
            >
                <div className="absolute top-0 right-0 w-full h-full  rounded-lg -z-10"></div>
                <img
                    src="/images/sportsmockup.png"
                    alt="운동 측정 이미지 1"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* 텍스트 섹션 */}
            <div
                ref={textRef}
                className={`flex flex-col items-end justify-center pr-20 text-right w-[35%] transition-opacity duration-1000 ease-out transform ${
                    isTextVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                }`}
            >
                <h2 className="text-6xl font-bold mb-4">
                    직접 기록해야 하는 번거로움은 낮췄습니다.
                </h2>
                <p className="text-3xl leading-relaxed whitespace-pre-line">
                    이제 내 움직임을
                    자동으로 측정하여
                    더 편리하게 운동 기록을 측정해보세요.
                </p>
            </div>
        </div>
    );
}
