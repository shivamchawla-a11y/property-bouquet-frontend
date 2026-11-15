
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Clock3,
} from "lucide-react";

// ======================================================
// DATE FORMATTER
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
// LATEST INSIGHTS
// ======================================================

export default function LatestInsights({
  articles = [],
  onClearFilters,
}) {
  const [visibleCount, setVisibleCount] = useState(6);

  // Reset pagination when the filtered result set changes.

  useEffect(() => {
    setVisibleCount(6);
  }, [articles]);

  const visibleArticles = articles.slice(
    0,
    visibleCount
  );

  const hasMore =
    articles.length > visibleArticles.length;

  // ====================================================
  // EMPTY STATE
  // ====================================================

  if (!articles.length) {
    return (
      <div className="
        rounded-2xl
        border
        border-[#e8e1d6]
        bg-white
        px-6
        py-16
        text-center
      ">

        <div className="
          mx-auto
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-[#f4efe5]
          text-2xl
          text-[#b88638]
        ">
          ✦
        </div>

        <h3
          className="mt-5 text-2xl text-[#163629]"
          style={{
            fontFamily: "Georgia, serif",
          }}
        >
          No Matching Insights
        </h3>

        <p className="
          mx-auto
          mt-3
          max-w-md
          text-sm
          leading-7
          text-[#777]
        ">
          Try another category or search term to discover
          more Property Bouquet insights.
        </p>

        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="
              mt-6
              rounded-full
              bg-[#163629]
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              transition-colors
              hover:bg-[#214a39]
            "
          >
            Clear Filters
          </button>
        )}

      </div>
    );
  }

  // ====================================================
  // MAIN
  // ====================================================

  return (
    <section>

      {/* SECTION HEADER */}

      <div className="
        mb-6
        flex
        items-end
        justify-between
        gap-4
      ">

        <div>

          <p className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[2.5px]
            text-[#b88638]
          ">
            Continue Reading
          </p>

          <h3
            className="
              mt-2
              text-2xl
              text-[#163629]
              sm:text-3xl
            "
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            Latest Insights
          </h3>

        </div>

        <span className="shrink-0 text-xs text-[#888]">
          {articles.length}{" "}
          {articles.length === 1 ? "article" : "articles"}
        </span>

      </div>

      {/* ARTICLE GRID */}

      <div className="
        grid
        grid-cols-1
        gap-5
        sm:grid-cols-2
      ">

        {visibleArticles.map((article) => {
          const image =
            typeof article.featuredImage === "string"
              ? article.featuredImage.trim()
              : article.featuredImage?.url ||
                article.featuredImage?.src ||
                "";

          const publishDate = formatDate(
            article.publishDate || article.createdAt
          );

          return (
            <Link
              href={`/insights/${article.slug}`}
              key={article._id || article.slug}
              className="
                group
                block
                h-full
                rounded-2xl
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#b88638]
                focus-visible:ring-offset-4
              "
            >

              <article className="
                flex
                h-full
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-[#e8e1d6]
                bg-white
                shadow-[0_8px_28px_rgba(22,54,41,.04)]
                transition-all
                duration-300
                group-hover:-translate-y-1
                group-hover:shadow-[0_18px_40px_rgba(22,54,41,.10)]
              ">

                {/* IMAGE */}

                <div className="
                  relative
                  aspect-[16/10]
                  w-full
                  overflow-hidden
                  bg-[#f0ede6]
                ">

                  {image ? (
                    <Image
                      src={image}
                      alt={article.title}
                      fill
                      sizes="
                        (max-width: 639px) 100vw,
                        (max-width: 1023px) 50vw,
                        40vw
                      "
                      quality={80}
                      loading="lazy"
                      className="
                        object-contain
                        p-1
                        transition-transform
                        duration-500
                        group-hover:scale-[1.02]
                      "
                    />
                  ) : (
                    <div className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      bg-gradient-to-br
                      from-[#163629]
                      to-[#0b2119]
                      text-4xl
                      text-[#d8b46b]
                    ">
                      ✦
                    </div>
                  )}

                </div>

                {/* CONTENT */}

                <div className="
                  flex
                  flex-1
                  flex-col
                  p-5
                ">

                  {/* CATEGORY */}

                  {article.category && (
                    <div className="mb-4">

                      <span className="
                        inline-flex
                        max-w-full
                        rounded-full
                        border
                        border-[#e8dfca]
                        bg-[#faf6ed]
                        px-3
                        py-1.5
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[1.3px]
                        text-[#987126]
                      ">
                        {article.category}
                      </span>

                    </div>
                  )}

                  {/* DATE */}

                  {publishDate && (
                    <div className="
                      flex
                      items-center
                      gap-2
                      text-[10px]
                      text-[#999]
                    ">

                      <CalendarDays
                        size={13}
                        className="text-[#b88638]"
                      />

                      <time dateTime={article.publishDate || article.createdAt}>
                        {publishDate}
                      </time>

                    </div>
                  )}

                  {/* TITLE */}

                  <h4
                    className="
                      mt-3
                      line-clamp-3
                      text-[20px]
                      leading-[1.32]
                      text-[#163629]
                      transition-colors
                      group-hover:text-[#a77b27]
                      sm:text-[21px]
                    "
                    style={{
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {article.title}
                  </h4>

                  {/* GOLD DIVIDER */}

                  <div className="
                    mt-4
                    h-px
                    w-10
                    bg-[#b88638]
                  " />

                  {/* DESCRIPTION */}

                  {article.shortDescription && (
                    <p className="
                      mt-4
                      line-clamp-3
                      text-[12px]
                      leading-7
                      text-[#777]
                    ">
                      {article.shortDescription}
                    </p>
                  )}

                  {/* META + CTA */}

                  <div className="
                    mt-auto
                    flex
                    items-end
                    justify-between
                    gap-3
                    border-t
                    border-[#eee9df]
                    pt-5
                    mt-5
                  ">

                    {article.readTime ? (
                      <span className="
                        flex
                        items-center
                        gap-2
                        text-[10px]
                        text-[#888]
                      ">
                        <Clock3
                          size={13}
                          className="text-[#b88638]"
                        />
                        {article.readTime} min read
                      </span>
                    ) : (
                      <span />
                    )}

                    <span className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#163629]
                      text-white
                      transition-all
                      duration-300
                      group-hover:rotate-45
                      group-hover:bg-[#b88638]
                    ">
                      <ArrowRight size={16} />
                    </span>

                  </div>

                </div>

              </article>

            </Link>
          );
        })}

      </div>

      {/* LOAD MORE */}

      {hasMore && (
        <div className="mt-8 flex justify-center">

          <button
            type="button"
            onClick={() =>
              setVisibleCount((current) => current + 6)
            }
            className="
              inline-flex
              items-center
              gap-3
              rounded-full
              border
              border-[#163629]
              bg-white
              px-7
              py-3
              text-xs
              font-semibold
              uppercase
              tracking-[1.2px]
              text-[#163629]
              transition-all
              hover:bg-[#163629]
              hover:text-white
            "
          >
            Load More Insights

            <ArrowRight size={15} />

          </button>

        </div>
      )}

    </section>
  );
}
