import Footer from "@/components/home/Footer";

import HeroSection from "./components/HeroSection";
import KnowledgeSidebar from "./components/KnowledgeSidebar";
import FeaturedGuide from "./components/FeaturedGuide";
import KnowledgeGrid from "./components/KnowledgeGrid";
import FeaturedResources from "./components/FeaturedResources";
import BottomFeatures from "./components/BottomFeatures";
import Navbar from "@/components/home/Navbar";

const API = "https://propertybouquet.com/api";

export const metadata = {
  title: "Knowledge Centre | Real Estate Guides, Investment Tips & Home Buying Advice | Property Bouquet",
  description:
    "Explore expert real estate guides, home buying tips, investment strategies, legal advice, market insights and luxury property resources from Property Bouquet.",

    keywords: [
  "Real Estate Guides",
  "Property Buying Guide",
  "Luxury Real Estate",
  "Investment Guide",
  "Home Loan Guide",
  "Property Tips",
  "Real Estate Knowledge",
  "Property Bouquet",
],

  alternates: {
    canonical: "https://propertybouquet.com/knowledge",
  },

  openGraph: {
    title: "Knowledge Centre | Property Bouquet",
    description:
      "Explore expert real estate guides, home buying tips, investment insights, legal advice, market trends and property resources from Property Bouquet.",
    url: "https://propertybouquet.com/knowledge",
    siteName: "Property Bouquet",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://propertybouquet.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Property Bouquet Knowledge Centre",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Knowledge Centre | Property Bouquet",
    description:
      "Explore expert real estate guides, home buying tips, investment insights, legal advice, market trends and property resources from Property Bouquet.",
    images: ["https://propertybouquet.com/og-image.jpg"],
  },

  robots: {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    noimageindex: false,
    "max-image-preview": "large",
    "max-video-preview": -1,
    "max-snippet": -1,
  },
},
};  

async function getKnowledgeArticles() {
  try {
    const res = await fetch(
      `${API}/knowledge`,
      {
        next: {
  revalidate: 300,
},
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