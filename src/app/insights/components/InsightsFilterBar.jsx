"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  "All",
  "Market News",
  "Blogs",
  "Market Analysis",
  "Infrastructure Updates",
  "Project Reviews",
  "Opinion",
  "Trends",
];

export default function InsightsFilterBar() {
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [search, setSearch] = useState("");

  return (
    <section className="sticky top-[78px] z-40 bg-[#faf8f3]/90 backdrop-blur-xl border-b border-[#e9e2d7]">

      <div className="max-w-[1500px] mx-auto px-6 lg:px-10 py-5">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

          {/* Categories */}

          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">

            {categories.map((category) => {
              const active =
                activeCategory === category;

              return (
                <motion.button
                  key={category}
                  whileTap={{
                    scale: .96,
                  }}
                  onClick={() =>
                    setActiveCategory(category)
                  }
                  className={`
                  whitespace-nowrap
                  rounded-full
                  px-5
                  py-3
                  text-sm
                  font-medium
                  transition-all
                  duration-300
                  
                  ${
                    active
                      ? "bg-[#0c0c0c] text-white shadow-lg"
                      : "bg-white text-[#444] border border-[#ece7de] hover:border-[#C89D58]/40 hover:text-[#C89D58]"
                  }
                  `}
                >
                  {category}
                </motion.button>
              );
            })}
          </div>

          {/* Search */}

          <div className="relative w-full xl:w-[320px]">

            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search articles..."
              className="
              w-full
              rounded-xl
              border
              border-[#e5dfd6]
              bg-white
              py-3
              pl-12
              pr-5
              text-sm
              outline-none
              transition-all
              duration-300
              focus:border-[#C89D58]
              focus:ring-2
              focus:ring-[#C89D58]/20
              "
            />

          </div>

        </div>

      </div>

    </section>
  );
}