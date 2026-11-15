
import {
  BookOpen,
  TrendingUp,
  MapPin,
  Building2,
  BarChart3,
  Globe2,
  Scale,
  Landmark,
  Receipt,
  Library,
  PlayCircle,
  ChevronRight,
  Phone,
} from "lucide-react";

// ======================================================
// CATEGORY ICONS
// ======================================================

function getCategoryIcon(category) {
  const name = String(category || "").toLowerCase();

  if (name.includes("buy")) return BookOpen;

  if (name.includes("invest")) return TrendingUp;

  if (name.includes("area") || name.includes("location")) {
    return MapPin;
  }

  if (name.includes("project") || name.includes("review")) {
    return Building2;
  }

  if (name.includes("market")) return BarChart3;

  if (name.includes("nri")) return Globe2;

  if (name.includes("legal") || name.includes("rera")) {
    return Scale;
  }

  if (name.includes("loan")) return Landmark;

  if (name.includes("tax") || name.includes("finance")) {
    return Receipt;
  }

  if (name.includes("dictionary")) return Library;

  if (name.includes("video") || name.includes("podcast")) {
    return PlayCircle;
  }

  return Library;
}

// ======================================================
// KNOWLEDGE SIDEBAR
// ======================================================

export default function KnowledgeSidebar({
  categories = [],
  totalCount = 0,
  activeCategory = "",
  onSelectCategory,
}) {
  return (

    // IMPORTANT:
    // No max-height or overflow-y-auto here.
    // The browser page scroll handles scrolling.

    <aside className="lg:sticky lg:top-[104px] lg:self-start">

      <div className="space-y-5">

        {/* ==================================================
            CATEGORY PANEL
        ================================================== */}

        <div className="
          overflow-hidden
          rounded-2xl
          border
          border-[#e8e3da]
          bg-white
          shadow-sm
        ">

          {/* HEADER */}

          <div className="bg-[#07111d] px-5 py-5">

            <p className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[2px]
              text-[#d4af37]
            ">
              Knowledge Centre
            </p>

            <h3 className="mt-1 text-lg font-semibold text-white">
              Explore Topics
            </h3>

            <p className="mt-1 text-xs text-white/50">
              Browse articles by category
            </p>

          </div>

          {/* CATEGORY NAVIGATION */}

          <nav
            aria-label="Knowledge Centre categories"
            className="divide-y divide-[#f0ece5]"
          >

            {/* ALL ARTICLES */}

            <button
              type="button"
              aria-pressed={!activeCategory}
              onClick={() =>
                onSelectCategory?.("")
              }
              className={`
                group
                flex
                w-full
                items-center
                justify-between
                px-5
                py-4
                text-left
                transition-colors
                ${
                  !activeCategory
                    ? "bg-[#faf6ee]"
                    : "bg-white hover:bg-[#faf8f4]"
                }
              `}
            >

              <span className="flex min-w-0 items-center gap-3">

                <BookOpen
                  size={18}
                  className="shrink-0 text-[#b98d2c]"
                />

                <span className="text-sm font-semibold text-[#163629]">
                  All Articles
                </span>

              </span>

              <span className="flex shrink-0 items-center gap-2">

                <span className="text-xs tabular-nums text-gray-400">
                  {totalCount}
                </span>

                <ChevronRight
                  size={17}
                  className={`
                    text-gray-400
                    transition-transform
                    ${
                      !activeCategory
                        ? "translate-x-1"
                        : "group-hover:translate-x-1"
                    }
                  `}
                />

              </span>

            </button>

            {/* REAL CATEGORIES */}

            {categories.map((category) => {

              const Icon = getCategoryIcon(
                category.name
              );

              const isActive =
                activeCategory.toLowerCase() ===
                category.name.toLowerCase();

              return (

                <button
                  key={category.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() =>
                    onSelectCategory?.(category.name)
                  }
                  className={`
                    group
                    flex
                    w-full
                    items-center
                    justify-between
                    px-5
                    py-4
                    text-left
                    transition-colors
                    ${
                      isActive
                        ? "bg-[#faf6ee]"
                        : "bg-white hover:bg-[#faf8f4]"
                    }
                  `}
                >

                  <span className="flex min-w-0 items-center gap-3">

                    <Icon
                      size={18}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#b98d2c]"
                      aria-hidden="true"
                    />

                    <span className="truncate text-sm font-medium text-[#26352e]">
                      {category.name}
                    </span>

                  </span>

                  <span className="flex shrink-0 items-center gap-2">

                    <span className="text-xs tabular-nums text-gray-400">
                      {category.count}
                    </span>

                    <ChevronRight
                      size={17}
                      className={`
                        text-gray-400
                        transition-transform
                        ${
                          isActive
                            ? "translate-x-1"
                            : "group-hover:translate-x-1"
                        }
                      `}
                      aria-hidden="true"
                    />

                  </span>

                </button>

              );
            })}

            {/* EMPTY CATEGORY STATE */}

            {categories.length === 0 && (
              <p className="px-5 py-5 text-sm text-gray-500">
                No published categories available.
              </p>
            )}

          </nav>

        </div>

        {/* ==================================================
            ADVISOR CARD
        ================================================== */}

        <div className="
          relative
          isolate
          overflow-hidden
          rounded-2xl
          bg-[#07111d]
        ">

          {/* BACKGROUND GLOW */}

          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-16
              h-48
              w-48
              rounded-full
              bg-[#c9a64b]/10
              blur-3xl
            "
            aria-hidden="true"
          />

          {/* CONTENT */}

          <div className="relative p-6">

            <p className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[2px]
              text-[#c9a64b]
            ">
              Property Bouquet
            </p>

            <h3 className="
              mt-3
              font-serif
              text-2xl
              leading-tight
              text-white
            ">
              Need Expert Guidance?
            </h3>

            <p className="
              mt-4
              text-sm
              leading-7
              text-gray-300
            ">
              Speak with our property experts for
              personalized assistance with your
              real estate decisions.
            </p>

            {/* CTA */}

            <a
              href="tel:+919090106101"
              className="
                mt-6
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-[#c9a64b]
                to-[#e0be69]
                py-3.5
                text-sm
                font-semibold
                text-black
                transition-opacity
                hover:opacity-90
              "
            >

              <Phone size={16} />

              TALK TO AN ADVISOR

            </a>

          </div>

        </div>

      </div>

    </aside>
  );
}
