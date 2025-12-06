import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  webpack: (config, { isServer }) => {
    // Fix for use-sync-external-store nested dependency issue
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    // Resolve use-sync-external-store/shim from root node_modules
    const useSyncExternalStoreShimPath = path.resolve(
      __dirname,
      "node_modules",
      "use-sync-external-store",
      "shim"
    );

    // Alias both the directory and the specific file path
    config.resolve.alias["use-sync-external-store/shim"] = useSyncExternalStoreShimPath;
    config.resolve.alias["use-sync-external-store/shim/index.js"] = path.resolve(
      useSyncExternalStoreShimPath,
      "index.js"
    );

    // Ensure node_modules resolution works correctly
    config.resolve.modules = [
      path.resolve(__dirname, "node_modules"),
      "node_modules",
    ];

    return config;
  },
};

export default nextConfig;
