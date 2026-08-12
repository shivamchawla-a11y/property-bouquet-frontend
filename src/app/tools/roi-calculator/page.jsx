"use client";

import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/roi-calculator/HeroSection";
import ROICalculator from "@/components/roi-calculator/ROICalculator";
import Footer from "@/components/home/Footer";

export default function ROICalculatorPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <HeroSection />

      <ROICalculator />

      <Footer />
    </main>
  );
}