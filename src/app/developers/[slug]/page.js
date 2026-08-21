import { notFound } from "next/navigation";
import DeveloperSlugClient from "./DeveloperSlugClient";

const SITE_URL = "https://propertybouquet.com";

// ============================================================
// BACKEND API
// ============================================================
// IMPORTANT:
// Keep BACKEND_API_URL in your .env.production as:
// BACKEND_API_URL=https://property-bouquet-backend.onrender.com/api
//
// We keep the Render URL as a fallback so the page still works
// if the environment variable has not been added yet.
// ============================================================

const API_BASE_URL =
  process.env.BACKEND_API_URL ||
  "https://property-bouquet-backend.onrender.com/api";

// ============================================================
// FETCH DEVELOPER DATA
// ============================================================

async function getDeveloper(slug) {
  if (!slug) return null;

  try {
    const response = await fetch(
      `${API_BASE_URL}/developers/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data?.developer) {
      return null;
    }

    const publishedProperties = (data.properties || []).filter(
      (property) =>
        property?.status === "published" &&
        property?.isDeleted !== true &&
        property?.deletedFromStatus !== "trash"
    );

    return {
      developer: data.developer,
      properties: publishedProperties,
    };
  } catch (error) {
    console.error(
      `Error fetching developer "${slug}":`,
      error
    );

    return null;
  }
}

// ============================================================
// GENERATE METADATA
// ============================================================

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const data = await getDeveloper(slug);

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
    developer?.name?.trim() || "Luxury Real Estate Developer";

  const description =
    developer?.description?.replace(/\s+/g, " ").trim() ||
    `Explore premium properties, luxury residences, projects, prices, floor plans and investment opportunities by ${developerName} on Property Bouquet.`;

  const shortDescription =
    description.length > 160
      ? `${description.substring(0, 157).trim()}...`
      : description;

  const title = `${developerName} Properties | Projects, Prices & Floor Plans | Property Bouquet`;

  const canonicalUrl = `${SITE_URL}/developers/${encodeURIComponent(
    slug
  )}`;

  const developerImage =
    developer?.image ||
    developer?.logo ||
    `${SITE_URL}/og-image.jpg`;

  return {
    title,

    description: shortDescription,

    keywords: [
      `${developerName} properties`,
      `${developerName} projects`,
      `${developerName} properties Gurgaon`,
      `${developerName} projects Gurgaon`,
      `${developerName} luxury projects`,
      `${developerName} flats`,
      `${developerName} apartments`,
      `${developerName} price`,
      `${developerName} floor plans`,
      `${developerName} real estate`,
      "luxury properties Gurgaon",
      "premium properties Gurgaon",
      "Property Bouquet",
    ],

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
      description: shortDescription,
      images: [
        {
          url: developerImage,
          width: 1200,
          height: 630,
          alt: `${developerName} - Property Bouquet`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description: shortDescription,
      images: [developerImage],
    },

    other: {
      "og:updated_time": new Date().toISOString(),
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

  const data = await getDeveloper(slug);

  // ==========================================================
  // REAL 404
  // ==========================================================

  if (!data?.developer) {
    notFound();
  }

  const developer = data.developer;
  const properties = data.properties || [];

  const developerName =
    developer?.name?.trim() || "Luxury Real Estate Developer";

  const canonicalUrl = `${SITE_URL}/developers/${encodeURIComponent(
    slug
  )}`;

  const developerDescription =
    developer?.description?.replace(/\s+/g, " ").trim() ||
    `Explore premium real estate projects and luxury properties by ${developerName} on Property Bouquet.`;

  const developerImage =
    developer?.image ||
    developer?.logo ||
    `${SITE_URL}/og-image.jpg`;

  // ==========================================================
  // DEVELOPER JSON-LD
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
  // BREADCRUMB JSON-LD
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
  // COLLECTION PAGE JSON-LD
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

  return (
    <>
      {/* ======================================================
          DEVELOPER JSON-LD
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(developerSchema),
        }}
      />

      {/* ======================================================
          BREADCRUMB JSON-LD
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(breadcrumbSchema),
        }}
      />

      {/* ======================================================
          COLLECTION JSON-LD
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(collectionSchema),
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