"use client";

import dynamic from "next/dynamic";
import { X } from "lucide-react";

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

export default function DeveloperMobileFilters({
  open,
  onClose,
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
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        xl:hidden
      "
      role="dialog"
      aria-modal="true"
      aria-label="Property filters"
    >
      {/* ==================================================
          OVERLAY
      ================================================== */}

      <button
        type="button"
        aria-label="Close property filters"
        className="
          absolute
          inset-0
          h-full
          w-full
          cursor-default
          bg-black/60
        "
        onClick={onClose}
      />

      {/* ==================================================
          DRAWER
      ================================================== */}

      <div
        className="
          absolute
          left-0
          top-0
          h-full
          w-[88%]
          max-w-[380px]
          overflow-y-auto
          bg-white
          shadow-2xl
        "
      >
        {/* HEADER */}

        <div
          className="
            sticky
            top-0
            z-20
            flex
            items-center
            justify-between
            border-b
            bg-white
            p-5
          "
        >
          <div>
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.2em]
                text-[#B58B2D]
              "
            >
              Property Search
            </p>

            <h2
              className="
                mt-1
                text-xl
                font-bold
                text-[#081c15]
              "
            >
              Filters
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close property filters"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-gray-100
              text-gray-700
            "
          >
            <X
              size={20}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* FILTERS */}

        <div className="p-5">
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
    </div>
  );
}