"use client";

import Link from "next/link";

import {
  ArrowRight,
  Check,
  Sparkles,
  BookOpen,
} from "lucide-react";

import { motion } from "framer-motion";

const features = [
  {
    title: "Luxury Market Reports",
    description: "Understand the latest premium property trends.",
  },
  {
    title: "Investment Guides",
    description: "Make informed decisions with practical insights.",
  },
  {
    title: "Expert Property Analysis",
    description: "Explore carefully curated market perspectives.",
  },
  {
    title: "Luxury Lifestyle",
    description: "Discover the world surrounding exceptional living.",
  },
];

export default function BottomCTA() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#f7f5ef]
        py-16
        sm:py-20
        lg:py-24
      "
    >
      {/* ======================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-56
          -top-56
          h-[600px]
          w-[600px]
          rounded-full
          bg-[#163629]/5
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-64
          -right-56
          h-[650px]
          w-[650px]
          rounded-full
          bg-[#b88638]/6
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[420px]
          w-[420px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#163629]/3
          blur-3xl
        "
      />

      {/* ======================================================
          CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-[1500px]
          px-5
          sm:px-6
          lg:px-10
        "
      >
        {/* ====================================================
            MAIN CTA
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            overflow-hidden
            rounded-[30px]
            border
            border-[#dcd6ca]
            bg-white
            shadow-[0_20px_70px_rgba(22,54,41,.07)]
            sm:rounded-[36px]
          "
        >
          {/* ==================================================
              INNER GREEN PANEL
          ================================================== */}

          <div
            className="
              relative
              overflow-hidden
              bg-gradient-to-br
              from-[#163629]
              via-[#183d2e]
              to-[#0d281e]
              px-6
              py-12
              sm:px-10
              sm:py-14
              md:px-14
              md:py-16
              lg:px-20
              lg:py-20
            "
          >
            {/* Decorative glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-32
                -top-40
                h-[430px]
                w-[430px]
                rounded-full
                bg-[#b88638]/10
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-40
                -left-32
                h-[380px]
                w-[380px]
                rounded-full
                bg-white/5
                blur-3xl
              "
            />

            {/* Gold corner line */}

            <div
              className="
                pointer-events-none
                absolute
                right-8
                top-8
                h-16
                w-16
                border-r
                border-t
                border-[#b88638]/30
                sm:right-12
                sm:top-12
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                bottom-8
                left-8
                h-16
                w-16
                border-b
                border-l
                border-[#b88638]/20
                sm:bottom-12
                sm:left-12
              "
            />

            {/* ==================================================
                CONTENT
            ================================================== */}

            <div
              className="
                relative
                mx-auto
                max-w-[950px]
                text-center
              "
            >
              {/* Eyebrow */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.1,
                }}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#d8b46b]/30
                  bg-white/[0.045]
                  px-4
                  py-2
                  backdrop-blur-sm
                "
              >
                <Sparkles
                  size={11}
                  className="text-[#d8b46b]"
                />

                <span
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[2.5px]
                    text-[#d8b46b]
                    sm:text-[9px]
                  "
                >
                  Property Bouquet Insights
                </span>
              </motion.div>

              {/* Heading */}

              <motion.h2
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.16,
                }}
                className="
                  mt-7
                  text-[34px]
                  font-normal
                  leading-[1.12]
                  tracking-[-0.5px]
                  text-white
                  sm:text-[42px]
                  md:text-[48px]
                  lg:text-[54px]
                "
                style={{
                  fontFamily:
                    "Georgia, serif",
                }}
              >
                Stay Ahead in
                <br />
                <span className="text-[#d8b46b]">
                  Luxury Real Estate
                </span>
              </motion.h2>

              {/* Gold divider */}

              <motion.div
                initial={{
                  opacity: 0,
                  width: 0,
                }}
                whileInView={{
                  opacity: 1,
                  width: 48,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.3,
                }}
                className="
                  mx-auto
                  mt-6
                  h-px
                  bg-[#b88638]
                "
              />

              {/* Description */}

              <motion.p
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.55,
                  delay: 0.32,
                }}
                className="
                  mx-auto
                  mt-6
                  max-w-[720px]
                  text-[12px]
                  leading-[1.9]
                  text-white/60
                  sm:text-[13px]
                  md:text-[14px]
                "
              >
                Explore expert insights, investment
                intelligence, luxury lifestyle trends and
                carefully curated property knowledge designed
                for modern buyers and investors.
              </motion.p>
            </div>

            {/* ==================================================
                FEATURES
            ================================================== */}

            <div
              className="
                relative
                mt-10
                grid
                grid-cols-1
                gap-3
                sm:mt-12
                sm:grid-cols-2
                lg:grid-cols-4
                lg:gap-4
              "
            >
              {features.map(
                (feature, index) => (
                  <motion.div
                    key={
                      feature.title
                    }
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 0.5,
                      delay:
                        0.1 +
                        index * 0.07,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    whileHover={{
                      y: -3,
                    }}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-[18px]
                      border
                      border-white/10
                      bg-white/[0.045]
                      p-5
                      backdrop-blur-sm
                      transition-all
                      duration-300
                      hover:border-[#d8b46b]/25
                      hover:bg-white/[0.075]
                    "
                  >
                    {/* Top gold accent */}

                    <div
                      className="
                        absolute
                        left-0
                        top-0
                        h-px
                        w-0
                        bg-[#b88638]
                        transition-all
                        duration-500
                        group-hover:w-full
                      "
                    />

                    <div
                      className="
                        flex
                        items-start
                        gap-3
                        text-left
                      "
                    >
                      {/* Check */}

                      <div
                        className="
                          mt-0.5
                          flex
                          h-6
                          w-6
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[#d8b46b]/25
                          bg-[#b88638]/10
                        "
                      >
                        <Check
                          size={11}
                          className="
                            text-[#d8b46b]
                          "
                        />
                      </div>

                      {/* Text */}

                      <div>
                        <h3
                          className="
                            text-[12px]
                            font-medium
                            leading-5
                            text-white
                          "
                        >
                          {feature.title}
                        </h3>

                        <p
                          className="
                            mt-1
                            text-[9px]
                            leading-[1.6]
                            text-white/40
                          "
                        >
                          {
                            feature.description
                          }
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>

            {/* ==================================================
                CTA BUTTON
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.55,
                delay: 0.42,
              }}
              className="
                mt-10
                flex
                justify-center
                sm:mt-12
              "
            >
              <Link
                href="/insights"
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  border
                  border-[#d8b46b]
                  bg-[#d8b46b]
                  px-7
                  py-3.5
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[1.6px]
                  text-[#163629]
                  shadow-[0_10px_30px_rgba(0,0,0,.15)]
                  transition-all
                  duration-300
                  hover:bg-white
                  hover:shadow-[0_14px_35px_rgba(0,0,0,.2)]
                  sm:px-8
                  sm:py-4
                "
              >
                <BookOpen
                  size={13}
                  className="
                    transition-transform
                    duration-300
                    group-hover:-rotate-3
                  "
                />

                <span>
                  Explore All Insights
                </span>

                <ArrowRight
                  size={14}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>
            </motion.div>

            {/* ==================================================
                SMALL BRAND FOOTER
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                delay: 0.55,
              }}
              className="
                relative
                mt-9
                flex
                items-center
                justify-center
                gap-3
              "
            >
              <div
                className="
                  h-px
                  w-10
                  bg-white/10
                  sm:w-16
                "
              />

              <span
                className="
                  text-[7px]
                  font-medium
                  uppercase
                  tracking-[2.2px]
                  text-white/25
                "
              >
                Curated Property Intelligence
              </span>

              <div
                className="
                  h-px
                  w-10
                  bg-white/10
                  sm:w-16
                "
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}