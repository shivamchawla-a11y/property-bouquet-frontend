
import Link from "next/link";

import {
  ChevronRight,
  BookOpen,
  Landmark,
  Globe,
  Scale,
  TrendingUp,
  Building2,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

// ======================================================
// SIDEBAR TOPICS
// These are labels until category-specific routes
// are confirmed in the Knowledge listing page.
// ======================================================

const categories = [
  {
    icon: BookOpen,
    title: "Buying Guides",
  },
  {
    icon: Landmark,
    title: "Investment Guides",
  },
  {
    icon: Globe,
    title: "NRI Corner",
  },
  {
    icon: Scale,
    title: "Legal & RERA",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
  },
  {
    icon: Building2,
    title: "Developer Insights",
  },
  {
    icon: HelpCircle,
    title: "FAQs",
  },
];

// ======================================================
// NORMALIZE CATEGORY
// ======================================================

function normalizeCategory(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

// ======================================================
// ARTICLE SIDEBAR
// SERVER COMPONENT
// ======================================================

export default function ArticleSidebar({
  category,
}) {
  const currentCategory = normalizeCategory(
    category
  );

  return (
    <aside
      className="
        space-y-6
        min-w-0
      "
      aria-label="Knowledge article sidebar"
    >

      {/* ==================================================
          KNOWLEDGE TOPICS
      ================================================== */}

      <section className="
        bg-white
        rounded-[26px]
        border
        border-[#ece7dc]
        overflow-hidden
        shadow-[0_18px_50px_rgba(0,0,0,.05)]
      ">

        <div className="
          h-1
          bg-gradient-to-r
          from-[#b88638]
          via-[#e3c37d]
          to-[#b88638]
        " />

        <div className="px-6 py-5">

          <p className="
            text-[#805b1e]
            uppercase
            tracking-[3px]
            text-[11px]
            font-semibold
          ">
            Knowledge Centre
          </p>

          <h2
            className="
              mt-3
              text-[30px]
              text-[#163629]
            "
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            Explore Topics
          </h2>

          <Link
            href="/knowledge"
            className="
              inline-flex
              items-center
              gap-2
              mt-4
              text-sm
              font-semibold
              text-[#805b1e]
              hover:text-[#163629]
              transition-colors
            "
          >
            Browse all articles
            <ArrowRight size={15} />
          </Link>

        </div>

        <div className="
          border-t
          border-[#efe8dc]
        " />

        <div
          className="py-3"
          aria-label="Knowledge topics"
        >

          {categories.map((item) => {
            const Icon = item.icon;

            const isActive =
              currentCategory ===
              normalizeCategory(item.title);

            return (
              <div
                key={item.title}
                className={`
                  flex
                  items-center
                  justify-between
                  px-6
                  sm:px-8
                  py-4
                  border-l-4
                  transition-colors
                  ${
                    isActive
                      ? "border-[#b88638] bg-[#faf8f4]"
                      : "border-transparent"
                  }
                `}
                aria-current={
                  isActive ? "location" : undefined
                }
              >

                <div className="
                  flex
                  items-center
                  gap-4
                  min-w-0
                ">

                  <div className="
                    w-10
                    h-10
                    rounded-full
                    bg-[#f8f3ea]
                    flex
                    items-center
                    justify-center
                    shrink-0
                  ">
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                      className="text-[#163629]"
                      aria-hidden="true"
                    />
                  </div>

                  <span className={`
                    text-[14px]
                    ${
                      isActive
                        ? "font-semibold text-[#163629]"
                        : "font-medium text-[#555]"
                    }
                  `}>
                    {item.title}
                  </span>

                </div>

                {isActive && (
                  <span
                    className="
                      w-2
                      h-2
                      rounded-full
                      bg-[#b88638]
                      shrink-0
                    "
                    aria-hidden="true"
                  />
                )}

              </div>
            );
          })}

        </div>

      </section>

      {/* ==================================================
          EXPERT ADVISOR CARD
      ================================================== */}

      <section className="
        relative
        overflow-hidden
        rounded-[26px]
        bg-[#163629]
        isolate
      ">

        <div
          className="
            absolute
            inset-0
            bg-[#163629]/90
            pointer-events-none
          "
          aria-hidden="true"
        />

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
          "
          aria-hidden="true"
        />

        <div className="relative p-7 sm:p-9">

          <p className="
            uppercase
            tracking-[3px]
            text-[11px]
            font-semibold
            text-[#d8b15f]
          ">
            Property Bouquet
          </p>

          <h2
            className="
              mt-5
              text-[34px]
              sm:text-[38px]
              leading-[1.2]
              text-white
            "
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            Need Expert
            <br />
            Guidance?
          </h2>

          <div className="
            w-20
            h-[2px]
            bg-[#b88638]
            mt-7
            rounded-full
          " />

          <p className="
            mt-7
            text-[15px]
            sm:text-[16px]
            leading-8
            text-white/90
          ">
            Our luxury real estate specialists can
            help you discover premium opportunities,
            compare projects and make informed
            investment decisions.
          </p>

          <Link
            href="/contact"
            className="
              mt-9
              w-full
              min-h-14
              rounded-full
              bg-[#b88638]
              text-[#111]
              font-semibold
              flex
              items-center
              justify-center
              gap-3
              hover:bg-[#c79a42]
              transition-colors
              duration-200
              shadow-xl
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-white
              focus-visible:ring-offset-2
              focus-visible:ring-offset-[#163629]
            "
          >
            Talk To An Advisor

            <ArrowRight
              size={18}
              aria-hidden="true"
            />
          </Link>

        </div>

      </section>

    </aside>
  );
}
