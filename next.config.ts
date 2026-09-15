import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "ognofykslsziwobabbxe.supabase.co" }],
  },
};

export default nextConfig;
