
"use client";

import { useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  TrendingUp,
  Eye,
} from "lucide-react";

// ======================================================
// DATE
// ======================================================

function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(parsed);
}

// ======================================================
// MOST VIEWED INSIGHTS
// ======================================================

export default function TrendingSidebar({
  articles = [],
}) {
  const [showAll, setShowAll] = useState(false);

  // ====================================================
  // SORT BY ACTUAL VIEW COUNT
  // ====================================================

  const popularArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      const viewsA = Number(a.views) || 0;
      const viewsB = Number(b.views) || 0;

      const viewDifference = viewsB - viewsA;

      if (viewDifference !== 0) {
        return viewDifference;
      }

      const dateA = new Date(
        a.publishDate || a.createdAt || 0
      ).getTime();

      const dateB = new Date(
        b.publishDate || b.createdAt || 0
      ).getTime();

      return dateB - dateA;
    });
  }, [articles]);

  const displayedArticles = showAll
    ? popularArticles
    : popularArticles.slice(0, 5);

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <aside className="
      overflow-hidden
      rounded-[24px]
      border
      border-[#e8e1d6]
      bg-white
      shadow-[0_12px_35px_rgba(22,54,41,.06)]
    ">

      {/* HEADER */}

      <div className="
        relative
        overflow-hidden
        bg-gradient-to-br
        from-[#163629]
        via-[#183d2e]
        to-[#0d281e]
        px-6
        py-6
      ">

        <div className="
          pointer-events-none
          absolute
          -right-16
          -top-20
          h-44
          w-44
          rounded-full
          bg-[#b88638]/10
          blur-3xl
        " />

        <div className="relative flex items-start justify-between gap-3">

          <div>

            <p className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[2.5px]
              text-[#d8b46b]
            ">
              Property Bouquet
            </p>

            <h3
              className="
                mt-2
                text-[27px]
                leading-tight
                text-white
              "
              style={{
                fontFamily: "Georgia, serif",
              }}
            >
              Most Viewed
            </h3>

            <p className="
              mt-2
              text-[11px]
              leading-6
              text-white/55
            ">
              Insights attracting the most readership.
            </p>

          </div>

          <div className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-[#d8b46b]/25
            bg-[#b88638]/10
            text-[#d8b46b]
          ">
            <TrendingUp size={18} />
          </div>

        </div>

      </div>

      {/* ARTICLES */}

      {displayedArticles.length === 0 ? (

        <div className="px-6 py-10 text-center">

          <p className="text-sm text-[#888]">
            No other insights available yet.
          </p>

        </div>

      ) : (

        <div className="px-5 py-2 sm:px-6">

          {displayedArticles.map((article, index) => {
            const image =
              typeof article.featuredImage === "string"
                ? article.featuredImage.trim()
                : article.featuredImage?.url ||
                  article.featuredImage?.src ||
                  "";

            const views = Number(article.views) || 0;

            return (

              <Link
                key={article._id || article.slug}
                href={`/insights/${article.slug}`}
                className="
                  group
                  flex
                  gap-3
                  border-b
                  border-[#eee9df]
                  py-4
                  last:border-b-0
                "
              >

                {/* RANK */}

                <span className="
                  mt-1
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#e8e1d6]
                  bg-[#faf8f3]
                  text-[9px]
                  font-semibold
                  text-[#163629]
                ">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* IMAGE */}

                <div className="
                  relative
                  h-[72px]
                  w-[88px]
                  shrink-0
                  overflow-hidden
                  rounded-xl
                  bg-[#eeeae1]
                ">

                  {image ? (
                    <Image
                      src={image}
                      alt={article.title}
                      fill
                      sizes="88px"
                      className="
                        object-contain
                        p-0.5
                        transition-transform
                        duration-500
                        group-hover:scale-[1.04]
                      "
                    />
                  ) : (
                    <div className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      bg-[#163629]
                      text-[#d8b46b]
                    ">
                      ✦
                    </div>
                  )}

                </div>

                {/* CONTENT */}

                <div className="min-w-0 flex-1">

                  {article.category && (
                    <p className="
                      truncate
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[1.2px]
                      text-[#b88638]
                    ">
                      {article.category}
                    </p>
                  )}

                  <h4 className="
                    mt-1
                    line-clamp-2
                    text-[12px]
                    font-medium
                    leading-[1.5]
                    text-[#163629]
                    transition-colors
                    group-hover:text-[#a77b27]
                  ">
                    {article.title}
                  </h4>

                  <div className="
                    mt-2
                    flex
                    flex-wrap
                    items-center
                    gap-x-3
                    gap-y-1
                    text-[9px]
                    text-[#999]
                  ">

                    <span className="flex items-center gap-1">
                      <CalendarDays
                        size={10}
                        className="text-[#b88638]"
                      />
                      {formatDate(
                        article.publishDate ||
                        article.createdAt
                      )}
                    </span>

                    <span className="flex items-center gap-1">
                      <Eye
                        size={10}
                        className="text-[#b88638]"
                      />
                      {views.toLocaleString("en-IN")} views
                    </span>

                  </div>

                </div>

                {/* ARROW */}

                <span className="
                  mt-auto
                  mb-1
                  shrink-0
                  text-[#b8ad9b]
                  transition-all
                  group-hover:translate-x-1
                  group-hover:text-[#b88638]
                ">
                  <ArrowRight size={14} />
                </span>

              </Link>
            );
          })}

        </div>

      )}

      {/* VIEW MORE */}

      {popularArticles.length > 5 && (
        <div className="
          border-t
          border-[#eee9df]
          px-6
          py-4
        ">

          <button
            type="button"
            onClick={() =>
              setShowAll((current) => !current)
            }
            className="
              inline-flex
              items-center
              gap-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[1.3px]
              text-[#b88638]
              transition-colors
              hover:text-[#163629]
            "
          >

            {showAll
              ? "Show Less"
              : "View More Articles"}

            <ArrowRight size={13} />

          </button>

        </div>
      )}

    </aside>
  );
}
