const SITE_URL = "https://propertybouquet.com";

export function buildLandingPageSEO(landingPage, slug) {
  const seo = landingPage?.seo || {};
  const values = landingPage?.values || {};
  const filters = landingPage?.filters || {};

  // ---------------------------------------
  // Basic Values
  // ---------------------------------------

  const pageTitle =
    landingPage?.title?.trim() || "Luxury Properties";

  const location =
    values?.location?.name?.trim() || "";

  const developer =
    values?.developer?.name?.trim() || "";

  const category =
    values?.category?.name?.trim() || "";

  const bhk =
    values?.bhk?.trim() || "";

  // ---------------------------------------
  // Generate Title
  // ---------------------------------------

  let generatedTitle = pageTitle;

  if (developer && location) {
    generatedTitle = `${developer} Projects in ${location} | Price, Floor Plans & Brochure`;
  } else if (developer) {
    generatedTitle = `${developer} Projects | Price, Floor Plans & Brochure`;
  } else if (category && location) {
    generatedTitle = `${category} in ${location} | Price, Floor Plans & Brochure`;
  } else if (location) {
    generatedTitle = `Luxury Properties in ${location} | Price, Floor Plans & Brochure`;
  } else if (category) {
    generatedTitle = `${category} | Price, Floor Plans & Brochure`;
  } else {
    generatedTitle = `${pageTitle} | Luxury Properties, Prices & Floor Plans`;
  }

  if (bhk) {
    generatedTitle = `${bhk} ${generatedTitle}`;
  }

  const title =
    seo.metaTitle?.trim() || generatedTitle;

  // ---------------------------------------
  // Generate Description
  // ---------------------------------------

  let generatedDescription = `Explore the best luxury properties on Property Bouquet.`;

  if (developer && location) {
    generatedDescription = `Explore ${developer} projects in ${location}. Compare prices, floor plans, master plans, amenities, brochures, possession timelines and latest offers on Property Bouquet.`;
  } else if (developer) {
    generatedDescription = `Discover premium projects by ${developer}. Compare prices, floor plans, brochures, amenities and latest launches on Property Bouquet.`;
  } else if (category && location) {
    generatedDescription = `Browse the best ${category.toLowerCase()} in ${location}. Compare prices, floor plans, amenities, brochures and latest launches on Property Bouquet.`;
  } else if (location) {
    generatedDescription = `Discover luxury properties in ${location}. Compare prices, floor plans, amenities, brochures and new launch projects on Property Bouquet.`;
  } else if (category) {
    generatedDescription = `Browse premium ${category.toLowerCase()} with prices, floor plans, amenities and brochures on Property Bouquet.`;
  }

  const description =
    seo.metaDescription?.trim() || generatedDescription;

  // ---------------------------------------
  // Keywords
  // ---------------------------------------

  let keywords = [];

  if (
    Array.isArray(seo.keywords) &&
    seo.keywords.length > 0
  ) {
    keywords = seo.keywords;
  } else {
    keywords = [
      pageTitle,

      location,
      `Property in ${location}`,
      `Luxury Apartments in ${location}`,
      `New Launch Projects in ${location}`,
      `Real Estate ${location}`,
      `${location} Property`,
      `${location} Real Estate`,
      `${location} Luxury Homes`,

      developer,
      `${developer} Projects`,
      `${developer} New Launch`,
      `${developer} Apartments`,
      `${developer} Price`,
      `${developer} Brochure`,

      category,
      `${category} in ${location}`,
      `${category} Price`,
      `${category} Floor Plan`,

      bhk,
      `${bhk} Flats`,
      `${bhk} Apartments`,
      `${bhk} Homes`,

      "Luxury Properties",
      "Luxury Apartments",
      "Luxury Homes",
      "Property Bouquet",
      "Real Estate India",
      "Premium Properties",
    ].filter(Boolean);
  }

  // ---------------------------------------
  // OG Image
  // ---------------------------------------

  const image =
    seo.ogImage?.trim() ||
    landingPage?.heroImage?.trim() ||
    landingPage?.bannerImage?.trim() ||
    `${SITE_URL}/og-image.jpg`;

  // ---------------------------------------
  // Canonical
  // ---------------------------------------

  const canonical = new URL(
    slug.replace(/^\/+/, ""),
    SITE_URL.endsWith("/")
      ? SITE_URL
      : `${SITE_URL}/`
  ).toString();

  // ---------------------------------------
  // Metadata
  // ---------------------------------------

  return {
    metadataBase: new URL(SITE_URL),

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
          alt: title,
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