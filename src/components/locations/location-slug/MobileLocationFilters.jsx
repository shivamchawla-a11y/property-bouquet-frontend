"use client";

import { X } from "lucide-react";

import PropertyFilters from "@/utils/PropertyFilters";

export default function MobileLocationFilters({
  properties = [],

  selectedLocation,
  selectedDeveloper,
  selectedBudget,
  selectedAmenity,
  selectedBhk,
  selectedPropertyType,

  baseUrl,

  onFiltered,
  onClose,
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        xl:hidden
      "
    >

      {/* ==================================================
          OVERLAY
      ================================================== */}

      <div
        className="
          absolute
          inset-0
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

        {/* ==================================================
            HEADER
        ================================================== */}

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
            onClick={onClose}
            aria-label="Close filters"
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
            <X size={20} />
          </button>

        </div>

        {/* ==================================================
            FILTERS
        ================================================== */}

        <div className="p-5">

          <PropertyFilters
            properties={properties}
            onFiltered={onFiltered}
            selectedLocation={
              selectedLocation
            }
            selectedDeveloper={
              selectedDeveloper
            }
            selectedBudget={
              selectedBudget
            }
            selectedAmenity={
              selectedAmenity
            }
            selectedBhk={
              selectedBhk
            }
            selectedPropertyType={
              selectedPropertyType
            }
            baseUrl={baseUrl}
          />

        </div>

      </div>

    </div>
  );
}