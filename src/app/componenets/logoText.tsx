import React from 'react';

interface LogoTextProps {
    text: string;
}

const LogoText: React.FC<LogoTextProps> = ({ text }) => {
    return (
        <div style={styles.logoText}>
            {text}
        </div>
    );
};

const styles = {
    logoText: {
        color: '#0033CC',      // 진한 파란색
        fontWeight: 'bold' as const, // 굵은 텍스트
        fontSize: '24px',      // 필요에 따라 글자 크기 조정 가능
        fontFamily: 'Arial, sans-serif', // 기본 폰트 (필요에 따라 변경 가능)
    },
};

export default LogoText;
