"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function TrendingSidebar({
  articles = [],
}) {
const trendingArticles = [...articles]
  .sort(
    (a, b) =>
      new Date(b.publishDate) -
      new Date(a.publishDate)
  )
  .slice(0, 5);
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="
        rounded-[24px]
        border
        border-[#ECE7DE]
        bg-white
        p-8
        shadow-[0_10px_35px_rgba(0,0,0,.04)]
      "
    >
      {/* Heading */}

      <div className="flex items-center justify-between">

        <h3
          className="text-[34px] text-[#111]"
          style={{
            fontFamily: "Georgia, serif",
          }}
        >
          Trending
        </h3>

      </div>

      {/* Articles */}

      <div className="mt-8">

        {trendingArticles.map((article, index) => (

          <Link
            href={`/insights/${article.slug}`}
            key={article._id}
            className="
              group
              flex
              gap-4
              py-5
              first:pt-0
              border-b
              border-[#F2EEE7]
              last:border-none
              last:pb-0
            "
          >
            {/* Number */}

            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#111]
                text-[12px]
                font-semibold
                text-white
              "
            >
              {index + 1}
            </div>

            {/* Image */}

            <div className="relative h-[78px] w-[95px] overflow-hidden rounded-xl shrink-0">

              <Image
                src={article.featuredImage || "/placeholder-news.jpg"}
                alt={article.title}
                fill
                className="
                  object-cover
                  transition
                  duration-700
                  group-hover:scale-105
                "
              />

            </div>

            {/* Content */}

            <div className="flex flex-col justify-between">

              <h4
                className="
                  text-[15px]
                  leading-6
                  font-medium
                  text-[#111]
                  transition
                  group-hover:text-[#C89D58]
                "
              >
                {article.title}
              </h4>

              <p className="mt-2 text-[12px] uppercase tracking-wide text-[#8F8F8F]">
                {new Date(article.publishDate).toLocaleDateString(
  "en-US",
  {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
)}
              </p>

            </div>

          </Link>

        ))}

      </div>

      {/* Button */}

      <Link
  href="/insights"
  className="
    mt-8
    inline-flex
    items-center
    gap-2
    text-[#C89D58]
    font-medium
    transition-all
    hover:gap-3
  "
>
  View All Articles

  <ArrowRight size={17} />
</Link>

    </motion.div>
  );
}