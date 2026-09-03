"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { useState } from "react";

export default function TrendingSidebar({
  articles = [],
}) {
  const [showAll, setShowAll] = useState(false);

  // ==========================================================
  // SORT ARTICLES
  // ==========================================================

  const trendingArticles = [...articles]
    .sort(
      (a, b) =>
        new Date(b?.publishDate || 0) -
        new Date(a?.publishDate || 0)
    );

  // ==========================================================
  // DISPLAY ARTICLES
  // ==========================================================

  const displayedArticles = showAll
    ? trendingArticles
    : trendingArticles.slice(0, 5);

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

  if (trendingArticles.length === 0) {
    return (
      <motion.aside
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 0.55,
        }}
        className="
          overflow-hidden
          rounded-[26px]
          border
          border-[#e8e3d9]
          bg-white
          shadow-[0_12px_40px_rgba(22,54,41,.055)]
        "
      >
        {/* Header */}

        <div
          className="
            relative
            overflow-hidden
            bg-gradient-to-br
            from-[#163629]
            via-[#183d2e]
            to-[#0d281e]
            px-6
            py-7
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-20
              h-44
              w-44
              rounded-full
              bg-[#b88638]/10
              blur-3xl
            "
          />

          <p
            className="
              relative
              text-[8px]
              font-semibold
              uppercase
              tracking-[2.5px]
              text-[#d8b46b]
            "
          >
            Property Bouquet
          </p>

          <h3
            className="
              relative
              mt-2
              text-[27px]
              font-normal
              leading-none
              text-white
            "
            style={{
              fontFamily:
                "Georgia, serif",
            }}
          >
            Trending
          </h3>

          <div
            className="
              relative
              mt-4
              h-px
              w-9
              bg-[#b88638]
            "
          />
        </div>

        {/* Empty */}

        <div
          className="
            px-6
            py-10
            text-center
          "
        >
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
              text-[#b88638]
            "
          >
            <TrendingUp size={18} />
          </div>

          <p
            className="
              mt-4
              text-[12px]
              leading-6
              text-[#777]
            "
          >
            No trending insights
            available yet.
          </p>
        </div>
      </motion.aside>
    );
  }

  // ==========================================================
  // MAIN
  // ==========================================================

  return (
    <motion.aside
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        overflow-hidden
        rounded-[26px]
        border
        border-[#e5e1d8]
        bg-white
        shadow-[0_14px_45px_rgba(22,54,41,.06)]
      "
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-[#163629]
          via-[#183d2e]
          to-[#0d281e]
          px-6
          py-7
          sm:px-7
        "
      >
        {/* Background Glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-24
            h-52
            w-52
            rounded-full
            bg-[#b88638]/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            -left-20
            h-40
            w-40
            rounded-full
            bg-white/5
            blur-3xl
          "
        />

        {/* Header Content */}

        <div
          className="
            relative
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[2.5px]
                text-[#d8b46b]
              "
            >
              Property Bouquet
            </p>

            <h3
              className="
                mt-2
                text-[28px]
                font-normal
                leading-none
                tracking-[-0.3px]
                text-white
              "
              style={{
                fontFamily:
                  "Georgia, serif",
              }}
            >
              Trending
            </h3>

            <div
              className="
                mt-4
                h-px
                w-9
                bg-[#b88638]
              "
            />
          </div>

          {/* Trending Icon */}

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/[0.06]
              text-[#d8b46b]
              backdrop-blur-md
            "
          >
            <TrendingUp size={17} />
          </div>
        </div>

        {/* Small Description */}

        <p
          className="
            relative
            mt-5
            max-w-[290px]
            text-[10px]
            leading-[1.7]
            text-white/55
          "
        >
          Explore the insights and
          property stories currently
          attracting the most attention.
        </p>
      </div>

      {/* ======================================================
          ARTICLES
      ====================================================== */}

      <motion.div
        layout
        className="
          px-5
          py-3
          sm:px-6
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

              const isAdditional =
                index >= 5;

              return (
                <motion.div
                  layout
                  key={
                    article?._id ||
                    article?.slug ||
                    index
                  }
                  initial={
                    isAdditional
                      ? {
                          opacity: 0,
                          y: 25,
                        }
                      : false
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -15,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                    delay:
                      isAdditional
                        ? Math.min(
                            index - 5,
                            5
                          ) * 0.055
                        : 0,
                    layout: {
                      duration: 0.5,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    },
                  }}
                  className="
                    border-b
                    border-[#f0ece5]
                    last:border-b-0
                  "
                >
                  <Link
                    href={articleHref}
                    className="
                      group
                      relative
                      flex
                      gap-3.5
                      py-5
                    "
                  >
                    {/* ==================================================
                        NUMBER
                    ================================================== */}

                    <div
                      className="
                        relative
                        mt-1
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-full
                        border
                        border-[#d8d1c5]
                        bg-[#f8f6f1]
                        text-[9px]
                        font-semibold
                        text-[#163629]
                        transition-all
                        duration-300
                        group-hover:border-[#b88638]
                        group-hover:bg-[#163629]
                        group-hover:text-white
                      "
                    >
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    {/* ==================================================
                        IMAGE
                    ================================================== */}

                    <div
                      className="
                        relative
                        h-[72px]
                        w-[88px]
                        shrink-0
                        overflow-hidden
                        rounded-[12px]
                        bg-[#eeeae1]
                      "
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={
                            article?.title ||
                            "Property Insight"
                          }
                          fill
                          sizes="88px"
                          className="
                            object-cover
                            object-center
                            transition-transform
                            duration-700
                            ease-out
                            group-hover:scale-110
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
                          <span
                            className="
                              text-[18px]
                              text-[#d8b46b]
                            "
                          >
                            ✦
                          </span>
                        </div>
                      )}

                      {/* Image Overlay */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/30
                          via-transparent
                          to-transparent
                        "
                      />
                    </div>

                    {/* ==================================================
                        CONTENT
                    ================================================== */}

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <h4
                        className="
                          line-clamp-2
                          text-[13px]
                          font-medium
                          leading-[1.55]
                          tracking-[-0.05px]
                          text-[#163629]
                          transition-colors
                          duration-300
                          group-hover:text-[#b88638]
                        "
                        title={
                          article?.title ||
                          ""
                        }
                      >
                        {article?.title ||
                          "Property Insight"}
                      </h4>

                      {/* Date */}

                      <div
                        className="
                          mt-2.5
                          flex
                          items-center
                          gap-1.5
                          text-[8px]
                          font-medium
                          uppercase
                          tracking-[1.2px]
                          text-[#999]
                        "
                      >
                        <CalendarDays
                          size={10}
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
                    </div>

                    {/* Arrow */}

                    <div
                      className="
                        absolute
                        bottom-5
                        right-0
                        flex
                        h-5
                        w-5
                        items-center
                        justify-center
                        rounded-full
                        text-[#c4bfb6]
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:translate-x-0.5
                        group-hover:text-[#b88638]
                        group-hover:opacity-100
                      "
                    >
                      <ArrowRight
                        size={12}
                      />
                    </div>
                  </Link>
                </motion.div>
              );
            }
          )}
        </AnimatePresence>
      </motion.div>

      {/* ======================================================
          VIEW MORE / SHOW LESS
      ====================================================== */}

      {trendingArticles.length > 5 && (
        <motion.div
          layout
          className="
            border-t
            border-[#eeeae3]
            px-6
            py-5
            sm:px-7
          "
        >
          <motion.button
            type="button"
            onClick={() =>
              setShowAll(
                (prev) => !prev
              )
            }
            whileHover={{
              x: 2,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="
              group
              inline-flex
              items-center
              gap-2.5
              text-[9px]
              font-semibold
              uppercase
              tracking-[1.5px]
              text-[#b88638]
              transition-colors
              duration-300
              hover:text-[#163629]
            "
            aria-expanded={showAll}
          >
            <span>
              {showAll
                ? "Show Less"
                : "View More Trending"}
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
        </motion.div>
      )}

      {/* ======================================================
          BOTTOM BRAND LINE
      ====================================================== */}

      <div
        className="
          h-[2px]
          w-full
          bg-gradient-to-r
          from-transparent
          via-[#b88638]/50
          to-transparent
        "
      />
    </motion.aside>
  );
}