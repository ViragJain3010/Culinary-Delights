/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'recipes.ddev.site',
        pathname: '/sites/default/files/**', // Match all images under this path
      },
    ],
  },
};

export default nextConfig;
