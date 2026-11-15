
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

import HeroSectionInsights from "./components/HeroSectionInsights";
import InsightsExplorer from "./components/InsightsExplorer";
import BottomCTA from "./components/BottomCTA";

// ======================================================
// SEO METADATA
// ======================================================

export const metadata = {
  title: "Property Insights | Market Intelligence & Luxury Real Estate | Property Bouquet",

  description:
    "Explore luxury real estate market insights, investment analysis, branded residences, developer updates and location intelligence from Property Bouquet.",

  alternates: {
    canonical: "https://propertybouquet.com/insights",
  },

  openGraph: {
    title: "Property Insights | Property Bouquet",
    description:
      "Market intelligence, luxury real estate analysis and informed property perspectives from Property Bouquet.",
    url: "https://propertybouquet.com/insights",
    siteName: "Property Bouquet",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://propertybouquet.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Property Bouquet Property Insights",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Property Insights | Property Bouquet",
    description:
      "Explore luxury real estate intelligence, investment analysis and market perspectives.",
    images: ["https://propertybouquet.com/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

// ======================================================
// PROPERTY INSIGHTS PAGE
// ======================================================

export default function InsightsPage() {
  return (
    <>
      <Navbar forceSolid />

      <main className="min-h-screen bg-[#f7f5ef]">

        {/* HERO */}

        <HeroSectionInsights />

        {/* FEATURED + INSIGHTS EXPLORER */}

        <InsightsExplorer />

        {/* BOTTOM CTA */}

        <BottomCTA />

      </main>

      <Footer />
    </>
  );
}
