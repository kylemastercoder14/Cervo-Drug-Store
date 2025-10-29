/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "cervo-drugstore.s3.us-east-1.amazonaws.com",
      "cervo-drugstore-production.s3.ap-southeast-2.amazonaws.com",
      "coffeeprince.s3.us-east-1.amazonaws.com",
      "southstardrug.com.ph",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
