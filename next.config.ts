/** @type {import('next').NextConfig} */
const nextConfig = {
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
      {
        protocol: 'https',
        hostname: 'bucket-casa-moreno.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;