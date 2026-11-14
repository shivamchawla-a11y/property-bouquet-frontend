
import Link from "next/link";
import Image from "next/image";

import {
  ArrowRight,
  Clock3,
} from "lucide-react";

// ======================================================
// RELATED ARTICLES
// SERVER COMPONENT
// ======================================================

export default function RelatedArticles({
  currentArticle,
  articles = [],
}) {

  if (!currentArticle || !Array.isArray(articles)) {
    return null;
  }

  // ====================================================
  // FILTER RELATED ARTICLES
  // ====================================================

  const related = articles
    .filter(
      (item) =>
        item.slug !== currentArticle.slug &&
        item.status === "published" &&
        item.slug
    )
    .slice(0, 3);

  if (!related.length) return null;

  return (
    <section
      className="mt-28"
      aria-labelledby="related-articles-heading"
    >

      {/* ==================================================
          SECTION HEADER
      ================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-end
          sm:justify-between
          gap-5
          mb-10
        "
      >

        <div>

          <p
            className="
              uppercase
              tracking-[4px]
              text-[#b88638]
              text-xs
              font-semibold
            "
          >
            Continue Reading
          </p>

          <h2
            id="related-articles-heading"
            className="
              mt-3
              text-[36px]
              sm:text-[46px]
              text-[#163629]
            "
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            Related Knowledge
          </h2>

        </div>

        {/* VIEW ALL */}

        <Link
          href="/knowledge"
          className="
            hidden
            md:flex
            items-center
            gap-2
            text-[#163629]
            font-semibold
            hover:text-[#b88638]
            transition-colors
            duration-200
            shrink-0
          "
        >

          View All

          <ArrowRight
            size={18}
            aria-hidden="true"
          />

        </Link>

      </div>

      {/* ==================================================
          RELATED ARTICLE GRID
      ================================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-8
        "
      >

        {related.map((item) => {

          const articleImage =
            item.featuredImage ||
            "/knowledge/article-hero.jpg";

          return (

            <Link
              key={item._id || item.slug}
              href={`/knowledge/${item.slug}`}
              className="
                group
                block
                h-full
                rounded-[30px]
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
                  rounded-[30px]
                  bg-white
                  border
                  border-[#ece7dc]
                  shadow-[0_15px_45px_rgba(0,0,0,.05)]
                  hover:-translate-y-2
                  hover:shadow-[0_25px_60px_rgba(0,0,0,.08)]
                  transition-all
                  duration-300
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

                  <Image
                    src={articleImage}
                    alt={
                      item.title ||
                      "Related real estate article"
                    }
                    fill
                    sizes="
                      (max-width: 767px) calc(100vw - 3rem),
                      (max-width: 1279px) 42vw,
                      400px
                    "
                    quality={75}
                    loading="lazy"
                    className="
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />

                  {/* GOLD TOP BORDER */}

                  <div
                    className="
                      absolute
                      top-0
                      left-0
                      right-0
                      h-1
                      bg-gradient-to-r
                      from-[#b88638]
                      via-[#e3c37d]
                      to-[#b88638]
                      pointer-events-none
                    "
                  />

                </div>

                {/* ==================================================
                    ARTICLE CONTENT
                ================================================== */}

                <div className="p-7">

                  {/* CATEGORY */}

                  {item.category && (

                    <span
                      className="
                        inline-flex
                        items-center
                        rounded-full
                        bg-[#f5ede1]
                        px-4
                        py-2
                        text-[11px]
                        uppercase
                        tracking-[2px]
                        font-semibold
                        text-[#b88638]
                      "
                    >
                      {item.category}
                    </span>

                  )}

                  {/* TITLE */}

                  <h3
                    className="
                      mt-5
                      text-[28px]
                      leading-9
                      text-[#163629]
                      group-hover:text-[#b88638]
                      transition-colors
                      duration-200
                    "
                    style={{
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* DESCRIPTION */}

                  {item.shortDescription && (

                    <p
                      className="
                        mt-4
                        text-[#666]
                        leading-7
                        line-clamp-2
                      "
                    >
                      {item.shortDescription}
                    </p>

                  )}

                  {/* ==================================================
                      ARTICLE FOOTER
                  ================================================== */}

                  <div
                    className="
                      mt-7
                      flex
                      items-center
                      justify-between
                    "
                  >

                    {/* READING TIME */}

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-[#777]
                      "
                    >

                      <Clock3
                        size={16}
                        aria-hidden="true"
                      />

                      <span>
                        {item.readTime
                          ? `${item.readTime} min read`
                          : "Read article"}
                      </span>

                    </div>

                    {/* READ MORE */}

                    <span
                      className="
                        flex
                        items-center
                        gap-2
                        text-[#163629]
                        font-semibold
                        group-hover:gap-3
                        transition-all
                        duration-200
                      "
                    >

                      Read

                      <ArrowRight
                        size={17}
                        aria-hidden="true"
                      />

                    </span>

                  </div>

                </div>

              </article>

            </Link>

          );
        })}

      </div>

      {/* MOBILE VIEW ALL */}

      <div className="mt-8 flex justify-center md:hidden">

        <Link
          href="/knowledge"
          className="
            inline-flex
            items-center
            gap-3
            rounded-full
            border
            border-[#e6dfd4]
            bg-white
            px-7
            py-3
            text-[#163629]
            font-semibold
          "
        >
          View All Articles

          <ArrowRight
            size={18}
            aria-hidden="true"
          />

        </Link>

      </div>

    </section>
  );
}
