import Cookies from 'js-cookie';

// 클라이언트에서 쿠키 설정
export const setCookie = (key: string, value: string, options?: Cookies.CookieAttributes) => {
    Cookies.set(key, value, { path: '/', ...options });
};

// 클라이언트에서 쿠키 삭제
export const deleteCookie = (key: string) => {
    Cookies.remove(key, { path: '/' });
};

// SSR에서 쿠키 읽기 (서버)
export const parseCookies = (cookieHeader: string | undefined) => {
    if (!cookieHeader) return {};
    return Object.fromEntries(cookieHeader.split('; ').map((c) => c.split('=')));
};
