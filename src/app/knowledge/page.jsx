
import { Suspense } from "react";

import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";

import HeroSection from "./components/HeroSection";
import KnowledgeSidebar from "./components/KnowledgeSidebar";
import FeaturedGuide from "./components/FeaturedGuide";
import KnowledgeGrid from "./components/KnowledgeGrid";
import FeaturedResources from "./components/FeaturedResources";
import BottomFeatures from "./components/BottomFeatures";

// ======================================================
// API
// ======================================================

const API = "https://propertybouquet.com/api";

// ======================================================
// SEO METADATA
// ======================================================

export const metadata = {
  title:
    "Knowledge Centre | Real Estate Guides, Investment Tips & Home Buying Advice | Property Bouquet",

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

// ======================================================
// FETCH KNOWLEDGE ARTICLES
// SERVER SIDE ONLY
// ======================================================

async function getKnowledgeArticles() {
  try {
    const res = await fetch(`${API}/knowledge`, {
      next: {
        revalidate: 300,
      },
    });

    if (!res.ok) {
      console.error(
        "Knowledge API error:",
        res.status,
        res.statusText
      );

      return [];
    }

    const data = await res.json();

    return Array.isArray(data?.data)
      ? data.data
      : [];

  } catch (error) {
    console.error(
      "Knowledge articles fetch error:",
      error
    );

    return [];
  }
}

// ======================================================
// KNOWLEDGE CONTENT LOADING SKELETON
// ======================================================

function KnowledgeLoading() {
  return (
    <div
      className="space-y-8"
      aria-hidden="true"
    >

      {/* FEATURED GUIDE SKELETON */}

      <div className="overflow-hidden rounded-2xl bg-[#eeeae2] animate-pulse">

        <div className="h-[280px] sm:h-[320px] bg-[#e7e1d6]" />

        <div className="p-6 space-y-4">

          <div className="h-3 w-28 rounded bg-[#ddd5c8]" />

          <div className="h-7 w-3/4 rounded bg-[#ddd5c8]" />

          <div className="h-4 w-full rounded bg-[#ddd5c8]" />

          <div className="h-4 w-2/3 rounded bg-[#ddd5c8]" />

        </div>

      </div>

      {/* ARTICLE GRID SKELETON */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl bg-[#eeeae2] animate-pulse"
          >

            <div className="h-[180px] bg-[#e7e1d6]" />

            <div className="p-5 space-y-3">

              <div className="h-3 w-24 rounded bg-[#ddd5c8]" />

              <div className="h-5 w-full rounded bg-[#ddd5c8]" />

              <div className="h-4 w-4/5 rounded bg-[#ddd5c8]" />

              <div className="h-4 w-2/3 rounded bg-[#ddd5c8]" />

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

// ======================================================
// KNOWLEDGE ARTICLES
// ASYNC SERVER COMPONENT
// ======================================================

async function KnowledgeArticleContent() {

  const articles = await getKnowledgeArticles();

  return (
    <>
      {/* FEATURED GUIDE */}

      <FeaturedGuide
        articles={articles}
      />

      {/* KNOWLEDGE ARTICLE GRID */}

      <KnowledgeGrid
        articles={articles}
      />
    </>
  );
}

// ======================================================
// MAIN KNOWLEDGE CENTRE PAGE
// SERVER COMPONENT
// ======================================================

export default function KnowledgePage() {
  return (
    <>

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <Navbar forceSolid />

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main>

        {/* HERO SECTION */}

        <HeroSection />

        {/* KNOWLEDGE CONTENT */}

        <section className="bg-[#faf8f4] pt-36 pb-24">

          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

            <div className="grid lg:grid-cols-12 gap-8">

              {/* ==========================================
                  LEFT SIDEBAR
              ========================================== */}

              <div className="lg:col-span-3">

                <KnowledgeSidebar />

              </div>

              {/* ==========================================
                  MAIN CONTENT
              ========================================== */}

              <div className="lg:col-span-9 space-y-10">

                {/* ASYNC ARTICLE CONTENT */}

                <Suspense
                  fallback={<KnowledgeLoading />}
                >

                  <KnowledgeArticleContent />

                </Suspense>

                {/* FEATURED RESOURCES */}

                <FeaturedResources />

              </div>

            </div>

            {/* ==========================================
                BOTTOM FEATURES
            ========================================== */}

            <div className="mt-20">

              <BottomFeatures />

            </div>

          </div>

        </section>

      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <Footer />

    </>
  );
}
