/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  output: 'export',
  basePath: '/tnp',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
