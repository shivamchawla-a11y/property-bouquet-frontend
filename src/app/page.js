import HomePageClient from "./HomePageClient";
import { siteSchema } from "@/lib/schema/siteSchema";

export const revalidate = 300;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://propertybouquet.com";

async function getInitialFeaturedProperties() {
  try {
    const response = await fetch(
      `${SITE_URL}/api/properties/featured`,
      {
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      console.error(
        "Featured properties server request failed:",
        response.status
      );
      return [];
    }

    const result = await response.json();

    const list = Array.isArray(result?.data)
      ? result.data
      : Array.isArray(result?.properties)
        ? result.properties
        : Array.isArray(result)
          ? result
          : [];

    return list.filter(
      (property) =>
        property &&
        typeof property === "object" &&
        typeof property.slug === "string" &&
        property.slug.trim() !== ""
    );
  } catch (error) {
    console.error(
      "Could not load initial featured properties:",
      error
    );

    return [];
  }
}

export default async function HomePage() {
  const initialFeaturedProperties =
    await getInitialFeaturedProperties();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteSchema),
        }}
      />

      <HomePageClient
        initialFeaturedProperties={initialFeaturedProperties}
      />
    </>
  );
}