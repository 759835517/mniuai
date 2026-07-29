import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://pro.mniuai.com";
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/tools`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/writing`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/data-analysis`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/meeting`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/resume`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/report`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/templates`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/assessment`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/pricing`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/guarantee`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
