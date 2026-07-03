const SITE_URL = "https://propertybouquet.com";

export function buildPropertySchema(property, slug) {
  const core = property.coreDetails || {};
  const overview = property.overview || {};
  const location = property.locationData || {};
  const media = property.media || {};
  const metrics = property.keyMetrics || {};

  const image =
    media.heroImageUrl ||
    media.gallery?.[0] ||
    `${SITE_URL}/og-image.jpg`;

  const price =
    core.priceOnRequest
      ? undefined
      : core.startingPrice;

  return {
    "@context": "https://schema.org",
    "@type": "Residence",

    "@id": `${SITE_URL}/${slug}`,

    url: `${SITE_URL}/${slug}`,

    name: core.title,

    description:
      overview.description ||
      `Explore ${core.title} by ${
        core.developerName || "leading developer"
      }.`,

    image: [image],

    brand: {
      "@type": "Brand",
      name: core.developerName,
    },

    address: {
      "@type": "PostalAddress",
      addressLocality:
        location.locationName ||
        location.customLocation ||
        "",
      addressCountry: "IN",
    },

    offers: price
      ? {
          "@type": "Offer",
          price,
          priceCurrency: "INR",
          availability:
            "https://schema.org/InStock",
          url: `${SITE_URL}/${slug}`,
        }
      : undefined,

    additionalProperty: [
      metrics.landArea && {
        "@type": "PropertyValue",
        name: "Land Area",
        value: metrics.landArea,
      },

      metrics.possession && {
        "@type": "PropertyValue",
        name: "Possession",
        value: metrics.possession,
      },

      metrics.status && {
        "@type": "PropertyValue",
        name: "Status",
        value: metrics.status,
      },

      metrics.reraNumber && {
        "@type": "PropertyValue",
        name: "RERA",
        value: metrics.reraNumber,
      },
    ].filter(Boolean),
  };
}