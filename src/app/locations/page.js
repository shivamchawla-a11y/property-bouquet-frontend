import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

import LocationsHero from "@/components/locations/LocationsHero";
import LocationHierarchy from "@/components/locations/LocationHierarchy";
import FeaturedLocationCorridors from "@/components/locations/FeaturedLocationCorridors";
import LocationMarketSection from "@/components/locations/LocationMarketSection";
import LocationInsights from "@/components/locations/LocationInsights";
import LocationsCTA from "@/components/locations/LocationsCTA";

export const metadata = {
  title:
    "Explore Locations | Premium Properties Across Gurgaon & Delhi NCR | Property Bouquet",

  description:
    "Explore premium residential locations, neighbourhoods and investment corridors across Gurgaon and Delhi NCR. Discover properties, projects, developers and real estate insights by location.",

  alternates: {
    canonical: "/locations",
  },

  openGraph: {
    title:
      "Explore Locations | Property Bouquet",

    description:
      "Explore premium real estate locations, neighbourhoods and investment corridors across Gurgaon and Delhi NCR.",

    url: "/locations",

    type: "website",
  },
};

// ============================================================
// GET LOCATION TREE
// ============================================================

async function getLocations() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://propertybouquet.com";

    const response = await fetch(
      `${baseUrl}/api/locations/tree`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    return Array.isArray(data?.data)
      ? data.data
      : [];
  } catch (error) {
    console.error(
      "LOCATIONS PAGE FETCH ERROR:",
      error
    );

    return [];
  }
}

// ============================================================
// FLATTEN LOCATION TREE
// ============================================================

function flattenLocations(
  nodes,
  result = []
) {
  if (!Array.isArray(nodes)) {
    return result;
  }

  for (const node of nodes) {
    if (!node) continue;

    result.push(node);

    if (
      Array.isArray(node.children) &&
      node.children.length
    ) {
      flattenLocations(
        node.children,
        result
      );
    }
  }

  return result;
}

// ============================================================
// LOCATIONS PAGE
// ============================================================

export default async function LocationsPage() {
  const locations =
    await getLocations();

  // ==========================================================
  // ALL LOCATIONS
  // ==========================================================

  const allLocations =
    flattenLocations(locations);

  // ==========================================================
  // FEATURED LOCATIONS
  // ==========================================================
  //
  // These come directly from the existing hierarchy.
  //
  // No additional location entities/pages are created here.
  //
  // Terminal locations continue toward URLs such as:
  //
  // /locations/properties-in-sector-56-gurgaon
  //
  // ==========================================================

  const featuredNames = [
    "Dwarka Expressway",
    "Golf Course Extension Road",
    "Sohna",
    "SPR",
  ];

  const featuredLocations =
    featuredNames
      .map((name) => {
        const normalizedName =
          name.toLowerCase();

        return allLocations.find(
          (location) =>
            String(
              location?.name || ""
            ).toLowerCase() ===
            normalizedName
        );
      })
      .filter(Boolean);

  return (
    <>
      <Navbar />

      <main
        className="
          relative
          isolate
        "
      >
        {/* ==================================================
            HERO

            Higher stacking context is intentional.

            The search suggestions extend beyond the hero
            and must remain above LocationHierarchy.
        ================================================== */}

        <div
          className="
            relative
            z-[50]
          "
        >
          <LocationsHero
            locations={locations}
          />
        </div>

        {/* ==================================================
            LOCATION DIRECTORY

            Lower stacking level ensures that the hero search
            suggestions remain visible when they overflow.
        ================================================== */}

        <div
          className="
            relative
            z-0
          "
        >
          <LocationHierarchy
            locations={locations}
          />

          {/* ==================================================
              FEATURED CORRIDORS
          ================================================== */}

          <FeaturedLocationCorridors
            locations={featuredLocations}
          />

          {/* ==================================================
              MARKET CONTEXT
          ================================================== */}

          <LocationMarketSection />

          {/* ==================================================
              LOCATION INSIGHTS
          ================================================== */}

          <LocationInsights />

          {/* ==================================================
              FINAL CTA
          ================================================== */}

          <LocationsCTA />
        </div>
      </main>

      <Footer />
    </>
  );
}