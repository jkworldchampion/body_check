
import styles from './HeroSection.module.css';
import Link from "next/link";


export default function HeroSection() {
    return (
        <div className={`section ${styles.heroSection}`}>
            <div className={styles.text}>
                <p>체형맞춤형 운동추천</p>
                <h1>BODY CHECK</h1>
                <Link href="/login" passHref>
                    <button className={styles.button}>서비스 시작하기</button>

                </Link>
            </div>
            <div>
            <img src="/images/main.png" alt="logo"/>
            </div>


        </div>
    );
}
