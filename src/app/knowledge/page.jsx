import Footer from "@/components/home/Footer";

import HeroSection from "./components/HeroSection";
import KnowledgeSidebar from "./components/KnowledgeSidebar";
import FeaturedGuide from "./components/FeaturedGuide";
import KnowledgeGrid from "./components/KnowledgeGrid";
import FeaturedResources from "./components/FeaturedResources";
import BottomFeatures from "./components/BottomFeatures";
import Navbar from "@/components/home/Navbar";

const API =
  "https://property-bouquet-backend.onrender.com/api";

async function getKnowledgeArticles() {
  try {
    const res = await fetch(
      `${API}/knowledge`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return [];

    const data = await res.json();

    return data.data || [];
  } catch {
    return [];
  }
}

export default async function KnowledgePage() {

  const articles =
    await getKnowledgeArticles();

  return (
    <>
      <Navbar forceSolid/>

      <HeroSection />

      <section className="bg-[#faf8f4] pt-36 pb-24">

        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

          <div className="grid lg:grid-cols-12 gap-8">

            <div className="lg:col-span-3">
              <KnowledgeSidebar />
            </div>

            <div className="lg:col-span-9 space-y-10">

              <FeaturedGuide
                articles={articles}
              />

              <KnowledgeGrid
                articles={articles}
              />

              <FeaturedResources />

            </div>

          </div>

          <div className="mt-20">
            <BottomFeatures />
          </div>

        </div>

      </section>

      <Footer />

    </>
  );
}