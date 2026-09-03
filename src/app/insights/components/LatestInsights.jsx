"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LatestInsights({ articles = [] }) {
  const [showAll, setShowAll] = useState(false);

  // ==========================================================
  // SORT ARTICLES
  // ==========================================================

  const latestArticles = [...articles].sort(
    (a, b) =>
      new Date(b?.publishDate || 0) -
      new Date(a?.publishDate || 0)
  );

  const displayedArticles = showAll
    ? latestArticles
    : latestArticles.slice(0, 3);

  // ==========================================================
  // SAFE IMAGE
  // ==========================================================

  function getImageUrl(image) {
    if (
      typeof image === "string" &&
      image.trim()
    ) {
      return image.trim();
    }

    if (
      image &&
      typeof image === "object"
    ) {
      if (
        typeof image.url === "string" &&
        image.url.trim()
      ) {
        return image.url.trim();
      }

      if (
        typeof image.src === "string" &&
        image.src.trim()
      ) {
        return image.src.trim();
      }
    }

    return null;
  }

  // ==========================================================
  // SAFE DATE
  // ==========================================================

  function formatDate(date) {
    if (!date) {
      return "";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  if (latestArticles.length === 0) {
    return (
      <div className="mt-12">
        <div
          className="
            rounded-[26px]
            border
            border-[#e8e3d9]
            bg-white
            px-6
            py-12
            text-center
          "
        >
          <h3
            className="
              text-[24px]
              text-[#163629]
            "
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            No Articles Available
          </h3>

          <p className="mt-2 text-[13px] text-[#777]">
            Publish an insight to display it here.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN
  // ==========================================================

  return (
    <div className="mt-14">
    

      {/* ======================================================
          ARTICLE GRID
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {displayedArticles.map(
          (article, index) => {
            const imageUrl = getImageUrl(
              article?.featuredImage
            );

            return (
              <motion.article
                key={
                  article?._id ||
                  article?.slug ||
                  index
                }
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay:
                    Math.min(index, 5) * 0.04,
                }}
                whileHover={{
                  y: -5,
                }}
                className="
                  group
                  flex
                  h-full
                  flex-col
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-[#e5e2da]
                  bg-white
                  shadow-[0_12px_40px_rgba(22,54,41,.055)]
                  transition-shadow
                  duration-300
                  hover:shadow-[0_22px_55px_rgba(22,54,41,.10)]
                "
              >
                {/* ==================================================
                    IMAGE
                ================================================== */}

                <Link
                  href={`/insights/${article.slug}`}
                  className="
                    block
                    shrink-0
                  "
                >
                  <div
                    className="
                      relative
                      aspect-[16/10]
                      w-full
                      overflow-hidden
                      bg-[#eeeae1]
                    "
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={
                          article?.title ||
                          "Property Insights"
                        }
                        fill
                        sizes="
                          (max-width: 768px) 100vw,
                          (max-width: 1280px) 50vw,
                          33vw
                        "
                        className="
                          object-cover
                          object-center
                          transition-transform
                          duration-700
                          ease-out
                          group-hover:scale-[1.045]
                        "
                      />
                    ) : (
                      <div
                        className="
                          absolute
                          inset-0
                          flex
                          items-center
                          justify-center
                          bg-gradient-to-br
                          from-[#102d22]
                          via-[#163629]
                          to-[#0d261d]
                        "
                      >
                        <div className="text-center">
                          <div
                            className="
                              mx-auto
                              flex
                              h-11
                              w-11
                              items-center
                              justify-center
                              rounded-full
                              border
                              border-[#d8b46b]/30
                              bg-[#b88638]/10
                              text-[#d8b46b]
                            "
                          >
                            <span className="text-lg">
                              ✦
                            </span>
                          </div>

                          <p
                            className="
                              mt-3
                              text-[15px]
                              text-white
                            "
                            style={{
                              fontFamily:
                                "Georgia, serif",
                            }}
                          >
                            Property Bouquet
                          </p>

                          <p
                            className="
                              mt-1
                              text-[8px]
                              uppercase
                              tracking-[2px]
                              text-white/45
                            "
                          >
                            Property Insights
                          </p>
                        </div>
                      </div>
                    )}

                    {/* IMAGE GRADIENT */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/35
                        via-transparent
                        to-transparent
                        opacity-70
                      "
                    />

                    {/* CATEGORY */}

                    <div
                      className="
                        absolute
                        left-4
                        top-4
                        rounded-full
                        border
                        border-white/15
                        bg-[#111]/80
                        px-3
                        py-1.5
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[1.7px]
                        text-white
                        shadow-lg
                        backdrop-blur-md
                      "
                    >
                      {article?.category ||
                        "Real Estate"}
                    </div>

                    {/* IMAGE NUMBER */}

                    <div
                      className="
                        absolute
                        bottom-4
                        right-4
                        flex
                        h-7
                        min-w-7
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/20
                        bg-black/35
                        px-2
                        text-[9px]
                        font-medium
                        text-white
                        backdrop-blur-md
                      "
                    >
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </div>
                  </div>
                </Link>

                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div
                  className="
                    flex
                    flex-1
                    flex-col
                    p-5
                    sm:p-6
                  "
                >
                  {/* DATE */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[1.5px]
                      text-[#999]
                    "
                  >
                    <CalendarDays
                      size={12}
                      className="text-[#b88638]"
                    />

                    <span>
                      {formatDate(
                        article?.publishDate
                      )}
                    </span>
                  </div>

                  {/* TITLE */}

                  <h3
                    className="
                      mt-3
                      line-clamp-2
                      min-h-[52px]
                      text-[20px]
                      font-normal
                      leading-[1.3]
                      tracking-[-0.15px]
                      text-[#163629]
                      transition-colors
                      duration-300
                      group-hover:text-[#245340]
                    "
                    style={{
                      fontFamily:
                        "Georgia, serif",
                    }}
                    title={
                      article?.title || ""
                    }
                  >
                    {article?.title}
                  </h3>

                  {/* DIVIDER */}

                  <div
                    className="
                      mt-4
                      h-px
                      w-9
                      bg-[#b88638]
                    "
                  />

                  {/* DESCRIPTION */}

                  <p
                    className="
                      mt-4
                      line-clamp-3
                      min-h-[66px]
                      text-[12px]
                      leading-[1.8]
                      text-[#6d6d6d]
                    "
                    title={
                      article?.shortDescription ||
                      ""
                    }
                  >
                    {article?.shortDescription ||
                      "Discover the latest real estate insights, market trends and property perspectives from Property Bouquet."}
                  </p>

                  {/* BOTTOM */}

                  <div
                    className="
                      mt-auto
                      pt-5
                    "
                  >
                    <Link
                      href={`/insights/${article.slug}`}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[1.3px]
                        text-[#b88638]
                        transition-all
                        duration-300
                        hover:gap-3
                      "
                    >
                      Read Article

                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          }
        )}
      </div>

      {/* ======================================================
          MOBILE VIEW ALL
      ====================================================== */}

      {latestArticles.length > 3 && (
        <div
          className="
            mt-7
            flex
            justify-center
            md:hidden
          "
        >
          <button
            type="button"
            onClick={() =>
              setShowAll(!showAll)
            }
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#d8d1c5]
              bg-white
              px-5
              py-2.5
              text-[10px]
              font-semibold
              uppercase
              tracking-[1px]
              text-[#163629]
              shadow-sm
              transition-all
              duration-300
              hover:border-[#163629]
              hover:bg-[#163629]
              hover:text-white
            "
          >
            {showAll
              ? "Show Less"
              : "View All Articles"}

            <ArrowRight
              size={13}
              className={
                showAll
                  ? "rotate-90 transition-transform"
                  : "transition-transform"
              }
            />
          </button>
        </div>
      )}
    </div>
  );
}