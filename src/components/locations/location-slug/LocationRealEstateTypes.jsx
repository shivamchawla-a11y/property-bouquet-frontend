"use client";

import Link from "next/link";

import {
  Building2,
  Home,
  Trees,
  BriefcaseBusiness,
  ArrowRight,
  Sparkles,
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

    typeMap.set(
      normalized,
      typeMap.get(normalized) + 1
    );
  });

  const discoveredTypes = Array.from(
    typeMap.entries()
  ).slice(0, 4);

  // ============================================================
  // ICONS
  // ============================================================

  const icons = [
    <Building2 key="building" size={17} />,
    <Home key="home" size={17} />,
    <Trees key="trees" size={17} />,
    <BriefcaseBusiness key="briefcase" size={17} />,
  ];

  // ============================================================
  // FALLBACK TYPES
  // ============================================================

  const fallbackTypes = [
    {
      title: "Luxury Apartments",
      description:
        "Premium residences designed around contemporary living, refined amenities and thoughtfully planned community environments.",
      icon: <Building2 size={17} />,
    },
    {
      title: "Independent Floors",
      description:
        "Spacious floor residences offering greater privacy, generous layouts and a more independent residential experience.",
      icon: <Home size={17} />,
    },
    {
      title: "Plots & Land",
      description:
        "Residential land opportunities for buyers seeking flexibility in planning, construction and long-term ownership.",
      icon: <Trees size={17} />,
    },
    {
      title: "Commercial Spaces",
      description:
        "Commercial opportunities suited to businesses, investors and buyers evaluating property for income-generating purposes.",
      icon: <BriefcaseBusiness size={17} />,
    },
  ];

  // ============================================================
  // ADMIN-CUSTOMIZED CARDS
  //
  // If cards have been added through the admin editor,
  // use those cards.
  //
  // Property counts are still taken dynamically from the
  // actual properties whenever the title matches a discovered
  // property type.
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
                <Building2 size={17} />
              ),
          };
        })
    : [];

  // ============================================================
  // FINAL CARD DATA
  //
  // Priority:
  //
  // 1. Admin customized cards
  // 2. Dynamically discovered property types
  // 3. Static fallback cards
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
                <Building2 size={17} />
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
        bg-white
        py-10
        sm:py-12
        md:py-14
        lg:py-16
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          left-[-180px]
          top-[-180px]
          h-[420px]
          w-[420px]
          rounded-full
          bg-[#D4AF37]/[0.025]
          blur-[110px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1450px]
          px-5
          sm:px-6
          lg:px-8
        "
      >
        {/* ======================================================
            HEADING
        ====================================================== */}

        <div className="max-w-[760px]">
          <div
            className="
              flex
              items-center
              gap-2
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-[#8F7335]
              sm:text-[9px]
              md:text-[10px]
            "
          >
            <span className="h-px w-7 bg-[#C89D58]" />

            {customEyebrow}
          </div>

          <h2
            id="real-estate-types-heading"
            className="
              mt-2
              font-playfair
              text-[27px]
              font-medium
              leading-[1.08]
              tracking-[-0.025em]
              text-[#17342d]
              sm:text-[31px]
              md:text-[35px]
              lg:text-[39px]
            "
          >
            {customTitle}
          </h2>

          <div className="mt-3 h-[2px] w-16 bg-[#C89D58]" />

          <p
            className="
              mt-4
              max-w-[720px]
              text-[10.5px]
              leading-[1.8]
              text-[#59635e]
              sm:text-[11px]
              md:text-[12px]
            "
          >
            {customDescription}
          </p>
        </div>

        {/* ======================================================
            CARDS
        ====================================================== */}

        <div
          className="
            mt-6
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-4
            lg:gap-4
          "
        >
          {typeCards.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className="
                group
                overflow-hidden
                rounded-[15px]
                border
                border-[#e8e1d7]
                bg-[#fbfaf7]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#d7c29a]
                hover:shadow-[0_18px_45px_rgba(23,52,45,0.08)]
              "
            >
              {/* ==================================================
                  VISUAL HEADER
              ================================================== */}

              <div
                className="
                  relative
                  flex
                  h-[82px]
                  items-end
                  justify-between
                  overflow-hidden
                  bg-[#17342d]
                  px-4
                  py-4
                "
              >
                <div
                  className="
                    absolute
                    right-[-20px]
                    top-[-25px]
                    h-24
                    w-24
                    rounded-full
                    border
                    border-[#D4AF37]/10
                  "
                />

                <div
                  className="
                    relative
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#D4AF37]
                    text-[#17342d]
                  "
                >
                  {item.icon}
                </div>

                <div className="relative flex items-center gap-2">
                  {item.count !== undefined && (
                    <span
                      className="
                        rounded-full
                        border
                        border-[#D4AF37]/20
                        bg-[#D4AF37]/10
                        px-2
                        py-1
                        text-[8px]
                        font-semibold
                        tracking-[0.08em]
                        text-[#E5C978]
                      "
                    >
                      {item.count}{" "}
                      {item.count === 1
                        ? "PROPERTY"
                        : "PROPERTIES"}
                    </span>
                  )}

                  <Sparkles
                    size={14}
                    className="text-[#D4AF37]/70"
                  />
                </div>
              </div>

              {/* ==================================================
                  CONTENT
              ================================================== */}

              <div className="p-4">
                <h3
                  className="
                    font-playfair
                    text-[18px]
                    leading-tight
                    text-[#17342d]
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-2
                    min-h-[58px]
                    text-[9.5px]
                    leading-[1.65]
                    text-[#68716d]
                    sm:text-[10px]
                  "
                >
                  {item.description}
                </p>

                <Link
                  href="#projects"
                  className="
                    mt-3
                    inline-flex
                    items-center
                    gap-1.5
                    text-[9px]
                    font-semibold
                    text-[#17342d]
                    transition-colors
                    hover:text-[#B58B2D]
                  "
                >
                  Explore{" "}
                  {item.title}

                  <ArrowRight size={11} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}