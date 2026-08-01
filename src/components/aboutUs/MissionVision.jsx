"use client";

import { Target, Eye } from "lucide-react";

export default function MissionVision() {
  return (
    <section className="relative overflow-hidden bg-[#06271F] py-28">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent_60%)]" />

      <div className="relative max-w-[1350px] mx-auto px-8 lg:px-16 xl:px-20">

        {/* Heading */}

        <div className="text-center">

          <p className="uppercase tracking-[0.38em] text-[12px] font-semibold text-[#C8A85D]">
            OUR MISSION & VISION
          </p>

          <div className="flex justify-center items-center mt-5">

            <div className="w-16 h-px bg-[#C8A85D]" />

            <div className="w-2.5 h-2.5 rotate-45 bg-[#C8A85D] mx-3" />

            <div className="w-16 h-px bg-[#C8A85D]" />

          </div>

        </div>

        {/* Content */}

        <div className="relative grid lg:grid-cols-2 gap-28 mt-24">

          {/* Vertical Divider */}

          <div className="hidden lg:block absolute left-1/2 top-0 -translate-x-1/2 h-full">

            <div className="relative h-full">

              <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-[#D4AF37]/20" />

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-[#D4AF37]" />

            </div>

          </div>

          {/* Mission */}

          <div className="text-center lg:pr-14">

            <div className="mx-auto w-24 h-24 rounded-full border border-[#D4AF37]/25 bg-[#083328] flex items-center justify-center">

              <Target
                size={42}
                strokeWidth={1.5}
                className="text-[#D4AF37]"
              />

            </div>

            <h3 className="mt-10 font-playfair text-[40px] text-white">
              Our Mission
            </h3>

            <p className="mt-8 max-w-[430px] mx-auto text-[17px] leading-9 text-white/70">
              To simplify real estate decisions by offering curated
              properties, expert insights and transparent advisory,
              creating exceptional value for every client while
              building relationships founded on trust.
            </p>

          </div>

          {/* Vision */}

          <div className="text-center lg:pl-14">

            <div className="mx-auto w-24 h-24 rounded-full border border-[#D4AF37]/25 bg-[#083328] flex items-center justify-center">

              <Eye
                size={42}
                strokeWidth={1.5}
                className="text-[#D4AF37]"
              />

            </div>

            <h3 className="mt-10 font-playfair text-[40px] text-white">
              Our Vision
            </h3>

            <p className="mt-8 max-w-[430px] mx-auto text-[17px] leading-9 text-white/70">
              To become India's most trusted luxury real estate
              advisory platform, recognised for integrity,
              intelligence and delivering confidence in every
              property journey.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}