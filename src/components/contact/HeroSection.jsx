"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative h-[540px] overflow-hidden bg-[#04130F]">

      {/* Background Image */}
      <Image
        src="/contact/bgimg.png"
        alt="Property Bouquet Contact"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-[68%_center]"
      />

      {/* Luxury Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#04130F]/98 via-[#04130F]/84 to-[#04130F]/18" />

      {/* Extra Dark Layer */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content */}
      <div className="relative z-10 h-full">

        <div className="max-w-[1500px] mx-auto h-full px-10 lg:px-16 xl:px-20">

          <div className="flex items-center h-full">

            <div className="max-w-[520px]">

              {/* Breadcrumb */}

              <div className="flex items-center gap-2 text-[12px] tracking-wide">

                <Link
                  href="/"
                  className="text-white/55 hover:text-[#C89B4F] transition-colors duration-300"
                >
                  Home
                </Link>

                <ChevronRight
                  size={12}
                  className="text-[#C89B4F]"
                />

                <span className="text-white/75">
                  Contact Us
                </span>

              </div>

              {/* Heading */}

              <h1
                className="
                  mt-8
                  font-playfair
                  text-[64px]
                  leading-[1.02]
                  tracking-[-1px]
                  text-white
                "
              >
                Contact Us
              </h1>

              {/* Luxury Divider */}

              <div className="flex items-center mt-8">

                <div className="w-14 h-px bg-[#C89B4F]" />

                <div className="mx-4 w-[7px] h-[7px] rotate-45 bg-[#C89B4F]" />

                <div className="w-14 h-px bg-[#C89B4F]" />

              </div>

              {/* Subtitle */}

              <h2
                className="
                  mt-8
                  text-[27px]
                  leading-[1.45]
                  font-light
                  text-white
                "
              >
                We're Here to Help You Make
                <br />
                Confident Real Estate Decisions.
              </h2>

              {/* Description */}

              <p
                className="
                  mt-7
                  max-w-[470px]
                  text-[15px]
                  leading-[1.9]
                  text-white/65
                "
              >
                Connect with our expert advisors for personalized guidance
                and exclusive property recommendations tailored to your
                investment goals and lifestyle aspirations.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#04130F]/10 to-transparent" />

    </section>
  );
}