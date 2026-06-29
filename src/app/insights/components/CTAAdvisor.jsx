"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTAAdvisor() {
  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-[34px]
      bg-gradient-to-br
      from-[#163629]
      via-[#1b4032]
      to-[#234b3b]
      p-8
      shadow-[0_30px_90px_rgba(0,0,0,.18)]
      transition-all
      duration-500
      hover:-translate-y-1
      hover:shadow-[0_40px_100px_rgba(0,0,0,.24)]
      "
    >
      {/* Gold Glow */}

      <div
        className="
        absolute
        -top-16
        -right-16
        w-44
        h-44
        rounded-full
        bg-[#b88638]/20
        blur-3xl
        "
      />

      {/* White Glow */}

      <div
        className="
        absolute
        bottom-0
        left-0
        w-32
        h-32
        rounded-full
        bg-white/5
        blur-3xl
        "
      />

      {/* Gold Label */}

      <p
        className="
        relative
        uppercase
        tracking-[3px]
        text-[11px]
        font-semibold
        text-[#d7b06a]
        "
      >
        Complimentary Consultation
      </p>

      {/* Heading */}

      <h3
        className="
        relative
        mt-4
        text-[34px]
        leading-[46px]
        text-white
        "
        style={{
          fontFamily: "Georgia, serif",
        }}
      >
        Speak With Our
        <br />
        Luxury Property
        <br />
        Advisors
      </h3>

      {/* Description */}

      <p
        className="
        relative
        mt-6
        text-[15px]
        leading-8
        text-white/75
        "
      >
        Receive personalized guidance on luxury homes,
        investment opportunities, off-market properties,
        and wealth-building real estate strategies from
        experienced advisors.
      </p>

      {/* Premium Features */}

      <div className="relative mt-8 space-y-4">

        <div className="flex items-center gap-3">

          <div className="w-2 h-2 rounded-full bg-[#d7b06a]" />

          <span className="text-white/90">
            Luxury Property Specialists
          </span>

        </div>

        <div className="flex items-center gap-3">

          <div className="w-2 h-2 rounded-full bg-[#d7b06a]" />

          <span className="text-white/90">
            Investment Advisory
          </span>

        </div>

        <div className="flex items-center gap-3">

          <div className="w-2 h-2 rounded-full bg-[#d7b06a]" />

          <span className="text-white/90">
            Private & Off-Market Listings
          </span>

        </div>

      </div>

      {/* Divider */}

      <div className="relative my-8 h-px bg-white/10" />

      {/* CTA */}

      <Link
        href="/contact"
        className="
        relative
        flex
        items-center
        justify-center
        gap-3
        h-14
        rounded-full
        bg-[#d7b06a]
        text-black
        font-semibold
        shadow-lg
        transition-all
        duration-300
        hover:scale-[1.03]
        hover:bg-[#e0ba74]
        "
      >
        TALK TO AN ADVISOR

        <ArrowRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />

      </Link>

      {/* Decorative Gold Border */}

      <div
        className="
        absolute
        inset-0
        rounded-[34px]
        border
        border-[#d7b06a]/15
        pointer-events-none
        "
      />
    </div>
  );
}