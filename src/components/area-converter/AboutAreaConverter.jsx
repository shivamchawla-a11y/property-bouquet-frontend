"use client";

import {
  CheckCircle2,
  MapPin,
  Ruler,
  Globe2,
  History,
  Building2,
  ArrowRight,
} from "lucide-react";

export default function AboutAreaConverter() {
  const units = [
    {
      icon: Ruler,
      title: "Square Feet",
      short: "sq ft",
      description:
        "A widely used unit for measuring homes, apartments, offices and smaller property areas.",
      origin:
        "Part of the traditional English measurement system, with length measurements historically connected to the human foot.",
    },
    {
      icon: Building2,
      title: "Square Yard",
      short: "sq yd",
      description:
        "Commonly used in property and land measurement, particularly for plots and residential areas.",
      origin:
        "Derived from the yard, an English unit of length that became standardized over time.",
    },
    {
      icon: Globe2,
      title: "Acre",
      short: "ac",
      description:
        "A traditional unit commonly used for larger parcels of agricultural, residential and development land.",
      origin:
        "The acre has medieval English roots and historically related to the amount of land associated with a day's ploughing.",
    },
    {
      icon: Globe2,
      title: "Hectare",
      short: "ha",
      description:
        "A metric unit frequently used for large land parcels, agricultural land and development projects.",
      origin:
        "The hectare belongs to the metric system developed in France and represents 10,000 square metres.",
    },
    {
      icon: MapPin,
      title: "Guntha",
      short: "regional",
      description:
        "A traditional Indian land-measurement unit still encountered in property and land records in several regions.",
      origin:
        "Its practical usage is regional, so local conventions and official records should always be checked.",
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1450px] px-5 pb-16 xl:px-8">

        {/* =====================================================
            MAIN INTRO CARD
        ===================================================== */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[24px]
            border
            border-[#e8e0d2]
            bg-[#f7f3eb]
            shadow-[0_15px_60px_rgba(0,0,0,0.04)]
          "
        >

          {/* BACKGROUND DECORATION */}

          <div
            className="
              pointer-events-none
              absolute
              -right-32
              -top-32
              h-[380px]
              w-[380px]
              rounded-full
              bg-[#D4AF37]/10
              blur-[100px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-32
              -left-32
              h-[320px]
              w-[320px]
              rounded-full
              bg-[#17382e]/5
              blur-[90px]
            "
          />

          <div className="relative z-10 p-6 md:p-9 lg:p-11">

            <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">

              {/* =================================================
                  LEFT CONTENT
              ================================================= */}

              <div>

                {/* EYEBROW */}

                <div className="flex items-center gap-3">

                  <span className="h-px w-9 bg-[#D4AF37]" />

                  <span
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.25em]
                      text-[#B58B2D]
                    "
                  >
                    Real Estate Measurement Guide
                  </span>

                </div>

                {/* TITLE */}

                <h2
                  className="
                    mt-5
                    font-playfair
                    text-[30px]
                    leading-[1.15]
                    text-[#10251f]
                    md:text-[38px]
                  "
                >
                  What is an{" "}
                  <span className="text-[#B58B2D]">
                    Area Converter?
                  </span>
                </h2>

                <div className="mt-5 h-[2px] w-20 bg-[#D4AF37]" />

                {/* DESCRIPTION */}

                <p
                  className="
                    mt-6
                    max-w-[720px]
                    text-[13px]
                    leading-7
                    text-[#666]
                    md:text-[14px]
                    md:leading-8
                  "
                >
                  An area converter is a practical tool that helps you
                  translate property and land measurements from one unit
                  into another. In real estate, the same property may be
                  described using{" "}
                  <strong className="font-semibold text-[#17382e]">
                    square feet, square yards, square metres, acres,
                    hectares or regional land units
                  </strong>
                  .
                </p>

                <p
                  className="
                    mt-4
                    max-w-[720px]
                    text-[13px]
                    leading-7
                    text-[#666]
                    md:text-[14px]
                    md:leading-8
                  "
                >
                  Converting these measurements makes it easier to{" "}
                  <strong className="font-semibold text-[#17382e]">
                    compare properties, understand listings, evaluate
                    land sizes and interpret property documentation
                  </strong>
                  . It can be particularly useful when comparing
                  properties advertised using different measurement
                  systems.
                </p>

                {/* BENEFITS */}

                <div className="mt-7 grid gap-3 sm:grid-cols-2">

                  {[
                    "Compare properties more easily",
                    "Understand different measurement units",
                    "Reduce manual calculation errors",
                    "Useful for property planning and evaluation",
                  ].map((item) => (
                    <div
                      key={item}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-[#e6dece]
                        bg-white/70
                        px-4
                        py-3
                      "
                    >
                      <CheckCircle2
                        size={16}
                        className="shrink-0 text-[#B58B2D]"
                      />

                      <span className="text-[11px] font-medium text-[#555]">
                        {item}
                      </span>
                    </div>
                  ))}

                </div>

              </div>

              {/* =================================================
                  QUICK CONVERSION CARD
              ================================================= */}

              <div
                className="
                  rounded-[20px]
                  border
                  border-[#e5dccb]
                  bg-white
                  p-6
                  shadow-[0_15px_50px_rgba(0,0,0,0.05)]
                  md:p-7
                "
              >

                <div className="flex items-center gap-4">

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#17382e]
                      text-[#D4AF37]
                    "
                  >
                    <Ruler size={22} />
                  </div>

                  <div>

                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-[#B58B2D]
                      "
                    >
                      Quick Reference
                    </p>

                    <h3 className="mt-1 text-[21px] font-semibold text-[#17382e]">
                      Common Conversions
                    </h3>

                  </div>

                </div>

                <div className="mt-6 space-y-3">

                  {[
                    ["1 sq yd", "9 sq ft"],
                    ["1 acre", "43,560 sq ft"],
                    ["1 hectare", "10,000 sq m"],
                    ["1 sq m", "10.7639 sq ft"],
                  ].map(([from, to]) => (
                    <div
                      key={from}
                      className="
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        bg-[#f8f5ee]
                        px-4
                        py-3
                      "
                    >
                      <span className="text-[12px] font-semibold text-[#333]">
                        {from}
                      </span>

                      <ArrowRight
                        size={14}
                        className="text-[#B58B2D]"
                      />

                      <span className="text-[12px] font-bold text-[#17382e]">
                        {to}
                      </span>
                    </div>
                  ))}

                </div>

                <p className="mt-5 text-[10px] leading-5 text-[#888]">
                  Use these as standard reference conversions. For
                  region-specific land units, always verify the applicable
                  local convention and official property documentation.
                </p>

              </div>

            </div>
          </div>
        </div>

        {/* =====================================================
            UNIT HISTORY
        ===================================================== */}

        <div className="mt-12">

          {/* SECTION HEADER */}

          <div className="max-w-[780px]">

            <div className="flex items-center gap-3">

              <span className="h-px w-9 bg-[#D4AF37]" />

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-[#B58B2D]
                "
              >
                Understanding Measurement Units
              </span>

            </div>

            <h2
              className="
                mt-4
                font-playfair
                text-[29px]
                leading-tight
                text-[#10251f]
                md:text-[35px]
              "
            >
              Where did these{" "}
              <span className="text-[#B58B2D]">
                measurements
              </span>{" "}
              come from?
            </h2>

            <p
              className="
                mt-4
                text-[13px]
                leading-7
                text-[#777]
                md:text-[14px]
              "
            >
              Property measurement has evolved across different cultures,
              regions and measurement systems. Understanding the background
              of common units can make today's real estate measurements much
              easier to interpret.
            </p>

          </div>

          {/* UNIT CARDS */}

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {units.map((unit) => {

              const Icon = unit.icon;

              return (
                <div
                  key={unit.title}
                  className="
                    group
                    rounded-[18px]
                    border
                    border-[#e7dfd1]
                    bg-white
                    p-6
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#D4AF37]/50
                    hover:shadow-[0_18px_50px_rgba(0,0,0,0.06)]
                  "
                >

                  {/* TOP */}

                  <div className="flex items-start justify-between gap-4">

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#f5f1e8]
                        text-[#B58B2D]
                        transition
                        duration-300
                        group-hover:bg-[#17382e]
                        group-hover:text-[#D4AF37]
                      "
                    >
                      <Icon size={20} />
                    </div>

                    <span
                      className="
                        rounded-full
                        bg-[#f5f1e8]
                        px-3
                        py-1
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[#8b6b2d]
                      "
                    >
                      {unit.short}
                    </span>

                  </div>

                  {/* TITLE */}

                  <h3
                    className="
                      mt-5
                      font-playfair
                      text-[22px]
                      text-[#17382e]
                    "
                  >
                    {unit.title}
                  </h3>

                  {/* DESCRIPTION */}

                  <p
                    className="
                      mt-3
                      text-[12px]
                      leading-6
                      text-[#666]
                    "
                  >
                    {unit.description}
                  </p>

                  {/* HISTORY */}

                  <div
                    className="
                      mt-5
                      border-t
                      border-[#eee8dc]
                      pt-4
                    "
                  >

                    <div className="flex items-start gap-2">

                      <History
                        size={14}
                        className="mt-0.5 shrink-0 text-[#B58B2D]"
                      />

                      <p
                        className="
                          text-[10px]
                          leading-5
                          text-[#888]
                        "
                      >
                        <strong className="font-semibold text-[#555]">
                          Background:
                        </strong>{" "}
                        {unit.origin}
                      </p>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

        {/* =====================================================
            REAL ESTATE NOTE
        ===================================================== */}

        <div
          className="
            relative
            mt-10
            overflow-hidden
            rounded-[18px]
            bg-[#17382e]
            px-6
            py-7
            md:px-8
          "
        >

          {/* GOLD GLOW */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-[220px]
              w-[220px]
              rounded-full
              bg-[#D4AF37]/10
              blur-[70px]
            "
          />

          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="max-w-[900px]">

              <div className="flex items-center gap-3">

                <MapPin
                  size={17}
                  className="text-[#D4AF37]"
                />

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-[#D4AF37]
                  "
                >
                  Important for Indian Real Estate
                </span>

              </div>

              <h3
                className="
                  mt-3
                  font-playfair
                  text-[23px]
                  text-white
                  md:text-[27px]
                "
              >
                Local measurement conventions can matter.
              </h3>

              <p
                className="
                  mt-3
                  max-w-[850px]
                  text-[11px]
                  leading-6
                  text-white/65
                  md:text-[12px]
                "
              >
                Units such as{" "}
                <strong className="font-semibold text-white/90">
                  Guntha, Bigha, Marla, Kanal and Ground
                </strong>{" "}
                may be used differently across regions or local
                contexts. For a property transaction, the measurement
                stated in{" "}
                <strong className="font-semibold text-white/90">
                  official land records, approved plans, sale documents
                  or applicable regulations
                </strong>{" "}
                should take precedence over a general online conversion.
              </p>

            </div>

            <div
              className="
                hidden
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#D4AF37]/30
                bg-[#D4AF37]/10
                h-20
                w-20
                md:flex
              "
            >
              <Ruler
                size={30}
                strokeWidth={1.4}
                className="text-[#D4AF37]"
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}