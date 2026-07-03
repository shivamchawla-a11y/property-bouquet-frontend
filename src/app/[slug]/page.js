import PropertyPreview from "../admin/add-property/PropertyPreview";
import { notFound } from "next/navigation";
import { buildPropertySEO } from "@/lib/propertySeo";
import { buildPropertySchema } from "@/lib/propertySchema";

async function getProperty(slug) {
  try {
    const res = await fetch(
      `https://property-bouquet-backend.onrender.com/api/properties/slug/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const data = await res.json();

    return data.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// ==============================
// Dynamic SEO Metadata
// ==============================
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const property = await getProperty(slug);
  const schema = buildPropertySchema(property, slug);

  if (!property) {
    return {
      title: "Property Not Found | Property Bouquet",
      description: "The requested property could not be found.",
    };
  }

  return buildPropertySEO(property, slug);
}

// ==============================
// Property Page
// ==============================

export default async function PropertyPage({ params }) {

  // ✅ NEXT 15 FIX
  const { slug } = await params;

  const property = await getProperty(slug);

  if (!property) {
  notFound();
}

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