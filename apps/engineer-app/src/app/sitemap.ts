import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://app.mniuai.com";
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/algorithms`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/practice`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/interview`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/system-design`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/code-review`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/paths`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/assessment`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/pricing`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/guarantee`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
