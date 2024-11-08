
import styles from './BodySystemSection.module.css';

export default function BodySystemSection() {
    return (
        <div className={styles.bodySystemSection}>
            <div className={styles.text}>
                <h2>어디에도 없던 사진 한장의 눈바디 시스템</h2>
                <p>눈으로 보이는 체형의 문제점을 AI가 알려드립니다.</p>
                <p>옷을 벗지 않고, 사진 한 장으로 체형을 분석해 드릴게요.</p>
            </div>
            <div className={styles.imageContainer}>
                <img src="/images/checkbody.png" alt="눈바디 시스템 이미지" />
            </div>
        </div>
    );
}
