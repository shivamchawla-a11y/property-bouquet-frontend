import { notFound } from "next/navigation";
import LocationSlugClient from "./LocationSlugClient";

const SITE_URL = "https://propertybouquet.com";
const API = "https://propertybouquet.com";

// ============================================================
// PUBLIC LOCATION URL RULE
// ============================================================
//
// BACKEND SLUG
//
// gurgaon
//      ↓
// /locations/gurgaon
//
// sector-65
//      ↓
// /locations/sector-65
//
// golf-course-road
//      ↓
// /locations/golf-course-road
//
// ============================================================


// ============================================================
// TEXT HELPERS
// ============================================================

function cleanText(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\s+/g, " ")
    .trim();
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
// BACKEND SLUG → PUBLIC SEO SLUG
// ============================================================
//
// Location URLs use the backend location slug directly.
//
// gurgaon
// → /locations/gurgaon
//
// sector-65
// → /locations/sector-65
//
// ============================================================

function buildPublicLocationSlug(locationSlug) {
  if (!locationSlug) {
    return "";
  }

  const cleanSlug = String(locationSlug)
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  if (!cleanSlug) {
    return "";
  }

  return cleanSlug;
}


// ============================================================
// PUBLIC LOCATION SLUG → BACKEND SLUG
// ============================================================
//
// The public location slug maps directly to the backend slug.
//
// /locations/gurgaon
//        ↓
// gurgaon
//
// /locations/sector-65
//        ↓
// sector-65
//
// ============================================================

function getBackendLocationSlug(publicSlug) {
  if (!publicSlug) {
    return "";
  }

  const cleanSlug = String(publicSlug)
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  if (!cleanSlug) {
    return "";
  }

  return cleanSlug;
}


// ============================================================
// VALIDATE PUBLIC URL
// ============================================================
//
// ONLY:
//
// /locations/{location-slug}
//
// is valid.
//
// ============================================================

function isValidPublicLocationSlug(slug) {
  if (!slug) {
    return false;
  }

  const cleanSlug = String(slug)
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  if (!cleanSlug) {
    return false;
  }

  // Prevent malformed / nested location paths.
  if (
    cleanSlug.includes("/") ||
    cleanSlug.includes("\\")
  ) {
    return false;
  }

  return true;
}


// ============================================================
// LOCATION NAME → SEO DISPLAY NAME
// ============================================================
//
// IMPORTANT:
//
// This keeps the actual location name clean.
//
// Gurgaon
// → Gurgaon
//
// Sector 65
// → Sector 65
//
// Golf Course Road
// → Golf Course Road
//
// ============================================================

function getSeoLocationName(locationName) {
  const cleanName = cleanText(locationName);

  if (!cleanName) {
    return "Prime Location";
  }

  return cleanName;
}


// ============================================================
// PUBLIC LOCATION URL
// ============================================================

function buildLocationUrl(backendSlug) {
  const publicSlug =
    buildPublicLocationSlug(
      backendSlug
    );

  return `${SITE_URL}/locations/${encodeURIComponent(
    publicSlug
  )}`;
}


// ============================================================
// PROPERTY URL
// ============================================================

function buildPropertyUrl(slug) {
  return `${SITE_URL}/${encodeURIComponent(slug)}`;
}


// ============================================================
// FETCH LOCATION DATA
// ============================================================

async function getLocation(publicSlug) {
  if (!publicSlug) {
    return null;
  }

  try {
    // ==========================================================
    // STRICT PUBLIC URL VALIDATION
    // ==========================================================

    if (!isValidPublicLocationSlug(publicSlug)) {
      console.warn(
        `Rejected old/invalid location URL: "${publicSlug}"`
      );

      return null;
    }

    // ==========================================================
    // GET BACKEND SLUG
    // ==========================================================

    const backendSlug =
      getBackendLocationSlug(
        publicSlug
      );

    if (!backendSlug) {
      return null;
    }

    // ==========================================================
    // FETCH LOCATION
    // ==========================================================

    const res = await fetch(
      `${API}/api/locations/${encodeURIComponent(
        backendSlug
      )}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) {
      console.warn(
        `Location "${backendSlug}" returned ${res.status}`
      );

      return null;
    }

    const data =
      await res.json();

    // ==========================================================
    // SUPPORT COMMON BACKEND RESPONSE STRUCTURES
    // ==========================================================

    const matchedLocation =
      data?.location ||
      data?.data?.location ||
      data?.data ||
      null;

    if (!matchedLocation) {
      console.error(
        `No location found for public slug "${publicSlug}".`
      );

      return null;
    }

    // ==========================================================
    // GET PROPERTIES
    // ==========================================================

    const rawProperties =
      Array.isArray(data?.properties)
        ? data.properties
        : Array.isArray(data?.data?.properties)
        ? data.data.properties
        : [];

    // ==========================================================
    // ONLY PUBLISHED + NON-DELETED PROPERTIES
    // ==========================================================

    const publishedProperties =
      rawProperties.filter(
        (property) =>
          property?.status === "published" &&
          property?.isDeleted !== true &&
          property?.deletedFromStatus !== "trash"
      );

    // ==========================================================
    // BUILD CANONICAL PUBLIC SLUG
    // ==========================================================

    const publicCanonicalSlug =
      buildPublicLocationSlug(
        backendSlug
      );

    // ==========================================================
    // RETURN
    // ==========================================================

    return {
      location:
        matchedLocation,

      properties:
        publishedProperties,

      backendSlug,

      publicSlug:
        publicCanonicalSlug,
    };
  } catch (error) {
    console.error(
      `Location data fetch error for public slug "${publicSlug}":`,
      error
    );

    return null;
  }
}


// ============================================================
// GET PROJECT LOCATION NAMES
// ============================================================

function getPropertyLocation(property) {
  const locations = [];

  const locationData =
    property?.locationData;

  // ----------------------------------------------------------
  // Main location
  // ----------------------------------------------------------

  if (locationData?.locationName) {
    locations.push(
      cleanText(
        locationData.locationName
      )
    );
  }

  // ----------------------------------------------------------
  // Custom location
  // ----------------------------------------------------------

  if (locationData?.customLocation) {
    locations.push(
      cleanText(
        locationData.customLocation
      )
    );
  }

  // ----------------------------------------------------------
  // Location hierarchy
  // ----------------------------------------------------------

  let current =
    locationData?.locationRef;

  while (current) {
    if (current?.name) {
      const name =
        cleanText(
          current.name
        );

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

    current =
      current.parent;
  }

  return locations.filter(Boolean);
}


// ============================================================
// GET PROJECT DEVELOPERS
// ============================================================

function getLocationDevelopers(properties) {
  const developers = [];

  for (const property of properties) {
    const developerNames = [
      property?.developerName,

      property?.coreDetails
        ?.developerName,

      property?.developer
        ?.name,

      property?.developerData
        ?.name,

      property?.developerRef
        ?.name,
    ]
      .filter(Boolean)
      .map((name) =>
        cleanText(name)
      );

    for (const developer of developerNames) {
      if (
        !developers.some(
          (existing) =>
            existing.toLowerCase() ===
            developer.toLowerCase()
        )
      ) {
        developers.push(
          developer
        );
      }
    }
  }

  return developers.slice(
    0,
    10
  );
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

export async function generateMetadata({
  params,
}) {
  const { slug } = await params;

  const data =
    await getLocation(slug);

  // ==========================================================
  // 404 METADATA
  // ==========================================================

  if (!data?.location) {
    return {
      metadataBase:
        new URL(SITE_URL),

      title:
        "Location Not Found | Property Bouquet",

      description:
        "The requested real estate location could not be found on Property Bouquet.",

      robots: {
        index: false,
        follow: true,
      },
    };
  }

  // ==========================================================
  // LOCATION DATA
  // ==========================================================

  const location =
    data.location;

  const properties =
    data.properties || [];

  const backendSlug =
    data.backendSlug;

  // ==========================================================
  // LOCATION NAME
  // ==========================================================

  const locationName =
    cleanText(
      location?.name
    ) ||
    "Prime Location";

  // ==========================================================
  // SEO LOCATION NAME
  // ==========================================================

  const seoLocationName =
    getSeoLocationName(
      locationName
    );

  // ==========================================================
  // PROJECT DATA
  // ==========================================================

  const projectNames =
    getProjectNames(
      properties
    );

  const developers =
    getLocationDevelopers(
      properties
    );

  const projectCount =
    properties.length;

  // ==========================================================
  // PROJECT COUNT
  // ==========================================================

  const projectCountText =
    projectCount === 1
      ? "1 project"
      : `${projectCount} projects`;

  // ==========================================================
  // DEVELOPER PHRASE
  // ==========================================================

  let developerPhrase = "";

  if (developers.length === 1) {
    developerPhrase =
      ` by ${developers[0]}`;
  } else if (
    developers.length === 2
  ) {
    developerPhrase =
      ` by ${developers[0]} and ${developers[1]}`;
  } else if (
    developers.length > 2
  ) {
    developerPhrase =
      ` by ${developers
        .slice(0, 3)
        .join(", ")}`;
  }

  // ==========================================================
  // PRIMARY SEO TITLE
  // ==========================================================
  //
  // Gurgaon:
  // Luxury Properties in Gurgaon | Projects & Real Estate
  //
  // Sector 65:
  // Luxury Properties in Sector 65 | Projects & Real Estate
  //
  // ==========================================================

  const title =
    `Luxury Properties in ${seoLocationName} | Projects & Real Estate`;

  // ==========================================================
  // SEO DESCRIPTION
  // ==========================================================

  let description =
    `Explore luxury properties in ${seoLocationName} on Property Bouquet. Browse all ${projectCountText} with residential and commercial properties, prices, floor plans, amenities, locations and detailed project information`;

  if (developerPhrase) {
    description +=
      developerPhrase;
  }

  description += ".";

  const metaDescription =
    truncateDescription(
      description,
      160
    );

  // ==========================================================
  // CANONICAL URL
  // ==========================================================

  const canonicalUrl =
    buildLocationUrl(
      backendSlug
    );

  // ==========================================================
  // LOCATION IMAGE
  // ==========================================================

  const locationImage =
    location?.image ||
    location?.coverImage ||
    location?.bannerImage ||
    location?.logo ||
    `${SITE_URL}/og-image.jpg`;

  // ==========================================================
  // KEYWORDS
  // ==========================================================

  const keywords = [
    // Location
    `${locationName} real estate`,
    `${locationName} properties`,
    `${locationName} property`,
    `${locationName} residential projects`,
    `${locationName} commercial projects`,
    `${locationName} real estate projects`,

    // Luxury
    `luxury properties in ${locationName}`,
    `luxury homes in ${locationName}`,
    `premium properties in ${locationName}`,
    `luxury apartments in ${locationName}`,
    `premium apartments in ${locationName}`,
    `luxury flats in ${locationName}`,

    // Investment
    `property investment in ${locationName}`,
    `real estate investment in ${locationName}`,
    `best properties in ${locationName}`,
    `property for sale in ${locationName}`,

    // Project information
    `projects in ${locationName}`,
    `new projects in ${locationName}`,
    `upcoming projects in ${locationName}`,
    `property prices in ${locationName}`,
    `floor plans in ${locationName}`,
    `properties with amenities in ${locationName}`,

    // Developers
    ...developers
      .slice(0, 10)
      .map(
        (developer) =>
          `${developer} projects in ${locationName}`
      ),

    // Actual project names
    ...projectNames.slice(
      0,
      15
    ),

    // Generic
    "luxury real estate",
    "premium real estate",
    "residential properties",
    "commercial properties",
    "real estate projects",
    "property developers",
    "luxury homes",

    // Brand
    "Property Bouquet",
    "Property Bouquet properties",
    "Property Bouquet locations",
  ];

  // ==========================================================
  // RETURN METADATA
  // ==========================================================

  return {
    metadataBase:
      new URL(SITE_URL),

    title,

    description:
      metaDescription,

    keywords,

    applicationName:
      "Property Bouquet",

    // ========================================================
    // CANONICAL
    // ========================================================

    alternates: {
      canonical:
        canonicalUrl,
    },

    // ========================================================
    // ROBOTS
    // ========================================================

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,

        noimageindex: false,

        "max-image-preview":
          "large",

        "max-snippet":
          -1,

        "max-video-preview":
          -1,
      },
    },

    // ========================================================
    // OPEN GRAPH
    // ========================================================

    openGraph: {
      type: "website",

      locale: "en_IN",

      url:
        canonicalUrl,

      siteName:
        "Property Bouquet",

      title,

      description:
        metaDescription,

      images: [
        {
          url:
            locationImage,

          width:
            1200,

          height:
            630,

          alt:
            title,
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

      description:
        metaDescription,

      images: [
        locationImage,
      ],
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

export default async function LocationSlugPage({
  params,
}) {
  const { slug } = await params;

  // ==========================================================
  // STRICT PUBLIC URL CHECK
  // ==========================================================

  if (
    !isValidPublicLocationSlug(
      slug
    )
  ) {
    notFound();
  }

  // ==========================================================
  // SERVER-SIDE FETCH
  // ==========================================================

  const data =
    await getLocation(slug);

  // ==========================================================
  // REAL 404
  // ==========================================================

  if (!data?.location) {
    notFound();
  }

  // ==========================================================
  // BASIC DATA
  // ==========================================================

  const location =
    data.location;

  const properties =
    data.properties || [];

  const backendSlug =
    data.backendSlug;

  // ==========================================================
  // LOCATION NAME
  // ==========================================================

  const locationName =
    cleanText(
      location?.name
    ) ||
    "Prime Location";

  // ==========================================================
  // SEO LOCATION NAME
  // ==========================================================

  const seoLocationName =
    getSeoLocationName(
      locationName
    );

  // ==========================================================
  // PUBLIC CANONICAL URL
  // ==========================================================

  const canonicalUrl =
    buildLocationUrl(
      backendSlug
    );

  // ==========================================================
  // LOCATION DESCRIPTION
  // ==========================================================

  const locationDescription =
    cleanText(
      location?.description
    ) ||
    `Explore premium real estate projects, luxury residences, and investment opportunities in ${seoLocationName} on Property Bouquet.`;

  // ==========================================================
  // LOCATION IMAGE
  // ==========================================================

  const locationImage =
    location?.image ||
    location?.coverImage ||
    location?.bannerImage ||
    location?.logo ||
    `${SITE_URL}/og-image.jpg`;

  // ==========================================================
  // DEVELOPERS
  // ==========================================================

  const developers =
    getLocationDevelopers(
      properties
    );

  // ==========================================================
  // PROJECT NAMES
  // ==========================================================

  const projectNames =
    getProjectNames(
      properties
    );

  // ==========================================================
  // LOCATION HIERARCHY
  // ==========================================================

  const locationHierarchy = [];

  let currentLocation =
    location;

  while (
    currentLocation
  ) {
    if (
      currentLocation?.name
    ) {
      const name =
        cleanText(
          currentLocation.name
        );

      if (
        name &&
        !locationHierarchy.some(
          (existing) =>
            existing.toLowerCase() ===
            name.toLowerCase()
        )
      ) {
        locationHierarchy.push(
          name
        );
      }
    }

    currentLocation =
      currentLocation.parent;
  }

  // ==========================================================
  // LOCATION DESCRIPTION FOR SCHEMA
  // ==========================================================

  let developerDescription =
    "";

  if (developers.length === 1) {
    developerDescription =
      ` Premium projects in this location include developments by ${developers[0]}.`;
  } else if (
    developers.length === 2
  ) {
    developerDescription =
      ` Premium projects in this location include developments by ${developers[0]} and ${developers[1]}.`;
  } else if (
    developers.length > 2
  ) {
    developerDescription =
      ` Premium projects in this location include developments by ${developers
        .slice(0, 5)
        .join(", ")}.`;
  }

  // ==========================================================
  // PLACE SCHEMA
  // ==========================================================

  const placeSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "Place",

    "@id":
      `${canonicalUrl}#place`,

    name:
      locationName,

    url:
      canonicalUrl,

    description:
      locationDescription,

    ...(locationImage
      ? {
          image:
            locationImage,
        }
      : {}),
  };

  // ==========================================================
  // WEB PAGE SCHEMA
  // ==========================================================

  const webPageSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "WebPage",

    "@id":
      `${canonicalUrl}#webpage`,

    url:
      canonicalUrl,

    name:
      `Luxury Properties in ${seoLocationName}`,

    headline:
      `Luxury Properties in ${seoLocationName}`,

    description:
      `${locationDescription}${developerDescription}`,

    inLanguage:
      "en-IN",

    isPartOf: {
      "@type":
        "WebSite",

      "@id":
        `${SITE_URL}/#website`,

      name:
        "Property Bouquet",

      url:
        SITE_URL,
    },

    about: {
      "@id":
        `${canonicalUrl}#place`,
    },

    mainEntity: {
      "@id":
        `${canonicalUrl}#place`,
    },
  };

  // ==========================================================
  // BREADCRUMB SCHEMA
  // ==========================================================

  const breadcrumbItems = [
    {
      "@type":
        "ListItem",

      position:
        1,

      name:
        "Home",

      item:
        SITE_URL,
    },

    {
      "@type":
        "ListItem",

      position:
        2,

      name:
        "Locations",

      item:
        `${SITE_URL}/locations`,
    },
  ];

  // ==========================================================
  // ADD LOCATION HIERARCHY
  // ==========================================================

  if (
    locationHierarchy.length > 1
  ) {
    const reversedHierarchy =
      [...locationHierarchy]
        .reverse();

    reversedHierarchy.forEach(
      (
        hierarchyName,
        index
      ) => {
        const isCurrent =
          index ===
          reversedHierarchy.length - 1;

        breadcrumbItems.push({
          "@type":
            "ListItem",

          position:
            breadcrumbItems.length + 1,

          name:
            hierarchyName,

          ...(isCurrent
            ? {
                item:
                  canonicalUrl,
              }
            : {}),
        });
      }
    );
  } else {
    breadcrumbItems.push({
      "@type":
        "ListItem",

      position:
        3,

      name:
        seoLocationName,

      item:
        canonicalUrl,
    });
  }

  const breadcrumbSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement:
      breadcrumbItems,
  };

  // ==========================================================
  // PROJECT ITEM LIST
  // ==========================================================

  const projectItems =
    properties
      .slice(0, 50)
      .map(
        (
          property,
          index
        ) => {
          const propertySlug =
            cleanText(
              property?.slug
            );

          const propertyTitle =
            cleanText(
              property
                ?.coreDetails
                ?.title
            ) ||
            "Luxury Property";

          if (!propertySlug) {
            return null;
          }

          const propertyUrl =
            buildPropertyUrl(
              propertySlug
            );

          const heroImage =
            property
              ?.media
              ?.heroImageUrl;

          return {
            "@type":
              "ListItem",

            position:
              index + 1,

            name:
              propertyTitle,

            url:
              propertyUrl,

            item: {
              "@type":
                "RealEstateListing",

              "@id":
                `${propertyUrl}#listing`,

              name:
                propertyTitle,

              url:
                propertyUrl,

              ...(heroImage
                ? {
                    image:
                      heroImage,
                  }
                : {}),
            },
          };
        }
      )
      .filter(Boolean);

  // ==========================================================
  // COLLECTION PAGE SCHEMA
  // ==========================================================

  const collectionSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "CollectionPage",

    "@id":
      `${canonicalUrl}#collection`,

    url:
      canonicalUrl,

    name:
      `Luxury Properties in ${seoLocationName}`,

    headline:
      `Luxury Properties in ${seoLocationName}`,

    description:
      `Explore luxury properties and real estate projects in ${seoLocationName} on Property Bouquet.${developerDescription}`,

    inLanguage:
      "en-IN",

    isPartOf: {
      "@type":
        "WebSite",

      "@id":
        `${SITE_URL}/#website`,

      name:
        "Property Bouquet",

      url:
        SITE_URL,
    },

    about: {
      "@id":
        `${canonicalUrl}#place`,
    },

    mainEntity: {
      "@type":
        "ItemList",

      "@id":
        `${canonicalUrl}#projects`,

      numberOfItems:
        projectItems.length,

      itemListElement:
        projectItems,
    },

    ...(locationHierarchy.length > 0
      ? {
          spatialCoverage: {
            "@type":
              "Place",

            name:
              locationHierarchy.join(
                ", "
              ),
          },
        }
      : {}),
  };

  // ==========================================================
  // RETURN SERVER HTML
  // ==========================================================

  return (
    <>
      {/* ======================================================
          PLACE JSON-LD
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            safeJsonLd(
              placeSchema
            ),
        }}
      />

      {/* ======================================================
          WEB PAGE JSON-LD
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            safeJsonLd(
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
          __html:
            safeJsonLd(
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
          __html:
            safeJsonLd(
              collectionSchema
            ),
        }}
      />

      {/* ======================================================
          CLIENT UI
      ====================================================== */}

      <LocationSlugClient
        location={location}
        properties={properties}
        slug={backendSlug}
      />
    </>
  );
}

