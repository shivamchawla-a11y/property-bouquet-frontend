"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";


export default function LatestInsights({ articles = [] }) {

  const [showAll, setShowAll] = useState(false);

  const latestArticles = [...articles].sort(
  (a, b) =>
    new Date(b.publishDate) -
    new Date(a.publishDate)
);

const displayedArticles = showAll
  ? latestArticles
  : latestArticles.slice(0, 3);

  return (
    <div className="mt-16">

      {/* Heading */}

      <div className="flex items-center justify-between mb-8">

        <h2
          className="text-[38px] text-[#111]"
          style={{
            fontFamily: "Georgia, serif",
          }}
        >
          Latest Articles
        </h2>

        {latestArticles.length > 3 && (
  <button
    onClick={() => setShowAll(!showAll)}
    className="
      hidden
      md:flex
      items-center
      gap-2
      text-[#C89D58]
      font-medium
      hover:gap-3
      transition-all
    "
  >
    {showAll ? "Show Less" : "View All Articles"}

    <motion.div
      animate={{ rotate: showAll ? 90 : 0 }}
      transition={{ duration: 0.25 }}
    >
      <ArrowRight size={18} />
    </motion.div>
  </button>
)}
      </div>

      {/* Grid */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

        {displayedArticles.map((article) => (
  <motion.div
    key={article._id}  
            whileHover={{
              y: -6,
            }}
            transition={{
              duration: .3,
            }}
            className="
              group
              overflow-hidden
              rounded-[22px]
              border
              border-[#ece7de]
              bg-white
              shadow-[0_10px_35px_rgba(0,0,0,.04)]
            "
          >

            {/* Image */}

            <div className="relative h-[220px] overflow-hidden">

              <Image
                src={article.featuredImage || "/placeholder-news.jpg"}
                alt={article.title}
                fill
                className="
                  object-cover
                  duration-700
                  transition-transform
                  group-hover:scale-105
                "
              />

              {/* Category */}

              <div
                className="
                  absolute
                  top-5
                  left-5
                  rounded-full
                  bg-[#111]
                  px-3
                  py-1.5
                  text-[10px]
                  uppercase
                  tracking-[1.6px]
                  text-white
                  font-semibold
                "
              >
                {article.category}
              </div>

            </div>

            {/* Content */}

            <div className="p-7">

              <p className="text-[13px] uppercase tracking-wide text-[#8d8d8d]">

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
                  mt-3
                  text-[28px]
                  leading-[1.35]
                  text-[#111]
                "
                style={{
                  fontFamily: "Georgia, serif",
                }}
              >
                {article.title}
              </h3>

              <p className="mt-5 text-[15px] leading-7 text-[#666]">

               {article.shortDescription}

              </p>

              <Link
                href={`/insights/${article.slug}`}
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  text-[#C89D58]
                  font-medium
                  transition-all
                  hover:gap-3
                "
              >
                Read More

                <ArrowRight size={17} />

              </Link>

            </div>

          </motion.div>

        ))}

      </div>

    </div>
  );
}