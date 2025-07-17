/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "utfs.io" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ This disables ESLint errors during `next build`
  },
};

export default nextConfig;
