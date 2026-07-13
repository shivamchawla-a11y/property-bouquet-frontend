import PropertyPreview from "../admin/add-property/PropertyPreview";
import { notFound } from "next/navigation";
import { buildPropertySEO } from "@/lib/propertySeo";
import { buildPropertySchema } from "@/lib/propertySchema";

// ==========================================
// Backend API
// ==========================================
const API = "https://api.propertybouquet.com";

// ==========================================
// Fetch Property
// ==========================================
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
    console.error("Error fetching property:", err);
    return null;
  }
}

// ==========================================
// Dynamic SEO Metadata
// ==========================================
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const property = await getProperty(slug);

  if (!property) {
    return {
      title: "Property Not Found | Property Bouquet",
      description: "The requested property could not be found.",
    };
  }

  return buildPropertySEO(property, slug);
}

// ==========================================
// Property Page
// ==========================================
export default async function PropertyPage({ params }) {
  const { slug } = await params;

  const property = await getProperty(slug);

  if (!property) {
    notFound();
  }

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