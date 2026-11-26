
import Image from "next/image";
import Link from "next/link";

import {
  Clock3,
  CalendarDays,
  User,
  ChevronRight,
} from "lucide-react";

// ======================================================
// DATE FORMATTER
// ======================================================

function getDateInfo(value) {
  if (!value) return null;

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return {
    iso: parsedDate.toISOString(),

    formatted: new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(parsedDate),
  };
}

// ======================================================
// ARTICLE HERO
// SERVER COMPONENT
// ======================================================

export default function ArticleHero({ article }) {
  if (!article) return null;

  // VISIBLE ARTICLE TITLE
  // Keep the editorial title separate from SEO meta title.

  const articleTitle =
    article.title ||
    article.name ||
    "Real Estate Knowledge";

  // IMAGE
  // The server page already normalizes this URL.

  const articleImage =
    typeof article.featuredImage === "string" &&
    article.featuredImage.trim()
      ? article.featuredImage
      : null;

  const imageAlt =
    article.featuredImageAlt ||
    articleTitle;

  // DESCRIPTION

  const description =
    article.shortDescription ||
    article.description ||
    article.excerpt ||
    "";

  // AUTHOR

  const authorName =
    article.author ||
    "Property Bouquet Research Team";

  const authorDesignation =
    article.authorDesignation ||
    "Property Bouquet Research";

  // DATE

  const dateInfo = getDateInfo(
    article.publishDate ||
    article.publishedAt ||
    article.createdAt
  );

  return (
    <section className="
      bg-gradient-to-b
      from-[#f7f4ee]
      via-[#faf8f4]
      to-[#fcfbf8]
      pt-24
      lg:pt-28
      pb-16
      lg:pb-24
    ">

      <div className="
        max-w-[1450px]
        mx-auto
        px-5
        lg:px-8
      ">

        <div className="
          relative
          overflow-hidden
          rounded-[28px]
          lg:rounded-[40px]
          border
          border-[#ebe4d7]
          bg-gradient-to-br
          from-[#fcfaf6]
          via-[#faf7f2]
          to-[#f5f0e7]
          shadow-[0_35px_90px_rgba(0,0,0,.08)]
          p-6
          sm:p-8
          md:p-12
          lg:p-14
        ">

          {/* ==================================================
              BACKGROUND GLOW
          ================================================== */}

          <div
            className="
              absolute
              -top-32
              -left-32
              w-[340px]
              h-[340px]
              rounded-full
              bg-[#d9b46f]/10
              blur-3xl
              pointer-events-none
            "
            aria-hidden="true"
          />

          <div
            className="
              absolute
              -bottom-32
              -right-32
              w-[340px]
              h-[340px]
              rounded-full
              bg-[#163629]/5
              blur-3xl
              pointer-events-none
            "
            aria-hidden="true"
          />

          {/* DECORATIVE RINGS */}

          <div
            className="
              absolute
              top-10
              right-10
              opacity-40
              pointer-events-none
              hidden
              md:block
            "
            aria-hidden="true"
          >
            <div className="
              w-20 h-20
              rounded-full
              border
              border-[#d6b16c]
            " />

            <div className="
              absolute
              top-4
              left-4
              w-20
              h-20
              rounded-full
              border
              border-[#d6b16c]
            " />
          </div>

          {/* ==================================================
              MAIN GRID
          ================================================== */}

          <div className={`
            relative
            grid
            ${articleImage
              ? "lg:grid-cols-[1.05fr_.95fr]"
              : "lg:grid-cols-1"}
            gap-10
            lg:gap-16
            items-center
          `}>

            {/* ==================================================
                LEFT CONTENT
            ================================================== */}

            <div className="min-w-0">

              {/* BREADCRUMB */}

              <nav aria-label="Breadcrumb">

                <ol className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                  text-[13px]
                  text-[#8c8c8c]
                ">

                  <li>
                    <Link
                      href="/"
                      className="
                        hover:text-[#163629]
                        transition-colors
                      "
                    >
                      Home
                    </Link>
                  </li>

                  <li aria-hidden="true">
                    <ChevronRight size={14} />
                  </li>

                  <li>
                    <Link
                      href="/knowledge"
                      className="
                        hover:text-[#163629]
                        transition-colors
                      "
                    >
                      Knowledge Centre
                    </Link>
                  </li>

                  <li aria-hidden="true">
                    <ChevronRight size={14} />
                  </li>

                  <li
                    className="
                      text-[#163629]
                      font-medium
                      line-clamp-1
                    "
                    aria-current="page"
                  >
                    {articleTitle}
                  </li>

                </ol>

              </nav>

              {/* GOLD LABEL */}

              <div className="
                flex
                items-center
                gap-4
                mt-6
              ">

                <div className="
                  w-16
                  h-[2px]
                  rounded-full
                  bg-[#b88638]
                " />

                <span className="
                  uppercase
                  tracking-[4px]
                  text-[#b88638]
                  text-xs
                  font-semibold
                ">
                  Property Bouquet
                </span>

              </div>

              {/* CATEGORY */}

              {article.category && (
                <div className="mt-5">

                  <span className="
                    inline-flex
                    items-center
                    rounded-full
                    bg-[#f5ede1]
                    text-[#b88638]
                    px-5
                    py-2
                    uppercase
                    tracking-[2px]
                    text-[11px]
                    font-semibold
                  ">
                    {article.category}
                  </span>

                </div>
              )}

              {/* MAIN ARTICLE TITLE */}

              <h1
                className="
                  mt-6
                  text-[30px]
                  sm:text-[36px]
                  md:text-[40px]
                  lg:text-[42px]
                  xl:text-[46px]
                  leading-[1.15]
                  tracking-[-0.7px]
                  text-[#163629]
                  max-w-[760px]
                  break-words
                "
                style={{
                  fontFamily: "Georgia, serif",
                }}
              >
                {articleTitle}
              </h1>

              {/* DESCRIPTION */}

              {description && (
                <p className="
                  mt-6
                  max-w-[680px]
                  text-[16px]
                  md:text-[18px]
                  leading-8
                  text-[#666]
                ">
                  {description}
                </p>
              )}

              {/* META CARD */}

              <div className="
                mt-8
                rounded-[24px]
                border
                border-[#ece7dc]
                bg-[#ffffffcc]
                p-5
                sm:p-6
                shadow-[0_10px_30px_rgba(0,0,0,.05)]
              ">

                <div className="
                  flex
                  flex-wrap
                  items-center
                  gap-5
                  lg:gap-8
                ">

                  {/* AUTHOR */}

                  <div className="
                    flex
                    items-center
                    gap-3
                  ">

                    <div className="
                      w-12
                      h-12
                      rounded-full
                      bg-[#163629]
                      text-white
                      flex
                      items-center
                      justify-center
                      shrink-0
                    ">
                      <User
                        size={21}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">

                      <p className="
                        font-semibold
                        text-[#163629]
                      ">
                        {authorName}
                      </p>

                      <p className="
                        text-sm
                        text-[#999]
                        mt-1
                      ">
                        {authorDesignation}
                      </p>

                    </div>

                  </div>

                  {/* PUBLICATION DATE */}

                  {dateInfo && (
                    <div className="
                      flex
                      items-center
                      gap-3
                      text-[#555]
                    ">

                      <CalendarDays
                        size={18}
                        className="
                          text-[#b88638]
                          shrink-0
                        "
                        aria-hidden="true"
                      />

                      <time dateTime={dateInfo.iso}>
                        {dateInfo.formatted}
                      </time>

                    </div>
                  )}

                  {/* READING TIME */}

                  {article.readTime && (
                    <div className="
                      flex
                      items-center
                      gap-3
                      text-[#555]
                    ">

                      <Clock3
                        size={18}
                        className="
                          text-[#b88638]
                          shrink-0
                        "
                        aria-hidden="true"
                      />

                      <span>
                        {article.readTime} min read
                      </span>

                    </div>
                  )}

                </div>

              </div>

              {/* GOLD DIVIDER */}

              <div className="
                mt-8
                flex
                items-center
                gap-4
              ">

                <div className="
                  w-24
                  h-[2px]
                  rounded-full
                  bg-[#b88638]
                " />

                <div className="
                  flex-1
                  h-px
                  bg-[#e6ddd1]
                " />

              </div>

            </div>

            {/* ==================================================
                RIGHT FEATURED IMAGE
            ================================================== */}

            {articleImage && (
              <figure className="
                min-w-0
                bg-white
                rounded-[24px]
                lg:rounded-[30px]
                border
                border-[#ece5d9]
                p-3
                sm:p-5
                shadow-[0_30px_70px_rgba(0,0,0,.10)]
              ">

                <div className="
                  relative
                  w-full
                  aspect-[16/10]
                  overflow-hidden
                  rounded-[18px]
                  lg:rounded-[22px]
                  bg-[#f0ece4]
                ">

                  <Image
                    src={articleImage}
                    alt={imageAlt}
                    fill
                    sizes="
                      (max-width: 1023px) calc(100vw - 5rem),
                      (max-width: 1450px) 43vw,
                      650px
                    "
                    quality={75}
                    preload
                    className="
                      object-cover
                      object-center
                    "
                  />

                </div>

                {article.featuredImageCaption && (
                  <figcaption className="
                    mt-3
                    px-2
                    text-center
                    text-sm
                    leading-6
                    text-[#777]
                  ">
                    {article.featuredImageCaption}
                  </figcaption>
                )}

              </figure>
            )}

          </div>

        </div>

      </div>

    </section>
  );
}
