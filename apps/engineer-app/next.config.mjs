/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mniuai/ui", "@mniuai/api-client", "@mniuai/utils"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.aliyuncs.com" },
      { protocol: "https", hostname: "cdn.mniuai.com" },
    ],
  },
};

export default nextConfig;
