const SITE_URL = "https://propertybouquet.com";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const BRAND_ID = `${SITE_URL}/#brand`;
const LOGO_ID = `${SITE_URL}/#logo`;
const HOMEPAGE_ID = `${SITE_URL}/#homepage`;

const LOGO_URL = `${SITE_URL}/logo.webp`;

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

        "@id": LOGO_ID,

        url: LOGO_URL,

        contentUrl: LOGO_URL,

        width: 512,

        height: 512,

        caption: "Property Bouquet",
      },

      image: {
        "@id": LOGO_ID,
      },

      description:
        "Property Bouquet is a premium real estate platform helping buyers discover luxury apartments, villas, builder floors, penthouses, residential projects, commercial properties and real estate investment opportunities across Gurgaon, Delhi NCR and India.",

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

      areaServed: {
        "@type": "Country",
        name: "India",
      },

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

      slogan:
        "Luxury Real Estate. Curated for Every Lifestyle.",
    },

    // =========================================================
    // WEBSITE
    // =========================================================
    //
    // IMPORTANT:
    //
    // This is the ONLY WebSite entity for the site.
    //
    // SearchAction / Sitelinks Search Box markup has been
    // intentionally removed because Google retired the
    // Sitelinks Search Box feature.
    //
    // =========================================================

    {
      "@type": "WebSite",

      "@id": WEBSITE_ID,

      url: SITE_URL,

      name: "Property Bouquet",

      alternateName:
        "Property Bouquet Real Estate",

      description:
        "Property Bouquet is a premium real estate platform for discovering luxury properties, residential projects, investment opportunities, developers and real estate resources across India.",

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
        "Discover luxury apartments, villas, builder floors, penthouses, new launch projects and real estate investment opportunities across Gurgaon, Delhi NCR and India with Property Bouquet.",

      isPartOf: {
        "@id": WEBSITE_ID,
      },

      about: {
        "@id": ORGANIZATION_ID,
      },

      publisher: {
        "@id": ORGANIZATION_ID,
      },

      inLanguage: "en-IN",

      mainEntity: {
        "@id": ORGANIZATION_ID,
      },
    },
  ],
};