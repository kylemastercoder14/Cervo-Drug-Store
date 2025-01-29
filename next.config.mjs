/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "cervo-drugstore.s3.us-east-1.amazonaws.com",
      "coffeeprince.s3.us-east-1.amazonaws.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
