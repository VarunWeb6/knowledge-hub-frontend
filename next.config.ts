/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ ignores lint errors on Vercel
  },
};

module.exports = nextConfig;
