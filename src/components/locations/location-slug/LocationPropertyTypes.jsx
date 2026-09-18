"use client";

import Link from "next/link";
import {
  Building2,
  Home,
  TreePine,
  Building,
  ArrowRight,
} from "lucide-react";

export default function LocationPropertyTypes({
  locationName,
  properties = [],
}) {
  // ============================================================
  // PROPERTY TYPE CONFIGURATION
  // ============================================================

  const typeConfig = [
    {
      key: "apartment",
      title: "Luxury Apartments",
      description:
        "Premium residences with modern amenities, refined interiors and thoughtfully planned community living.",
      icon: Building2,
      keywords: [
        "apartment",
        "apartments",
        "flat",
        "flats",
        "residential",
      ],
    },
    {
      key: "floor",
      title: "Independent Floors",
      description:
        "Spacious independent floor residences offering greater privacy, comfort and contemporary family living.",
      icon: Home,
      keywords: [
        "floor",
        "floors",
        "independent floor",
        "builder floor",
      ],
    },
    {
      key: "plot",
      title: "Plots & Land",
      description:
        "Residential plots and land opportunities suited for customised homes and long-term property investment.",
      icon: TreePine,
      keywords: [
        "plot",
        "plots",
        "land",
        "residential plot",
      ],
    },
    {
      key: "commercial",
      title: "Commercial Spaces",
      description:
        "Commercial property opportunities positioned around established and emerging business corridors.",
      icon: Building,
      keywords: [
        "commercial",
        "office",
        "retail",
        "shop",
        "shops",
      ],
    },
  ];

  // ============================================================
  // DETECT AVAILABLE PROPERTY TYPES
  // ============================================================

  const availableTypes = typeConfig.filter((type) => {
    if (!properties?.length) return true;

    return properties.some((property) => {
      const values = [
        property?.categoryName,
        property?.coreDetails?.categoryName,
        property?.propertyType,
        property?.type,
        property?.category,
        property?.coreDetails?.propertyType,
      ]
        .filter(Boolean)
        .map((value) =>
          String(value).toLowerCase().trim()
        );

      return type.keywords.some((keyword) =>
        values.some((value) =>
          value.includes(keyword)
        )
      );
    });
  });

  // ============================================================
  // FALLBACK
  // ============================================================

  const cards =
    availableTypes.length > 0
      ? availableTypes
      : typeConfig;

  return (
    <section
      id="property-types"
      className="
        relative
        overflow-hidden
        border-t
        border-[#e8e1d7]
        bg-[#f7f3ec]
        py-11
        sm:py-13
        md:py-15
        lg:py-16
      "
    >
      {/* ======================================================
          BACKGROUND DETAIL
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-160px]
          top-[-180px]
          h-[400px]
          w-[400px]
          rounded-full
          bg-[#D4AF37]/[0.035]
          blur-[120px]
        "
      />

      {/* ======================================================
          CONTAINER
      ====================================================== */}

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
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="max-w-[780px]">
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
            <span
              className="
                h-px
                w-6
                bg-[#C89D58]
                sm:w-8
              "
            />

            REAL ESTATE TYPES
          </div>

          <h2
            className="
              mt-2
              font-playfair
              text-[28px]
              font-medium
              leading-[1.08]
              tracking-[-0.025em]
              text-[#17342d]
              sm:text-[32px]
              md:text-[36px]
              lg:text-[39px]
            "
          >
            Find a Home That Fits
            Your Lifestyle
          </h2>

          <div
            className="
              mt-3
              h-[2px]
              w-16
              bg-[#C89D58]
              sm:w-20
            "
          />

          <p
            className="
              mt-4
              max-w-[760px]
              text-[10.5px]
              leading-[1.8]
              text-[#59635e]
              sm:text-[11px]
              md:text-[12px]
              md:leading-[1.85]
            "
          >
            Explore luxury apartments, independent floors,
            residential plots and commercial opportunities
            available across {locationName}. Each property
            category offers a different approach to space,
            lifestyle, ownership and long-term investment,
            allowing buyers to explore opportunities that
            align with their individual requirements.
          </p>
        </div>

        {/* ====================================================
            PROPERTY TYPE CARDS
        ==================================================== */}

        <div
          className="
            mt-7
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-4
            lg:gap-4
          "
        >
          {cards.map((type) => {
            const Icon = type.icon;

            return (
              <div
                key={type.key}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[15px]
                  border
                  border-[#e2dace]
                  bg-white
                  shadow-[0_8px_30px_rgba(23,52,45,0.045)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_16px_40px_rgba(23,52,45,0.08)]
                "
              >
                {/* TOP VISUAL */}

                <div
                  className="
                    relative
                    h-[112px]
                    overflow-hidden
                    bg-gradient-to-br
                    from-[#17342d]
                    to-[#0b221b]
                  "
                >
                  {/* Decorative pattern */}

                  <div
                    className="
                      absolute
                      right-[-35px]
                      top-[-45px]
                      h-[130px]
                      w-[130px]
                      rounded-full
                      border
                      border-[#D4AF37]/15
                    "
                  />

                  <div
                    className="
                      absolute
                      right-[-10px]
                      top-[-20px]
                      h-[90px]
                      w-[90px]
                      rounded-full
                      border
                      border-[#D4AF37]/10
                    "
                  />

                  {/* ICON */}

                  <div
                    className="
                      absolute
                      bottom-4
                      left-4
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-[#D4AF37]/20
                      bg-white/10
                      text-[#D4AF37]
                      backdrop-blur-md
                    "
                  >
                    <Icon size={19} strokeWidth={1.5} />
                  </div>

                  {/* NUMBER */}

                  <div
                    className="
                      absolute
                      right-4
                      top-4
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-white/45
                    "
                  >
                    PROPERTY TYPE
                  </div>
                </div>

                {/* CONTENT */}

                <div className="p-4 sm:p-4.5">
                  <h3
                    className="
                      font-playfair
                      text-[18px]
                      font-medium
                      leading-[1.15]
                      text-[#17342d]
                      sm:text-[19px]
                    "
                  >
                    {type.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-[9.5px]
                      leading-[1.65]
                      text-[#737a75]
                      sm:text-[10px]
                    "
                  >
                    {type.description}
                  </p>

                  <Link
                    href="#projects"
                    className="
                      mt-3
                      inline-flex
                      items-center
                      gap-1.5
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                      text-[#17342d]
                      transition-colors
                      duration-300
                      group-hover:text-[#B58B2D]
                      sm:text-[9px]
                    "
                  >
                    Explore {type.title.split(" ")[0]}

                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}