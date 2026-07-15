"use client";

import dynamic from "next/dynamic";

import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import HeroSectionMobile from "@/components/home/HeroSectionMobile";
import ConsultationModal from "@/components/home/ConsultationModal";

import { useState } from "react";

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

export default function HomePage() {

  const [showConsultation, setShowConsultation] =
    useState(false);
  return (
    <main className="bg-[#f6f6f6] overflow-hidden">

      <Navbar
        onConsultationClick={() =>
          setShowConsultation(true)
        }
      />

      <ConsultationModal
        open={showConsultation}
        onClose={() =>
          setShowConsultation(false)
        }
      />

      {/* DESKTOP HERO */}
      <div className="hidden md:block">
        <HeroSection />
      </div>

      {/* MOBILE HERO */}
      <div className="block md:hidden">
        <HeroSectionMobile />
      </div>

      <RecommendedProjects/>

      {/* FEATURED */}
      {/* FEATURED DESKTOP */}
<div className="hidden lg:block">
  <FeaturedProjects />
</div>

{/* FEATURED MOBILE */}
<div className="block lg:hidden">
  <FeaturedProjectsMobile />
</div>

      {/* TRENDING */}
      {/* DESKTOP */}
<div className="hidden lg:block">
  <TrendingProjects />
</div>

{/* MOBILE */}
<div className="block lg:hidden">
  <TrendingProjectsMobile />
</div>

      <ExploreLocations />

      <PremiumPartners />
 
      <LuxuryInsightsSection
  onConsultationClick={() =>
    setShowConsultation(true)
  }
/>

      <Footer/>

    </main>
  );
}