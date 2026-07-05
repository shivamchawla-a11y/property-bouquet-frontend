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

  // -------------------------------
  // Meta Title
  // -------------------------------

const generatedTitle =
  developer && developer !== "Leading Developer"
    ? `${propertyName} by ${developer} | Price, Floor Plans & Brochure`
    : `${propertyName} | Price, Floor Plans & Brochure`;

  const title =
    seo.metaTitle?.trim() || generatedTitle;

  // -------------------------------
  // Meta Description
  // -------------------------------

const generatedDescription =
  overview.description?.trim() ||
  `${propertyName} by ${developer} in ${locationName}. Explore prices, floor plans, master plan, amenities, specifications, possession details, location advantages and download the latest brochure.`;

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

  `${propertyName} price`,
  `${propertyName} floor plan`,
  `${propertyName} brochure`,
  `${propertyName} location`,
  `${propertyName} reviews`,
  `${propertyName} possession`,
  `${propertyName} payment plan`,
  `${propertyName} master plan`,
  `${propertyName} amenities`,
  `${propertyName} RERA`,
  `${propertyName} specifications`,
  `${propertyName} location map`,
  `${propertyName} gallery`,
  `${propertyName} images`,
  `${propertyName} booking`,

  `${propertyName} ${locationName}`,
  `${propertyName} ${locationName} price`,
  `${propertyName} apartments`,
  `${propertyName} luxury apartments`,

  developer,
  `${developer} projects`,
  `${developer} new launch`,
  `${developer} residential projects`,

  locationName,
  `Property in ${locationName}`,
  `Luxury Apartments in ${locationName}`,
  `New Launch Projects in ${locationName}`,
  `Real Estate ${locationName}`,

  categoryName,
].filter(Boolean);
  }

  // -------------------------------
  // OG Image
  // -------------------------------

  const image =
  media.heroImageUrl?.trim() ||
  media.gallery?.find((img) => img?.trim()) ||
  `${SITE_URL}/og-image.jpg`;

  // -------------------------------
  // Canonical
  // -------------------------------

const canonical = `${SITE_URL}/${slug.replace(/^\/+/, "")}`;

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
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
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
          alt: `${propertyName} by ${developer}`,
        },
      ],
    },

    twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
},
  };
}