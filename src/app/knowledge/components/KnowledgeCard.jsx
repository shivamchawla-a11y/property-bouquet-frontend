
import Image from "next/image";
import Link from "next/link";

import {
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
// KNOWLEDGE ARTICLE CARD
// ======================================================

export default function KnowledgeCard({
  image,
  badge,
  title,
  description,
  href = "#",
  readTime,
  publishDate,
}) {
  const formattedDate = formatPublishDate(publishDate);

  const imageAvailable =
    typeof image === "string" &&
    image.trim().length > 0;

  return (
    <Link
      href={href}
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

      <article
        className="
          flex
          h-full
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-[#ebe5da]
          bg-white
          shadow-[0_8px_30px_rgba(0,0,0,0.04)]
          transition-all
          duration-300
          group-hover:-translate-y-1
          group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.10)]
        "
      >

        {/* ==================================================
            ARTICLE IMAGE
            CATEGORY IS NOT OVERLAID ON THE IMAGE
        ================================================== */}

        <div
          className="
            relative
            aspect-[16/10]
            w-full
            shrink-0
            overflow-hidden
            border-b
            border-[#eee8df]
            bg-[#f3f0ea]
          "
        >

          {imageAvailable ? (

            <Image
              src={image}
              alt={title || "Knowledge article"}
              fill
              sizes="
                (max-width: 767px) 100vw,
                (max-width: 1279px) 45vw,
                28vw
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

            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-gradient-to-br
                from-[#163629]
                to-[#07111d]
                text-[#c9a64b]
              "
            >
              <span
                className="text-5xl"
                aria-hidden="true"
              >
                ✦
              </span>
            </div>

          )}

        </div>

        {/* ==================================================
            ARTICLE CONTENT
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

          {/* CATEGORY BADGE - BELOW IMAGE */}

          {badge && (

            <div className="mb-4">

              <span
                className="
                  inline-flex
                  max-w-full
                  items-center
                  rounded-full
                  border
                  border-[#e8dfca]
                  bg-[#faf6ed]
                  px-3
                  py-1.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[1.4px]
                  text-[#987126]
                "
              >
                <span className="truncate">
                  {badge}
                </span>
              </span>

            </div>

          )}

          {/* GOLD DIVIDER */}

          <div
            className="
              mb-4
              h-[2px]
              w-12
              rounded-full
              bg-[#b88638]
              transition-all
              duration-300
              group-hover:w-20
            "
          />

          {/* TITLE */}

          <h3
            className="
              line-clamp-3
              text-[22px]
              leading-[1.3]
              text-[#163629]
              transition-colors
              duration-300
              group-hover:text-[#a77b27]
              sm:text-[24px]
            "
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            {title}
          </h3>

          {/* DESCRIPTION */}

          {description && (

            <p
              className="
                mt-3
                line-clamp-3
                text-[13px]
                leading-7
                text-[#777]
                sm:text-sm
              "
            >
              {description}
            </p>

          )}

          {/* ==================================================
              ARTICLE FOOTER
          ================================================== */}

          <div
            className="
              mt-auto
              flex
              items-end
              justify-between
              gap-3
              border-t
              border-[#eee8df]
              pt-5
              mt-6
            "
          >

            {/* META */}

            <div
              className="
                space-y-2
                text-xs
                text-[#777]
              "
            >

              {/* READING TIME */}

              {readTime && (

                <div className="flex items-center gap-2">

                  <Clock3
                    size={14}
                    className="shrink-0 text-[#b88638]"
                    aria-hidden="true"
                  />

                  <span>
                    {readTime} min read
                  </span>

                </div>

              )}

              {/* PUBLISH DATE */}

              {formattedDate && (

                <div className="flex items-center gap-2">

                  <CalendarDays
                    size={14}
                    className="shrink-0 text-[#b88638]"
                    aria-hidden="true"
                  />

                  <time dateTime={publishDate}>
                    {formattedDate}
                  </time>

                </div>

              )}

            </div>

            {/* READ MORE ICON */}

            <span
              className="
                flex
                h-10
                w-10
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
              "
              aria-hidden="true"
            >
              <ArrowRight size={17} />
            </span>

          </div>

        </div>

      </article>

    </Link>
  );
}
