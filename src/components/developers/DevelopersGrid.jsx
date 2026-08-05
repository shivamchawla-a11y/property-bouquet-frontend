"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import DeveloperCard from "./DeveloperCard";

const INITIAL_COUNT = 8;
const LOAD_COUNT = 8;

export default function DevelopersGrid({
  developers = [],
  loading = false,
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visibleDevelopers = developers.slice(0, visibleCount);

  const hasMore = visibleCount < developers.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + LOAD_COUNT, developers.length)
    );
  };

  return (
    <section className="pb-24">
      <div className="max-w-[1380px] mx-auto px-5 lg:px-8">

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[420px] rounded-[24px] bg-[#f4f1ea] animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && developers.length === 0 && (
          <div className="py-24 text-center">
            <h3 className="text-[30px] font-playfair text-[#181818]">
              No Developers Found
            </h3>

            <p className="mt-3 text-[#666]">
              Please check back later.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && developers.length > 0 && (
          <>
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-8
              "
            >
              {visibleDevelopers.map((developer) => (
                <DeveloperCard
                  key={developer._id}
                  developer={developer}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-14">

                <button
                  onClick={handleLoadMore}
                  className="
                    group
                    inline-flex
                    items-center
                    gap-3
                    rounded-xl
                    bg-[#03261E]
                    px-10
                    py-4
                    text-white
                    text-[15px]
                    font-medium
                    shadow-lg
                    transition-all
                    duration-300
                    hover:bg-[#0A3A2F]
                    hover:-translate-y-1
                  "
                >
                  Explore More Developers

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />

                </button>

              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}