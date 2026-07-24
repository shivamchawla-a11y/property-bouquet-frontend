"use client";

import {
  Sparkles,
  ArrowRight,
  Building2,
  MapPin,
  Home,
  Star,
} from "lucide-react";

export default function PotentialPages({ pages = [] }) {
  const demoPages =
    pages.length > 0
      ? pages
      : [
          {
            id: 1,
            title: "DLF Apartments in Sector 56 Gurgaon",
            slug: "dlf-apartments-in-sector-56-gurgaon",
            propertyCount: 18,
            score: 98,
            filters: ["DLF", "Sector 56", "Apartments"],
          },
          {
            id: 2,
            title: "Luxury Apartments in Golf Course Road",
            slug: "luxury-apartments-in-golf-course-road",
            propertyCount: 26,
            score: 95,
            filters: ["Luxury", "Golf Course Road"],
          },
          {
            id: 3,
            title: "M3M Projects in Dwarka Expressway",
            slug: "m3m-projects-in-dwarka-expressway",
            propertyCount: 14,
            score: 93,
            filters: ["M3M", "Dwarka Expressway"],
          },
        ];

  return (
    <div className="space-y-5">

      {/* Heading */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            SEO Opportunities
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            High-value landing pages discovered from your property database.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0f3b2e] px-4 py-2 text-sm font-semibold text-white">
          {demoPages.length} Opportunities
        </div>
      </div>

      {/* Cards */}

      <div className="grid gap-5 lg:grid-cols-3">
        {demoPages.map((page) => (
          <div
            key={page.id}
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Glow */}

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#d4af37]/10 blur-3xl transition group-hover:scale-125" />

            {/* Score */}

            <div className="mb-5 flex items-center justify-between">

              <div className="flex items-center gap-2 rounded-full bg-[#fff7df] px-3 py-1.5 text-sm font-semibold text-[#b68b1d]">
                <Star size={15} fill="currentColor" />
                {page.score}
              </div>

              <div className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
                {page.propertyCount} Properties
              </div>

            </div>

            {/* Title */}

            <h3 className="text-lg font-bold text-gray-900">
              {page.title}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              /{page.slug}
            </p>

            {/* Filters */}

            <div className="mt-5 flex flex-wrap gap-2">
              {page.filters.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Metrics */}

            <div className="mt-6 grid grid-cols-3 gap-3">

              <div className="rounded-2xl bg-[#f7f9f8] p-3 text-center">
                <Building2
                  size={18}
                  className="mx-auto mb-2 text-[#0f3b2e]"
                />
                <p className="text-xs text-gray-500">
                  Developer
                </p>
              </div>

              <div className="rounded-2xl bg-[#f7f9f8] p-3 text-center">
                <MapPin
                  size={18}
                  className="mx-auto mb-2 text-[#0f3b2e]"
                />
                <p className="text-xs text-gray-500">
                  Location
                </p>
              </div>

              <div className="rounded-2xl bg-[#f7f9f8] p-3 text-center">
                <Home
                  size={18}
                  className="mx-auto mb-2 text-[#0f3b2e]"
                />
                <p className="text-xs text-gray-500">
                  Category
                </p>
              </div>

            </div>

            {/* CTA */}

            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c9a64b] to-[#e0be69] px-5 py-3 font-semibold text-black transition hover:scale-[1.02]">
              <Sparkles size={18} />
              Generate Page
              <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}