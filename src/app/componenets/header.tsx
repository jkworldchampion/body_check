import Link from "next/link";
import styles from "./Header.module.css";
import LogoText from './logoText'

export default function Header() {
    return (
        <header className={styles.header}>
            <div >
                <Link href="/" passHref>
                    <LogoText text={"BODY : CHECK"} />
                </Link>
            </div>
            <nav className={styles.nav}>
                <Link href="/dashboard" passHref>
                    마이페이지
                </Link>
                <Link href="/inquiry" passHref>
                    문의사항
                </Link>
            </nav>
        </header>
    );
}
