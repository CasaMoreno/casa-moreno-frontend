/** @type {import('next').NextConfig} */
const nextConfig = {
  // ADICIONE ESTA LINHA:
  output: 'standalone',

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
      {
        protocol: 'http',
        hostname: 'ec2-18-117-94-172.us-east-2.compute.amazonaws.com',
        port: '8085',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;