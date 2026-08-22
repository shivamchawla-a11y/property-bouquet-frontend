// ============================================================
// PROPERTY BOUQUET — PROPERTY SEO ENGINE
// ============================================================
//
// File:
// src/lib/propertySeo.js
//
// Purpose:
// Centralized SEO metadata generation for public property pages.
//
// Canonical property URL structure:
//
// https://propertybouquet.com/{slug}
//
// This utility generates:
// - Meta title
// - Meta description
// - Keywords
// - Canonical URL
// - Robots directives
// - Open Graph metadata
// - Twitter metadata
//
// ============================================================

const SITE_URL = "https://propertybouquet.com";

const SITE_NAME = "Property Bouquet";

const DEFAULT_OG_IMAGE =
  `${SITE_URL}/og-image.jpg`;

// ============================================================
// HELPERS
// ============================================================

/**
 * Safely convert any value into a trimmed string.
 */
function cleanText(value) {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Remove duplicate values while preserving order.
 */
function uniqueValues(values = []) {
  const seen = new Set();

  return values
    .map(cleanText)
    .filter(Boolean)
    .filter((value) => {
      const normalized =
        value.toLowerCase();

      if (seen.has(normalized)) {
        return false;
      }

      seen.add(normalized);

      return true;
    });
}

/**
 * Limit metadata descriptions to a sensible length.
 *
 * Google does not enforce a strict character limit,
 * but keeping descriptions reasonably concise prevents
 * unnecessarily long snippets.
 */
function truncateDescription(
  text,
  maxLength = 160
) {
  const cleaned = cleanText(text);

  if (!cleaned) {
    return "";
  }

  if (
    cleaned.length <= maxLength
  ) {
    return cleaned;
  }

  const truncated =
    cleaned
      .substring(
        0,
        maxLength - 3
      )
      .trim();

  // Try not to cut in the middle of a word.
  const lastSpace =
    truncated.lastIndexOf(" ");

  if (
    lastSpace > 100
  ) {
    return (
      truncated.substring(
        0,
        lastSpace
      ).trim() +
      "..."
    );
  }

  return `${truncated}...`;
}

/**
 * Limit titles without destroying the primary keyword.
 *
 * We primarily control title construction rather than
 * blindly truncating it.
 */
function normalizeTitle(
  title,
  maxLength = 65
) {
  const cleaned = cleanText(title);

  if (!cleaned) {
    return SITE_NAME;
  }

  if (
    cleaned.length <= maxLength
  ) {
    return cleaned;
  }

  const truncated =
    cleaned
      .substring(
        0,
        maxLength
      )
      .trim();

  const lastSpace =
    truncated.lastIndexOf(" ");

  if (
    lastSpace > 40
  ) {
    return truncated
      .substring(
        0,
        lastSpace
      )
      .trim();
  }

  return truncated;
}

/**
 * Create the canonical property URL.
 *
 * Your public property route is:
 *
 * /{slug}
 */
function buildCanonicalUrl(
  slug
) {
  const cleanSlug =
    cleanText(slug)
      .replace(/^\/+/, "")
      .replace(/\/+$/, "");

  if (!cleanSlug) {
    return `${SITE_URL}/`;
  }

  return new URL(
    encodeURI(cleanSlug),
    `${SITE_URL}/`
  ).toString();
}

/**
 * Determine whether an image URL is usable.
 */
function getImageUrl(
  media
) {
  const heroImage =
    cleanText(
      media?.heroImageUrl
    );

  if (heroImage) {
    return heroImage;
  }

  if (
    Array.isArray(
      media?.gallery
    )
  ) {
    const galleryImage =
      media.gallery.find(
        (image) =>
          typeof image ===
            "string" &&
          cleanText(image)
      );

    if (galleryImage) {
      return cleanText(
        galleryImage
      );
    }
  }

  return DEFAULT_OG_IMAGE;
}

// ============================================================
// MAIN SEO FUNCTION
// ============================================================

export function buildPropertySEO(
  property,
  slug
) {
  // ==========================================================
  // SAFE PROPERTY SECTIONS
  // ==========================================================

  const seo =
    property?.seoEngine || {};

  const core =
    property?.coreDetails || {};

  const overview =
    property?.overview || {};

  const location =
    property?.locationData || {};

  const media =
    property?.media || {};

  const category =
    property?.categoryData || {};

  // ==========================================================
  // BASIC PROPERTY DATA
  // ==========================================================

  const propertyName =
    cleanText(core?.title) ||
    "Luxury Property";

  const developerName =
    cleanText(
      core?.developerName
    );

  const locationName =
    cleanText(
      location?.locationName
    ) ||
    cleanText(
      location?.customLocation
    ) ||
    "";

  const categoryName =
    cleanText(
      category?.categoryName
    ) ||
    "Luxury Property";

  // ==========================================================
  // LOCATION CONTEXT
  // ==========================================================
  //
  // We use location in generated SEO when available.
  //
  // Example:
  //
  // DLF The Camellias in Golf Course Road
  //
  // rather than:
  //
  // DLF The Camellias
  //
  // This makes the metadata more aligned with real
  // property-search queries.
  //
  // ==========================================================

  const locationSuffix =
    locationName
      ? ` in ${locationName}`
      : "";

  // ==========================================================
  // META TITLE
  // ==========================================================
  //
  // Priority:
  //
  // 1. CMS/admin SEO title
  // 2. Generated property title
  //
  // Generated structure:
  //
  // Property Name in Location | Price, Floor Plans & Brochure
  //
  // If location is unavailable:
  //
  // Property Name | Price, Floor Plans & Brochure
  //
  // ==========================================================

  const generatedTitle =
    locationName
      ? `${propertyName} in ${locationName} | Price, Floor Plans & Brochure`
      : `${propertyName} | Price, Floor Plans & Brochure`;

  const customMetaTitle =
    cleanText(
      seo?.metaTitle
    );

  const title =
    customMetaTitle ||
    normalizeTitle(
      generatedTitle
    );

  // ==========================================================
  // META DESCRIPTION
  // ==========================================================
  //
  // Priority:
  //
  // 1. CMS/admin SEO description
  // 2. Property overview description
  // 3. Generated SEO description
  //
  // ==========================================================

  const overviewDescription =
    cleanText(
      overview?.description
    );

  const generatedDescription =
    [
      propertyName,

      developerName
        ? `by ${developerName}`
        : "",

      locationName
        ? `in ${locationName}`
        : "",

      "Explore price, floor plans, master plan, amenities, specifications, location, possession details and brochure.",
    ]
      .filter(Boolean)
      .join(" ");

  const customMetaDescription =
    cleanText(
      seo?.metaDescription
    );

  const descriptionSource =
    customMetaDescription ||
    overviewDescription ||
    generatedDescription;

  const description =
    truncateDescription(
      descriptionSource,
      160
    );

  // ==========================================================
  // KEYWORDS
  // ==========================================================
  //
  // Keywords are not a major Google ranking factor, but
  // maintaining relevant metadata is still useful for
  // internal SEO consistency and other search systems.
  //
  // We avoid keyword stuffing and duplicate phrases.
  //
  // ==========================================================

  let keywords = [];

  if (
    Array.isArray(
      seo?.keywords
    ) &&
    seo.keywords.length > 0
  ) {
    keywords =
      uniqueValues(
        seo.keywords
      );
  } else {
    keywords =
      uniqueValues([
        // ----------------------------------------------------
        // Primary property
        // ----------------------------------------------------

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

        `${propertyName} images`,

        `${propertyName} booking`,

        // ----------------------------------------------------
        // Property + location
        // ----------------------------------------------------

        locationName
          ? `${propertyName} ${locationName}`
          : "",

        locationName
          ? `${propertyName} ${locationName} price`
          : "",

        locationName
          ? `${propertyName} ${locationName} floor plan`
          : "",

        // ----------------------------------------------------
        // Property category
        // ----------------------------------------------------

        `${propertyName} apartments`,

        `${propertyName} luxury apartments`,

        categoryName,

        // ----------------------------------------------------
        // Developer
        // ----------------------------------------------------

        developerName,

        developerName
          ? `${developerName} projects`
          : "",

        developerName
          ? `${developerName} new launch`
          : "",

        developerName
          ? `${developerName} residential projects`
          : "",

        developerName
          ? `${developerName} properties`
          : "",

        // ----------------------------------------------------
        // Location intent
        // ----------------------------------------------------

        locationName,

        locationName
          ? `Property in ${locationName}`
          : "",

        locationName
          ? `Luxury Apartments in ${locationName}`
          : "",

        locationName
          ? `New Launch Projects in ${locationName}`
          : "",

        locationName
          ? `Real Estate ${locationName}`
          : "",

        // ----------------------------------------------------
        // Brand
        // ----------------------------------------------------

        `${propertyName} Property Bouquet`,

        `${SITE_NAME} properties`,
      ]);
  }

  // ==========================================================
  // OG IMAGE
  // ==========================================================

  const image =
    getImageUrl(media);

  // ==========================================================
  // CANONICAL
  // ==========================================================

  const canonical =
    buildCanonicalUrl(slug);

  // ==========================================================
  // FINAL METADATA
  // ==========================================================

  return {
    // --------------------------------------------------------
    // BASE URL
    // --------------------------------------------------------

    metadataBase:
      new URL(SITE_URL),

    // --------------------------------------------------------
    // TITLE
    // --------------------------------------------------------

    title,

    // --------------------------------------------------------
    // DESCRIPTION
    // --------------------------------------------------------

    description,

    // --------------------------------------------------------
    // KEYWORDS
    // --------------------------------------------------------

    keywords,

    // --------------------------------------------------------
    // CANONICAL
    // --------------------------------------------------------

    alternates: {
      canonical,
    },

    // --------------------------------------------------------
    // ROBOTS
    // --------------------------------------------------------

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,

        noimageindex: false,

        "max-image-preview":
          "large",

        "max-video-preview":
          -1,

        "max-snippet":
          -1,
      },
    },

    // ========================================================
    // OPEN GRAPH
    // ========================================================

    openGraph: {
      type: "website",

      locale: "en_IN",

      url: canonical,

      siteName: SITE_NAME,

      title,

      description,

      images: [
        {
          url: image,

          width: 1200,

          height: 630,

          alt:
            developerName
              ? `${propertyName} by ${developerName}`
              : propertyName,
        },
      ],
    },

    // ========================================================
    // TWITTER / X
    // ========================================================

    twitter: {
      card:
        "summary_large_image",

      title,

      description,

      images: [image],
    },
  };
}