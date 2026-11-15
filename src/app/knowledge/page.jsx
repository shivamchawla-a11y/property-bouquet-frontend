
import { Suspense } from "react";

import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";

import HeroSection from "./components/HeroSection";
import KnowledgeExplorer from "./components/KnowledgeExplorer";
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
// FETCH PUBLISHED KNOWLEDGE ARTICLES
// SERVER SIDE ONLY
// ======================================================

async function getKnowledgeArticles() {
  try {
    const res = await fetch(
      `${API}/knowledge?status=published`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) {
      console.error(
        "Knowledge API error:",
        res.status,
        res.statusText
      );

      return [];
    }

    const data = await res.json();

    if (!Array.isArray(data?.data)) {
      return [];
    }

    // Only return usable published article records.

    return data.data.filter(
      (article) =>
        article &&
        typeof article.title === "string" &&
        article.title.trim() !== "" &&
        typeof article.slug === "string" &&
        article.slug.trim() !== ""
    );

  } catch (error) {
    console.error(
      "Knowledge articles fetch error:",
      error
    );

    return [];
  }
}

// ======================================================
// KNOWLEDGE LOADING SKELETON
// ======================================================

function KnowledgeLoading() {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-8
        animate-pulse
        lg:grid-cols-12
      "
      aria-hidden="true"
    >

      {/* SIDEBAR SKELETON */}

      <div className="space-y-5 lg:col-span-3">

        <div className="overflow-hidden rounded-2xl bg-white">

          <div className="h-24 bg-[#07111d]" />

          {Array.from({ length: 7 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-[58px] border-b border-[#eeeae2] bg-white"
              />
            )
          )}

        </div>

        <div className="h-64 rounded-2xl bg-[#07111d]" />

      </div>

      {/* MAIN CONTENT SKELETON */}

      <div className="space-y-8 lg:col-span-9">

        {/* SEARCH SKELETON */}

        <div className="h-24 rounded-2xl bg-[#eeeae2]" />

        {/* FEATURED ARTICLE SKELETON */}

        <div className="grid overflow-hidden rounded-3xl bg-[#eeeae2] lg:grid-cols-2">

          <div className="space-y-5 p-8">

            <div className="h-8 w-40 rounded-full bg-[#ddd5c8]" />

            <div className="h-12 w-full rounded bg-[#ddd5c8]" />

            <div className="h-5 w-4/5 rounded bg-[#ddd5c8]" />

            <div className="h-12 w-44 rounded-full bg-[#ddd5c8]" />

          </div>

          <div className="aspect-[16/11] bg-[#e4ded2]" />

        </div>

        {/* ARTICLE GRID SKELETON */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-white"
              >

                <div className="aspect-[16/10] bg-[#e4ded2]" />

                <div className="space-y-3 p-5">

                  <div className="h-4 w-2/3 rounded bg-[#ddd5c8]" />

                  <div className="h-4 w-full rounded bg-[#ddd5c8]" />

                  <div className="h-4 w-4/5 rounded bg-[#ddd5c8]" />

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}

// ======================================================
// KNOWLEDGE EXPLORER
// ASYNC SERVER COMPONENT
// ======================================================

async function KnowledgeArticleContent() {
  const articles = await getKnowledgeArticles();

  return (
    <KnowledgeExplorer
      articles={articles}
    />
  );
}

// ======================================================
// MAIN KNOWLEDGE CENTRE PAGE
// SERVER COMPONENT
// ======================================================

export default function KnowledgePage() {
  return (
    <>

      {/* NAVBAR */}

      <Navbar forceSolid />

      <main>

        {/* HERO */}

        <HeroSection />

        {/* KNOWLEDGE CONTENT */}

        <section
          className="
            bg-[#faf8f4]
            py-14
            sm:py-16
            lg:py-20
          "
        >

          <div
            className="
              mx-auto
              max-w-[1400px]
              px-5
              sm:px-6
              lg:px-10
            "
          >

            {/* ARTICLE EXPLORER */}

            <Suspense
              fallback={<KnowledgeLoading />}
            >

              <KnowledgeArticleContent />

            </Suspense>

            {/* FEATURED RESOURCES */}

            <div className="mt-16 sm:mt-20">

              <FeaturedResources />

            </div>

            {/* BOTTOM FEATURES */}

            <div className="mt-16 sm:mt-20">

              <BottomFeatures />

            </div>

          </div>

        </section>

      </main>

      {/* FOOTER */}

      <Footer />

    </>
  );
}
