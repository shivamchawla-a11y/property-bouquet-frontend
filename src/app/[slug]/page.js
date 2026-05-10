import PropertyPreview from "../admin/add-property/PropertyPreview";

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

export default async function PropertyPage({ params }) {

  // ✅ NEXT 15 FIX
  const { slug } = await params;

  const property = await getProperty(slug);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Property Not Found
      </div>
    );
  }

  return (
    <div className="bg-white">
      <PropertyPreview form={property} />
    </div>
  );
}