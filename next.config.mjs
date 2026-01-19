/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
    ],
  },
  serverExternalPackages: ["@vercel/kv"],
  experimental: {
    staticGenerationRetryCount: 0,
  },
  turbopack: {},
}

export default nextConfig
