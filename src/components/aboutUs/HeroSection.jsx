"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative h-[460px] md:h-[500px] overflow-hidden">

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

        <div className="w-full h-full px-8 lg:px-14 xl:px-16">

          <div className="flex h-full items-center">

            <div className="mt-20">

              {/* Breadcrumb */}

              <div className="flex items-center gap-2 text-[13px] text-white/60">

                <Link
                  href="/"
                  className="hover:text-[#D4AF37] transition"
                >
                  Home
                </Link>

                <ChevronRight size={13} />

                <span className="text-white/80">
                  About Us
                </span>

              </div>

              {/* Title */}

              <h1
                className="
                  mt-8
                  font-playfair
                  text-white
                  text-[58px]
                  leading-none
                  font-medium
                "
              >
                About Us
              </h1>

              {/* Gold Divider */}

              <div className="flex items-center mt-8">

                <div className="w-16 h-px bg-[#C8A85D]" />

                <div className="w-2 h-2 rotate-45 bg-[#C8A85D] mx-3" />

                <div className="w-16 h-px bg-[#C8A85D]" />

              </div>

              {/* Subtitle */}

              <p
                className="
                  mt-8
                  text-white/90
                  text-[17px]
                  leading-8
                  max-w-[420px]
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