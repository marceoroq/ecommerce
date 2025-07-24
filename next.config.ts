import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // from uploadthing
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
