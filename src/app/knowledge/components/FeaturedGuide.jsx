
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
// FEATURED GUIDE
// SERVER COMPONENT
// ======================================================

export default function FeaturedGuide({
  articles = [],
}) {

  // Find featured article or fallback to first article.

  const featured =
    articles.find((article) => article.featured) ||
    articles[0];

  if (!featured) return null;

  const publishDate = formatPublishDate(
    featured.publishDate
  );

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[36px]
        border
        border-[#ece4d8]
        bg-[#fcfbf8]
        shadow-[0_30px_80px_rgba(0,0,0,.08)]
        isolate
      "
    >

      {/* ==================================================
          BACKGROUND GLOW
      ================================================== */}

      <div
        className="
          absolute
          -right-32
          -top-32
          w-[420px]
          h-[420px]
          rounded-full
          bg-[#c8a34d]/[0.08]
          blur-3xl
          pointer-events-none
        "
        aria-hidden="true"
      />

      <div
        className="
          absolute
          -left-20
          bottom-0
          w-[300px]
          h-[300px]
          rounded-full
          bg-[#163629]/[0.05]
          blur-3xl
          pointer-events-none
        "
        aria-hidden="true"
      />

      {/* ==================================================
          MAIN GRID
      ================================================== */}

      <div
        className="
          relative
          grid
          lg:grid-cols-[1.05fr_1.15fr]
          items-center
        "
      >

        {/* ==================================================
            LEFT CONTENT
        ================================================== */}

        <div
          className="
            relative
            z-10
            px-8
            py-10
            lg:px-14
            xl:px-16
            lg:py-14
            min-w-0
          "
        >

          {/* FEATURED BADGE */}

          <div className="flex items-center gap-4">

            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#163629]
                px-5
                py-2
                text-[10px]
                uppercase
                tracking-[3px]
                font-semibold
                text-white
                whitespace-nowrap
              "
            >

              <Sparkles
                size={13}
                aria-hidden="true"
              />

              Featured Guide

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
                mt-8
                text-[11px]
                uppercase
                tracking-[3px]
                font-semibold
                text-[#b88638]
              "
            >
              {featured.category}
            </p>
          )}

          {/* TITLE */}

          <h2
            className="
              mt-4
              text-[34px]
              lg:text-[44px]
              xl:text-[50px]
              leading-[1.12]
              font-light
              text-[#163629]
              break-words
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
                mt-6
                text-[17px]
                leading-8
                text-[#6d6d6d]
                max-w-[560px]
              "
            >
              {featured.shortDescription}
            </p>
          )}

          {/* ==================================================
              ARTICLE META
          ================================================== */}

          <div
            className="
              mt-8
              flex
              flex-wrap
              gap-8
              text-[14px]
              text-[#666]
            "
          >

            {/* READING TIME */}

            {featured.readTime && (
              <div className="flex items-center gap-3">

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

            {/* PUBLISH DATE */}

            {publishDate && (
              <div className="flex items-center gap-3">

                <CalendarDays
                  size={16}
                  className="text-[#b88638]"
                  aria-hidden="true"
                />

                <time
                  dateTime={featured.publishDate}
                >
                  {publishDate}
                </time>

              </div>
            )}

          </div>

          {/* ==================================================
              CTA
          ================================================== */}

          {featured.slug && (
            <div className="mt-10">

              <Link
                href={`/knowledge/${featured.slug}`}
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  bg-[#163629]
                  px-8
                  h-[54px]
                  text-white
                  font-medium
                  hover:bg-[#214a39]
                  transition-colors
                  duration-300
                  shadow-lg
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

        {/* ==================================================
            RIGHT IMAGE
        ================================================== */}

        <div className="relative p-6 lg:p-8">

          <div
            className="
              relative
              h-[340px]
              lg:h-[500px]
              rounded-[30px]
              overflow-hidden
              bg-[#e9e4da]
              shadow-[0_30px_80px_rgba(0,0,0,.18)]
            "
          >

            {/* OPTIMIZED FEATURED IMAGE */}

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
                  (max-width: 1400px) 52vw,
                  640px
                "
                quality={75}
                loading="lazy"
                className="
                  object-cover
                  object-center
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

            {/* IMAGE OVERLAY */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/15
                via-transparent
                to-transparent
                pointer-events-none
              "
              aria-hidden="true"
            />

            {/* PREMIUM GOLD BORDER */}

            <div
              className="
                absolute
                inset-5
                rounded-[24px]
                border
                border-white/20
                pointer-events-none
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
