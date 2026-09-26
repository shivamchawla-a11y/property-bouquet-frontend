"use client";

import Link from "next/link";

import {
  ArrowRight,
  CircleDollarSign,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function LocationPropertyPrices({
  locationName,
  properties = [],
  pageContent,
}) {
  // ============================================================
  // ADMIN CUSTOM CONTENT
  // ============================================================

  const customContent = pageContent?.propertyPrices || {};

  const customEyebrow =
    customContent?.eyebrow?.trim() || "PROPERTY PRICES";

  const customTitle =
    customContent?.title?.trim() ||
    `Property Prices in ${locationName}`;

  const customDescription =
    customContent?.description?.trim() ||
    `Property values in ${locationName} vary according to property type, configuration, project positioning, development stage, specifications and the location within the wider area. The table below provides a convenient overview of the properties currently represented in the Property Bouquet collection. Prices should be treated as indicative and verified with an advisor before making a purchase decision.`;

  const customCtaText =
    customContent?.ctaText?.trim() ||
    "Get a Price Expert";

  const customCtaLink =
    customContent?.ctaLink?.trim() ||
    "/contact";

  const customFactorsTitle =
    customContent?.factorsTitle?.trim() ||
    "What Influences Property Prices?";

  const customCurrentPricingTitle =
    customContent?.currentPricingTitle?.trim() ||
    "Need current pricing?";

  const customCurrentPricingDescription =
    customContent?.currentPricingDescription?.trim() ||
    "Project pricing can change based on inventory, construction stage and applicable charges.";

  // ============================================================
  // PRICE FACTORS
  // ============================================================

  const defaultFactors = [
    "Project location and accessibility",
    "Developer reputation",
    "Configuration and carpet area",
    "Floor and view",
    "Construction status",
    "Amenities and specifications",
    "Development potential",
    "Overall market demand",
  ];

  const customFactors = Array.isArray(customContent?.factors)
    ? customContent.factors
        .map((item) =>
          typeof item === "string" ? item.trim() : ""
        )
        .filter(Boolean)
    : [];

  const priceFactors =
    customFactors.length > 0
      ? customFactors
      : defaultFactors;

  // ============================================================
  // FORMAT PRICE
  // ============================================================

  const formatPrice = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number) || number <= 0) {
      return "On Request";
    }

    if (number >= 10000000) {
      const crore = number / 10000000;

      return `₹${crore
        .toFixed(crore >= 10 ? 0 : 1)
        .replace(".0", "")} Cr`;
    }

    if (number >= 100000) {
      const lakh = number / 100000;

      return `₹${lakh
        .toFixed(lakh >= 100 ? 0 : 1)
        .replace(".0", "")} L`;
    }

    return `₹${number.toLocaleString("en-IN")}`;
  };

  // ============================================================
  // EXTRACT PRICE DATA
  // ============================================================

  const rows = properties
    .map((property) => {
      const startingPrice =
        property?.coreDetails?.startingPrice ??
        property?.startingPrice ??
        property?.unitConfigurations?.[0]?.price;

      const category =
        property?.categoryData?.categoryName ||
        property?.categoryName ||
        property?.coreDetails?.categoryName ||
        property?.propertyType ||
        "Residential Property";

      const floorPlans =
        property?.gatedContent?.floorPlans || [];

      const configurations = floorPlans
        .map((plan) => plan?.unitType)
        .filter(Boolean);

      return {
        category,
        startingPrice,
        configurations,
        status:
          property?.status ||
          property?.coreDetails?.status ||
          "Available",
      };
    })
    .filter((item) => item.category)
    .slice(0, 6);

  // ============================================================
  // FALLBACK DATA
  // ============================================================

  const displayRows =
    rows.length > 0
      ? rows
      : [
          {
            category: "2 & 3 BHK Apartments",
            startingPrice: null,
            configurations: ["2 & 3 BHK"],
            status: "Contact Advisor",
          },
          {
            category: "3 BHK Apartments",
            startingPrice: null,
            configurations: ["3 BHK"],
            status: "Contact Advisor",
          },
          {
            category: "4 BHK Residences",
            startingPrice: null,
            configurations: ["4 BHK"],
            status: "Contact Advisor",
          },
          {
            category: "Luxury Floors",
            startingPrice: null,
            configurations: ["3 / 4 BHK"],
            status: "Contact Advisor",
          },
          {
            category: "Residential Plots",
            startingPrice: null,
            configurations: ["Multiple Sizes"],
            status: "Contact Advisor",
          },
        ];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section
      id="property-prices"
      aria-labelledby="property-prices-heading"
      className="
        relative
        overflow-hidden
        border-t
        border-[#e6dfd5]
        bg-[#f7f3ec]
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
          top-[-190px]
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
          h-[500px]
          w-[500px]
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
          top-[42%]
          h-px
          w-[75%]
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-[#C89D58]/15
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
            HEADER
        ====================================================== */}

        <div
          className="
            flex
            flex-col
            gap-6
            md:flex-row
            md:items-end
            md:justify-between
          "
        >
          {/* LEFT HEADER */}

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

            {/* Title */}

            <h2
              id="property-prices-heading"
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

          {/* ====================================================
              CTA
          ==================================================== */}

          <Link
            href={customCtaLink}
            className="
              group
              inline-flex
              w-fit
              shrink-0
              items-center
              justify-center
              gap-3
              rounded-full
              border
              border-[#D4AF37]
              bg-[#D4AF37]
              px-5
              py-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.1em]
              text-[#17342d]
              shadow-[0_10px_25px_rgba(23,52,45,0.08)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#c49f2f]
              hover:shadow-[0_15px_35px_rgba(23,52,45,0.12)]
              md:mb-1
              sm:px-6
              sm:py-3.5
            "
          >
            <span>{customCtaText}</span>

            <span
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                bg-[#17342d]/10
                transition-transform
                duration-300
                group-hover:translate-x-0.5
              "
            >
              <ArrowRight
                size={14}
                strokeWidth={1.8}
              />
            </span>
          </Link>
        </div>

        {/* ======================================================
            PRICE CONTENT
        ====================================================== */}

        <div
          className="
            mt-10
            grid
            gap-6
            lg:grid-cols-[minmax(0,1fr)_310px]
            xl:grid-cols-[minmax(0,1fr)_330px]
          "
        >
          {/* ====================================================
              PRICE TABLE
          ==================================================== */}

          <div
            className="
              overflow-hidden
              rounded-[22px]
              border
              border-[#ded6ca]
              bg-white
              shadow-[0_14px_45px_rgba(23,52,45,0.055)]
            "
          >
            {/* TABLE HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[#D4AF37]/20
                bg-[#17342d]
                px-5
                py-4
                sm:px-6
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
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
                  <CircleDollarSign
                    size={18}
                    strokeWidth={1.7}
                  />
                </div>

                <div>
                  <p
                    className="
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-[#F1E4BF]
                      sm:text-[12px]
                    "
                  >
                    Current Property Overview
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[9.5px]
                      text-white/55
                      sm:text-[10px]
                    "
                  >
                    Indicative pricing across available categories
                  </p>
                </div>
              </div>

              <Sparkles
                size={16}
                strokeWidth={1.5}
                className="hidden text-[#D4AF37]/70 sm:block"
              />
            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-[#e7dfd4] bg-[#faf8f4] text-left">
                    <th
                      className="
                        px-5
                        py-4
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.08em]
                        text-[#6D756F]
                        sm:px-6
                        sm:text-[10.5px]
                      "
                    >
                      Property Type
                    </th>

                    <th
                      className="
                        px-5
                        py-4
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.08em]
                        text-[#6D756F]
                        sm:px-6
                        sm:text-[10.5px]
                      "
                    >
                      Starting Price
                    </th>

                    <th
                      className="
                        px-5
                        py-4
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.08em]
                        text-[#6D756F]
                        sm:px-6
                        sm:text-[10.5px]
                      "
                    >
                      Typical Configuration
                    </th>

                    <th
                      className="
                        px-5
                        py-4
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.08em]
                        text-[#6D756F]
                        sm:px-6
                        sm:text-[10.5px]
                      "
                    >
                      Project Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {displayRows.map((row, index) => (
                    <tr
                      key={`${row.category}-${index}`}
                      className="
                        group
                        border-b
                        border-[#eee8df]
                        transition-colors
                        duration-200
                        last:border-b-0
                        hover:bg-[#fcfaf6]
                      "
                    >
                      {/* Property type */}

                      <td className="px-5 py-5 sm:px-6">
                        <div className="flex items-center gap-3">
                          <span
                            className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-[#17342d]/[0.055]
                              text-[9px]
                              font-semibold
                              text-[#8F7335]
                              transition-colors
                              duration-200
                              group-hover:bg-[#D4AF37]/15
                            "
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span
                            className="
                              text-[12px]
                              font-semibold
                              leading-[1.45]
                              text-[#17342d]
                              sm:text-[12.5px]
                            "
                          >
                            {row.category}
                          </span>
                        </div>
                      </td>

                      {/* Starting price */}

                      <td className="px-5 py-5 sm:px-6">
                        <span
                          className="
                            font-playfair
                            text-[17px]
                            font-medium
                            text-[#8F7335]
                            sm:text-[18px]
                          "
                        >
                          {formatPrice(row.startingPrice)}
                        </span>
                      </td>

                      {/* Configuration */}

                      <td className="px-5 py-5 sm:px-6">
                        <div className="flex flex-wrap gap-1.5">
                          {row.configurations?.length ? (
                            row.configurations.map(
                              (configuration, configIndex) => (
                                <span
                                  key={`${configuration}-${configIndex}`}
                                  className="
                                    rounded-full
                                    border
                                    border-[#e4ddd3]
                                    bg-[#faf8f4]
                                    px-2.5
                                    py-1
                                    text-[9.5px]
                                    font-medium
                                    text-[#68716d]
                                  "
                                >
                                  {configuration}
                                </span>
                              )
                            )
                          ) : (
                            <span
                              className="
                                text-[10px]
                                text-[#68716d]
                              "
                            >
                              Multiple configurations
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}

                      <td className="px-5 py-5 sm:px-6">
                        <div className="inline-flex items-center gap-2">
                          <span
                            className="
                              h-1.5
                              w-1.5
                              rounded-full
                              bg-[#C89D58]
                            "
                          />

                          <span
                            className="
                              text-[10px]
                              font-medium
                              text-[#68716d]
                            "
                          >
                            {row.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER */}

            <div
              className="
                border-t
                border-[#eee8df]
                bg-[#faf8f4]
                px-5
                py-3.5
                sm:px-6
              "
            >
              <p
                className="
                  text-[9.5px]
                  leading-[1.6]
                  text-[#7A817D]
                  sm:text-[10px]
                "
              >
                Pricing shown is indicative and may vary by inventory,
                configuration, floor, specifications, applicable charges
                and project stage. Please confirm current pricing with
                Property Bouquet before making a purchase decision.
              </p>
            </div>
          </div>

          {/* ====================================================
              PRICE FACTORS
          ==================================================== */}

          <div
            className="
              rounded-[22px]
              border
              border-[#ded6ca]
              bg-white
              p-5
              shadow-[0_12px_35px_rgba(23,52,45,0.04)]
              sm:p-6
            "
          >
            {/* FACTOR HEADER */}

            <div className="flex items-start gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-[13px]
                  bg-[#17342d]
                  text-[#D4AF37]
                "
              >
                <CircleDollarSign
                  size={18}
                  strokeWidth={1.7}
                />
              </div>

              <div>
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[#A18A5A]
                  "
                >
                  Pricing Guide
                </p>

                <h3
                  className="
                    mt-1
                    font-playfair
                    text-[20px]
                    font-medium
                    leading-[1.2]
                    text-[#17342d]
                    sm:text-[21px]
                  "
                >
                  {customFactorsTitle}
                </h3>
              </div>
            </div>

            {/* FACTOR LIST */}

            <ul className="mt-6 space-y-3">
              {priceFactors.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="
                    group/factor
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-transparent
                    px-2
                    py-2
                    transition-all
                    duration-200
                    hover:border-[#eee5d8]
                    hover:bg-[#faf8f4]
                  "
                >
                  <span
                    className="
                      mt-0.5
                      flex
                      h-5
                      w-5
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#D4AF37]/10
                    "
                  >
                    <CheckCircle2
                      size={12}
                      strokeWidth={1.8}
                      className="text-[#B58B2D]"
                    />
                  </span>

                  <span
                    className="
                      text-[11.5px]
                      leading-[1.55]
                      text-[#68716d]
                      sm:text-[12px]
                    "
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* CURRENT PRICING NOTE */}

            <div
              className="
                mt-6
                rounded-[17px]
                border
                border-[#e9dfcf]
                bg-[#f7f3ec]
                p-4
                sm:p-5
              "
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-[#17342d]
                    text-[#D4AF37]
                  "
                >
                  <TrendingUp
                    size={14}
                    strokeWidth={1.7}
                  />
                </div>

                <p
                  className="
                    text-[11px]
                    font-semibold
                    text-[#17342d]
                    sm:text-[11.5px]
                  "
                >
                  {customCurrentPricingTitle}
                </p>
              </div>

              <p
                className="
                  mt-3
                  text-[10.5px]
                  leading-[1.65]
                  text-[#727872]
                  sm:text-[11px]
                "
              >
                {customCurrentPricingDescription}
              </p>

              {/* Small CTA hint */}

              <Link
                href={customCtaLink}
                className="
                  mt-4
                  inline-flex
                  items-center
                  gap-1.5
                  text-[10px]
                  font-semibold
                  text-[#17342d]
                  transition-all
                  duration-300
                  hover:gap-2
                  hover:text-[#B58B2D]
                "
              >
                Check current pricing
                <ArrowRight
                  size={12}
                  strokeWidth={1.8}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}