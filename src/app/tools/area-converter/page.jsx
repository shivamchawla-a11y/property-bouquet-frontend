"use client";

import Navbar from "@/components/home/Navbar";

import HeroSection from "@/components/area-converter/HeroSection";
import AreaConverterTool from "@/components/area-converter/AreaConverterTool";
import ConversionTable from "@/components/area-converter/ConversionTable";
import AboutAreaConverter from "@/components/area-converter/AboutAreaConverter";
import FAQSection from "@/components/area-converter/FAQSection";
import Footer from "@/components/home/Footer";

export default function AreaConverterPage() {
  return (
    <main className="min-h-screen bg-white text-[#10251f]">
      {/* ===================================================== */}
      {/* NAVBAR                                                */}
      {/* ===================================================== */}

      <Navbar />

      {/* ===================================================== */}
      {/* HERO / PRIMARY PAGE INTRODUCTION                      */}
      {/* ===================================================== */}

      <section
        aria-labelledby="area-converter-heading"
        className="relative"
      >
        <HeroSection />
      </section>

      {/* ===================================================== */}
      {/* AREA CONVERTER TOOL                                   */}
      {/* ===================================================== */}

      <section
        aria-labelledby="area-converter-tool-heading"
        className="relative"
      >
        <AreaConverterTool />
      </section>

      {/* ===================================================== */}
      {/* CONVERSION TABLE                                      */}
      {/* ===================================================== */}

      <section
        aria-labelledby="area-conversion-table-heading"
        className="relative"
      >
        <ConversionTable />
      </section>

      {/* ===================================================== */}
      {/* ABOUT AREA CONVERTER                                  */}
      {/* ===================================================== */}

      <section
        aria-labelledby="about-area-converter-heading"
        className="relative"
      >
        <AboutAreaConverter />
      </section>

      {/* ===================================================== */}
      {/* FAQ                                                   */}
      {/* ===================================================== */}

      <section
        aria-labelledby="area-converter-faq-heading"
        className="relative"
      >
        <FAQSection />
      </section>

      {/* ===================================================== */}
      {/* FOOTER                                                */}
      {/* ===================================================== */}

      <Footer />
    </main>
  );
}
