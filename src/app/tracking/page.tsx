"use client";

import React from "react";
import DashboardLayout from "@/app/componenets/dashboardLayout";

export default function RecordingExercise() {

    const handleButtonClick = () => {
        window.location.href = "http://202.30.29.168:9888"; // 이동할 URL
    };

    return (
        <DashboardLayout>
            {/* 콘텐츠 */}
            <div style={{ display: "flex", marginTop: "100px", alignItems: "center", gap: "10px" }}>
                {/* 설명 영역 (왼쪽) */}
                <div style={{ flex: 1, padding: "50px" }}>
                    <h1 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "20px" }}>
                        BODY : CHECK
                    </h1>
                    <p style={{ fontSize: "20px", lineHeight: "1.5", marginBottom:"100px", color: "#333" }}>
                        이제 운동할 준비가 되셨나요?<br />
                        <strong>BODY : CHECK</strong>는 실시간으로 운동을 체크해드려요.
                    </p>
                    {/* 서버 연결 버튼 */}
                    <button
                        onClick={handleButtonClick}
                        style={{
                            padding: "15px 30px",
                            backgroundColor: "black",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                    >
                        {isLoading ? "서버 연결 중..." : "서버 접속하기"}
                    </button>

                    {/* 서버 응답 */}
                    {serverResponse && (
                        <div
                            style={{
                                marginTop: "50px",
                                padding: "10px",
                                backgroundColor: "#f9f9f9",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                color: "#333",
                                textAlign: "left",
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            <h2>서버 응답:</h2>
                            <pre>{serverResponse}</pre>
                        </div>
                    )}
                </div>

                {/* 버튼과 텍스트 영역 (오른쪽) */}
                <div style={{ flex: 1, textAlign: "center" }}>
                    {/* 가이드 영역 */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            // 두 개의 열로 구성
                            // fr = fraction 가용가능한 공간을 비율로 나눠서 사용함
                            gap: "30px",
                            marginBottom: "40px",
                        }}
                    >
                        {/* 각 단계 */}
                        {[
                            { step: "1", text: "운동종목 선택하기" },
                            { step: "2", text: "운동 시작 누르기" },
                            { step: "3", text: "실시간으로 운동 체크하기 " },
                            { step: "4", text: "웹페이지로 돌아와 기록 확인" },
                        ].map((item) => (
                            <div
                                key={item.step}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "2px solid black",
                                    borderRadius: "50%",
                                    width: "300px",
                                    height: "300px",
                                    margin: "0 auto",
                                    fontWeight:"lighter",
                                    fontSize: "30px",
                                    textAlign: "center",
                                    backgroundColor: ["2", "3"].includes(item.step) ? "#030303" : "",
                                    color:["2","3"].includes(item.step) ? "#fff" : "black",


                                }}
                            >
                                <span style={{ fontSize: "50px", marginBottom: "5px" }}>
                                    {item.step}
                                </span>
                                <span style={{ fontSize: "25px" }}>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
