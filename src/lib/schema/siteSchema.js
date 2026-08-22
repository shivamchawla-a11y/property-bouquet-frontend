const SITE_URL = "https://propertybouquet.com";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const BRAND_ID = `${SITE_URL}/#brand`;
const HOMEPAGE_ID = `${SITE_URL}/#homepage`;

const LOGO_URL = `${SITE_URL}/logo.webp`;
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

export const siteSchema = {
  "@context": "https://schema.org",

  "@graph": [
    // =========================================================
    // ORGANIZATION
    // =========================================================

    {
      "@type": "Organization",

      "@id": ORGANIZATION_ID,

      name: "Property Bouquet",

      alternateName: "PB",

      url: SITE_URL,

      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: LOGO_URL,
        contentUrl: LOGO_URL,
        width: 512,
        height: 512,
        caption: "Property Bouquet",
      },

      image: {
        "@id": `${SITE_URL}/#logo`,
      },

      description:
        "Property Bouquet is a premium real estate platform helping buyers discover luxury apartments, villas, builder floors, penthouses, residential projects, commercial properties, and real estate investment opportunities across Gurgaon, Delhi NCR, and India.",

      slogan:
        "Luxury Real Estate. Curated for Every Lifestyle.",

      foundingDate: "2024",

      knowsAbout: [
        "Real Estate",
        "Luxury Real Estate",
        "Luxury Apartments",
        "Luxury Villas",
        "Builder Floors",
        "Penthouses",
        "Residential Property",
        "Commercial Property",
        "Property Investment",
        "New Launch Projects",
        "Real Estate Investment",
        "Property Buying",
        "Property Search",
        "Real Estate Market",
        "Gurgaon Real Estate",
        "Delhi NCR Real Estate",
      ],

      areaServed: [
        {
          "@type": "Country",
          name: "India",
        },
        {
          "@type": "City",
          name: "Gurgaon",
        },
        {
          "@type": "City",
          name: "Delhi",
        },
        {
          "@type": "City",
          name: "Noida",
        },
        {
          "@type": "City",
          name: "Mumbai",
        },
      ],

      contactPoint: [
        {
          "@type": "ContactPoint",

          contactType: "sales",

          telephone: "+919090106101",

          email: "propertybouquet@gmail.com",

          areaServed: "IN",

          availableLanguage: [
            "English",
            "Hindi",
          ],
        },
      ],

      sameAs: [
        "https://www.instagram.com/propertybouquet",
        "https://www.facebook.com/propertybouquet",
        "https://www.linkedin.com/company/propertybouquet",
        "https://www.youtube.com/@propertybouquet",
      ],
    },

    // =========================================================
    // BRAND
    // =========================================================

    {
      "@type": "Brand",

      "@id": BRAND_ID,

      name: "Property Bouquet",

      alternateName: "PB",

      url: SITE_URL,

      logo: {
        "@type": "ImageObject",

        "@id": `${SITE_URL}/#brand-logo`,

        url: LOGO_URL,

        contentUrl: LOGO_URL,

        width: 512,

        height: 512,

        caption: "Property Bouquet",
      },
    },

    // =========================================================
    // WEBSITE
    // =========================================================

    {
      "@type": "WebSite",

      "@id": WEBSITE_ID,

      url: SITE_URL,

      name: "Property Bouquet",

      alternateName: "Property Bouquet Real Estate",

      description:
        "Property Bouquet is a premium real estate platform for discovering luxury properties, residential projects, investment opportunities, developers, and real estate resources across India.",

      inLanguage: "en-IN",

      publisher: {
        "@id": ORGANIZATION_ID,
      },

      creator: {
        "@id": ORGANIZATION_ID,
      },

      copyrightHolder: {
        "@id": ORGANIZATION_ID,
      },

      brand: {
        "@id": BRAND_ID,
      },

      potentialAction: {
        "@type": "SearchAction",

        target: {
          "@type": "EntryPoint",

          urlTemplate:
            `${SITE_URL}/properties?search={search_term_string}`,
        },

        "query-input":
          "required name=search_term_string",
      },
    },

    // =========================================================
    // HOMEPAGE
    // =========================================================

    {
      "@type": "WebPage",

      "@id": HOMEPAGE_ID,

      url: SITE_URL,

      name:
        "Property Bouquet | Luxury Real Estate & Premium Properties in India",

      description:
        "Discover luxury apartments, villas, builder floors, penthouses, new launch projects, and real estate investment opportunities across Gurgaon, Delhi NCR, and India with Property Bouquet.",

      isPartOf: {
        "@id": WEBSITE_ID,
      },

      about: {
        "@id": ORGANIZATION_ID,
      },

      publisher: {
        "@id": ORGANIZATION_ID,
      },

      primaryImageOfPage: {
        "@type": "ImageObject",

        "@id": `${SITE_URL}/#homepage-image`,

        url: OG_IMAGE_URL,

        contentUrl: OG_IMAGE_URL,

        width: 1200,

        height: 630,

        caption:
          "Property Bouquet - Luxury Real Estate",
      },

      inLanguage: "en-IN",

      mainEntity: {
        "@id": ORGANIZATION_ID,
      },
    },
  ],
};