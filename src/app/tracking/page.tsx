"use client";

import React from "react";
import DashboardLayout from "@/app/componenets/dashboardLayout";

export default function RecordingExercise() {
    const handleRedirect = () => {
        window.location.href = "http://202.30.29.168:9888"; //
    };

    return (
        <DashboardLayout>
            {/* 콘텐츠 */}
            <div className="flex mt-[100px] items-center gap-10">
                {/* 설명 영역 (왼쪽) */}
                <div className="flex-1 p-12">
                    <h1 className="text-[60px] font-bold mb-5">BODY : CHECK</h1>
                    <p className="text-[30px] leading-relaxed mb-[100px] text-gray-800">
                        이제 운동할 준비가 되셨나요?<br />
                        <strong>BODY : CHECK</strong>는 실시간으로 운동을 체크해드려요.
                    </p>
                    {/* 서버 연결 버튼 */}
                    <button
                        onClick={handleRedirect}
                        className="px-10 py-5 bg-black text-white rounded-full text-[16px] hover:bg-gray-800 transition"
                    >
                        서버 연결
                    </button>
                </div>

                {/* 버튼과 텍스트 영역 (오른쪽) */}
                <div className="flex-1 text-center mt-10 ">
                    {/* 가이드 영역 */}
                    <div className="grid grid-cols-2 gap-8 mt-10 mb-10">
                        {/* 각 단계 */}
                        {[
                            { step: "1", text: "운동종목 선택하기" },
                            { step: "2", text: "운동 시작 누르기" },
                            { step: "3", text: "실시간으로 운동 체크하기 " },
                            { step: "4", text: "웹페이지로 돌아와 기록 확인" },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className={`flex flex-col items-center justify-center border-2 border-black rounded-full w-[300px] h-[300px] mx-auto text-center ${
                                    ["2", "3"].includes(item.step) ? "bg-black text-white" : "bg-transparent text-black"
                                }`}
                            >
                                <span className="text-[50px] mb-2">{item.step}</span>
                                <span className="text-[25px]">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
