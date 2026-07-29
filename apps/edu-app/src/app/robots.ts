import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/my/", "/login"],
    },
    sitemap: "https://edu.mniuai.com/sitemap.xml",
  };
}
