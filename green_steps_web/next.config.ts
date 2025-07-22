/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ disables ESLint on production build
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  images: {
    domains: ['images.unsplash.com'],
  },
   compilerOptions: {
    // ... your other options ...
    "noEmitOnError": false
  }
};

export default nextConfig;
