
"use client";

import dynamic from "next/dynamic";
import {
  useEffect,
  useState,
  useCallback,
} from "react";

import Navbar from "@/components/home/Navbar";
import NavbarMobile from "@/components/home/NavbarMobile";

import HeroSection from "@/components/home/HeroSection";
import HeroSectionMobile from "@/components/home/HeroSectionMobile";

import NavbarConsultationModal from "@/components/home/NavbarConsultationModal";

// =========================================================
// LAZY LOADED SECTIONS
// =========================================================

const RecommendedProjects = dynamic(() =>
  import("@/components/home/RecommendedProperties")
);

const FeaturedProjects = dynamic(() =>
  import("@/components/home/FeaturedProjects")
);

const FeaturedProjectsMobile = dynamic(() =>
  import("@/components/home/FeaturedProjectsMobile")
);

const TrendingProjects = dynamic(() =>
  import("@/components/home/TrendingProjects")
);

const TrendingProjectsMobile = dynamic(() =>
  import("@/components/home/TrendingProjectsMobile")
);

const ExploreLocations = dynamic(() =>
  import("@/components/home/ExploreLocations")
);

const PremiumPartners = dynamic(() =>
  import("@/components/home/PremiumPartners")
);

const LuxuryInsightsSection = dynamic(() =>
  import("@/components/home/LuxuryInsightsSection")
);

const Footer = dynamic(() =>
  import("@/components/home/Footer")
);

// =========================================================
// FEATURED / TRENDING RESPONSIVE BREAKPOINT
// =========================================================
// FeaturedProjectsMobile uses lg:hidden.
// Therefore, its JavaScript counterpart must switch at
// 1024px, not 768px.
//
// Navbar and Hero continue using their existing md CSS
// breakpoint independently.
// =========================================================

function useDesktopSections() {
  const [isDesktop, setIsDesktop] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const updateLayout = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateLayout();

    mediaQuery.addEventListener("change", updateLayout);

    return () => {
      mediaQuery.removeEventListener("change", updateLayout);
    };
  }, []);

  return isDesktop;
}

// =========================================================
// SHARED FEATURED PROPERTY VALIDATION
// =========================================================
// The backend already filters:
// - published properties
// - non-deleted properties
// - active properties
// - Featured-tagged properties
//
// Those fields are intentionally excluded from the API
// projection, so we only validate the returned slug here.
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
// EXTRACT API RESPONSE
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
// HOME PAGE
// =========================================================

export default function HomePage({
  initialFeaturedProperties = [],
}) {
  // =======================================================
  // RESPONSIVE LAYOUT
  // =======================================================

  const isDesktop = useDesktopSections();

  // =======================================================
  // CONSULTATION MODAL
  // =======================================================

  const [showConsultation, setShowConsultation] =
    useState(false);

  // =======================================================
  // SHARED FEATURED PROPERTIES
  // =======================================================

  const [featuredProperties, setFeaturedProperties] =
    useState(() =>
      filterFeaturedProperties(initialFeaturedProperties)
    );

  const [featuredPropertiesLoading, setFeaturedPropertiesLoading] =
    useState(
      filterFeaturedProperties(initialFeaturedProperties).length === 0
    );

  const [featuredPropertiesFetchFailed, setFeaturedPropertiesFetchFailed] =
    useState(false);

  // =======================================================
  // SHARED NAVIGATION DATA
  // =======================================================

  const [navigationData, setNavigationData] = useState(null);

  // =======================================================
  // LOAD SHARED NAVIGATION DATA
  // =======================================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadNavigationData() {
      try {
        const response = await fetch("/api/navigation/home", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Navigation request failed: ${response.status}`
          );
        }

        const result = await response.json();

        if (!result?.success || !result?.data) {
          throw new Error("Invalid navigation response");
        }

        if (!controller.signal.aborted) {
          setNavigationData(result.data);
        }
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error("Navigation data error:", error);
        }
      }
    }

    loadNavigationData();

    return () => {
      controller.abort();
    };
  }, []);

  // =======================================================
  // LOAD FEATURED PROPERTIES ONCE
  // =======================================================
  // Priority:
  // 1. Use the properties already supplied by page.js.
  // 2. Only use the client API fallback if server data
  //    is empty or unavailable.
  //
  // All featured homepage components receive this same
  // dataset. They do not make their own featured requests.
  // =======================================================

  useEffect(() => {
    const serverProperties =
      filterFeaturedProperties(initialFeaturedProperties);

    if (serverProperties.length > 0) {
      setFeaturedProperties(serverProperties);
      setFeaturedPropertiesLoading(false);
      setFeaturedPropertiesFetchFailed(false);

      return undefined;
    }

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
  // CONSULTATION MODAL ACTIONS
  // =======================================================

  const openConsultation = useCallback(() => {
    setShowConsultation(true);
  }, []);

  const closeConsultation = useCallback(() => {
    setShowConsultation(false);
  }, []);

  // =======================================================
  // SHARED FEATURED PROPERTIES PROPS
  // =======================================================

  const sharedFeaturedProps = {
    initialProperties: featuredProperties,
    isLoading: featuredPropertiesLoading,
    fetchFailed: featuredPropertiesFetchFailed,
  };

  // =======================================================
  // HOME PAGE RENDER
  // =======================================================

  return (
    <main className="overflow-hidden bg-[#f6f6f6]">

      {/* =================================================
          DESKTOP NAVBAR
      ================================================= */}

      <div className="hidden md:block">
        <Navbar
          forceSolid
          navigationData={navigationData}
          onConsultationClick={openConsultation}
        />
      </div>

      {/* =================================================
          MOBILE NAVBAR
      ================================================= */}

      <div className="block md:hidden">
        <NavbarMobile
          forceSolid
          navigationData={navigationData}
          onConsultationClick={openConsultation}
        />
      </div>

      {/* =================================================
          CONSULTATION MODAL
      ================================================= */}

      <NavbarConsultationModal
        open={showConsultation}
        onClose={closeConsultation}
      />

      {/* =================================================
          DESKTOP HERO
      ================================================= */}

      <div className="hidden md:block">
        <HeroSection
          initialProperties={featuredProperties}
          isLoading={featuredPropertiesLoading}
        />
      </div>

      {/* =================================================
          MOBILE HERO
      ================================================= */}

      <div className="block md:hidden">
        <HeroSectionMobile
          initialProperties={featuredProperties}
          isLoading={featuredPropertiesLoading}
        />
      </div>

      {/* =================================================
          RECOMMENDED PROJECTS
      ================================================= */}

      <RecommendedProjects />

      {/* =================================================
          FEATURED PROJECTS
      ================================================= */}
      {/* Desktop at 1024px and above.
          Mobile below 1024px.
          Both receive the same 12-property dataset. */}

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

      {/* =================================================
          TRENDING PROJECTS
      ================================================= */}

      {isDesktop === true && (
        <TrendingProjects />
      )}

      {isDesktop === false && (
        <TrendingProjectsMobile />
      )}

      {/* =================================================
          EXPLORE LOCATIONS
      ================================================= */}

      <ExploreLocations />

      {/* =================================================
          PREMIUM PARTNERS
      ================================================= */}

      <PremiumPartners />

      {/* =================================================
          LUXURY INSIGHTS
      ================================================= */}

      <LuxuryInsightsSection
        onConsultationClick={openConsultation}
      />

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />

    </main>
  );
}
