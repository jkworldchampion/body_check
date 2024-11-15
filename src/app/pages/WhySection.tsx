// src/components/WhySection.tsx
'use client';
import React, { useRef } from "react";
import styles from "./WhySection.module.css";
import { useObserver } from "../utils/useObserver";

const WhySection: React.FC = () => {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);

    const { isVisible: isVisible1 } = useObserver({ target: ref1, option: { threshold: 0.4 } });
    const { isVisible: isVisible2 } = useObserver({ target: ref2, option: { threshold: 0.8 } });
    const { isVisible: isVisible3 } = useObserver({ target: ref3, option: { threshold: 0.9 } });

    return (
        <div className={styles.whySectionWrapper}>
            <h2 className={styles.mainTitle}>WHY?</h2>
            <p className={styles.mainText}>
                운동의 중요성은 알지만 어떤 운동을 시작해야 할지 막막한 당신을 위해 극한의 효율을 중시하는 현대인들에게 도움이 되고자 합니다.
            </p>
            <div className={styles.columnContainer}>
                <div
                    ref={ref1}
                    className={`${styles.columnItem} ${isVisible1 ? styles.columnItemVisible : ""}`}
                >
                    어떻게 운동을 해야 할지 정말 막막해요.
                </div>
                <div
                    ref={ref2}
                    className={`${styles.columnItem} ${isVisible2 ? styles.columnItemVisible : ""}`}
                >
                    내 기록을 체계적으로 보고 싶어요.
                </div>
                <div
                    ref={ref3}
                    className={`${styles.columnItem} ${isVisible3 ? styles.columnItemVisible : ""}`}
                >
                    내가 직접 운동을 하면서 바로바로 피드백을 받고 싶어요.
                </div>
            </div>
        </div>
    );
};

export default WhySection;
