
import Link from "next/link";

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
} from "lucide-react";

// ======================================================
// KNOWLEDGE CENTRE SIDEBAR ITEMS
// ======================================================

const items = [
  {
    icon: BookOpen,
    title: "Buying Guides",
    href: "#",
    active: true,
  },
  {
    icon: TrendingUp,
    title: "Investment Guides",
    href: "#",
  },
  {
    icon: MapPin,
    title: "Area Guides",
    href: "#",
  },
  {
    icon: Building2,
    title: "Project Reviews",
    href: "#",
  },
  {
    icon: BarChart3,
    title: "Market Insights",
    href: "#",
  },
  {
    icon: Globe2,
    title: "NRI Corner",
    href: "#",
  },
  {
    icon: Scale,
    title: "Legal & RERA",
    href: "#",
  },
  {
    icon: Landmark,
    title: "Home Loans",
    href: "#",
  },
  {
    icon: Receipt,
    title: "Tax & Finance",
    href: "#",
  },
  {
    icon: Library,
    title: "Real Estate Dictionary",
    href: "#",
  },
  {
    icon: PlayCircle,
    title: "Videos & Podcasts",
    href: "#",
  },
];

// ======================================================
// KNOWLEDGE SIDEBAR
// SERVER COMPONENT
// ======================================================

export default function KnowledgeSidebar() {
  return (
    <aside className="space-y-6 sticky top-28">

      {/* ==================================================
          KNOWLEDGE CATEGORY NAVIGATION
      ================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-[#e8e3da]
          bg-white
          overflow-hidden
          shadow-sm
        "
      >

        {/* HEADER */}

        <div className="bg-[#07111d] px-6 py-5">

          <h3
            className="
              text-[#d4af37]
              text-lg
              font-semibold
              uppercase
              tracking-wide
            "
          >
            Knowledge Centre
          </h3>

        </div>

        {/* CATEGORY LINKS */}

        <nav aria-label="Knowledge Centre categories">

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                aria-current={
                  item.active ? "page" : undefined
                }
                className={`
                  group
                  flex
                  items-center
                  justify-between
                  px-6
                  py-4
                  border-b
                  border-[#f0ece5]
                  last:border-none
                  transition-colors
                  duration-200
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-inset
                  focus-visible:ring-[#b98d2c]

                  ${
                    item.active
                      ? "bg-[#faf6ee]"
                      : "bg-white hover:bg-gray-50"
                  }
                `}
              >

                {/* LEFT CONTENT */}

                <div className="flex items-center gap-3 min-w-0">

                  <Icon
                    size={18}
                    strokeWidth={1.8}
                    className={`
                      shrink-0
                      transition-colors
                      duration-200
                      ${
                        item.active
                          ? "text-[#b98d2c]"
                          : "text-[#b98d2c] group-hover:text-[#163629]"
                      }
                    `}
                    aria-hidden="true"
                  />

                  <span
                    className={`
                      text-[14px]
                      font-medium
                      transition-colors
                      duration-200
                      ${
                        item.active
                          ? "text-[#163629]"
                          : "text-gray-800"
                      }
                    `}
                  >
                    {item.title}
                  </span>

                </div>

                {/* RIGHT ARROW */}

                <ChevronRight
                  size={18}
                  className="
                    shrink-0
                    text-gray-400
                    transition-transform
                    duration-200
                    group-hover:translate-x-1
                  "
                  aria-hidden="true"
                />

              </Link>
            );
          })}

        </nav>

      </div>

      {/* ==================================================
          ADVISOR CARD
      ================================================== */}

      <div
        className="
          relative
          overflow-hidden
          rounded-2xl
          bg-[#07111d]
          isolate
        "
      >

        {/* BACKGROUND GLOW */}

        <div
          className="
            absolute
            -right-16
            -top-16
            w-48
            h-48
            rounded-full
            bg-[#c9a64b]/10
            blur-3xl
            pointer-events-none
          "
          aria-hidden="true"
        />

        {/* CONTENT */}

        <div className="relative z-10 p-7">

          <h3
            className="
              text-3xl
              font-serif
              text-[#d4af37]
              leading-tight
            "
          >
            Need Expert Guidance?
          </h3>

          <p
            className="
              mt-5
              text-gray-200
              leading-8
              text-[15px]
            "
          >
            Speak with our property experts for
            personalized assistance.
          </p>

          {/* ADVISOR CTA */}

          <button
            type="button"
            className="
              mt-8
              w-full
              rounded-xl
              bg-gradient-to-r
              from-[#c9a64b]
              to-[#e0be69]
              py-4
              font-semibold
              text-black
              hover:opacity-90
              transition-opacity
              duration-200
            "
          >
            TALK TO AN ADVISOR →
          </button>

        </div>

      </div>

    </aside>
  );
}
