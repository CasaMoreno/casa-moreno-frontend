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
        protocol: 'https',
        hostname: 'www.casa-moreno.com',
        port: '', // Deixe a porta vazia
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