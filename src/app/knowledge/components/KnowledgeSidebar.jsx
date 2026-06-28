"use client";

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

export default function KnowledgeSidebar() {
  return (
    <aside className="space-y-6 sticky top-28">

      <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">

        <div className="bg-[#07111d] px-6 py-5">

          <h3 className="text-[#d4af37] text-lg font-semibold uppercase tracking-wide">
            Knowledge Centre
          </h3>

        </div>

        <div>

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center justify-between px-6 py-4 border-b last:border-none transition-all

                ${
                  item.active
                    ? "bg-[#faf6ee]"
                    : "hover:bg-gray-50"
                }`}
              >

                <div className="flex items-center gap-3">

                  <Icon
                    size={18}
                    className="text-[#b98d2c]"
                  />

                  <span className="text-gray-800">
                    {item.title}
                  </span>

                </div>

                <ChevronRight
                  size={18}
                  className="text-gray-400"
                />

              </Link>
            );
          })}

        </div>

      </div>

      {/* Advisor Card */}

      <div className="relative overflow-hidden rounded-2xl">

        <img
          src="/knowledge/advisor.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[#07111d]/80" />

        <div className="relative z-10 p-7">

          <h3 className="text-3xl font-serif text-[#d4af37] leading-tight">

            Need Expert Guidance?

          </h3>

          <p className="mt-5 text-gray-200 leading-8">

            Speak with our property experts for
            personalized assistance.

          </p>

          <button
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
            transition
            "
          >
            TALK TO AN ADVISOR →
          </button>

        </div>

      </div>

    </aside>
  );
}