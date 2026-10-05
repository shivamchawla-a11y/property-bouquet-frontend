import {
  notFound,
  permanentRedirect,
} from "next/navigation";

import DeveloperSlugClient from "./DeveloperSlugClient";

/* ============================================================
   SITE CONFIG
============================================================ */

const SITE_URL = "https://propertybouquet.com";
const API = "https://propertybouquet.com";

/* ============================================================
   TEXT HELPERS
============================================================ */

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

/* ============================================================
   ABSOLUTE URL HELPER
============================================================ */

function toAbsoluteUrl(value, fallback = "") {
  if (!value || typeof value !== "string") {
    return fallback;
  }

  const cleanValue = value.trim();

  if (!cleanValue) {
    return fallback;
  }

  if (
    cleanValue.startsWith("http://") ||
    cleanValue.startsWith("https://")
  ) {
    return cleanValue;
  }

  if (cleanValue.startsWith("//")) {
    return `https:${cleanValue}`;
  }

  if (cleanValue.startsWith("/")) {
    return `${SITE_URL}${cleanValue}`;
  }

  return cleanValue;
}

/* ============================================================
   PUBLIC DEVELOPER SLUG
============================================================ */

function cleanSlugValue(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
}

function buildPublicDeveloperSlug(developerSlug) {
  const cleanSlug = cleanSlugValue(
    developerSlug
  );

  if (!cleanSlug) {
    return "";
  }

  /*
   * Already complete public slug
   */
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

  /*
   * Backend slug already ends with -developer
   */
  if (
    cleanSlug.endsWith("-developer")
  ) {
    return `${cleanSlug}-projects`;
  }

  /*
   * Backend slug already ends with -developers
   */
  if (
    cleanSlug.endsWith("-developers")
  ) {
    return `${cleanSlug}-projects`;
  }

  /*
   * Normal backend slug
   */
  return `${cleanSlug}-developer-projects`;
}

/* ============================================================
   VALIDATE PUBLIC URL
============================================================ */

function isValidPublicDeveloperSlug(slug) {
  const cleanSlug = cleanSlugValue(slug);

  if (!cleanSlug) {
    return false;
  }

  return (
    cleanSlug.endsWith(
      "-developer-projects"
    ) ||
    cleanSlug.endsWith(
      "-developers-projects"
    )
  );
}

/* ============================================================
   DEVELOPER NAME → SEO DISPLAY NAME
============================================================ */

function getSeoDeveloperName(
  developerName
) {
  const cleanName = cleanText(
    developerName
  );

  if (!cleanName) {
    return "Real Estate Developer";
  }

  /*
   * Prevent:
   * "ABC Developer Developer"
   */
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

/* ============================================================
   PROPERTY URL
============================================================ */

function buildPropertyUrl(slug) {
  const cleanSlug = cleanText(slug);

  if (!cleanSlug) {
    return "";
  }

  return `${SITE_URL}/${encodeURIComponent(
    cleanSlug
  )}`;
}

/* ============================================================
   FETCH DEVELOPER DATA
============================================================ */

async function getDeveloper(
  publicSlug
) {
  if (!publicSlug) {
    return null;
  }

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
    cleanSlugValue(publicSlug);

  try {
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

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      console.error(
        `Developer public API returned ${res.status} for "${cleanPublicSlug}"`
      );

      return null;
    }

    const data = await res.json();

    if (!data?.developer) {
      return null;
    }

    /*
     * Only expose published, non-deleted properties.
     */
    const publishedProperties =
      Array.isArray(data.properties)
        ? data.properties.filter(
            (property) =>
              property?.status ===
                "published" &&
              property?.isDeleted !== true &&
              property?.deletedFromStatus !==
                "trash"
          )
        : [];

    const backendSlug =
      data.backendSlug ||
      data.developer?.slug ||
      "";

    const publicCanonicalSlug =
      data.publicSlug ||
      buildPublicDeveloperSlug(
        backendSlug
      );

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

/* ============================================================
   GET PROJECT LOCATION NAMES
============================================================ */

function getPropertyLocation(
  property
) {
  const locations = [];

  const locationData =
    property?.locationData;

  if (locationData?.locationName) {
    const locationName = cleanText(
      locationData.locationName
    );

    if (locationName) {
      locations.push(locationName);
    }
  }

  if (locationData?.customLocation) {
    const customLocation = cleanText(
      locationData.customLocation
    );

    if (
      customLocation &&
      !locations.some(
        (existing) =>
          existing.toLowerCase() ===
          customLocation.toLowerCase()
      )
    ) {
      locations.push(
        customLocation
      );
    }
  }

  let current =
    locationData?.locationRef;

  const visited = new Set();

  while (current) {
    const currentId =
      current?._id?.toString?.() ||
      current?.id?.toString?.() ||
      "";

    if (currentId) {
      if (visited.has(currentId)) {
        break;
      }

      visited.add(currentId);
    }

    if (current?.name) {
      const name = cleanText(
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

    current = current.parent;
  }

  return locations.filter(Boolean);
}

/* ============================================================
   DEVELOPER LOCATION SUMMARY
============================================================ */

function getDeveloperLocations(
  properties
) {
  const locations = [];
  const seen = new Set();

  for (const property of properties) {
    const propertyLocations =
      getPropertyLocation(
        property
      );

    for (const location of propertyLocations) {
      const normalized =
        location.toLowerCase();

      if (!seen.has(normalized)) {
        seen.add(normalized);
        locations.push(location);
      }

      if (locations.length >= 10) {
        return locations;
      }
    }
  }

  return locations;
}

/* ============================================================
   PROJECT NAMES
============================================================ */

function getProjectNames(
  properties
) {
  return properties
    .map((property) =>
      cleanText(
        property?.coreDetails?.title
      )
    )
    .filter(Boolean);
}

/* ============================================================
   SEO LOCATION PHRASE
============================================================ */

function buildLocationPhrase(
  locations
) {
  if (!Array.isArray(locations)) {
    return "";
  }

  if (locations.length === 1) {
    return ` in ${locations[0]}`;
  }

  if (locations.length === 2) {
    return ` in ${locations[0]} and ${locations[1]}`;
  }

  if (locations.length > 2) {
    return ` across ${locations
      .slice(0, 3)
      .join(", ")}`;
  }

  return "";
}

/* ============================================================
   OLD SLUG → PUBLIC SLUG REDIRECT
============================================================ */

async function redirectOldDeveloperSlug(
  slug
) {
  const cleanSlug =
    cleanSlugValue(slug);

  if (!cleanSlug) {
    return false;
  }

  try {
    const res = await fetch(
      `${API}/api/developers/${encodeURIComponent(
        cleanSlug
      )}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) {
      return false;
    }

    const data = await res.json();

    if (!data?.developer) {
      return false;
    }

    const publicSlug =
      buildPublicDeveloperSlug(
        data.developer.slug
      );

    if (!publicSlug) {
      return false;
    }

    permanentRedirect(
      `/developers/${encodeURIComponent(
        publicSlug
      )}`
    );
  } catch (error) {
    console.error(
      "Old developer URL redirect lookup error:",
      error
    );
  }

  return false;
}

/* ============================================================
   NOT FOUND METADATA
============================================================ */

function getNotFoundMetadata() {
  return {
    metadataBase: new URL(
      SITE_URL
    ),

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

/* ============================================================
   SEO METADATA
============================================================ */

export async function generateMetadata({
  params,
}) {
  const { slug } = await params;

  /*
   * OLD / INVALID URL
   */
  if (
    !isValidPublicDeveloperSlug(
      slug
    )
  ) {
    if (slug) {
      await redirectOldDeveloperSlug(
        slug
      );
    }

    return getNotFoundMetadata();
  }

  /*
   * FETCH PUBLIC DEVELOPER
   */
  const data =
    await getDeveloper(slug);

  if (!data?.developer) {
    return getNotFoundMetadata();
  }

  const developer =
    data.developer;

  const properties =
    data.properties || [];

  const pageContent =
    developer?.pageContent || {};

  const seo =
    pageContent?.seo || {};

  const hero =
    pageContent?.hero || {};

  const publicSlug =
    data.publicSlug ||
    buildPublicDeveloperSlug(
      data.backendSlug
    );

  /*
   * DEVELOPER NAME
   */
  const developerName =
    cleanText(
      developer?.name
    ) ||
    "Real Estate Developer";

  const seoDeveloperName =
    getSeoDeveloperName(
      developerName
    );

  /*
   * PROJECT DATA
   */
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

  /*
   * LOCATION PHRASE
   */
  const locationPhrase =
    buildLocationPhrase(
      locations
    );

  /*
   * DEFAULT TITLE
   */
  const defaultTitle =
    `${seoDeveloperName}: All Projects | Residential & Commercial`;

  /*
   * DEFAULT DESCRIPTION
   */
  let defaultDescription =
    `Explore ${seoDeveloperName} projects on Property Bouquet. Browse all ${projectCountText} with residential and commercial properties, prices, floor plans, amenities, locations and detailed project information`;

  if (locationPhrase) {
    defaultDescription +=
      locationPhrase;
  }

  defaultDescription += ".";

  /*
   * CMS SEO OVERRIDES
   */
  const title =
    cleanText(
      seo?.metaTitle
    ) ||
    cleanText(
      hero?.title
    ) ||
    defaultTitle;

  const rawDescription =
    cleanText(
      seo?.metaDescription
    ) ||
    cleanText(
      hero?.description
    ) ||
    cleanText(
      developer?.description
    ) ||
    defaultDescription;

  const metaDescription =
    truncateDescription(
      rawDescription,
      160
    );

  /*
   * CANONICAL
   */
  const canonicalUrl =
    `${SITE_URL}/developers/${encodeURIComponent(
      publicSlug
    )}`;

  /*
   * IMAGE
   *
   * Priority:
   * 1. CMS SEO OG image
   * 2. CMS hero image
   * 3. developer image
   * 4. developer logo
   * 5. site fallback
   */
  const developerImage =
    toAbsoluteUrl(
      seo?.ogImage ||
        hero?.image ||
        developer?.image ||
        developer?.logo,
      `${SITE_URL}/og-image.jpg`
    );

  /*
   * OG TITLE
   */
  const ogTitle =
    cleanText(
      seo?.ogTitle
    ) ||
    title;

  /*
   * OG DESCRIPTION
   */
  const ogDescription =
    truncateDescription(
      cleanText(
        seo?.ogDescription
      ) ||
        metaDescription,
      160
    );

  /*
   * KEYWORDS
   */
  const cmsKeywords = cleanText(
    seo?.keywords
  );

  const keywordArray =
    cmsKeywords
      ? cmsKeywords
          .split(",")
          .map((keyword) =>
            cleanText(keyword)
          )
          .filter(Boolean)
      : [];

  const keywords = Array.from(
    new Set([
      ...keywordArray,

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

      ...projectNames.slice(0, 15),

      "developer projects",
      "real estate developer projects",
      "residential and commercial projects",
      "luxury real estate developers",
      "property developers",
      "real estate projects",
      "Property Bouquet",
      "Property Bouquet developers",
    ])
  );

  /*
   * CANONICAL OVERRIDE
   *
   * The CMS canonical is accepted only if it is
   * an absolute URL. Otherwise the generated
   * canonical remains authoritative.
   */
  const cmsCanonical =
    toAbsoluteUrl(
      seo?.canonical
    );

  const finalCanonical =
    cmsCanonical &&
    cmsCanonical.startsWith(
      SITE_URL
    )
      ? cmsCanonical
      : canonicalUrl;

  return {
    metadataBase: new URL(
      SITE_URL
    ),

    title,

    description:
      metaDescription,

    keywords,

    applicationName:
      "Property Bouquet",

    alternates: {
      canonical:
        finalCanonical,
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
      url: finalCanonical,
      siteName:
        "Property Bouquet",

      title: ogTitle,

      description:
        ogDescription,

      images: [
        {
          url: developerImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title: ogTitle,

      description:
        ogDescription,

      images: [
        developerImage,
      ],
    },
  };
}

/* ============================================================
   JSON-LD SAFE STRINGIFY
============================================================ */

function safeJsonLd(data) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/* ============================================================
   FAQ SCHEMA
============================================================ */

function buildFaqSchema(
  pageContent
) {
  const faq =
    pageContent?.faq;

  if (
    !faq ||
    faq.enabled === false ||
    !Array.isArray(faq.items)
  ) {
    return null;
  }

  const questions =
    faq.items
      .map((item) => {
        const question =
          cleanText(
            item?.question
          );

        const answer =
          cleanText(
            item?.answer
          );

        if (
          !question ||
          !answer
        ) {
          return null;
        }

        return {
          "@type":
            "Question",

          name:
            question,

          acceptedAnswer: {
            "@type":
              "Answer",

            text:
              answer,
          },
        };
      })
      .filter(Boolean);

  if (
    questions.length === 0
  ) {
    return null;
  }

  return {
    "@context":
      "https://schema.org",

    "@type":
      "FAQPage",

    mainEntity:
      questions,
  };
}

/* ============================================================
   PAGE
============================================================ */

export default async function DeveloperSlugPage({
  params,
}) {
  const { slug } = await params;

  /* ==========================================================
     OLD BACKEND SLUG → PUBLIC SEO URL
  ========================================================== */

  if (
    !isValidPublicDeveloperSlug(
      slug
    )
  ) {
    if (slug) {
      await redirectOldDeveloperSlug(
        slug
      );
    }

    notFound();
  }

  /* ==========================================================
     PUBLIC SLUG FETCH
  ========================================================== */

  const data =
    await getDeveloper(slug);

  if (!data?.developer) {
    notFound();
  }

  /* ==========================================================
     BASIC DATA
  ========================================================== */

  const developer =
    data.developer;

  const properties =
    data.properties || [];

  const pageContent =
    developer?.pageContent || {};

  const publicSlug =
    data.publicSlug ||
    buildPublicDeveloperSlug(
      data.backendSlug
    );

  /* ==========================================================
     DEVELOPER NAME
  ========================================================== */

  const developerName =
    cleanText(
      developer?.name
    ) ||
    "Luxury Real Estate Developer";

  const seoDeveloperName =
    getSeoDeveloperName(
      developerName
    );

  /* ==========================================================
     CANONICAL URL
  ========================================================== */

  const canonicalUrl =
    `${SITE_URL}/developers/${encodeURIComponent(
      publicSlug
    )}`;

  /* ==========================================================
     DEVELOPER DESCRIPTION
  ========================================================== */

  const developerDescription =
    cleanText(
      developer?.description
    ) ||
    cleanText(
      pageContent?.hero?.description
    ) ||
    `Explore premium real estate projects and luxury properties by ${seoDeveloperName} on Property Bouquet.`;

  /* ==========================================================
     DEVELOPER IMAGE
  ========================================================== */

  const developerImage =
    toAbsoluteUrl(
      pageContent?.seo?.ogImage ||
        pageContent?.hero?.image ||
        developer?.image ||
        developer?.logo,
      `${SITE_URL}/og-image.jpg`
    );

  /* ==========================================================
     LOCATIONS
  ========================================================== */

  const locations =
    getDeveloperLocations(
      properties
    );

  /* ==========================================================
     LOCATION DESCRIPTION
  ========================================================== */

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

  /* ==========================================================
     ORGANIZATION SCHEMA
  ========================================================== */

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
              toAbsoluteUrl(
                developer.logo
              ),
          },
        }
      : {}),

    image: {
      "@type":
        "ImageObject",

      url:
        developerImage,
    },
  };

  /* ==========================================================
     WEBSITE SCHEMA REFERENCE
  ========================================================== */

  const websiteId =
    `${SITE_URL}/#website`;

  /* ==========================================================
     WEB PAGE SCHEMA
  ========================================================== */

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
        websiteId,

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

    primaryImageOfPage: {
      "@type":
        "ImageObject",

      url:
        developerImage,
    },
  };

  /* ==========================================================
     BREADCRUMB SCHEMA
  ========================================================== */

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

  /* ==========================================================
     PROJECT ITEM LIST
  ========================================================== */

  const projectItems =
    properties
      .slice(0, 50)
      .map(
        (property, index) => {
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
            toAbsoluteUrl(
              property
                ?.media
                ?.heroImageUrl
            );

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

  /* ==========================================================
     COLLECTION PAGE SCHEMA
  ========================================================== */

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
        websiteId,

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

  /* ==========================================================
     FAQ SCHEMA
  ========================================================== */

  const faqSchema =
    buildFaqSchema(
      pageContent
    );

  /* ==========================================================
     SERVER HTML
  ========================================================== */

  return (
    <>
      {/* ======================================================
          ORGANIZATION
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
          WEB PAGE
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
          BREADCRUMB
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
          COLLECTION / PROJECTS
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
          FAQ
      ====================================================== */}

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              safeJsonLd(
                faqSchema
              ),
          }}
        />
      )}

      {/* ======================================================
          CLIENT PAGE
      ====================================================== */}

      <DeveloperSlugClient
        developer={developer}
        properties={properties}
        slug={publicSlug}
      />
    </>
  );
}