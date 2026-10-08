"use client";

import Link from "next/link";

import {
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

import PropertyFilters from "@/utils/PropertyFilters";
import LocationPropertyCard from "./LocationPropertyCard";

/* ============================================================
   HELPERS
============================================================ */

function getPropertySlug(property) {
  return (
    property?.slug ||
    property?.seoEngine?.slug ||
    ""
  )
    .toString()
    .trim()
    .replace(/^\/+|\/+$/g, "");
}

function getPropertyTitle(property) {
  return (
    property?.coreDetails?.title ||
    property?.title ||
    property?.name ||
    "Property Project"
  )
    .toString()
    .trim();
}

/* ============================================================
   LOCATION PROJECTS
============================================================ */

export default function LocationProjects({
  properties = [],

  /*
   * filteredProperties = the complete filtered
   * published project set.
   */
  filteredProperties = [],

  /*
   * currentProperties = the visually displayed
   * cards, normally the first 9.
   */
  currentProperties = [],

  /*
   * New prop.
   *
   * LocationSlugClient should pass:
   *
   * allProperties={filteredProperties}
   *
   * This is deliberately separate from currentProperties.
   */
  allProperties = [],

  locationName = "this location",

  sortBy,

  setSortBy,

  setShowFilters,

  filterProps,

  setFilteredProperties,

  setVisibleCards,

  cardsPerPage = 9,

  visibleCards = 9,
}) {
  /*
   * Complete set used for crawlable project links.
   *
   * Fallback to filteredProperties so this component
   * remains compatible if allProperties isn't passed yet.
   */
  const crawlableProperties =
    Array.isArray(allProperties) &&
    allProperties.length > 0
      ? allProperties
      : filteredProperties;

  return (
    <section
      id="projects"
      className="
        mx-auto
        max-w-[1500px]
        px-4
        py-16
        text-[#111827]
        md:py-20
      "
    >
      <div
        className="
          grid
          items-start
          gap-12
          xl:grid-cols-[360px_1fr]
          xl:gap-16
        "
      >
        {/* ==================================================
            DESKTOP FILTERS
        ================================================== */}

        <aside
          className="
            sticky
            top-28
            hidden
            self-start
            xl:block
          "
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

            <div className="mt-5 h-[2px] w-20 bg-[#D4AF37]" />

            <div className="mt-7">
              <PropertyFilters
                {...filterProps}
                onFiltered={(data) => {
                  /*
                   * Keep the parent filter state synchronized.
                   *
                   * This resets the visual cards back to 9
                   * after every filter operation.
                   */
                  setFilteredProperties(data);

                  setVisibleCards(
                    cardsPerPage
                  );
                }}
              />
            </div>
          </div>
        </aside>

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
              gap-7
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
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-[#D4AF37]
                  md:text-[11px]
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
                Properties in{" "}
                {locationName}
              </h2>

              <div className="mt-5 h-[2px] w-28 bg-[#D4AF37]" />

              <p
                className="
                  mt-6
                  max-w-2xl
                  text-[16px]
                  leading-8
                  text-[#666]
                  md:text-[17px]
                "
              >
                Browse an exclusive portfolio of
                luxury residences, premium apartments
                and investment opportunities in{" "}
                {locationName}.
              </p>
            </div>

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-4
              "
            >
              {/* ==================================================
                  MOBILE FILTER
              ================================================== */}

              <button
                type="button"
                onClick={() =>
                  setShowFilters(true)
                }
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
                />

                Filters
              </button>

              {/* ==================================================
                  COUNT
              ================================================== */}

              <div
                className="
                  rounded-2xl
                  border
                  border-[#E6DDCC]
                  bg-white
                  px-6
                  py-4
                  shadow-sm
                  md:px-7
                "
              >
                <p
                  className="
                    text-[10px]
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
            <span
              className="
                hidden
                text-sm
                font-semibold
                text-gray-500
                sm:block
              "
            >
              Sort By
            </span>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value
                  )
                }
                className="
                  h-12
                  min-w-[205px]
                  appearance-none
                  cursor-pointer
                  rounded-xl
                  border
                  border-[#d4af37]/25
                  bg-white
                  pl-4
                  pr-11
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

              <ChevronDown
                size={17}
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-[#D4AF37]
                "
              />
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
                  <LocationPropertyCard
                    key={
                      property?._id ||
                      property?.id ||
                      property?.slug
                    }
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
                p-16
                text-center
                shadow-xl
                md:p-20
              "
            >
              <h3
                className="
                  text-3xl
                  font-black
                  text-[#081c15]
                  md:text-4xl
                "
              >
                No Properties Found
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

          {visibleCards <
            filteredProperties.length && (
            <div
              className="
                mt-12
                flex
                justify-center
              "
            >
              <button
                type="button"
                onClick={() =>
                  setVisibleCards(
                    (previous) =>
                      previous +
                      cardsPerPage
                  )
                }
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
            </div>
          )}

          {/* ==================================================
              ALL PROJECTS DIRECTORY
              
              IMPORTANT SEO / CRAWLABILITY SECTION

              This is NOT a hidden SEO link block.

              It is a legitimate, user-accessible list of
              every project currently matching the filters.

              Google can discover the actual property URLs
              without requiring a user to click "Load More".
          ================================================== */}

          {crawlableProperties.length > 0 && (
            <details
              className="
                mt-14
                overflow-hidden
                rounded-[28px]
                border
                border-[#E8DFC9]
                bg-white
                shadow-[0_16px_55px_rgba(0,0,0,0.045)]
              "
            >
              <summary
                className="
                  flex
                  cursor-pointer
                  list-none
                  items-center
                  justify-between
                  gap-6
                  px-6
                  py-5
                  outline-none
                  md:px-7
                  md:py-6
                "
              >
                <span>
                  <span
                    className="
                      block
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                      text-[#B58B2D]
                    "
                  >
                    Project Directory
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      font-playfair
                      text-xl
                      text-[#081c15]
                      md:text-2xl
                    "
                  >
                    Browse all{" "}
                    {crawlableProperties.length}{" "}
                    projects in{" "}
                    {locationName}
                  </span>
                </span>

                <span
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#D4AF37]/30
                    text-[#B58B2D]
                  "
                  aria-hidden="true"
                >
                  <ChevronDown
                    size={18}
                  />
                </span>
              </summary>

              <div
                className="
                  border-t
                  border-[#EEE7D8]
                  px-6
                  py-6
                  md:px-7
                  md:py-7
                "
              >
                <nav
                  aria-label={`All projects in ${locationName}`}
                >
                  <ul
                    className="
                      grid
                      gap-x-8
                      gap-y-3
                      md:grid-cols-2
                      xl:grid-cols-3
                    "
                  >
                    {crawlableProperties.map(
                      (property) => {
                        const propertySlug =
                          getPropertySlug(
                            property
                          );

                        const propertyTitle =
                          getPropertyTitle(
                            property
                          );

                        /*
                         * If a property somehow has no slug,
                         * do not create a broken internal link.
                         */
                        if (!propertySlug) {
                          return null;
                        }

                        return (
                          <li
                            key={
                              property?._id ||
                              property?.id ||
                              propertySlug
                            }
                          >
                            <Link
                              href={`/properties/${encodeURIComponent(
                                propertySlug
                              )}`}
                              className="
                                group
                                flex
                                min-h-[44px]
                                items-center
                                rounded-xl
                                px-3
                                py-2.5
                                text-sm
                                font-medium
                                text-[#33423c]
                                transition-colors
                                hover:bg-[#F7F3E8]
                                hover:text-[#081c15]
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#D4AF37]/50
                              "
                            >
                              <span
                                className="
                                  mr-3
                                  h-1.5
                                  w-1.5
                                  shrink-0
                                  rounded-full
                                  bg-[#D4AF37]
                                  transition-transform
                                  group-hover:scale-125
                                "
                              />

                              <span className="line-clamp-2">
                                {propertyTitle}
                              </span>
                            </Link>
                          </li>
                        );
                      }
                    )}
                  </ul>
                </nav>
              </div>
            </details>
          )}

          {/* ==================================================
              DIRECTORY EXPLANATION

              This is intentionally not a hidden SEO block.
              The user can expand it and browse every project.
          ================================================== */}

          {crawlableProperties.length > 0 && (
            <p
              className="
                mt-4
                text-center
                text-xs
                leading-6
                text-gray-400
              "
            >
              Explore every published project in{" "}
              {locationName} from the directory above.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}