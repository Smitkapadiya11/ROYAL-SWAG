/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    localPatterns: [{ pathname: "/images/**" }],
  },
};
export default nextConfig;
