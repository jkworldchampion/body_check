'use client';
import React, { useRef } from "react";
import { useObserver } from "../utils/useObserver";

export default function TogetherSection() {
    const textRef = useRef(null);
    const imageRef = useRef(null);
    const { isVisible: isTextVisible } = useObserver({ target: textRef, option: { threshold: 0.3 } });
    const { isVisible: isImageVisible } = useObserver({ target: imageRef, option: { threshold: 0.5 } });

    return (
        <div className="flex items-center px-10 py-10 bg-gray-100 h-screen overflow-hidden">
            {/* 텍스트 섹션 */}
            <div
                ref={textRef}
                className={`max-w-[40%] mr-10 opacity-0 translate-y-5 transition-all duration-[4000ms] ease-out ${
                    isTextVisible ? "opacity-100 translate-y-0" : ""
                }`}
            >
                <h2 className="text-[3rem] font-bold leading-[1.2] border-l-[5px] border-black pl-4 mb-5">
                    TOGETHER <br /> JOIN
                </h2>
                <p className="text-[30px] leading-[1.6] text-gray-800">
                    공유하기 기능을 통해 친구들과 함께 나의 기록을 자랑하고
                    나의 상대적 위치를 확인할 수 있어요.
                </p>
            </div>

            {/* 이미지 섹션 */}
            <div
                ref={imageRef}
                className={`flex flex-1 justify-center items-center opacity-0 translate-y-5 transition-all duration-[4000ms] ease-out ${
                    isImageVisible ? "opacity-100 translate-y-0" : ""
                }`}
            >
                <img
                    src="/images/gotocellphone.png"
                    alt="친구와 함께하는 이미지"
                    className="w-[80%] h-auto rounded-lg object-cover"
                />
            </div>
        </div>
    );
}
