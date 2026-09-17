import { Suspense } from "react";
import PropertiesClient from "./PropertiesClient";

const SITE_URL = "https://propertybouquet.com";

// ============================================================
// METADATA
// ============================================================

export async function generateMetadata() {
  const title =
    "Luxury Properties, Apartments, Villas & Plots | Property Bouquet";

  const description =
    "Discover luxury properties, apartments, villas and plots on Property Bouquet. Explore premium real estate projects with prices, floor plans, amenities, locations and trusted developer details.";

  return {
    metadataBase: new URL(SITE_URL),

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

    applicationName: "Property Bouquet",

    // ========================================================
    // CANONICAL
    // ========================================================

    alternates: {
      canonical: `${SITE_URL}/properties`,
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

      url: `${SITE_URL}/properties`,

      siteName: "Property Bouquet",

      title,

      description,

      images: [
        {
          url: `${SITE_URL}/og-image.jpg`,
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
      card: "summary_large_image",

      title,

      description,

      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

// ============================================================
// SAFE JSON-LD
// ============================================================

function safeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// ============================================================
// PAGE
// ============================================================

export default function Page() {
  const canonicalUrl = `${SITE_URL}/properties`;

  // ==========================================================
  // BREADCRUMB SCHEMA
  // ==========================================================

  const breadcrumbSchema = {
    "@context": "https://schema.org",

    "@type": "BreadcrumbList",

    "@id": `${canonicalUrl}#breadcrumb`,

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

        name: "Properties",

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

    name: "Luxury Properties, Apartments, Villas & Plots",

    headline: "Luxury Properties, Apartments, Villas & Plots",

    description:
      "Discover luxury properties, apartments, villas and plots on Property Bouquet. Explore premium real estate projects with prices, floor plans, amenities, locations and developer details.",

    inLanguage: "en-IN",

    isPartOf: {
      "@type": "WebSite",

      "@id": `${SITE_URL}#website`,

      name: "Property Bouquet",

      url: SITE_URL,
    },

    about: {
      "@type": "Thing",

      name: "Luxury Real Estate Properties",
    },

    // ========================================================
    // IMPORTANT:
    // Do NOT fetch /api/properties here.
    //
    // The actual property collection is rendered by
    // PropertiesClient.
    //
    // This prevents the 3.23 MB API response from being
    // pulled into Next.js server data cache just for SEO.
    // ========================================================

    mainEntity: {
      "@type": "ItemList",

      "@id": `${canonicalUrl}#property-list`,

      name: "Available Properties",

      itemListOrder: "https://schema.org/ItemListOrderAscending",

      numberOfItems: 0,

      itemListElement: [],
    },
  };

  // ==========================================================
  // WEBSITE SCHEMA
  // ==========================================================

  const websiteSchema = {
    "@context": "https://schema.org",

    "@type": "WebSite",

    "@id": `${SITE_URL}#website`,

    name: "Property Bouquet",

    url: SITE_URL,

    publisher: {
      "@type": "Organization",

      "@id": `${SITE_URL}#organization`,

      name: "Property Bouquet",

      url: SITE_URL,
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
          __html: safeJsonLd(websiteSchema),
        }}
      />

      {/* ======================================================
          COLLECTION PAGE SCHEMA
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