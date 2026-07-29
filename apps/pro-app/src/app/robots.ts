import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://pro.mniuai.com";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/my/", "/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
