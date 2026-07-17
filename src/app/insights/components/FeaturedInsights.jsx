"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import NewsletterCard from "./NewsletterCard"
import TrendingSidebar from "./TrendingSidebar";
import LatestInsights from "./LatestInsights";

const API = "https://propertybouquet.com/api";

export default function FeaturedInsights() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeatured();
  }, []);

async function fetchFeatured() {
  try {
    const res = await fetch(
  `${API}/news?status=published`,
  {
    cache: "no-store",
  }
);

    const data = await res.json();

    if (!data.success) {
      setError("Unable to load insights.");
      return;
    }

    const allArticles = data.data || [];

    if (allArticles.length === 0) {
      setArticles([]);
      setArticle(null);
      return;
    }

    setArticles(allArticles);

    const featuredArticle =
      allArticles.find((item) => item.featured) ||
      allArticles[0];

    setArticle(featuredArticle);
  } catch (err) {
    console.error("News Fetch Error:", err);
    setError("Unable to load insights.");
  } finally {
    setLoading(false);
  }
}

 if (loading) {
  return (
    <section className="bg-[#faf8f3] py-16">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-12 gap-10">

          <div className="lg:col-span-8 h-[500px] rounded-[22px] bg-white animate-pulse" />

          <div className="lg:col-span-4 space-y-6">
            <div className="h-[330px] rounded-[22px] bg-white animate-pulse" />
            <div className="h-[520px] rounded-[22px] bg-white animate-pulse" />
          </div>

        </div>

      </div>
    </section>
  );
}

if (error) {
  return (
    <section className="bg-[#faf8f3] py-20">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-semibold">
          {error}
        </h2>
      </div>
    </section>
  );
}

  if (!article) {
  return (
    <section className="bg-[#faf8f3] py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className="text-4xl"
          style={{
            fontFamily: "Georgia, serif",
          }}
        >
          No Insights Available
        </h2>

        <p className="mt-4 text-gray-500">
          Publish a news article to display it here.
        </p>
      </div>
    </section>
  );
}
  return (
  <section className="bg-[#faf8f3] py-14">
    <div className="max-w-[1500px] mx-auto px-6 lg:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-12 items-start">

        {/* ================= LEFT COLUMN ================= */}

        <div className="lg:col-span-8">

          {/* Heading */}

          <div className="flex items-center justify-between mb-7">
            <h2
              className="text-[38px] text-[#111]"
              style={{
                fontFamily: "Georgia, serif",
              }}
            >
              Featured Insights
            </h2>
          </div>

          {/* Featured Card */}

          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="
              group
              overflow-hidden
              rounded-[22px]
              border
              border-[#eee8de]
              bg-white
              shadow-[0_8px_35px_rgba(0,0,0,.05)]
            "
          >
            <div className="grid lg:grid-cols-[58%_42%]">

              {/* IMAGE */}

              <div className="relative h-[420px] lg:h-[420px]">

               <Image
  src={article.featuredImage}
  alt={article.title}
  fill
  sizes="(max-width: 1024px) 100vw, 58vw"
  className="object-cover transition-transform duration-700 group-hover:scale-105"
/>

                <div
                  className="
                    absolute
                    left-6
                    top-6
                    rounded-full
                    bg-[#111]
                    px-4
                    py-2
                    text-[10px]
                    tracking-[2px]
                    uppercase
                    font-semibold
                    text-white
                  "
                >
                  {article.category}
                </div>

              </div>

              {/* CONTENT */}

              <div className="flex flex-col justify-center p-8 xl:p-10">

                <p className="text-[13px]
tracking-wide
uppercase
text-[#8f8f8f] text-gray-500">
                  {new Date(article.publishDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>

                <h3
                  className="
                    mt-5
                    text-[34px]
xl:text-[38px]
leading-[1.25]
font-normal
                    leading-tight
                    text-[#111]
                  "
                  style={{
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {article.title}
                </h3>

                <p className="mt-6 text-gray-600 text-[16px]
leading-8
text-[#626262]
max-w-[460px]">
                  {article.shortDescription}
                </p>

                <Link
                  href={`/insights/${article.slug}`}
                  className="
                    mt-8
                    inline-flex
                    items-center
                    gap-3
                    text-[#C89D58]
                    font-medium
                    group/link
                  "
                >
                  Read More

                  <ArrowRight
                    size={18}
                    className="
                      transition-transform
                      group-hover/link:translate-x-1
                    "
                  />
                </Link>

              </div>

            </div>
          </motion.div>

          {/* ================= LATEST ARTICLES ================= */}

          <div className="mt-16">
            <LatestInsights
  articles={articles}
/>
          </div>

        </div>

        {/* ================= RIGHT SIDEBAR ================= */}

        <div className="lg:col-span-4">

          <div className="sticky top-28">

            <NewsletterCard />

            <div className="mt-8">

<TrendingSidebar articles={articles} />

            </div>

          </div>

        </div>

      </div>
    </div>
  </section>
);
}