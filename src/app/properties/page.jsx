import { Suspense } from "react";
import PropertiesClient from "./PropertiesClient";

const SITE_URL = "https://propertybouquet.com";
const API = "https://propertybouquet.com/api";

// ============================================================
// CANONICAL MAPPING FOR PROPERTY FILTER URLS
// Keep dedicated SEO landing pages as the preferred URLs.
// ============================================================

const LOCATION_CANONICALS = {
  "sector 63a": "/locations/properties-in-sector-63a-gurgaon",
  "golf course road": "/locations/properties-on-golf-course-road-gurgaon",
  "sohna": "/locations/properties-in-sohna-gurgaon",

  // Supplied destination. A dedicated New Gurgaon page would be
  // preferable if it is created later and has equivalent content.
  "new gurgaon": "/locations/properties-in-gurgaon",

  "sector 58": "/locations/properties-in-sector-58-gurgaon",
  "southern peripheral road": "/locations/properties-in-spr-gurgaon",
  "golf course extension road": "/locations/properties-on-golf-course-extension-road-gurgaon",
};

const INDEXABLE_PROPERTY_TYPES = new Set(["commercial", "plots"]);

const TRACKING_QUERY_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
]);

function normalizeLocationFilter(value) {
  if (typeof value !== "string") return "";

  return value
    .replace(/\+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getPropertiesMetadataConfig(searchParams = {}) {
  const meaningfulEntries = Object.entries(searchParams || {}).filter(
    ([key, value]) => {
      if (TRACKING_QUERY_PARAMS.has(key.toLowerCase())) {
        return false;
      }

      if (Array.isArray(value)) {
        return value.some((item) => String(item ?? "").trim() !== "");
      }

      return value !== undefined && value !== null && String(value).trim() !== "";
    }
  );

  // Main /properties URL, including tracking-only query parameters.
  if (meaningfulEntries.length === 0) {
    return {
      canonicalUrl: `${SITE_URL}/properties`,
      index: true,
      isDefaultView: true,
    };
  }

  // Only map a single, exact location filter to its dedicated landing page.
  if (meaningfulEntries.length === 1) {
    const [rawKey, rawValue] = meaningfulEntries[0];
    const key = rawKey.toLowerCase();
    const value = Array.isArray(rawValue)
      ? rawValue.length === 1
        ? rawValue[0]
        : null
      : rawValue;

    if (key === "location" && typeof value === "string") {
      const location = normalizeLocationFilter(value);
      const landingPage = LOCATION_CANONICALS[location];

      if (landingPage) {
        return {
          canonicalUrl: `${SITE_URL}${landingPage}`,
          index: true,
          isDefaultView: false,
        };
      }
    }

    // Keep the commercial and plots category URLs indexable because
    // they are used as destinations by the existing redirect setup.
    if (key === "propertytype" && typeof value === "string") {
      const propertyType = value.trim().toLowerCase();

      if (INDEXABLE_PROPERTY_TYPES.has(propertyType)) {
        return {
          canonicalUrl: `${SITE_URL}/properties?propertyType=${encodeURIComponent(propertyType)}`,
          index: true,
          isDefaultView: false,
        };
      }
    }
  }

  // Free-text search, placeholders, unknown filters and combinations
  // should remain usable for visitors but should not be indexed.
  // No canonical is emitted for these URLs because they may represent
  // materially different filtered results.
  return {
    canonicalUrl: null,
    index: false,
    isDefaultView: false,
  };
}

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

export async function generateMetadata({ searchParams }) {
  const params = (await searchParams) || {};
  const metadataConfig = getPropertiesMetadataConfig(params);

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

    ...(metadataConfig.canonicalUrl
      ? {
          alternates: {
            canonical: metadataConfig.canonicalUrl,
          },
        }
      : {}),

    // ========================================================
    // ROBOTS
    // ========================================================

    robots: {
      index: metadataConfig.index,
      follow: true,

      googleBot: {
        index: metadataConfig.index,
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
        metadataConfig.canonicalUrl || `${SITE_URL}/properties`,

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

export default async function Page({ searchParams }) {
  const params = (await searchParams) || {};
  const metadataConfig = getPropertiesMetadataConfig(params);
  const showDefaultCollectionSchemas = metadataConfig.isDefaultView;

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

      {showDefaultCollectionSchemas && (
        <>
          {/* ======================================================
              COLLECTION PAGE SCHEMA
              Only output this for the unfiltered /properties page.
              Filtered client-side results are not the same as the
              complete server-fetched collection in this file.
          ====================================================== */}

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: safeJsonLd(collectionSchema),
            }}
          />

          {/* ======================================================
              BREADCRUMB SCHEMA
          ====================================================== */}

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: safeJsonLd(breadcrumbSchema),
            }}
          />
        </>
      )}

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