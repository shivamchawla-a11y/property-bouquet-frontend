"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";

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
// RESPONSIVE BREAKPOINT HOOK
// =========================================================

function useDesktopLayout() {
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
// SHARED FEATURED PROPERTY FILTER
// =========================================================

function filterFeaturedProperties(list) {
  if (!Array.isArray(list)) return [];

  return list.filter(
    (property) =>
      property &&
      typeof property === "object" &&
      typeof property.slug === "string" &&
      property.slug.trim() !== "" &&
      property.status === "published" &&
      property.isDeleted !== true &&
      property.isActive !== false &&
      property.deletedFromStatus !== "trash"
  );
}

// =========================================================
// HOME PAGE
// =========================================================

export default function HomePage({
  initialFeaturedProperties = [],
}) {
  const [showConsultation, setShowConsultation] = useState(false);

  const isDesktop = useDesktopLayout();

  // =======================================================
  // SHARED FEATURED PROPERTIES
  // =======================================================

  const hasServerFeaturedProperties =
    Array.isArray(initialFeaturedProperties) &&
    initialFeaturedProperties.length > 0;

  const [featuredProperties, setFeaturedProperties] = useState(
    () => filterFeaturedProperties(initialFeaturedProperties)
  );

  const [featuredPropertiesLoading, setFeaturedPropertiesLoading] =
    useState(!hasServerFeaturedProperties);

  // =======================================================
  // SHARED NAVIGATION DATA
  // =======================================================

  const [navigationData, setNavigationData] = useState(null);

  // =======================================================
  // LOAD SHARED NAVIGATION DATA
  // =======================================================

  useEffect(() => {
    let cancelled = false;

    const loadNavigationData = async () => {
      try {
        const response = await fetch("/api/navigation/home");

        if (!response.ok) {
          throw new Error(
            `Navigation request failed: ${response.status}`
          );
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error("Invalid navigation response");
        }

        if (!cancelled) {
          setNavigationData(result.data);
        }
      } catch (error) {
        console.error("Navigation data error:", error);
      }
    };

    loadNavigationData();

    return () => {
      cancelled = true;
    };
  }, []);

  // =======================================================
  // LOAD FEATURED PROPERTIES ONCE FOR BOTH HERO SECTIONS
  // =======================================================

  useEffect(() => {
    // Use server-provided properties when available.
    if (
      Array.isArray(initialFeaturedProperties) &&
      initialFeaturedProperties.length > 0
    ) {
      setFeaturedProperties(
        filterFeaturedProperties(initialFeaturedProperties)
      );

      setFeaturedPropertiesLoading(false);

      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    const loadFeaturedProperties = async () => {
      try {
        const response = await fetch("/api/properties/featured", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Featured properties request failed: ${response.status}`
          );
        }

        const result = await response.json();

        const list = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.properties)
            ? result.properties
            : Array.isArray(result)
              ? result
              : [];

        const filteredProperties =
          filterFeaturedProperties(list);

        if (!cancelled) {
          setFeaturedProperties(filteredProperties);
        }
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error(
            "Featured properties loading failed:",
            error
          );
        }
      } finally {
        if (!cancelled) {
          setFeaturedPropertiesLoading(false);
        }
      }
    };

    loadFeaturedProperties();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [initialFeaturedProperties]);

  // =======================================================
  // CONSULTATION MODAL
  // =======================================================

  const openConsultation = useCallback(() => {
    setShowConsultation(true);
  }, []);

  const closeConsultation = useCallback(() => {
    setShowConsultation(false);
  }, []);

  // =======================================================
  // HOME PAGE RENDER
  // =======================================================

  return (
    <main className="overflow-hidden bg-[#f6f6f6]">

      {/* DESKTOP NAVBAR */}

      <div className="hidden md:block">
        <Navbar
          forceSolid
          navigationData={navigationData}
          onConsultationClick={openConsultation}
        />
      </div>

      {/* MOBILE NAVBAR */}

      <div className="block md:hidden">
        <NavbarMobile
          forceSolid
          navigationData={navigationData}
          onConsultationClick={openConsultation}
        />
      </div>

      {/* CONSULTATION MODAL */}

      <NavbarConsultationModal
        open={showConsultation}
        onClose={closeConsultation}
      />

      {/* DESKTOP HERO */}

      <div className="hidden md:block">
        <HeroSection
          initialProperties={featuredProperties}
          isLoading={featuredPropertiesLoading}
        />
      </div>

      {/* MOBILE HERO */}

      <div className="block md:hidden">
        <HeroSectionMobile
          initialProperties={featuredProperties}
          isLoading={featuredPropertiesLoading}
        />
      </div>

      {/* RECOMMENDED PROJECTS */}

      <RecommendedProjects />

      {/* FEATURED PROJECTS */}

      {isDesktop === true && <FeaturedProjects />}

      {isDesktop === false && <FeaturedProjectsMobile />}

      {/* TRENDING PROJECTS */}

      {isDesktop === true && <TrendingProjects />}

      {isDesktop === false && <TrendingProjectsMobile />}

      {/* EXPLORE LOCATIONS */}

      <ExploreLocations />

      {/* PREMIUM PARTNERS */}

      <PremiumPartners />

      {/* LUXURY INSIGHTS */}

      <LuxuryInsightsSection
        onConsultationClick={openConsultation}
      />

      {/* FOOTER */}

      <Footer />

    </main>
  );
}
