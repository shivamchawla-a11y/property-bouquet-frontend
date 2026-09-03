"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowRight,
  CalendarDays,
  Sparkles,
} from "lucide-react";

import NewsletterCard from "./NewsletterCard";
import TrendingSidebar from "./TrendingSidebar";
import LatestInsights from "./LatestInsights";

const API = "https://propertybouquet.com/api";

export default function FeaturedInsights() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  // ==========================================================
  // FETCH ARTICLES
  // ==========================================================

  useEffect(() => {
    fetchFeatured();
  }, []);

  async function fetchFeatured() {
    try {
      const res = await fetch(`${API}/news?status=published`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch articles: ${res.status}`
        );
      }

      const data = await res.json();

      if (!data?.success) {
        setError("Unable to load insights.");
        return;
      }

      const allArticles = Array.isArray(data.data)
        ? data.data
        : [];

      if (allArticles.length === 0) {
        setArticles([]);
        setArticle(null);
        return;
      }

      setArticles(allArticles);

      const featuredArticle =
        allArticles.find(
          (item) => item?.featured === true
        ) || allArticles[0];

      setArticle(featuredArticle);
    } catch (err) {
      console.error("News Fetch Error:", err);

      setError("Unable to load insights.");
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // SAFE DATE
  // ==========================================================

  function formatDate(date) {
    if (!date) {
      return "";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  // ==========================================================
  // SAFE IMAGE
  // ==========================================================

  function getImageUrl(image) {
    if (
      typeof image === "string" &&
      image.trim()
    ) {
      return image.trim();
    }

    if (
      image &&
      typeof image === "object"
    ) {
      if (
        typeof image.url === "string" &&
        image.url.trim()
      ) {
        return image.url.trim();
      }

      if (
        typeof image.src === "string" &&
        image.src.trim()
      ) {
        return image.src.trim();
      }
    }

    return null;
  }

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <section
        className="
          relative
          overflow-hidden
          bg-[#f7f5ef]
          py-14
          sm:py-16
          lg:py-20
        "
      >
        {/* BRAND GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            -top-48
            -left-48
            h-[600px]
            w-[600px]
            rounded-full
            bg-[#163629]/7
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-48
            -right-48
            h-[600px]
            w-[600px]
            rounded-full
            bg-[#b88638]/5
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-[1500px]
            px-5
            sm:px-6
            lg:px-10
          "
        >
          <div
            className="
              grid
              grid-cols-1
              items-start
              gap-8
              lg:grid-cols-12
              xl:gap-10
            "
          >
            {/* FEATURED SKELETON */}

            <div className="lg:col-span-8">
              <div
                className="
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-[#e3e0d7]
                  bg-white
                  shadow-[0_20px_60px_rgba(22,54,41,.07)]
                "
              >
                <div
                  className="
                    aspect-[16/9]
                    w-full
                    animate-pulse
                    bg-[#e8e5dc]
                  "
                />

                <div
                  className="
                    space-y-5
                    bg-[#163629]
                    p-7
                    sm:p-9
                  "
                >
                  <div className="h-3 w-28 animate-pulse rounded bg-white/10" />

                  <div className="h-8 w-4/5 animate-pulse rounded bg-white/10" />

                  <div className="h-4 w-full animate-pulse rounded bg-white/10" />

                  <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                </div>
              </div>
            </div>

            {/* SIDEBAR SKELETON */}

            <div className="space-y-7 lg:col-span-4">
              <div
                className="
                  h-[300px]
                  animate-pulse
                  rounded-[28px]
                  border
                  border-[#e3e0d7]
                  bg-white
                "
              />

              <div
                className="
                  h-[420px]
                  animate-pulse
                  rounded-[28px]
                  border
                  border-[#e3e0d7]
                  bg-white
                "
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <section className="bg-[#f7f5ef] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2
            className="
              text-2xl
              font-medium
              text-[#163629]
            "
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            {error}
          </h2>
        </div>
      </section>
    );
  }

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  if (!article) {
    return (
      <section className="bg-[#f7f5ef] py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-[#163629]
              text-[#d8b46b]
              shadow-lg
            "
          >
            <Sparkles size={21} />
          </div>

          <h2
            className="
              mt-6
              text-3xl
              text-[#163629]
            "
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            No Insights Available
          </h2>

          <p className="mt-3 text-sm text-[#777]">
            Publish a news article to display it here.
          </p>
        </div>
      </section>
    );
  }

  // ==========================================================
  // ARTICLE DATA
  // ==========================================================

  const imageUrl = getImageUrl(
    article.featuredImage
  );

  const articleHref = `/insights/${article.slug}`;

  // ==========================================================
  // MAIN
  // ==========================================================

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#f7f5ef]
        py-14
        sm:py-16
        lg:py-20
      "
    >
      {/* ======================================================
          BRAND BACKGROUND GLOWS
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -top-64
          -left-64
          h-[700px]
          w-[700px]
          rounded-full
          bg-[#163629]/8
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-72
          -right-64
          h-[700px]
          w-[700px]
          rounded-full
          bg-[#b88638]/6
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/3
          h-[500px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-[#163629]/3
          blur-3xl
        "
      />

      {/* ======================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-[1500px]
          px-5
          sm:px-6
          lg:px-10
        "
      >
        {/* ====================================================
            SECTION HEADER
        ==================================================== */}

        <div
          className="
            mb-8
            flex
            items-end
            justify-between
            gap-6
          "
        >
          <div>
            {/* EYEBROW */}

            <div className="flex items-center gap-3">
              <span
                className="
                  h-px
                  w-8
                  bg-[#b88638]
                "
              />

              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[3px]
                  text-[#b88638]
                "
              >
                Property Bouquet
              </span>
            </div>

            {/* HEADING */}

            <h2
              className="
                mt-3
                text-[29px]
                leading-tight
                text-[#163629]
                sm:text-[32px]
                lg:text-[36px]
              "
              style={{
                fontFamily: "Georgia, serif",
              }}
            >
              Featured Insights
            </h2>

            {/* DESCRIPTION */}

            <p
              className="
                mt-2
                max-w-[620px]
                text-[13px]
                leading-6
                text-[#777]
                sm:text-[14px]
              "
            >
              Research, market intelligence and
              perspectives shaping India's luxury
              real estate landscape.
            </p>
          </div>

          {/* VIEW ALL */}

          <Link
            href="/insights"
            className="
              hidden
              shrink-0
              items-center
              gap-2
              rounded-full
              border
              border-[#d9d1c3]
              bg-white
              px-5
              py-2.5
              text-[11px]
              font-medium
              text-[#163629]
              shadow-sm
              transition-all
              duration-300
              hover:border-[#163629]
              hover:bg-[#163629]
              hover:text-white
              sm:inline-flex
            "
          >
            View All Insights

            <ArrowRight size={14} />
          </Link>
        </div>

        {/* ====================================================
            MAIN GRID
        ==================================================== */}

        <div
          className="
            grid
            grid-cols-1
            items-start
            gap-8
            lg:grid-cols-12
            xl:gap-10
          "
        >
          {/* ==================================================
              FEATURED ARTICLE
          ================================================== */}

          <div className="lg:col-span-8">
            <motion.article
              whileHover={{
                y: -4,
              }}
              transition={{
                duration: 0.3,
              }}
              className="
                group
                overflow-hidden
                rounded-[30px]
                border
                border-[#dfe1d9]
                bg-white
                shadow-[0_25px_70px_rgba(22,54,41,.09)]
              "
            >
              {/* ==================================================
                  TOP BRAND BAR
              ================================================== */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  bg-gradient-to-r
                  from-[#0d2a20]
                  via-[#163629]
                  to-[#214b3a]
                  px-5
                  py-3
                  sm:px-7
                "
              >
                {/* LEFT */}

                <div className="flex items-center gap-2.5">
                  <span
                    className="
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#d8b46b]/20
                      bg-[#b88638]/10
                      text-[#d8b46b]
                    "
                  >
                    <Sparkles size={11} />
                  </span>

                  <span
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[2.5px]
                      text-white/90
                    "
                  >
                    Editor's Pick
                  </span>
                </div>

                {/* RIGHT */}

                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-[2px]
                    text-white/40
                  "
                >
                  Property Insights
                </span>
              </div>

              {/* ==================================================
                  IMAGE
              ================================================== */}

              <div
                className="
                  relative
                  aspect-[16/9]
                  w-full
                  overflow-hidden
                  bg-[#eeeae1]
                "
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={
                      article.title ||
                      "Property Insights"
                    }
                    fill
                    priority
                    sizes="
                      (max-width: 1024px) 100vw,
                      66vw
                    "
                    className="
                      object-cover
                      object-center
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-[1.035]
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
                      from-[#102d22]
                      via-[#163629]
                      to-[#0c2119]
                    "
                  >
                    <div className="text-center">
                      <Sparkles
                        size={25}
                        className="
                          mx-auto
                          text-[#d8b46b]
                        "
                      />

                      <p
                        className="
                          mt-4
                          text-xl
                          text-white
                        "
                        style={{
                          fontFamily:
                            "Georgia, serif",
                        }}
                      >
                        Property Bouquet
                      </p>

                      <p
                        className="
                          mt-1
                          text-[10px]
                          uppercase
                          tracking-[2px]
                          text-white/45
                        "
                      >
                        Property Insights
                      </p>
                    </div>
                  </div>
                )}

                {/* IMAGE GRADIENT */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/20
                    via-transparent
                    to-transparent
                  "
                />

            
              </div>

              {/* ==================================================
                  CONTENT BELOW IMAGE
              ================================================== */}

              <div
                className="
                  relative
                  overflow-hidden
                  bg-gradient-to-br
                  from-[#163629]
                  via-[#183d2e]
                  to-[#0d281e]
                  px-6
                  py-7
                  sm:px-8
                  sm:py-8
                  lg:px-9
                  lg:py-9
                "
              >
                {/* DECORATIVE GLOW */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-32
                    -top-32
                    h-64
                    w-64
                    rounded-full
                    bg-[#b88638]/8
                    blur-3xl
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    -bottom-32
                    -left-32
                    h-64
                    w-64
                    rounded-full
                    bg-white/4
                    blur-3xl
                  "
                />

                <div className="relative">
                  {/* DATE */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[2px]
                      text-[#d8b46b]
                    "
                  >
                    <CalendarDays size={13} />

                    <span>
                      {formatDate(
                        article.publishDate
                      )}
                    </span>
                  </div>

                  {/* TITLE */}

                  <h3
                    className="
                      mt-4
                      max-w-[850px]
                      text-[25px]
                      font-normal
                      leading-[1.25]
                      tracking-[-0.2px]
                      text-white
                      sm:text-[28px]
                      lg:text-[30px]
                      xl:text-[32px]
                    "
                    style={{
                      fontFamily:
                        "Georgia, serif",
                    }}
                  >
                    {article.title}
                  </h3>

                  {/* GOLD DIVIDER */}

                  <div
                    className="
                      mt-5
                      h-px
                      w-12
                      bg-[#b88638]
                    "
                  />

                  {/* DESCRIPTION */}

                  {article.shortDescription && (
                    <p
                      className="
                        mt-5
                        max-w-[820px]
                        text-[13px]
                        leading-6
                        text-white/70
                        sm:text-[14px]
                        sm:leading-7
                      "
                    >
                      {article.shortDescription}
                    </p>
                  )}

                  {/* BOTTOM ROW */}

                  <div
                    className="
                      mt-7
                      flex
                      flex-wrap
                      items-center
                      justify-between
                      gap-5
                    "
                  >
                    {/* ARTICLE META */}

                    <div
                      className="
                        flex
                        items-center
                        gap-4
                        text-[10px]
                        uppercase
                        tracking-[1.5px]
                        text-white/40
                      "
                    >
                      <span>
                        Property Bouquet
                      </span>

                      <span
                        className="
                          h-1
                          w-1
                          rounded-full
                          bg-[#b88638]
                        "
                      />

                      <span>
                        Featured Insight
                      </span>
                    </div>

                    {/* READ BUTTON */}

                    <Link
                      href={articleHref}
                      className="
                        inline-flex
                        items-center
                        gap-2.5
                        rounded-full
                        border
                        border-[#d8b46b]/40
                        bg-[#b88638]
                        px-5
                        py-2.5
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[1.5px]
                        text-[#111]
                        shadow-[0_8px_25px_rgba(184,134,56,.14)]
                        transition-all
                        duration-300
                        hover:bg-[#d8b46b]
                        hover:shadow-[0_10px_30px_rgba(184,134,56,.24)]
                      "
                    >
                      Read Article

                      <ArrowRight
                        size={14}
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* ==================================================
                LATEST ARTICLES
            ================================================== */}

            <div
              className="
                mt-12
                sm:mt-14
              "
            >
              <div
                className="
                  mb-6
                  flex
                  items-end
                  justify-between
                  gap-5
                "
              >
                <div>
                  <p
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[2.5px]
                      text-[#b88638]
                    "
                  >
                    Continue Reading
                  </p>

                  <h3
                    className="
                      mt-1
                      text-[24px]
                      text-[#163629]
                      sm:text-[27px]
                    "
                    style={{
                      fontFamily:
                        "Georgia, serif",
                    }}
                  >
                    Latest Insights
                  </h3>
                </div>

                <Link
                  href="/insights"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-[10px]
                    font-medium
                    text-[#163629]
                    transition-colors
                    hover:text-[#b88638]
                  "
                >
                  View all

                  <ArrowRight size={13} />
                </Link>
              </div>

              <LatestInsights
                articles={articles}
              />
            </div>
          </div>

          {/* ==================================================
              RIGHT SIDEBAR
          ================================================== */}

          <div className="lg:col-span-4">
            <div className="sticky top-28">
              {/* NEWSLETTER */}

              <NewsletterCard />

              {/* TRENDING */}

              <div className="mt-7">
                <TrendingSidebar
                  articles={articles}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}