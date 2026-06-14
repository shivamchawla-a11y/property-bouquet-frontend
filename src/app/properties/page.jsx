"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";


import Navbar from "@/components/home/Navbar";
import PropertyFilters from "@/utils/PropertyFilters";

import { formatPrice } from "@/utils/formatPrice";

import {
  MapPin,
  ArrowRight,
  Home,
} from "lucide-react";

export default function PropertiesPage() {
  const API =
  "https://property-bouquet-backend.onrender.com/api";

  const [properties, setProperties] =
    useState([]);

  const [filteredProperties, setFilteredProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [sortBy, setSortBy] =
    useState("newest");
    const searchParams =
  useSearchParams();

  const selectedLocation =
  searchParams.get("location");

const selectedDeveloper =
  searchParams.get("developer");

  // ================= FETCH =================

  useEffect(() => {
    const fetchProperties =
      async () => {
        try {
          const res = await fetch(
            `${API}/properties`
          );

          const data =
            await res.json();

          if (res.ok) {
            const activeProperties =
              (data.data || []).filter(
                (property) =>
                  property.status ===
                    "published" &&
                  property.isDeleted !== true &&
                  property.deletedFromStatus !==
                    "trash"
              );

            setProperties(activeProperties);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    fetchProperties();
  }, []);

  useEffect(() => {
  if (!properties.length) return;

  let result = [...properties];

  const search =
    searchParams.get("search");

  const type =
    searchParams.get("type");

  const location =
    searchParams.get("location");

  const developer =
    searchParams.get("developer");

  const budget =
    searchParams.get("budget");

  // SEARCH

  if (search) {
    result = result.filter(
      (property) =>
        property?.coreDetails?.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );
  }

  // PROPERTY TYPE

  if (type) {
    result = result.filter(
      (property) =>
        property?.categoryData?.categoryName
          ?.toLowerCase() ===
        type.toLowerCase()
    );
  }

  // LOCATION

  if (location) {
    result = result.filter(
      (property) =>
        property?.locationData?.locationName
          ?.toLowerCase()
          .includes(
            location.toLowerCase()
          )
    );
  }

  // DEVELOPER

  if (developer) {
    result = result.filter(
      (property) =>
        property?.developerName
          ?.toLowerCase()
          .includes(
            developer.toLowerCase()
          ) ||

        property?.coreDetails?.developerName
          ?.toLowerCase()
          .includes(
            developer.toLowerCase()
          )
    );
  }

  // BUDGET

  if (budget) {
    const [
      minBudget,
      maxBudget,
    ] = budget
      .split("-")
      .map(Number);

    result = result.filter(
      (property) => {
        const price =
          property?.coreDetails
            ?.startingPrice || 0;

        return (
          price >= minBudget &&
          price <= maxBudget
        );
      }
    );
  }

  // SORTING

  if (
    sortBy ===
    "price-low-high"
  ) {
    result.sort(
      (a, b) =>
        (a?.coreDetails
          ?.startingPrice || 0) -
        (b?.coreDetails
          ?.startingPrice || 0)
    );
  }

  if (
    sortBy ===
    "price-high-low"
  ) {
    result.sort(
      (a, b) =>
        (b?.coreDetails
          ?.startingPrice || 0) -
        (a?.coreDetails
          ?.startingPrice || 0)
    );
  }

  setFilteredProperties(
    result
  );
}, [
  properties,
  searchParams,
  sortBy,
]);
  // ================= SORT =================

  useEffect(() => {
    let sorted = [
      ...filteredProperties,
    ];

    if (
      sortBy ===
      "price-low-high"
    ) {
      sorted.sort(
        (a, b) =>
          (a?.coreDetails
            ?.startingPrice || 0) -
          (b?.coreDetails
            ?.startingPrice || 0)
      );
    }

    if (
      sortBy ===
      "price-high-low"
    ) {
      sorted.sort(
        (a, b) =>
          (b?.coreDetails
            ?.startingPrice || 0) -
          (a?.coreDetails
            ?.startingPrice || 0)
      );
    }

    setFilteredProperties(
      sorted
    );
  }, [sortBy]);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading Properties...
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f7] min-h-screen">

      <Navbar />

      {/* HERO */}

      <section
        className="
          relative
          pt-28
          pb-16
          overflow-hidden
          bg-gradient-to-br
          from-[#081c15]
          via-[#10281f]
          to-[#163b2c]
        "
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/20 blur-3xl rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4">

          <div className="max-w-4xl">

            <div
              className="
                inline-flex
                items-center
                gap-3
                bg-white/10
                border
                border-white/10
                backdrop-blur-xl
                px-6
                py-3
                rounded-full
                text-white
                mb-8
              "
            >
              <Home size={18} />

              <span className="font-medium tracking-wide">
                Luxury Property Collection
              </span>
            </div>

            <h1
              className="
                text-4xl
                md:text-6xl
                font-black
                text-white
                leading-tight
              "
            >
              Explore Premium
              <br />
              Properties
            </h1>

            <p
              className="
                mt-5
                text-lg
                md:text-xl
                text-white/75
                max-w-3xl
                leading-8
              "
            >
              Discover luxury residences,
              investment opportunities and
              iconic developments across
              Gurgaon and NCR.
            </p>

            <div
              className="
                mt-8
                bg-white
                text-black
                px-7
                h-14
                rounded-2xl
                inline-flex
                items-center
                font-bold
              "
            >
              {filteredProperties.length} Properties
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}

      <section
        className="
          max-w-[1500px]
          mx-auto
          px-4
          py-16
        "
      >
        <div
          className="
            grid
            lg:grid-cols-[400px_1fr]
            gap-12
            items-start
          "
        >
          {/* FILTERS */}

          <PropertyFilters
  properties={properties}
  onFiltered={setFilteredProperties}
  selectedLocation={selectedLocation}
  selectedDeveloper={selectedDeveloper}
/>

          {/* RIGHT */}

          <div>

            {/* TOP BAR */}

            <div
              className="
                bg-white
                rounded-[30px]
                p-6
                shadow-lg
                border
                border-gray-100
                flex
                flex-col
                md:flex-row
                gap-5
                md:items-center
                md:justify-between
                mb-10
              "
            >
              <div>
                <h2
                  className="
                    text-3xl
                    font-black
                    text-[#081c15]
                  "
                >
                  Available Properties
                </h2>

                <p className="text-gray-500 mt-2">
                  Showing{" "}
                  {
                    filteredProperties.length
                  }{" "}
                  luxury residences
                </p>
              </div>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value
                  )
                }
                className="
                  h-14
                  px-5
                  rounded-2xl
                  border
                  border-gray-200
                  outline-none
                  bg-white
                "
              >
                <option value="newest">
                  Newest First
                </option>

                <option value="price-low-high">
                  Price Low To High
                </option>

                <option value="price-high-low">
                  Price High To Low
                </option>
              </select>
            </div>

            {/* GRID */}

            {filteredProperties.length >
            0 ? (
              <div
                className="
                  grid
                  md:grid-cols-2
                  xl:grid-cols-3
                  gap-8
                "
              >
                {filteredProperties.map(
                  (property) => (
                    <div
                      key={
                        property._id
                      }
                      className="
                        group
                        relative
                        bg-white
                        rounded-[32px]
                        overflow-hidden
                        border
                        border-gray-100
                        shadow-lg
                        hover:shadow-2xl
                        transition-all
                        duration-500
                      "
                    >
                      <div className="relative h-[320px] overflow-hidden">

                        <img
                          src={
                            property
                              ?.media
                              ?.heroImageUrl ||
                            "/placeholder.jpg"
                          }
                          alt={
                            property
                              ?.coreDetails
                              ?.title
                          }
                          className="
                            w-full
                            h-full
                            object-cover
                            group-hover:scale-110
                            transition
                            duration-700
                          "
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                        <div
                          className="
                            absolute
                            top-5
                            right-5
                            bg-[#081c15]
                            text-white
                            px-5
                            py-2
                            rounded-full
                            text-sm
                            font-bold
                          "
                        >
                          ₹{" "}
                          {formatPrice(
                            property
                              ?.coreDetails
                              ?.startingPrice
                          )}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

                          <h3 className="text-2xl font-black">
                            {
                              property
                                ?.coreDetails
                                ?.title
                            }
                          </h3>

                          <div className="flex items-center gap-2 text-white/80 mt-3">
                            <MapPin size={16} />

                            <span className="text-sm">
                              {
                                property
                                  ?.locationData
                                  ?.locationName
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <button
                          className="
                            w-full
                            h-14
                            rounded-2xl
                            bg-[#081c15]
                            hover:bg-[#1b4332]
                            text-white
                            font-bold
                            flex
                            items-center
                            justify-center
                            gap-3
                          "
                        >
                          Explore Property

                          <ArrowRight
                            size={18}
                          />
                        </button>
                      </div>

                      <Link
                        href={`/${property.slug}`}
                        className="absolute inset-0 z-10"
                      />
                    </div>
                  )
                )}
              </div>
            ) : (
              <div
                className="
                  bg-white
                  rounded-[32px]
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
                  No Properties Found
                </h3>

                <p className="text-gray-500 mt-4 text-lg">
                  Try adjusting your
                  filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}