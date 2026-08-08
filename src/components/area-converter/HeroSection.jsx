"use client";

import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[#03251d]">

      {/* ========================================================= */}
      {/* BACKGROUND IMAGE                                          */}
      {/* ========================================================= */}

      <div
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

      {/* Very light overall tint */}
      <div className="absolute inset-0 bg-[#03251d]/15" />

      {/* Strong dark area on LEFT, image stays visible on RIGHT */}
      <div
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

      {/* Slight top darkening */}
      <div
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

      {/* Bottom fade */}
      <div
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

        <div className="pt-24 md:pt-28">

          <div
            className="
              flex
              items-center
              gap-2
              text-[11px]
              font-medium
              text-white/65
            "
          >

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

            <span className="text-white/35">
              ›
            </span>

            <Link
              href="/"
              className="
                transition-colors
                duration-300
                hover:text-[#d4af37]
              "
            >
              Tools
            </Link>

            <span className="text-white/35">
              ›
            </span>

            <span className="text-white">
              Area Converter
            </span>

          </div>

        </div>

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

          {/* SMALL GOLD LABEL */}

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

          {/* MAIN TITLE */}

          <h1
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

          {/* GOLD SUBTITLE */}

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
            Convert Any Land or Property Area Instantly
          </h2>

          {/* DESCRIPTION */}

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
            Quick, accurate and easy-to-use area unit converter
            for real estate. Convert Square Feet, Square Yards,
            Acres, Hectares and more.
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
          >

            <TrustPill
              icon={<ShieldCheck size={15} />}
              text="100% Accurate"
            />

            <TrustPill
              icon={<Calculator size={15} />}
              text="All Units Covered"
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
              title="100% Accurate"
              text="Precision You Can Trust"
            />

            <Feature
              icon={<Calculator size={22} />}
              title="All Units Covered"
              text="All Area Units in One Place"
            />

            <Feature
              icon={<Clock3 size={22} />}
              title="Instant Results"
              text="Convert in Just One Click"
            />

            <Feature
              icon={<CheckCircle2 size={22} />}
              title="Real Estate Friendly"
              text="Built for Buyers & Investors"
            />

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* SUBTLE BOTTOM BORDER                                      */}
      {/* ========================================================= */}

      <div
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

      {/* ICON */}

      <div
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

      {/* TEXT */}

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

      <span className="text-[#d4af37]">
        {icon}
      </span>

      {text}

    </div>
  );
}