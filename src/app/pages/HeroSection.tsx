'use client';
import Link from 'next/link';
import styles from './HeroSection.module.css';

export default function HeroSection() {
    return (
        <div className={styles.section}>
            <div className={styles.textContainer}>
                <p className={styles.tagline}>체형맞춤형 운동추천</p>
                <h1 className={styles.mainTitle}>BODY : CHECK</h1>
                <Link href="/login" passHref>
                    <button className={styles.styledButton}>서비스 시작하기</button>
                </Link>
            </div>
            <img src="/images/mainImage.png" alt="logo" className={styles.logoImage} />
        </div>
    );
}
