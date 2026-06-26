"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const articles = [
  {
    id: 1,
    category: "Blogs",
    image: "/blog1.jpg",
    date: "May 21, 2026",
    title: "What Makes a Luxury Home Future-Ready?",
    description:
      "Key features and technologies defining the future of premium living.",
  },
  {
    id: 2,
    category: "Market Analysis",
    image: "/blog2.jpg",
    date: "May 19, 2026",
    title: "Gurgaon Real Estate Market Report – May 2026",
    description:
      "Detailed analysis of price trends, supply, demand and investment opportunities.",
  },
  {
    id: 3,
    category: "Infrastructure Updates",
    image: "/blog3.jpg",
    date: "May 17, 2026",
    title: "Upcoming Infrastructure Projects in Gurgaon",
    description:
      "A look at major infrastructure projects shaping Gurgaon's future.",
  },
];

export default function LatestInsights() {
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

        <Link
          href="/insights"
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
          View All Articles

          <ArrowRight size={18} />

        </Link>

      </div>

      {/* Grid */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

        {articles.map((article) => (

          <motion.div
            key={article.id}
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
                src={article.image}
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

                {article.date}

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

                {article.description}

              </p>

              <Link
                href="#"
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