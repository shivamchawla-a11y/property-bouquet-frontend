import { Suspense } from "react";
import PropertiesClient from "./PropertiesClient";

const SITE_URL = "https://propertybouquet.com";
const API = "https://propertybouquet.com/api";

// ============================================================
// FETCH PUBLISHED PROPERTIES FOR SEO
// ============================================================

async function getPublishedProperties() {
  try {
    const res = await fetch(`${API}/properties`, {
      next: {
        revalidate: 300,
      },
    });

    if (!res.ok) {
      console.error(
        "Properties SEO fetch failed:",
        res.status
      );

      return [];
    }

    const data = await res.json();

    const properties = Array.isArray(data?.data)
      ? data.data
      : [];

    return properties.filter(
      (property) =>
        property?.status === "published" &&
        property?.isDeleted !== true &&
        property?.deletedFromStatus !== "trash"
    );
  } catch (error) {
    console.error(
      "Properties SEO fetch error:",
      error
    );

    return [];
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

// ============================================================
// LOCATION HELPERS
// ============================================================

function getPropertyLocations(property) {
  const locations = [];

  const locationData =
    property?.locationData;

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

  let current =
    locationData?.locationRef;

  while (current) {
    const name = cleanText(current?.name);

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

    current = current?.parent;
  }

  return locations.filter(Boolean);
}

// ============================================================
// UNIQUE LOCATIONS
// ============================================================

function getUniqueLocations(properties) {
  const locations = [];

  for (const property of properties) {
    const propertyLocations =
      getPropertyLocations(property);

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
// METADATA
// ============================================================

export async function generateMetadata() {
  const title =
    "Luxury Properties, Apartments, Villas & Plots | Property Bouquet";

  const description =
    "Discover luxury properties, apartments, villas and plots on Property Bouquet. Explore premium real estate projects with prices, floor plans, amenities, locations and trusted developer details.";

  return {
    metadataBase:
      new URL(SITE_URL),

    // ========================================================
    // PRIMARY SEO
    // ========================================================

    title,

    description,

    // ========================================================
    // KEYWORDS
    // ========================================================

    keywords: [
      "luxury properties",
      "properties for sale",
      "luxury real estate",
      "premium properties",
      "apartments for sale",
      "luxury apartments",
      "flats for sale",
      "villas for sale",
      "luxury villas",
      "plots for sale",
      "residential plots",
      "real estate projects",
      "residential projects",
      "property prices",
      "property floor plans",
      "property amenities",
      "property developers",
      "premium real estate",
      "luxury homes",
      "Property Bouquet",
    ],

    // ========================================================
    // BRAND
    // ========================================================

    applicationName:
      "Property Bouquet",

    // ========================================================
    // CANONICAL
    // ========================================================

    alternates: {
      canonical:
        `${SITE_URL}/properties`,
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
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    // ========================================================
    // OPEN GRAPH
    // ========================================================

    openGraph: {
      type: "website",

      locale: "en_IN",

      url:
        `${SITE_URL}/properties`,

      siteName:
        "Property Bouquet",

      title,

      description,

      images: [
        {
          url:
            `${SITE_URL}/og-image.jpg`,

          width: 1200,

          height: 630,

          alt:
            "Luxury Properties, Apartments, Villas and Plots - Property Bouquet",
        },
      ],
    },

    // ========================================================
    // TWITTER
    // ========================================================

    twitter: {
      card:
        "summary_large_image",

      title,

      description,

      images: [
        `${SITE_URL}/og-image.jpg`,
      ],
    },
  };
}

// ============================================================
// SAFE JSON-LD
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

export default async function Page() {
  const properties =
    await getPublishedProperties();

  const canonicalUrl =
    `${SITE_URL}/properties`;

  const locations =
    getUniqueLocations(properties);

  // ==========================================================
  // BREADCRUMB SCHEMA
  // ==========================================================

  const breadcrumbSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    "@id":
      `${canonicalUrl}#breadcrumb`,

    itemListElement: [
      {
        "@type":
          "ListItem",

        position: 1,

        name: "Home",

        item: SITE_URL,
      },

      {
        "@type":
          "ListItem",

        position: 2,

        name: "Properties",

        item: canonicalUrl,
      },
    ],
  };

  // ==========================================================
  // PROPERTY ITEM LIST
  // ==========================================================

  const propertyItems = properties
    .slice(0, 50)
    .map((property, index) => {
      const slug =
        cleanText(property?.slug);

      const title =
        cleanText(
          property?.coreDetails?.title
        );

      if (!slug || !title) {
        return null;
      }

      const propertyUrl =
        `${SITE_URL}/${encodeURIComponent(slug)}`;

      const image =
        property?.media?.heroImageUrl;

      const description =
        cleanText(
          property?.overview?.description ||
            property?.heroSection
              ?.heroDescription ||
            `${title} property details, prices, floor plans, amenities and location.`
        );

      return {
        "@type":
          "ListItem",

        position:
          index + 1,

        name:
          title,

        url:
          propertyUrl,

        item: {
          "@type":
            "RealEstateListing",

          "@id":
            `${propertyUrl}#listing`,

          name:
            title,

          url:
            propertyUrl,

          description,

          ...(image
            ? {
                image,
              }
            : {}),

          ...(property?.coreDetails
            ?.startingPrice
            ? {
                offers: {
                  "@type":
                    "Offer",

                  url:
                    propertyUrl,

                  priceCurrency:
                    "INR",

                  price:
                    property.coreDetails
                      .startingPrice,

                  availability:
                    "https://schema.org/InStock",
                },
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
    "@context":
      "https://schema.org",

    "@type":
      "CollectionPage",

    "@id":
      `${canonicalUrl}#collection`,

    url:
      canonicalUrl,

    name:
      "Luxury Properties, Apartments, Villas & Plots",

    headline:
      "Luxury Properties, Apartments, Villas & Plots",

    description:
      "Discover luxury properties, apartments, villas and plots on Property Bouquet. Explore premium real estate projects with prices, floor plans, amenities, locations and developer details.",

    inLanguage:
      "en-IN",

    isPartOf: {
      "@type":
        "WebSite",

      "@id":
        `${SITE_URL}#website`,

      name:
        "Property Bouquet",

      url:
        SITE_URL,
    },

    about: {
      "@type":
        "Thing",

      name:
        "Luxury Real Estate Properties",
    },

    mainEntity: {
      "@type":
        "ItemList",

      "@id":
        `${canonicalUrl}#property-list`,

      name:
        "Available Properties",

      numberOfItems:
        propertyItems.length,

      itemListElement:
        propertyItems,
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
  // WEBSITE SCHEMA
  // ==========================================================

  const websiteSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "WebSite",

    "@id":
      `${SITE_URL}#website`,

    name:
      "Property Bouquet",

    url:
      SITE_URL,

    publisher: {
      "@type":
        "Organization",

      "@id":
        `${SITE_URL}#organization`,

      name:
        "Property Bouquet",

      url:
        SITE_URL,
    },
  };

  // ==========================================================
  // SERVER HTML
  // ==========================================================

  return (
    <>
      {/* ======================================================
          WEBSITE SCHEMA
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            safeJsonLd(
              websiteSchema
            ),
        }}
      />

      {/* ======================================================
          COLLECTION PAGE SCHEMA
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
          BREADCRUMB SCHEMA
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
          CLIENT PROPERTY UI
      ====================================================== */}

      <Suspense
        fallback={
          <div className="min-h-screen bg-[#f7f7f7]" />
        }
      >
        <PropertiesClient />
      </Suspense>
    </>
  );
}