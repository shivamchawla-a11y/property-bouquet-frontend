"use client";

import { useState } from "react";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ConsultationModal from "@/components/home/ConsultationModal";

import HeroSection from "@/components/contact/HeroSection";
import HeroSectionMobile from "@/components/contact/HeroSectionMobile";

import ContactSection from "@/components/contact/ContactSection";
import ContactSectionMobile from "@/components/contact/ContactSectionMobile";

import ConsultationBanner from "@/components/contact/ConsultationBanner";
import ConsultationBannerMobile from "@/components/contact/ConsultationBannerMobile";

import OfficeLocation from "@/components/contact/OfficeLocation";
import OfficeLocationMobile from "@/components/contact/OfficeLocationMobile";

export default function ContactPage() {
  const [showConsultation, setShowConsultation] = useState(false);

  return (
    <main className="bg-[#F9F8F4] overflow-x-hidden">

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

      {/* ================= HERO ================= */}

      <div className="hidden lg:block">
        <HeroSection />
      </div>

      <div className="block lg:hidden">
        <HeroSectionMobile />
      </div>

      {/* ================= CONTACT ================= */}

      <div className="hidden lg:block">
        <ContactSection />
      </div>

      <div className="block lg:hidden">
        <ContactSectionMobile />
      </div>

      {/* ================= CONSULTATION ================= */}

      <div className="hidden lg:block">
        <ConsultationBanner />
      </div>

      <div className="block lg:hidden">
        <ConsultationBannerMobile />
      </div>

      {/* ================= OFFICE ================= */}

      <div className="hidden lg:block">
        <OfficeLocation />
      </div>

      <div className="block lg:hidden">
        <OfficeLocationMobile />
      </div>

      <Footer />

    </main>
  );
}