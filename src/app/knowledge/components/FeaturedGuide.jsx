
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Clock3,
  CalendarDays,
  Sparkles,
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
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(parsedDate);
}

// ======================================================
// FEATURED ARTICLE CHECK
// ======================================================

function isFeaturedArticle(article) {
  return (
    article?.featured === true ||
    article?.featured === "true"
  );
}

// ======================================================
// FEATURED GUIDE
// SERVER COMPONENT
// ======================================================

export default function FeaturedGuide({
  articles = [],
}) {

  // Find genuinely featured article.
  // Otherwise use the selected article.

  const featured =
    articles.find(isFeaturedArticle) ||
    articles[0];

  if (!featured) return null;

  const publishDate = formatPublishDate(
    featured.publishDate ||
    featured.createdAt
  );

  const isFeatured = isFeaturedArticle(featured);

  return (
    <section
      className="
        relative
        isolate
        overflow-hidden
        rounded-[28px]
        border
        border-[#ece4d8]
        bg-[#fcfbf8]
        shadow-[0_25px_65px_rgba(0,0,0,.07)]
        sm:rounded-[32px]
      "
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-[420px]
          w-[420px]
          rounded-full
          bg-[#c8a34d]/[0.08]
          blur-3xl
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-20
          -left-20
          h-[300px]
          w-[300px]
          rounded-full
          bg-[#163629]/[0.05]
          blur-3xl
        "
        aria-hidden="true"
      />

      {/* MAIN GRID */}

      <div
        className="
          relative
          grid
          items-center
          lg:grid-cols-[1.05fr_0.95fr]
        "
      >

        {/* LEFT CONTENT */}

        <div
          className="
            relative
            z-10
            min-w-0
            px-6
            py-8
            sm:px-9
            sm:py-10
            lg:px-12
            lg:py-14
            xl:px-16
          "
        >

          {/* BADGE */}

          <div className="flex items-center gap-4">

            <span
              className="
                inline-flex
                shrink-0
                items-center
                gap-2
                rounded-full
                bg-[#163629]
                px-4
                py-2
                text-[9px]
                font-semibold
                uppercase
                tracking-[2px]
                text-white
                sm:px-5
                sm:text-[10px]
                sm:tracking-[3px]
              "
            >

              <Sparkles
                size={13}
                aria-hidden="true"
              />

              {isFeatured
                ? "Featured Guide"
                : "Selected Guide"}

            </span>

            <div
              className="
                h-px
                flex-1
                bg-gradient-to-r
                from-[#c9a64b]
                to-transparent
              "
              aria-hidden="true"
            />

          </div>

          {/* CATEGORY */}

          {featured.category && (
            <p
              className="
                mt-7
                text-[10px]
                font-semibold
                uppercase
                tracking-[3px]
                text-[#b88638]
                sm:mt-8
                sm:text-[11px]
              "
            >
              {featured.category}
            </p>
          )}

          {/* TITLE */}

          <h2
            className="
              mt-4
              break-words
              text-[30px]
              font-light
              leading-[1.15]
              text-[#163629]
              sm:text-[36px]
              lg:text-[42px]
              xl:text-[44px]
            "
            style={{
              fontFamily: "Cormorant Garamond, serif",
            }}
          >
            {featured.title}
          </h2>

          {/* DESCRIPTION */}

          {featured.shortDescription && (
            <p
              className="
                mt-5
                max-w-[560px]
                line-clamp-4
                text-[14px]
                leading-7
                text-[#6d6d6d]
                sm:mt-6
                sm:text-[16px]
                sm:leading-8
              "
            >
              {featured.shortDescription}
            </p>
          )}

          {/* ARTICLE META */}

          <div
            className="
              mt-7
              flex
              flex-wrap
              gap-x-7
              gap-y-3
              text-[12px]
              text-[#666]
              sm:mt-8
              sm:gap-8
              sm:text-[14px]
            "
          >

            {/* READING TIME */}

            {featured.readTime && (
              <div className="flex items-center gap-2">

                <Clock3
                  size={16}
                  className="text-[#b88638]"
                  aria-hidden="true"
                />

                <span>
                  {featured.readTime} min read
                </span>

              </div>
            )}

            {/* PUBLICATION DATE */}

            {publishDate && (
              <div className="flex items-center gap-2">

                <CalendarDays
                  size={16}
                  className="text-[#b88638]"
                  aria-hidden="true"
                />

                <time
                  dateTime={
                    featured.publishDate ||
                    featured.createdAt
                  }
                >
                  {publishDate}
                </time>

              </div>
            )}

          </div>

          {/* CTA */}

          {featured.slug && (
            <div className="mt-8 sm:mt-10">

              <Link
                href={`/knowledge/${featured.slug}`}
                className="
                  group
                  inline-flex
                  h-[50px]
                  items-center
                  gap-3
                  rounded-full
                  bg-[#163629]
                  px-6
                  text-sm
                  font-medium
                  text-white
                  shadow-lg
                  transition-all
                  duration-300
                  hover:bg-[#214a39]
                  sm:h-[54px]
                  sm:px-8
                "
              >

                Read Complete Guide

                <ArrowRight
                  size={18}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                  aria-hidden="true"
                />

              </Link>

            </div>
          )}

        </div>

        {/* RIGHT IMAGE */}

        <div className="relative p-5 sm:p-7 lg:p-8">

          <div
            className="
              relative
              aspect-[16/11]
              max-h-[430px]
              w-full
              overflow-hidden
              rounded-[22px]
              border
              border-[#e9e2d5]
              bg-[#f1eee8]
              shadow-[0_25px_65px_rgba(0,0,0,.12)]
              sm:rounded-[26px]
            "
          >

            {/* ARTICLE IMAGE */}

            {featured.featuredImage ? (

              <Image
                src={featured.featuredImage}
                alt={
                  featured.title ||
                  "Featured real estate guide"
                }
                fill
                sizes="
                  (max-width: 1023px) 100vw,
                  (max-width: 1400px) 45vw,
                  600px
                "
                quality={80}
                loading="lazy"
                className="
                  object-contain
                  p-2
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
              >
                <BookOpenFallback />
              </div>

            )}

            {/* PREMIUM BORDER */}

            <div
              className="
                pointer-events-none
                absolute
                inset-4
                rounded-[18px]
                border
                border-[#c9a64b]/20
                sm:inset-5
                sm:rounded-[22px]
              "
              aria-hidden="true"
            />

          </div>

        </div>

      </div>

    </section>
  );
}

// ======================================================
// IMAGE FALLBACK
// ======================================================

function BookOpenFallback() {
  return (
    <svg
      width="54"
      height="54"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 7v14" />
      <path d="M3 18V5a2 2 0 0 1 2-2h3a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3a2 2 0 0 1 2 2v13" />
      <path d="M3 18a2 2 0 0 0 2 2h3a4 4 0 0 1 4 4" />
    </svg>
  );
}
