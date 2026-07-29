import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://campus.mniuai.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/my/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
