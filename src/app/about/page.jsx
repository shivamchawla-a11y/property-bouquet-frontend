"use client";

import { useState } from "react";

import Navbar from "@/components/home/Navbar";
import ConsultationModal from "@/components/home/ConsultationModal";
import Footer from "@/components/home/Footer";

import HeroSection from "@/components/aboutUs/HeroSection";
import WhoWeAre from "@/components/aboutUs/WhoWeAre";
import WhoWeAreMobile from "@/components/aboutUs/WhoWeAreMobile";
import MissionVision from "@/components/aboutUs/MissionVision";
import Values from "@/components/aboutUs/Values";

export default function AboutPage() {
  const [showConsultation, setShowConsultation] = useState(false);

  return (
    <main className="bg-white overflow-hidden">

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

      <HeroSection />

      {/* Desktop */}
      <div className="hidden md:block">
        <WhoWeAre />
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        <WhoWeAreMobile />
      </div>

      <MissionVision />

      <Values />

      <Footer />

    </main>
  );
}