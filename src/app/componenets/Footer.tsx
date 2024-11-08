// app/components/Footer.tsx
import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <h2 className={styles.title}>BODY : CHECK</h2>
                <div className={styles.links}>
                    <a href="#" className={styles.link}>문의사항</a>
                    <span className={styles.separator}>|</span>
                    <a href="#" className={styles.link}>개인정보처리방침</a>
                </div>
                <p className={styles.copyright}>
                    copyright(c) BODY:CHECK All rights reserved
                </p>
            </div>
        </footer>
    );
}
