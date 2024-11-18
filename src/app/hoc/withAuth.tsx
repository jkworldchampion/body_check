// src/hoc/withAuth.tsx
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useAuthStore from '@/store/useAuthStore';

const withAuth = (WrappedComponent: React.FC) => {
    return (props: any) => {
        const router = useRouter();
        const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

        useEffect(() => {
            if (!isAuthenticated) {
                router.push('/login'); // 인증되지 않으면 로그인 페이지로 이동
            }
        }, [isAuthenticated, router]);

        if (!isAuthenticated) return null;

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
