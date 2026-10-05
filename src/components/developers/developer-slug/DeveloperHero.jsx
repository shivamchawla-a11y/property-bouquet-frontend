"use client";

import Link from "next/link";
import { Trophy } from "lucide-react";

const HERO_IMAGE_WIDTH = 1600;
const LOGO_IMAGE_WIDTH = 300;

function optimizeImageUrl(src, width) {
  if (!src) {
    return "";
  }

  const value = String(src);

  if (
    value.includes("res.cloudinary.com") &&
    value.includes("/image/upload/")
  ) {
    return value.replace(
      "/image/upload/",
      `/image/upload/f_auto,q_auto,w_${width},c_limit/`
    );
  }

  return value;
}

export default function DeveloperHero({
  developer,
  properties = [],
}) {
  const optimizedDeveloperImage = optimizeImageUrl(
    developer?.image,
    HERO_IMAGE_WIDTH
  );

  const optimizedDeveloperLogo = optimizeImageUrl(
    developer?.logo,
    LOGO_IMAGE_WIDTH
  );

  if (!developer) {
    return null;
  }

  return (
    <section
      className="
        relative
        min-h-[850px]
        flex
        items-center
        overflow-hidden
        bg-[#081c15]
        pt-32
        pb-20
      "
    >
      {/* ==================================================
          HERO IMAGE
      ================================================== */}

      {optimizedDeveloperImage && (
        <img
          src={optimizedDeveloperImage}
          alt=""
          width={1600}
          height={900}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            opacity-30
          "
        />
      )}

      {/* ==================================================
          OVERLAYS
      ================================================== */}

      <div
        className="
          absolute
          inset-0
          bg-black/60
        "
        aria-hidden="true"
      />

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-[#081c15]
          via-[#081c15]/85
          to-transparent
        "
        aria-hidden="true"
      />

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.18),_transparent_35%)]
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
          w-full
          max-w-[1500px]
          px-6
        "
      >
        <div className="max-w-[760px]">

          {/* ==================================================
              BREADCRUMB
          ================================================== */}

          <nav
            aria-label="Breadcrumb"
            className="
              mb-8
              flex
              items-center
              gap-3
              text-sm
              uppercase
              tracking-[0.18em]
              text-white/60
            "
          >
            <Link
              href="/"
              className="
                transition
                hover:text-[#D4AF37]
              "
            >
              Home
            </Link>

            <span aria-hidden="true">
              /
            </span>

            <Link
              href="/developers"
              className="
                transition
                hover:text-[#D4AF37]
              "
            >
              Developers
            </Link>

            <span aria-hidden="true">
              /
            </span>

            <span className="text-[#D4AF37]">
              {developer.name}
            </span>
          </nav>

          {/* ==================================================
              BADGE
          ================================================== */}

          <div
            className="
              inline-flex
              items-center
              gap-3
              rounded-full
              border
              border-[#D4AF37]/30
              bg-white/10
              px-6
              py-3
              backdrop-blur-xl
            "
          >
            <Trophy
              size={18}
              className="text-[#D4AF37]"
              aria-hidden="true"
            />

            <span
              className="
                text-[13px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[#F3E5AB]
              "
            >
              Luxury Developer Collection
            </span>
          </div>

          {/* ==================================================
              LOGO
          ================================================== */}

          <div className="mt-10">
            <div
              className="
                relative
                flex
                h-[150px]
                w-[150px]
                items-center
                justify-center
                rounded-[36px]
                border
                border-white/15
                bg-white/95
                shadow-[0_35px_80px_rgba(0,0,0,0.45)]
              "
            >
              <div
                className="
                  absolute
                  inset-0
                  rounded-[36px]
                  border
                  border-[#D4AF37]/25
                "
                aria-hidden="true"
              />

              {optimizedDeveloperLogo && (
                <img
                  src={optimizedDeveloperLogo}
                  alt={`${developer.name} logo`}
                  width={300}
                  height={300}
                  loading="eager"
                  decoding="async"
                  className="
                    relative
                    z-10
                    max-h-[95px]
                    max-w-[95px]
                    object-contain
                  "
                />
              )}
            </div>
          </div>

          {/* ==================================================
              TITLE
          ================================================== */}

          <h1
            className="
              mt-10
              max-w-[900px]
              font-playfair
              text-5xl
              font-semibold
              leading-[1.05]
              text-white
              md:text-7xl
            "
          >
            {developer.name}
          </h1>

          <div
            className="
              mt-8
              h-[2px]
              w-32
              rounded-full
              bg-gradient-to-r
              from-[#D4AF37]
              to-transparent
            "
            aria-hidden="true"
          />

          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          <p
            className="
              mt-8
              max-w-[700px]
              text-[18px]
              leading-9
              text-white/75
            "
          >
            Explore iconic luxury residences,
            landmark developments, and
            investment opportunities by{" "}
            <span className="font-semibold text-[#F3D98A]">
              {developer.name}
            </span>
            , one of India's trusted names
            in premium real estate.
          </p>

          {/* ==================================================
              STATS
          ================================================== */}

          <div
            className="
              mt-12
              grid
              gap-5
              md:grid-cols-3
            "
          >
            <div
              className="
                rounded-[26px]
                border
                border-white/10
                bg-white/10
                p-6
                backdrop-blur-xl
              "
            >
              <p className="text-4xl font-bold text-[#D4AF37]">
                {properties.length}+
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  uppercase
                  tracking-[0.15em]
                  text-white/65
                "
              >
                Luxury Projects
              </p>
            </div>

            <div
              className="
                rounded-[26px]
                border
                border-white/10
                bg-white/10
                p-6
                backdrop-blur-xl
              "
            >
              <p className="text-4xl font-bold text-[#D4AF37]">
                Verified
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  uppercase
                  tracking-[0.15em]
                  text-white/65
                "
              >
                Developer
              </p>
            </div>

            <div
              className="
                rounded-[26px]
                border
                border-white/10
                bg-white/10
                p-6
                backdrop-blur-xl
              "
            >
              <p className="text-4xl font-bold text-[#D4AF37]">
                Premium
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  uppercase
                  tracking-[0.15em]
                  text-white/65
                "
              >
                Collection
              </p>
            </div>
          </div>

          {/* ==================================================
              CTA
          ================================================== */}

          <div className="mt-12 flex flex-wrap gap-5">
            <a
              href="#projects"
              className="
                inline-flex
                h-[58px]
                items-center
                rounded-2xl
                bg-gradient-to-r
                from-[#D4AF37]
                to-[#B8862E]
                px-9
                text-[15px]
                font-semibold
                text-black
                transition
                hover:scale-105
              "
            >
              Explore Projects
            </a>

            <Link
              href="/contact"
              className="
                inline-flex
                h-[58px]
                items-center
                rounded-2xl
                border
                border-white/20
                bg-white/10
                px-9
                text-[15px]
                font-semibold
                text-white
                backdrop-blur-xl
                transition
                hover:border-[#D4AF37]
                hover:text-[#D4AF37]
              "
            >
              Contact Advisor
            </Link>
          </div>
        </div>
      </div>

      {/* ==================================================
          SCROLL INDICATOR
      ================================================== */}

      <div
        className="
          absolute
          bottom-10
          right-10
          hidden
          flex-col
          items-center
          gap-3
          md:flex
        "
        aria-hidden="true"
      >
        <span
          className="
            text-[11px]
            uppercase
            tracking-[0.3em]
            text-white/50
          "
        >
          Scroll
        </span>

        <div
          className="
            flex
            h-12
            w-7
            justify-center
            rounded-full
            border
            border-white/30
          "
        >
          <div
            className="
              mt-2
              h-2
              w-2
              animate-bounce
              rounded-full
              bg-[#D4AF37]
            "
          />
        </div>
      </div>
    </section>
  );
}