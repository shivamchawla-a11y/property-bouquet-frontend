"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
} from "lucide-react";

import DeveloperFilters from "./DeveloperFilters";
import DeveloperProjectCard from "./DeveloperProjectCard";
import DeveloperMobileFilters from "./DeveloperMobileFilters";

const CARDS_PER_PAGE = 9;

export default function DeveloperProjects({
  developer,
  properties = [],
  slug,
}) {
  const searchParams = useSearchParams();

  const [filteredProperties, setFilteredProperties] =
    useState(() => [...properties]);

  const [sortBy, setSortBy] =
    useState("newest");

  const [visibleCards, setVisibleCards] =
    useState(CARDS_PER_PAGE);

  const [showFilters, setShowFilters] =
    useState(false);

  /* ==========================================================
      URL FILTERS
  ========================================================== */

  const selectedLocation =
    searchParams.get("location");

  const selectedDeveloper =
    developer?.name ||
    searchParams.get("developer");

  const selectedBudget =
    searchParams.get("budget");

  const selectedAmenity =
    searchParams.get("amenity");

  const selectedBhk =
    searchParams.get("bhk");

  const selectedPropertyType =
    searchParams.get("propertyType");

  /* ==========================================================
      URL FILTERING
  ========================================================== */

  useEffect(() => {
    let result = [...properties];

    /* ========================================================
        SEARCH
    ======================================================== */

    const search =
      searchParams.get("search");

    if (search) {
      const normalizedSearch =
        search.toLowerCase();

      result = result.filter(
        (property) =>
          property?.coreDetails?.title
            ?.toLowerCase()
            .includes(normalizedSearch)
      );
    }

    /* ========================================================
        PROPERTY TYPE
    ======================================================== */

    const type =
      searchParams.get("propertyType");

    if (type) {
      const searchCategory =
        type.toLowerCase().trim();

      result = result.filter(
        (property) => {
          const categoryName =
            property?.categoryData?.categoryName
              ?.toLowerCase()
              .trim();

          if (!categoryName) {
            return false;
          }

          return (
            categoryName.includes(
              searchCategory
            ) ||
            searchCategory.includes(
              categoryName
            )
          );
        }
      );
    }

    /* ========================================================
        LOCATION
    ======================================================== */

    const location =
      searchParams.get("location");

    if (location) {
      const searchLocation =
        location.toLowerCase().trim();

      result = result.filter(
        (property) => {
          const locationNames = [];

          let current =
            property?.locationData?.locationRef;

          while (current) {
            if (current?.name) {
              locationNames.push(
                current.name
                  .toLowerCase()
                  .trim()
              );
            }

            current = current.parent;
          }

          if (
            property?.locationData?.locationName
          ) {
            locationNames.push(
              property.locationData.locationName
                .toLowerCase()
                .trim()
            );
          }

          if (
            property?.locationData?.customLocation
          ) {
            locationNames.push(
              property.locationData.customLocation
                .toLowerCase()
                .trim()
            );
          }

          return locationNames.some(
            (name) =>
              name.includes(searchLocation)
          );
        }
      );
    }

    /* ========================================================
        DEVELOPER
    ======================================================== */

    const developerFilter =
      searchParams.get("developer");

    if (developerFilter) {
      const searchDeveloper =
        developerFilter
          .toLowerCase()
          .trim();

      result = result.filter(
        (property) => {
          const developerNames = [
            property?.developerName,
            property?.coreDetails?.developerName,
            property?.developer?.name,
            property?.developerData?.name,
            property?.developerRef?.name,
          ]
            .filter(Boolean)
            .map((item) =>
              item
                .toLowerCase()
                .trim()
            );

          return developerNames.some(
            (name) =>
              name.includes(searchDeveloper) ||
              searchDeveloper.includes(name)
          );
        }
      );
    }

    /* ========================================================
        BUDGET
    ======================================================== */

    const budget =
      searchParams.get("budget");

    if (budget) {
      const [
        minBudget,
        maxBudget,
      ] = budget
        .split("-")
        .map(Number);

      if (
        Number.isFinite(minBudget) &&
        Number.isFinite(maxBudget)
      ) {
        result = result.filter(
          (property) => {
            if (
              property?.coreDetails
                ?.priceOnRequest
            ) {
              return true;
            }

            const startPrice =
              property?.coreDetails
                ?.startingPrice || 0;

            const maxPrice =
              property?.coreDetails
                ?.maxPrice ||
              startPrice;

            return (
              maxPrice >= minBudget &&
              startPrice <= maxBudget
            );
          }
        );
      }
    }

    /* ========================================================
        AMENITIES
    ======================================================== */

    const amenitiesParam =
      searchParams.get("amenity");

    const selectedAmenities =
      amenitiesParam
        ? amenitiesParam
            .split(",")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean)
        : [];

    if (selectedAmenities.length) {
      result = result.filter(
        (property) => {
          const propertyAmenities =
            property?.overview?.amenities
              ?.map(
                (item) =>
                  item?.heading
                    ?.toLowerCase()
                    .trim()
              )
              .filter(Boolean) || [];

          return selectedAmenities.every(
            (amenity) =>
              propertyAmenities.includes(
                amenity
                  .toLowerCase()
                  .trim()
              )
          );
        }
      );
    }

    /* ========================================================
        BHK
    ======================================================== */

    const bhk =
      searchParams.get("bhk");

    if (bhk) {
      result = result.filter(
        (property) =>
          property?.gatedContent
            ?.floorPlans
            ?.some(
              (plan) =>
                plan?.unitType
                  ?.toLowerCase()
                  .trim() ===
                bhk
                  .toLowerCase()
                  .trim()
            )
      );
    }

    /* ========================================================
        SORTING
    ======================================================== */

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(
            b?.createdAt || 0
          ) -
          new Date(
            a?.createdAt || 0
          )
      );
    }

    if (
      sortBy ===
      "price-low-high"
    ) {
      result.sort(
        (a, b) =>
          (
            a?.coreDetails
              ?.startingPrice || 0
          ) -
          (
            b?.coreDetails
              ?.startingPrice || 0
          )
      );
    }

    if (
      sortBy ===
      "price-high-low"
    ) {
      result.sort(
        (a, b) =>
          (
            b?.coreDetails
              ?.startingPrice || 0
          ) -
          (
            a?.coreDetails
              ?.startingPrice || 0
          )
      );
    }

    setVisibleCards(
      CARDS_PER_PAGE
    );

    setFilteredProperties(result);
  }, [
    properties,
    searchParams,
    sortBy,
  ]);

  /* ==========================================================
      BODY LOCK
  ========================================================== */

  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [showFilters]);

  /* ==========================================================
      CURRENT PROPERTIES
  ========================================================== */

  const currentProperties =
    filteredProperties.slice(
      0,
      visibleCards
    );

  /* ==========================================================
      FILTER CALLBACK
  ========================================================== */

  const handleFiltered = (data) => {
    setFilteredProperties(data);
    setVisibleCards(CARDS_PER_PAGE);
  };

  /* ==========================================================
      RENDER
  ========================================================== */

  return (
    <>
      <section
        id="projects"
        className="
          mx-auto
          max-w-[1500px]
          px-4
          py-16
        "
      >
        <div
          className="
            grid
            items-start
            gap-16
            xl:grid-cols-[360px_1fr]
          "
        >
          {/* ==================================================
              DESKTOP FILTERS
          ================================================== */}

          <DeveloperFilters
            properties={properties}
            selectedLocation={selectedLocation}
            selectedDeveloper={selectedDeveloper}
            selectedBudget={selectedBudget}
            selectedAmenity={selectedAmenity}
            selectedBhk={selectedBhk}
            selectedPropertyType={selectedPropertyType}
            slug={slug}
            onFiltered={handleFiltered}
          />

          {/* ==================================================
              RIGHT CONTENT
          ================================================== */}

          <div>
            {/* ==================================================
                TOP BAR
            ================================================== */}

            <div
              className="
                mb-10
                flex
                flex-col
                gap-8
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >
              <div>
                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    bg-[#0B221B]
                    px-5
                    py-2
                    text-[11px]
                    uppercase
                    tracking-[0.25em]
                    text-[#D4AF37]
                  "
                >
                  Exclusive Collection
                </span>

                <h2
                  className="
                    mt-5
                    font-playfair
                    text-4xl
                    leading-tight
                    text-[#081c15]
                    md:text-5xl
                  "
                >
                  Projects by {developer.name}
                </h2>

                <div
                  className="
                    mt-5
                    h-[2px]
                    w-28
                    bg-[#D4AF37]
                  "
                  aria-hidden="true"
                />

                <p
                  className="
                    mt-6
                    max-w-2xl
                    text-[17px]
                    leading-8
                    text-[#666]
                  "
                >
                  Browse an exclusive portfolio
                  of luxury residences, premium
                  apartments and investment
                  opportunities developed by{" "}
                  {developer.name}.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* MOBILE FILTER */}

                <button
                  type="button"
                  onClick={() =>
                    setShowFilters(true)
                  }
                  aria-label="Open property filters"
                  className="
                    flex
                    h-14
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[#081c15]
                    px-6
                    font-semibold
                    text-white
                    xl:hidden
                  "
                >
                  <SlidersHorizontal
                    size={17}
                    aria-hidden="true"
                  />

                  Filters
                </button>

                {/* PROJECT COUNT */}

                <div
                  className="
                    rounded-2xl
                    border
                    border-[#E6DDCC]
                    bg-white
                    px-7
                    py-4
                    shadow-sm
                  "
                >
                  <p
                    className="
                      text-[12px]
                      uppercase
                      tracking-[0.18em]
                      text-[#888]
                    "
                  >
                    Available Projects
                  </p>

                  <h3
                    className="
                      mt-1
                      text-3xl
                      font-bold
                      text-[#081c15]
                    "
                  >
                    {filteredProperties.length}
                  </h3>
                </div>
              </div>
            </div>

            {/* ==================================================
                SORT
            ================================================== */}

            <div
              className="
                mb-8
                flex
                items-center
                justify-end
                gap-3
              "
            >
              <label
                htmlFor="developer-project-sort"
                className="
                  text-sm
                  font-semibold
                  text-gray-500
                "
              >
                Sort By
              </label>

              <div className="relative">
                <select
                  id="developer-project-sort"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value
                    )
                  }
                  aria-label="Sort developer projects"
                  className="
                    h-12
                    min-w-[220px]
                    cursor-pointer
                    appearance-none
                    rounded-xl
                    border
                    border-[#d4af37]/25
                    bg-white
                    pl-4
                    pr-10
                    font-semibold
                    text-[#081c15]
                    outline-none
                    shadow-sm
                    focus:border-[#D4AF37]
                    focus:ring-4
                    focus:ring-[#D4AF37]/10
                  "
                >
                  <option value="newest">
                    Newest First
                  </option>

                  <option value="price-low-high">
                    Price: Low to High
                  </option>

                  <option value="price-high-low">
                    Price: High to Low
                  </option>
                </select>

                <span
                  className="
                    pointer-events-none
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#D4AF37]
                  "
                  aria-hidden="true"
                >
                  ▼
                </span>
              </div>
            </div>

            {/* ==================================================
                PROPERTY GRID
            ================================================== */}

            {currentProperties.length > 0 ? (
              <div
                className="
                  grid
                  gap-8
                  md:grid-cols-2
                  xl:grid-cols-3
                "
              >
                {currentProperties.map(
                  (property) => (
                    <DeveloperProjectCard
                      key={property._id}
                      property={property}
                    />
                  )
                )}
              </div>
            ) : (
              <div
                className="
                  rounded-[32px]
                  bg-white
                  p-20
                  text-center
                  shadow-xl
                "
              >
                <h3
                  className="
                    text-4xl
                    font-black
                    text-[#081c15]
                  "
                >
                  No Projects Found
                </h3>

                <p
                  className="
                    mt-4
                    text-lg
                    text-gray-500
                  "
                >
                  Try adjusting your filters.
                </p>
              </div>
            )}

            {/* ==================================================
                LOAD MORE
            ================================================== */}

            <div className="mt-12 flex justify-center">
              {visibleCards <
                filteredProperties.length && (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCards(
                      (prev) =>
                        prev +
                        CARDS_PER_PAGE
                    )
                  }
                  aria-label="Load more developer projects"
                  className="
                    h-14
                    rounded-2xl
                    bg-[#D4AF37]
                    px-10
                    font-bold
                    text-black
                    shadow-lg
                    transition-all
                    duration-300
                    hover:scale-105
                    hover:bg-[#c89c20]
                  "
                >
                  Load More
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          MOBILE FILTER DRAWER
      ====================================================== */}

      <DeveloperMobileFilters
        open={showFilters}
        onClose={() =>
          setShowFilters(false)
        }
        properties={properties}
        selectedLocation={selectedLocation}
        selectedDeveloper={selectedDeveloper}
        selectedBudget={selectedBudget}
        selectedAmenity={selectedAmenity}
        selectedBhk={selectedBhk}
        selectedPropertyType={selectedPropertyType}
        slug={slug}
        onFiltered={(data) => {
          setFilteredProperties(data);
          setVisibleCards(CARDS_PER_PAGE);
          setShowFilters(false);
        }}
      />
    </>
  );
}