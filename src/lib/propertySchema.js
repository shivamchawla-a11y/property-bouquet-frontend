const SITE_URL = "https://propertybouquet.com";

export function buildPropertySchema(property, slug) {
  const core = property.coreDetails || {};
  const overview = property.overview || {};
  const location = property.locationData || {};
  const media = property.media || {};
  const metrics = property.keyMetrics || {};
  const faqs = property.faqs || [];

  const pageUrl = `${SITE_URL}/${slug}`;

  // -------------------------
  // Images
  // -------------------------

  const images = [
    media.heroImageUrl,
    ...(media.gallery || []),
  ].filter(Boolean);

  // -------------------------
  // Amenities
  // -------------------------

  const amenities =
    overview.amenities?.map((item) => item.heading) || [];

  // -------------------------
  // Property Values
  // -------------------------

  const additionalProperty = [];

  if (metrics.landArea) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Land Area",
      value: metrics.landArea,
    });
  }

  if (metrics.possession) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Possession",
      value: metrics.possession,
    });
  }

  if (metrics.status) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Status",
      value: metrics.status,
    });
  }

  if (metrics.reraNumber) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "RERA Number",
      value: metrics.reraNumber,
    });
  }

  // -------------------------
  // Graph
  // -------------------------

  const graph = [];

  // -------------------------
  // Breadcrumb
  // -------------------------

  graph.push({
    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Properties",
        item: `${SITE_URL}/properties`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: core.title,
        item: pageUrl,
      },
    ],
  });

  graph.push({
  "@type": "WebPage",

  "@id": pageUrl,

  url: pageUrl,

  name: core.title,

  description:
    overview.description ||
    `Explore ${core.title} by ${core.developerName}.`,

  isPartOf: {
    "@id": `${SITE_URL}/#website`,
  },

  primaryImageOfPage: images[0],

  inLanguage: "en-IN",
});

graph.push({
  "@type": "WebSite",

  "@id": `${SITE_URL}/#website`,

  url: SITE_URL,

  name: "Property Bouquet",

  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },

  inLanguage: "en-IN",
});

graph.push({
  "@type": "Organization",

  "@id": `${SITE_URL}/#organization`,

  name: "Property Bouquet",

  url: SITE_URL,

  logo: `${SITE_URL}/logo.png`,

  sameAs: [
    "https://www.instagram.com/.....",
    "https://www.facebook.com/.....",
    "https://www.linkedin.com/company/....."
  ]
});


  // -------------------------
  // Place
  // -------------------------

  graph.push({
    "@type": "Place",

    "@id": `${pageUrl}#place`,

    name:
      location.locationName ||
      location.customLocation ||
      "Gurgaon",

    address: {
      "@type": "PostalAddress",

      addressLocality:
        location.locationName ||
        location.customLocation ||
        "Gurgaon",

      addressRegion: "Haryana",

      addressCountry: "IN",
    },
  });

  // -------------------------
  // Residence
  // -------------------------

  graph.push({
    "@type": "Residence",

    "@id": `${pageUrl}#residence`,

    url: pageUrl,

    name: core.title,

    description:
      overview.description ||
      `Explore ${core.title}.`,

    image: images,

    brand: {
      "@type": "Brand",
      name: core.developerName,
    },

    address: {
      "@id": `${pageUrl}#place`,
    },

    amenityFeature: amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    })),

    additionalProperty,
  });

    // -------------------------
  // Offer
  // -------------------------

  if (!core.priceOnRequest && core.startingPrice) {
    graph.push({
      "@type": "Offer",

      "@id": `${pageUrl}#offer`,

      url: pageUrl,

      price: core.startingPrice,

      priceCurrency: "INR",

      availability: "https://schema.org/InStock",

      seller: {
        "@type": "Organization",
        name: "Property Bouquet",
        url: SITE_URL,
      },

      itemCondition: "https://schema.org/NewCondition",
    });
  }

  // -------------------------
  // Product
  // -------------------------

  graph.push({
    "@type": "Product",

    "@id": `${pageUrl}#product`,

    name: core.title,

    url: pageUrl,

    image: images,

    description:
      overview.description ||
      `Luxury property by ${core.developerName || "Leading Developer"}.`,

    brand: {
      "@type": "Brand",
      name: core.developerName || "Developer",
    },

    category:
      property.categoryData?.categoryName || "Real Estate",

    manufacturer: {
      "@type": "Organization",
      name: core.developerName || "Developer",
    },

    offers:
      !core.priceOnRequest && core.startingPrice
        ? {
            "@id": `${pageUrl}#offer`,
          }
        : undefined,
  });

  // -------------------------
  // Image Gallery
  // -------------------------

  if (images.length) {
  graph.push({
    "@type": "ItemList",

    "@id": `${pageUrl}#images`,

    name: `${core.title} Images`,

    itemListElement: images.map((img, index) => ({
      "@type": "ImageObject",

      position: index + 1,

      contentUrl: img,
    })),
  });
}

  // -------------------------
  // Developer
  // -------------------------

  if (core.developerName) {
    graph.push({
      "@type": "Organization",

      "@id": `${pageUrl}#developer`,

      name: core.developerName,

      image: core.developerLogo,

      logo: core.developerLogo,
    });
  }

  // -------------------------
  // Floor Plans
  // -------------------------

  const floorPlans =
    property.gatedContent?.floorPlans || [];

  if (floorPlans.length) {
    graph.push({
      "@type": "OfferCatalog",

      "@id": `${pageUrl}#floorplans`,

      name: "Available Floor Plans",

      itemListElement: floorPlans.map((plan) => ({
        "@type": "Offer",

        name: plan.unitType,

        price: plan.price,

        description: `${plan.area} • ${plan.bedrooms} Bedrooms`,

        image: plan.image,
      })),
    });
  }
    // -------------------------
  // FAQ Schema
  // -------------------------

  if (faqs.length) {
    graph.push({
      "@type": "FAQPage",

      "@id": `${pageUrl}#faq`,

      mainEntity: faqs
        .filter((faq) => faq.question && faq.answer)
        .map((faq) => ({
          "@type": "Question",

          name: faq.question,

          acceptedAnswer: {
            "@type": "Answer",

            text: faq.answer,
          },
        })),
    });
  }

  // -------------------------
  // Return Complete Graph
  // -------------------------

  return {
    "@context": "https://schema.org",

    "@graph": graph,
  };
}