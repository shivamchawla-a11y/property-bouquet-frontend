"use client";

import { useState } from "react";

import Navbar from "@/components/home/Navbar";
import ConsultationModal from "@/components/home/ConsultationModal";
import Footer from "@/components/home/Footer";

import HeroSection from "@/components/aboutUs/HeroSection";
import WhoWeAre from "@/components/aboutUs/WhoWeAre";
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

      <WhoWeAre />

      <MissionVision />

      <Values />

      <Footer />

    </main>
  );
}