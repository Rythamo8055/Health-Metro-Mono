import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow up to 15 MB for file uploads (license cert, ID proof, cancelled cheque)
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
