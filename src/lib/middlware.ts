// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 보호된 경로
    const protectedPaths = ['/dashboard'];

    // 요청 경로가 보호된 경로인지 확인
    if (protectedPaths.some((path) => pathname.startsWith(path))) {
        const isAuthenticated = request.cookies.get('isAuthenticated');

        if (!isAuthenticated || isAuthenticated.value !== 'true') {
            // 인증되지 않은 경우 로그인 페이지로 리디렉션
            const loginUrl = new URL('/Login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // 인증된 요청은 통과
    return NextResponse.next();
}
