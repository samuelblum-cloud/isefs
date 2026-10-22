export const SITE_ORIGIN = "https://isefs.org";

const navigationLabels: Record<string, string> = {
  "/about": "About",
  "/education-and-science": "Education & Science",
  "/membership": "Membership",
  "/leadership": "Leadership",
  "/contact": "Contact",
  "/privacy": "Privacy information",
  "/legal": "Legal information",
};

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
  const breadcrumbLabel = navigationLabels[path];
  const pageType =
    path === "/about" ? "AboutPage" : path === "/contact" ? "ContactPage" : "WebPage";

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: socialDescription },
      { property: "og:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: socialDescription },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": pageType,
              "@id": `${url}#webpage`,
              url,
              name: title,
              description,
              inLanguage: "en",
              isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
              about: { "@id": `${SITE_ORIGIN}/#organization` },
              ...(breadcrumbLabel ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
            },
            ...(breadcrumbLabel
              ? [
                  {
                    "@type": "BreadcrumbList",
                    "@id": `${url}#breadcrumb`,
                    itemListElement: [
                      { "@type": "ListItem", position: 1, name: "ISEFS", item: `${SITE_ORIGIN}/` },
                      { "@type": "ListItem", position: 2, name: breadcrumbLabel, item: url },
                    ],
                  },
                ]
              : []),
          ],
        },
      },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export const adminNoIndexMeta = [
  { name: "robots", content: "noindex, nofollow, noarchive" },
  { name: "googlebot", content: "noindex, nofollow, noarchive" },
];
