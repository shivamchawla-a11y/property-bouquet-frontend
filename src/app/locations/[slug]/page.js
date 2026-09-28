import {
  notFound,
  permanentRedirect,
} from "next/navigation";

import LocationSlugClient from "./LocationSlugClient";

// Supports different export styles from locationContent.js
import * as locationContentModule from "./locationContent";

/* ============================================================
   CONFIG
============================================================ */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://propertybouquet.com";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://propertybouquet.com";

/* ============================================================
   HELPERS
============================================================ */

/**
 * Clean a slug before using it.
 */
function cleanSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
}

/**
 * Convert arbitrary values into safe strings.
 */
function cleanString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

/**
 * Deep merge two objects.
 *
 * Later object values override earlier values.
 * Useful for merging backend location.pageContent
 * with our static SEO/editorial locationContent.js.
 */
function deepMerge(base = {}, override = {}) {
  if (
    !base ||
    typeof base !== "object" ||
    Array.isArray(base)
  ) {
    return override;
  }

  if (
    !override ||
    typeof override !== "object" ||
    Array.isArray(override)
  ) {
    return base;
  }

  const result = {
    ...base,
  };

  Object.keys(override).forEach((key) => {
    const baseValue = result[key];
    const overrideValue = override[key];

    if (
      baseValue &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue) &&
      overrideValue &&
      typeof overrideValue === "object" &&
      !Array.isArray(overrideValue)
    ) {
      result[key] = deepMerge(
        baseValue,
        overrideValue
      );
    } else {
      result[key] = overrideValue;
    }
  });

  return result;
}

/* ============================================================
   LOCATION CONTENT RESOLVER
============================================================ */

/**
 * This allows locationContent.js to be written in several
 * common ways without forcing page.js to change.
 *
 * Supported examples:
 *
 * export default {...}
 *
 * export const locationContent = {...}
 *
 * export const getLocationContent = (...) => {...}
 *
 * export const locations = {
 *   "dwarka-expressway": {...}
 * }
 */
function resolveLocationContent(
  location,
  properties = []
) {
  const module =
    locationContentModule || {};

  const locationSlug = cleanSlug(
    location?.slug
  );

  const locationName = cleanSlug(
    location?.name
  );

  const publicSlug = cleanSlug(
    buildPublicLocationSlug(location)
  );

  const defaultExport =
    module?.default;

  /* ----------------------------------------------------------
     FUNCTION EXPORTS
  ---------------------------------------------------------- */

  if (
    typeof module?.getLocationContent ===
    "function"
  ) {
    const result =
      module.getLocationContent(
        location,
        properties
      );

    if (result) {
      return result;
    }
  }

  if (
    typeof defaultExport === "function"
  ) {
    const result =
      defaultExport(
        location,
        properties
      );

    if (result) {
      return result;
    }
  }

  if (
    typeof module?.locationContent ===
    "function"
  ) {
    const result =
      module.locationContent(
        location,
        properties
      );

    if (result) {
      return result;
    }
  }

  /* ----------------------------------------------------------
     OBJECT EXPORT
  ---------------------------------------------------------- */

  const exportedObject =
    module?.locationContent ||
    module?.locations ||
    defaultExport;

  if (
    exportedObject &&
    typeof exportedObject ===
      "object" &&
    !Array.isArray(exportedObject)
  ) {
    /*
     * Direct content object:
     *
     * {
     *   hero: {...},
     *   about: {...}
     * }
     */
    if (
      exportedObject.hero ||
      exportedObject.about ||
      exportedObject.seo ||
      exportedObject.faq ||
      exportedObject.connectivity ||
      exportedObject.realEstateTypes ||
      exportedObject.propertyPrices ||
      exportedObject.lifestyle ||
      exportedObject.whyBuy ||
      exportedObject.nearby
    ) {
      return exportedObject;
    }

    /*
     * Location-keyed content:
     *
     * {
     *   "dwarka-expressway": {...},
     *   "sector-102": {...}
     * }
     */
    const possibleKeys = [
      locationSlug,
      locationName,
      publicSlug,
    ].filter(Boolean);

    for (const key of possibleKeys) {
      if (
        exportedObject[key] &&
        typeof exportedObject[key] ===
          "object"
      ) {
        return exportedObject[key];
      }
    }

    /*
     * Try case-insensitive key matching.
     */
    const keys = Object.keys(
      exportedObject
    );

    for (const key of keys) {
      const normalizedKey =
        cleanSlug(key);

      if (
        possibleKeys.includes(
          normalizedKey
        )
      ) {
        return exportedObject[key];
      }
    }
  }

  return {};
}

/* ============================================================
   PUBLIC LOCATION URL
============================================================ */

function getLocationPreposition(
  location
) {
  const name = String(
    location?.name || ""
  )
    .trim()
    .toLowerCase();

  const slug = String(
    location?.slug || ""
  )
    .trim()
    .toLowerCase();

  const value = `${name} ${slug}`;

  const onKeywords = [
    "expressway",
    "express way",
    "highway",
    "road",
    "street",
    "avenue",
    "boulevard",
    "drive",
    "marg",
  ];

  return onKeywords.some(
    (keyword) =>
      value.includes(keyword)
  )
    ? "on"
    : "in";
}

/**
 * Example:
 *
 * sector-102 + gurgaon
 * =>
 * properties-in-sector-102-gurgaon
 *
 * dwarka-expressway + gurgaon
 * =>
 * properties-on-dwarka-expressway-gurgaon
 */
function buildPublicLocationSlug(
  location
) {
  if (!location) {
    return "";
  }

  const currentSlug = cleanSlug(
    location.slug
  );

  if (!currentSlug) {
    return "";
  }

  let root = location;

  const visited = new Set();

  while (root?.parent) {
    const rootId =
      root?._id?.toString?.() ||
      root?.id?.toString?.() ||
      root?.slug ||
      root?.name;

    if (
      rootId &&
      visited.has(rootId)
    ) {
      break;
    }

    if (rootId) {
      visited.add(rootId);
    }

    root = root.parent;
  }

  const rootSlug = cleanSlug(
    root?.slug
  );

  const preposition =
    getLocationPreposition(
      location
    );

  if (
    !rootSlug ||
    rootSlug === currentSlug
  ) {
    return `properties-${preposition}-${currentSlug}`;
  }

  return `properties-${preposition}-${currentSlug}-${rootSlug}`;
}

/* ============================================================
   LOCATION IMAGE INHERITANCE
============================================================ */

function getClosestLocationImage(
  location
) {
  const visited = new Set();

  let current = location;

  while (current) {
    const currentId =
      current?._id?.toString?.() ||
      current?.id?.toString?.() ||
      current?.slug ||
      current?.name;

    if (
      currentId &&
      visited.has(currentId)
    ) {
      break;
    }

    if (currentId) {
      visited.add(currentId);
    }

    const image =
      typeof current?.image ===
      "string"
        ? current.image.trim()
        : "";

    if (image) {
      return image;
    }

    current =
      current?.parent;
  }

  return "";
}

/* ============================================================
   LOCATION NAME
============================================================ */

function getLocationName(
  location
) {
  return (
    location?.name ||
    location?.seoName ||
    "Prime Location"
  );
}

/* ============================================================
   LOCATION DESCRIPTION
============================================================ */

function getLocationDescription(
  location,
  properties = [],
  content = {}
) {
  /*
   * First priority:
   * Explicit SEO description from locationContent.js
   */
  const contentDescription =
    content?.seo?.description ||
    content?.metaDescription ||
    content?.description;

  if (
    typeof contentDescription ===
      "string" &&
    contentDescription.trim()
  ) {
    return contentDescription.trim();
  }

  /*
   * Second priority:
   * Backend location description
   */
  if (
    typeof location?.description ===
      "string" &&
    location.description.trim()
  ) {
    return location.description.trim();
  }

  const locationName =
    getLocationName(location);

  const developerNames = [
    ...new Set(
      properties
        .map(
          (property) =>
            property?.coreDetails
              ?.developerName
        )
        .filter(Boolean)
    ),
  ];

  const developerText =
    developerNames.length > 0
      ? ` featuring developments by ${developerNames
          .slice(0, 5)
          .join(", ")}`
      : "";

  return `Explore luxury properties, premium residences and investment opportunities in ${locationName}${developerText}. Discover curated real estate projects with Property Bouquet.`;
}

/* ============================================================
   FETCH OLD/BACKEND LOCATION
============================================================ */

async function getBackendLocation(
  backendSlug
) {
  try {
    const response =
      await fetch(
        `${API}/api/locations/${encodeURIComponent(
          backendSlug
        )}`,
        {
          next: {
            revalidate: 300,
          },
        }
      );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    if (
      !data?.success ||
      !data?.location
    ) {
      return null;
    }

    return data;
  } catch (error) {
    console.error(
      "Failed to fetch backend location:",
      error
    );

    return null;
  }
}

/* ============================================================
   FETCH PUBLIC LOCATION
============================================================ */

async function getPublicLocation(
  publicSlug
) {
  try {
    const response =
      await fetch(
        `${API}/api/locations/public/${encodeURIComponent(
          publicSlug
        )}`,
        {
          next: {
            revalidate: 300,
          },
        }
      );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    if (
      !data?.success ||
      !data?.location
    ) {
      return null;
    }

    return data;
  } catch (error) {
    console.error(
      "Failed to fetch public location:",
      error
    );

    return null;
  }
}

/* ============================================================
   FILTER PUBLISHED PROPERTIES
============================================================ */

function filterPublishedProperties(
  properties = []
) {
  return properties.filter(
    (property) => {
      if (!property) {
        return false;
      }

      if (
        property.status !==
        "published"
      ) {
        return false;
      }

      if (
        property.isDeleted === true
      ) {
        return false;
      }

      if (
        property.deletedFromStatus ===
        "trash"
      ) {
        return false;
      }

      return true;
    }
  );
}

/* ============================================================
   BUILD BREADCRUMB CHAIN
============================================================ */

function buildLocationChain(
  location
) {
  const chain = [];

  const visited = new Set();

  let current = location;

  while (current) {
    const id =
      current?._id?.toString?.() ||
      current?.id?.toString?.() ||
      current?.slug ||
      current?.name;

    if (
      id &&
      visited.has(id)
    ) {
      break;
    }

    if (id) {
      visited.add(id);
    }

    chain.unshift(current);

    current =
      current?.parent;
  }

  return chain;
}

/* ============================================================
   SEO TITLE
============================================================ */

function getSeoTitle(
  location,
  content
) {
  const locationName =
    getLocationName(location);

  return (
    content?.seo?.title ||
    content?.metaTitle ||
    `Luxury Properties in ${locationName} | Projects & Real Estate`
  );
}

/* ============================================================
   SEO KEYWORDS
============================================================ */

function getSeoKeywords(
  location,
  content
) {
  const locationName =
    getLocationName(location);

  const defaultKeywords = [
    `properties in ${locationName}`,
    `flats in ${locationName}`,
    `luxury apartments in ${locationName}`,
    `property prices in ${locationName}`,
    `real estate in ${locationName}`,
    `new projects in ${locationName}`,
  ];

  const keywords =
    content?.seo?.keywords ||
    content?.keywords;

  if (Array.isArray(keywords)) {
    return [
      ...new Set([
        ...keywords,
        ...defaultKeywords,
      ]),
    ];
  }

  return defaultKeywords;
}

/* ============================================================
   GENERATE METADATA
============================================================ */

export async function generateMetadata({
  params,
}) {
  const { slug } = await params;

  const publicSlug =
    cleanSlug(slug);

  if (!publicSlug) {
    return {};
  }

  /* ----------------------------------------------------------
     FIRST:
     Try NEW public SEO URL
  ---------------------------------------------------------- */

  let data =
    await getPublicLocation(
      publicSlug
    );

  /* ----------------------------------------------------------
     FALLBACK:
     Try OLD backend URL
  ---------------------------------------------------------- */

  if (!data) {
    const oldData =
      await getBackendLocation(
        publicSlug
      );

    if (oldData?.location) {
      const canonicalPublicSlug =
        buildPublicLocationSlug(
          oldData.location
        );

      if (
        canonicalPublicSlug &&
        canonicalPublicSlug !==
          publicSlug
      ) {
        permanentRedirect(
          `/locations/${canonicalPublicSlug}`
        );
      }

      data = oldData;
    }
  }

  if (!data?.location) {
    return {
      title:
        "Location Not Found | Property Bouquet",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const location =
    data.location;

  const properties =
    filterPublishedProperties(
      data.properties || []
    );

  /*
   * Static editorial/SEO content
   */
  const staticContent =
    resolveLocationContent(
      location,
      properties
    );

  /*
   * Backend content + static content.
   *
   * locationContent.js wins where both
   * contain the same field.
   */
  const pageContent =
    deepMerge(
      location?.pageContent || {},
      staticContent || {}
    );

  const locationName =
    getLocationName(location);

  const canonicalPublicSlug =
    buildPublicLocationSlug(
      location
    );

  const canonicalUrl =
    `${SITE_URL}/locations/${canonicalPublicSlug}`;

  const description =
    getLocationDescription(
      location,
      properties,
      pageContent
    );

  const title =
    getSeoTitle(
      location,
      pageContent
    );

  const keywords =
    getSeoKeywords(
      location,
      pageContent
    );

  /* ----------------------------------------------------------
     IMAGE
  ---------------------------------------------------------- */

  const inheritedImage =
    getClosestLocationImage(
      location
    );

  const ogImage =
    inheritedImage ||
    properties?.[0]?.media
      ?.heroImageUrl ||
    `${SITE_URL}/logo.png`;

  /* ----------------------------------------------------------
     RETURN METADATA
  ---------------------------------------------------------- */

  return {
    title,

    description,

    keywords,

    alternates: {
      canonical:
        canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview":
          "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      title,

      description,

      url: canonicalUrl,

      siteName:
        "Property Bouquet",

      type: "website",

      locale: "en_IN",

      images: [
        {
          url: ogImage,

          width: 1200,

          height: 630,

          alt: `Luxury properties in ${locationName}`,
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title,

      description,

      images: [ogImage],
    },
  };
}

/* ============================================================
   LOCATION PAGE
============================================================ */

export default async function LocationPage({
  params,
}) {
  const { slug } = await params;

  const requestedSlug =
    cleanSlug(slug);

  if (!requestedSlug) {
    notFound();
  }

  /* ==========================================================
     FIRST:
     TRY NEW PUBLIC SEO URL
  ========================================================== */

  let data =
    await getPublicLocation(
      requestedSlug
    );

  /* ==========================================================
     OLD URL REDIRECT
  ========================================================== */

  if (!data) {
    const oldData =
      await getBackendLocation(
        requestedSlug
      );

    if (!oldData?.location) {
      notFound();
    }

    const canonicalPublicSlug =
      buildPublicLocationSlug(
        oldData.location
      );

    /*
     * Redirect old URLs:
     *
     * /locations/sector-56
     *
     * ->
     *
     * /locations/properties-in-sector-56-gurgaon
     */

    if (
      canonicalPublicSlug &&
      canonicalPublicSlug !==
        requestedSlug
    ) {
      permanentRedirect(
        `/locations/${canonicalPublicSlug}`
      );
    }

    data = oldData;
  }

  if (!data?.location) {
    notFound();
  }

  /* ==========================================================
     LOCATION
  ========================================================== */

  const location =
    data.location;

  /* ==========================================================
     PROPERTIES
  ========================================================== */

  const properties =
    filterPublishedProperties(
      data.properties || []
    );

  /* ==========================================================
     PUBLIC SLUG
  ========================================================== */

  const publicSlug =
    buildPublicLocationSlug(
      location
    );

  /*
   * Safety:
   * If the requested URL is technically valid but
   * isn't the canonical public slug, redirect it.
   */
  if (
    publicSlug &&
    requestedSlug !== publicSlug
  ) {
    permanentRedirect(
      `/locations/${publicSlug}`
    );
  }

  /* ==========================================================
     STATIC LOCATION CONTENT
  ========================================================== */

  const staticContent =
    resolveLocationContent(
      location,
      properties
    );

  /*
   * Merge backend pageContent with the new
   * locationContent.js content.
   *
   * Static content wins where explicitly defined.
   */
  const pageContent =
    deepMerge(
      location?.pageContent || {},
      staticContent || {}
    );

  /* ==========================================================
     INHERITED IMAGE
  ========================================================== */

  const locationImage =
    getClosestLocationImage(
      location
    );

  /*
   * Pass inherited image to client.
   *
   * This means:
   *
   * Sector 56
   *     ↓
   * Golf Course Road
   *     ↓
   * Gurgaon
   *
   * can inherit an image if the child location
   * doesn't have one.
   */

  const locationForClient = {
    ...location,

    image:
      locationImage ||
      location?.image ||
      "",
  };

  /* ==========================================================
     BREADCRUMB
  ========================================================== */

  const locationChain =
    buildLocationChain(
      location
    );

  /* ==========================================================
     LOCATION INFORMATION
  ========================================================== */

  const locationName =
    getLocationName(location);

  const canonicalUrl =
    `${SITE_URL}/locations/${publicSlug}`;

  const description =
    getLocationDescription(
      location,
      properties,
      pageContent
    );

  /* ==========================================================
     BREADCRUMB JSON-LD
  ========================================================== */

  const breadcrumbItems = [
    {
      "@type": "ListItem",

      position: 1,

      name: "Home",

      item: SITE_URL,
    },

    {
      "@type": "ListItem",

      position: 2,

      name: "Locations",

      item: `${SITE_URL}/locations`,
    },

    ...locationChain.map(
      (item, index) => {
        const itemPublicSlug =
          buildPublicLocationSlug(
            item
          );

        return {
          "@type":
            "ListItem",

          position:
            index + 3,

          name:
            getLocationName(
              item
            ),

          item: `${SITE_URL}/locations/${itemPublicSlug}`,
        };
      }
    ),
  ];

  /* ==========================================================
     SCHEMA IMAGE
  ========================================================== */

  const inheritedImage =
    getClosestLocationImage(
      location
    );

  const schemaImage =
    inheritedImage ||
    properties?.[0]?.media
      ?.heroImageUrl ||
    `${SITE_URL}/logo.png`;

  /* ==========================================================
     SCHEMA:
     PLACE
  ========================================================== */

  const placeSchema = {
    "@context":
      "https://schema.org",

    "@type": "Place",

    name: locationName,

    url: canonicalUrl,

    image: schemaImage,
  };

  /* ==========================================================
     SCHEMA:
     WEB PAGE
  ========================================================== */

  const webPageSchema = {
    "@context":
      "https://schema.org",

    "@type": "WebPage",

    name:
      getSeoTitle(
        location,
        pageContent
      ),

    url: canonicalUrl,

    description,

    isPartOf: {
      "@type": "WebSite",

      name:
        "Property Bouquet",

      url: SITE_URL,
    },
  };

  /* ==========================================================
     SCHEMA:
     COLLECTION PAGE
  ========================================================== */

  const collectionSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "CollectionPage",

    name: `Properties in ${locationName}`,

    url: canonicalUrl,

    about: {
      "@type": "Place",

      name: locationName,
    },

    numberOfItems:
      properties.length,
  };

  /* ==========================================================
     SCHEMA:
     BREADCRUMB
  ========================================================== */

  const breadcrumbSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement:
      breadcrumbItems,
  };

  /* ==========================================================
     FAQ SCHEMA
  ========================================================== */

  /*
   * If locationContent.js contains:
   *
   * faq: {
   *   enabled: true,
   *   items: [...]
   * }
   *
   * we automatically create FAQPage JSON-LD.
   */

  const faqItems =
    Array.isArray(
      pageContent?.faq?.items
    )
      ? pageContent.faq.items
      : Array.isArray(
          pageContent?.faqs
        )
      ? pageContent.faqs
      : [];

  const validFaqItems =
    faqItems.filter(
      (item) =>
        item &&
        typeof item.question ===
          "string" &&
        item.question.trim() &&
        typeof item.answer ===
          "string" &&
        item.answer.trim()
    );

  const faqSchema =
    validFaqItems.length > 0
      ? {
          "@context":
            "https://schema.org",

          "@type":
            "FAQPage",

          mainEntity:
            validFaqItems.map(
              (item) => ({
                "@type":
                  "Question",

                name:
                  item.question.trim(),

                acceptedAnswer: {
                  "@type":
                    "Answer",

                  text:
                    item.answer.trim(),
                },
              })
            ),
        }
      : null;

  /* ==========================================================
     FINAL SCHEMA ARRAY
  ========================================================== */

  const schema = [
    placeSchema,

    webPageSchema,

    collectionSchema,

    breadcrumbSchema,

    ...(faqSchema
      ? [faqSchema]
      : []),
  ];

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      {/* ======================================================
          STRUCTURED DATA
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(schema),
        }}
      />

      {/* ======================================================
          LOCATION CLIENT PAGE
      ====================================================== */}

      <LocationSlugClient
        location={
          locationForClient
        }

        properties={
          properties
        }

        slug={publicSlug}

        /*
         * This is the important addition.
         *
         * Your LocationSlugClient already reads:
         *
         * location?.pageContent
         *
         * Therefore we put the final merged
         * locationContent into the location object.
         */

        pageContent={
          pageContent
        }
      />
    </>
  );
}