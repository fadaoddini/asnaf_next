/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000', // شماره پورت سرور شما
        pathname: '/media/**', // مسیر فایل‌های تصویری شما
      },
    ],
  },
};

export default nextConfig;
