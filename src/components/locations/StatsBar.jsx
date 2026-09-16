"use client";

import {
  MapPin,
  Layers3,
  Building2,
} from "lucide-react";

export default function StatsBar({
  locations = [],
}) {
  const rootCount =
    locations.filter(
      (location) =>
        location?._level === 0
    ).length;

  const childCount =
    locations.filter(
      (location) =>
        location?._level > 0
    ).length;

  const totalCount =
    locations.length;

  const stats = [
    {
      value: rootCount,
      label: "Major Locations",
      icon: MapPin,
    },
    {
      value: childCount,
      label: "Local Areas",
      icon: Layers3,
    },
    {
      value: totalCount,
      label: "Property Markets",
      icon: Building2,
    },
  ];

  return (
    <section className="relative z-10 -mt-8 px-6 sm:px-8 lg:px-12">

      <div className="mx-auto max-w-6xl rounded-[28px] border border-white/10 bg-[#0f3b2e] px-5 py-7 shadow-2xl sm:px-8">

        <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

          {stats.map(
            ({
              value,
              label,
              icon: Icon,
            }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-4 px-5 py-4 sm:py-2"
              >

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#C89D58]/30 bg-[#C89D58]/10">
                  <Icon
                    size={20}
                    className="text-[#D4AF37]"
                  />
                </div>

                <div>
                  <p className="text-2xl font-semibold text-white">
                    {value}
                  </p>

                  <p className="text-xs uppercase tracking-[0.15em] text-white/50">
                    {label}
                  </p>
                </div>

              </div>
            )
          )}

        </div>

      </div>

    </section>
  );
}