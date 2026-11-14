
import Link from "next/link";

import "@/app/insights/article.css";

// ======================================================
// ARTICLE CONTENT NORMALIZER
// ======================================================

function normalizeArticleContent(content) {
  if (!content) return "";

  return String(content)
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00A0/g, " ");
}

// ======================================================
// PREVIOUS / NEXT NAVIGATION
// SERVER COMPONENT
// ======================================================

export function ArticleNavigation({
  previousArticle,
  nextArticle,
}) {
  if (!previousArticle && !nextArticle) {
    return null;
  }

  return (
    <nav
      aria-label="Article navigation"
      className="
        mt-20
        grid
        grid-cols-1
        md:grid-cols-2
        gap-8
      "
    >

      {/* PREVIOUS ARTICLE */}

      <div>

        {previousArticle && previousArticle.slug && (

          <Link
            href={`/knowledge/${previousArticle.slug}`}
            className="
              block
              h-full
              rounded-[28px]
              border
              border-[#ece7dc]
              bg-[#fcfbf8]
              p-6
              sm:p-8
              hover:-translate-y-1
              hover:shadow-xl
              transition-all
              duration-300
            "
          >

            <p className="uppercase tracking-[3px] text-[11px] text-[#999]">
              Previous Article
            </p>

            <h3
              className="
                mt-5
                text-[22px]
                sm:text-[24px]
                lg:text-[26px]
                leading-[1.4]
                text-[#163629]
              "
              style={{
                fontFamily: "Georgia, serif",
              }}
            >
              {previousArticle.title}
            </h3>

          </Link>

        )}

      </div>

      {/* NEXT ARTICLE */}

      <div>

        {nextArticle && nextArticle.slug && (

          <Link
            href={`/knowledge/${nextArticle.slug}`}
            className="
              block
              h-full
              rounded-[28px]
              border
              border-[#ece7dc]
              bg-[#fcfbf8]
              p-6
              sm:p-8
              text-left
              md:text-right
              hover:-translate-y-1
              hover:shadow-xl
              transition-all
              duration-300
            "
          >

            <p className="uppercase tracking-[3px] text-[11px] text-[#999]">
              Next Article
            </p>

            <h3
              className="
                mt-5
                text-[22px]
                sm:text-[24px]
                lg:text-[26px]
                leading-[1.4]
                text-[#163629]
              "
              style={{
                fontFamily: "Georgia, serif",
              }}
            >
              {nextArticle.title}
            </h3>

          </Link>

        )}

      </div>

    </nav>
  );
}

// ======================================================
// ARTICLE CONTENT
// SERVER COMPONENT
// ======================================================

export default function ArticleContent({
  article,
  navigation,
}) {
  if (!article) return null;

  // ====================================================
  // ARTICLE HTML
  // ====================================================

  const articleContent = normalizeArticleContent(
    article.content
  );

  // ====================================================
  // AUTHOR DETAILS
  // ====================================================

  const authorName =
    article.author || "Property Bouquet";

  const authorInitial =
    authorName.trim().charAt(0).toUpperCase() || "P";

  const authorQuote =
    article.authorQuote ||
    "Knowledge-backed real estate decisions create long-term wealth. Invest with research, not emotions.";

  const authorDesignation =
    article.authorDesignation ||
    "Property Bouquet Research Expert";

  return (
    <div
      className="
        rounded-[34px]
        bg-white
        border
        border-[#ece7dc]
        shadow-[0_40px_120px_rgba(22,54,41,.08)]
        overflow-hidden
      "
    >

      <div
        className="
          px-5
          sm:px-7
          md:px-10
          lg:px-16
          xl:px-20
          py-10
          sm:py-12
          lg:py-20
        "
      >

        {/* ==================================================
            ARTICLE BODY
        ================================================== */}

        <div className="max-w-[680px] mx-auto px-4 sm:px-0 scale-[0.87] origin-top">

          <div
            className="article-content"
            dangerouslySetInnerHTML={{
              __html: articleContent,
            }}
          />

        </div>

        {/* ==================================================
            AUTHOR QUOTE
        ================================================== */}

        <div
          className="
            mt-24
            rounded-[32px]
            bg-gradient-to-br
            from-[#163629]
            to-[#214a39]
            text-white
            p-6
            sm:p-8
            lg:p-12
          "
        >

          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-start
              gap-6
            "
          >

            {/* AUTHOR INITIAL */}

            <div
              className="
                w-16
                h-16
                sm:w-20
                sm:h-20
                rounded-full
                bg-[#b88638]
                flex
                items-center
                justify-center
                text-2xl
                sm:text-3xl
                font-semibold
                shrink-0
              "
              aria-label={`Author ${authorName}`}
            >
              {authorInitial}
            </div>

            {/* AUTHOR INFORMATION */}

            <div className="min-w-0">

              <p
                className="
                  text-[18px]
                  sm:text-[20px]
                  lg:text-[22px]
                  leading-[1.7]
                  italic
                "
                style={{
                  fontFamily: "Georgia, serif",
                }}
              >
                {authorQuote}
              </p>

              <div className="mt-6">

                <h4 className="text-xl font-semibold">
                  {authorName}
                </h4>

                <p className="text-white/70 mt-2">
                  {authorDesignation}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            ARTICLE FEEDBACK
        ================================================== */}

        <div
          className="
            mt-20
            rounded-[28px]
            border
            border-[#ece7dc]
            bg-[#faf8f4]
            p-6
            sm:p-8
            lg:p-10
            flex
            flex-col
            lg:flex-row
            justify-between
            items-center
            gap-8
          "
        >

          <div>

            <h3
              className="
                text-[26px]
                sm:text-[30px]
                lg:text-[34px]
                leading-tight
                text-[#163629]
              "
              style={{
                fontFamily: "Georgia, serif",
              }}
            >
              Was this article helpful?
            </h3>

            <p className="mt-3 text-[#777]">
              We'd love your feedback.
            </p>

          </div>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">

            <button
              type="button"
              className="
                h-11
                sm:h-12
                px-6
                sm:px-8
                text-sm
                sm:text-base
                rounded-full
                border
                border-[#d7d1c7]
                bg-white
                text-[#163629]
                font-medium
                hover:bg-[#163629]
                hover:text-white
                transition-colors
                duration-300
              "
            >
              👍 Yes
            </button>

            <button
              type="button"
              className="
                h-11
                sm:h-12
                px-6
                sm:px-8
                text-sm
                sm:text-base
                rounded-full
                border
                border-[#d7d1c7]
                bg-white
                text-[#163629]
                font-medium
                hover:bg-[#163629]
                hover:text-white
                transition-colors
                duration-300
              "
            >
              👎 No
            </button>

          </div>

        </div>

        {/* ==================================================
            PREVIOUS / NEXT NAVIGATION
            STREAMED INDEPENDENTLY
        ================================================== */}

        {navigation}

      </div>

    </div>
  );
}
