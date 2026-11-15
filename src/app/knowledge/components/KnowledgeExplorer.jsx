
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Search,
  X,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";

import KnowledgeSidebar from "./KnowledgeSidebar";
import FeaturedGuide from "./FeaturedGuide";
import KnowledgeGrid from "./KnowledgeGrid";

// ======================================================
// HELPERS
// ======================================================

function normalize(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function getTimestamp(article) {
  const value =
    article.publishDate ||
    article.createdAt ||
    article.updatedAt;

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isFeaturedArticle(article) {
  return (
    article?.featured === true ||
    article?.featured === "true"
  );
}

// ======================================================
// BUILD REAL CATEGORIES
// ======================================================

function buildCategories(articles) {
  const categoryMap = new Map();

  articles.forEach((article) => {
    const name = String(article.category || "")
      .trim()
      .replace(/\s+/g, " ");

    if (!name) return;

    const key = normalize(name);

    if (!categoryMap.has(key)) {
      categoryMap.set(key, {
        key,
        name,
        count: 0,
      });
    }

    categoryMap.get(key).count += 1;
  });

  return Array.from(categoryMap.values()).sort(
    (a, b) =>
      b.count - a.count ||
      a.name.localeCompare(b.name)
  );
}

// ======================================================
// KNOWLEDGE EXPLORER
// ======================================================

export default function KnowledgeExplorer({
  articles = [],
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ====================================================
  // URL FILTER VALUES
  // ====================================================

  const categoryParam =
    searchParams.get("category") || "";

  const searchQuery =
    searchParams.get("q") || "";

  const requestedSort =
    searchParams.get("sort") || "latest";

  const sort = [
    "latest",
    "oldest",
    "title-asc",
    "title-desc",
  ].includes(requestedSort)
    ? requestedSort
    : "latest";

  const [searchDraft, setSearchDraft] =
    useState(searchQuery);

  const [visibleCount, setVisibleCount] =
    useState(9);

  // ====================================================
  // SYNC SEARCH INPUT WITH URL
  // ====================================================

  useEffect(() => {
    setSearchDraft(searchQuery);
  }, [searchQuery]);

  // ====================================================
  // UPDATE URL FILTERS
  // ====================================================

  const updateQuery = useCallback(
    (updates) => {
      const params = new URLSearchParams(
        searchParams.toString()
      );

      Object.entries(updates).forEach(
        ([key, value]) => {
          if (
            value === null ||
            value === undefined ||
            value === ""
          ) {
            params.delete(key);
          } else {
            params.set(key, String(value));
          }
        }
      );

      const query = params.toString();

      router.push(
        query
          ? `${pathname}?${query}`
          : pathname,
        { scroll: false }
      );
    },
    [pathname, router, searchParams]
  );

  // ====================================================
  // CLEAN ARTICLE DATA
  // ====================================================

  const validArticles = useMemo(() => {
    if (!Array.isArray(articles)) {
      return [];
    }

    return articles.filter(
      (article) =>
        article &&
        typeof article.title === "string" &&
        article.title.trim() &&
        typeof article.slug === "string" &&
        article.slug.trim()
    );
  }, [articles]);

  // ====================================================
  // FEATURED GUIDE
  // INDEPENDENT OF FILTERS
  // ====================================================

  const featuredArticle =
    validArticles.find(isFeaturedArticle) ||
    validArticles[0] ||
    null;

  // Remove featured article from the library.
  // It is already displayed separately above.

  const libraryArticles = useMemo(
    () =>
      featuredArticle
        ? validArticles.filter(
            (article) =>
              article.slug !== featuredArticle.slug
          )
        : [...validArticles],
    [validArticles, featuredArticle]
  );

  // ====================================================
  // DYNAMIC CATEGORIES
  // ====================================================

  const categories = useMemo(
    () => buildCategories(libraryArticles),
    [libraryArticles]
  );

  const selectedCategory = categories.find(
    (item) =>
      normalize(item.name) ===
      normalize(categoryParam)
  );

  const activeCategory =
    selectedCategory?.name || "";

  // ====================================================
  // FILTER AND SORT ARTICLES
  // ====================================================

  const filteredArticles = useMemo(() => {
    let result = [...libraryArticles];

    // CATEGORY FILTER

    if (activeCategory) {
      result = result.filter(
        (article) =>
          normalize(article.category) ===
          normalize(activeCategory)
      );
    }

    // SEARCH FILTER

    if (searchQuery.trim()) {
      const query = normalize(searchQuery);

      result = result.filter((article) => {
        const searchableText = [
          article.title,
          article.shortDescription,
          article.category,
          article.slug,
        ]
          .map(stripHtml)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    // SORT

    result.sort((a, b) => {
      if (sort === "oldest") {
        return getTimestamp(a) - getTimestamp(b);
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
    activeCategory,
    searchQuery,
    sort,
  ]);

  // ====================================================
  // RESET PAGINATION WHEN FILTERS CHANGE
  // ====================================================

  useEffect(() => {
    setVisibleCount(9);
  }, [
    activeCategory,
    searchQuery,
    sort,
  ]);

  const visibleArticles =
    filteredArticles.slice(0, visibleCount);

  const hasMore =
    filteredArticles.length > visibleArticles.length;

  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const clearFilters = () => {
    setSearchDraft("");

    router.push(pathname, {
      scroll: false,
    });
  };

  // ====================================================
  // SUBMIT SEARCH
  // ====================================================

  const handleSearch = (event) => {
    event.preventDefault();

    updateQuery({
      q: searchDraft.trim() || null,
    });
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="space-y-12">

      {/* ==================================================
          01. FEATURED GUIDE
          FULL WIDTH
      ================================================== */}

      {featuredArticle && (
        <FeaturedGuide
          articles={[featuredArticle]}
        />
      )}

      {/* ==================================================
          02. KNOWLEDGE LIBRARY
      ================================================== */}

      <section
        id="knowledge-library"
        className="
          grid
          grid-cols-1
          gap-7
          lg:grid-cols-12
          lg:gap-8
          lg:items-stretch
        "
      >

        {/* ================================================
            LEFT SIDEBAR
        ================================================ */}

        <div className="min-w-0 lg:col-span-3">

          <KnowledgeSidebar
            categories={categories}
            totalCount={libraryArticles.length}
            activeCategory={activeCategory}
            onSelectCategory={(category) =>
              updateQuery({
                category: category || null,
              })
            }
          />

        </div>

        {/* ================================================
            RIGHT CONTENT
        ================================================ */}

        <div className="min-w-0 space-y-8 lg:col-span-9">

          {/* ==============================================
              SEARCH AND SORT
          ============================================== */}

          <div className="
            rounded-2xl
            border
            border-[#e9e3d8]
            bg-white
            p-4
            shadow-sm
            sm:p-5
          ">

            <div className="mb-4 flex items-center gap-2">

              <SlidersHorizontal
                size={17}
                className="text-[#b88638]"
              />

              <h2 className="text-sm font-semibold text-[#163629]">
                Find Your Article
              </h2>

            </div>

            <div className="flex flex-col gap-3 md:flex-row">

              {/* SEARCH FORM */}

              <form
                onSubmit={handleSearch}
                className="relative flex min-w-0 flex-1 gap-2"
              >

                <div className="relative min-w-0 flex-1">

                  <Search
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="search"
                    value={searchDraft}
                    onChange={(event) =>
                      setSearchDraft(event.target.value)
                    }
                    placeholder="Search articles, topics or keywords..."
                    aria-label="Search knowledge articles"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#e8e3da]
                      bg-[#fcfbf8]
                      pl-11
                      pr-4
                      text-sm
                      text-[#163629]
                      outline-none
                      transition
                      focus:border-[#b88638]
                      focus:ring-2
                      focus:ring-[#b88638]/10
                    "
                  />

                </div>

                <button
                  type="submit"
                  className="
                    shrink-0
                    rounded-xl
                    bg-[#163629]
                    px-5
                    text-sm
                    font-medium
                    text-white
                    transition-colors
                    hover:bg-[#214a39]
                  "
                >
                  Search
                </button>

              </form>

              {/* SORT */}

              <div className="relative md:w-[185px]">

                <ArrowUpDown
                  size={16}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[#b88638]
                  "
                />

                <select
                  value={sort}
                  onChange={(event) =>
                    updateQuery({
                      sort: event.target.value,
                    })
                  }
                  aria-label="Sort knowledge articles"
                  className="
                    h-12
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-[#e8e3da]
                    bg-[#fcfbf8]
                    pl-10
                    pr-4
                    text-sm
                    text-[#163629]
                    outline-none
                    focus:border-[#b88638]
                  "
                >

                  <option value="latest">
                    Latest First
                  </option>

                  <option value="oldest">
                    Oldest First
                  </option>

                  <option value="title-asc">
                    Title A–Z
                  </option>

                  <option value="title-desc">
                    Title Z–A
                  </option>

                </select>

              </div>

            </div>

            {/* ACTIVE FILTERS */}

            <div className="mt-4 flex flex-wrap items-center gap-2">

              <span className="text-xs text-gray-500">
                Active:
              </span>

              {activeCategory && (
                <span className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[#f4efe4]
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-[#163629]
                ">

                  {activeCategory}

                  <button
                    type="button"
                    onClick={() =>
                      updateQuery({
                        category: null,
                      })
                    }
                    aria-label="Remove category filter"
                  >
                    <X size={13} />
                  </button>

                </span>
              )}

              {searchQuery && (
                <span className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[#f4efe4]
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-[#163629]
                ">

                  Search: {searchQuery}

                  <button
                    type="button"
                    onClick={() =>
                      updateQuery({
                        q: null,
                      })
                    }
                    aria-label="Remove search filter"
                  >
                    <X size={13} />
                  </button>

                </span>
              )}

              {!activeCategory && !searchQuery && (
                <span className="text-xs text-gray-500">
                  All published articles
                </span>
              )}

              {(activeCategory || searchQuery) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    ml-auto
                    text-xs
                    font-semibold
                    text-[#a77b27]
                    hover:underline
                  "
                >
                  Clear all
                </button>
              )}

            </div>

          </div>

          {/* ==============================================
              RESULTS HEADING
          ============================================== */}

          <div className="
            flex
            flex-wrap
            items-end
            justify-between
            gap-4
          ">

            <div>

              <p className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[3px]
                text-[#b88638]
              ">
                Knowledge Library
              </p>

              <h2
                className="
                  mt-2
                  text-2xl
                  text-[#163629]
                  sm:text-3xl
                "
                style={{
                  fontFamily: "Georgia, serif",
                }}
              >
                {activeCategory ||
                  "Explore Real Estate Insights"}
              </h2>

            </div>

            <p className="
              rounded-full
              border
              border-[#e8e3da]
              bg-white
              px-4
              py-2
              text-xs
              font-medium
              text-[#5d665f]
            ">
              {filteredArticles.length}{" "}
              {filteredArticles.length === 1
                ? "article"
                : "articles"} found
            </p>

          </div>

          {/* ==============================================
              ARTICLE CARDS
          ============================================== */}

          <KnowledgeGrid
            articles={visibleArticles}
            totalCount={filteredArticles.length}
            onClearFilters={clearFilters}
          />

          {/* ==============================================
              LOAD MORE
          ============================================== */}

          {hasMore && (
            <div className="flex justify-center pt-3">

              <button
                type="button"
                onClick={() =>
                  setVisibleCount(
                    (current) => current + 9
                  )
                }
                className="
                  rounded-full
                  border
                  border-[#163629]
                  px-8
                  py-3
                  text-sm
                  font-semibold
                  text-[#163629]
                  transition-colors
                  hover:bg-[#163629]
                  hover:text-white
                "
              >
                Load More Articles
              </button>

            </div>
          )}

        </div>

      </section>

    </div>
  );
}
