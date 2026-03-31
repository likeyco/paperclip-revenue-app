import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: "export" - we need API routes for auth, AI, and payments
  // Removed basePath - deploying to Vercel root
};

export default nextConfig;
