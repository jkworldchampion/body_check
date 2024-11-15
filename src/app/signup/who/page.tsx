// src/app/whoSignUp/page.tsx
'use client'
import { FC } from 'react';
import Link from 'next/link';
import Header from '../../componenets/header' // 경로 수정
import styles from './whoSignUp.module.css'; // CSS 모듈 불러오기

const WhoSignUp: FC = () => {
    return (
        <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '200px' }}>

                <Link href="/signup" passHref style={{ textDecoration: 'none' }}>
                    <div className={styles.button}>
                        <p style={{ margin: 0 }}>개인으로 회원가입하기</p>
                    </div>
                </Link>


                <Link href="/notfound" passHref style={{ textDecoration: 'none',marginTop:'20px'}}>
                    <div className={styles.button}>
                        <p style={{ margin: 0, textDecoration:'none' }}>기업으로 회원가입하기</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default WhoSignUp;
