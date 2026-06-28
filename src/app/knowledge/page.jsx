import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

import HeroSection from "./components/HeroSection";
import KnowledgeSidebar from "./components/KnowledgeSidebar";
import FeaturedGuide from "./components/FeaturedGuide";
import KnowledgeGrid from "./components/KnowledgeGrid";

// NEW COMPONENTS
import FeaturedResources from "./components/FeaturedResources";
import BottomFeatures from "./components/BottomFeatures";

export default function KnowledgePage() {
  return (
    <>
      <Navbar forceSolid />

      <HeroSection />

      <section className="bg-[#faf8f4] pt-36 pb-24">

        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

          <div className="grid lg:grid-cols-12 gap-8">

            {/* Sidebar */}

            <div className="lg:col-span-3">

              <KnowledgeSidebar />

            </div>

            {/* Main Content */}

            <div className="lg:col-span-9 space-y-10">

              <FeaturedGuide />

              <KnowledgeGrid />

              {/* Free Resource Library */}

              <FeaturedResources />

            </div>

          </div>

          {/* Bottom Black Feature Strip */}

          <div className="mt-20">

            <BottomFeatures />

          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}