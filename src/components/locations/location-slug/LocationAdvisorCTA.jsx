"use client";

import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  MessageCircle,
} from "lucide-react";

export default function LocationAdvisorCTA({
  locationName,
  properties = [],
  locationImage = "",
}) {
  return (
    <section
      aria-labelledby="location-advisor-heading"
      className="
        relative
        overflow-hidden
        bg-white
        py-7
        sm:py-8
        md:py-10
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
        <div
          className="
            relative
            overflow-hidden
            rounded-[15px]
            bg-[#0B221B]
            px-5
            py-5
            shadow-[0_18px_50px_rgba(15,59,46,0.16)]
            sm:px-7
            sm:py-6
            lg:px-8
            lg:py-7
          "
        >
          {/* ==================================================
              BACKGROUND IMAGE
          ================================================== */}

          {locationImage && (
            <>
              <img
                src={locationImage}
                alt=""
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  opacity-20
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-[#061811]
                  via-[#0B221B]/95
                  to-[#0B221B]/75
                "
              />
            </>
          )}

          {/* ==================================================
              CONTENT
          ================================================== */}

          <div
            className="
              relative
              z-10
              grid
              items-center
              gap-6
              lg:grid-cols-[minmax(0,1fr)_auto]
            "
          >
            <div>
              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#D4AF37]
                  sm:text-[9px]
                "
              >
                PROPERTY BOUQUET ADVISORY
              </p>

              <h2
                id="location-advisor-heading"
                className="
                  mt-2
                  font-playfair
                  text-[23px]
                  leading-[1.15]
                  text-white
                  sm:text-[26px]
                  md:text-[28px]
                "
              >
                Looking for the Right
                Property in {locationName}?
              </h2>

              <p
                className="
                  mt-2
                  max-w-[700px]
                  text-[9px]
                  leading-[1.7]
                  text-white/65
                  sm:text-[10px]
                "
              >
                Get personalised guidance on available
                projects, configurations, pricing and
                property options that match your
                requirements. Our advisory team can help
                you move from research to a focused
                shortlist.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/contact"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-[#D4AF37]
                    px-4
                    py-2.5
                    text-[8.5px]
                    font-semibold
                    uppercase
                    tracking-[0.06em]
                    text-[#17342d]
                    transition-all
                    hover:bg-[#c49f2f]
                  "
                >
                  Talk to an Expert

                  <ArrowRight size={11} />
                </Link>

                <Link
                  href="/contact"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-white/20
                    bg-white/5
                    px-4
                    py-2.5
                    text-[8.5px]
                    font-semibold
                    uppercase
                    tracking-[0.06em]
                    text-white
                    transition-all
                    hover:bg-white/10
                  "
                >
                  <CalendarDays size={11} />

                  Schedule a Site Visit
                </Link>
              </div>
            </div>

            {/* ==================================================
                STATS
            ================================================== */}

            <div
              className="
                grid
                grid-cols-2
                gap-5
                border-t
                border-white/10
                pt-4
                lg:border-l
                lg:border-t-0
                lg:pl-7
                lg:pt-0
              "
            >
              <div>
                <p
                  className="
                    text-[20px]
                    font-semibold
                    text-[#D4AF37]
                    sm:text-[23px]
                  "
                >
                  {properties.length || 0}+
                </p>

                <p
                  className="
                    mt-1
                    text-[8px]
                    uppercase
                    tracking-[0.12em]
                    text-white/55
                  "
                >
                  Listed Projects
                </p>
              </div>

              <div>
                <p
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-[20px]
                    font-semibold
                    text-[#D4AF37]
                    sm:text-[23px]
                  "
                >
                  <MessageCircle size={16} />

                  Advisor
                </p>

                <p
                  className="
                    mt-1
                    text-[8px]
                    uppercase
                    tracking-[0.12em]
                    text-white/55
                  "
                >
                  Personalised Guidance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}