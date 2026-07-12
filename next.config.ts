import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals = [...(config.externals || []), { cesium: 'Cesium' }];
    return config;
  },
};

export default nextConfig;
