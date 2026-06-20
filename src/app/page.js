"use client";

import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import LuxuryBanner from "@/components/home/LuxuryBanner";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import TrendingProjects from "@/components/home/TrendingProjects";
import ExploreLocations from "@/components/home/ExploreLocations";
import Footer from "@/components/home/Footer";
import PremiumPartners from "@/components/home/PremiumPartners";
import LuxuryInsightsSection from "@/components/home/LuxuryInsightsSection";
import RecommendedProjects from "@/components/home/RecommendedProperties";
import HeroSectionMobile from "@/components/home/HeroSectionMobile";
import ConsultationModal from "@/components/home/ConsultationModal";
import { useState } from "react";

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
      <FeaturedProjects />

      {/* TRENDING */}
      <TrendingProjects />

      <ExploreLocations />

      <PremiumPartners />
 
      <LuxuryInsightsSection /> 

      <Footer/>

    </main>
  );
}