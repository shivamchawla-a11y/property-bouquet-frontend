"use client";

import {
  Building2,
  BadgeCheck,
} from "lucide-react";

export default function DeveloperAbout({
  developer,
  properties = [],
}) {
  if (!developer?.description) {
    return null;
  }

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-white
        py-24
      "
    >
      {/* ==================================================
          BACKGROUND GLOW
      ================================================== */}

      <div
        className="
          absolute
          right-0
          top-0
          h-[450px]
          w-[450px]
          rounded-full
          bg-[#D4AF37]/8
          blur-[120px]
        "
        aria-hidden="true"
      />

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1450px]
          px-6
        "
      >
        <div
          className="
            grid
            items-start
            gap-16
            lg:grid-cols-[1.4fr_420px]
          "
        >
          {/* ==================================================
              LEFT — DESCRIPTION
          ================================================== */}

          <div>
            <span
              className="
                inline-flex
                items-center
                rounded-full
                bg-[#0B221B]
                px-5
                py-2
                text-[11px]
                uppercase
                tracking-[0.28em]
                text-[#D4AF37]
              "
            >
              About The Developer
            </span>

            <h2
              className="
                mt-7
                font-playfair
                text-4xl
                leading-tight
                text-[#0B221B]
                md:text-5xl
              "
            >
              {developer.name}
            </h2>

            <div
              className="
                mt-6
                h-[2px]
                w-28
                bg-[#D4AF37]
              "
              aria-hidden="true"
            />

            <div
              className="
                mt-10
                text-[17px]
                leading-[2.05]
                text-[#4d4d4d]
              "
            >
              <p className="whitespace-pre-line">
                {developer.description}
              </p>
            </div>
          </div>

          {/* ==================================================
              RIGHT — COMPANY HIGHLIGHTS
          ================================================== */}

          <div>
            <div
              className="
                rounded-[32px]
                border
                border-[#eadfcb]
                bg-white
                p-8
                shadow-[0_20px_70px_rgba(0,0,0,0.06)]
                lg:sticky
                lg:top-28
              "
            >
              {/* HEADER */}

              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#0B221B]
                    text-[#D4AF37]
                  "
                >
                  <Building2
                    size={24}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p
                    className="
                      text-[11px]
                      uppercase
                      tracking-[0.25em]
                      text-[#B58B2D]
                    "
                  >
                    Company Highlights
                  </p>

                  <h3
                    className="
                      mt-1
                      text-2xl
                      font-semibold
                      text-[#0B221B]
                    "
                  >
                    Why Choose {developer.name}
                  </h3>
                </div>
              </div>

              {/* HIGHLIGHTS */}

              <div className="mt-8 space-y-5">
                {[
                  "Luxury Residential Developments",
                  "Premium Construction Quality",
                  "Prime Investment Locations",
                  "Trusted Developer Reputation",
                  "RERA Registered Projects",
                  "Customer-Centric Experience",
                ].map((item) => (
                  <div
                    key={item}
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
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        bg-[#D4AF37]/15
                      "
                    >
                      <BadgeCheck
                        size={16}
                        className="text-[#B58B2D]"
                        aria-hidden="true"
                      />
                    </div>

                    <p
                      className="
                        text-[15px]
                        leading-7
                        text-[#555]
                      "
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              {/* PORTFOLIO */}

              <div
                className="
                  mt-10
                  rounded-2xl
                  bg-gradient-to-r
                  from-[#0B221B]
                  to-[#123126]
                  p-6
                "
              >
                <p
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.2em]
                    text-[#D4AF37]
                  "
                >
                  Portfolio
                </p>

                <h4
                  className="
                    mt-2
                    text-4xl
                    font-bold
                    text-white
                  "
                >
                  {properties.length}+
                </h4>

                <p className="mt-2 text-white/70">
                  Signature luxury developments available
                  through Property Bouquet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}