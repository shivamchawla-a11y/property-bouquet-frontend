"use client";

import { formatPrice } from "@/utils/formatPrice";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

import {
  MapPin,
  Building2,
  ArrowRight,
  SlidersHorizontal,
  Trophy,
  BadgeCheck,
  X,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| PERFORMANCE
|--------------------------------------------------------------------------
| PropertyFilters can be a relatively large client-side component.
|
| It is not required for the initial SEO/content render, so load it
| separately. This reduces the JavaScript that has to be downloaded
| and executed immediately when the developer page opens.
|
| IMPORTANT:
| Filter functionality itself is NOT changed.
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| IMAGE OPTIMIZATION
|--------------------------------------------------------------------------
|
| Your CMS images are commonly served from Cloudinary.
|
| For Cloudinary images we automatically request:
|
| f_auto = automatic modern image format
| q_auto = automatic quality optimization
| w_xxx  = appropriate image width
| c_limit = don't enlarge the original unnecessarily
|
| Non-Cloudinary URLs are returned unchanged.
|
|--------------------------------------------------------------------------
*/

function optimizeImageUrl(
  src,
  width
) {
  if (!src) {
    return "";
  }

  const value = String(src);

  /*
   * Cloudinary
   */
  if (
    value.includes(
      "res.cloudinary.com"
    ) &&
    value.includes("/image/upload/")
  ) {
    return value.replace(
      "/image/upload/",
      `/image/upload/f_auto,q_auto,w_${width},c_limit/`
    );
  }

  /*
   * Other image hosts
   *
   * Keep the URL unchanged so we do not break
   * external image sources.
   */
  return value;
}

/*
|--------------------------------------------------------------------------
| HERO IMAGE WIDTH
|--------------------------------------------------------------------------
*/

const HERO_IMAGE_WIDTH = 1600;

/*
|--------------------------------------------------------------------------
| DEVELOPER LOGO WIDTH
|--------------------------------------------------------------------------
*/

const LOGO_IMAGE_WIDTH = 300;

/*
|--------------------------------------------------------------------------
| PROPERTY CARD IMAGE WIDTH
|--------------------------------------------------------------------------
*/

const PROPERTY_IMAGE_WIDTH = 700;

export default function DeveloperSlugClient({
  developer,
  properties = [],
  slug,
}) {
  const searchParams = useSearchParams();

  /*
  |--------------------------------------------------------------------------
  | IMPORTANT:
  | Start with server-provided properties.
  |
  | This preserves crawlable project links in the initial rendered
  | page structure.
  |--------------------------------------------------------------------------
  */

  const [filteredProperties, setFilteredProperties] =
    useState(() => [...properties]);

  const [sortBy, setSortBy] =
    useState("newest");

  const [visibleCards, setVisibleCards] =
    useState(9);

  const [showFilters, setShowFilters] =
    useState(false);

  const CARDS_PER_PAGE = 9;

  /*
  |--------------------------------------------------------------------------
  | URL FILTERS
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | URL FILTERING
  |--------------------------------------------------------------------------
  |
  | FILTER LOGIC IS UNCHANGED.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let result = [...properties];

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | CATEGORY / PROPERTY TYPE
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | LOCATION
    |--------------------------------------------------------------------------
    */

    const location =
      searchParams.get("location");

    if (location) {
      const searchLocation =
        location.toLowerCase().trim();

      result = result.filter(
        (property) => {
          const locationNames = [];

          /*
          |--------------------------------------------------------------------------
          | LOCATION HIERARCHY
          |--------------------------------------------------------------------------
          */

          let current =
            property?.locationData
              ?.locationRef;

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

          /*
          |--------------------------------------------------------------------------
          | FALLBACK LOCATION
          |--------------------------------------------------------------------------
          */

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

          /*
          |--------------------------------------------------------------------------
          | CUSTOM LOCATION
          |--------------------------------------------------------------------------
          */

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

    /*
    |--------------------------------------------------------------------------
    | DEVELOPER
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | BUDGET
    |--------------------------------------------------------------------------
    */

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
            /*
             * Price on request remains visible.
             */
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

    /*
    |--------------------------------------------------------------------------
    | AMENITIES
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | BHK
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | SORTING
    |--------------------------------------------------------------------------
    */

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

    setFilteredProperties(
      result
    );
  }, [
    properties,
    searchParams,
    sortBy,
  ]);

  /*
  |--------------------------------------------------------------------------
  | BODY LOCK
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | CURRENT PROPERTIES
  |--------------------------------------------------------------------------
  */

  const currentProperties =
    filteredProperties.slice(
      0,
      visibleCards
    );

  /*
  |--------------------------------------------------------------------------
  | PREPARE HERO IMAGE
  |--------------------------------------------------------------------------
  */

  const optimizedDeveloperImage =
    optimizeImageUrl(
      developer?.image,
      HERO_IMAGE_WIDTH
    );

  /*
  |--------------------------------------------------------------------------
  | PREPARE LOGO
  |--------------------------------------------------------------------------
  */

  const optimizedDeveloperLogo =
    optimizeImageUrl(
      developer?.logo,
      LOGO_IMAGE_WIDTH
    );

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#f7f7f7]">

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

        {/* ==================================================
            HERO IMAGE

            Important performance changes:
            - explicit width/height
            - fetchPriority high
            - loading eager
            - optimized Cloudinary URL
            ================================================== */}

        {optimizedDeveloperImage && (
          <img
            src={optimizedDeveloperImage}
            alt=""
            width={1600}
            height={900}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              opacity-30
            "
          />
        )}

        {/* OVERLAYS */}

        <div
          className="
            absolute
            inset-0
            bg-black/60
          "
          aria-hidden="true"
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#081c15]
            via-[#081c15]/85
            to-transparent
          "
          aria-hidden="true"
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.18),_transparent_35%)]
          "
          aria-hidden="true"
        />

        {/* CONTENT */}

        <div
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-[1500px]
            px-6
          "
        >

          <div className="max-w-[760px]">

            {/* BREADCRUMB */}

            <nav
              aria-label="Breadcrumb"
              className="
                mb-8
                flex
                items-center
                gap-3
                text-sm
                uppercase
                tracking-[0.18em]
                text-white/60
              "
            >

              <Link
                href="/"
                className="
                  transition
                  hover:text-[#D4AF37]
                "
              >
                Home
              </Link>

              <span aria-hidden="true">
                /
              </span>

              <Link
                href="/developers"
                className="
                  transition
                  hover:text-[#D4AF37]
                "
              >
                Developers
              </Link>

              <span aria-hidden="true">
                /
              </span>

              <span className="text-[#D4AF37]">
                {developer.name}
              </span>

            </nav>

            {/* BADGE */}

            <div
              className="
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-[#D4AF37]/30
                bg-white/10
                px-6
                py-3
                backdrop-blur-xl
              "
            >

              <Trophy
                size={18}
                className="text-[#D4AF37]"
                aria-hidden="true"
              />

              <span
                className="
                  text-[13px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-[#F3E5AB]
                "
              >
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
                  shadow-[0_35px_80px_rgba(0,0,0,0.45)]
                "
              >

                <div
                  className="
                    absolute
                    inset-0
                    rounded-[36px]
                    border
                    border-[#D4AF37]/25
                  "
                  aria-hidden="true"
                />

                {optimizedDeveloperLogo && (
                  <img
                    src={
                      optimizedDeveloperLogo
                    }
                    alt={`${developer.name} logo`}
                    width={300}
                    height={300}
                    loading="eager"
                    decoding="async"
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

            <div
              className="
                mt-8
                h-[2px]
                w-32
                rounded-full
                bg-gradient-to-r
                from-[#D4AF37]
                to-transparent
              "
              aria-hidden="true"
            />

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

            <div
              className="
                mt-12
                grid
                gap-5
                md:grid-cols-3
              "
            >

              <div
                className="
                  rounded-[26px]
                  border
                  border-white/10
                  bg-white/10
                  p-6
                  backdrop-blur-xl
                "
              >

                <p className="text-4xl font-bold text-[#D4AF37]">
                  {properties.length}+
                </p>

                <p className="mt-2 text-sm uppercase tracking-[0.15em] text-white/65">
                  Luxury Projects
                </p>

              </div>

              <div
                className="
                  rounded-[26px]
                  border
                  border-white/10
                  bg-white/10
                  p-6
                  backdrop-blur-xl
                "
              >

                <p className="text-4xl font-bold text-[#D4AF37]">
                  Verified
                </p>

                <p className="mt-2 text-sm uppercase tracking-[0.15em] text-white/65">
                  Developer
                </p>

              </div>

              <div
                className="
                  rounded-[26px]
                  border
                  border-white/10
                  bg-white/10
                  p-6
                  backdrop-blur-xl
                "
              >

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

        <div
          className="
            absolute
            bottom-10
            right-10
            hidden
            flex-col
            items-center
            gap-3
            md:flex
          "
          aria-hidden="true"
        >

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
        <section
          className="
            relative
            overflow-hidden
            bg-white
            py-24
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
            aria-hidden="true"
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
                gap-16
                lg:grid-cols-[1.4fr_420px]
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
                    tracking-[0.28em]
                    text-[#D4AF37]
                  "
                >
                  About The Developer
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
                  {developer.name}
                </h2>

                <div
                  className="
                    mt-6
                    h-[2px]
                    w-28
                    bg-[#D4AF37]
                  "
                  aria-hidden="true"
                />

                <div
                  className="
                    mt-10
                    text-[17px]
                    leading-[2.05]
                    text-[#4d4d4d]
                  "
                >

                  <p className="whitespace-pre-line">
                    {developer.description}
                  </p>

                </div>

              </div>

              <div>

                <div
                  className="
                    rounded-[32px]
                    border
                    border-[#eadfcb]
                    bg-white
                    p-8
                    shadow-[0_20px_70px_rgba(0,0,0,0.06)]
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

                      <Building2
                        size={24}
                        aria-hidden="true"
                      />

                    </div>

                    <div>

                      <p
                        className="
                          text-[11px]
                          uppercase
                          tracking-[0.25em]
                          text-[#B58B2D]
                        "
                      >
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

                        <div
                          className="
                            mt-1
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            bg-[#D4AF37]/15
                          "
                        >

                          <BadgeCheck
                            size={16}
                            className="text-[#B58B2D]"
                            aria-hidden="true"
                          />

                        </div>

                        <p className="text-[15px] leading-7 text-[#555]">
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
                        text-[11px]
                        uppercase
                        tracking-[0.2em]
                        text-[#D4AF37]
                      "
                    >
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

              <p className="text-[11px] uppercase tracking-[0.25em] text-[#B58B2D]">
                Property Search
              </p>

              <h3 className="mt-2 font-playfair text-3xl text-[#081c15]">
                Refine Results
              </h3>

              <div
                className="mt-5 h-[2px] w-20 bg-[#D4AF37]"
                aria-hidden="true"
              />

              <div className="mt-7">

                <PropertyFilters
                  properties={properties}
                  onFiltered={(data) => {
                    setFilteredProperties(
                      data
                    );

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

                  <h3 className="mt-1 text-3xl font-bold text-[#081c15]">
                    {filteredProperties.length}
                  </h3>

                </div>

              </div>

            </div>

            {/* SORT */}

            <div className="mb-8 flex items-center justify-end gap-3">

              <label
                htmlFor="developer-project-sort"
                className="text-sm font-semibold text-gray-500"
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
                      property
                        ?.coreDetails
                        ?.title ||
                      "Luxury property";

                    const propertyImage =
                      optimizeImageUrl(
                        property?.media
                          ?.heroImageUrl ||
                          "/placeholder.jpg",
                        PROPERTY_IMAGE_WIDTH
                      );

                    /*
                    |--------------------------------------------------------------------------
                    | REAL CRAWLABLE INTERNAL LINK
                    |--------------------------------------------------------------------------
                    */

                    return (
                      <Link
                        key={
                          property._id
                        }
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
                          text-[#081c15]
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
                              propertyImage
                            }
                            alt={
                              propertyTitle
                            }
                            width={700}
                            height={500}
                            loading="lazy"
                            decoding="async"
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
                            aria-hidden="true"
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
                                property
                                  ?.coreDetails
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

                              <MapPin
                                size={16}
                                aria-hidden="true"
                              />

                              <span className="truncate text-sm">

                                {property
                                  ?.locationData
                                  ?.locationName ||
                                  property
                                    ?.locationData
                                    ?.customLocation ||
                                  "Prime Location"}

                              </span>

                            </div>

                          </div>

                        </div>

                        {/* BOTTOM */}

                        <div
                          className="
                            p-6
                            text-[#081c15]
                          "
                        >

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
                              aria-hidden="true"
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
                  p-20
                  text-center
                  shadow-xl
                "
              >

                <h3 className="text-4xl font-black text-[#081c15]">
                  No Projects Found
                </h3>

                <p className="mt-4 text-lg text-gray-500">
                  Try adjusting your filters.
                </p>

              </div>

            )}

            {/* LOAD MORE */}

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

      {showFilters && (

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

          {/* OVERLAY */}

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

                <h2 className="mt-1 text-xl font-bold text-[#081c15]">
                  Filters
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(false)
                }
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
                onFiltered={(data) => {
                  setFilteredProperties(
                    data
                  );

                  setVisibleCards(
                    CARDS_PER_PAGE
                  );

                  setShowFilters(
                    false
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

        </div>

      )}

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <Footer />

    </div>
  );
}