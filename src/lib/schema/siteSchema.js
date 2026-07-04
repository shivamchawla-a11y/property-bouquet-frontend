const SITE_URL = "https://propertybouquet.com";

export const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Property Bouquet",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
      image: `${SITE_URL}/logo.png`,
      description:
        "Property Bouquet is a premium real estate platform helping buyers discover luxury apartments, villas, builder floors, penthouses, and investment opportunities across Gurgaon, Delhi NCR, and India.",

      sameAs: [
        "https://www.instagram.com/propertybouquet",
        "https://www.facebook.com/propertybouquet",
        "https://www.linkedin.com/company/propertybouquet",
        "https://www.youtube.com/@propertybouquet",
      ],
    },

    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Property Bouquet",

      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },

      potentialAction: {
        "@type": "SearchAction",

        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/properties?search={search_term_string}`,
        },

        "query-input": "required name=search_term_string",
      },
    },
  ],
};