
import React from "react";
import styles from "./WhySection.module.css";

export default function WhySection() {
    return (
        <div className={styles.whySection}>
            <div className={styles.textContainer}>
                <h2 className={styles.title}>WHY?</h2>
                <p className={styles.description}>
                    운동의 중요성은 알지만 어떤 운동을 시작해야 할지 막막한 당신을 위해
                    극한의 효율을 중시하는 현대인들에게 도움이 되고자 합니다.
                </p>
            </div>
            <div className={styles.columns}>
                <div className={styles.columnItem}>어떻게 운동을 해야 할지 정말 막막해요.</div>
                <div className={styles.columnItem}>내 기록을 체계적으로 보고 싶어요.</div>
                <div className={styles.columnItem}>내가 직접 운동을 하면서 바로바로 피드백을 받고 싶어요.</div>
            </div>
        </div>
    );
}
