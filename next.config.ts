/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
     styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'http2.mlstatic.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;