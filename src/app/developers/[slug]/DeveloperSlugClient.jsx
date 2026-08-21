"use client";

import { formatPrice } from "@/utils/formatPrice";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Link from "next/link";

import Navbar from "@/components/home/Navbar";
import PropertyFilters from "@/utils/PropertyFilters";

import {
  MapPin,
  Building2,
  ArrowRight,
  SlidersHorizontal,
  Trophy,
  BadgeCheck,
  X,
} from "lucide-react";

import Footer from "@/components/home/Footer";

export default function DeveloperSlugClient({
  developer,
  properties = [],
  slug,
}) {
  const searchParams = useSearchParams();

  const [filteredProperties, setFilteredProperties] =
    useState(properties);

  const [sortBy, setSortBy] =
    useState("newest");

  const [visibleCards, setVisibleCards] =
    useState(9);

  const [showFilters, setShowFilters] =
    useState(false);

  const CARDS_PER_PAGE = 9;

  // ============================================================
  // URL FILTERS
  // ============================================================

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

  // ============================================================
  // FILTERING
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
      searchParams.get("search");

    if (search) {
      const searchValue =
        search.toLowerCase().trim();

      result = result.filter(
        (property) =>
          property?.coreDetails?.title
            ?.toLowerCase()
            .includes(searchValue)
      );
    }

    // ==========================================================
    // CATEGORY / PROPERTY TYPE
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

    const location =
      searchParams.get("location");

    if (location) {
      const searchLocation =
        location.toLowerCase().trim();

      result = result.filter(
        (property) => {
          const locationNames = [];

          // ----------------------------------------------------
          // LOCATION HIERARCHY
          // ----------------------------------------------------

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

          // ----------------------------------------------------
          // FALLBACK LOCATION
          // ----------------------------------------------------

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

          // ----------------------------------------------------
          // CUSTOM LOCATION
          // ----------------------------------------------------

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
            property?.coreDetails?.developerName,
            property?.developer?.name,
            property?.developerData?.name,
            property?.developerRef?.name,
          ]
            .filter(Boolean)
            .map((item) =>
              item.toLowerCase().trim()
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
            // Price on request always remains
            // visible during budget searches.

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
                property?.coreDetails
                  ?.maxPrice
              ) || startPrice;

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

    // ==========================================================
    // BHK
    // ==========================================================

    const bhk =
      searchParams.get("bhk");

    if (bhk) {
      const selectedBhkValue =
        bhk.toLowerCase().trim();

      result = result.filter(
        (property) =>
          property?.gatedContent
            ?.floorPlans
            ?.some(
              (plan) =>
                plan?.unitType
                  ?.toLowerCase()
                  .trim() ===
                selectedBhkValue
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
            Number(
              a?.coreDetails
                ?.startingPrice
            ) || 0
          ) -
          (
            Number(
              b?.coreDetails
                ?.startingPrice
            ) || 0
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
            Number(
              b?.coreDetails
                ?.startingPrice
            ) || 0
          ) -
          (
            Number(
              a?.coreDetails
                ?.startingPrice
            ) || 0
          )
      );
    }

    // ==========================================================
    // FINAL RESULT
    // ==========================================================

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
  // BODY LOCK FOR MOBILE FILTER DRAWER
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
    <div className="bg-[#f7f7f7] min-h-screen">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <Navbar />

      {/* ======================================================
          HERO
      ====================================================== */}

      <section
        className="
          relative
          min-h-[850px]
          flex
          items-center
          overflow-hidden
          bg-[#081c15]
          pt-32
          pb-20
        "
      >

        {/* BACKGROUND */}

        {developer?.image && (
          <img
            src={developer.image}
            alt=""
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              opacity-30
            "
          />
        )}

        {/* OVERLAYS */}

        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#081c15] via-[#081c15]/85 to-transparent" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.18),_transparent_35%)]" />

        {/* CONTENT */}

        <div className="relative z-10 max-w-[1500px] mx-auto w-full px-6">

          <div className="max-w-[760px]">

            {/* BREADCRUMB */}

            <div className="mb-8 flex items-center gap-3 text-sm tracking-[0.18em] uppercase text-white/60">

              <Link
                href="/"
                className="hover:text-[#D4AF37] transition"
              >
                Home
              </Link>

              <span>/</span>

              <Link
                href="/developers"
                className="hover:text-[#D4AF37] transition"
              >
                Developers
              </Link>

              <span>/</span>

              <span className="text-[#D4AF37]">
                {developer.name}
              </span>

            </div>

            {/* BADGE */}

            <div className="inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/30 bg-white/10 px-6 py-3 backdrop-blur-xl">

              <Trophy
                size={18}
                className="text-[#D4AF37]"
              />

              <span className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[#F3E5AB]">
                Luxury Developer Collection
              </span>

            </div>

            {/* LOGO */}

            <div className="mt-10">

              <div
                className="
                  relative
                  flex
                  h-[150px]
                  w-[150px]
                  items-center
                  justify-center
                  rounded-[36px]
                  border
                  border-white/15
                  bg-white/95
                  backdrop-blur-2xl
                  shadow-[0_35px_80px_rgba(0,0,0,0.45)]
                "
              >

                <div className="absolute inset-0 rounded-[36px] border border-[#D4AF37]/25" />

                {developer?.logo && (
                  <img
                    src={developer.logo}
                    alt={developer.name}
                    className="
                      relative
                      z-10
                      max-h-[95px]
                      max-w-[95px]
                      object-contain
                    "
                  />
                )}

              </div>

            </div>

            {/* TITLE */}

            <h1
              className="
                mt-10
                max-w-[900px]
                font-playfair
                text-5xl
                font-semibold
                leading-[1.05]
                text-white
                md:text-7xl
              "
            >
              {developer.name}
            </h1>

            <div className="mt-8 h-[2px] w-32 rounded-full bg-gradient-to-r from-[#D4AF37] to-transparent" />

            {/* DESCRIPTION */}

            <p
              className="
                mt-8
                max-w-[700px]
                text-[18px]
                leading-9
                text-white/75
              "
            >
              Explore iconic luxury residences,
              landmark developments, and
              investment opportunities by{" "}
              <span className="font-semibold text-[#F3D98A]">
                {developer.name}
              </span>
              , one of India's trusted names
              in premium real estate.
            </p>

            {/* STATS */}

            <div className="mt-12 grid gap-5 md:grid-cols-3">

              <div className="rounded-[26px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">

                <p className="text-4xl font-bold text-[#D4AF37]">
                  {properties.length}+
                </p>

                <p className="mt-2 text-sm uppercase tracking-[0.15em] text-white/65">
                  Luxury Projects
                </p>

              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">

                <p className="text-4xl font-bold text-[#D4AF37]">
                  Verified
                </p>

                <p className="mt-2 text-sm uppercase tracking-[0.15em] text-white/65">
                  Developer
                </p>

              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">

                <p className="text-4xl font-bold text-[#D4AF37]">
                  Premium
                </p>

                <p className="mt-2 text-sm uppercase tracking-[0.15em] text-white/65">
                  Collection
                </p>

              </div>

            </div>

            {/* CTA */}

            <div className="mt-12 flex flex-wrap gap-5">

              <a
                href="#projects"
                className="
                  inline-flex
                  h-[58px]
                  items-center
                  rounded-2xl
                  bg-gradient-to-r
                  from-[#D4AF37]
                  to-[#B8862E]
                  px-9
                  text-[15px]
                  font-semibold
                  text-black
                  transition
                  hover:scale-105
                "
              >
                Explore Projects
              </a>

              <Link
                href="/contact"
                className="
                  inline-flex
                  h-[58px]
                  items-center
                  rounded-2xl
                  border
                  border-white/20
                  bg-white/10
                  px-9
                  text-[15px]
                  font-semibold
                  text-white
                  backdrop-blur-xl
                  transition
                  hover:border-[#D4AF37]
                  hover:text-[#D4AF37]
                "
              >
                Contact Advisor
              </Link>

            </div>

          </div>

        </div>

        {/* SCROLL */}

        <div className="absolute bottom-10 right-10 hidden md:flex flex-col items-center gap-3">

          <span className="text-[11px] uppercase tracking-[0.3em] text-white/50">
            Scroll
          </span>

          <div className="flex h-12 w-7 justify-center rounded-full border border-white/30">

            <div className="mt-2 h-2 w-2 animate-bounce rounded-full bg-[#D4AF37]" />

          </div>

        </div>

      </section>

      {/* ======================================================
          ABOUT DEVELOPER
      ====================================================== */}

      {developer?.description && (
        <section className="relative bg-white py-24 overflow-hidden">

          <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-[#D4AF37]/8 blur-[120px]" />

          <div className="max-w-[1450px] mx-auto px-6 relative z-10">

            <div className="grid lg:grid-cols-[1.4fr_420px] gap-16 items-start">

              <div>

                <span className="inline-flex items-center rounded-full bg-[#0B221B] px-5 py-2 text-[11px] uppercase tracking-[0.28em] text-[#D4AF37]">
                  About The Developer
                </span>

                <h2 className="mt-7 font-playfair text-4xl md:text-5xl text-[#0B221B] leading-tight">
                  {developer.name}
                </h2>

                <div className="mt-6 h-[2px] w-28 bg-[#D4AF37]" />

                <div className="mt-10 text-[17px] leading-[2.05] text-[#4d4d4d]">

                  <p className="whitespace-pre-line">
                    {developer.description}
                  </p>

                </div>

              </div>

              <div>

                <div className="sticky top-28 rounded-[32px] border border-[#eadfcb] bg-white p-8 shadow-[0_20px_70px_rgba(0,0,0,0.06)]">

                  <div className="flex items-center gap-3">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B221B] text-[#D4AF37]">
                      <Building2 size={24} />
                    </div>

                    <div>

                      <p className="text-[11px] uppercase tracking-[0.25em] text-[#B58B2D]">
                        Company Highlights
                      </p>

                      <h3 className="mt-1 text-2xl font-semibold text-[#0B221B]">
                        Why Choose {developer.name}
                      </h3>

                    </div>

                  </div>

                  <div className="mt-8 space-y-5">

                    {[
                      "Luxury Residential Developments",
                      "Premium Construction Quality",
                      "Prime Investment Locations",
                      "Trusted Developer Reputation",
                      "RERA Registered Projects",
                      "Customer-Centric Experience",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-4"
                      >

                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37]/15">

                          <BadgeCheck
                            size={16}
                            className="text-[#B58B2D]"
                          />

                        </div>

                        <p className="text-[15px] leading-7 text-[#555]">
                          {item}
                        </p>

                      </div>
                    ))}

                  </div>

                  <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#0B221B] to-[#123126] p-6">

                    <p className="text-[#D4AF37] uppercase tracking-[0.2em] text-[11px]">
                      Portfolio
                    </p>

                    <h4 className="mt-2 text-4xl font-bold text-white">
                      {properties.length}+
                    </h4>

                    <p className="mt-2 text-white/70">
                      Signature luxury developments available through Property Bouquet.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>
      )}

      {/* ======================================================
          PROJECTS
      ====================================================== */}

      <section
        id="projects"
        className="max-w-[1500px] mx-auto px-4 py-16"
      >

        <div className="grid xl:grid-cols-[360px_1fr] gap-16 items-start">

          {/* ==================================================
              DESKTOP FILTERS
          ================================================== */}

          <aside className="hidden xl:block sticky top-28 self-start">

            <div className="rounded-[34px] border border-[#E8DFC9] bg-white p-7 shadow-[0_20px_70px_rgba(0,0,0,0.06)]">

              <p className="text-[11px] uppercase tracking-[0.25em] text-[#B58B2D]">
                Property Search
              </p>

              <h3 className="mt-2 font-playfair text-3xl text-[#081c15]">
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
                  baseUrl={`/developers/${slug}`}
                />

              </div>

            </div>

          </aside>

          {/* ==================================================
              RIGHT CONTENT
          ================================================== */}

          <div>

            {/* TOP BAR */}

            <div className="mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

              <div>

                <span className="inline-flex items-center rounded-full bg-[#0B221B] px-5 py-2 text-[11px] uppercase tracking-[0.25em] text-[#D4AF37]">
                  Exclusive Collection
                </span>

                <h2 className="mt-5 font-playfair text-4xl md:text-5xl text-[#081c15] leading-tight">
                  Projects by {developer.name}
                </h2>

                <div className="mt-5 h-[2px] w-28 bg-[#D4AF37]" />

                <p className="mt-6 max-w-2xl text-[17px] leading-8 text-[#666]">
                  Browse an exclusive portfolio of luxury
                  residences, premium apartments and
                  investment opportunities developed by{" "}
                  {developer.name}.
                </p>

              </div>

              <div className="flex flex-wrap items-center gap-4">

                {/* MOBILE FILTER */}

                <button
                  onClick={() =>
                    setShowFilters(true)
                  }
                  className="
                    xl:hidden
                    h-14
                    px-6
                    rounded-2xl
                    bg-[#081c15]
                    text-white
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >

                  <SlidersHorizontal
                    size={17}
                  />

                  Filters

                </button>

                <div className="rounded-2xl border border-[#E6DDCC] bg-white px-7 py-4 shadow-sm">

                  <p className="text-[12px] uppercase tracking-[0.18em] text-[#888]">
                    Available Projects
                  </p>

                  <h3 className="mt-1 text-3xl font-bold text-[#081c15]">
                    {filteredProperties.length}
                  </h3>

                </div>

              </div>

            </div>

            {/* SORT */}

            <div className="mb-8 flex justify-end items-center gap-3">

              <span className="text-sm font-semibold text-gray-500">
                Sort By
              </span>

              <div className="relative">

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                  className="
                    h-12
                    min-w-[220px]
                    pl-4
                    pr-10
                    rounded-xl
                    border
                    border-[#d4af37]/25
                    bg-white
                    text-[#081c15]
                    font-semibold
                    outline-none
                    appearance-none
                    cursor-pointer
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

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] pointer-events-none">
                  ▼
                </span>

              </div>

            </div>

            {/* GRID */}

            {currentProperties.length > 0 ? (

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                {currentProperties.map(
                  (property) => (

                    <div
                      key={property._id}
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

                      {/* IMAGE */}

                      <div className="relative h-[320px] overflow-hidden">

                        <img
                          src={
                            property?.media
                              ?.heroImageUrl ||
                            "/placeholder.jpg"
                          }
                          alt={
                            property?.coreDetails
                              ?.title ||
                            "Luxury property"
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

                        {/* PRICE */}

                        <div className="absolute top-5 right-5 bg-[#081c15] text-white px-5 py-2 rounded-full text-sm font-bold shadow-2xl">

                          {property?.coreDetails
                            ?.priceOnRequest ? (
                            "On Request"
                          ) : property?.coreDetails
                              ?.startingPrice ? (
                            <>
                              ₹
                              {formatPrice(
                                property.coreDetails
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

                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

                          <h3 className="text-2xl font-black leading-tight">

                            {
                              property?.coreDetails
                                ?.title
                            }

                          </h3>

                          <div className="flex items-center gap-2 text-white/80 mt-3">

                            <MapPin size={16} />

                            <span className="text-sm truncate">

                              {property?.locationData
                                ?.locationName ||
                                property?.locationData
                                  ?.customLocation ||
                                "Prime Location"}

                            </span>

                          </div>

                        </div>

                      </div>

                      {/* BOTTOM */}

                      <div className="p-6">

                        <div className="flex items-center justify-between mb-5 text-sm text-black/60">

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

                        <button className="w-full h-14 rounded-2xl bg-[#081c15] hover:bg-[#1b4332] text-white font-bold flex items-center justify-center gap-3 transition-all duration-300">

                          Explore Property

                          <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition"
                          />

                        </button>

                      </div>

                      {/* LINK */}

                      <Link
                        href={`/${property.slug}`}
                        className="absolute inset-0 z-10"
                        aria-label={`View ${
                          property?.coreDetails
                            ?.title ||
                          "property"
                        }`}
                      />

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="bg-white rounded-[32px] p-20 text-center shadow-xl">

                <h3 className="text-4xl font-black text-[#081c15]">
                  No Projects Found
                </h3>

                <p className="text-gray-500 mt-4 text-lg">
                  Try adjusting your filters.
                </p>

              </div>

            )}

            {/* LOAD MORE */}

            <div className="flex justify-center mt-12">

              {visibleCards <
                filteredProperties.length && (

                <button
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

      </section>

      {/* ======================================================
          MOBILE FILTER DRAWER
      ====================================================== */}

      {showFilters && (

        <div className="fixed inset-0 z-[9999] xl:hidden">

          {/* OVERLAY */}

          <div
            className="absolute inset-0 bg-black/60"
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
              bg-white
              overflow-y-auto
              shadow-2xl
            "
          >

            {/* HEADER */}

            <div className="sticky top-0 bg-white z-20 border-b p-5 flex items-center justify-between">

              <div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-[#B58B2D]">
                  Property Search
                </p>

                <h2 className="text-xl font-bold text-[#081c15] mt-1">
                  Filters
                </h2>

              </div>

              <button
                onClick={() =>
                  setShowFilters(false)
                }
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-gray-100
                  flex
                  items-center
                  justify-center
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
                  setFilteredProperties(data);
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
                baseUrl={`/developers/${slug}`}
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