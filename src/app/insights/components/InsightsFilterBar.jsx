
"use client";

import {
  Search,
  ArrowUpDown,
  X,
  SlidersHorizontal,
} from "lucide-react";

// ======================================================
// INSIGHTS FILTER BAR
// NON-STICKY VERSION
// ======================================================

export default function InsightsFilterBar({
  categories = [],
  activeCategory = "",
  onCategoryChange,
  search = "",
  onSearchChange,
  sort = "latest",
  onSortChange,
  totalCount = 0,
}) {
  return (
    <section
      className="
        relative
        z-10
        rounded-2xl
        border
        border-[#e7e0d5]
        bg-[#faf8f3]
        p-4
        shadow-[0_8px_25px_rgba(22,54,41,.04)]
        sm:p-5
      "
    >

      {/* HEADER */}

      <div className="
        mb-4
        flex
        items-center
        justify-between
        gap-3
      ">

        <div className="flex items-center gap-2">

          <SlidersHorizontal
            size={17}
            className="text-[#b88638]"
          />

          <h3 className="
            text-sm
            font-semibold
            text-[#163629]
          ">
            Discover Insights
          </h3>

        </div>

        <span className="
          shrink-0
          text-xs
          text-[#999]
        ">
          {totalCount} articles
        </span>

      </div>

      {/* CATEGORY FILTERS */}

      <div className="
        flex
        flex-wrap
        items-center
        gap-2
      ">

        {/* ALL INSIGHTS */}

        <button
          type="button"
          onClick={() => onCategoryChange?.("")}
          aria-pressed={!activeCategory}
          className={`
            rounded-full
            px-4
            py-2.5
            text-xs
            font-semibold
            transition-all
            duration-200
            ${
              !activeCategory
                ? "bg-[#163629] text-white shadow-sm"
                : "border border-[#e7e0d5] bg-white text-[#555] hover:border-[#b88638] hover:text-[#987126]"
            }
          `}
        >
          All Insights
        </button>

        {/* REAL DATABASE CATEGORIES */}

        {categories.map((category) => {

          const isActive =
            activeCategory.toLowerCase() ===
            category.name.toLowerCase();

          return (
            <button
              key={category.key}
              type="button"
              onClick={() =>
                onCategoryChange?.(category.name)
              }
              aria-pressed={isActive}
              className={`
                inline-flex
                items-center
                gap-2
                rounded-full
                px-4
                py-2.5
                text-xs
                font-medium
                transition-all
                duration-200
                ${
                  isActive
                    ? "bg-[#163629] text-white shadow-sm"
                    : "border border-[#e7e0d5] bg-white text-[#555] hover:border-[#b88638] hover:text-[#987126]"
                }
              `}
            >

              {category.name}

              <span className={`
                rounded-full
                px-1.5
                py-0.5
                text-[9px]
                ${
                  isActive
                    ? "bg-white/15 text-white/80"
                    : "bg-[#f3efe7] text-[#888]"
                }
              `}>
                {category.count}
              </span>

            </button>
          );
        })}

      </div>

      {/* SEARCH AND SORT */}

      <div className="
        mt-4
        grid
        grid-cols-1
        gap-3
        border-t
        border-[#e9e2d7]
        pt-4
        md:grid-cols-[1fr_200px]
      ">

        {/* SEARCH */}

        <div className="relative">

          <Search
            size={17}
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange?.(event.target.value)
            }
            placeholder="Search market insights, investment topics or articles..."
            aria-label="Search Property Insights"
            className="
              h-11
              w-full
              rounded-xl
              border
              border-[#e7e0d5]
              bg-white
              pl-11
              pr-11
              text-sm
              text-[#163629]
              outline-none
              transition
              focus:border-[#b88638]
              focus:ring-2
              focus:ring-[#b88638]/10
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange?.("")}
              aria-label="Clear search"
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                transition-colors
                hover:text-[#163629]
              "
            >
              <X size={16} />
            </button>
          )}

        </div>

        {/* SORT */}

        <div className="relative">

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
              onSortChange?.(event.target.value)
            }
            aria-label="Sort insights"
            className="
              h-11
              w-full
              appearance-none
              rounded-xl
              border
              border-[#e7e0d5]
              bg-white
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

            <option value="views">
              Most Viewed
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

      {/* ACTIVE FILTER INDICATORS */}

      {(activeCategory || search) && (
        <div className="
          mt-3
          flex
          flex-wrap
          items-center
          gap-2
        ">

          <span className="text-xs text-[#888]">
            Showing:
          </span>

          {activeCategory && (
            <span className="
              rounded-full
              bg-[#f0e9da]
              px-3
              py-1.5
              text-xs
              font-medium
              text-[#163629]
            ">
              {activeCategory}
            </span>
          )}

          {search && (
            <span className="
              max-w-full
              truncate
              rounded-full
              bg-[#f0e9da]
              px-3
              py-1.5
              text-xs
              text-[#163629]
            ">
              Search: {search}
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              onCategoryChange?.("");
              onSearchChange?.("");
              onSortChange?.("latest");
            }}
            className="
              ml-auto
              text-xs
              font-semibold
              text-[#a77b27]
              hover:underline
            "
          >
            Clear Filters
          </button>

        </div>
      )}

    </section>
  );
}
