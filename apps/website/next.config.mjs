/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mniuai/ui", "@mniuai/utils"],
  images: {
    domains: ["mniuai.com", "cdn.mniuai.com"],
  },
};

export default nextConfig;
