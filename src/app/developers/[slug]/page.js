import { notFound, permanentRedirect } from "next/navigation";

import DeveloperSlugClient from "./DeveloperSlugClient";

const SITE_URL = "https://propertybouquet.com";
const API = "https://propertybouquet.com";

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

function truncateDescription(
  text,
  maxLength = 160
) {
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
// m3m
// → m3m-developer-projects
//
// signature-global
// → signature-global-developer-projects
//
// spiti-developer
// → spiti-developer-projects
//
// spiti-developers
// → spiti-developers-projects
//
// ============================================================

function buildPublicDeveloperSlug(
  developerSlug
) {
  if (!developerSlug) {
    return "";
  }

  const cleanSlug = String(developerSlug)
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  if (!cleanSlug) {
    return "";
  }

  // Already complete public slug
  if (
    cleanSlug.endsWith(
      "-developer-projects"
    ) ||
    cleanSlug.endsWith(
      "-developers-projects"
    )
  ) {
    return cleanSlug;
  }

  // Backend slug already ends with
  // "-developer"
  if (
    cleanSlug.endsWith(
      "-developer"
    )
  ) {
    return `${cleanSlug}-projects`;
  }

  // Backend slug already ends with
  // "-developers"
  if (
    cleanSlug.endsWith(
      "-developers"
    )
  ) {
    return `${cleanSlug}-projects`;
  }

  // Normal backend slug
  return `${cleanSlug}-developer-projects`;
}

// ============================================================
// VALIDATE PUBLIC URL
// ============================================================
//
// Valid:
//
// /developers/m3m-developer-projects
// /developers/signature-global-developer-projects
// /developers/spiti-developer-projects
// /developers/spiti-developers-projects
//
// ============================================================

function isValidPublicDeveloperSlug(
  slug
) {
  if (!slug) {
    return false;
  }

  const cleanSlug = String(slug)
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  return (
    cleanSlug.length > 0 &&
    (
      cleanSlug.endsWith(
        "-developer-projects"
      ) ||
      cleanSlug.endsWith(
        "-developers-projects"
      )
    )
  );
}

// ============================================================
// DEVELOPER NAME → SEO DISPLAY NAME
// ============================================================
//
// M3M
// → M3M Developer
//
// Signature Global
// → Signature Global Developer
//
// Spiti Developer
// → Spiti Developer
//
// Spiti Developer Developer
// → Spiti Developer
//
// ============================================================

function getSeoDeveloperName(
  developerName
) {
  const cleanName =
    cleanText(developerName);

  if (!cleanName) {
    return "Real Estate Developer";
  }

  const baseName = cleanName
    .replace(
      /(?:\s+developer)+$/i,
      ""
    )
    .trim();

  if (!baseName) {
    return "Developer";
  }

  return `${baseName} Developer`;
}

// ============================================================
// PUBLIC DEVELOPER URL
// ============================================================

function buildDeveloperUrl(
  developerSlug
) {
  const publicSlug =
    buildPublicDeveloperSlug(
      developerSlug
    );

  return `${SITE_URL}/developers/${encodeURIComponent(
    publicSlug
  )}`;
}

// ============================================================
// PROPERTY URL
// ============================================================

function buildPropertyUrl(slug) {
  return `${SITE_URL}/${encodeURIComponent(
    slug
  )}`;
}

// ============================================================
// FETCH DEVELOPER DATA
// ============================================================
//
// IMPORTANT:
//
// The frontend now asks the backend to resolve the
// public SEO slug directly.
//
// Example:
//
// /developers/m3m-developer-projects
//
// ↓
//
// /api/developers/public/m3m-developer-projects
//
// ============================================================

async function getDeveloper(
  publicSlug
) {
  if (!publicSlug) {
    return null;
  }

  try {
    // ========================================================
    // STRICT PUBLIC URL VALIDATION
    // ========================================================

    if (
      !isValidPublicDeveloperSlug(
        publicSlug
      )
    ) {
      console.warn(
        `Rejected old/invalid developer URL: "${publicSlug}"`
      );

      return {
        invalid: true,
      };
    }

    const cleanPublicSlug =
      String(publicSlug)
        .trim()
        .toLowerCase()
        .replace(
          /^\/+|\/+$/g,
          ""
        );

    // ========================================================
    // PUBLIC API
    // ========================================================

    const res = await fetch(
      `${API}/api/developers/public/${encodeURIComponent(
        cleanPublicSlug
      )}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    // ========================================================
    // NOT FOUND
    // ========================================================

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      console.error(
        `Developer public API returned ${res.status} for "${cleanPublicSlug}"`
      );

      return null;
    }

    const data =
      await res.json();

    if (!data?.developer) {
      return null;
    }

    // ========================================================
    // ONLY PUBLISHED + NON-DELETED PROPERTIES
    // ========================================================

    const publishedProperties =
      Array.isArray(
        data.properties
      )
        ? data.properties.filter(
            (property) =>
              property?.status ===
                "published" &&
              property?.isDeleted !==
                true &&
              property?.deletedFromStatus !==
                "trash"
          )
        : [];

    // ========================================================
    // BACKEND SLUG
    // ========================================================

    const backendSlug =
      data.backendSlug ||
      data.developer?.slug ||
      "";

    // ========================================================
    // CANONICAL PUBLIC SLUG
    // ========================================================

    const publicCanonicalSlug =
      data.publicSlug ||
      buildPublicDeveloperSlug(
        backendSlug
      );

    // ========================================================
    // RETURN
    // ========================================================

    return {
      developer:
        data.developer,

      properties:
        publishedProperties,

      backendSlug,

      publicSlug:
        publicCanonicalSlug,
    };
  } catch (error) {
    console.error(
      `Developer data fetch error for public slug "${publicSlug}":`,
      error
    );

    return null;
  }
}

// ============================================================
// GET PROJECT LOCATION NAMES
// ============================================================

function getPropertyLocation(
  property
) {
  const locations = [];

  const locationData =
    property?.locationData;

  // ----------------------------------------------------------
  // Main location
  // ----------------------------------------------------------

  if (
    locationData?.locationName
  ) {
    locations.push(
      cleanText(
        locationData.locationName
      )
    );
  }

  // ----------------------------------------------------------
  // Custom location
  // ----------------------------------------------------------

  if (
    locationData?.customLocation
  ) {
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
// DEVELOPER LOCATION SUMMARY
// ============================================================

function getDeveloperLocations(
  properties
) {
  const locations = [];

  for (
    const property of properties
  ) {
    const propertyLocations =
      getPropertyLocation(
        property
      );

    for (
      const location of propertyLocations
    ) {
      if (
        !locations.some(
          (existing) =>
            existing.toLowerCase() ===
            location.toLowerCase()
        )
      ) {
        locations.push(
          location
        );
      }
    }
  }

  return locations.slice(
    0,
    10
  );
}

// ============================================================
// GET PROJECT NAMES
// ============================================================

function getProjectNames(
  properties
) {
  return properties
    .map((property) =>
      cleanText(
        property?.coreDetails
          ?.title
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
  const { slug } =
    await params;

  // ==========================================================
  // OLD / INVALID URL
  // ==========================================================

  if (
    !isValidPublicDeveloperSlug(
      slug
    )
  ) {
    // Try to determine whether this is an
    // old backend slug so we can redirect it.
    //
    // Example:
    // /developers/m3m
    //
    // → /developers/m3m-developer-projects
    //
    if (slug) {
      try {
        const cleanSlug =
          String(slug)
            .trim()
            .toLowerCase()
            .replace(
              /^\/+|\/+$/g,
              ""
            );

        const res =
          await fetch(
            `${API}/api/developers/${encodeURIComponent(
              cleanSlug
            )}`,
            {
              next: {
                revalidate: 300,
              },
            }
          );

        if (res.ok) {
          const data =
            await res.json();

          if (data?.developer) {
            const publicSlug =
              buildPublicDeveloperSlug(
                data.developer.slug
              );

            permanentRedirect(
              `/developers/${encodeURIComponent(
                publicSlug
              )}`
            );
          }
        }
      } catch (error) {
        console.error(
          "Old developer URL redirect lookup error:",
          error
        );
      }
    }

    return {
      metadataBase:
        new URL(SITE_URL),

      title:
        "Developer Not Found | Property Bouquet",

      description:
        "The requested real estate developer could not be found on Property Bouquet.",

      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const data =
    await getDeveloper(slug);

  // ==========================================================
  // 404 METADATA
  // ==========================================================

  if (!data?.developer) {
    return {
      metadataBase:
        new URL(SITE_URL),

      title:
        "Developer Not Found | Property Bouquet",

      description:
        "The requested real estate developer could not be found on Property Bouquet.",

      robots: {
        index: false,
        follow: true,
      },
    };
  }

  // ==========================================================
  // DEVELOPER DATA
  // ==========================================================

  const developer =
    data.developer;

  const properties =
    data.properties || [];

  const publicSlug =
    data.publicSlug ||
    buildPublicDeveloperSlug(
      data.backendSlug
    );

  // ==========================================================
  // DEVELOPER NAME
  // ==========================================================

  const developerName =
    cleanText(
      developer?.name
    ) ||
    "Real Estate Developer";

  const seoDeveloperName =
    getSeoDeveloperName(
      developerName
    );

  // ==========================================================
  // PROJECT DATA
  // ==========================================================

  const projectNames =
    getProjectNames(
      properties
    );

  const locations =
    getDeveloperLocations(
      properties
    );

  const projectCount =
    properties.length;

  const projectCountText =
    projectCount === 1
      ? "1 project"
      : `${projectCount} projects`;

  // ==========================================================
  // LOCATION PHRASE
  // ==========================================================

  let locationPhrase = "";

  if (locations.length === 1) {
    locationPhrase =
      ` in ${locations[0]}`;
  } else if (
    locations.length === 2
  ) {
    locationPhrase =
      ` in ${locations[0]} and ${locations[1]}`;
  } else if (
    locations.length > 2
  ) {
    locationPhrase =
      ` across ${locations
        .slice(0, 3)
        .join(", ")}`;
  }

  // ==========================================================
  // PRIMARY SEO TITLE
  // ==========================================================

  const title =
    `${seoDeveloperName}: All Projects | Residential & Commercial`;

  // ==========================================================
  // SEO DESCRIPTION
  // ==========================================================

  let description =
    `Explore ${seoDeveloperName} projects on Property Bouquet. Browse all ${projectCountText} with residential and commercial properties, prices, floor plans, amenities, locations and detailed project information`;

  if (locationPhrase) {
    description +=
      locationPhrase;
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
    `${SITE_URL}/developers/${encodeURIComponent(
      publicSlug
    )}`;

  // ==========================================================
  // DEVELOPER IMAGE
  // ==========================================================

  const developerImage =
    developer?.image ||
    developer?.logo ||
    `${SITE_URL}/og-image.jpg`;

  // ==========================================================
  // KEYWORDS
  // ==========================================================

  const keywords = [
    `${developerName} developer`,
    `${developerName} projects`,
    `${developerName} properties`,
    `${developerName} real estate`,

    `${seoDeveloperName} projects`,
    `${seoDeveloperName} properties`,
    `${seoDeveloperName} real estate`,

    `${developerName} residential projects`,
    `${developerName} residential properties`,
    `${developerName} apartments`,
    `${developerName} flats`,
    `${developerName} villas`,
    `${developerName} plots`,

    `${developerName} commercial projects`,
    `${developerName} commercial properties`,
    `${developerName} commercial real estate`,

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

    ...projectNames.slice(
      0,
      15
    ),

    "developer projects",
    "real estate developer projects",
    "residential and commercial projects",
    "luxury real estate developers",
    "property developers",
    "real estate projects",

    "Property Bouquet",
    "Property Bouquet developers",
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
        noimageindex: false,
        "max-image-preview":
          "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonicalUrl,
      siteName:
        "Property Bouquet",
      title,
      description:
        metaDescription,

      images: [
        {
          url:
            developerImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title,

      description:
        metaDescription,

      images: [
        developerImage,
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

export default async function DeveloperSlugPage({
  params,
}) {
  const { slug } =
    await params;

  // ==========================================================
  // OLD BACKEND SLUG → PUBLIC SEO URL
  // ==========================================================

  if (
    !isValidPublicDeveloperSlug(
      slug
    )
  ) {
    if (slug) {
      try {
        const cleanSlug =
          String(slug)
            .trim()
            .toLowerCase()
            .replace(
              /^\/+|\/+$/g,
              ""
            );

        const res =
          await fetch(
            `${API}/api/developers/${encodeURIComponent(
              cleanSlug
            )}`,
            {
              next: {
                revalidate: 300,
              },
            }
          );

        if (res.ok) {
          const data =
            await res.json();

          if (data?.developer) {
            const publicSlug =
              buildPublicDeveloperSlug(
                data.developer.slug
              );

            permanentRedirect(
              `/developers/${encodeURIComponent(
                publicSlug
              )}`
            );
          }
        }
      } catch (error) {
        console.error(
          "Old developer URL redirect error:",
          error
        );
      }
    }

    notFound();
  }

  // ==========================================================
  // SERVER-SIDE PUBLIC SLUG FETCH
  // ==========================================================

  const data =
    await getDeveloper(slug);

  // ==========================================================
  // REAL 404
  // ==========================================================

  if (!data?.developer) {
    notFound();
  }

  // ==========================================================
  // BASIC DATA
  // ==========================================================

  const developer =
    data.developer;

  const properties =
    data.properties || [];

  const publicSlug =
    data.publicSlug ||
    buildPublicDeveloperSlug(
      data.backendSlug
    );

  // ==========================================================
  // DEVELOPER NAME
  // ==========================================================

  const developerName =
    cleanText(
      developer?.name
    ) ||
    "Luxury Real Estate Developer";

  const seoDeveloperName =
    getSeoDeveloperName(
      developerName
    );

  // ==========================================================
  // PUBLIC CANONICAL URL
  // ==========================================================

  const canonicalUrl =
    `${SITE_URL}/developers/${encodeURIComponent(
      publicSlug
    )}`;

  // ==========================================================
  // DEVELOPER DESCRIPTION
  // ==========================================================

  const developerDescription =
    cleanText(
      developer?.description
    ) ||
    `Explore premium real estate projects and luxury properties by ${seoDeveloperName} on Property Bouquet.`;

  // ==========================================================
  // DEVELOPER IMAGE
  // ==========================================================

  const developerImage =
    developer?.image ||
    developer?.logo ||
    `${SITE_URL}/og-image.jpg`;

  // ==========================================================
  // LOCATIONS
  // ==========================================================

  const locations =
    getDeveloperLocations(
      properties
    );

  // ==========================================================
  // DYNAMIC LOCATION DESCRIPTION
  // ==========================================================

  let locationDescription = "";

  if (locations.length === 1) {
    locationDescription =
      ` Projects are available in ${locations[0]}.`;
  } else if (
    locations.length === 2
  ) {
    locationDescription =
      ` Projects are available in ${locations[0]} and ${locations[1]}.`;
  } else if (
    locations.length > 2
  ) {
    locationDescription =
      ` Projects are available across ${locations
        .slice(0, 5)
        .join(", ")}.`;
  }

  // ==========================================================
  // DEVELOPER ORGANIZATION SCHEMA
  // ==========================================================

  const developerSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "Organization",

    "@id":
      `${canonicalUrl}#organization`,

    name:
      developerName,

    url:
      canonicalUrl,

    description:
      developerDescription,

    ...(developer?.logo
      ? {
          logo: {
            "@type":
              "ImageObject",

            url:
              developer.logo,
          },
        }
      : {}),

    ...(developer?.image
      ? {
          image: {
            "@type":
              "ImageObject",

            url:
              developer.image,
          },
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
      `${seoDeveloperName} Projects & Properties`,

    headline:
      `${seoDeveloperName} Projects & Properties`,

    description:
      `${developerDescription}${locationDescription}`,

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
        `${canonicalUrl}#organization`,
    },

    mainEntity: {
      "@id":
        `${canonicalUrl}#organization`,
    },
  };

  // ==========================================================
  // BREADCRUMB SCHEMA
  // ==========================================================

  const breadcrumbSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement: [
      {
        "@type":
          "ListItem",

        position: 1,

        name:
          "Home",

        item:
          SITE_URL,
      },

      {
        "@type":
          "ListItem",

        position: 2,

        name:
          "Developers",

        item:
          `${SITE_URL}/developers`,
      },

      {
        "@type":
          "ListItem",

        position: 3,

        name:
          seoDeveloperName,

        item:
          canonicalUrl,
      },
    ],
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
      `${seoDeveloperName} Projects and Properties`,

    headline:
      `${seoDeveloperName} Projects and Properties`,

    description:
      `Explore ${seoDeveloperName} projects and properties on Property Bouquet.${locationDescription}`,

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
        `${canonicalUrl}#organization`,
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

    ...(locations.length > 0
      ? {
          spatialCoverage:
            locations.map(
              (location) => ({
                "@type":
                  "Place",

                name:
                  location,
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
          __html:
            safeJsonLd(
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

      <DeveloperSlugClient
        developer={developer}
        properties={properties}
        slug={publicSlug}
      />
    </>
  );
}