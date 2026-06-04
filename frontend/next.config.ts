import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5001/api/:path*",
      },
    ];
  },
  allowedDevOrigins: ["172.25.192.1", "localhost", "192.168.1.29"],
};

export default nextConfig;
