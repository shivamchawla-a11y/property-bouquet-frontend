"use client";

import Navbar from "@/components/home/Navbar";

import HeroSection from "@/components/area-converter/HeroSection";
import AreaConverterTool from "@/components/area-converter/AreaConverterTool";
import ConversionTable from "@/components/area-converter/ConversionTable";
import OtherConverters from "@/components/area-converter/OtherConverters";
import AboutAreaConverter from "@/components/area-converter/AboutAreaConverter";
import FAQSection from "@/components/area-converter/FAQSection";
import Footer from "@/components/home/Footer";

export default function AreaConverterPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <HeroSection />

      {/* CONVERTER */}
      <AreaConverterTool />

      {/* TABLE */}
      <ConversionTable />

      {/* OTHER TOOLS */}
      <OtherConverters />

      {/* ABOUT */}
      <AboutAreaConverter />

      {/* FAQ */}
      <FAQSection />

      <Footer/>

    </main>
  );
}