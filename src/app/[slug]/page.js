import PropertyPreview from "../admin/add-property/PropertyPreview";
import PropertiesClient from "@/app/properties/PropertiesClient";

import { notFound } from "next/navigation";

import { buildPropertySEO } from "@/lib/propertySeo";
import { buildPropertySchema } from "@/lib/propertySchema";

import { buildLandingPageSEO } from "@/lib/landingPageSeo";
import { buildLandingPageSchema } from "@/lib/landingPageSchema";

const API = "https://propertybouquet.com";

// ======================================================
// PROPERTY
// ======================================================

async function getProperty(slug) {
  try {
    const res = await fetch(
      `${API}/api/properties/slug/${slug}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();

    return data.data;
  } catch (err) {
    console.error("Property fetch error:", err);
    return null;
  }
}

// ======================================================
// LANDING PAGE
// ======================================================

async function getLandingPage(slug) {
  try {
    const res = await fetch(
      `${API}/api/landing-pages/slug/${slug}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();

    return data.data;
  } catch (err) {
    console.error("Landing page fetch error:", err);
    return null;
  }
}

// ======================================================
// DEVELOPER DATA
// ======================================================

async function getDeveloperData(developerName, developerRef) {
  try {
    // --------------------------------------------------
    // 1. Determine developer slug
    // --------------------------------------------------

    let developerSlug = "";

    // If developerRef is populated
    if (
      developerRef &&
      typeof developerRef === "object"
    ) {
      if (developerRef.slug) {
        developerSlug = developerRef.slug;
      } else if (developerRef.name) {
        developerSlug = developerRef.name
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-");
      }
    }

    // If developerName exists
    if (!developerSlug && developerName) {
      developerSlug = developerName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
    }

    if (!developerSlug) {
      return null;
    }

    // --------------------------------------------------
    // 2. Fetch developer
    // --------------------------------------------------

    const res = await fetch(
      `${API}/api/developers/${developerSlug}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) {
      console.error(
        "Developer fetch failed:",
        developerSlug,
        res.status
      );

      return null;
    }

    const data = await res.json();

    return {
      developer: data?.developer || null,
      properties: Array.isArray(data?.properties)
        ? data.properties
        : [],
    };
  } catch (err) {
    console.error(
      "Developer data fetch error:",
      err
    );

    return null;
  }
}

// ======================================================
// METADATA
// ======================================================

export async function generateMetadata({ params }) {
  const { slug } = await params;

  // ------------------------------------
  // PROPERTY
  // ------------------------------------

  const property = await getProperty(slug);

  if (property) {
    return buildPropertySEO(property, slug);
  }

  // ------------------------------------
  // LANDING PAGE
  // ------------------------------------

  const landingPage = await getLandingPage(slug);

  if (landingPage) {
    return buildLandingPageSEO(landingPage, slug);
  }

  // ------------------------------------
  // NOT FOUND
  // ------------------------------------

  return {
    title: "Page Not Found | Property Bouquet",
    description:
      "The requested page could not be found.",
  };
}

// ======================================================
// PAGE
// ======================================================

export default async function Page({ params }) {
  const { slug } = await params;

  // ------------------------------------
  // PROPERTY PAGE
  // ------------------------------------

  const property = await getProperty(slug);

  if (property) {
    // --------------------------------------------------
    // FETCH DEVELOPER DATA SERVER-SIDE
    // --------------------------------------------------

    const developerData =
      await getDeveloperData(
        property?.coreDetails?.developerName,
        property?.coreDetails?.developerRef
      );

    // --------------------------------------------------
    // BUILD PROPERTY SCHEMA
    // --------------------------------------------------

    const schema = buildPropertySchema(
      property,
      slug
    );

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />

        <div className="bg-white">
          <PropertyPreview
            form={property}
            developerData={developerData}
          />
        </div>
      </>
    );
  }

  // ------------------------------------
  // LANDING PAGE
  // ------------------------------------

  const landingPage = await getLandingPage(slug);

  if (landingPage) {
    const schema =
      buildLandingPageSchema(landingPage);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />

        <div className="bg-white">
          <PropertiesClient
            landingPage={landingPage}
          />
        </div>
      </>
    );
  }

  // ------------------------------------
  // NOT FOUND
  // ------------------------------------

  notFound();
}