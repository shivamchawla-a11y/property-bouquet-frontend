import PropertyPreview from "../admin/add-property/PropertyPreview";
import PropertiesClient from "@/app/properties/PropertiesClient";

import { notFound } from "next/navigation";

import { buildPropertySEO } from "@/lib/propertySeo";
import { buildPropertySchema } from "@/lib/propertySchema";

const API = "https://propertybouquet.com";

// ======================================================
// PROPERTY
// ======================================================s

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

  // Try Property First
  const property = await getProperty(slug);

  if (property) {
    return buildPropertySEO(property, slug);
  }

  // Try Landing Page
  const landingPage = await getLandingPage(slug);

  if (landingPage) {
    return {
      title:
        landingPage.seo?.metaTitle ||
        landingPage.title,

      description:
        landingPage.seo?.metaDescription ||
        "",

      keywords:
        landingPage.seo?.keywords || [],
    };
  }

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
          <PropertyPreview form={property} />
        </div>
      </>
    );
  }

  // ------------------------------------
  // LANDING PAGE
  // ------------------------------------

  const landingPage =
    await getLandingPage(slug);

  if (landingPage) {
    return (
      <PropertiesClient
        landingPage={landingPage}
      />
    );
  }

  // ------------------------------------
  // NOT FOUND
  // ------------------------------------

  notFound();
}