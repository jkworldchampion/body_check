// src/components/RecordSection.tsx
'use client';
import styles from './RecordSection.module.css';

export default function RecordSection() {
    return (
        <div className={styles.recordSection}>
            <div className={styles.images}>
                <div className={styles.recordSectionBackground}></div>
                <img src="/images/muscle.png" alt="운동 측정 이미지 1" />
                <img src="/images/muscle.png" alt="운동 측정 이미지 2" />
            </div>
            <div className={styles.text}>
                <h2>직접 기록해야 하는 번거로움은 낮췄습니다.</h2>
                <p>이제 내 움직임을
                    자동으로 측정하여
                    더 편리하게 운동 기록을 측정해보세요.</p>
            </div>
        </div>
    );
}
