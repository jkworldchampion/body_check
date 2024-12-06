'use client';
import React, { useRef } from "react";
import { useObserver } from "../utils/useObserver";

const WhySection: React.FC = () => {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);

    const { isVisible: isVisible1 } = useObserver({ target: ref1, option: { threshold: 0.4 } });
    const { isVisible: isVisible2 } = useObserver({ target: ref2, option: { threshold: 0.8 } });
    const { isVisible: isVisible3 } = useObserver({ target: ref3, option: { threshold: 0.9 } });

    return (
        <div className="flex justify-between items-start px-24 py-12 bg-black text-white h-screen box-border">
            {/* 텍스트 섹션 */}
            <div className="flex-1 max-w-[50%]">
                <h2 className="text-[80px] font-bold mb-5">WHY?</h2>
                <p className="text-[20px] leading-[1.8]">
                    운동의 중요성은 알지만 어떤 운동을 시작해야 할지 막막한 당신을 위해<br />
                    극한의 효율을 중시하는 현대인들에게 도움이 되고자 합니다.
                </p>
                <hr className="w-full h-[2px] bg-gray-400 border-none mt-[280px] mb-5" />
            </div>

            {/* 버블 섹션 */}
            <div className="flex-1 flex flex-col items-end gap-8">
                {/* 첫 번째 버블 */}
                <div
                    ref={ref1}
                    className={`mt-[280px] mr-[130px] w-[200px] h-[200px] bg-gray-300 text-black p-10 rounded-full flex items-center justify-center text-[16px] font-bold text-center leading-[1.5] transition-transform transition-opacity duration-600 ${
                        isVisible1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                    }`}
                >
                    어떻게 운동을 해야할지 막막해요
                </div>

                {/* 두 번째 버블 행 */}
                <div className="flex gap-12">
                    <div
                        ref={ref2}
                        className={`w-[200px] h-[200px] mt-7 bg-gray-600 text-white rounded-full flex items-center justify-center text-[14px] font-bold text-center leading-[1.5] transition-transform transition-opacity duration-600 ${
                            isVisible2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                        }`}
                    >
                        내가 직접 운동을 하면서<br />바로바로 피드백을 받고 싶어요
                    </div>
                    <div
                        ref={ref3}
                        className={`w-[200px] h-[200px] mt-7 bg-white text-black rounded-full flex items-center justify-center text-[14px] font-bold text-center leading-[1.5] transition-transform transition-opacity duration-600 ${
                            isVisible3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                        }`}
                    >
                        내가 직접 운동을 하면서<br />바로바로 피드백을 받고 싶어요
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhySection;
