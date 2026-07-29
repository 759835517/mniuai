"use client";

export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "萌牛AI",
    alternateName: "mniuai",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://mniuai.com",
    logo: `${process.env.NEXT_PUBLIC_APP_URL || "https://mniuai.com"}/logo.png`,
    description: "萌牛AI为程序员、少儿、大学生、教师、自媒体等人群提供AI学习和工具平台，对赌协议保障学习效果。",
    foundingDate: "2024-01",
    contactPoint: {
      "@type": "ContactPoint",
      email: "business@mniuai.com",
      contactType: "customer service",
      availableLanguage: ["Chinese", "English"],
    },
    sameAs: [
      "https://mniuai.com",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function CourseStructuredData({
  name,
  description,
  provider,
}: {
  name: string;
  description: string;
  provider: string;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function FAQStructuredData({
  faqs,
}: {
  faqs: { q: string; a: string }[];
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
