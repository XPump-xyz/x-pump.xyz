/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.BASE_URL,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
    NEXT_RUNTIME_NODE_ENV: process.env.NODE_ENV,
  },
  images: {
    domains: ["api.telegram.org", "a2256e37d9f4.ngrok.app"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: { unoptimized: true },
  trailingSlash: true,
  output: "export",
};

export default nextConfig;
