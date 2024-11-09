import React from "react";
import styles from "./GraphSection.module.css";

export default function GraphSection() {
    return (
        <div className={styles.graphSection}>
            <div className={styles.textContainer}>
                <h2 className={styles.title}>한눈에 보는 그래프</h2>
                <p className={styles.description}>
                    수치화된 통계 데이터로 몸의 변화를 보여드릴게요.
                </p>
            </div>
            <div className={styles.imageContainer}>
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
