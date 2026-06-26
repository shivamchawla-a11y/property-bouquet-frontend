"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import NewsletterCard from "./NewsletterCard"
import TrendingSidebar from "./TrendingSidebar";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://property-bouquet-backend.onrender.com";

export default function FeaturedInsights() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchFeatured();
  }, []);

  async function fetchFeatured() {
  try {
    // ================= FEATURED =================

    const featuredRes = await fetch(
      `${API}/api/news?featured=true&status=published`
    );

    const featuredData = await featuredRes.json();

    if (
      featuredData.success &&
      featuredData.data.length > 0
    ) {
      setArticle(featuredData.data[0]);
    }

    // ================= LATEST / TRENDING =================

    const latestRes = await fetch(
      `${API}/api/news?status=published`
    );

    const latestData = await latestRes.json();

    if (latestData.success) {
      setArticles(latestData.data);
    }

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}

  if (loading) {
    return (
      <section className="bg-[#faf8f3] py-16">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-10">

          <div className="h-[460px] rounded-[30px] bg-white animate-pulse" />

        </div>
      </section>
    );
  }

  if (!article) return null;

  return (
    <section className="bg-[#faf8f3] py-14">

      <div className="max-w-[1500px] mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT */}

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

            {/* Card */}

            <motion.div
              whileHover={{
                y: -4,
              }}
              transition={{
                duration: .3,
              }}
              className="
              group
              overflow-hidden
              rounded-[30px]
              border
              border-[#ebe4d9]
              bg-white
              shadow-sm
              "
            >

              <div className="grid lg:grid-cols-2">

                {/* IMAGE */}

                <div className="relative h-[500px]">

                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    className="
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                    "
                  />

                  {/* Category */}

                  <div
                    className="
                    absolute
                    left-6
                    top-6
                    rounded-full
                    bg-black/80
                    px-4
                    py-2
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[2px]
                    text-white
                    "
                  >
                    {article.category}
                  </div>

                </div>

                {/* CONTENT */}

                <div className="flex flex-col justify-center p-10 lg:p-12">

                  <p className="text-sm text-gray-500">

                    {new Date(
                      article.publishDate
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}

                  </p>

                  <h3
                    className="
                    mt-5
                    text-[42px]
                    leading-tight
                    text-[#111]
                    "
                    style={{
                      fontFamily:
                        "Georgia, serif",
                    }}
                  >
                    {article.title}
                  </h3>

                  <p className="mt-7 text-[17px] leading-8 text-gray-600">

                    {article.shortDescription}

                  </p>

                  <Link
                    href={`/insights/${article.slug}`}
                    className="
                    mt-10
                    inline-flex
                    items-center
                    gap-3
                    text-[#C89D58]
                    font-medium
                    group/link
                    "
                  >
                    Read Full Insight

                    <ArrowRight
                      size={18}
                      className="
                      transition-transform
                      duration-300
                      group-hover/link:translate-x-1
                      "
                    />

                  </Link>

                </div>

              </div>

            </motion.div>

          </div>

          {/* ================= RIGHT COLUMN ================= */}

<div className="lg:col-span-4 space-y-8">

  <NewsletterCard />

  <TrendingSidebar
    articles={articles.filter(
      (item) => item._id !== article?._id
    )}
  />

</div>

        </div>

      </div>

    </section>
  );
}