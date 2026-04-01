/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    localPatterns: [
      { pathname: '/images/**' }
    ]
  }
};
export default nextConfig;
