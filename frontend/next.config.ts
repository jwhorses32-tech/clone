import type { NextConfig } from "next";

/** Hostnames only (no scheme), comma-separated — for Next.js dev + ngrok HMR */
const devTunnelHosts = (process.env.DEV_TUNNEL_HOSTS ?? "")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  ...(devTunnelHosts.length > 0 ? { allowedDevOrigins: devTunnelHosts } : {}),
};

export default nextConfig;
