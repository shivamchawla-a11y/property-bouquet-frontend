"use client";

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

const categories = [
  {
    icon: BookOpen,
    title: "Buying Guides",
    href: "/knowledge",
    active: true,
  },
  {
    icon: Landmark,
    title: "Investment Guides",
    href: "#",
  },
  {
    icon: Globe,
    title: "NRI Corner",
    href: "#",
  },
  {
    icon: Scale,
    title: "Legal & RERA",
    href: "#",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    href: "#",
  },
  {
    icon: Building2,
    title: "Developer Insights",
    href: "#",
  },
  {
    icon: HelpCircle,
    title: "FAQs",
    href: "#",
  },
];

export default function ArticleSidebar() {
  return (
    
    <div className="space-y-6 scale-[0.95] origin-top">

      {/* KNOWLEDGE MENU */}

      <div
        className="
        bg-white
        rounded-[26px]
        border
        border-[#ece7dc]
        overflow-hidden
        shadow-[0_18px_50px_rgba(0,0,0,.05)]
        "
      >

        {/* GOLD BAR */}

        <div className="h-1 bg-gradient-to-r from-[#b88638] via-[#e3c37d] to-[#b88638]" />

        <div className="px-6 py-5">

          <p className="text-[#b88638] uppercase tracking-[3px] text-[11px] font-semibold">

            Knowledge Centre

          </p>

          <h3
            className="mt-3 text-[30px] text-[#163629]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Explore Topics
          </h3>

        </div>

        <div className="border-t border-[#efe8dc]" />

        <div className="py-3">

          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`
                  group
                  flex
                  items-center
                  justify-between
                  px-8
                  py-5
                  transition-all
                  duration-300
                  border-l-4
                  ${
                    item.active
                      ? "border-[#b88638] bg-[#faf8f4]"
                      : "border-transparent hover:border-[#d6b26d] hover:bg-[#faf8f4]"
                  }
                `}
              >

                <div className="flex items-center gap-4">

                  <div
                    className="
                    w-11
                    h-11
                    rounded-full
                    bg-[#f8f3ea]
                    flex
                    items-center
                    justify-center
                    "
                  >

                    <Icon
                      size={19}
                      className="text-[#163629]"
                    />

                  </div>

                  <span
                    className={`
                    text-[15px]
                    ${
                      item.active
                        ? "font-semibold text-[#163629]"
                        : "font-medium text-[#555]"
                    }
                    `}
                  >
                    {item.title}
                  </span>

                </div>

                <ChevronRight
                  size={18}
                  className="
                  text-[#b88638]
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                  "
                />

              </Link>
            );
          })}

        </div>

      </div>

      {/* ADVISOR */}

      <div
        className="
        relative
        overflow-hidden
        rounded-[26px]
        "
      >

        <div className="absolute inset-0 bg-[#163629]/90" />

        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b88638] via-[#e3c37d] to-[#b88638]" />

        <div className="relative p-9">

          <p className="uppercase tracking-[3px] text-[11px] font-semibold text-[#d8b15f]">

            Property Bouquet

          </p>

          <h3
            className="mt-5 text-[38px] leading-[46px] text-white"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Need Expert
            <br />
            Guidance?
          </h3>

          <div className="w-20 h-[2px] bg-[#b88638] mt-7 rounded-full" />

          <p className="mt-7 text-[16px] leading-8 text-white/80">

            Our luxury real estate specialists can help
            you discover premium opportunities, compare
            projects and make informed investment
            decisions.

          </p>

          <button
            className="
            mt-10
            w-full
            h-14
            rounded-full
            bg-[#b88638]
            text-[#111]
            font-semibold
            flex
            items-center
            justify-center
            gap-3
            hover:scale-[1.03]
            hover:bg-[#c79a42]
            transition-all
            duration-300
            shadow-xl
            "
          >

            Talk To An Advisor

            <ArrowRight size={18} />

          </button>

        </div>

      </div>

    </div>
  );
}

