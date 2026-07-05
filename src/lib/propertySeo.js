const SITE_URL = "https://propertybouquet.com";

export function buildPropertySEO(property, slug) {
  const seo = property?.seoEngine || {};
  const core = property?.coreDetails || {};
  const overview = property?.overview || {};
  const location = property?.locationData || {};
  const media = property?.media || {};
  const keyMetrics = property?.keyMetrics || {};
  const category = property?.categoryData || {};

  // -------------------------------
  // Basic Values
  // -------------------------------

  const propertyName = core.title?.trim() || "Luxury Property";

  const developer =
    core.developerName?.trim() || "Leading Developer";

  const locationName =
    location.locationName?.trim() ||
    location.customLocation?.trim() ||
    "India";

  const categoryName =
    category.categoryName?.trim() || "Luxury Apartments";

  const possession =
    keyMetrics.possession?.trim() || "";

  // -------------------------------
  // Meta Title
  // -------------------------------

  const generatedTitle = `${propertyName} ${locationName} | Price, Floor Plans, Brochure & Reviews | Property Bouquet`;

  const title =
    seo.metaTitle?.trim() || generatedTitle;

  // -------------------------------
  // Meta Description
  // -------------------------------

  const generatedDescription =
    overview.description?.trim() ||
    `Explore ${propertyName} by ${developer} in ${locationName}. Check latest price, floor plans, brochure, amenities, location map, specifications and book your site visit with Property Bouquet.`;

  const description =
    seo.metaDescription?.trim() ||
    generatedDescription;

  // -------------------------------
  // Keywords
  // -------------------------------

  let keywords = [];

  if (
    Array.isArray(seo.keywords) &&
    seo.keywords.length > 0
  ) {
    keywords = seo.keywords;
  } else {
    keywords = [
      propertyName,
      `${propertyName} ${locationName}`,
      `${propertyName} Price`,
      `${propertyName} Floor Plan`,
      `${propertyName} Brochure`,
      `${propertyName} Reviews`,
      developer,
      `${developer} Projects`,
      categoryName,
      `Property in ${locationName}`,
      `Luxury Apartments ${locationName}`,
      "Luxury Real Estate",
      "Property Bouquet",
    ].filter(Boolean);
  }

  // -------------------------------
  // OG Image
  // -------------------------------

  const image =
    media.heroImageUrl ||
    media.gallery?.[0] ||
    `${SITE_URL}/og-image.jpg`;

  // -------------------------------
  // Canonical
  // -------------------------------

  const canonical = `${SITE_URL}/${slug}`;

  // -------------------------------
  // Metadata
  // -------------------------------

  return {
    title,

    description,

    keywords,

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },

    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Property Bouquet",
      locale: "en_IN",
      type: "website",

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: propertyName,
        },
      ],
    },

    twitter: {
  card: "summary_large_image",
  title,
  description,
  images: [image],
  creator: "@propertybouquet",
  site: "@propertybouquet",
},
  };
}