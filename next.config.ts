import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel's image optimization quota is exhausted (402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED),
    // which breaks every <Image>. Uploads are already resized/compressed in watermark.ts.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "ognofykslsziwobabbxe.supabase.co" }],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
