const SITE_URL = "https://propertybouquet.com";

export const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,

      name: "Property Bouquet",
      alternateName: "PB",
      url: SITE_URL,

      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },

      image: `${SITE_URL}/logo.png`,

      description:
        "Property Bouquet is a premium real estate platform helping buyers discover luxury apartments, villas, builder floors, penthouses, and investment opportunities across Gurgaon, Delhi NCR, and India.",

      slogan:
        "Luxury Real Estate. Curated for Every Lifestyle.",

      foundingDate: "2024",

      knowsAbout: [
        "Luxury Apartments",
        "Luxury Villas",
        "Builder Floors",
        "Penthouses",
        "Real Estate",
        "Property Investment",
        "New Launch Projects",
        "Commercial Property",
      ],

      areaServed: [
        {
          "@type": "City",
          name: "Gurgaon",
        },
        {
          "@type": "City",
          name: "Noida",
        },
        {
          "@type": "City",
          name: "Delhi",
        },
        {
          "@type": "City",
          name: "Mumbai",
        },
      ],

      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "Sales",
          telephone: "+919090106101",
          email: "propertybouquet@gmail.com",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
      ],

      sameAs: [
        "https://www.instagram.com/propertybouquet",
        "https://www.facebook.com/propertybouquet",
        "https://www.linkedin.com/company/propertybouquet",
        "https://www.youtube.com/@propertybouquet",
      ],
    },

    {
      "@type": "Brand",
      "@id": `${SITE_URL}/#brand`,
      name: "Property Bouquet",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
    },

    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,

      url: SITE_URL,

      name: "Property Bouquet",

      inLanguage: "en-IN",

      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },

      copyrightHolder: {
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

    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#homepage`,

      url: SITE_URL,

      name: "Property Bouquet",

      description:
        "Luxury real estate platform helping buyers discover premium apartments, villas, penthouses and investment opportunities across India.",

      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },

      about: {
        "@id": `${SITE_URL}/#organization`,
      },

      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-image.jpg`,
      },

      inLanguage: "en-IN",
    },
  ],
};