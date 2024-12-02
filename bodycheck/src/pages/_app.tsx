// 전역스타일 적용하기
// 페이지들에도 전역 스타일이 적용이 되었음 하니까

import '../app/globals.css';  // globals.css를 app 폴더에서 가져옴
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;
