// src/components/GraphSection.tsx
'use client';
import React, { useRef, useEffect } from "react";
import styles from "./GraphSection.module.css";
import { useObserver } from "../utils/useObserver";

export default function GraphSection() {
    const textRef = useRef(null);
    const graphRef = useRef(null);
    const { isVisible: isTextVisible } = useObserver({ target: textRef, option: { threshold: 0.3 } });
    const { isVisible: isGraphVisible } = useObserver({ target: graphRef, option: { threshold: 0.5 } });

    // 가시성 상태 확인을 위한 콘솔 로그 추가
    useEffect(() => {
        console.log("Text visible:", isTextVisible);
        console.log("Graph visible:", isGraphVisible);
    }, [isTextVisible, isGraphVisible]);

    return (
        <div className={styles.graphSection}>
            <div
                ref={textRef}
                className={`${styles.textContainer} ${isTextVisible ? styles.fadeIn : ""}`}
            >
                <h2 className={styles.title}>한눈에 보는 그래프</h2>
                <p className={styles.description}>
                    수치화된 통계 데이터로 몸의 변화를 보여드릴게요.
                </p>
            </div>
            <div
                ref={graphRef}
                className={`${styles.imageContainer} ${isGraphVisible ? styles.slideIn : ""}`}
            >
                <img
                    src="/images/computer.png"
                    alt="컴퓨터 프레임"
                    className={styles.computerImage}
                />
                <div className={styles.graphWrapper}>
                    <img
                        src="/images/graph.png"
                        alt="그래프 이미지"
                        className={styles.graphImage}
                    />
                    <img
                        src="/images/secondgraph.png"
                        alt="그래프 이미지"
                        className={styles.graphImage}
                    />
                </div>
            </div>
        </div>
    );
}
