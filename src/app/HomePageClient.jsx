
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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
// HOME PAGE
// =========================================================

export default function HomePage() {
  const [showConsultation, setShowConsultation] = useState(false);

  const isDesktop = useDesktopLayout();

  const openConsultation = () => {
    setShowConsultation(true);
  };

  const closeConsultation = () => {
    setShowConsultation(false);
  };

  return (
    <main className="bg-[#f6f6f6] overflow-hidden">

      {/* ===================================================== */}
      {/* DESKTOP NAVBAR */}
      {/* ===================================================== */}

      <div className="hidden md:block">
        <Navbar
          forceSolid
          onConsultationClick={openConsultation}
        />
      </div>

      {/* ===================================================== */}
      {/* MOBILE NAVBAR */}
      {/* ===================================================== */}

      <div className="block md:hidden">
        <NavbarMobile
          forceSolid
          onConsultationClick={openConsultation}
        />
      </div>

      {/* ===================================================== */}
      {/* CONSULTATION MODAL */}
      {/* ===================================================== */}

      <NavbarConsultationModal
        open={showConsultation}
        onClose={closeConsultation}
      />

      {/* ===================================================== */}
      {/* DESKTOP HERO */}
      {/* ===================================================== */}

      <div className="hidden md:block">
        <HeroSection />
      </div>

      {/* ===================================================== */}
      {/* MOBILE HERO */}
      {/* ===================================================== */}

      <div className="block md:hidden">
        <HeroSectionMobile />
      </div>

      {/* ===================================================== */}
      {/* RECOMMENDED PROJECTS */}
      {/* ===================================================== */}

      <RecommendedProjects />

      {/* ===================================================== */}
      {/* FEATURED PROJECTS */}
      {/* Only the active responsive component mounts. */}
      {/* ===================================================== */}

      {isDesktop === true && (
        <FeaturedProjects />
      )}

      {isDesktop === false && (
        <FeaturedProjectsMobile />
      )}

      {/* ===================================================== */}
      {/* TRENDING PROJECTS */}
      {/* Only the active responsive component mounts. */}
      {/* ===================================================== */}

      {isDesktop === true && (
        <TrendingProjects />
      )}

      {isDesktop === false && (
        <TrendingProjectsMobile />
      )}

      {/* ===================================================== */}
      {/* EXPLORE LOCATIONS */}
      {/* ===================================================== */}

      <ExploreLocations />

      {/* ===================================================== */}
      {/* PREMIUM PARTNERS */}
      {/* ===================================================== */}

      <PremiumPartners />

      {/* ===================================================== */}
      {/* LUXURY INSIGHTS */}
      {/* ===================================================== */}

      <LuxuryInsightsSection
        onConsultationClick={openConsultation}
      />

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <Footer />

    </main>
  );
}
