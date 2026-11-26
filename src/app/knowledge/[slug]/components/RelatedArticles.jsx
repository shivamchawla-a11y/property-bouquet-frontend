
import Link from "next/link";
import Image from "next/image";

import {
  ArrowRight,
  Clock3,
  BookOpen,
} from "lucide-react";

const SITE_URL = "https://propertybouquet.com";

// ======================================================
// NORMALIZE TEXT
// ======================================================

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

// ======================================================
// EXTRACT TAGS
// ======================================================

function getTags(article) {
  const values = [
    article?.tags,
    article?.keywords,
  ];

  const result = [];

  values.forEach((value) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        const tag =
          typeof item === "object"
            ? item?.name || item?.label
            : item;

        if (tag) {
          result.push(normalizeText(tag));
        }
      });
    }

    if (typeof value === "string") {
      value
        .split(",")
        .forEach((item) => {
          if (item.trim()) {
            result.push(normalizeText(item));
          }
        });
    }
  });

  return [...new Set(result.filter(Boolean))];
}

// ======================================================
// SAFE IMAGE URL
// ======================================================

function getSafeImageUrl(image) {
  let value = "";

  if (typeof image === "string") {
    value = image.trim();
  } else if (image && typeof image === "object") {
    value =
      typeof image.url === "string"
        ? image.url.trim()
        : typeof image.src === "string"
          ? image.src.trim()
          : "";
  }

  if (!value || value.startsWith("//")) {
    return null;
  }

  try {
    const parsed = new URL(value, SITE_URL);

    if (!["https:", "http:"].includes(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

// ======================================================
// CHECK PUBLISHED ARTICLE
// ======================================================

function isPublished(article) {
  return (
    String(article?.status || "").toLowerCase() ===
      "published" &&
    article?.isDeleted !== true &&
    article?.isActive !== false &&
    Boolean(article?.slug)
  );
}

// ======================================================
// SCORE RELATED ARTICLE
// ======================================================

function getRelevanceScore(currentArticle, candidate) {
  let score = 0;

  const currentCategory = normalizeText(
    currentArticle?.category
  );

  const candidateCategory = normalizeText(
    candidate?.category
  );

  // Same category receives a stronger match.

  if (
    currentCategory &&
    candidateCategory &&
    currentCategory === candidateCategory
  ) {
    score += 5;
  }

  // Matching tags add relevance.

  const currentTags = new Set(
    getTags(currentArticle)
  );

  const candidateTags = getTags(candidate);

  candidateTags.forEach((tag) => {
    if (currentTags.has(tag)) {
      score += 2;
    }
  });

  return score;
}

// ======================================================
// RELATED ARTICLES
// SERVER COMPONENT
// ======================================================

export default function RelatedArticles({
  currentArticle,
  articles = [],
}) {
  if (
    !currentArticle ||
    !Array.isArray(articles)
  ) {
    return null;
  }

  // ======================================================
  // FILTER PUBLISHED ARTICLES
  // ======================================================

  const candidates = articles.filter(
    (item) =>
      isPublished(item) &&
      normalizeText(item.slug) !==
        normalizeText(currentArticle.slug)
  );

  if (!candidates.length) {
    return null;
  }

  // ======================================================
  // RANK RELATED ARTICLES
  // ======================================================

  const scoredArticles = candidates
    .map((item, index) => ({
      item,
      index,
      score: getRelevanceScore(
        currentArticle,
        item
      ),
    }))
    .sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }

      // Preserve API order when relevance is equal.

      return a.index - b.index;
    });

  const related = scoredArticles
    .slice(0, 3)
    .map((entry) => entry.item);

  if (!related.length) {
    return null;
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <section
      className="mt-20 lg:mt-28"
      aria-labelledby="related-articles-heading"
    >

      {/* SECTION HEADER */}

      <div className="
        flex
        flex-col
        sm:flex-row
        sm:items-end
        sm:justify-between
        gap-5
        mb-8
        lg:mb-10
      ">

        <div>

          <p className="
            uppercase
            tracking-[4px]
            text-[#805b1e]
            text-xs
            font-semibold
          ">
            Continue Reading
          </p>

          <h2
            id="related-articles-heading"
            className="
              mt-3
              text-[34px]
              sm:text-[42px]
              lg:text-[46px]
              text-[#163629]
            "
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            Related Knowledge
          </h2>

          <p className="
            mt-3
            text-[#777]
            text-sm
            sm:text-base
          ">
            Explore more guides and insights from
            Property Bouquet.
          </p>

        </div>

        <Link
          href="/knowledge"
          className="
            hidden
            md:flex
            items-center
            gap-2
            text-[#163629]
            font-semibold
            hover:text-[#805b1e]
            transition-colors
            duration-200
            shrink-0
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#805b1e]
            focus-visible:ring-offset-4
            rounded-sm
          "
        >
          View All

          <ArrowRight
            size={18}
            aria-hidden="true"
          />
        </Link>

      </div>

      {/* RELATED ARTICLE GRID */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
        lg:gap-8
      ">

        {related.map((item) => {
          const articleImage = getSafeImageUrl(
            item.featuredImage ||
            item.coverImage ||
            item.image
          );

          const articleTitle =
            item.title ||
            "Real Estate Knowledge";

          const articleDescription =
            item.shortDescription ||
            item.description ||
            "";

          return (
            <Link
              key={item._id || item.slug}
              href={`/knowledge/${encodeURIComponent(
                item.slug
              )}`}
              aria-label={`Read article: ${articleTitle}`}
              className="
                group
                block
                h-full
                rounded-[30px]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#805b1e]
                focus-visible:ring-offset-4
              "
            >

              <article className="
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
              ">

                {/* ARTICLE IMAGE */}

                <div className="
                  relative
                  aspect-[16/10]
                  overflow-hidden
                  bg-[#eeeae2]
                ">

                  {articleImage ? (
                    <Image
                      src={articleImage}
                      alt={
                        item.featuredImageAlt ||
                        articleTitle
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
                  ) : (
                    <div className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      bg-gradient-to-br
                      from-[#f7f4ee]
                      to-[#e9e1d4]
                    ">
                      <BookOpen
                        size={48}
                        strokeWidth={1.2}
                        className="text-[#b88638]/70"
                        aria-hidden="true"
                      />
                    </div>
                  )}

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
                    aria-hidden="true"
                  />

                </div>

                {/* ARTICLE CONTENT */}

                <div className="p-6 sm:p-7">

                  {item.category && (
                    <span className="
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
                      text-[#805b1e]
                    ">
                      {item.category}
                    </span>
                  )}

                  <h3
                    className="
                      mt-5
                      text-[25px]
                      sm:text-[28px]
                      leading-9
                      text-[#163629]
                      group-hover:text-[#805b1e]
                      transition-colors
                      duration-200
                      line-clamp-3
                    "
                    style={{
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {articleTitle}
                  </h3>

                  {articleDescription && (
                    <p className="
                      mt-4
                      text-[#555555]
                      leading-7
                      line-clamp-3
                    ">
                      {articleDescription}
                    </p>
                  )}

                  <div className="
                    mt-7
                    flex
                    items-center
                    justify-between
                    gap-3
                  ">

                    <div className="
                      flex
                      items-center
                      gap-2
                      text-[#666666]
                      text-sm
                    ">

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

                    <span className="
                      flex
                      items-center
                      gap-2
                      text-[#163629]
                      font-semibold
                      text-sm
                      group-hover:gap-3
                      transition-all
                      duration-200
                    ">
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

      <div className="
        mt-8
        flex
        justify-center
        md:hidden
      ">

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
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#805b1e]
            focus-visible:ring-offset-2
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
