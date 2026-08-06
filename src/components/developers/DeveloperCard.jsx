"use client";

import Link from "next/link";
import { ArrowRight, Bookmark } from "lucide-react";

export default function DeveloperCard({ developer }) {
  return (
    <Link
  href={`/developers/${developer.slug}`}
  className="group block h-full"
>
      <article
        className="
          relative
          h-full
          overflow-hidden
          rounded-[22px]
          border
          border-[#ece3d2]
          bg-white
          transition-all
          duration-500
          shadow-[0_10px_35px_rgba(0,0,0,0.05)]
          hover:-translate-y-2
          hover:border-[#D4AF37]/50
          hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]
        "
      >
        {/* Gold Ribbon */}

        <div
          className="
            absolute
            top-0
            right-5
            z-30
            h-11
            w-8
            rounded-b-md
            bg-[#C89D58]
            flex
            items-start
            justify-center
            pt-2
            shadow-lg
          "
        >
          <Bookmark
            size={14}
            strokeWidth={2}
            className="text-white"
          />
        </div>

        {/* Cover */}

        <div className="relative h-[155px] overflow-hidden bg-[#f6f3ed]">

          <img
            src={developer.image || "/developers/default-cover.jpg"}
            alt={developer.name}
            className="
              h-full
              w-full
              object-cover
              brightness-[1.08]
              contrast-[1.03]
              saturate-[1.05]
              transition-all
              duration-700
              group-hover:scale-110
            "
          />

          {/* Premium White Fade */}

          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/15 to-transparent" />

<div className="absolute inset-0 bg-black/[0.02]" />

        </div>

        {/* Logo */}

        {/* Logo */}

<div className="relative z-20 flex justify-center -mt-12">

  {/* Gold Glow */}
  <div
    className="
      absolute
      inset-0
      flex
      justify-center
      items-center
      pointer-events-none
    "
  >
    <div
      className="
        h-[110px]
        w-[110px]
        rounded-[30px]
        bg-[#D4AF37]/18
        blur-2xl
        opacity-70
        group-hover:opacity-100
        transition-all
        duration-500
      "
    />
  </div>

  <div
    className="
      relative
      flex
      h-[98px]
      w-[98px]
      items-center
      justify-center
      overflow-hidden
      rounded-[24px]
      border
      border-[#E6DCC5]
      bg-[linear-gradient(180deg,#ffffff_0%,#FCFAF5_100%)]
      p-4
      shadow-[0_18px_40px_rgba(0,0,0,0.10)]
      ring-1
      ring-[#D4AF37]/25
      transition-all
      duration-500
      group-hover:scale-[1.06]
      group-hover:shadow-[0_22px_45px_rgba(212,175,55,0.25)]
    "
  >

    {/* Inner Background */}
    <div
      className="
        absolute
        inset-[6px]
        rounded-[18px]
        bg-[#FAF8F2]
      "
    />

    <img
      src={developer.logo}
      alt={developer.name}
      className="
        relative
        z-10
        max-h-[74px]
        max-w-[74px]
        object-contain
        drop-shadow-[0_3px_5px_rgba(0,0,0,0.28)]
        contrast-125
        brightness-105
        saturate-125
        transition-all
        duration-500
        group-hover:scale-110
      "
      style={{
        filter:
          "drop-shadow(0 2px 3px rgba(0,0,0,.22)) contrast(1.22) saturate(1.18) brightness(1.06)",
          mixBlendMode: "multiply",
      }}
    />

  </div>

</div>

        {/* Content */}

        <div className="px-6 pt-5 pb-6">

          <h3
            className="
              text-center
              font-playfair
              text-[22px]
              leading-tight
              text-[#1b1b1b]
            "
          >
            {developer.name}
          </h3>

          {/* Divider */}

          <div className="flex justify-center my-4">

            <div className="h-px w-10 bg-[#D4AF37]" />

          </div>

          <p
            className="
              min-h-[78px]
              text-center
              text-[13px]
              leading-7
              text-[#666]
              line-clamp-3
            "
          >
            {developer.description ||
              "Creating exceptional residential communities through timeless architecture, superior craftsmanship and uncompromising quality."}
          </p>

          {/* Button */}

          <div className="mt-6">

            <div
              className="
                flex
                h-[48px]
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#dbc8a0]
                bg-white
                text-[14px]
                font-semibold
                text-[#1b1b1b]
                transition-all
                duration-300
                group-hover:border-[#03261E]
                group-hover:bg-[#03261E]
                group-hover:text-white
              "
            >
              View Projects

              <ArrowRight
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />

            </div>

          </div>

        </div>

      </article>
    </Link>
  );
}