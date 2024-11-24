// src/lib/auth.ts
// 서버 사이드에서 인증 상태를 확인
import { parseCookies } from './cookies';

export const authenticateSSR = (cookieHeader: string | undefined) => {
    const cookies = parseCookies(cookieHeader);

    // 쿠키에서 인증 정보 확인
    const isAuthenticated = cookies['isAuthenticated'] === 'true';
    const userId = cookies['userId'];

    return { isAuthenticated, userId };
};
