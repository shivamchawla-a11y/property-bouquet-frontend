"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { formatPrice } from "@/utils/formatPrice";

import {
  MapPin,
  ArrowRight,
  Home,
  Heart,
} from "lucide-react";

// Load the filters only when needed. On mobile the filter module is
// downloaded only after the visitor opens the filter drawer.
const PropertyFilters = dynamic(
  () => import("@/utils/PropertyFilters"),
  {
    loading: () => (
      <div
        className="min-h-[260px] rounded-2xl bg-white/70 animate-pulse"
        aria-hidden="true"
      />
    ),
  }
);

// Keep Next Image limited to hosts already allowed in next.config.js.
// Unknown image hosts fall back to a native lazy-loaded image so existing
// property records do not break if they use another image provider.
const OPTIMIZED_IMAGE_HOSTS = new Set([
  "res.cloudinary.com",
  "images.unsplash.com",
  "d2dy9w7mmecm6m.cloudfront.net",
  "managemylawsuits.com",
]);

function canUseNextImage(source) {
  if (typeof source !== "string" || !source.trim()) {
    return false;
  }

  const value = source.trim();

  if (value.startsWith("/") && !value.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      OPTIMIZED_IMAGE_HOSTS.has(url.hostname)
    );
  } catch {
    return false;
  }
}

function PropertyCardImage({ src, alt, priority = false }) {
  const imageSource =
    typeof src === "string" ? src.trim() : "";

  if (!imageSource) {
    return (
      <div
        className="absolute inset-0 bg-[#ece8df]"
        aria-hidden="true"
      />
    );
  }

  const imageClassName = `
    absolute
    inset-0
    w-full
    h-full
    object-cover
    transition-transform
    duration-700
    group-hover:scale-105
  `;

  const imageSizes = `
    (max-width: 639px) calc(100vw - 2rem),
    (max-width: 1023px) calc((100vw - 3.25rem) / 2),
    (max-width: 1279px) calc((100vw - 23.5rem) / 2),
    (max-width: 1535px) calc((100vw - 25rem) / 3),
    360px
  `;

  if (canUseNextImage(imageSource)) {
    return (
      <Image
        src={imageSource}
        alt={alt}
        fill
        sizes={imageSizes}
        quality={75}
        preload={priority}
        loading={priority ? undefined : "lazy"}
        className={imageClassName}
      />
    );
  }

  // Safe fallback for image hosts that are not configured in next.config.js.
  return (
    <img
      src={imageSource}
      alt={alt}
      width="1200"
      height="800"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={imageClassName}
    />
  );
}

export default function PropertiesClient({
  landingPage = null,
  initialProperties = null,
}) {
  const API = "/api";
  const hasInitialProperties = Array.isArray(initialProperties);

  const publishedInitialProperties = hasInitialProperties
    ? initialProperties.filter(
        (property) =>
          property?.status === "published" &&
          property?.isDeleted !== true &&
          property?.deletedFromStatus !== "trash"
      )
    : [];

  const initialSortedProperties = [...publishedInitialProperties].sort(
    (a, b) =>
      new Date(b?.createdAt || 0) -
      new Date(a?.createdAt || 0)
  );

  const [properties, setProperties] = useState(
    () => publishedInitialProperties
  );
  const [filteredProperties, setFilteredProperties] = useState(
    () => initialSortedProperties
  );
  const [loading, setLoading] = useState(
    () => !hasInitialProperties
  );

  const [sortBy, setSortBy] = useState("newest");
  const [visibleCards, setVisibleCards] = useState(9);
  const [showFilters, setShowFilters] = useState(false);
  const [shouldLoadFilters, setShouldLoadFilters] = useState(false);

  const CARDS_PER_PAGE = 9;

  const searchParams = useSearchParams();

  // ============================================================
  // SELECTED FILTER VALUES
  // ============================================================

  const selectedLocation =
    landingPage?.values?.location?.name ||
    searchParams.get("location");

  const selectedDeveloper =
    landingPage?.values?.developer?.name ||
    searchParams.get("developer");

  const selectedBudget =
    searchParams.get("budget");

  const selectedAmenity =
    searchParams.get("amenity");

  const selectedBhk =
    landingPage?.values?.bhk ||
    searchParams.get("bhk");

  const selectedPropertyType =
    landingPage?.values?.category?.name ||
    searchParams.get("propertyType");

  // ============================================================
  // FETCH PROPERTIES
  // ============================================================

  useEffect(() => {
    // The server page already fetched the published property records.
    // Reuse them instead of making a second browser request.
    if (Array.isArray(initialProperties)) {
      return;
    }

    const controller = new AbortController();

    const fetchProperties = async () => {
      try {
        const res = await fetch(`${API}/properties`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(
            `Properties request failed: ${res.status}`
          );
        }

        const data = await res.json();

        const activeProperties = Array.isArray(data?.data)
          ? data.data.filter(
              (property) =>
                property?.status === "published" &&
                property?.isDeleted !== true &&
                property?.deletedFromStatus !== "trash"
            )
          : [];

        if (!controller.signal.aborted) {
          setProperties(activeProperties);
        }
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error(
            "Failed to fetch properties:",
            error
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProperties();

    return () => controller.abort();
  }, [initialProperties]);

  // ============================================================
  // FILTER + SORT
  // ============================================================

  useEffect(() => {
    if (!properties.length) {
      setFilteredProperties([]);
      setVisibleCards(CARDS_PER_PAGE);
      return;
    }

    let result = [...properties];

    // ==========================================================
    // SEARCH
    // ==========================================================

    const search =
      landingPage?.filters?.search ||
      searchParams.get("search");

    // ==========================================================
    // CATEGORY
    // ==========================================================

    const type =
      landingPage?.values?.category?.name ||
      searchParams.get("propertyType");

    // ==========================================================
    // LOCATION
    // ==========================================================

    const location =
      landingPage?.values?.location?.name ||
      searchParams.get("location");

    // ==========================================================
    // DEVELOPER
    // ==========================================================

    const developer =
      landingPage?.values?.developer?.name ||
      searchParams.get("developer");

    // ==========================================================
    // BUDGET
    // ==========================================================

    const budget =
      landingPage?.filters?.budget?.min != null &&
      landingPage?.filters?.budget?.max != null
        ? `${landingPage.filters.budget.min}-${landingPage.filters.budget.max}`
        : searchParams.get("budget");

    // ==========================================================
    // AMENITIES
    // ==========================================================

    const amenitiesParam =
      landingPage?.filters?.amenities?.join(",") ||
      searchParams.get("amenity");

    // ==========================================================
    // BHK
    // ==========================================================

    const bhk =
      landingPage?.values?.bhk ||
      searchParams.get("bhk");

    const selectedAmenities =
      amenitiesParam
        ? amenitiesParam
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

    // ==========================================================
    // SEARCH FILTER
    // ==========================================================

    if (search) {
      const normalizedSearch =
        search.toLowerCase().trim();

      result = result.filter(
        (property) =>
          property?.coreDetails?.title
            ?.toLowerCase()
            .includes(normalizedSearch)
      );
    }

    // ==========================================================
    // CATEGORY FILTER
    // ==========================================================

    if (type) {
      const searchCategory =
        type.toLowerCase().trim();

      result = result.filter((property) => {
        const categoryName =
          property?.categoryData?.categoryName
            ?.toLowerCase()
            .trim();

        if (!categoryName) {
          return false;
        }

        return (
          categoryName.includes(searchCategory) ||
          searchCategory.includes(categoryName)
        );
      });
    }

    // ==========================================================
    // LOCATION FILTER
    // ==========================================================

    if (location) {
      const searchLocation =
        location.toLowerCase().trim();

      result = result.filter((property) => {
        const locationNames = [];

        // ------------------------------------------------------
        // Location hierarchy
        // ------------------------------------------------------

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

        // ------------------------------------------------------
        // Main location
        // ------------------------------------------------------

        if (
          property?.locationData?.locationName
        ) {
          locationNames.push(
            property.locationData.locationName
              .toLowerCase()
              .trim()
          );
        }

        // ------------------------------------------------------
        // Custom location
        // ------------------------------------------------------

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
            name.includes(searchLocation) ||
            searchLocation.includes(name)
        );
      });
    }

    // ==========================================================
    // DEVELOPER FILTER
    // ==========================================================

    if (developer) {
      const searchDeveloper =
        developer.toLowerCase().trim();

      result = result.filter((property) => {
        const developerNames = [
          property?.developerName,
          property?.coreDetails?.developerName,
          property?.developer?.name,
          property?.developerData?.name,
          property?.developerRef?.name,
        ]
          .filter(Boolean)
          .map((item) =>
            String(item)
              .toLowerCase()
              .trim()
          );

        return developerNames.some(
          (name) =>
            name.includes(searchDeveloper) ||
            searchDeveloper.includes(name)
        );
      });
    }

    // ==========================================================
    // BUDGET FILTER
    // ==========================================================

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
        result = result.filter((property) => {
          if (
            property?.coreDetails
              ?.priceOnRequest
          ) {
            return true;
          }

          const startPrice =
            Number(
              property?.coreDetails
                ?.startingPrice
            ) || 0;

          const maxPrice =
            Number(
              property?.coreDetails?.maxPrice
            ) || startPrice;

          return (
            maxPrice >= minBudget &&
            startPrice <= maxBudget
          );
        });
      }
    }

    // ==========================================================
    // AMENITIES FILTER
    // ==========================================================

    if (selectedAmenities.length) {
      result = result.filter((property) => {
        const propertyAmenities =
          property?.overview?.amenities
            ?.map((item) =>
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
      });
    }

    // ==========================================================
    // BHK FILTER
    // ==========================================================

    if (bhk) {
      const normalizedBhk =
        bhk.toLowerCase().trim();

      result = result.filter(
        (property) =>
          property?.gatedContent?.floorPlans?.some(
            (plan) =>
              plan?.unitType
                ?.toLowerCase()
                .trim() === normalizedBhk
          )
      );
    }

    // ==========================================================
    // SORTING
    // ==========================================================

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b?.createdAt || 0) -
          new Date(a?.createdAt || 0)
      );
    }

    if (sortBy === "price-low-high") {
      result.sort(
        (a, b) =>
          (Number(
            a?.coreDetails?.startingPrice
          ) || 0) -
          (Number(
            b?.coreDetails?.startingPrice
          ) || 0)
      );
    }

    if (sortBy === "price-high-low") {
      result.sort(
        (a, b) =>
          (Number(
            b?.coreDetails?.startingPrice
          ) || 0) -
          (Number(
            a?.coreDetails?.startingPrice
          ) || 0)
      );
    }

    setVisibleCards(CARDS_PER_PAGE);
    setFilteredProperties(result);
  }, [
    properties,
    searchParams,
    landingPage,
    sortBy,
  ]);

  // ============================================================
  // LOAD FILTERS ONLY WHEN NEEDED
  // Desktop loads them after the initial page render.
  // Mobile loads them only when the filter drawer is opened.
  // ============================================================

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const loadDesktopFilters = (event) => {
      if (event.matches) {
        setShouldLoadFilters(true);
      }
    };

    loadDesktopFilters(mediaQuery);

    mediaQuery.addEventListener?.("change", loadDesktopFilters);

    return () => {
      mediaQuery.removeEventListener?.("change", loadDesktopFilters);
    };
  }, []);

  const openMobileFilters = () => {
    setShouldLoadFilters(true);
    setShowFilters(true);
  };

  // ============================================================
  // LOCK BODY WHEN MOBILE FILTER DRAWER IS OPEN
  // ============================================================

  useEffect(() => {
    if (!showFilters) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showFilters]);

  // ============================================================
  // CURRENT VISIBLE PROPERTIES
  // ============================================================

  const currentProperties =
    filteredProperties.slice(
      0,
      visibleCards
    );

  const firstImageIndex = currentProperties.findIndex(
    (property) =>
      typeof property?.media?.heroImageUrl === "string" &&
      property.media.heroImageUrl.trim()
  );

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfaf7] px-6 flex items-center justify-center">
        <div className="flex w-full max-w-[420px] flex-col items-center text-center">

          {/* LOGO */}
          <div className="relative flex items-center justify-center">
            <div className="absolute h-28 w-28 rounded-full bg-[#D4AF37]/10 blur-2xl animate-pulse" />

            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#D4AF37]/25 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.08)]">
              <Image
                src="/logo.webp"
                alt="Property Bouquet"
                width={56}
                height={56}
                priority
                className="h-14 w-14 object-contain"
              />
            </div>
          </div>

          {/* BRAND */}
          <h2 className="mt-7 font-serif text-[25px] font-medium tracking-[0.5px] text-[#10251f]">
            Property Bouquet
          </h2>

          {/* LOADING TEXT */}
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[2.5px] text-[#b58b45]">
            Discovering Properties
          </p>

          {/* LOADING BAR */}
          <div className="mt-7 h-[2px] w-[180px] overflow-hidden rounded-full bg-[#e9e2d5]">
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-[loading_1.5s_ease-in-out_infinite]" />
          </div>

          {/* SUBTEXT */}
          <p className="mt-4 text-[11px] leading-5 text-[#999]">
            Curating the finest properties for you...
          </p>
        </div>

        <style jsx>{`
          @keyframes loading {
            0% {
              transform: translateX(-100%);
            }

            100% {
              transform: translateX(200%);
            }
          }
        `}</style>
      </div>
    );
  }

  // ============================================================
  // MAIN
  // ============================================================

  return (
    <div className="min-h-screen bg-[#f7f7f7]">

      <Navbar forceSolid/>

      {/* ======================================================
          VISIBLE BREADCRUMB
      ====================================================== */}

      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          pt-24
          sm:pt-28
          lg:pt-32
        "
      >
        <nav
          aria-label="Breadcrumb"
          className="
            flex
            items-center
            gap-2
            text-sm
            font-medium
          "
        >
          {/* HOME */}
          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-1.5
              text-[#6f6f6f]
              transition-colors
              duration-200
              hover:text-[#D4AF37]
            "
          >
            <Home
              size={15}
              strokeWidth={1.8}
            />

            <span>
              Home
            </span>
          </Link>

          {/* CHEVRON */}
          <span
            aria-hidden="true"
            className="
              text-[#b8b8b8]
              text-lg
              leading-none
            "
          >
            ›
          </span>

          {/* PROPERTIES */}
          <span
            aria-current="page"
            className="
              text-[#081c15]
              font-semibold
            "
          >
            Properties
          </span>
        </nav>
      </div>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <section
        className="
          max-w-[1500px]
          mx-auto
          px-4
          mt-6
          pt-6
          pb-44
          md:pb-20
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[300px_1fr]
            gap-6
            lg:gap-8
            items-start
          "
        >

          {/* ==================================================
              DESKTOP FILTERS
          ================================================== */}

          <aside className="hidden lg:block sticky top-28 self-start">
            {shouldLoadFilters ? (
              <PropertyFilters
                properties={properties}
                onFiltered={(data) => {
                  setFilteredProperties(data);
                  setVisibleCards(CARDS_PER_PAGE);
                }}
                selectedLocation={selectedLocation}
                selectedDeveloper={selectedDeveloper}
                selectedBudget={selectedBudget}
                selectedAmenity={selectedAmenity}
                selectedBhk={selectedBhk}
                selectedPropertyType={selectedPropertyType}
                baseUrl={
                  landingPage
                    ? `/${landingPage.slug}`
                    : "/properties"
                }
              />
            ) : (
              <div
                className="min-h-[360px] rounded-[28px] bg-white/70 animate-pulse"
                aria-hidden="true"
              />
            )}
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
                  {landingPage?.title ||
                    "Available Properties"}
                </h2>

                <p className="text-gray-500 mt-2">
                  Showing{" "}
                  {filteredProperties.length}{" "}
                  properties
                </p>
              </div>

              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  gap-3
                  w-full
                  sm:w-auto
                "
              >
                {/* MOBILE FILTER BUTTON */}

                <button
                  type="button"
                  onClick={openMobileFilters}
                  className="
                    lg:hidden
                    h-14
                    px-6
                    rounded-2xl
                    bg-[#081c15]
                    text-white
                    font-semibold
                    transition-all
                    hover:bg-[#0f2d22]
                  "
                >
                  Filters
                </button>

                {/* SORT LABEL */}

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

                {/* SORT SELECT */}

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value
                      )
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

            {/* ==================================================
                PROPERTY GRID
            ================================================== */}

            {filteredProperties.length > 0 ? (
              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  xl:grid-cols-3
                  gap-5
                  lg:gap-8
                "
              >
                {currentProperties.map(
                  (property, index) => (
                    <Link
                      key={property._id}
                      href={`/${property.slug}`}
                      className="
                        group
                        relative
                        block
                        h-[370px]
                        sm:h-[390px]
                        lg:h-[420px]
                        overflow-hidden
                        rounded-[22px]
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

                      <PropertyCardImage
                        src={property?.media?.heroImageUrl}
                        alt={
                          property?.coreDetails?.title ||
                          "Luxury Property"
                        }
                        priority={index === firstImageIndex}
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

                      {/* ==================================================
                          TOP BADGES
                      ================================================== */}

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

                        {/* BADGES */}

                        <div className="flex items-center gap-2 flex-wrap">

                          <span
                            className="
                              px-3
                              py-1.5
                              rounded-full
                              bg-black/60
                              text-white
                              text-[10px]
                              font-semibold
                            "
                          >
                            LUXURY
                          </span>

                          {Array.isArray(
                            property?.propertyTag
                          ) &&
                            property.propertyTag.map(
                              (tag) => {
                                const colors = {
                                  Featured:
                                    "bg-yellow-400 text-black",
                                  Trending:
                                    "bg-red-500 text-white",
                                  Recommended:
                                    "bg-emerald-500 text-white",
                                  New:
                                    "bg-sky-500 text-white",
                                };

                                return (
                                  <span
                                    key={tag}
                                    className={`
                                      px-3
                                      py-1.5
                                      rounded-full
                                      text-[10px]
                                      font-semibold
                                      ${
                                        colors[tag] ||
                                        "bg-[#D4AF37] text-black"
                                      }
                                    `}
                                  >
                                    {tag}
                                  </span>
                                );
                              }
                            )}
                        </div>

                        {/* HEART */}

                        <button
                          type="button"
                          aria-label="Add property to favorites"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
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
                          <Heart
                            size={18}
                            strokeWidth={2}
                          />
                        </button>
                      </div>

                      {/* ==================================================
                          CONTENT
                      ================================================== */}

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
                            text-[23px]
                            font-black
                            leading-[1.05]
                            mb-2
                          "
                        >
                          {
                            property?.coreDetails
                              ?.title
                          }
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
                            {property
                              ?.locationData
                              ?.locationName
                              ?.split(">")
                              ?.map(
                                (item) =>
                                  item.trim()
                              )
                              ?.reverse()
                              ?.join(" • ") ||
                              property
                                ?.locationData
                                ?.customLocation ||
                              "Location unavailable"}
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
                            {property
                              ?.coreDetails
                              ?.priceOnRequest
                              ? "Price"
                              : "Starting From"}
                          </span>

                          <span
                            className="
                              text-[#F5D77D]
                              text-[22px]
                              font-bold
                            "
                          >
                            {property
                              ?.coreDetails
                              ?.priceOnRequest ? (
                              "On Request"
                            ) : property
                                ?.coreDetails
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
                          </span>
                        </div>

                        {/* ==================================================
                            BOTTOM ROW
                        ================================================== */}

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

                            {/* CONFIG */}

                            <div>
                              <p className="text-[10px] text-white/50">
                                CONFIG
                              </p>

                              <p className="text-xs text-white">
                                {property
                                  ?.configurationSummary ||
                                  property
                                    ?.categoryData
                                    ?.categoryName ||
                                  "—"}
                              </p>
                            </div>

                            {/* BUILDER */}

                            <div>
                              <p className="text-[10px] text-white/50">
                                BUILDER
                              </p>

                              <p className="text-xs text-white">
                                {property
                                  ?.coreDetails
                                  ?.developerName ||
                                  property
                                    ?.developerName ||
                                  "—"}
                              </p>
                            </div>

                            {/* AMENITIES */}

                            <div>
                              <p className="text-[10px] text-white/50">
                                AMENITIES
                              </p>

                              <p className="text-xs text-white">
                                {Array.isArray(
                                  property
                                    ?.overview
                                    ?.amenities
                                )
                                  ? `${property.overview.amenities.length}+`
                                  : "25+"}
                              </p>
                            </div>

                          </div>

                          {/* ARROW */}

                          <div
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
                              shrink-0
                            "
                          >
                            <ArrowRight
                              size={16}
                              className="text-black"
                            />
                          </div>
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
                    </Link>
                  )
                )}
              </div>
            ) : (
              /* ==================================================
                 NO PROPERTIES
              ================================================== */

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
                  Try adjusting your filters.
                </p>
              </div>
            )}

            {/* ==================================================
                LOAD MORE
            ================================================== */}

            <div className="flex justify-center mt-12">
              {visibleCards <
                filteredProperties.length && (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCards(
                      (prev) =>
                        prev + CARDS_PER_PAGE
                    )
                  }
                  className="
                    px-10
                    h-14
                    rounded-2xl
                    bg-[#D4AF37]
                    text-black
                    font-bold
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

        {/* ======================================================
            MOBILE FILTER DRAWER
        ====================================================== */}

        {showFilters && (
          <div className="fixed inset-0 z-[9999] lg:hidden">

            {/* OVERLAY */}

            <button
              type="button"
              aria-label="Close filters"
              className="
                absolute
                inset-0
                bg-black/60
                cursor-default
              "
              onClick={() => setShowFilters(false)}
            />

            {/* DRAWER */}

            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-filters-heading"
              className="
                absolute
                left-0
                top-0
                h-full
                w-[88%]
                max-w-[360px]
                bg-white
                overflow-y-auto
                shadow-2xl
              "
            >

              {/* DRAWER HEADER */}

              <div
                className="
                  sticky
                  top-0
                  bg-white
                  z-20
                  border-b
                  p-5
                  flex
                  items-center
                  justify-between
                "
              >
                <h2
                  id="mobile-filters-heading"
                  className="text-xl font-bold"
                >
                  Filters
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setShowFilters(false)
                  }
                  aria-label="Close filters"
                  className="
                    text-3xl
                    leading-none
                    text-gray-700
                  "
                >
                  ×
                </button>
              </div>

              {/* FILTER CONTENT */}

              <div className="p-5">
                {shouldLoadFilters && (
                  <PropertyFilters
                    properties={properties}
                    onFiltered={(data) => {
                      setFilteredProperties(data);
                      setVisibleCards(CARDS_PER_PAGE);
                      setShowFilters(false);
                    }}
                    selectedLocation={selectedLocation}
                    selectedDeveloper={selectedDeveloper}
                    selectedBudget={selectedBudget}
                    selectedAmenity={selectedAmenity}
                    selectedBhk={selectedBhk}
                    selectedPropertyType={selectedPropertyType}
                    baseUrl={
                      landingPage
                        ? `/${landingPage.slug}`
                        : "/properties"
                    }
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}