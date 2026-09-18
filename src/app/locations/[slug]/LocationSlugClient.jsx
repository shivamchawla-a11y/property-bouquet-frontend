"use client";

import { formatPrice } from "@/utils/formatPrice";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/home/Navbar";
import PropertyFilters from "@/utils/PropertyFilters";
import Footer from "@/components/home/Footer";

import {
  MapPin,
  ArrowRight,
  SlidersHorizontal,
  Trophy,
  BadgeCheck,
  X,
  ChevronDown,
} from "lucide-react";

export default function LocationSlugClient({
  location,
  properties = [],
  slug,
}) {
  const searchParams = useSearchParams();

  const [filteredProperties, setFilteredProperties] =
    useState(() => [...properties]);

  const [sortBy, setSortBy] = useState("newest");

  const [visibleCards, setVisibleCards] =
    useState(9);

  const [showFilters, setShowFilters] =
    useState(false);

  const CARDS_PER_PAGE = 9;

  // ============================================================
  // LOCATION NAME
  // ============================================================

  const locationName =
    location?.name ||
    "Prime Location";


    // ============================================================
// PUBLIC LOCATION URL HELPERS
// ============================================================

const getLocationPreposition = (location) => {
  const name = String(location?.name || "")
    .trim()
    .toLowerCase();

  const slug = String(location?.slug || "")
    .trim()
    .toLowerCase();

  const value = `${name} ${slug}`;

  const onKeywords = [
    "expressway",
    "express way",
    "highway",
    "road",
    "street",
    "avenue",
    "boulevard",
    "drive",
    "marg",
  ];

  return onKeywords.some((keyword) =>
    value.includes(keyword)
  )
    ? "on"
    : "in";
};

const buildPublicLocationSlug = (location) => {
  if (!location) return "";

  const currentSlug = String(location?.slug || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  if (!currentSlug) return "";

  let root = location;

  const visited = new Set();

  while (root?.parent) {
    const rootId =
      root?._id?.toString?.() ||
      root?.id?.toString?.() ||
      root?.slug ||
      root?.name;

    if (
      rootId &&
      visited.has(rootId)
    ) {
      break;
    }

    if (rootId) {
      visited.add(rootId);
    }

    root = root.parent;
  }

  const rootSlug = String(root?.slug || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  const preposition =
    getLocationPreposition(location);

  if (
    !rootSlug ||
    rootSlug === currentSlug
  ) {
    return `properties-${preposition}-${currentSlug}`;
  }

  return `properties-${preposition}-${currentSlug}-${rootSlug}`;
};

  // ============================================================
  // FIND CLOSEST AVAILABLE LOCATION IMAGE
  // ============================================================
  /*
    Example:

    Sector 56
       ↓
    Golf Course Road  ← IMAGE FOUND → USE THIS
       ↓
    Gurgaon
       ↓
    No need to continue

    If Golf Course Road has no image:

    Sector 56
       ↓
    Golf Course Road
       ↓
    Gurgaon ← IMAGE FOUND → USE THIS
  */

  const getClosestLocationImage = (
    currentLocation
  ) => {
    const visited = new Set();

    let current = currentLocation;

    while (current) {
      const currentId =
        current?._id?.toString?.() ||
        current?.id?.toString?.() ||
        current?.slug ||
        current?.name;

      // Prevent circular parent references
      if (
        currentId &&
        visited.has(currentId)
      ) {
        break;
      }

      if (currentId) {
        visited.add(currentId);
      }

      const image =
        typeof current?.image === "string"
          ? current.image.trim()
          : "";

      if (image) {
        return image;
      }

      current = current?.parent;
    }

    return "";
  };

  // ============================================================
  // RESOLVED LOCATION IMAGE
  // ============================================================

  const locationImage = useMemo(() => {
    return getClosestLocationImage(location);
  }, [location]);

  // ============================================================
  // FINAL HERO IMAGE
  // ============================================================

  const heroImage =
    locationImage ||
    properties?.[0]?.media?.heroImageUrl ||
    "";

  // ============================================================
  // URL FILTERS
  // ============================================================

  const selectedLocation =
    location?.name ||
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

  // ============================================================
  // LOCATION DESCRIPTION
  // ============================================================

  const locationDescription =
    location?.description ||
    `Explore premium residences, landmark developments, and high-potential investment opportunities in ${locationName}, curated by Property Bouquet for discerning homebuyers and investors.`;

  // ============================================================
  // FILTERING
  // ============================================================

  useEffect(() => {
    let result = [...properties];

    // ==========================================================
    // SEARCH
    // ==========================================================

    const search =
      searchParams.get("search");

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

    // ==========================================================
    // PROPERTY TYPE
    // ==========================================================

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

    // ==========================================================
    // LOCATION
    // ==========================================================

    const locationFilter =
      searchParams.get("location");

    if (locationFilter) {
      const searchLocation =
        locationFilter
          .toLowerCase()
          .trim();

      result = result.filter(
        (property) => {
          const locationNames = [];

          let current =
            property?.locationData
              ?.locationRef;

          const visited = new Set();

          while (current) {
            const currentId =
              current?._id?.toString?.() ||
              current?.id?.toString?.() ||
              current?.slug ||
              current?.name;

            if (
              currentId &&
              visited.has(currentId)
            ) {
              break;
            }

            if (currentId) {
              visited.add(currentId);
            }

            if (current?.name) {
              locationNames.push(
                current.name
                  .toLowerCase()
                  .trim()
              );
            }

            current =
              current?.parent;
          }

          if (
            property?.locationData
              ?.locationName
          ) {
            locationNames.push(
              property.locationData.locationName
                .toLowerCase()
                .trim()
            );
          }

          if (
            property?.locationData
              ?.customLocation
          ) {
            locationNames.push(
              property.locationData.customLocation
                .toLowerCase()
                .trim()
            );
          }

          return locationNames.some(
            (name) =>
              name.includes(
                searchLocation
              ) ||
              searchLocation.includes(
                name
              )
          );
        }
      );
    }

    // ==========================================================
    // DEVELOPER
    // ==========================================================

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
            property?.coreDetails
              ?.developerName,
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
              name.includes(
                searchDeveloper
              ) ||
              searchDeveloper.includes(
                name
              )
          );
        }
      );
    }

    // ==========================================================
    // BUDGET
    // ==========================================================

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

    // ==========================================================
    // AMENITIES
    // ==========================================================

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

    if (
      selectedAmenities.length
    ) {
      result = result.filter(
        (property) => {
          const propertyAmenities =
            property?.overview
              ?.amenities
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

    // ==========================================================
    // BHK
    // ==========================================================

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

    // ==========================================================
    // SORTING
    // ==========================================================

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

  // ============================================================
  // BODY LOCK
  // ============================================================

  useEffect(() => {
    document.body.style.overflow =
      showFilters
        ? "hidden"
        : "auto";

    return () => {
      document.body.style.overflow =
        "auto";
    };
  }, [showFilters]);

  // ============================================================
  // CURRENT PROPERTIES
  // ============================================================

  const currentProperties =
    filteredProperties.slice(
      0,
      visibleCards
    );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#111827]">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <Navbar />

      {/* ======================================================
          PREMIUM LOCATION HERO
      ====================================================== */}

      <section
  className="
    relative
    min-h-[600px]
    overflow-hidden
    bg-[#061811]
    pt-[84px]
    pb-6
    text-white
    md:min-h-[620px]
  "
>

        {/* ====================================================
            FULL BACKGROUND IMAGE
        ==================================================== */}

        {heroImage && (
          <div
            className="
              absolute
              inset-0
              overflow-hidden
            "
          >

            <img
              src={heroImage}
              alt={`${locationName} real estate`}
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                object-center
                scale-[1.02]
                md:scale-105
              "
            />

            {/* RIGHT SIDE IMAGE PROTECTION */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-[#061811]
                via-[#061811]/80
                via-[55%]
                to-[#061811]/25
              "
            />

            {/* TOP DARKNESS */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-b
                from-[#061811]/80
                via-transparent
                to-[#061811]/80
              "
            />

            {/* RIGHT IMAGE SOFT DARKENING */}

            <div
              className="
                absolute
                right-0
                top-0
                h-full
                w-[58%]
                bg-black/10
              "
            />

            {/* GOLD ATMOSPHERIC GLOW */}

            <div
              className="
                absolute
                right-[5%]
                top-[12%]
                h-[420px]
                w-[420px]
                rounded-full
                bg-[#D4AF37]/10
                blur-[120px]
              "
            />

          </div>
        )}

        {/* ====================================================
            NO IMAGE BACKGROUND
        ==================================================== */}

        {!heroImage && (
          <>
            <div className="absolute inset-0 bg-[#061811]" />

            <div
              className="
                absolute
                right-[-150px]
                top-[10%]
                h-[500px]
                w-[500px]
                rounded-full
                bg-[#D4AF37]/10
                blur-[120px]
              "
            />
          </>
        )}

        {/* ====================================================
            PREMIUM IMAGE FRAME ON DESKTOP
        ==================================================== */}

        {heroImage && (
          <div
            className="
              pointer-events-none
              absolute
              right-[3%]
              top-[12%]
              hidden
              h-[410px]
              w-[46%]
              overflow-hidden
              rounded-[42px]
              border
              border-white/10
              md:block
              lg:right-[5%]
              lg:w-[40%]
              xl:h-[450px]
            "
          >

            <img
              src={heroImage}
              alt=""
              className="
                h-full
                w-full
                object-cover
                object-center
                opacity-80
              "
            />

            {/* FRAME OVERLAY */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-[#061811]/50
                via-transparent
                to-white/5
              "
            />

            {/* GOLD BORDER */}

            <div
              className="
                absolute
                inset-5
                rounded-[30px]
                border
                border-[#D4AF37]/20
              "
            />

            {/* IMAGE LABEL */}

            <div
              className="
                absolute
                bottom-7
                left-7
                right-7
                rounded-2xl
                border
                border-white/10
                bg-black/30
                px-5
                py-4
                backdrop-blur-xl
              "
            >

              <div className="flex items-center gap-3">

                <MapPin
                  size={18}
                  className="text-[#D4AF37]"
                />

                <div>

                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {locationName}
                  </p>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <div
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-[1500px]
            px-6
            md:px-8
            lg:px-10
          "
        >

          <div
            className="
              max-w-[850px]
              lg:max-w-[780px]
              xl:max-w-[850px]
            "
          >

            {/* ==================================================
    FULL LOCATION BREADCRUMB
    Example:
    Home → Locations → Gurgaon → Golf Course Road → Sector 56
================================================== */}

<div
  className="
    mb-4
    flex
    flex-wrap
    items-center
    gap-2
    text-[11px]
    font-medium
    uppercase
    tracking-[0.18em]
    text-white/55
    md:gap-3
    md:text-xs
  "
>
  {/* HOME */}

  <Link
    href="/"
    className="transition hover:text-[#D4AF37]"
  >
    Home
  </Link>

  <span>/</span>

  {/* LOCATIONS */}

  <Link
    href="/locations"
    className="transition hover:text-[#D4AF37]"
  >
    Locations
  </Link>

  {/* BUILD FULL PARENT → CHILD CHAIN */}

  {(() => {
    const hierarchy = [];

    const visited = new Set();

    let current = location;

    while (current) {
      const currentId =
        current?._id?.toString?.() ||
        current?.id?.toString?.() ||
        current?.slug ||
        current?.name;

      if (
        currentId &&
        visited.has(currentId)
      ) {
        break;
      }

      if (currentId) {
        visited.add(currentId);
      }

      hierarchy.unshift(current);

      current = current?.parent;
    }

    return hierarchy.map(
      (item, index) => {
        const itemName =
          item?.name || "Location";

        const isLast =
          index === hierarchy.length - 1;

        return (
          <div
            key={
              item?._id?.toString?.() ||
              item?.slug ||
              itemName
            }
            className="
              flex
              items-center
              gap-2
              md:gap-3
            "
          >
            <span>/</span>

            {isLast ? (
              <span className="text-[#D4AF37]">
                {itemName}
              </span>
            ) : (
              <Link
  href={`/locations/${buildPublicLocationSlug(item)}`}
  className="
    transition
    hover:text-[#D4AF37]
  "
>
  {itemName}
</Link>
            )}
          </div>
        );
      }
    );
  })()}
</div>

            {/* ==================================================
                PREMIUM BADGE
            ================================================== */}

            <div
              className="
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-[#D4AF37]/35
                bg-[#0B221B]/70
                px-4
                py-2
                shadow-[0_10px_40px_rgba(0,0,0,0.2)]
                backdrop-blur-xl
                md:px-5
              "
            >

              <Trophy
                size={17}
                className="text-[#D4AF37]"
              />

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#F3E5AB]
                  md:text-[12px]
                  md:tracking-[0.22em]
                "
              >
                Luxury Real Estate Destination
              </span>

            </div>

            {/* ==================================================
                MOBILE IMAGE
            ================================================== */}

            {heroImage && (
              <div
                className="
                  relative
                  mt-5
                  h-[190px]
                  w-full
                  overflow-hidden
                  rounded-[30px]
                  border
                  border-white/10
                  md:hidden
                "
              >

                <img
                  src={heroImage}
                  alt={`${locationName} real estate`}
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#061811]/80
                    via-transparent
                    to-black/10
                  "
                />

                <div
                  className="
                    absolute
                    bottom-5
                    left-5
                    right-5
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/10
                    bg-black/30
                    px-4
                    py-3
                    backdrop-blur-xl
                  "
                >

                  <MapPin
                    size={17}
                    className="text-[#D4AF37]"
                  />

                  <div>

                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]">
                      Prime Location
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-white">
                      {locationName}
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* ==================================================
                LOCATION ICON
            ================================================== */}

            <div className="mt-4 md:mt-5">

              <div
                className="
                  relative
                  flex
                  h-[72px]
                  w-[72px]
                  items-center
                  justify-center
                  rounded-[28px]
                  border
                  border-[#D4AF37]/30
                  bg-white/[0.96]
                  shadow-[0_25px_70px_rgba(0,0,0,0.4)]
                  md:h-[82px]
                  md:w-[82px]
                  md:rounded-[32px]
                "
              >

                <div
                  className="
                    absolute
                    inset-2
                    rounded-[23px]
                    border
                    border-[#0B221B]/10
                    md:inset-3
                    md:rounded-[25px]
                  "
                />

                <MapPin
                  size={43}
                  strokeWidth={1.5}
                  className="
                    relative
                    z-10
                    text-[#0B221B]
                    md:h-[36px]
                    md:w-[36px]
                  "
                />

              </div>

            </div>

            {/* ==================================================
                H1
            ================================================== */}

            <h1
              className="
                mt-4
                max-w-[850px]
                font-playfair
                text-[40px]
                font-semibold
                leading-[1.02]
                tracking-[-0.025em]
                text-white
                sm:text-[46px]
                md:mt-5
                md:text-[50px]
                lg:text-[56px]
                xl:text-[62px]
              "
            >
              Luxury Properties in{" "}
              <span className="text-white">
                {locationName}
              </span>
            </h1>

            {/* ==================================================
                GOLD LINE
            ================================================== */}

            <div
              className="
                mt-4
                flex
                items-center
                gap-3
                md:mt-4
              "
            >

              <div className="h-[2px] w-20 bg-[#D4AF37] md:w-28" />

              <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

            </div>

            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <p
              className="
                mt-4
                max-w-[650px]
                text-[16px]
                leading-8
                text-white/75
                md:mt-4
                md:text-[16px]
                md:leading-7
              "
            >
              Discover iconic luxury residences,
              premium developments, and
              high-potential investment
              opportunities in{" "}
              <span className="font-semibold text-[#F3D98A]">
                {locationName}
              </span>
              , curated by Property Bouquet.
            </p>

            {/* ==================================================
                STATS
            ================================================== */}

            <div
              className="
                mt-4
                grid
                grid-cols-2
                gap-3
                md:mt-5
                md:grid-cols-3
                md:gap-4
              "
            >

              {/* PROJECTS */}

              <div
                className="
                  rounded-[22px]
                  border
                  border-white/10
                  bg-white/[0.07]
                  px-4
                  py-3
                  backdrop-blur-xl
                  md:rounded-[26px]
                  md:p-5
                "
              >

                <p
                  className="
                    text-3xl
                    font-bold
                    text-[#D4AF37]
                    md:text-4xl
                  "
                >
                  {properties.length}+
                </p>

                <p
                  className="
                    mt-2
                    text-[10px]
                    uppercase
                    tracking-[0.15em]
                    text-white/60
                    md:text-xs
                  "
                >
                  Luxury Projects
                </p>

              </div>

              {/* LOCATION */}

              <div
                className="
                  rounded-[22px]
                  border
                  border-white/10
                  bg-white/[0.07]
                  px-4
                  py-3
                  backdrop-blur-xl
                  md:rounded-[26px]
                  md:p-5
                "
              >

                <p
                  className="
                    text-2xl
                    font-bold
                    text-[#D4AF37]
                    md:text-3xl
                  "
                >
                  Prime
                </p>

                <p
                  className="
                    mt-2
                    text-[10px]
                    uppercase
                    tracking-[0.15em]
                    text-white/60
                    md:text-xs
                  "
                >
                  Location
                </p>

              </div>

              {/* COLLECTION */}

              <div
                className="
                  col-span-2
                  rounded-[22px]
                  border
                  border-white/10
                  bg-white/[0.07]
                  px-4
                  py-4
                  backdrop-blur-xl
                  md:col-span-1
                  md:rounded-[26px]
                  md:p-5
                "
              >

                <p
                  className="
                    text-2xl
                    font-bold
                    text-[#D4AF37]
                    md:text-3xl
                  "
                >
                  Premium
                </p>

                <p
                  className="
                    mt-2
                    text-[10px]
                    uppercase
                    tracking-[0.15em]
                    text-white/60
                    md:text-xs
                  "
                >
                  Collection
                </p>

              </div>

            </div>

            {/* ==================================================
                CTA
            ================================================== */}

            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-4
                md:mt-5
                md:gap-4
              "
            >

              <a
                href="#projects"
                className="
                  inline-flex
                  h-[50px]
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-r
                  from-[#D4AF37]
                  to-[#B8862E]
                  px-7
                  text-[14px]
                  font-semibold
                  text-black
                  shadow-[0_12px_35px_rgba(212,175,55,0.2)]
                  transition-all
                  duration-300
                  hover:scale-[1.03]
                  md:h-[52px]
                  md:px-7
                  md:text-[15px]
                "
              >
                Explore Properties

                <ArrowRight
                  size={17}
                  className="ml-3"
                />

              </a>

              <Link
                href="/contact"
                className="
                  inline-flex
                  h-[50px]
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/20
                  bg-white/[0.07]
                  px-7
                  text-[14px]
                  font-semibold
                  text-white
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:border-[#D4AF37]
                  hover:text-[#D4AF37]
                  md:h-[52px]
                  md:px-7
                  md:text-[15px]
                "
              >
                Contact Advisor
              </Link>

            </div>

          </div>

        </div>

        {/* ====================================================
            BOTTOM FADE
        ==================================================== */}

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            z-[5]
            h-16
            bg-gradient-to-t
            from-[#f7f7f7]
            to-transparent
          "
        />

        {/* ====================================================
            SCROLL INDICATOR
        ==================================================== */}

        <div
          className="
            absolute
            bottom-4
            right-10
            z-20
            hidden
            flex-col
            items-center
            gap-3
            lg:flex
          "
        >

          <span
            className="
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-white/50
            "
          >
            Scroll
          </span>

          <div
            className="
              flex
              h-12
              w-7
              justify-center
              rounded-full
              border
              border-white/25
            "
          >

            <div
              className="
                mt-2
                h-2
                w-2
                animate-bounce
                rounded-full
                bg-[#D4AF37]
              "
            />

          </div>

        </div>

      </section>

      {/* ======================================================
          PROJECTS
      ====================================================== */}

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
                  properties={properties}
                  onFiltered={(data) => {
                    setFilteredProperties(data);
                    setVisibleCards(
                      CARDS_PER_PAGE
                    );
                  }}
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
                  baseUrl={`/locations/${slug}`}
                />

              </div>

            </div>

          </aside>

          {/* ==================================================
              RIGHT CONTENT
          ================================================== */}

          <div>

            {/* TOP BAR */}

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

                {/* MOBILE FILTER */}

                <button
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

                {/* COUNT */}

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
                  onChange={(e) =>
                    setSortBy(
                      e.target.value
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

            {currentProperties.length >
            0 ? (

              <div
                className="
                  grid
                  gap-8
                  md:grid-cols-2
                  xl:grid-cols-3
                "
              >

                {currentProperties.map(
                  (property) => {

                    const propertySlug =
                      property?.slug;

                    const propertyTitle =
                      property?.coreDetails
                        ?.title ||
                      "Luxury property";

                    return (
                      <Link
                        key={property._id}
                        href={
                          propertySlug
                            ? `/${propertySlug}`
                            : "#"
                        }
                        aria-label={`View ${propertyTitle}`}
                        className="
                          group
                          relative
                          block
                          overflow-hidden
                          rounded-[32px]
                          border
                          border-gray-100
                          bg-white
                          shadow-lg
                          transition-all
                          duration-500
                          hover:shadow-2xl
                        "
                      >

                        {/* IMAGE */}

                        <div
                          className="
                            relative
                            h-[320px]
                            overflow-hidden
                          "
                        >

                          <img
                            src={
                              property?.media
                                ?.heroImageUrl ||
                              "/placeholder.jpg"
                            }
                            alt={
                              propertyTitle
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                              transition
                              duration-700
                              group-hover:scale-110
                            "
                          />

                          <div
                            className="
                              absolute
                              inset-0
                              bg-gradient-to-t
                              from-black/90
                              via-black/10
                              to-transparent
                            "
                          />

                          {/* PRICE */}

                          <div
                            className="
                              absolute
                              right-5
                              top-5
                              rounded-full
                              bg-[#081c15]
                              px-5
                              py-2
                              text-sm
                              font-bold
                              text-white
                              shadow-2xl
                            "
                          >

                            {property?.coreDetails
                              ?.priceOnRequest ? (
                              "On Request"
                            ) : property?.coreDetails
                                ?.startingPrice ? (
                              <>
                                ₹
                                {formatPrice(
                                  property
                                    .coreDetails
                                    .startingPrice
                                )}
                              </>
                            ) : property
                                ?.unitConfigurations?.[0]
                                ?.price ? (
                              <>
                                ₹
                                {formatPrice(
                                  property
                                    .unitConfigurations[0]
                                    .price
                                )}
                              </>
                            ) : (
                              "Price Unavailable"
                            )}

                          </div>

                          {/* CONTENT */}

                          <div
                            className="
                              absolute
                              bottom-0
                              left-0
                              right-0
                              p-6
                              text-white
                            "
                          >

                            <h3
                              className="
                                text-2xl
                                font-black
                                leading-tight
                              "
                            >
                              {
                                property?.coreDetails
                                  ?.title
                              }
                            </h3>

                            <div
                              className="
                                mt-3
                                flex
                                items-center
                                gap-2
                                text-white/80
                              "
                            >

                              <MapPin size={16} />

                              <span
                                className="
                                  truncate
                                  text-sm
                                "
                              >
                                {property
                                  ?.locationData
                                  ?.locationName ||
                                  property
                                    ?.locationData
                                    ?.customLocation ||
                                  locationName ||
                                  "Prime Location"}
                              </span>

                            </div>

                          </div>

                        </div>

                        {/* BOTTOM */}

                        <div className="p-6">

                          <div
                            className="
                              mb-5
                              flex
                              items-center
                              justify-between
                              text-sm
                              text-black/60
                            "
                          >

                            <span>
                              {property
                                ?.unitConfigurations?.[0]
                                ?.bedrooms
                                ? `${property.unitConfigurations[0].bedrooms} Beds`
                                : "Luxury"}
                            </span>

                            <span>
                              {property
                                ?.unitConfigurations?.[0]
                                ?.bathrooms
                                ? `${property.unitConfigurations[0].bathrooms} Baths`
                                : "Residence"}
                            </span>

                            <span>
                              {property
                                ?.unitConfigurations?.[0]
                                ?.area
                                ? `${property.unitConfigurations[0].area} Sq.Ft.`
                                : "Premium"}
                            </span>

                          </div>

                          <div
                            className="
                              flex
                              h-14
                              w-full
                              items-center
                              justify-center
                              gap-3
                              rounded-2xl
                              bg-[#081c15]
                              font-bold
                              text-white
                              transition-all
                              duration-300
                              hover:bg-[#1b4332]
                            "
                          >

                            Explore Property

                            <ArrowRight
                              size={18}
                              className="
                                transition
                                group-hover:translate-x-1
                              "
                            />

                          </div>

                        </div>

                      </Link>
                    );
                  }
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

            <div
              className="
                mt-12
                flex
                justify-center
              "
            >

              {visibleCards <
                filteredProperties.length && (

                <button
                  onClick={() =>
                    setVisibleCards(
                      (prev) =>
                        prev +
                        CARDS_PER_PAGE
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

              )}

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          ABOUT LOCATION
      ====================================================== */}

      {locationDescription && (
        <section
          className="
            relative
            overflow-hidden
            bg-white
            py-20
            md:py-24
          "
        >

          <div
            className="
              absolute
              right-0
              top-0
              h-[450px]
              w-[450px]
              rounded-full
              bg-[#D4AF37]/8
              blur-[120px]
            "
          />

          <div
            className="
              relative
              z-10
              mx-auto
              max-w-[1450px]
              px-6
            "
          >

            <div
              className="
                grid
                items-start
                gap-12
                lg:grid-cols-[1.4fr_420px]
                lg:gap-16
              "
            >

              {/* LEFT */}

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
                    tracking-[0.28em]
                    text-[#D4AF37]
                    md:text-[11px]
                  "
                >
                  About The Location
                </span>

                <h2
                  className="
                    mt-7
                    font-playfair
                    text-4xl
                    leading-tight
                    text-[#0B221B]
                    md:text-5xl
                  "
                >
                  Luxury Real Estate in{" "}
                  {locationName}
                </h2>

                <div className="mt-6 h-[2px] w-28 bg-[#D4AF37]" />

                <div
                  className="
                    mt-9
                    text-[16px]
                    leading-[2]
                    text-[#4d4d4d]
                    md:mt-10
                    md:text-[17px]
                    md:leading-[2.05]
                  "
                >

                  <p className="whitespace-pre-line">
                    {locationDescription}
                  </p>

                </div>

              </div>

              {/* RIGHT */}

              <div>

                <div
                  className="
                    rounded-[32px]
                    border
                    border-[#eadfcb]
                    bg-white
                    p-7
                    shadow-[0_20px_70px_rgba(0,0,0,0.06)]
                    md:p-8
                    lg:sticky
                    lg:top-28
                  "
                >

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-[#0B221B]
                        text-[#D4AF37]
                      "
                    >
                      <MapPin size={24} />
                    </div>

                    <div>

                      <p
                        className="
                          text-[10px]
                          uppercase
                          tracking-[0.25em]
                          text-[#B58B2D]
                        "
                      >
                        Location Highlights
                      </p>

                      <h3
                        className="
                          mt-1
                          text-xl
                          font-semibold
                          text-[#0B221B]
                          md:text-2xl
                        "
                      >
                        Why Invest in{" "}
                        {locationName}
                      </h3>

                    </div>

                  </div>

                  <div className="mt-8 space-y-5">

                    {[
                      "Prime Residential Location",
                      "Premium Real Estate Developments",
                      "Strong Connectivity",
                      "High Investment Potential",
                      "Established Social Infrastructure",
                      "Growing Real Estate Demand",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-4"
                      >

                        <div
                          className="
                            mt-1
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#D4AF37]/15
                          "
                        >

                          <BadgeCheck
                            size={16}
                            className="text-[#B58B2D]"
                          />

                        </div>

                        <p
                          className="
                            text-[15px]
                            leading-7
                            text-[#555]
                          "
                        >
                          {item}
                        </p>

                      </div>
                    ))}

                  </div>

                  <div
                    className="
                      mt-10
                      rounded-2xl
                      bg-gradient-to-r
                      from-[#0B221B]
                      to-[#123126]
                      p-6
                    "
                  >

                    <p
                      className="
                        text-[10px]
                        uppercase
                        tracking-[0.2em]
                        text-[#D4AF37]
                      "
                    >
                      Portfolio
                    </p>

                    <h4
                      className="
                        mt-2
                        text-4xl
                        font-bold
                        text-white
                      "
                    >
                      {properties.length}+
                    </h4>

                    <p
                      className="
                        mt-2
                        text-sm
                        leading-6
                        text-white/70
                      "
                    >
                      Signature luxury developments
                      available in {locationName} through
                      Property Bouquet.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>
      )}


      {/* ======================================================
          MOBILE FILTER DRAWER
      ====================================================== */}

      {showFilters && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            xl:hidden
          "
        >

          {/* OVERLAY */}

          <div
            className="
              absolute
              inset-0
              bg-black/60
            "
            onClick={() =>
              setShowFilters(false)
            }
          />

          {/* DRAWER */}

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
                onClick={() =>
                  setShowFilters(false)
                }
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

            {/* FILTERS */}

            <div className="p-5">

              <PropertyFilters
                properties={properties}
                onFiltered={(data) => {
                  setFilteredProperties(
                    data
                  );

                  setVisibleCards(
                    CARDS_PER_PAGE
                  );

                  setShowFilters(false);
                }}
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
                baseUrl={`/locations/${slug}`}
              />

            </div>

          </div>

        </div>

      )}

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <Footer />

    </div>
  );
}