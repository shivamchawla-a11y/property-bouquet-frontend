
"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

import {
  ChevronRight,
  ArrowRight,
  Building2,
  LineChart,
  Database,
  ShieldCheck,
} from "lucide-react";

// ======================================================
// HERO FEATURES
// ======================================================

const features = [
  {
    title: "Market Intelligence",
    description: "Timely real estate perspectives",
    icon: Building2,
  },
  {
    title: "Investment Analysis",
    description: "Insights for informed decisions",
    icon: LineChart,
  },
  {
    title: "Research & Data",
    description: "Evidence-led market reporting",
    icon: Database,
  },
  {
    title: "Expert Perspectives",
    description: "Understand the bigger picture",
    icon: ShieldCheck,
  },
];

// ======================================================
// PROPERTY INSIGHTS HERO
// ======================================================

export default function HeroSectionInsights() {
  return (
    <section className="
      relative
      isolate
      overflow-hidden
      bg-[#050608]
      text-white
    ">

      {/* BACKGROUND GLOWS */}

      <div className="
        pointer-events-none
        absolute
        -left-48
        -top-40
        h-[500px]
        w-[500px]
        rounded-full
        bg-[#C89D58]/10
        blur-[150px]
      " />

      <div className="
        pointer-events-none
        absolute
        -right-48
        top-[10%]
        h-[460px]
        w-[460px]
        rounded-full
        bg-[#244768]/15
        blur-[160px]
      " />

      {/* SUBTLE GRID */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
        "
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      {/* MAIN CONTAINER */}

      <div className="
        relative
        mx-auto
        max-w-[1450px]
        px-5
        pb-10
        pt-28
        sm:px-8
        sm:pb-12
        sm:pt-32
        lg:px-10
        lg:pb-14
        lg:pt-32
      ">

        <div className="
          grid
          grid-cols-1
          items-center
          gap-9
          lg:grid-cols-[0.95fr_1.05fr]
          lg:gap-12
          xl:gap-16
        ">

          {/* ==============================================
              LEFT CONTENT
          ============================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >

            {/* BREADCRUMB */}

            <nav
              aria-label="Breadcrumb"
              className="
                flex
                items-center
                gap-2
                text-xs
                text-white/55
                sm:text-sm
              "
            >

              <Link
                href="/"
                className="
                  transition-colors
                  duration-300
                  hover:text-[#D7B16B]
                "
              >
                Home
              </Link>

              <ChevronRight
                size={14}
                aria-hidden="true"
              />

              <span
                className="text-white"
                aria-current="page"
              >
                Property Insights
              </span>

            </nav>

            {/* BRAND LABEL */}

            <div className="
              mt-7
              inline-flex
              items-center
              gap-2.5
              rounded-full
              border
              border-[#C89D58]/25
              bg-white/[0.04]
              px-4
              py-2
            ">

              <span className="
                h-2
                w-2
                rounded-full
                bg-[#D7B16B]
              " />

              <span className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[2px]
                text-[#D7B16B]
                sm:text-[10px]
                sm:tracking-[2.5px]
              ">
                Property Bouquet Intelligence
              </span>

            </div>

            {/* MAIN HEADING */}

            <motion.h1
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.12,
                duration: 0.7,
              }}
              className="
                mt-6
                max-w-[680px]
                text-[38px]
                leading-[1.08]
                tracking-[-1px]
                text-white
                sm:text-[46px]
                lg:text-[54px]
                xl:text-[58px]
              "
              style={{
                fontFamily:
                  "Georgia, Times New Roman, serif",
              }}
            >

              Understand the Market.

              <span className="
                mt-1
                block
                text-[#D7B16B]
              ">
                Invest with Confidence.
              </span>

            </motion.h1>

            {/* GOLD DIVIDER */}

            <div className="
              mt-6
              h-[2px]
              w-16
              bg-[#C89D58]
            " />

            {/* DESCRIPTION */}

            <motion.p
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.7,
              }}
              className="
                mt-6
                max-w-[550px]
                text-[14px]
                leading-7
                text-white/65
                sm:text-[15px]
                sm:leading-8
              "
            >
              Explore luxury real estate market intelligence,
              investment analysis, branded residences,
              developer updates and location perspectives
              that help you make informed property decisions.
            </motion.p>

            {/* CTA */}

            <div className="mt-7 flex flex-wrap gap-3">

              <Link
                href="#insights-library"
                className="
                  group
                  inline-flex
                  h-11
                  items-center
                  gap-2.5
                  rounded-full
                  bg-[#D7B16B]
                  px-6
                  text-xs
                  font-semibold
                  text-[#111]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-white
                  sm:h-12
                  sm:px-7
                  sm:text-sm
                "
              >

                Explore Insights

                <ArrowRight
                  size={16}
                  className="
                    transition-transform
                    group-hover:translate-x-1
                  "
                />

              </Link>

            </div>

          </motion.div>

          {/* ==============================================
              RIGHT IMAGE
          ============================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="relative"
          >

            <div className="
              relative
              aspect-[16/11]
              w-full
              overflow-hidden
              rounded-[24px]
              border
              border-white/10
              bg-[#101820]
              shadow-[0_30px_75px_rgba(0,0,0,.4)]
              sm:rounded-[30px]
            ">

              <Image
                src="/hero-img.webp"
                alt="Luxury residential skyline and real estate market intelligence"
                fill
                priority
                sizes="
                  (max-width: 1023px) 100vw,
                  55vw
                "
                className="
                  object-cover
                  object-center
                "
              />

              {/* IMAGE OVERLAY */}

              <div className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-black/65
                via-transparent
                to-black/15
              " />

              {/* TOP LABEL */}

              <div className="
                absolute
                right-3
                top-3
                rounded-full
                border
                border-white/15
                bg-black/50
                px-3
                py-2
                backdrop-blur-xl
                sm:right-5
                sm:top-5
                sm:px-4
              ">

                <p className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[1.5px]
                  text-white/90
                  sm:text-[9px]
                  sm:tracking-[2px]
                ">
                  Luxury Real Estate Intelligence
                </p>

              </div>

              {/* IMAGE CAPTION */}

              <div className="
                absolute
                bottom-5
                left-5
                right-5
                sm:bottom-6
                sm:left-7
              ">

                <p className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[2px]
                  text-[#D7B16B]
                ">
                  Property Bouquet
                </p>

                <p
                  className="
                    mt-2
                    text-lg
                    leading-tight
                    text-white
                    sm:text-xl
                  "
                  style={{
                    fontFamily: "Georgia, serif",
                  }}
                >
                  Perspective beyond the property.
                </p>

              </div>

            </div>

            {/* DECORATIVE RING */}

            <div className="
              pointer-events-none
              absolute
              -bottom-6
              -right-6
              -z-10
              h-24
              w-24
              rounded-full
              border
              border-[#C89D58]/20
            " />

          </motion.div>

        </div>

        {/* ==============================================
            FEATURE STRIP
        ============================================== */}

        <div className="
          mt-10
          border-t
          border-white/10
          pt-7
          lg:mt-12
        ">

          <div className="
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            xl:grid-cols-4
          ">

            {features.map((item, index) => {

              const Icon = item.icon;

              return (

                <motion.div
                  key={item.title}
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.07,
                  }}
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.025]
                    px-4
                    py-4
                    transition-colors
                    hover:border-[#C89D58]/30
                    hover:bg-white/[0.05]
                    sm:gap-4
                    sm:px-5
                  "
                >

                  {/* ICON */}

                  <div className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#C89D58]/25
                    bg-[#C89D58]/10
                    text-[#D7B16B]
                    transition-colors
                    group-hover:bg-[#C89D58]/20
                  ">

                    <Icon size={19} />

                  </div>

                  {/* TEXT */}

                  <div className="min-w-0">

                    <h2 className="
                      text-[13px]
                      font-semibold
                      text-white
                    ">
                      {item.title}
                    </h2>

                    <p className="
                      mt-1
                      text-[11px]
                      leading-5
                      text-white/50
                    ">
                      {item.description}
                    </p>

                  </div>

                </motion.div>

              );

            })}

          </div>

        </div>

      </div>

    </section>
  );
}
