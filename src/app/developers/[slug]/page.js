import { notFound } from "next/navigation";
import DeveloperSlugClient from "./DeveloperSlugClient";

const SITE_URL = "https://propertybouquet.com";
const API = "https://propertybouquet.com";

// ============================================================
// FETCH DEVELOPER DATA
// ============================================================

async function getDeveloper(slug) {
  if (!slug) return null;

  try {
    const res = await fetch(
      `${API}/api/developers/${encodeURIComponent(slug)}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) {
      console.error(
        `Developer fetch failed for "${slug}":`,
        res.status
      );

      return null;
    }

    const data = await res.json();

    if (!data?.developer) {
      return null;
    }

    // ----------------------------------------------------------
    // ONLY PUBLISHED + NON-DELETED PROPERTIES
    // ----------------------------------------------------------

    const publishedProperties = Array.isArray(data.properties)
      ? data.properties.filter(
          (property) =>
            property?.status === "published" &&
            property?.isDeleted !== true &&
            property?.deletedFromStatus !== "trash"
        )
      : [];

    return {
      developer: data.developer,
      properties: publishedProperties,
    };
  } catch (error) {
    console.error(
      `Developer data fetch error for "${slug}":`,
      error
    );

    return null;
  }
}

// ============================================================
// TEXT HELPERS
// ============================================================

function cleanText(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim();
}

function truncateDescription(text, maxLength = 160) {
  const cleaned = cleanText(text);

  if (!cleaned) {
    return "";
  }

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned
    .substring(0, maxLength - 3)
    .trim()}...`;
}

// ============================================================
// URL HELPERS
// ============================================================

function buildDeveloperUrl(slug) {
  return `${SITE_URL}/developers/${encodeURIComponent(slug)}`;
}

function buildPropertyUrl(slug) {
  return `${SITE_URL}/${encodeURIComponent(slug)}`;
}

// ============================================================
// GET PROJECT LOCATION NAMES
// ============================================================

function getPropertyLocation(property) {
  const locations = [];

  const locationData = property?.locationData;

  if (locationData?.locationName) {
    locations.push(
      cleanText(locationData.locationName)
    );
  }

  if (locationData?.customLocation) {
    locations.push(
      cleanText(locationData.customLocation)
    );
  }

  let current = locationData?.locationRef;

  while (current) {
    if (current?.name) {
      const name = cleanText(current.name);

      if (
        name &&
        !locations.some(
          (existing) =>
            existing.toLowerCase() ===
            name.toLowerCase()
        )
      ) {
        locations.push(name);
      }
    }

    current = current.parent;
  }

  return locations.filter(Boolean);
}

// ============================================================
// DEVELOPER LOCATION SUMMARY
// ============================================================

function getDeveloperLocations(properties) {
  const locations = [];

  for (const property of properties) {
    const propertyLocations =
      getPropertyLocation(property);

    for (const location of propertyLocations) {
      if (
        !locations.some(
          (existing) =>
            existing.toLowerCase() ===
            location.toLowerCase()
        )
      ) {
        locations.push(location);
      }
    }
  }

  return locations.slice(0, 10);
}

// ============================================================
// GET PROJECT NAMES
// ============================================================

function getProjectNames(properties) {
  return properties
    .map((property) =>
      cleanText(
        property?.coreDetails?.title
      )
    )
    .filter(Boolean);
}

// ============================================================
// METADATA
// ============================================================

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const data = await getDeveloper(slug);

  // ==========================================================
  // REAL 404 METADATA
  // ==========================================================

  if (!data?.developer) {
    return {
      title: "Developer Not Found | Property Bouquet",

      description:
        "The requested real estate developer could not be found on Property Bouquet.",

      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const developer = data.developer;
  const properties = data.properties || [];

  const developerName =
    cleanText(developer?.name) ||
    "Real Estate Developer";

  const developerDescription =
    cleanText(developer?.description);

  const projectNames =
    getProjectNames(properties);

  const locations =
    getDeveloperLocations(properties);

  // ==========================================================
  // DYNAMIC LOCATION PHRASE
  // ==========================================================

  let locationPhrase = "";

  if (locations.length === 1) {
    locationPhrase = ` in ${locations[0]}`;
  } else if (locations.length === 2) {
    locationPhrase = ` in ${locations[0]} and ${locations[1]}`;
  } else if (locations.length > 2) {
    locationPhrase = ` in ${locations
      .slice(0, 3)
      .join(", ")}`;
  }

  // ==========================================================
  // SEO DESCRIPTION
  // ==========================================================

  let description;

  if (developerDescription) {
    description = `Explore ${developerName} properties and projects on Property Bouquet. ${developerDescription}`;

    if (locationPhrase) {
      description += ` Discover projects${locationPhrase}.`;
    }
  } else {
    description =
      `Explore ${developerName} projects and properties on Property Bouquet. View prices, floor plans, locations, amenities and project details`;

    if (locationPhrase) {
      description += locationPhrase;
    }

    description += ".";
  }

  const metaDescription =
    truncateDescription(
      description,
      160
    );

  // ==========================================================
  // TITLE
  // ==========================================================

  const title =
    `${developerName} Projects & Properties | Prices, Floor Plans & Locations | Property Bouquet`;

  // ==========================================================
  // CANONICAL
  // ==========================================================

  const canonicalUrl =
    buildDeveloperUrl(slug);

  // ==========================================================
  // OG IMAGE
  // ==========================================================

  const developerImage =
    developer?.image ||
    developer?.logo ||
    `${SITE_URL}/og-image.jpg`;

  // ==========================================================
  // KEYWORDS
  // ==========================================================

  const keywords = [
    `${developerName} projects`,
    `${developerName} properties`,
    `${developerName} real estate`,
    `${developerName} residential projects`,
    `${developerName} apartments`,
    `${developerName} flats`,
    `${developerName} luxury projects`,
    `${developerName} project prices`,
    `${developerName} property prices`,
    `${developerName} floor plans`,
    `${developerName} project details`,
    `${developerName} project locations`,
    `${developerName} amenities`,
    ...locations
      .slice(0, 10)
      .map(
        (location) =>
          `${developerName} projects in ${location}`
      ),
    ...projectNames.slice(0, 10),
    "Property Bouquet",
    "Property Bouquet developers",
  ];

  // ==========================================================
  // RETURN METADATA
  // ==========================================================

  return {
    metadataBase: new URL(SITE_URL),

    title,

    description: metaDescription,

    keywords,

    applicationName: "Property Bouquet",

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",

      locale: "en_IN",

      url: canonicalUrl,

      siteName: "Property Bouquet",

      title,

      description: metaDescription,

      images: [
        {
          url: developerImage,
          width: 1200,
          height: 630,
          alt: `${developerName} Projects and Properties - Property Bouquet`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title,

      description: metaDescription,

      images: [developerImage],
    },
  };
}

// ============================================================
// JSON-LD SAFE STRINGIFY
// ============================================================

function safeJsonLd(data) {
  return JSON.stringify(data).replace(
    /</g,
    "\\u003c"
  );
}

// ============================================================
// PAGE
// ============================================================

export default async function DeveloperSlugPage({
  params,
}) {
  const { slug } = await params;

  // ----------------------------------------------------------
  // SERVER-SIDE FETCH
  // ----------------------------------------------------------

  const data = await getDeveloper(slug);

  // ----------------------------------------------------------
  // REAL 404
  // ----------------------------------------------------------

  if (!data?.developer) {
    notFound();
  }

  const developer = data.developer;
  const properties = data.properties || [];

  // ----------------------------------------------------------
  // BASIC DATA
  // ----------------------------------------------------------

  const developerName =
    cleanText(developer?.name) ||
    "Luxury Real Estate Developer";

  const canonicalUrl =
    buildDeveloperUrl(slug);

  const developerDescription =
    cleanText(developer?.description) ||
    `Explore premium real estate projects and luxury properties by ${developerName} on Property Bouquet.`;

  const developerImage =
    developer?.image ||
    developer?.logo ||
    `${SITE_URL}/og-image.jpg`;

  const locations =
    getDeveloperLocations(properties);

  // ==========================================================
  // DYNAMIC LOCATION DESCRIPTION
  // ==========================================================

  let locationDescription = "";

  if (locations.length === 1) {
    locationDescription = ` Projects are available in ${locations[0]}.`;
  } else if (locations.length === 2) {
    locationDescription = ` Projects are available in ${locations[0]} and ${locations[1]}.`;
  } else if (locations.length > 2) {
    locationDescription = ` Projects are available across ${locations
      .slice(0, 5)
      .join(", ")}.`;
  }

  // ==========================================================
  // DEVELOPER ORGANIZATION SCHEMA
  // ==========================================================

  const developerSchema = {
    "@context": "https://schema.org",

    "@type": "Organization",

    "@id": `${canonicalUrl}#organization`,

    name: developerName,

    url: canonicalUrl,

    description: developerDescription,

    ...(developer?.logo
      ? {
          logo: {
            "@type": "ImageObject",
            url: developer.logo,
          },
        }
      : {}),

    ...(developer?.image
      ? {
          image: {
            "@type": "ImageObject",
            url: developer.image,
          },
        }
      : {}),
  };

  // ==========================================================
  // WEB PAGE SCHEMA
  // ==========================================================

  const webPageSchema = {
    "@context": "https://schema.org",

    "@type": "WebPage",

    "@id": `${canonicalUrl}#webpage`,

    url: canonicalUrl,

    name: `${developerName} Projects & Properties`,

    headline:
      `${developerName} Projects & Properties`,

    description:
      `${developerDescription}${locationDescription}`,

    inLanguage: "en-IN",

    isPartOf: {
      "@type": "WebSite",

      "@id": `${SITE_URL}#website`,

      name: "Property Bouquet",

      url: SITE_URL,
    },

    about: {
      "@id": `${canonicalUrl}#organization`,
    },

    mainEntity: {
      "@id": `${canonicalUrl}#organization`,
    },
  };

  // ==========================================================
  // BREADCRUMB SCHEMA
  // ==========================================================

  const breadcrumbSchema = {
    "@context": "https://schema.org",

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

        name: "Developers",

        item: `${SITE_URL}/developers`,
      },

      {
        "@type": "ListItem",

        position: 3,

        name: developerName,

        item: canonicalUrl,
      },
    ],
  };

  // ==========================================================
  // PROJECT ITEM LIST
  // ==========================================================

  const projectItems = properties
    .slice(0, 50)
    .map((property, index) => {
      const propertySlug =
        cleanText(property?.slug);

      const propertyTitle =
        cleanText(
          property?.coreDetails?.title
        ) || "Luxury Property";

      if (!propertySlug) {
        return null;
      }

      const propertyUrl =
        buildPropertyUrl(propertySlug);

      const heroImage =
        property?.media?.heroImageUrl;

      return {
        "@type": "ListItem",

        position: index + 1,

        name: propertyTitle,

        url: propertyUrl,

        item: {
          "@type": "RealEstateListing",

          "@id": `${propertyUrl}#listing`,

          name: propertyTitle,

          url: propertyUrl,

          ...(heroImage
            ? {
                image: heroImage,
              }
            : {}),
        },
      };
    })
    .filter(Boolean);

  // ==========================================================
  // COLLECTION PAGE SCHEMA
  // ==========================================================

  const collectionSchema = {
    "@context": "https://schema.org",

    "@type": "CollectionPage",

    "@id": `${canonicalUrl}#collection`,

    url: canonicalUrl,

    name:
      `${developerName} Projects and Properties`,

    headline:
      `${developerName} Projects and Properties`,

    description:
      `Explore ${developerName} projects and properties on Property Bouquet.${locationDescription}`,

    inLanguage: "en-IN",

    isPartOf: {
      "@type": "WebSite",

      "@id": `${SITE_URL}#website`,

      name: "Property Bouquet",

      url: SITE_URL,
    },

    about: {
      "@id": `${canonicalUrl}#organization`,
    },

    mainEntity: {
      "@type": "ItemList",

      "@id": `${canonicalUrl}#projects`,

      numberOfItems: projectItems.length,

      itemListElement: projectItems,
    },

    ...(locations.length > 0
      ? {
          spatialCoverage: locations.map(
            (location) => ({
              "@type": "Place",
              name: location,
            })
          ),
        }
      : {}),
  };

  // ==========================================================
  // RETURN SERVER HTML
  // ==========================================================

  return (
    <>
      {/* ======================================================
          DEVELOPER ORGANIZATION JSON-LD
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            developerSchema
          ),
        }}
      />

      {/* ======================================================
          WEB PAGE JSON-LD
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            webPageSchema
          ),
        }}
      />

      {/* ======================================================
          BREADCRUMB JSON-LD
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            breadcrumbSchema
          ),
        }}
      />

      {/* ======================================================
          COLLECTION / PROJECTS JSON-LD
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            collectionSchema
          ),
        }}
      />

      {/* ======================================================
          CLIENT UI
      ====================================================== */}

      <DeveloperSlugClient
        developer={developer}
        properties={properties}
        slug={slug}
      />
    </>
  );
}