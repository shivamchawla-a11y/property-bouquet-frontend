"use client";

import Link from "next/link";
import "@/app/insights/article.css";

export default function ArticleContent({
  article,
  articles = [],
}) {
  const currentIndex = articles.findIndex(
    (item) => item.slug === article.slug
  );

  const previousArticle =
    currentIndex < articles.length - 1
      ? articles[currentIndex + 1]
      : null;

  const nextArticle =
    currentIndex > 0
      ? articles[currentIndex - 1]
      : null;

  return (
    <div
      className="
      rounded-[34px]
      bg-white
      border
      border-[#ece7dc]
      shadow-[0_30px_80px_rgba(0,0,0,.06)]
      overflow-hidden
      "
    >
      <div className="px-8 lg:px-16 xl:px-20 py-14 lg:py-20">

        {/* ARTICLE */}

        <div className="max-w-[780px] mx-auto">

          <div
            className="article-content"
            dangerouslySetInnerHTML={{
              __html: (article.content || "")
                .replace(/&nbsp;/g, " ")
                .replace(/\u00A0/g, " "),
            }}
          />

        </div>

        {/* AUTHOR QUOTE */}

        <div
          className="
          mt-24
          rounded-[32px]
          bg-gradient-to-br
          from-[#163629]
          to-[#214a39]
          text-white
          p-10
          lg:p-14
          flex
          flex-col
          lg:flex-row
          gap-8
          items-start
          "
        >

          <div
            className="
            w-20
            h-20
            rounded-full
            bg-[#b88638]
            flex
            items-center
            justify-center
            text-3xl
            font-semibold
            shrink-0
            "
          >
            {article.author?.charAt(0)}
          </div>

          <div>

            <p
              className="text-[30px] leading-[50px] italic"
              style={{
                fontFamily: "Georgia, serif",
              }}
            >
              {article.authorQuote ||
                "Knowledge-backed real estate decisions create long-term wealth. Invest with research, not emotions."}
            </p>

            <div className="mt-10">

              <h4 className="text-xl font-semibold">
                {article.author}
              </h4>

              <p className="text-white/70 mt-2">
                {article.authorDesignation ||
                  "Property Bouquet Research Expert"}
              </p>

            </div>

          </div>

        </div>

        {/* HELPFUL */}

        <div
          className="
          mt-20
          rounded-[28px]
          border
          border-[#ece7dc]
          bg-[#faf8f4]
          p-10
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
              className="text-[34px] text-[#163629]"
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

          <div className="flex gap-4">

            <button
              className="
              h-12
              px-8
              rounded-full
              border
              border-[#d7d1c7]
              bg-white
              text-[#163629]
              font-medium
              hover:bg-[#163629]
              hover:text-white
              transition-all
              duration-300
              "
            >
              👍 Yes
            </button>

            <button
              className="
              h-12
              px-8
              rounded-full
              border
              border-[#d7d1c7]
              bg-white
              text-[#163629]
              font-medium
              hover:bg-[#163629]
              hover:text-white
              transition-all
              duration-300
              "
            >
              👎 No
            </button>

          </div>

        </div>

        {/* PREVIOUS / NEXT */}

        {(previousArticle || nextArticle) && (
          <div className="mt-20 grid md:grid-cols-2 gap-8">

            <div>

              {previousArticle && (

                <Link
                  href={`/knowledge/${previousArticle.slug}`}
                  className="
                  block
                  rounded-[28px]
                  border
                  border-[#ece7dc]
                  bg-[#fcfbf8]
                  p-8
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
                    text-[28px]
                    leading-9
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

            <div>

              {nextArticle && (

                <Link
                  href={`/knowledge/${nextArticle.slug}`}
                  className="
                  block
                  rounded-[28px]
                  border
                  border-[#ece7dc]
                  bg-[#fcfbf8]
                  p-8
                  text-right
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
                    text-[28px]
                    leading-9
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

          </div>
        )}

      </div>
    </div>
  );
}