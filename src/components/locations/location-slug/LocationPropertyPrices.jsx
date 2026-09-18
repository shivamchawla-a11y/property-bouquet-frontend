"use client";

import Link from "next/link";

import {
  ArrowRight,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";

export default function LocationPropertyPrices({
  locationName,
  properties = [],
}) {
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
        border-[#e8e1d7]
        bg-[#f7f3ec]
        py-10
        sm:py-12
        md:py-14
        lg:py-16
      "
    >
      <div
        className="
          mx-auto
          max-w-[1450px]
          px-5
          sm:px-6
          lg:px-8
        "
      >
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div
          className="
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-end
            md:justify-between
          "
        >
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

              PROPERTY PRICES
            </div>

            <h2
              id="property-prices-heading"
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
              Property Prices in{" "}
              {locationName}
            </h2>

            <div className="mt-3 h-[2px] w-16 bg-[#C89D58]" />

            <p
              className="
                mt-4
                max-w-[740px]
                text-[10.5px]
                leading-[1.8]
                text-[#59635e]
                sm:text-[11px]
                md:text-[12px]
              "
            >
              Property values in {locationName} vary
              according to property type, configuration,
              project positioning, development stage,
              specifications and the location within the
              wider area. The table below provides a
              convenient overview of the properties
              currently represented in the Property Bouquet
              collection. Prices should be treated as
              indicative and verified with an advisor before
              making a purchase decision.
            </p>
          </div>

          <Link
            href="/contact"
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[#D4AF37]
              px-4
              py-2.5
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[#17342d]
              transition-all
              hover:bg-[#c49f2f]
              md:mb-1
            "
          >
            Get a Price Expert

            <ArrowRight size={12} />
          </Link>
        </div>

        {/* ======================================================
            PRICE CONTENT
        ====================================================== */}

        <div
          className="
            mt-6
            grid
            gap-4
            lg:grid-cols-[minmax(0,1fr)_250px]
            xl:grid-cols-[minmax(0,1fr)_280px]
          "
        >
          {/* TABLE */}

          <div
            className="
              overflow-hidden
              rounded-[15px]
              border
              border-[#e3dbcf]
              bg-white
              shadow-[0_12px_35px_rgba(23,52,45,0.04)]
            "
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] border-collapse">
                <thead>
                  <tr className="bg-[#17342d] text-left text-white">
                    <th className="px-4 py-3 text-[9px] font-semibold">
                      Property Type
                    </th>

                    <th className="px-4 py-3 text-[9px] font-semibold">
                      Starting Price
                    </th>

                    <th className="px-4 py-3 text-[9px] font-semibold">
                      Typical Configuration
                    </th>

                    <th className="px-4 py-3 text-[9px] font-semibold">
                      Project Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {displayRows.map((row, index) => (
                    <tr
                      key={`${row.category}-${index}`}
                      className="
                        border-b
                        border-[#eee8df]
                        last:border-b-0
                      "
                    >
                      <td
                        className="
                          px-4
                          py-3
                          text-[9px]
                          font-semibold
                          text-[#17342d]
                        "
                      >
                        {row.category}
                      </td>

                      <td
                        className="
                          px-4
                          py-3
                          text-[9px]
                          font-semibold
                          text-[#8F7335]
                        "
                      >
                        {formatPrice(
                          row.startingPrice
                        )}
                      </td>

                      <td
                        className="
                          px-4
                          py-3
                          text-[9px]
                          text-[#68716d]
                        "
                      >
                        {row.configurations?.length
                          ? row.configurations.join(
                              " / "
                            )
                          : "Multiple configurations"}
                      </td>

                      <td
                        className="
                          px-4
                          py-3
                          text-[9px]
                          text-[#68716d]
                        "
                      >
                        {row.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PRICE FACTORS */}

          <div
            className="
              rounded-[15px]
              border
              border-[#e3dbcf]
              bg-white
              p-5
            "
          >
            <div className="flex items-center gap-2">
              <CircleDollarSign
                size={16}
                className="text-[#B58B2D]"
              />

              <h3
                className="
                  text-[12px]
                  font-semibold
                  text-[#17342d]
                "
              >
                What Influences Property Prices?
              </h3>
            </div>

            <ul className="mt-4 space-y-2.5">
              {[
                "Project location and accessibility",
                "Developer reputation",
                "Configuration and carpet area",
                "Floor and view",
                "Construction status",
                "Amenities and specifications",
                "Development potential",
                "Overall market demand",
              ].map((item) => (
                <li
                  key={item}
                  className="
                    flex
                    items-start
                    gap-2
                    text-[9px]
                    leading-[1.5]
                    text-[#68716d]
                  "
                >
                  <span
                    className="
                      mt-1
                      h-1.5
                      w-1.5
                      shrink-0
                      rounded-full
                      bg-[#C89D58]
                    "
                  />

                  {item}
                </li>
              ))}
            </ul>

            <div
              className="
                mt-5
                rounded-xl
                bg-[#f7f3ec]
                p-3
              "
            >
              <div className="flex items-center gap-2">
                <TrendingUp
                  size={14}
                  className="text-[#17342d]"
                />

                <p
                  className="
                    text-[9px]
                    font-semibold
                    text-[#17342d]
                  "
                >
                  Need current pricing?
                </p>
              </div>

              <p
                className="
                  mt-1.5
                  text-[8.5px]
                  leading-[1.55]
                  text-[#727872]
                "
              >
                Project pricing can change based on
                inventory, construction stage and
                applicable charges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}