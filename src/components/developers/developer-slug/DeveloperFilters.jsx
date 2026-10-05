"use client";

import dynamic from "next/dynamic";

const PropertyFilters = dynamic(
  () => import("@/utils/PropertyFilters"),
  {
    ssr: false,

    loading: () => (
      <div
        className="
          min-h-[220px]
          rounded-2xl
          bg-[#f7f7f7]
          animate-pulse
        "
        aria-label="Loading property filters"
      />
    ),
  }
);

export default function DeveloperFilters({
  properties = [],
  selectedLocation,
  selectedDeveloper,
  selectedBudget,
  selectedAmenity,
  selectedBhk,
  selectedPropertyType,
  slug,
  onFiltered,
}) {
  return (
    <aside
      className="
        sticky
        top-28
        hidden
        self-start
        xl:block
      "
      aria-label="Property filters"
    >
      <div
        className="
          rounded-[34px]
          border
          border-[#E8DFC9]
          bg-white
          p-7
          shadow-[0_20px_70px_rgba(0,0,0,0.06)]
        "
      >
        <p
          className="
            text-[11px]
            uppercase
            tracking-[0.25em]
            text-[#B58B2D]
          "
        >
          Property Search
        </p>

        <h3
          className="
            mt-2
            font-playfair
            text-3xl
            text-[#081c15]
          "
        >
          Refine Results
        </h3>

        <div
          className="
            mt-5
            h-[2px]
            w-20
            bg-[#D4AF37]
          "
          aria-hidden="true"
        />

        <div className="mt-7">
          <PropertyFilters
            properties={properties}
            onFiltered={onFiltered}
            selectedLocation={selectedLocation}
            selectedDeveloper={selectedDeveloper}
            selectedBudget={selectedBudget}
            selectedAmenity={selectedAmenity}
            selectedBhk={selectedBhk}
            selectedPropertyType={selectedPropertyType}
            baseUrl={`/developers/${slug}`}
          />
        </div>
      </div>
    </aside>
  );
}