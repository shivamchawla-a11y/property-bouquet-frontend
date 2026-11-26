
import Link from "next/link";

import ArticleTableOfContents from "./ArticleTableOfContents";

// ======================================================
// ARTICLE NAVIGATION
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
        mt-16
        lg:mt-20
        grid
        grid-cols-1
        md:grid-cols-2
        gap-5
        lg:gap-8
      "
    >

      {/* PREVIOUS ARTICLE */}

      <div>
        {previousArticle?.slug && (
          <Link
            href={`/knowledge/${encodeURIComponent(
              previousArticle.slug
            )}`}
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
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#805b1e]
              focus-visible:ring-offset-2
            "
          >

            <p className="
              uppercase
              tracking-[3px]
              text-[11px]
              text-[#666666]
            ">
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
        {nextArticle?.slug && (
          <Link
            href={`/knowledge/${encodeURIComponent(
              nextArticle.slug
            )}`}
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
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#805b1e]
              focus-visible:ring-offset-2
            "
          >

            <p className="
              uppercase
              tracking-[3px]
              text-[11px]
              text-[#666666]
            ">
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

  const articleContent =
    typeof article.content === "string"
      ? article.content
      : "";

  const articleContentId =
    "knowledge-article-content";

  // ======================================================
  // AUTHOR
  // ======================================================

  const authorName =
    article.author ||
    "Property Bouquet Research Team";

  const authorInitial =
    authorName.trim().charAt(0).toUpperCase() || "P";

  const authorDesignation =
    article.authorDesignation ||
    "Property Bouquet Research";

  // Only show a genuine CMS-provided quote.

  const authorQuote =
    typeof article.authorQuote === "string"
      ? article.authorQuote.trim()
      : "";

  return (
    <div className="
      rounded-[28px]
      lg:rounded-[34px]
      bg-white
      border
      border-[#ece7dc]
      shadow-[0_40px_120px_rgba(22,54,41,.08)]
      overflow-hidden
    ">

      <div className="
        px-5
        sm:px-7
        md:px-10
        lg:px-12
        xl:px-16
        py-10
        sm:py-12
        lg:py-16
        xl:py-20
      ">

        {/* ==================================================
            TABLE OF CONTENTS
        ================================================== */}

        <div className="mb-10">
          <ArticleTableOfContents
            containerId={articleContentId}
          />
        </div>

        {/* ==================================================
            ARTICLE BODY
            SERVER-RENDERED SANITIZED HTML
        ================================================== */}

        <div className="
          knowledge-article-content
          max-w-[760px]
          mx-auto
        ">

          <div
            id={articleContentId}
            className="knowledge-article-body"
            dangerouslySetInnerHTML={{
              __html: articleContent,
            }}
          />

        </div>

        {/* ==================================================
            AUTHOR QUOTE
            ONLY SHOW REAL QUOTES
        ================================================== */}

        {authorQuote && (
          <section className="
            mt-20
            lg:mt-24
            rounded-[28px]
            lg:rounded-[32px]
            bg-gradient-to-br
            from-[#163629]
            to-[#214a39]
            text-white
            p-6
            sm:p-8
            lg:p-12
          ">

            <div className="
              flex
              flex-col
              sm:flex-row
              items-start
              gap-6
            ">

              {/* AUTHOR INITIAL */}

              <div
                aria-hidden="true"
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
              >
                {authorInitial}
              </div>

              <div className="min-w-0">

                <blockquote
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
                </blockquote>

                <div className="mt-6">

                  <h3 className="
                    text-xl
                    font-semibold
                  ">
                    {authorName}
                  </h3>

                  <p className="
                    text-white/80
                    mt-2
                  ">
                    {authorDesignation}
                  </p>

                </div>

              </div>

            </div>

          </section>
        )}

        {/* ==================================================
            PREVIOUS / NEXT NAVIGATION
        ================================================== */}

        {navigation}

      </div>

    </div>
  );
}
