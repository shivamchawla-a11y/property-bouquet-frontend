"use client";

import Link from "next/link";

import {
  Building2,
  Home,
  Trees,
  BriefcaseBusiness,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function LocationRealEstateTypes({
  locationName,
  properties = [],
  pageContent,
}) {
  // ============================================================
  // LOCATION PAGE CONTENT
  // ============================================================

  const customContent = pageContent?.realEstateTypes || {};

  const customEyebrow =
    customContent?.eyebrow?.trim() || "REAL ESTATE TYPES";

  const customTitle =
    customContent?.title?.trim() ||
    "Find a Home That Fits Your Lifestyle";

  const customDescription =
    customContent?.description?.trim() ||
    `Whether you are looking for a premium apartment, an independent floor, residential land or a commercial opportunity, the real estate landscape in ${locationName} offers different formats for different lifestyles, ownership objectives and investment requirements. Explore the available property categories and identify the format that best matches your needs.`;

  // ============================================================
  // BUILD PROPERTY TYPE DATA FROM AVAILABLE PROPERTIES
  // ============================================================

  const typeMap = new Map();

  properties.forEach((property) => {
    const type =
      property?.categoryData?.categoryName ||
      property?.categoryName ||
      property?.coreDetails?.categoryName ||
      property?.propertyType ||
      property?.type;

    if (!type) return;

    const normalized = String(type).trim();

    if (!normalized) return;

    if (!typeMap.has(normalized)) {
      typeMap.set(normalized, 0);
    }

    typeMap.set(normalized, typeMap.get(normalized) + 1);
  });

  const discoveredTypes = Array.from(typeMap.entries()).slice(0, 4);

  // ============================================================
  // ICONS
  // ============================================================

  const icons = [
    <Building2 key="building" size={20} strokeWidth={1.7} />,
    <Home key="home" size={20} strokeWidth={1.7} />,
    <Trees key="trees" size={20} strokeWidth={1.7} />,
    <BriefcaseBusiness
      key="briefcase"
      size={20}
      strokeWidth={1.7}
    />,
  ];

  // ============================================================
  // FALLBACK TYPES
  // ============================================================

  const fallbackTypes = [
    {
      title: "Luxury Apartments",
      description:
        "Premium residences designed around contemporary living, refined amenities and thoughtfully planned community environments.",
      icon: <Building2 size={20} strokeWidth={1.7} />,
    },
    {
      title: "Independent Floors",
      description:
        "Spacious floor residences offering greater privacy, generous layouts and a more independent residential experience.",
      icon: <Home size={20} strokeWidth={1.7} />,
    },
    {
      title: "Plots & Land",
      description:
        "Residential land opportunities for buyers seeking flexibility in planning, construction and long-term ownership.",
      icon: <Trees size={20} strokeWidth={1.7} />,
    },
    {
      title: "Commercial Spaces",
      description:
        "Commercial opportunities suited to businesses, investors and buyers evaluating property for income-generating purposes.",
      icon: <BriefcaseBusiness size={20} strokeWidth={1.7} />,
    },
  ];

  // ============================================================
  // ADMIN-CUSTOMIZED CARDS
  // ============================================================

  const customCards = Array.isArray(customContent?.cards)
    ? customContent.cards
        .filter(
          (card) =>
            card &&
            String(card.title || "").trim()
        )
        .map((card, index) => {
          const title = String(card.title).trim();

          const matchingType = discoveredTypes.find(
            ([name]) =>
              String(name).trim().toLowerCase() ===
              title.toLowerCase()
          );

          return {
            title,
            description:
              String(card.description || "").trim() ||
              `Explore ${title.toLowerCase()} opportunities available across ${locationName}, including curated projects listed through Property Bouquet.`,
            count: matchingType?.[1],
            icon:
              icons[index] || (
                <Building2
                  size={20}
                  strokeWidth={1.7}
                />
              ),
          };
        })
    : [];

  // ============================================================
  // FINAL CARD DATA
  //
  // PRIORITY:
  // 1. ADMIN CUSTOMIZED CARDS
  // 2. DYNAMICALLY DISCOVERED PROPERTY TYPES
  // 3. STATIC FALLBACK CARDS
  // ============================================================

  const typeCards =
    customCards.length > 0
      ? customCards
      : discoveredTypes.length > 0
      ? discoveredTypes.map(
          ([name, count], index) => ({
            title: name,
            description:
              `Explore ${name.toLowerCase()} opportunities available across ${locationName}, including curated projects listed through Property Bouquet.`,
            count,
            icon:
              icons[index] || (
                <Building2
                  size={20}
                  strokeWidth={1.7}
                />
              ),
          })
        )
      : fallbackTypes;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section
      id="real-estate-types"
      aria-labelledby="real-estate-types-heading"
      className="
        relative
        overflow-hidden
        border-t
        border-[#ebe5dc]
        bg-[#fcfbf8]
        py-14
        sm:py-16
        md:py-18
        lg:py-20
      "
    >
      {/* ========================================================
          BACKGROUND DETAILS
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-[-180px]
          top-[-180px]
          h-[460px]
          w-[460px]
          rounded-full
          bg-[#D4AF37]/[0.035]
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-220px]
          right-[-180px]
          h-[480px]
          w-[480px]
          rounded-full
          bg-[#17342d]/[0.025]
          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[1px]
          w-[75%]
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-[#D4AF37]/10
          to-transparent
        "
      />

      {/* ========================================================
          MAIN CONTAINER
      ======================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1450px]
          px-5
          sm:px-7
          lg:px-10
          xl:px-12
        "
      >
        {/* ======================================================
            SECTION HEADER
        ====================================================== */}

        <div className="max-w-[860px]">
          {/* Eyebrow */}

          <div
            className="
              flex
              items-center
              gap-2.5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.24em]
              text-[#8F7335]
              sm:text-[11px]
            "
          >
            <span className="h-px w-8 bg-[#C89D58]" />

            <span>{customEyebrow}</span>

            <span className="hidden h-px w-5 bg-[#C89D58]/40 sm:block" />
          </div>

          {/* Heading */}

          <h2
            id="real-estate-types-heading"
            className="
              mt-3
              max-w-[820px]
              font-playfair
              text-[34px]
              font-medium
              leading-[1.08]
              tracking-[-0.03em]
              text-[#17342d]
              sm:text-[39px]
              md:text-[44px]
              lg:text-[48px]
              xl:text-[50px]
            "
          >
            {customTitle}
          </h2>

          {/* Gold divider */}

          <div className="mt-5 flex items-center gap-2">
            <div className="h-[2px] w-14 bg-[#C89D58]" />
            <div className="h-[2px] w-2 bg-[#D4AF37]/40" />
          </div>

          {/* Description */}

          <p
            className="
              mt-5
              max-w-[820px]
              text-[13px]
              leading-[1.8]
              text-[#59635e]
              sm:text-[13.5px]
              md:text-[14px]
              lg:text-[14.5px]
            "
          >
            {customDescription}
          </p>
        </div>

        {/* ======================================================
            PROPERTY TYPE CARDS
        ====================================================== */}

        <div
          className="
            mt-9
            grid
            gap-5
            sm:mt-10
            sm:grid-cols-2
            lg:grid-cols-4
            lg:gap-5
            xl:gap-6
          "
        >
          {typeCards.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className="
                group
                relative
                overflow-hidden
                rounded-[22px]
                border
                border-[#e5ded4]
                bg-white
                shadow-[0_8px_30px_rgba(23,52,45,0.035)]
                transition-all
                duration-500
                hover:-translate-y-1.5
                hover:border-[#d6c092]
                hover:shadow-[0_22px_55px_rgba(23,52,45,0.10)]
              "
            >
              {/* ==================================================
                  TOP DECORATIVE PANEL
              ================================================== */}

              <div
                className="
                  relative
                  h-[112px]
                  overflow-hidden
                  bg-[#17342d]
                  px-5
                  py-5
                  sm:h-[118px]
                "
              >
                {/* Decorative circles */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    right-[-30px]
                    top-[-38px]
                    h-[125px]
                    w-[125px]
                    rounded-full
                    border
                    border-[#D4AF37]/10
                    transition-transform
                    duration-700
                    group-hover:scale-110
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    right-[8px]
                    top-[-15px]
                    h-[72px]
                    w-[72px]
                    rounded-full
                    border
                    border-[#D4AF37]/[0.07]
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    bottom-[-35px]
                    left-[25%]
                    h-[80px]
                    w-[80px]
                    rounded-full
                    bg-[#D4AF37]/[0.035]
                    blur-[20px]
                  "
                />

                {/* Category icon */}

                <div
                  className="
                    relative
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-[14px]
                    border
                    border-[#E5C978]/30
                    bg-[#D4AF37]
                    text-[#17342d]
                    shadow-[0_8px_25px_rgba(0,0,0,0.12)]
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                >
                  {item.icon}
                </div>

                {/* Top right meta */}

                <div
                  className="
                    absolute
                    right-5
                    top-5
                    flex
                    items-center
                    gap-2
                  "
                >
                  {item.count !== undefined && (
                    <span
                      className="
                        rounded-full
                        border
                        border-[#D4AF37]/20
                        bg-[#D4AF37]/10
                        px-2.5
                        py-1.5
                        text-[9px]
                        font-semibold
                        tracking-[0.08em]
                        text-[#E5C978]
                        sm:text-[9.5px]
                      "
                    >
                      {item.count}{" "}
                      {item.count === 1
                        ? "PROPERTY"
                        : "PROPERTIES"}
                    </span>
                  )}

                  <Sparkles
                    size={15}
                    strokeWidth={1.6}
                    className="
                      text-[#D4AF37]/70
                      transition-transform
                      duration-500
                      group-hover:rotate-12
                    "
                  />
                </div>

                {/* Bottom gold line */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    w-0
                    bg-[#D4AF37]
                    transition-all
                    duration-500
                    group-hover:w-full
                  "
                />
              </div>

              {/* ==================================================
                  CARD CONTENT
              ================================================== */}

              <div className="p-5 sm:p-6">
                {/* Category number */}

                <div className="mb-3 flex items-center justify-between">
                  <span
                    className="
                      text-[9px]
                      font-semibold
                      tracking-[0.18em]
                      text-[#A18A5A]
                    "
                  >
                    0{index + 1}
                  </span>

                  <span
                    className="
                      h-px
                      flex-1
                      mx-3
                      bg-[#eee8df]
                    "
                  />

                  <CheckCircle2
                    size={14}
                    strokeWidth={1.7}
                    className="
                      text-[#C89D58]/55
                      transition-colors
                      duration-300
                      group-hover:text-[#C89D58]
                    "
                  />
                </div>

                {/* Title */}

                <h3
                  className="
                    font-playfair
                    text-[21px]
                    font-medium
                    leading-[1.18]
                    tracking-[-0.015em]
                    text-[#17342d]
                    sm:text-[22px]
                  "
                >
                  {item.title}
                </h3>

                {/* Description */}

                <p
                  className="
                    mt-3
                    min-h-[76px]
                    text-[12px]
                    leading-[1.75]
                    text-[#68716d]
                    sm:text-[12.5px]
                  "
                >
                  {item.description}
                </p>

                {/* CTA */}

                <Link
                  href="#projects"
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    text-[11px]
                    font-semibold
                    tracking-[0.01em]
                    text-[#17342d]
                    transition-all
                    duration-300
                    group-hover:gap-2.5
                    group-hover:text-[#B58B2D]
                  "
                >
                  <span>Explore {item.title}</span>

                  <span
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#d9c9a7]
                      transition-all
                      duration-300
                      group-hover:border-[#C89D58]
                      group-hover:bg-[#C89D58]
                      group-hover:text-white
                    "
                  >
                    <ArrowRight
                      size={13}
                      strokeWidth={1.8}
                    />
                  </span>
                </Link>
              </div>

              {/* Bottom subtle accent */}

              <div
                className="
                  absolute
                  bottom-0
                  left-5
                  right-5
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  via-[#C89D58]/20
                  to-transparent
                "
              />
            </article>
          ))}
        </div>

        {/* ======================================================
            BOTTOM SUPPORTING LINE
        ====================================================== */}

        <div
          className="
            mt-8
            flex
            items-center
            gap-3
            border-t
            border-[#ebe5dc]
            pt-5
            sm:mt-10
            sm:pt-6
          "
        >
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#17342d]
              text-[#D4AF37]
            "
          >
            <Sparkles
              size={14}
              strokeWidth={1.6}
            />
          </div>

          <p
            className="
              text-[10.5px]
              leading-[1.6]
              text-[#747b77]
              sm:text-[11px]
              md:text-[11.5px]
            "
          >
            Explore curated property opportunities in{" "}
            <span className="font-semibold text-[#17342d]">
              {locationName}
            </span>{" "}
            and discover a format aligned with your lifestyle,
            ownership goals and investment requirements.
          </p>
        </div>
      </div>
    </section>
  );
}