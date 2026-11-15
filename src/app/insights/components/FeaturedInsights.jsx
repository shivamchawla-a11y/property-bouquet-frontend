
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Sparkles,
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
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(parsed);
}

// ======================================================
// FEATURED INSIGHTS
// ======================================================

export default function FeaturedInsights({
  article,
}) {
  if (!article) return null;

  const isFeatured =
    article.featured === true ||
    article.featured === "true";

  const articleHref =
    `/insights/${article.slug}`;

  const publishDate = formatDate(
    article.publishDate || article.createdAt
  );

  const imageUrl =
    typeof article.featuredImage === "string"
      ? article.featuredImage.trim()
      : article.featuredImage?.url ||
        article.featuredImage?.src ||
        "";

  return (
    <section>

      {/* SECTION HEADER */}

      <div className="
        mb-7
        flex
        flex-wrap
        items-end
        justify-between
        gap-4
      ">

        <div>

          <div className="flex items-center gap-3">

            <span className="h-px w-8 bg-[#b88638]" />

            <p className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[3px]
              text-[#b88638]
            ">
              Property Bouquet Research
            </p>

          </div>

          <h2
            className="
              mt-3
              text-3xl
              text-[#163629]
              sm:text-4xl
            "
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            Featured Insight
          </h2>

          <p className="
            mt-2
            max-w-xl
            text-sm
            leading-7
            text-[#777]
          ">
            A selected perspective on the luxury real estate market.
          </p>

        </div>

        <span className="
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-[#e6dfd3]
          bg-white
          px-4
          py-2
          text-[10px]
          font-semibold
          uppercase
          tracking-[1px]
          text-[#163629]
        ">

          <Sparkles
            size={13}
            className="text-[#b88638]"
          />

          {isFeatured ? "Editor's Pick" : "Latest Story"}

        </span>

      </div>

      {/* FEATURED CARD */}

      <article className="
        grid
        overflow-hidden
        rounded-[26px]
        border
        border-[#e8e1d6]
        bg-white
        shadow-[0_20px_65px_rgba(22,54,41,.08)]
        lg:grid-cols-[1.15fr_0.85fr]
        lg:rounded-[32px]
      ">

        {/* IMAGE */}

        <Link
          href={articleHref}
          className="
            group
            relative
            block
            min-h-[260px]
            overflow-hidden
            bg-[#eeeae1]
            sm:min-h-[380px]
            lg:min-h-[470px]
          "
        >

          {imageUrl ? (

            <Image
              src={imageUrl}
              alt={article.title}
              fill
              priority
              sizes="
                (max-width: 1023px) 100vw,
                60vw
              "
              quality={85}
              className="
                object-contain
                p-1
                transition-transform
                duration-700
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
              to-[#07111d]
              text-[#d8b46b]
            ">
              <Sparkles size={42} />
            </div>

          )}

        </Link>

        {/* CONTENT */}

        <div className="
          relative
          flex
          flex-col
          justify-center
          bg-gradient-to-br
          from-[#163629]
          via-[#183d2e]
          to-[#0d281e]
          p-6
          sm:p-9
          lg:p-10
        ">

          {/* DECORATIVE GLOW */}

          <div className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-64
            w-64
            rounded-full
            bg-[#b88638]/10
            blur-3xl
          " />

          <div className="relative">

            {/* CATEGORY */}

            <span className="
              inline-flex
              max-w-full
              rounded-full
              border
              border-[#d8b46b]/30
              bg-white/[0.06]
              px-3
              py-1.5
              text-[9px]
              font-semibold
              uppercase
              tracking-[1.8px]
              text-[#e1bd78]
            ">
              {article.category || "Luxury Real Estate"}
            </span>

            {/* DATE + READING TIME */}

            <div className="
              mt-6
              flex
              flex-wrap
              gap-x-5
              gap-y-2
              text-[11px]
              text-white/55
            ">

              {publishDate && (
                <span className="flex items-center gap-2">
                  <CalendarDays size={14} className="text-[#d8b46b]" />
                  {publishDate}
                </span>
              )}

              {article.readTime && (
                <span className="flex items-center gap-2">
                  <Clock3 size={14} className="text-[#d8b46b]" />
                  {article.readTime} min read
                </span>
              )}

            </div>

            {/* TITLE */}

            <h3
              className="
                mt-5
                text-[27px]
                leading-[1.2]
                text-white
                sm:text-[32px]
                xl:text-[36px]
              "
              style={{
                fontFamily: "Georgia, serif",
              }}
            >
              {article.title}
            </h3>

            {/* GOLD DIVIDER */}

            <div className="
              mt-6
              h-px
              w-12
              bg-[#c9a45f]
            " />

            {/* DESCRIPTION */}

            {article.shortDescription && (
              <p className="
                mt-5
                line-clamp-4
                text-[13px]
                leading-7
                text-white/65
                sm:text-sm
              ">
                {article.shortDescription}
              </p>
            )}

            {/* AUTHOR */}

            {article.author && (
              <p className="
                mt-6
                text-[10px]
                uppercase
                tracking-[1.5px]
                text-white/40
              ">
                By {article.author}
              </p>
            )}

            {/* CTA */}

            <Link
              href={articleHref}
              className="
                group/read
                mt-8
                inline-flex
                h-12
                w-fit
                items-center
                gap-3
                rounded-full
                bg-[#d8b46b]
                px-6
                text-[11px]
                font-semibold
                uppercase
                tracking-[1.2px]
                text-[#14281e]
                transition-all
                hover:-translate-y-0.5
                hover:bg-white
              "
            >

              Read Featured Insight

              <ArrowRight
                size={15}
                className="transition-transform group-hover/read:translate-x-1"
              />

            </Link>

          </div>

        </div>

      </article>

    </section>
  );
}
