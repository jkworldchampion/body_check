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
};

export default nextConfig;
