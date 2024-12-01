import React from 'react';

// 스타일 객체 타입 정의
type StyleObject = Record<string, React.CSSProperties>;

const headerStyles: StyleObject = {
    introTitle: {
        fontSize: '35px',
        color:'#030303',
        fontWeight: 'bold',
        marginBottom: '10px',
        paddingLeft: '20px',
    },
    introSubTitle:{
        fontSize: '20px',
        paddingLeft: '20px',
        color:'#030303',
        marginTop: '10px',
    }
};

export default headerStyles;
