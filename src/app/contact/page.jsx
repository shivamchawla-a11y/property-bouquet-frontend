"use client";

import { useState } from "react";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ConsultationModal from "@/components/home/ConsultationModal";

import HeroSection from "@/components/contact/HeroSection";
import ContactSection from "@/components/contact/ContactSection";
import ConsultationBanner from "@/components/contact/ConsultationBanner";
import OfficeLocation from "@/components/contact/OfficeLocation";

export default function ContactPage() {
  const [showConsultation, setShowConsultation] = useState(false);

  return (
    <main className="bg-[#F8F5EF] overflow-x-hidden">
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

      <ContactSection />

      <ConsultationBanner />

      <OfficeLocation />

      <Footer />
    </main>
  );
}