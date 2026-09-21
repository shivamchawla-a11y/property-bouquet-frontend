"use client";

import { motion } from "framer-motion";

import {
  ArrowUpRight,
  Building2,
  Compass,
  TrendingUp,
  MapPinned,
  Route,
  ShieldCheck,
} from "lucide-react";


/* ============================================================
   WHY CHOOSE THESE LOCATIONS
   ============================================================

   Premium editorial section for:

   /locations

   Purpose:
   - Explain why location matters
   - Strengthen SEO context
   - Create visual break after location directory
   - Avoid looking like another property-card section
   - Keep the luxury Property Bouquet visual language

   ============================================================ */


const LOCATION_REASONS = [
  {
    number: "01",
    icon: MapPinned,
    eyebrow: "LOCATION INTELLIGENCE",
    title: "Micro-Market Visibility",
    description:
      "A strong real estate decision starts with understanding the exact micro-market. Explore cities, corridors, sectors and neighbourhoods individually rather than treating an entire market as one.",
  },

  {
    number: "02",
    icon: Route,
    eyebrow: "CONNECTED CORRIDORS",
    title: "Access & Connectivity",
    description:
      "Major roads, expressways, business districts and established urban corridors can shape how a location connects with the wider city. Our location directory helps you explore these markets at a more precise level.",
  },

  {
    number: "03",
    icon: TrendingUp,
    eyebrow: "MARKET CONTEXT",
    title: "Long-Term Perspective",
    description:
      "Location should be evaluated beyond today's property options. Understanding the surrounding market, development pattern and broader urban context can help create a more informed long-term view.",
  },

  {
    number: "04",
    icon: Building2,
    eyebrow: "URBAN DEVELOPMENT",
    title: "Established & Emerging Areas",
    description:
      "Some locations are established residential destinations while others are developing into new growth corridors. Exploring both helps you understand the different stages of a real estate market.",
  },

  {
    number: "05",
    icon: Compass,
    eyebrow: "DISCOVER DEEPLY",
    title: "From City to Sector",
    description:
      "Move from a broad city-level view into corridors, sectors and neighbourhoods. The hierarchy makes it easier to discover a location without overwhelming you with every sub-area at once.",
  },

  {
    number: "06",
    icon: ShieldCheck,
    eyebrow: "INFORMED DECISIONS",
    title: "Research Before You Decide",
    description:
      "Every property sits within a larger location story. Studying the surrounding market first creates useful context before comparing individual projects, configurations or investment opportunities.",
  },
];


export default function WhyChooseLocations() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#17382f]
        py-20
        sm:py-24
        lg:py-28
      "
    >

      {/* ======================================================
          BACKGROUND DECORATION
          ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -top-[180px]
          -right-[180px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#c89d58]/[0.08]
          blur-[110px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[200px]
          -left-[180px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#071d18]/60
          blur-[100px]
        "
      />

      {/* subtle grid */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          bg-[linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)]
          bg-[size:70px_70px]
        "
      />


      {/* ======================================================
          MAIN CONTAINER
          ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1320px]
          px-5
          sm:px-8
          lg:px-10
        "
      >

        {/* ====================================================
            HEADER
            ==================================================== */}

        <motion.div
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
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            max-w-[850px]
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                h-px
                w-8
                bg-[#c89d58]
              "
            />

            <span
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[2.8px]
                text-[#d6ae69]
              "
            >
              The Location Advantage
            </span>
          </div>


          <h2
            className="
              mt-5
              text-[38px]
              leading-[1.04]
              tracking-[-0.8px]
              text-white
              sm:text-[48px]
              lg:text-[58px]
            "
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",
            }}
          >
            Why Choose
            <br />

            <span
              className="
                text-[#c89d58]
              "
            >
              These Locations?
            </span>
          </h2>


          <p
            className="
              mt-5
              max-w-[720px]
              text-[13px]
              leading-[1.9]
              text-white/55
              sm:text-[14px]
            "
          >
            Real estate is inseparable from its
            location. From established
            neighbourhoods to emerging
            corridors, understanding where a
            property sits provides important
            context before evaluating the
            property itself.
          </p>

        </motion.div>


        {/* ====================================================
            FEATURED STATEMENT
            ==================================================== */}

        <motion.div
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
            amount: 0.15,
          }}
          transition={{
            duration: 0.55,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mt-12
            rounded-[28px]
            border
            border-white/[0.10]
            bg-white/[0.045]
            p-6
            sm:p-8
            lg:p-10
            backdrop-blur-sm
          "
        >

          <div
            className="
              grid
              gap-8
              lg:grid-cols-[1fr_auto]
              lg:items-center
            "
          >

            <div
              className="
                max-w-[800px]
              "
            >

              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[2px]
                  text-[#c89d58]
                "
              >
                Location First
              </p>


              <h3
                className="
                  mt-3
                  text-[24px]
                  leading-[1.2]
                  text-white
                  sm:text-[29px]
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                }}
              >
                The right property begins
                with the right context.
              </h3>


              <p
                className="
                  mt-3
                  max-w-[730px]
                  text-[12px]
                  leading-[1.85]
                  text-white/45
                  sm:text-[13px]
                "
              >
                Our location directory is
                structured to help you move from
                the larger market to the specific
                area that interests you, making
                location research more focused and
                easier to navigate.
              </p>

            </div>


            {/* decorative compass */}

            <div
              className="
                hidden
                lg:flex
                h-[100px]
                w-[100px]
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#c89d58]/30
                bg-[#c89d58]/[0.05]
              "
            >
              <div
                className="
                  flex
                  h-[68px]
                  w-[68px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#c89d58]/20
                "
              >
                <Compass
                  size={30}
                  strokeWidth={1}
                  className="
                    text-[#c89d58]
                  "
                />
              </div>
            </div>

          </div>

        </motion.div>


        {/* ====================================================
            REASONS GRID
            ==================================================== */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >

          {LOCATION_REASONS.map(
            (item, index) => {
              const Icon =
                item.icon;

              return (
                <motion.article
                  key={item.number}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.1,
                  }}
                  transition={{
                    duration: 0.5,
                    delay:
                      Math.min(
                        index * 0.05,
                        0.2
                      ),
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[25px]
                    border
                    border-white/[0.09]
                    bg-white/[0.035]
                    p-6
                    transition-all
                    duration-500
                    hover:-translate-y-1
                    hover:border-[#c89d58]/30
                    hover:bg-white/[0.06]
                    sm:p-7
                  "
                >

                  {/* top gold line */}

                  <div
                    className="
                      absolute
                      left-0
                      right-0
                      top-0
                      h-px
                      bg-gradient-to-r
                      from-transparent
                      via-[#c89d58]/40
                      to-transparent
                      opacity-0
                      transition-opacity
                      duration-500
                      group-hover:opacity-100
                    "
                  />


                  {/* NUMBER */}

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                    "
                  >

                    <span
                      className="
                        text-[10px]
                        font-semibold
                        tracking-[2px]
                        text-[#c89d58]
                      "
                    >
                      {item.number}
                    </span>


                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#c89d58]/20
                        bg-[#c89d58]/[0.06]
                        transition-all
                        duration-500
                        group-hover:border-[#c89d58]/45
                        group-hover:bg-[#c89d58]/[0.12]
                      "
                    >
                      <Icon
                        size={17}
                        strokeWidth={1.35}
                        className="
                          text-[#c89d58]
                        "
                      />
                    </div>

                  </div>


                  {/* EYEBROW */}

                  <p
                    className="
                      mt-7
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[1.9px]
                      text-white/35
                    "
                  >
                    {item.eyebrow}
                  </p>


                  {/* TITLE */}

                  <h3
                    className="
                      mt-2.5
                      text-[22px]
                      leading-[1.15]
                      text-white
                    "
                    style={{
                      fontFamily:
                        "Georgia, 'Times New Roman', serif",
                    }}
                  >
                    {item.title}
                  </h3>


                  {/* DESCRIPTION */}

                  <p
                    className="
                      mt-3.5
                      text-[11.5px]
                      leading-[1.8]
                      text-white/42
                    "
                  >
                    {item.description}
                  </p>


                  {/* BOTTOM DETAIL */}

                  <div
                    className="
                      mt-7
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <span
                      className="
                        h-px
                        w-6
                        bg-[#c89d58]/60
                        transition-all
                        duration-500
                        group-hover:w-10
                      "
                    />

                    <span
                      className="
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[1.5px]
                        text-white/25
                        transition-colors
                        duration-500
                        group-hover:text-[#c89d58]
                      "
                    >
                      Explore the market
                    </span>

                  </div>

                </motion.article>
              );
            }
          )}

        </div>


        {/* ====================================================
            BOTTOM EDITORIAL STRIP
            ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
          className="
            mt-6
            grid
            gap-4
            lg:grid-cols-[1.4fr_0.6fr]
          "
        >

          {/* LEFT */}

          <div
            className="
              rounded-[25px]
              border
              border-[#c89d58]/15
              bg-[#c89d58]/[0.045]
              p-6
              sm:p-7
            "
          >

            <div
              className="
                flex
                items-start
                gap-4
              "
            >

              <div
                className="
                  mt-1
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#c89d58]/10
                "
              >
                <MapPinned
                  size={16}
                  strokeWidth={1.3}
                  className="
                    text-[#c89d58]
                  "
                />
              </div>


              <div>

                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[2px]
                    text-[#c89d58]
                  "
                >
                  Go Beyond The Address
                </p>


                <h3
                  className="
                    mt-2
                    text-[21px]
                    leading-[1.2]
                    text-white
                  "
                  style={{
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                  }}
                >
                  Explore the market around
                  the property.
                </h3>


                <p
                  className="
                    mt-2.5
                    max-w-[650px]
                    text-[11px]
                    leading-[1.8]
                    text-white/40
                  "
                >
                  A property is part of a much
                  larger ecosystem. Explore its
                  surrounding location, understand
                  the market context and then
                  discover the properties available
                  within it.
                </p>

              </div>

            </div>

          </div>


          {/* RIGHT */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-[25px]
              bg-[#c89d58]
              p-6
              sm:p-7
            "
          >

            <div
              className="
                absolute
                -right-8
                -top-8
                h-32
                w-32
                rounded-full
                border
                border-black/10
              "
            />

            <div
              className="
                absolute
                -right-2
                -top-2
                h-20
                w-20
                rounded-full
                border
                border-black/10
              "
            />


            <div
              className="
                relative
                z-10
              "
            >

              <p
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[2px]
                  text-[#17382f]/60
                "
              >
                Property Bouquet
              </p>


              <h3
                className="
                  mt-3
                  max-w-[260px]
                  text-[22px]
                  leading-[1.15]
                  text-[#17382f]
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                }}
              >
                Your location.
                Your perspective.
              </h3>


              <div
                className="
                  mt-6
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-[#17382f]
                  text-white
                  transition-transform
                  duration-500
                  group-hover:translate-x-1
                "
              >
                <ArrowUpRight
                  size={16}
                />
              </div>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}