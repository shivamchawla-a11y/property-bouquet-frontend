
import Image from "next/image";
import Link from "next/link";

import {
  ChevronDown,
  ArrowRight,
  Clock3,
  CalendarDays,
} from "lucide-react";

// ======================================================
// DATE FORMATTER
// ======================================================

function formatPublishDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(parsedDate);
}

// ======================================================
// KNOWLEDGE GRID
// SERVER COMPONENT
// ======================================================

export default function KnowledgeGrid({
  articles = [],
}) {

  return (
    <section>

      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-end
          md:justify-between
          gap-6
          mb-10
        "
      >

        <div className="min-w-0">

          <p
            className="
              uppercase
              tracking-[4px]
              text-[#b88638]
              text-xs
              font-semibold
            "
          >
            Knowledge Library
          </p>

          <h2
            className="
              mt-3
              text-4xl
              sm:text-5xl
              text-[#163629]
            "
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            Explore Knowledge Articles
          </h2>

          <p
            className="
              mt-4
              text-[#6f6f6f]
              max-w-2xl
              leading-8
            "
          >
            Curated articles, buying guides,
            investment strategies, legal advice and
            market insights to help you make
            informed real estate decisions.
          </p>

        </div>

        {/* LATEST LABEL */}

        <div
          className="
            hidden
            md:flex
            items-center
            gap-2
            rounded-full
            border
            border-[#e6dfd4]
            bg-white
            px-5
            py-3
            text-[#163629]
            shadow-sm
            shrink-0
          "
          aria-label="Articles sorted by latest"
        >

          Latest

          <ChevronDown
            size={18}
            aria-hidden="true"
          />

        </div>

      </div>

      {/* ==================================================
          EMPTY STATE
      ================================================== */}

      {articles.length === 0 ? (

        <div
          className="
            rounded-[32px]
            bg-white
            border
            border-[#ece7dc]
            py-24
            text-center
          "
        >

          <h3
            className="text-3xl text-[#163629]"
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            No Articles Found
          </h3>

          <p className="mt-4 text-[#777]">
            Articles will appear here once they are
            published.
          </p>

        </div>

      ) : (

        /* ==================================================
           ARTICLE GRID
        ================================================== */

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-8
          "
        >

          {articles.map((article) => {

            const publishDate = formatPublishDate(
              article.publishDate
            );

            const imageAvailable =
              typeof article.featuredImage === "string" &&
              article.featuredImage.trim().length > 0;

            return (

              <Link
                key={article._id || article.slug}
                href={`/knowledge/${article.slug}`}
                className="
                  group
                  block
                  h-full
                  rounded-[32px]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#b88638]
                  focus-visible:ring-offset-4
                "
              >

                <article
                  className="
                    h-full
                    overflow-hidden
                    rounded-[32px]
                    bg-white
                    border
                    border-[#ebe5da]
                    shadow-[0_12px_40px_rgba(0,0,0,.05)]
                    hover:shadow-[0_30px_70px_rgba(0,0,0,.10)]
                    hover:-translate-y-2
                    transition-all
                    duration-500
                  "
                >

                  {/* ==================================================
                      ARTICLE IMAGE
                  ================================================== */}

                  <div
                    className="
                      relative
                      h-64
                      overflow-hidden
                      bg-[#eeeae2]
                    "
                  >

                    {imageAvailable ? (

                      <Image
                        src={article.featuredImage}
                        alt={
                          article.title ||
                          "Real estate knowledge article"
                        }
                        fill
                        sizes="
                          (max-width: 767px) calc(100vw - 3rem),
                          (max-width: 1279px) 40vw,
                          28vw
                        "
                        quality={75}
                        loading="lazy"
                        className="
                          object-cover
                          transition-transform
                          duration-700
                          group-hover:scale-105
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
                          from-[#163629]
                          to-[#081b14]
                          text-[#c9a64b]
                        "
                        aria-label="Article image unavailable"
                      >

                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M12 7v14" />
                          <path d="M3 18V5a2 2 0 0 1 2-2h3a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3a2 2 0 0 1 2 2v13" />
                        </svg>

                      </div>

                    )}

                    {/* DARK IMAGE OVERLAY */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/50
                        via-transparent
                        to-transparent
                        pointer-events-none
                      "
                      aria-hidden="true"
                    />

                    {/* CATEGORY */}

                    {article.category && (

                      <span
                        className="
                          absolute
                          top-5
                          left-5
                          rounded-full
                          bg-white/95
                          backdrop-blur
                          px-4
                          py-2
                          text-[11px]
                          uppercase
                          tracking-[2px]
                          font-semibold
                          text-[#163629]
                        "
                      >
                        {article.category}
                      </span>

                    )}

                  </div>

                  {/* ==================================================
                      ARTICLE CONTENT
                  ================================================== */}

                  <div className="relative p-7">

                    {/* GOLD LINE */}

                    <div
                      className="
                        w-14
                        h-[2px]
                        bg-[#b88638]
                        rounded-full
                        mb-6
                      "
                    />

                    {/* TITLE */}

                    <h3
                      className="
                        text-[28px]
                        leading-[38px]
                        text-[#163629]
                        group-hover:text-[#b88638]
                        transition-colors
                        duration-300
                      "
                      style={{
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {article.title}
                    </h3>

                    {/* DESCRIPTION */}

                    {article.shortDescription && (

                      <p
                        className="
                          mt-5
                          text-[#666]
                          leading-8
                          line-clamp-3
                        "
                      >
                        {article.shortDescription}
                      </p>

                    )}

                    {/* ==================================================
                        ARTICLE FOOTER
                    ================================================== */}

                    <div
                      className="
                        mt-8
                        pt-6
                        border-t
                        border-[#efe8dc]
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >

                      {/* ARTICLE META */}

                      <div className="space-y-2 text-sm text-[#777]">

                        {/* READING TIME */}

                        {article.readTime && (

                          <div className="flex items-center gap-2">

                            <Clock3
                              size={15}
                              className="text-[#b88638]"
                              aria-hidden="true"
                            />

                            <span>
                              {article.readTime} min read
                            </span>

                          </div>

                        )}

                        {/* PUBLISH DATE */}

                        {publishDate && (

                          <div className="flex items-center gap-2">

                            <CalendarDays
                              size={15}
                              className="text-[#b88638]"
                              aria-hidden="true"
                            />

                            <time dateTime={article.publishDate}>
                              {publishDate}
                            </time>

                          </div>

                        )}

                      </div>

                      {/* READ MORE ICON */}

                      <div
                        className="
                          w-12
                          h-12
                          rounded-full
                          bg-[#163629]
                          text-white
                          flex
                          items-center
                          justify-center
                          shrink-0
                          group-hover:bg-[#b88638]
                          group-hover:rotate-45
                          transition-all
                          duration-300
                        "
                        aria-hidden="true"
                      >

                        <ArrowRight size={18} />

                      </div>

                    </div>

                  </div>

                </article>

              </Link>

            );

          })}

        </div>

      )}

    </section>
  );
}
