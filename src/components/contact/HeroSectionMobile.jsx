"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function HeroSectionMobile() {
  return (
    <section className="relative h-[72vh] min-h-[620px] overflow-hidden lg:hidden">

      {/* Background Image */}
      <Image
        src="/contact/bgimg.png"
        alt="Property Bouquet Contact"
        fill
        priority
        quality={85}
        sizes="100vw"
        className="object-cover object-[72%_center]"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#04130F]/75 via-[#04130F]/85 to-[#04130F]/95" />

      {/* Extra Dark Layer */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">

        <div className="w-full px-6 pt-16">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] tracking-[1px]">

            <Link
              href="/"
              className="text-white/60 transition hover:text-[#C89B4F]"
            >
              Home
            </Link>

            <ChevronRight
              size={12}
              className="text-[#C89B4F]"
            />

            <span className="text-white/80">
              Contact Us
            </span>

          </div>

          {/* Heading */}
          <h1
            className="
              mt-7
              font-playfair
              text-[42px]
              leading-[1.05]
              tracking-[-1px]
              text-white
            "
          >
            Contact Us
          </h1>

          {/* Divider */}
          <div className="flex items-center mt-7">

            <div className="w-10 h-px bg-[#C89B4F]" />

            <div className="mx-3 w-[6px] h-[6px] rotate-45 bg-[#C89B4F]" />

            <div className="w-10 h-px bg-[#C89B4F]" />

          </div>

          {/* Subtitle */}
          <h2
            className="
              mt-7
              text-[22px]
              leading-[1.45]
              font-light
              text-white
            "
          >
            We're Here to Help You
            <br />
            Make Confident Real
            <br />
            Estate Decisions.
          </h2>

          {/* Description */}
          <p
            className="
              mt-6
              max-w-[320px]
              text-[14px]
              leading-7
              text-white/70
            "
          >
            Connect with our expert advisors for personalised guidance,
            luxury property recommendations and intelligent investment
            solutions tailored to your goals.
          </p>

        </div>

      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#04130F] to-transparent" />

    </section>
  );
}