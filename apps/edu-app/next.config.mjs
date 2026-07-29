/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mniuai/ui", "@mniuai/utils"],
  reactStrictMode: true,
  images: {
    domains: ["mniuai.com"],
  },
};

export default nextConfig;
