import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

import HeroSectionInsights from "./components/HeroSectionInsights";
import InsightsFilterBar from "./components/InsightsFilterBar";
import FeaturedInsights from "./components/FeaturedInsights";

export const metadata = {
  title: "Property Insights | Property Bouquet",
  description:
    "Luxury real estate news, market intelligence, investment insights and expert analysis by Property Bouquet.",
};

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-[#050608] text-white">

      {/* Navbar */}

      <Navbar />

      {/* Hero */}

      <HeroSectionInsights />

      {/* Temporary Section */}
      {/* Remove this after we build the Filter Bar */}

      <section className="relative bg-gradient-to-b from-[#050608] via-[#f7f5f1] to-[#faf8f3]"></section>

      <InsightsFilterBar />

<FeaturedInsights/>

      {/* Footer */}

      <Footer />

    </main>
  );
}