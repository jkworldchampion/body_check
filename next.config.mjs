/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com'],
    },
    async redirects() {
        return [
            {
                source: '/dashboard',
                has: [
                    {
                        type: 'cookie',
                        key: 'isAuthenticated',
                        value: 'false',
                    },
                ],
                permanent: true,
                destination: '/Login',
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/predict', // Next.js에서 사용하는 엔드포인트
                destination: 'http://202.30.29.168:5000/predict' // Flask 서버의 엔드포인트
            },
        ];
    },
};

export default nextConfig;
