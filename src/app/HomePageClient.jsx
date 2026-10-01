"use client";

import dynamic from "next/dynamic";

import Navbar from "@/components/home/Navbar";
import NavbarMobile from "@/components/home/NavbarMobile";

import HeroSection from "@/components/home/HeroSection";
import HeroSectionMobile from "@/components/home/HeroSectionMobile";

import NavbarConsultationModal from "@/components/home/NavbarConsultationModal";

import { useState } from "react";

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
// HOME PAGE
// =========================================================

export default function HomePage() {
  const [showConsultation, setShowConsultation] =
    useState(false);

  return (
    <main className="bg-[#f6f6f6] overflow-hidden">

      {/* ===================================================== */}
      {/* DESKTOP NAVBAR */}
      {/* ===================================================== */}
      {/*
        IMPORTANT:
        The existing Navbar.jsx is completely untouched.

        It is rendered only on desktop/tablet.
        Mobile gets its own dedicated NavbarMobile.jsx.
      */}

      <div className="hidden md:block">
        <Navbar
          forceSolid
          onConsultationClick={() =>
            setShowConsultation(true)
          }
        />
      </div>

      {/* ===================================================== */}
      {/* MOBILE NAVBAR */}
      {/* ===================================================== */}
      {/*
        Dedicated mobile navbar.

        This keeps the desktop Navbar.jsx completely isolated
        from mobile styling and behaviour.
      */}

      <div className="block md:hidden">
        <NavbarMobile
          forceSolid
          onConsultationClick={() =>
            setShowConsultation(true)
          }
        />
      </div>

      {/* ===================================================== */}
      {/* CONSULTATION MODAL */}
      {/* ===================================================== */}

      <NavbarConsultationModal
        open={showConsultation}
        onClose={() =>
          setShowConsultation(false)
        }
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
      {/* ===================================================== */}

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <FeaturedProjects />
      </div>

      {/* MOBILE / TABLET */}
      <div className="block lg:hidden">
        <FeaturedProjectsMobile />
      </div>

      {/* ===================================================== */}
      {/* TRENDING PROJECTS */}
      {/* ===================================================== */}

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <TrendingProjects />
      </div>

      {/* MOBILE / TABLET */}
      <div className="block lg:hidden">
        <TrendingProjectsMobile />
      </div>

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
        onConsultationClick={() =>
          setShowConsultation(true)
        }
      />

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <Footer />

    </main>
  );
}