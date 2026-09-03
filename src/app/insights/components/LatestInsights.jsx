"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, CalendarDays } from "lucide-react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { useState } from "react";

export default function LatestInsights({
  articles = [],
}) {
  const [showAll, setShowAll] = useState(false);

  // ==========================================================
  // SORT ARTICLES
  // ==========================================================

  const latestArticles = [...articles].sort(
    (a, b) =>
      new Date(b?.publishDate || 0) -
      new Date(a?.publishDate || 0)
  );

  // ==========================================================
  // DISPLAY ARTICLES
  // ==========================================================

  const displayedArticles = showAll
    ? latestArticles
    : latestArticles.slice(0, 3);

  // ==========================================================
  // SAFE IMAGE URL
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

    return parsed.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
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
            shadow-[0_10px_35px_rgba(22,54,41,.04)]
          "
        >
          <h3
            className="
              text-[23px]
              font-normal
              text-[#163629]
            "
            style={{
              fontFamily:
                "Georgia, serif",
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
    <motion.section
      layout
      className="mt-14"
    >
      {/* ======================================================
          SECTION HEADER
      ====================================================== */}

      <motion.div
        layout
        className="
          mb-7
          flex
          items-end
          justify-between
          gap-5
        "
      >
        {/* LEFT SIDE */}
        <div>
          <p
            className="
              mb-2
              text-[9px]
              font-semibold
              uppercase
              tracking-[2.5px]
              text-[#b88638]
            "
          >
            Continue Reading
          </p>

          <h2
            className="
              text-[26px]
              font-normal
              leading-[1.15]
              tracking-[-0.3px]
              text-[#163629]
              sm:text-[29px]
            "
            style={{
              fontFamily:
                "Georgia, serif",
            }}
          >
            Latest Insights
          </h2>

          <div
            className="
              mt-3
              h-px
              w-10
              bg-[#b88638]
            "
          />
        </div>

        {/* ====================================================
            VIEW MORE / SHOW LESS
        ==================================================== */}

        {latestArticles.length > 3 && (
          <motion.button
            type="button"
            onClick={() =>
              setShowAll(
                (prev) => !prev
              )
            }
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="
              group
              mb-1
              inline-flex
              shrink-0
              items-center
              gap-2.5
              rounded-full
              border
              border-[#d8d1c5]
              bg-white
              px-4
              py-2.5
              text-[9px]
              font-semibold
              uppercase
              tracking-[1.4px]
              text-[#163629]
              shadow-[0_7px_22px_rgba(22,54,41,.05)]
              transition-all
              duration-300
              hover:border-[#163629]
              hover:bg-[#163629]
              hover:text-white
              hover:shadow-[0_12px_28px_rgba(22,54,41,.11)]
              sm:px-5
              sm:py-2.5
            "
            aria-expanded={showAll}
          >
            <span>
              {showAll
                ? "Show Less"
                : "View More Insights"}
            </span>

            <motion.span
              animate={{
                rotate: showAll
                  ? 90
                  : 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="
                flex
                items-center
                justify-center
              "
            >
              <ArrowRight
                size={13}
              />
            </motion.span>
          </motion.button>
        )}
      </motion.div>

      {/* ======================================================
          ARTICLE GRID
      ====================================================== */}

      <motion.div
        layout
        transition={{
          layout: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        <AnimatePresence
          initial={false}
        >
          {displayedArticles.map(
            (
              article,
              index
            ) => {
              const imageUrl =
                getImageUrl(
                  article?.featuredImage
                );

              const articleHref =
                `/insights/${article?.slug}`;

              const isAdditionalArticle =
                index >= 3;

              return (
                <motion.article
                  layout
                  key={
                    article?._id ||
                    article?.slug ||
                    index
                  }
                  initial={
                    isAdditionalArticle
                      ? {
                          opacity: 0,
                          y: 35,
                          scale: 0.97,
                        }
                      : false
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -20,
                    scale: 0.97,
                  }}
                  transition={{
                    opacity: {
                      duration: 0.3,
                    },
                    scale: {
                      duration: 0.4,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    },
                    y: {
                      duration: 0.45,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    },
                    layout: {
                      duration: 0.55,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    },
                    delay:
                      isAdditionalArticle
                        ? Math.min(
                            index - 3,
                            5
                          ) * 0.06
                        : 0,
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
                    hover:shadow-[0_22px_55px_rgba(22,54,41,.11)]
                  "
                >
                  {/* ==================================================
                      IMAGE
                  ================================================== */}

                  <Link
                    href={articleHref}
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
                          from-black/40
                          via-black/5
                          to-transparent
                          opacity-80
                        "
                      />

                      {/* ARTICLE NUMBER */}

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
                        ).padStart(
                          2,
                          "0"
                        )}
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
                        className="
                          shrink-0
                          text-[#b88638]
                        "
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
                        text-[19px]
                        font-normal
                        leading-[1.35]
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
                        article?.title ||
                        ""
                      }
                    >
                      {article?.title}
                    </h3>

                    {/* GOLD DIVIDER */}

                    <div
                      className="
                        mt-4
                        h-px
                        w-9
                        shrink-0
                        bg-[#b88638]
                      "
                    />

                    {/* DESCRIPTION */}

                    <p
                      className="
                        mt-4
                        line-clamp-3
                        min-h-[63px]
                        text-[12px]
                        leading-[1.75]
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
                        href={articleHref}
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

                        <ArrowRight
                          size={14}
                        />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            }
          )}
        </AnimatePresence>
      </motion.div>

      {/* ======================================================
          BOTTOM EXPAND INDICATOR
      ====================================================== */}

      {latestArticles.length > 3 && (
        <motion.div
          layout
          className="
            mt-8
            flex
            justify-center
          "
        >
          <div
            className="
              h-px
              w-16
              bg-gradient-to-r
              from-transparent
              via-[#b88638]/40
              to-transparent
            "
          />
        </motion.div>
      )}
    </motion.section>
  );
}