"use client";

import {
  BarChart3,
  Calculator,
  ChartNoAxesCombined,
  Landmark,
  ShieldCheck,
} from "lucide-react";

export default function HeroSection() {
  const features = [
    {
      icon: Landmark,
      title: "Detailed ROI Insights",
      subtitle: "Comprehensive Analysis",
    },
    {
      icon: Calculator,
      title: "Rental & Appreciation",
      subtitle: "Dual Return Calculation",
    },
    {
      icon: ChartNoAxesCombined,
      title: "Customizable Inputs",
      subtitle: "Tailor to Your Investment",
    },
    {
      icon: BarChart3,
      title: "Visual Reports",
      subtitle: "Charts & Projections",
    },
    {
      icon: ShieldCheck,
      title: "Investment Confidence",
      subtitle: "Data-Driven Decisions",
    },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[#021b14]">
      {/* =====================================================
          BACKGROUND IMAGE
      ===================================================== */}

      <div className="absolute inset-0">
        <img
          src="/roi-calculator/roi-bg.png"
          alt=""
          aria-hidden="true"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            object-[68%_center]
            md:object-[72%_center]
          "
        />

        {/* LEFT READABILITY GRADIENT
            Kept lighter on the image side so the
            background remains clearly visible. */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#021b14]
            via-[#021b14]/82
            via-[48%]
            to-[#021b14]/15
          "
        />

        {/* VERY LIGHT OVERALL TINT */}
        <div className="absolute inset-0 bg-[#021b14]/10" />

        {/* TOP SOFT BLEND */}
        <div
          className="
            absolute
            inset-x-0
            top-0
            h-24
            bg-gradient-to-b
            from-[#021b14]/45
            to-transparent
          "
        />

        {/* BOTTOM BLEND INTO CALCULATOR */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-36
            bg-gradient-to-t
            from-[#021b14]
            via-[#021b14]/55
            to-transparent
          "
        />

        {/* SUBTLE GOLD ATMOSPHERE */}
        <div
          className="
            pointer-events-none
            absolute
            -right-20
            top-1/4
            h-72
            w-72
            rounded-full
            bg-[#d9b061]/8
            blur-[100px]
          "
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1450px]
          px-5
          pb-0
          pt-[82px]
          sm:pt-[92px]
          md:pt-[105px]
          xl:px-8
        "
      >
        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div
          className="
            flex
            items-center
            gap-2
            text-[9px]
            font-medium
            tracking-[0.02em]
            text-white/60
            sm:text-[10px]
          "
        >
          <span className="transition-colors hover:text-white">
            Home
          </span>

          <span className="text-white/30">›</span>

          <span className="transition-colors hover:text-white">
            Tools
          </span>

          <span className="text-white/30">›</span>

          <span className="text-[#d9b061]">
            ROI Calculator
          </span>
        </div>

        {/* =================================================
            HERO COPY
        ================================================= */}

        <div className="mt-6 max-w-[720px]">
          {/* SMALL EYEBROW */}

          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-[#d9b061]" />

            <span
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.24em]
                text-[#d9b061]
              "
            >
              Real Estate Investment Tool
            </span>
          </div>

          {/* TITLE */}

          <h1
            className="
              font-serif
              text-[40px]
              font-normal
              leading-[1.02]
              tracking-[-0.025em]
              text-white
              sm:text-[45px]
              md:text-[50px]
              xl:text-[56px]
            "
          >
            ROI Calculator
          </h1>

          {/* GOLD SUBTITLE */}

          <p
            className="
              mt-3
              font-serif
              text-[18px]
              leading-[1.2]
              text-[#d9b061]
              sm:text-[20px]
              md:text-[21px]
              xl:text-[23px]
            "
          >
            Calculate Returns. Plan Better. Invest Smarter.
          </p>

          {/* DESCRIPTION */}

          <p
            className="
              mt-4
              max-w-[650px]
              text-[11px]
              leading-[1.85]
              text-white/72
              sm:text-[12px]
              md:text-[13px]
              md:leading-[1.9]
            "
          >
            Advanced real estate ROI calculator to analyse
            rental income, property appreciation, cash flow
            and total returns — helping you make smarter,
            data-driven investment decisions.
          </p>

          {/* SMALL GOLD DIVIDER */}

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px w-14 bg-[#d9b061]/60" />

            <div className="h-1 w-1 rounded-full bg-[#d9b061]" />

            <div className="h-px w-24 bg-white/15" />
          </div>
        </div>

        {/* =================================================
            FEATURE STRIP
        ================================================= */}

        <div
          className="
            mt-8
            grid
            grid-cols-1
            border-t
            border-white/15
            bg-black/10
            backdrop-blur-[2px]
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-5
          "
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`
                  group
                  flex
                  min-h-[72px]
                  items-center
                  gap-3
                  border-white/10
                  px-2
                  py-4
                  transition-all
                  duration-300
                  hover:bg-white/[0.035]
                  sm:px-4
                  lg:px-4
                  ${
                    index !== features.length - 1
                      ? "border-b sm:border-b-0 sm:border-r"
                      : ""
                  }
                  ${
                    index === 1
                      ? "md:border-r"
                      : ""
                  }
                  ${
                    index === 2
                      ? "md:border-b lg:border-b-0"
                      : ""
                  }
                  ${
                    index === 3
                      ? "sm:border-r-0 lg:border-r"
                      : ""
                  }
                `}
              >
                {/* ICON */}

                <div
                  className="
                    flex
                    h-[38px]
                    w-[38px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#d9b061]/35
                    bg-[#d9b061]/[0.07]
                    text-[#d9b061]
                    transition-all
                    duration-300
                    group-hover:border-[#d9b061]/70
                    group-hover:bg-[#d9b061]/[0.12]
                  "
                >
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                  />
                </div>

                {/* TEXT */}

                <div className="min-w-0">
                  <p
                    className="
                      whitespace-nowrap
                      text-[10px]
                      font-medium
                      leading-5
                      text-white
                      sm:text-[11px]
                    "
                  >
                    {feature.title}
                  </p>

                  <p
                    className="
                      text-[9px]
                      leading-4
                      text-white/50
                      sm:text-[10px]
                    "
                  >
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* =================================================
            BOTTOM SPACING
        ================================================= */}

        <div className="h-7 sm:h-8 md:h-9" />
      </div>
    </section>
  );
}