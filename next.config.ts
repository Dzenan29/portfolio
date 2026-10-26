import type { NextConfig } from "next";

// GitHub Pages serves the site from /portfolio. Set NEXT_PUBLIC_BASE_PATH=""
// when deploying to a domain root (custom domain, Vercel, Netlify, ...).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  experimental: { globalNotFound: true },
};

export default nextConfig;
