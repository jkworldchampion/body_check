'use client';
import React, { useRef } from "react";
import styles from "./TogetherSection.module.css";
import { useObserver } from "../utils/useObserver";

export default function TogetherSection() {
    const textRef = useRef(null);
    const imageRef = useRef(null);
    const { isVisible: isTextVisible } = useObserver({ target: textRef, option: { threshold: 0.3 } });
    const { isVisible: isImageVisible } = useObserver({ target: imageRef, option: { threshold: 0.5 } });

    return (
        <div className={styles.section}>
            <div
                ref={textRef}
                className={`${styles.textContainer} ${isTextVisible ? styles.fadeIn : ""}`}
            >
                <h2 className={styles.title}>TOGETHER <br /> JOIN</h2>
                <p className={styles.description}>
                    공유하기 기능을 통해 친구들과 함께 나의 기록을 자랑하고
                    나의 상대적 위치를 확인할 수 있어요.
                </p>
            </div>
            <div
                ref={imageRef}
                className={`${styles.imageContainer} ${isImageVisible ? styles.slideIn : ""}`}
            >
                <img
                    src="/images/gotocellphone.png"
                    alt="친구와 함께하는 이미지"
                    className={styles.image}
                />
            </div>
        </div>
    );
}
