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
    description: "The requested page could not be found.",
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
    const schema = buildPropertySchema(property, slug);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />

        <div className="bg-white">
          <PropertyPreview form={property} />
        </div>
      </>
    );
  }

  // ------------------------------------
  // LANDING PAGE
  // ------------------------------------

  const landingPage = await getLandingPage(slug);

  if (landingPage) {
    const schema = buildLandingPageSchema(landingPage);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />

        <div className="bg-white">
          <PropertiesClient landingPage={landingPage} />
        </div>
      </>
    );
  }

  // ------------------------------------
  // NOT FOUND
  // ------------------------------------

  notFound();
}