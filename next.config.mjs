/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;