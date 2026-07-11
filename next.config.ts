import type { NextConfig } from "next";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
  "https://api-production-afd7.up.railway.app";
const apiUrl = new URL(apiBaseUrl);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "tpwcbgfapgpgwodwxjdv.supabase.co",
        pathname: "/storage/v1/object/public/recipe-images/**",
      },
    ],
  },
};

export default nextConfig;
