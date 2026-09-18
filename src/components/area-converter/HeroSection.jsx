"use client";

import Link from "next/link";
import {
  Calculator,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[560px] overflow-hidden bg-[#03251d]"
      aria-labelledby="area-converter-heading"
    >
      {/* ========================================================= */}
      {/* BACKGROUND IMAGE                                          */}
      {/* Decorative background — intentionally not an img element */}
      {/* ========================================================= */}

      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          bg-cover
          bg-center
          bg-no-repeat
          scale-[1.02]
        "
        style={{
          backgroundImage:
            "url('/area-converter/hero-bg.png')",
        }}
      />

      {/* ========================================================= */}
      {/* IMAGE DARKENING                                            */}
      {/* ========================================================= */}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#03251d]/15"
      />

      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-[#03251d]/95
          via-[#03251d]/65
          via-[55%]
          to-[#03251d]/10
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          inset-x-0
          top-0
          h-32
          bg-gradient-to-b
          from-black/30
          to-transparent
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          inset-x-0
          bottom-0
          h-36
          bg-gradient-to-t
          from-[#06251d]
          via-[#06251d]/35
          to-transparent
        "
      />

      {/* ========================================================= */}
      {/* GOLD ATMOSPHERIC GLOW                                     */}
      {/* ========================================================= */}

      <div
        aria-hidden="true"
        className="
          absolute
          -top-32
          right-[-100px]
          h-[520px]
          w-[520px]
          rounded-full
          bg-[#d4af37]/10
          blur-[120px]
          pointer-events-none
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          bottom-[-180px]
          right-[18%]
          h-[400px]
          w-[400px]
          rounded-full
          bg-[#d4af37]/5
          blur-[110px]
          pointer-events-none
        "
      />

      {/* ========================================================= */}
      {/* MAIN CONTENT                                               */}
      {/* ========================================================= */}

      <div className="relative z-10 mx-auto max-w-[1450px] px-5 xl:px-8">

        {/* ======================================================= */}
        {/* BREADCRUMB                                               */}
        {/* ======================================================= */}

        <nav
          className="pt-24 md:pt-28"
          aria-label="Breadcrumb"
        >
          <ol
            className="
              flex
              items-center
              gap-2
              text-[11px]
              font-medium
              text-white/65
            "
          >
            <li>
              <Link
                href="/"
                className="
                  transition-colors
                  duration-300
                  hover:text-[#d4af37]
                "
              >
                Home
              </Link>
            </li>

            <li aria-hidden="true">
              <span className="text-white/35">
                ›
              </span>
            </li>

            <li>
              <Link
                href="/tools"
                className="
                  transition-colors
                  duration-300
                  hover:text-[#d4af37]
                "
              >
                Tools
              </Link>
            </li>

            <li aria-hidden="true">
              <span className="text-white/35">
                ›
              </span>
            </li>

            <li>
              <span
                className="text-white"
                aria-current="page"
              >
                Area Converter
              </span>
            </li>
          </ol>
        </nav>

        {/* ======================================================= */}
        {/* HERO CONTENT                                             */}
        {/* ======================================================= */}

        <div
          className="
            max-w-[760px]
            pb-[155px]
            pt-8
            md:pb-[165px]
            md:pt-10
          "
        >

          {/* ===================================================== */}
          {/* SMALL GOLD LABEL                                      */}
          {/* ===================================================== */}

          <p
            className="
              mb-4
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.30em]
              text-[#d4af37]
              md:text-[11px]
            "
          >
            Property Bouquet Tools
          </p>

          {/* ===================================================== */}
          {/* PRIMARY H1                                            */}
          {/* ===================================================== */}

          <h1
            id="area-converter-heading"
            className="
              font-serif
              text-[43px]
              font-normal
              leading-[1.02]
              tracking-[-0.025em]
              text-white
              md:text-[62px]
              lg:text-[68px]
            "
          >
            Area Converter
          </h1>

          {/* ===================================================== */}
          {/* SECONDARY HEADING                                     */}
          {/* ===================================================== */}

          <h2
            className="
              mt-3
              font-serif
              text-[21px]
              font-normal
              leading-tight
              text-[#d8b46b]
              md:text-[29px]
            "
          >
            Convert Land & Property Area Units Instantly
          </h2>

          {/* ===================================================== */}
          {/* INTRODUCTORY DESCRIPTION                              */}
          {/* ===================================================== */}

          <p
            className="
              mt-5
              max-w-[700px]
              text-[14px]
              leading-7
              text-white/80
              md:text-[16px]
              md:leading-8
            "
          >
            Easily convert common real estate and land area
            measurements including square feet, square yards,
            square metres, acres, hectares and more. Use the
            Property Bouquet area converter to quickly compare
            property and land measurements across different units.
          </p>

          {/* ===================================================== */}
          {/* MOBILE TRUST POINTS                                   */}
          {/* ===================================================== */}

          <div
            className="
              mt-8
              flex
              flex-wrap
              gap-3
              lg:hidden
            "
            aria-label="Area converter features"
          >
            <TrustPill
              icon={<ShieldCheck size={15} />}
              text="Reliable Conversions"
            />

            <TrustPill
              icon={<Calculator size={15} />}
              text="Multiple Units"
            />

            <TrustPill
              icon={<Clock3 size={15} />}
              text="Instant Results"
            />

            <TrustPill
              icon={<CheckCircle2 size={15} />}
              text="Real Estate Friendly"
            />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FEATURE STRIP                                             */}
      {/* ========================================================= */}

      <div
        className="
          absolute
          bottom-5
          left-0
          right-0
          z-20
          hidden
          px-5
          lg:block
        "
        aria-label="Area converter features"
      >
        <div
          className="
            mx-auto
            max-w-[1350px]
            overflow-hidden
            rounded-xl
            border
            border-[#d4af37]/15
            bg-[#07362a]/90
            px-6
            py-3.5
            shadow-[0_20px_60px_rgba(0,0,0,0.30)]
            backdrop-blur-xl
          "
        >
          <div className="grid grid-cols-4">

            <Feature
              icon={<ShieldCheck size={22} />}
              title="Reliable Conversions"
              text="Designed for property measurements"
            />

            <Feature
              icon={<Calculator size={22} />}
              title="Multiple Units"
              text="Common area units in one place"
            />

            <Feature
              icon={<Clock3 size={22} />}
              title="Instant Results"
              text="Convert measurements in seconds"
            />

            <Feature
              icon={<CheckCircle2 size={22} />}
              title="Real Estate Friendly"
              text="Useful for buyers & investors"
            />

          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUBTLE BOTTOM BORDER                                      */}
      {/* ========================================================= */}

      <div
        aria-hidden="true"
        className="
          absolute
          bottom-0
          left-0
          right-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#d4af37]/30
          to-transparent
        "
      />
    </section>
  );
}

/* =============================================================== */
/* FEATURE                                                         */
/* =============================================================== */

function Feature({ icon, title, text }) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        border-r
        border-white/10
        px-6
        last:border-r-0
      "
    >
      <div
        aria-hidden="true"
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-[#d4af37]/20
          bg-[#d4af37]/5
          text-[#d4af37]
        "
      >
        {icon}
      </div>

      <div>
        <p
          className="
            text-[12px]
            font-semibold
            leading-none
            text-white
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1.5
            text-[10px]
            leading-none
            text-white/55
          "
        >
          {text}
        </p>
      </div>
    </div>
  );
}

/* =============================================================== */
/* MOBILE TRUST PILL                                               */
/* =============================================================== */

function TrustPill({ icon, text }) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
        rounded-full
        border
        border-[#d4af37]/20
        bg-black/20
        px-4
        py-2
        text-[11px]
        text-white/80
        backdrop-blur-md
      "
    >
      <span
        aria-hidden="true"
        className="text-[#d4af37]"
      >
        {icon}
      </span>

      <span>{text}</span>
    </div>
  );
}
