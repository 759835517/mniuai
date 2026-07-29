import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/admin/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || "https://mniuai.com"}/sitemap.xml`,
  };
}
