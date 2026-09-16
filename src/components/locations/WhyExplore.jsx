"use client";

import {
  MapPin,
  Search,
  Building2,
} from "lucide-react";

export default function WhyExplore() {
  const benefits = [
    {
      icon: MapPin,
      title: "Location-Specific Discovery",
      description:
        "Explore properties organized around individual cities, sectors, localities and major residential corridors.",
    },
    {
      icon: Search,
      title: "Curated Property Search",
      description:
        "Find premium residential opportunities through dedicated location pages designed around each real estate market.",
    },
    {
      icon: Building2,
      title: "Explore Developments",
      description:
        "Discover projects and residences available across established and emerging property destinations.",
    },
  ];

  return (
    <section className="border-y border-[#e8dfd3] bg-white">

      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">

        {/* Header */}

        <div className="mx-auto max-w-3xl text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C89D58]">
            Explore With Property Bouquet
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#081c15] sm:text-4xl">
            Your Property Search Starts With Location
          </h2>

          <p className="mt-5 text-base leading-8 text-[#6b7280]">
            Every location has its own character,
            connectivity, development profile and
            investment landscape. Explore dedicated
            property collections to understand the
            opportunities available in each market.
          </p>

        </div>

        {/* Benefits */}

        <div className="mt-14 grid gap-6 md:grid-cols-3">

          {benefits.map(
            ({
              icon: Icon,
              title,
              description,
            }) => (
              <div
                key={title}
                className="rounded-[28px] border border-[#e8dfd3] bg-[#f7f5f0] p-7"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f3b2e]">
                  <Icon
                    size={21}
                    className="text-[#D4AF37]"
                  />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-[#081c15]">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#6b7280]">
                  {description}
                </p>

              </div>
            )
          )}

        </div>

      </div>

    </section>
  );
}