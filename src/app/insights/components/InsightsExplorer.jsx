
"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import InsightsFilterBar from "./InsightsFilterBar";
import FeaturedInsights from "./FeaturedInsights";
import LatestInsights from "./LatestInsights";
import TrendingSidebar from "./TrendingSidebar";
import NewsletterCard from "./NewsletterCard";

// ======================================================
// API
// ======================================================

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://propertybouquet.com/api";

// ======================================================
// HELPERS
// ======================================================

function normalize(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function getTimestamp(article) {
  const value =
    article?.publishDate ||
    article?.createdAt ||
    article?.updatedAt;

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isFeatured(article) {
  return article?.featured === true ||
    article?.featured === "true";
}

function buildCategories(articles) {
  const map = new Map();

  articles.forEach((article) => {
    const name = String(article?.category || "")
      .trim()
      .replace(/\s+/g, " ");

    if (!name) return;

    const key = normalize(name);

    if (!map.has(key)) {
      map.set(key, {
        key,
        name,
        count: 0,
      });
    }

    map.get(key).count += 1;
  });

  return Array.from(map.values()).sort(
    (a, b) =>
      b.count - a.count ||
      a.name.localeCompare(b.name)
  );
}

// ======================================================
// LOADING SKELETON
// ======================================================

function InsightsLoading() {
  return (
    <section className="bg-[#f7f5ef] py-16">

      <div className="mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-10">

        <div className="
          grid
          animate-pulse
          grid-cols-1
          gap-8
          lg:grid-cols-[1.5fr_1fr]
        ">

          <div className="
            aspect-[16/9]
            rounded-[28px]
            bg-[#e8e3d8]
          " />

          <div className="
            rounded-[28px]
            bg-[#e8e3d8]
          " />

        </div>

        <div className="
          mt-14
          h-24
          rounded-2xl
          bg-[#e8e3d8]
        " />

        <div className="
          mt-8
          grid
          grid-cols-1
          gap-6
          md:grid-cols-2
          xl:grid-cols-3
        ">

          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl bg-white"
            >

              <div className="
                aspect-[16/10]
                bg-[#e8e3d8]
              " />

              <div className="space-y-3 p-5">

                <div className="h-3 w-24 rounded bg-[#e8e3d8]" />

                <div className="h-5 w-full rounded bg-[#e8e3d8]" />

                <div className="h-4 w-4/5 rounded bg-[#e8e3d8]" />

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

// ======================================================
// INSIGHTS EXPLORER
// ======================================================

export default function InsightsExplorer() {
  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] =
    useState("");

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState("latest");

  // ====================================================
  // FETCH PUBLISHED NEWS ONCE
  // ====================================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchArticles() {
      try {
        setLoading(true);
        setError("");

        const baseUrl = API.replace(/\/+$/, "");

        const response = await fetch(
          `${baseUrl}/news?status=published`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load insights (${response.status}).`
          );
        }

        const result = await response.json();

        if (!result?.success) {
          throw new Error(
            result?.message ||
            "Unable to load published insights."
          );
        }

        const validArticles = Array.isArray(result.data)
          ? result.data.filter(
              (article) =>
                article &&
                typeof article.title === "string" &&
                article.title.trim() &&
                typeof article.slug === "string" &&
                article.slug.trim() &&
                article.status === "published" &&
                article.isDeleted !== true
            )
          : [];

        // Ensure newest articles are first.

        validArticles.sort(
          (a, b) => getTimestamp(b) - getTimestamp(a)
        );

        setArticles(validArticles);

      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Insights fetch error:", err);

        setError(
          err.message ||
          "Unable to load Property Insights."
        );

      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchArticles();

    return () => controller.abort();
  }, []);

  // ====================================================
  // FEATURED ARTICLE
  // ====================================================

  const featuredArticle = useMemo(
    () =>
      articles.find(isFeatured) ||
      articles[0] ||
      null,
    [articles]
  );

  // Keep the featured story separate from the library.

  const libraryArticles = useMemo(
    () =>
      featuredArticle
        ? articles.filter(
            (article) =>
              article.slug !== featuredArticle.slug
          )
        : articles,
    [articles, featuredArticle]
  );

  // ====================================================
  // REAL CATEGORIES FROM DATABASE
  // ====================================================

  const categories = useMemo(
    () => buildCategories(libraryArticles),
    [libraryArticles]
  );

  const selectedCategory = categories.find(
    (item) =>
      normalize(item.name) ===
      normalize(activeCategory)
  );

  const effectiveCategory =
    selectedCategory?.name || "";

  // ====================================================
  // FILTER AND SORT
  // ====================================================

  const filteredArticles = useMemo(() => {
    let result = [...libraryArticles];

    // CATEGORY

    if (effectiveCategory) {
      result = result.filter(
        (article) =>
          normalize(article.category) ===
          normalize(effectiveCategory)
      );
    }

    // SEARCH

    if (search.trim()) {
      const query = normalize(search);

      result = result.filter((article) => {
        const text = [
          article.title,
          article.shortDescription,
          article.category,
          article.slug,
          article.author,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return text.includes(query);
      });
    }

    // SORT

    result.sort((a, b) => {
      if (sort === "oldest") {
        return getTimestamp(a) - getTimestamp(b);
      }

      if (sort === "views") {
        const viewsA = Number(a.views) || 0;
        const viewsB = Number(b.views) || 0;

        return (
          viewsB - viewsA ||
          getTimestamp(b) - getTimestamp(a)
        );
      }

      if (sort === "title-asc") {
        return String(a.title || "").localeCompare(
          String(b.title || "")
        );
      }

      if (sort === "title-desc") {
        return String(b.title || "").localeCompare(
          String(a.title || "")
        );
      }

      return getTimestamp(b) - getTimestamp(a);
    });

    return result;
  }, [
    libraryArticles,
    effectiveCategory,
    search,
    sort,
  ]);

  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const clearFilters = () => {
    setActiveCategory("");
    setSearch("");
    setSort("latest");
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return <InsightsLoading />;
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error) {
    return (
      <section className="bg-[#f7f5ef] px-5 py-24">

        <div className="
          mx-auto
          max-w-2xl
          rounded-2xl
          border
          border-[#e8e3d9]
          bg-white
          px-6
          py-14
          text-center
        ">

          <h2 className="
            text-2xl
            text-[#163629]
          ">
            Insights Could Not Be Loaded
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#777]">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="
              mt-6
              rounded-full
              bg-[#163629]
              px-6
              py-3
              text-sm
              font-semibold
              text-white
            "
          >
            Try Again
          </button>

        </div>

      </section>
    );
  }

  // ====================================================
  // EMPTY STATE
  // ====================================================

  if (articles.length === 0) {
    return (
      <section className="bg-[#f7f5ef] px-5 py-24">

        <div className="mx-auto max-w-2xl text-center">

          <h2
            className="text-3xl text-[#163629]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            No Published Insights Yet
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#777]">
            Published Property Bouquet insights will appear here.
          </p>

        </div>

      </section>
    );
  }

  // ====================================================
  // MAIN CONTENT
  // ====================================================

  return (
    <>

      {/* ==================================================
          01. FEATURED INSIGHT
      ================================================== */}

      <section className="
        bg-[#f7f5ef]
        px-5
        pb-14
        pt-14
        sm:px-8
        sm:pb-16
        lg:px-10
        lg:pt-20
      ">

        <div className="mx-auto max-w-[1450px]">

          <FeaturedInsights
            article={featuredArticle}
          />

        </div>

      </section>

      {/* ==================================================
          02. INSIGHTS LIBRARY
      ================================================== */}

      <section
        id="insights-library"
        className="
          scroll-mt-28
          bg-[#f7f5ef]
          px-5
          pb-20
          sm:px-8
          lg:px-10
        "
      >

        <div className="mx-auto max-w-[1450px]">

          {/* SECTION INTRO */}

          <div className="
            mb-7
            flex
            flex-wrap
            items-end
            justify-between
            gap-4
          ">

            <div>

              <p className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[3px]
                text-[#b88638]
              ">
                Research & Market Intelligence
              </p>

              <h2
                className="
                  mt-2
                  text-3xl
                  leading-tight
                  text-[#163629]
                  sm:text-4xl
                "
                style={{
                  fontFamily: "Georgia, serif",
                }}
              >
                Explore Property Insights
              </h2>

              <p className="
                mt-3
                max-w-2xl
                text-sm
                leading-7
                text-[#777]
              ">
                Browse market perspectives, investment
                analysis and luxury real estate stories.
              </p>

            </div>

            <p className="
              rounded-full
              border
              border-[#e5ded2]
              bg-white
              px-4
              py-2
              text-xs
              font-medium
              text-[#5d665f]
            ">
              {filteredArticles.length}{" "}
              {filteredArticles.length === 1
                ? "insight"
                : "insights"} found
            </p>

          </div>

          {/* FILTER BAR */}

          <InsightsFilterBar
            categories={categories}
            activeCategory={effectiveCategory}
            onCategoryChange={setActiveCategory}
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            totalCount={libraryArticles.length}
          />

          {/* ARTICLES + SUPPORTING SIDEBAR */}

          <div className="
            mt-8
            grid
            grid-cols-1
            items-start
            gap-8
            lg:grid-cols-12
            xl:gap-10
          ">

            {/* LATEST ARTICLES */}

            <div className="min-w-0 lg:col-span-8">

              <LatestInsights
                articles={filteredArticles}
                onClearFilters={clearFilters}
              />

            </div>

            {/* SIDEBAR */}

            <aside className="min-w-0 space-y-7 lg:col-span-4">

              <NewsletterCard />

              <TrendingSidebar
                articles={libraryArticles}
              />

            </aside>

          </div>

        </div>

      </section>

    </>
  );
}
