
"use client";

import dynamic from "next/dynamic";

import {
  useEffect,
  useState,
  useCallback,
} from "react";

// =========================================================
// IMMEDIATE COMPONENTS
// =========================================================

import Navbar from "@/components/home/Navbar";
import NavbarMobile from "@/components/home/NavbarMobile";

import HeroSection from "@/components/home/HeroSection";
import HeroSectionMobile from "@/components/home/HeroSectionMobile";

// =========================================================
// LIGHTWEIGHT LOADING FALLBACK
// =========================================================

function SectionFallback({ height = "200px" }) {
  return (
    <div
      aria-hidden="true"
      style={{ minHeight: height }}
      className="w-full bg-[#f6f6f6]"
    />
  );
}

// =========================================================
// DYNAMIC COMPONENTS
// =========================================================

// Consultation modal loads only when needed.
const NavbarConsultationModal = dynamic(
  () =>
    import("@/components/home/NavbarConsultationModal"),
  {
    ssr: false,
  }
);

// =========================================================
// LAZY LOADED HOMEPAGE SECTIONS
// =========================================================

const RecommendedProjects = dynamic(
  () =>
    import("@/components/home/RecommendedProperties"),
  {
    loading: () => <SectionFallback height="350px" />,
  }
);

const FeaturedProjects = dynamic(
  () =>
    import("@/components/home/FeaturedProjects"),
  {
    loading: () => <SectionFallback height="450px" />,
  }
);

const FeaturedProjectsMobile = dynamic(
  () =>
    import("@/components/home/FeaturedProjectsMobile"),
  {
    loading: () => <SectionFallback height="350px" />,
  }
);

const TrendingProjects = dynamic(
  () =>
    import("@/components/home/TrendingProjects"),
  {
    loading: () => <SectionFallback height="450px" />,
  }
);

const TrendingProjectsMobile = dynamic(
  () =>
    import("@/components/home/TrendingProjectsMobile"),
  {
    loading: () => <SectionFallback height="350px" />,
  }
);

const ExploreLocations = dynamic(
  () =>
    import("@/components/home/ExploreLocations"),
  {
    loading: () => <SectionFallback height="300px" />,
  }
);

const PremiumPartners = dynamic(
  () =>
    import("@/components/home/PremiumPartners"),
  {
    loading: () => <SectionFallback height="250px" />,
  }
);

const LuxuryInsightsSection = dynamic(
  () =>
    import("@/components/home/LuxuryInsightsSection"),
  {
    loading: () => <SectionFallback height="350px" />,
  }
);

const Footer = dynamic(
  () =>
    import("@/components/home/Footer"),
  {
    loading: () => <SectionFallback height="250px" />,
  }
);

// =========================================================
// RESPONSIVE BREAKPOINT
// =========================================================

// Featured and Trending switch at 1024px.
// Navbar and Hero retain their existing md breakpoint.

function useDesktopSections() {
  const [isDesktop, setIsDesktop] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 1024px)"
    );

    const updateLayout = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateLayout();

    mediaQuery.addEventListener(
      "change",
      updateLayout
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        updateLayout
      );
    };
  }, []);

  return isDesktop;
}

// =========================================================
// FEATURED PROPERTY VALIDATION
// =========================================================

function filterFeaturedProperties(list) {
  if (!Array.isArray(list)) {
    return [];
  }

  return list
    .filter(
      (property) =>
        property &&
        typeof property === "object" &&
        typeof property.slug === "string" &&
        property.slug.trim() !== ""
    )
    .slice(0, 12);
}

// =========================================================
// API RESPONSE EXTRACTION
// =========================================================

function extractFeaturedProperties(result) {
  const list = Array.isArray(result?.data)
    ? result.data
    : Array.isArray(result?.properties)
      ? result.properties
      : Array.isArray(result)
        ? result
        : [];

  return filterFeaturedProperties(list);
}

// =========================================================
// HOMEPAGE CLIENT
// =========================================================

export default function HomePage({
  initialFeaturedProperties = [],
}) {

  // =======================================================
  // RESPONSIVE SECTIONS
  // =======================================================

  const isDesktop = useDesktopSections();

  // =======================================================
  // CONSULTATION MODAL
  // =======================================================

  const [showConsultation, setShowConsultation] =
    useState(false);

  const openConsultation = useCallback(() => {
    setShowConsultation(true);
  }, []);

  const closeConsultation = useCallback(() => {
    setShowConsultation(false);
  }, []);

  // =======================================================
  // SHARED FEATURED PROPERTIES
  // =======================================================

  const [featuredProperties, setFeaturedProperties] =
    useState(() =>
      filterFeaturedProperties(
        initialFeaturedProperties
      )
    );

  const [featuredPropertiesLoading, setFeaturedPropertiesLoading] =
    useState(
      filterFeaturedProperties(
        initialFeaturedProperties
      ).length === 0
    );

  const [featuredPropertiesFetchFailed, setFeaturedPropertiesFetchFailed] =
    useState(false);

  // =======================================================
  // SHARED NAVIGATION DATA
  // =======================================================

  const [navigationData, setNavigationData] =
    useState(null);

  // =======================================================
  // LOAD NAVIGATION DATA
  // =======================================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadNavigationData() {
      try {
        const response = await fetch(
          "/api/navigation/home",
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Navigation request failed: ${response.status}`
          );
        }

        const result = await response.json();

        if (
          !result?.success ||
          !result?.data
        ) {
          throw new Error(
            "Invalid navigation response"
          );
        }

        if (!controller.signal.aborted) {
          setNavigationData(result.data);
        }

      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error(
            "Navigation data error:",
            error
          );
        }
      }
    }

    loadNavigationData();

    return () => {
      controller.abort();
    };
  }, []);

  // =======================================================
  // LOAD FEATURED PROPERTIES
  // =======================================================

  useEffect(() => {
    const serverProperties =
      filterFeaturedProperties(
        initialFeaturedProperties
      );

    // Prefer server-rendered data.
    if (serverProperties.length > 0) {
      setFeaturedProperties(serverProperties);
      setFeaturedPropertiesLoading(false);
      setFeaturedPropertiesFetchFailed(false);

      return undefined;
    }

    // Client fallback only when server data is empty.
    const controller = new AbortController();

    async function loadFeaturedProperties() {
      setFeaturedPropertiesLoading(true);
      setFeaturedPropertiesFetchFailed(false);

      try {
        const response = await fetch(
          "/api/properties/featured",
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Featured properties request failed: ${response.status}`
          );
        }

        const result = await response.json();

        if (result?.success === false) {
          throw new Error(
            result?.message ||
              "Featured properties API returned an error"
          );
        }

        const properties =
          extractFeaturedProperties(result);

        if (!controller.signal.aborted) {
          setFeaturedProperties(properties);
          setFeaturedPropertiesFetchFailed(false);
        }

      } catch (error) {
        if (
          error?.name !== "AbortError" &&
          !controller.signal.aborted
        ) {
          console.error(
            "Featured properties loading failed:",
            error
          );

          setFeaturedProperties([]);
          setFeaturedPropertiesFetchFailed(true);
        }

      } finally {
        if (!controller.signal.aborted) {
          setFeaturedPropertiesLoading(false);
        }
      }
    }

    loadFeaturedProperties();

    return () => {
      controller.abort();
    };

  }, [initialFeaturedProperties]);

  // =======================================================
  // SHARED FEATURED PROPERTIES PROPS
  // =======================================================

  const sharedFeaturedProps = {
    initialProperties: featuredProperties,
    isLoading: featuredPropertiesLoading,
    fetchFailed: featuredPropertiesFetchFailed,
  };

  // =======================================================
  // HOMEPAGE
  // =======================================================

  return (
    <main className="overflow-hidden bg-[#f6f6f6]">

      {/* ================================================
          DESKTOP NAVBAR
      ================================================= */}

      <div className="hidden md:block">
        <Navbar
          forceSolid
          navigationData={navigationData}
          onConsultationClick={openConsultation}
        />
      </div>

      {/* ================================================
          MOBILE NAVBAR
      ================================================= */}

      <div className="block md:hidden">
        <NavbarMobile
          forceSolid
          navigationData={navigationData}
          onConsultationClick={openConsultation}
        />
      </div>

      {/* ================================================
          CONSULTATION MODAL
      ================================================= */}

      {showConsultation && (
        <NavbarConsultationModal
          open={showConsultation}
          onClose={closeConsultation}
        />
      )}

      {/* ================================================
          DESKTOP HERO
      ================================================= */}

      <div className="hidden md:block">
        <HeroSection
          initialProperties={featuredProperties}
          isLoading={featuredPropertiesLoading}
        />
      </div>

      {/* ================================================
          MOBILE HERO
      ================================================= */}

      <div className="block md:hidden">
        <HeroSectionMobile
          initialProperties={featuredProperties}
          isLoading={featuredPropertiesLoading}
        />
      </div>

      {/* ================================================
          RECOMMENDED PROJECTS
      ================================================= */}

      <RecommendedProjects />

      {/* ================================================
          FEATURED PROJECTS
      ================================================= */}

      {isDesktop === true && (
        <FeaturedProjects
          {...sharedFeaturedProps}
        />
      )}

      {isDesktop === false && (
        <FeaturedProjectsMobile
          {...sharedFeaturedProps}
        />
      )}

      {/* ================================================
          TRENDING PROJECTS
      ================================================= */}

      {isDesktop === true && (
        <TrendingProjects />
      )}

      {isDesktop === false && (
        <TrendingProjectsMobile />
      )}

      {/* ================================================
          EXPLORE LOCATIONS
      ================================================= */}

      <ExploreLocations />

      {/* ================================================
          PREMIUM PARTNERS
      ================================================= */}

      <PremiumPartners />

      {/* ================================================
          LUXURY INSIGHTS
      ================================================= */}

      <LuxuryInsightsSection
        onConsultationClick={openConsultation}
      />

      {/* ================================================
          FOOTER
      ================================================= */}

      <Footer />

    </main>
  );
}
