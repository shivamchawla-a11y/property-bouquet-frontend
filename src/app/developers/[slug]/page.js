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

    const publishedProperties = Array.isArray(
      data.properties
    )
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

  const developerName =
    developer?.name?.trim() ||
    "Real Estate Developer";

  // ==========================================================
  // DEVELOPER DESCRIPTION
  // ==========================================================

  const rawDescription =
    developer?.description
      ?.replace(/\s+/g, " ")
      .trim();

  // We use the developer's actual description when available,
  // but make the metadata description search-intent focused.
  const description =
    rawDescription ||
    `Explore ${developerName} properties and residential projects in Gurgaon. View project details, prices, floor plans, locations and investment opportunities on Property Bouquet.`;

  // Keep meta description within an SEO-friendly length.
  const metaDescription =
    description.length > 160
      ? `${description.substring(0, 157).trim()}...`
      : description;

  // ==========================================================
  // TITLE
  // ==========================================================

  const title =
    `${developerName} Properties & Projects in Gurgaon | Property Bouquet`;

  // ==========================================================
  // CANONICAL
  // ==========================================================

  const canonicalUrl =
    `${SITE_URL}/developers/${encodeURIComponent(slug)}`;

  // ==========================================================
  // OG IMAGE
  // ==========================================================

  const developerImage =
    developer?.image ||
    developer?.logo ||
    `${SITE_URL}/og-image.jpg`;

  // ==========================================================
  // DEVELOPER-SPECIFIC KEYWORDS
  // ==========================================================

  const keywords = [
    // Primary
    `${developerName} properties`,
    `${developerName} projects`,
    `${developerName} Gurgaon`,

    // Residential intent
    `${developerName} residential projects`,
    `${developerName} residential properties`,
    `${developerName} apartments`,
    `${developerName} flats`,

    // Commercial / broader project intent
    `${developerName} new projects`,
    `${developerName} upcoming projects`,
    `${developerName} luxury projects`,

    // Buyer research intent
    `${developerName} property price`,
    `${developerName} project price`,
    `${developerName} floor plans`,
    `${developerName} project details`,

    // Location intent
    `${developerName} properties in Gurgaon`,
    `${developerName} projects in Gurgaon`,
    `${developerName} properties in Gurugram`,
    `${developerName} projects in Gurugram`,

    // Brand / platform
    `${developerName} Property Bouquet`,
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

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
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
          alt: `${developerName} Properties & Projects - Property Bouquet`,
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
  return JSON.stringify(data).replace(/</g, "\\u003c");
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
    developer?.name?.trim() ||
    "Luxury Real Estate Developer";

  const canonicalUrl =
    `${SITE_URL}/developers/${encodeURIComponent(slug)}`;

  const developerDescription =
    developer?.description
      ?.replace(/\s+/g, " ")
      .trim() ||
    `Explore premium real estate projects and luxury properties by ${developerName} on Property Bouquet.`;

  const developerImage =
    developer?.image ||
    developer?.logo ||
    `${SITE_URL}/og-image.jpg`;

  // ==========================================================
  // DEVELOPER SCHEMA
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
          image: developer.image,
        }
      : {}),

    memberOf: {
      "@type": "Organization",

      name: "Property Bouquet",

      url: SITE_URL,
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
  // COLLECTION PAGE SCHEMA
  // ==========================================================

  const collectionSchema = {
    "@context": "https://schema.org",

    "@type": "CollectionPage",

    "@id": `${canonicalUrl}#collection`,

    url: canonicalUrl,

    name: `${developerName} Properties`,

    description: developerDescription,

    isPartOf: {
      "@type": "WebSite",

      name: "Property Bouquet",

      url: SITE_URL,
    },

    about: {
      "@type": "Organization",

      name: developerName,

      url: canonicalUrl,
    },

    mainEntity: {
      "@type": "ItemList",

      numberOfItems: properties.length,

      itemListElement: properties
        .slice(0, 50)
        .map((property, index) => ({
          "@type": "ListItem",

          position: index + 1,

          url: `${SITE_URL}/${property.slug}`,

          name:
            property?.coreDetails?.title ||
            "Luxury Property",

          ...(property?.media?.heroImageUrl
            ? {
                image:
                  property.media.heroImageUrl,
              }
            : {}),
        })),
    },
  };

  // ==========================================================
  // RETURN SERVER HTML
  // ==========================================================

  return (
    <>
      {/* ======================================================
          DEVELOPER JSON-LD
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
          COLLECTION PAGE JSON-LD
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