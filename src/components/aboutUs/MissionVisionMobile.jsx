"use client";

import { Target, Eye } from "lucide-react";

export default function MissionVisionMobile() {
  return (
    <section className="relative overflow-hidden bg-[#06271F] py-20">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_70%)]" />

      <div className="relative px-6">

        {/* Heading */}

        <div className="text-center">

          <p className="uppercase tracking-[0.35em] text-[11px] font-semibold text-[#C8A85D]">
            OUR MISSION & VISION
          </p>

          <div className="flex justify-center items-center mt-5">

            <div className="w-10 h-px bg-[#C8A85D]" />

            <div className="w-2 h-2 rotate-45 bg-[#C8A85D] mx-3" />

            <div className="w-10 h-px bg-[#C8A85D]" />

          </div>

        </div>

        {/* Cards */}

        <div className="mt-14 space-y-8">

          {/* Mission */}

          <div className="relative rounded-[28px] border border-[#D4AF37]/20 bg-white/[0.03] backdrop-blur-sm px-7 py-10 text-center">

            <div className="mx-auto w-20 h-20 rounded-full border border-[#D4AF37]/30 bg-[#083328] flex items-center justify-center">

              <Target
                size={34}
                strokeWidth={1.6}
                className="text-[#D4AF37]"
              />

            </div>

            <h3 className="mt-7 font-playfair text-[30px] text-white">
              Our Mission
            </h3>

            <div className="w-12 h-px bg-[#D4AF37]/50 mx-auto mt-5" />

            <p className="mt-6 text-[15px] leading-8 text-white/70">
              To simplify real estate decisions by offering curated
              properties, expert insights and transparent advisory,
              creating exceptional value for every client while
              building relationships founded on trust.
            </p>

          </div>

          {/* Vision */}

          <div className="relative rounded-[28px] border border-[#D4AF37]/20 bg-white/[0.03] backdrop-blur-sm px-7 py-10 text-center">

            <div className="mx-auto w-20 h-20 rounded-full border border-[#D4AF37]/30 bg-[#083328] flex items-center justify-center">

              <Eye
                size={34}
                strokeWidth={1.6}
                className="text-[#D4AF37]"
              />

            </div>

            <h3 className="mt-7 font-playfair text-[30px] text-white">
              Our Vision
            </h3>

            <div className="w-12 h-px bg-[#D4AF37]/50 mx-auto mt-5" />

            <p className="mt-6 text-[15px] leading-8 text-white/70">
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