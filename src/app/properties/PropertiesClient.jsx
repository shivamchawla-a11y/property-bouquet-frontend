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
  Heart,
} from "lucide-react";

export default function PropertiesClient() {
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

const selectedBudget =
  searchParams.get("budget");

  const selectedAmenity =
  searchParams.get("amenity");

  const selectedBhk =
  searchParams.get("bhk");

  const selectedPropertyType =
  searchParams.get("propertyType");

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
  searchParams.get(
    "propertyType"
  );

  const location =
    searchParams.get("location");

  const developer =
    searchParams.get("developer");

  const budget =
    searchParams.get("budget");

  const amenitiesParam =
  searchParams.get("amenity");

  const bhk =
  searchParams.get("bhk");

const selectedAmenities =
  amenitiesParam
    ? amenitiesParam
        .split(",")
        .map((item) => item.trim())
    : [];

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
        const startPrice =
  property?.coreDetails
    ?.startingPrice || 0;

const maxPrice =
  property?.coreDetails
    ?.maxPrice || 0;

return (
  maxPrice >= minBudget &&
  startPrice <= maxBudget
);
      }
    );
  }

  // AMENITY

if (selectedAmenities.length) {
  result = result.filter((property) => {

    const propertyAmenities =
      property?.overview?.amenities?.map(
        (item) =>
          item?.heading
            ?.toLowerCase()
            .trim()
      ) || [];

    return selectedAmenities.every(
      (amenity) =>
        propertyAmenities.includes(
          amenity
            .toLowerCase()
            .trim()
        )
    );
  });
}

// BHK

if (bhk) {
  result = result.filter(
    (property) =>
      property?.gatedContent?.floorPlans?.some(
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

      {/* MAIN */}

      <section
  className="
    max-w-[1500px]
    mx-auto
    px-4
    mt-28
    py-16
  "
>
        <div
  className="
    grid
    lg:grid-cols-[300px_1fr]
    gap-8
    items-start
  "
>
          {/* FILTERS */}

          <PropertyFilters
  properties={properties}
  onFiltered={setFilteredProperties}
  selectedLocation={selectedLocation}
  selectedDeveloper={selectedDeveloper}
  selectedBudget={selectedBudget}
  selectedAmenity={selectedAmenity}
  selectedBhk={selectedBhk}
  selectedPropertyType={
    selectedPropertyType
  }
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

              <div className="flex items-center gap-4">
  <span
    className="
      text-sm
      font-semibold
      text-gray-500
      whitespace-nowrap
    "
  >
    Sort By
  </span>

  <div className="relative">
    <select
      value={sortBy}
      onChange={(e) =>
        setSortBy(e.target.value)
      }
      className="
        h-14
        min-w-[240px]
        pl-5
        pr-12
        rounded-2xl
        border
        border-[#d4af37]/25
        bg-white
        text-[#081c15]
        font-semibold
        shadow-[0_4px_20px_rgba(0,0,0,0.05)]
        outline-none
        appearance-none
        cursor-pointer
        transition-all
        duration-300
        hover:border-[#D4AF37]/50
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

    <div
      className="
        absolute
        right-5
        top-1/2
        -translate-y-1/2
        pointer-events-none
        text-[#D4AF37]
        text-sm
      "
    >
      ▼
    </div>
  </div>
</div>
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
  key={property._id}
  className="
    group
    relative
    h-[420px]
    overflow-hidden
    rounded-[24px]
    border
    border-[#D4AF37]/25
    bg-white
    transition-all
    duration-500
    hover:-translate-y-1
    hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)]
  "
>
  {/* IMAGE */}

<img
src={
property?.media?.heroImageUrl ||
"/placeholder.jpg"
}
alt={property?.coreDetails?.title}
className="
absolute
inset-0
w-full
h-full
object-cover
transition-transform
duration-700
group-hover:scale-105
"
/>

{/* OVERLAY */}

  <div
    className="
      absolute
      inset-0
      bg-gradient-to-t
      from-black/95
      via-black/35
      to-transparent
    "
  />

{/* TOP BADGES */}

  <div
    className="
      absolute
      top-4
      left-4
      right-4
      z-20
      flex
      items-center
      justify-between
    "
  >
    <div className="flex gap-2">

  <span
    className="
      px-3
      py-1.5
      rounded-full
      bg-black/60
      text-white
      text-[10px]
      font-semibold
      tracking-wider
    "
  >
    LUXURY
  </span>

  {property?.propertyTag && (
    <span
      className="
        px-3
        py-1.5
        rounded-full
        bg-[#D4AF37]
        text-black
        text-[10px]
        font-bold
      "
    >
      {property.propertyTag}
    </span>
  )}
</div>

<button
  className="
    w-11
    h-11
    rounded-full
    bg-black/45
    backdrop-blur-xl
    border
    border-white/20
    flex
    items-center
    justify-center
    text-white
    shadow-[0_8px_20px_rgba(0,0,0,0.25)]
    transition-all
    duration-300
    hover:scale-110
    hover:bg-black/60
  "
>
  <Heart size={18} strokeWidth={2} />
</button>


  </div>

{/* CONTENT */}

  <div
    className="
      absolute
      bottom-0
      left-0
      right-0
      z-20
      p-5
    "
  >
    {/* TITLE */}


<h3
  className="
    text-white
    text-[28px]
    font-black
    leading-[1.05]
    mb-2
  "
>
  {property?.coreDetails?.title}
</h3>

{/* LOCATION */}

<div
  className="
    flex
    items-center
    gap-2
    text-white/85
    text-sm
    mb-4
  "
>
  <MapPin
    size={14}
    className="shrink-0"
  />

  <span className="truncate">
    {property?.locationData?.locationName
      ?.split(">")
      ?.map((item) => item.trim())
      ?.reverse()
      ?.join(" • ")}
  </span>
</div>


{/* PRICE */}

<div
  className="
    inline-flex
    flex-col
    bg-black/70
    backdrop-blur-xl
    border
    border-[#D4AF37]/30
    rounded-[18px]
    px-4
    py-3
    mb-5
  "
>
  <span
    className="
      text-[10px]
      uppercase
      tracking-[2px]
      text-white/60
    "
  >
    Starting From
  </span>

  <span
    className="
      text-[#F5D77D]
      text-[22px]
      font-bold
    "
  >
    ₹
    {formatPrice(
      property?.coreDetails?.startingPrice
    )}
  </span>
</div>

{/* BOTTOM ROW */}

<div
  className="
    flex
    items-center
    justify-between
    border-t
    border-white/10
    pt-4
  "
>
  <div className="flex gap-4">

    <div>
      <p className="text-[10px] text-white/50">
        CONFIG
      </p>

      <p className="text-xs text-white">
        {property?.configurationSummary ||
          property?.categoryData
            ?.categoryName}
      </p>
    </div>

    <div>
      <p className="text-[10px] text-white/50">
        BUILDER
      </p>

      <p className="text-xs text-white">
        {property?.coreDetails
          ?.developerName}
      </p>
    </div>

    <div>
      <p className="text-[10px] text-white/50">
        AMENITIES
      </p>

      <p className="text-xs text-white">
        25+
      </p>
    </div>
  </div>

  <Link
    href={`/properties/${property.slug}`}
    className="
      w-11
      h-11
      rounded-full
      bg-[#D4AF37]
      flex
      items-center
      justify-center
      transition-all
      duration-300
      group-hover:scale-110
    "
  >
    <ArrowRight
      size={16}
      className="text-black"
    />
  </Link>
</div>


  </div>

{/* GOLD BORDER */}

  <div
    className="
      absolute
      inset-0
      rounded-[24px]
      border
      border-[#D4AF37]/15
      pointer-events-none
    "
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