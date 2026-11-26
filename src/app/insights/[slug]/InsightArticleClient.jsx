
import Image from "next/image";
import Link from "next/link";

import {
  ChevronRight,
  CalendarDays,
  Clock3,
} from "lucide-react";

import ArticleShareButtons from "./ArticleShareButtons";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

import AboutAuthor from "../components/AboutAuthor";
import TableOfContents from "../components/TableOfContents";
import LatestInsightsSidebar from "../components/LatestInsightsSidebar";
import CTAAdvisor from "../components/CTAAdvisor";
import TagsCard from "../components/TagsCard";

// ============================================================
// DATE HELPERS
// ============================================================

function getSafeDateInfo(value) {
  if (!value) return null;

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return {
    iso: parsedDate.toISOString(),

    formatted: parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ),
  };
}

// ============================================================
// ARTICLE PAGE
// ============================================================

export default function InsightArticleClient({
  article,
  articleContent,
  previousArticle,
  nextArticle,
  latestArticles = [],
}) {
  const articleContentId = "insight-article-content";

  // ==========================================================
  // AUTHOR
  // ==========================================================

  const authorName =
    typeof article?.author === "string" &&
    article.author.trim()
      ? article.author.trim()
      : "Property Bouquet Research Team";

  const authorInitial = authorName
    .charAt(0)
    .toUpperCase();

  const authorDesignation =
    typeof article?.authorDesignation === "string"
      ? article.authorDesignation.trim()
      : "";

  const authorSubtitle =
    authorDesignation ||
    (
      String(article?.authorType || "").toLowerCase() ===
      "person"
        ? ""
        : "Property Bouquet Research Team"
    );

  // ==========================================================
  // SAFE HERO IMAGE
  // ==========================================================

  const hasHeroImage =
    typeof article?.featuredImage === "string" &&
    article.featuredImage.trim().length > 0;

  const heroImageAlt =
    typeof article?.featuredImageAlt === "string" &&
    article.featuredImageAlt.trim()
      ? article.featuredImageAlt.trim()
      : article?.title || "Property Bouquet Insights";

  // ==========================================================
  // PUBLISH DATE
  // ==========================================================

  const publishDate = getSafeDateInfo(
    article?.publishDate
  );

  // ==========================================================
  // AUTHOR QUOTE
  // ==========================================================

  const authorQuote =
    typeof article?.authorQuote === "string"
      ? article.authorQuote.trim()
      : "";

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <Navbar forceSolid />

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="
        bg-gradient-to-b
        from-[#f7f4ee]
        to-[#fcfbf8]
        pt-28
        pb-24
      ">

        <section className="
          max-w-[1400px]
          mx-auto
          px-5
          lg:px-8
        ">

          <div className="
            grid
            lg:grid-cols-[minmax(0,1fr)_360px]
            gap-10
            items-start
          ">

            {/* ==================================================
                LEFT ARTICLE COLUMN
            ================================================== */}

            <article className="
              min-w-0
              bg-white
              rounded-[34px]
              border
              border-[#ece7dc]
              shadow-[0_30px_80px_rgba(0,0,0,.06)]
              overflow-hidden
            ">

              <div className="
                px-6
                sm:px-8
                lg:px-20
                pt-12
                lg:pt-20
                pb-16
                lg:pb-20
              ">

                {/* ==================================================
                    BREADCRUMB
                ================================================== */}

                <nav
                  aria-label="Breadcrumb"
                  className="
                    text-[13px]
                    text-[#8b8b8b]
                  "
                >

                  <ol className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  ">

                    <li>
                      <Link
                        href="/"
                        className="hover:text-[#163629]"
                      >
                        Home
                      </Link>
                    </li>

                    <li aria-hidden="true">
                      <ChevronRight size={14} />
                    </li>

                    <li>
                      <Link
                        href="/insights"
                        className="hover:text-[#163629]"
                      >
                        Property Insights
                      </Link>
                    </li>

                    <li aria-hidden="true">
                      <ChevronRight size={14} />
                    </li>

                    <li
                      className="text-[#163629]"
                      aria-current="page"
                    >
                      {article?.category ||
                        "Property Insights"}
                    </li>

                  </ol>

                </nav>

                {/* ==================================================
                    CATEGORY
                ================================================== */}

                <div className="mt-8">

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

                    {article?.category ||
                      "Property Insights"}

                  </span>

                </div>

                {/* ==================================================
                    MAIN TITLE - SINGLE H1
                ================================================== */}

                <h1
                  className="
                    mt-7
                    text-4xl
                    md:text-5xl
                    xl:text-6xl
                    leading-tight
                    tracking-[-1px]
                    text-[#163629]
                    max-w-[900px]
                  "
                  style={{
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {article?.title}
                </h1>

                {/* ==================================================
                    DESCRIPTION
                ================================================== */}

                {article?.shortDescription && (
                  <p className="
                    mt-8
                    max-w-[820px]
                    text-lg
                    md:text-[21px]
                    leading-9
                    text-[#666]
                  ">

                    {article.shortDescription}

                  </p>
                )}

                {/* ==================================================
                    ARTICLE META
                ================================================== */}

                <div className="
                  mt-12
                  rounded-3xl
                  border
                  border-[#ece7dc]
                  bg-[#faf8f4]
                  p-6
                  lg:p-8
                  !text-[#163629]
                  flex
                  flex-col
                  gap-8
                  xl:flex-row
                  xl:justify-between
                ">

                  <div className="
                    flex
                    flex-wrap
                    items-center
                    gap-6
                    lg:gap-8
                  ">

                    {/* AUTHOR */}

                    <div className="
                      flex
                      items-center
                      gap-4
                    ">

                      <div className="
                        w-14
                        h-14
                        rounded-full
                        bg-[#163629]
                        text-white
                        flex
                        items-center
                        justify-center
                        font-semibold
                        text-lg
                        shrink-0
                      ">

                        {authorInitial}

                      </div>

                      <div className="min-w-0">

                        <p className="font-semibold">

                          {authorName}

                        </p>

                        {authorSubtitle && (
                          <p className="
                            text-sm
                            text-[#888]
                            mt-1
                          ">

                            {authorSubtitle}

                          </p>
                        )}

                      </div>

                    </div>

                    {/* PUBLISH DATE */}

                    {publishDate && (
                      <div className="
                        flex
                        items-center
                        gap-2
                        text-[#666]
                      ">

                        <CalendarDays
                          size={16}
                        />

                        <time dateTime={publishDate.iso}>
                          {publishDate.formatted}
                        </time>

                      </div>
                    )}

                    {/* READ TIME */}

                    {article?.readTime && (
                      <div className="
                        flex
                        items-center
                        gap-2
                        text-[#666]
                      ">

                        <Clock3
                          size={16}
                        />

                        <span>
                          {article.readTime} min read
                        </span>

                      </div>
                    )}

                  </div>

                  {/* SHARE BUTTONS */}

                  <ArticleShareButtons
                    articleTitle={article?.title || ""}
                  />

                </div>

                {/* ==================================================
                    FEATURED HERO IMAGE
                ================================================== */}

                {hasHeroImage && (
                  <div className="mt-12 lg:mt-16">

                    <figure className="
                      relative
                      overflow-hidden
                      rounded-[24px]
                      lg:rounded-[36px]
                      border
                      border-[#e8e1d5]
                      bg-[#f7f4ee]
                      shadow-[0_40px_90px_rgba(0,0,0,.12)]
                    ">

                      <Image
                        src={article.featuredImage}
                        alt={heroImageAlt}
                        width={1600}
                        height={900}
                        sizes="
                          (max-width: 640px) calc(100vw - 3rem),
                          (max-width: 1023px) calc(100vw - 5rem),
                          (max-width: 1450px) calc(100vw - 39rem),
                          790px
                        "
                        quality={75}
                        loading="eager"
                        fetchPriority="high"
                        className="
                          block
                          w-full
                          h-auto
                          max-h-[700px]
                          object-contain
                          bg-[#f7f4ee]
                          transition-transform
                          duration-700
                          hover:scale-[1.02]
                        "
                      />

                      {article?.featuredImageCaption && (
                        <figcaption className="
                          px-5
                          py-3
                          text-center
                          text-sm
                          text-[#777]
                        ">
                          {article.featuredImageCaption}
                        </figcaption>
                      )}

                    </figure>

                  </div>
                )}

                {/* ==================================================
                    ARTICLE CONTENT
                ================================================== */}

                <div className="
                  max-w-[760px]
                  mx-auto
                ">

                  {/* MOBILE TABLE OF CONTENTS */}

                  <div className="
                    lg:hidden
                    mt-12
                    mb-10
                  ">

                    <TableOfContents
                      containerId={articleContentId}
                      compact
                    />

                  </div>

                  {/* SERVER-RENDERED ARTICLE HTML */}

                  <div
                    id={articleContentId}
                    className="
                      article-content
                      mt-12
                      lg:mt-16
                    "
                    dangerouslySetInnerHTML={{
                      __html: articleContent || "",
                    }}
                  />

                </div>

                {/* ==================================================
                    AUTHOR QUOTE
                    Only render when a real quote exists.
                ================================================== */}

                {authorQuote && (
                  <section className="
                    mt-20
                    lg:mt-24
                    rounded-[28px]
                    lg:rounded-[34px]
                    bg-gradient-to-br
                    from-[#163629]
                    to-[#214a39]
                    text-white
                    p-7
                    lg:p-14
                    flex
                    flex-col
                    lg:flex-row
                    gap-7
                    lg:gap-8
                    items-start
                  ">

                    <div className="
                      w-16
                      h-16
                      lg:w-20
                      lg:h-20
                      rounded-full
                      bg-[#b88638]
                      flex
                      items-center
                      justify-center
                      text-3xl
                      font-semibold
                      shrink-0
                    ">

                      {authorInitial}

                    </div>

                    <div className="min-w-0">

                      <p
                        className="
                          text-2xl
                          lg:text-[30px]
                          leading-relaxed
                          lg:leading-[50px]
                          italic
                        "
                        style={{
                          fontFamily: "Georgia, serif",
                        }}
                      >
                        {authorQuote}
                      </p>

                      <div className="mt-8 lg:mt-10">

                        <h3 className="
                          text-xl
                          font-semibold
                        ">

                          {authorName}

                        </h3>

                        {authorDesignation && (
                          <p className="
                            text-white/70
                            mt-2
                          ">

                            {authorDesignation}

                          </p>
                        )}

                      </div>

                    </div>

                  </section>
                )}

                {/* ==================================================
                    PREVIOUS / NEXT ARTICLES
                ================================================== */}

                {(previousArticle || nextArticle) && (
                  <nav
                    aria-label="Article navigation"
                    className="
                      mt-20
                      lg:mt-24
                      grid
                      md:grid-cols-2
                      gap-5
                      lg:gap-8
                    "
                  >

                    {/* PREVIOUS ARTICLE */}

                    {previousArticle ? (
                      <Link
                        href={`/insights/${encodeURIComponent(
                          previousArticle.slug
                        )}`}
                        className="
                          block
                          rounded-[26px]
                          lg:rounded-[30px]
                          border
                          border-[#ece7dc]
                          p-7
                          lg:p-10
                          hover:-translate-y-1
                          hover:shadow-xl
                          transition-all
                          duration-300
                        "
                      >

                        <p className="
                          uppercase
                          tracking-[3px]
                          text-[11px]
                          text-[#999]
                        ">

                          Previous Article

                        </p>

                        <h3
                          className="
                            mt-5
                            lg:mt-6
                            text-2xl
                            lg:text-[30px]
                            leading-10
                            text-[#163629]
                          "
                          style={{
                            fontFamily: "Georgia, serif",
                          }}
                        >
                          {previousArticle.title}
                        </h3>

                      </Link>
                    ) : (
                      <div />
                    )}

                    {/* NEXT ARTICLE */}

                    {nextArticle ? (
                      <Link
                        href={`/insights/${encodeURIComponent(
                          nextArticle.slug
                        )}`}
                        className="
                          block
                          rounded-[26px]
                          lg:rounded-[30px]
                          border
                          border-[#ece7dc]
                          p-7
                          lg:p-10
                          md:text-right
                          hover:-translate-y-1
                          hover:shadow-xl
                          transition-all
                          duration-300
                        "
                      >

                        <p className="
                          uppercase
                          tracking-[3px]
                          text-[11px]
                          text-[#999]
                        ">

                          Next Article

                        </p>

                        <h3
                          className="
                            mt-5
                            lg:mt-6
                            text-2xl
                            lg:text-[30px]
                            leading-10
                            text-[#163629]
                          "
                          style={{
                            fontFamily: "Georgia, serif",
                          }}
                        >
                          {nextArticle.title}
                        </h3>

                      </Link>
                    ) : (
                      <div />
                    )}

                  </nav>
                )}

              </div>

            </article>

            {/* ====================================================
                RIGHT SIDEBAR - DESKTOP
            ==================================================== */}

            <aside
              className="
                hidden
                lg:block
                sticky
                top-28
                self-start
                min-w-0
              "
            >

              <div className="
                space-y-8
                rounded-[36px]
              ">

                {/* TABLE OF CONTENTS */}

                <TableOfContents
                  containerId={articleContentId}
                />

                {/* AUTHOR */}

                <AboutAuthor
                  article={article}
                />

                {/* LATEST INSIGHTS */}

                <LatestInsightsSidebar
                  articles={latestArticles}
                />

                {/* ADVISORY CTA */}

                <CTAAdvisor />

                {/* TAGS */}

                <TagsCard
                  article={article}
                />

              </div>

            </aside>

          </div>

        </section>

      </main>

      {/* ==========================================================
          LUXURY BOTTOM CTA
      ========================================================== */}

      <section className="
        relative
        overflow-hidden
        bg-[#163629]
      ">

        {/* TOP RIGHT GLOW */}

        <div
          className="
            absolute
            -top-24
            -right-24
            w-80
            h-80
            rounded-full
            bg-[#b88638]/10
            blur-3xl
          "
          aria-hidden="true"
        />

        {/* BOTTOM LEFT GLOW */}

        <div
          className="
            absolute
            -bottom-20
            -left-20
            w-72
            h-72
            rounded-full
            bg-white/5
            blur-3xl
          "
          aria-hidden="true"
        />

        {/* CTA CONTENT */}

        <div className="
          relative
          max-w-[1280px]
          mx-auto
          px-6
          lg:px-8
          py-20
          lg:py-28
        ">

          <div className="max-w-[760px]">

            <span className="
              inline-block
              uppercase
              tracking-[4px]
              text-[#b88638]
              text-xs
              font-semibold
            ">

              Property Bouquet

            </span>

            <h2
              className="
                mt-6
                text-4xl
                md:text-5xl
                lg:text-6xl
                leading-tight
                text-white
              "
              style={{
                fontFamily: "Georgia, serif",
              }}
            >
              Discover India's Finest Luxury
              Properties With Confidence.
            </h2>

            <p className="
              mt-8
              text-lg
              lg:text-xl
              leading-9
              text-white/75
              max-w-[640px]
            ">
              Exclusive residences, investment
              advisory, off-market opportunities
              and market intelligence curated for
              discerning buyers.
            </p>

            <div className="
              mt-10
              lg:mt-12
              flex
              flex-wrap
              gap-4
              lg:gap-5
            ">

              {/* CONTACT */}

              <Link
                href="/contact"
                className="
                  inline-flex
                  items-center
                  justify-center
                  min-h-14
                  px-8
                  lg:px-10
                  rounded-full
                  bg-[#b88638]
                  text-black
                  font-semibold
                  hover:scale-105
                  transition-all
                  duration-300
                "
              >
                Book Private Consultation
              </Link>

              {/* PROPERTIES */}

              <Link
                href="/properties"
                className="
                  inline-flex
                  items-center
                  justify-center
                  min-h-14
                  px-8
                  lg:px-10
                  rounded-full
                  border
                  border-white/20
                  text-white
                  hover:bg-white
                  hover:text-[#163629]
                  transition-all
                  duration-300
                "
              >
                Explore Properties
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* ==========================================================
          FOOTER
      ========================================================== */}

      <Footer />

    </>
  );
}
