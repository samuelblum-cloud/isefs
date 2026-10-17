export const SITE_ORIGIN = "https://isefs.org";

export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_ORIGIN}/#organization`,
      name: "International Society for Endoscopic Facial Surgery",
      alternateName: "ISEFS",
      url: `${SITE_ORIGIN}/`,
      logo: `${SITE_ORIGIN}/isefs-logo.webp`,
      foundingDate: "2026",
      description:
        "An international scientific society dedicated to education, practical training and scientific exchange in endoscopic facial surgery.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      url: `${SITE_ORIGIN}/`,
      name: "ISEFS",
      alternateName: "International Society for Endoscopic Facial Surgery",
      publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      inLanguage: "en",
    },
  ],
};

export function pageSeo({
  path,
  title,
  description,
  socialDescription = description,
}: {
  path: string;
  title: string;
  description: string;
  socialDescription?: string;
}) {
  const url = new URL(path, SITE_ORIGIN).toString();

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: socialDescription },
      { property: "og:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: socialDescription },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export const adminNoIndexMeta = [
  { name: "robots", content: "noindex, nofollow, noarchive" },
  { name: "googlebot", content: "noindex, nofollow, noarchive" },
];
