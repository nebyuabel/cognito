import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove output: 'export' for Vercel deployment
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Remove experimental config or update it
  serverExternalPackages: ["@supabase/supabase-js"],
};

export default nextConfig;
