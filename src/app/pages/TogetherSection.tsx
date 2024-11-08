
import React from "react";
import styles from "./TogetherSection.module.css";

export default function TogetherSection() {
    return (
        <div className={styles.section}>
            <div className={styles.textContainer}>
                <h2 className={styles.title}>TOGETHER <br /> JOIN</h2>
                <p className={styles.description}>
                    공유하기 기능을 통해 친구들과 함께 나의 기록을 자랑하고
                    나의 상대적 위치를 확인할 수 있어요.
                </p>
            </div>
            <div className={styles.imageContainer}>
                <img
                    src="/images/gotocellphone.png"
                    alt="친구와 함께하는 이미지"
                    className={styles.image}
                />
            </div>
        </div>
    );
}
