"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative h-[300px] md:h-[420px] overflow-hidden">

      {/* Background */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/about/hero.png')",
        }}
      />

      {/* Luxury Overlay */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-[#041B16]/90
          via-[#041B16]/65
          to-black/15
        "
      />

      {/* Content */}

      <div className="relative z-10 h-full">

        <div className="w-full h-full px-6 md:px-8 lg:px-14 xl:px-16">

          <div className="flex h-full items-center">

            <div className="mt-12 md:mt-20">

              {/* Breadcrumb */}

              <div className="flex items-center gap-2 text-[11px] md:text-[13px] text-white/60">

                <Link
                  href="/"
                  className="hover:text-[#D4AF37] transition"
                >
                  Home
                </Link>

               <ChevronRight size={11} className="md:w-[13px] md:h-[13px]" />

                <span className="text-white/80">
                  About Us
                </span>

              </div>

              {/* Title */}

              <h1
                className="
  mt-5
  md:mt-8
  font-playfair
  text-white
  text-[38px]
  md:text-[58px]
  leading-none
  font-medium
"
              >
                About Us
              </h1>

              {/* Gold Divider */}

              <div className="flex items-center mt-5 md:mt-8">

                <div className="w-10 md:w-16 h-px bg-[#C8A85D]" />

                <div className="w-2 h-2 rotate-45 bg-[#C8A85D] mx-3" />

                <div className="w-10 md:w-16 h-px bg-[#C8A85D]" />

              </div>

              {/* Subtitle */}

              <p
                className="
  mt-5
  md:mt-8
  text-white/90
  text-[14px]
  md:text-[17px]
  leading-6
  md:leading-8
  max-w-[300px]
  md:max-w-[420px]
"
              >
                Redefining Real Estate Advisory
                <br />
                with Trust, Insight & Intelligence
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}