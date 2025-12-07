/** @type {import('next').NextConfig} */

const nextConfig = {
    transpilePackages: ['lucide-react'],
    reactStrictMode: false,
    experimental: {
        viewTransitions: true,
    },
}

export default nextConfig;
