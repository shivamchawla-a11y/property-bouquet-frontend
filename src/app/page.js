import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import LuxuryBanner from "@/components/home/LuxuryBanner";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import TrendingProjects from "@/components/home/TrendingProjects";
import ExploreLocations from "@/components/home/ExploreLocations";
import Footer from "@/components/home/Footer";
import PremiumPartners from "@/components/home/PremiumPartners";
import LuxuryInsightsSection from "@/components/home/LuxuryInsightsSection";

export default function HomePage() {
  return (
    <main className="bg-[#f6f6f6] overflow-hidden">

      <Navbar />

      <HeroSection />

      {/* AD BANNER */}
      <LuxuryBanner />

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