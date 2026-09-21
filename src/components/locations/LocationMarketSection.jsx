"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Map,
  Compass,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

const points = [
  {
    icon: Map,
    number: "01",
    title: "Established Micro-Markets",
    text: "Explore established residential neighbourhoods with mature social infrastructure, seamless connectivity and a diverse property ecosystem.",
  },
  {
    icon: Compass,
    number: "02",
    title: "Emerging Corridors",
    text: "Discover developing locations shaped by major roads, expressways and upcoming infrastructure corridors.",
  },
  {
    icon: Building2,
    number: "03",
    title: "Premium Developments",
    text: "Browse distinguished residential projects across apartments, floors, plots and other premium real estate categories.",
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Market Intelligence",
    text: "Understand individual micro-markets through property availability, developers, projects and location-specific insights.",
  },
];

export default function LocationMarketSection() {
  return (
    <section className="relative overflow-hidden bg-[#0b1915] py-24 md:py-32 lg:py-36">
      {/* =========================================================
          BACKGROUND ATMOSPHERE
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        {/* Gold glow */}
        <div className="absolute -right-[180px] -top-[180px] h-[520px] w-[520px] rounded-full bg-[#c89d58]/[0.08] blur-[140px]" />

        {/* Green glow */}
        <div className="absolute -bottom-[220px] -left-[180px] h-[500px] w-[500px] rounded-full bg-[#1f5a46]/[0.12] blur-[150px]" />

        {/* Fine vertical light */}
        <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.035] to-transparent" />

        {/* Subtle top border */}
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c89d58]/30 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
        {/* =========================================================
            INTRO
        ========================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mb-16 max-w-[900px] text-center md:mb-20"
        >
          {/* Eyebrow */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-[#c89d58]/50" />

            <p className="text-[9px] font-semibold uppercase tracking-[3.5px] text-[#d0a75f]">
              THE PROPERTY BOUQUET LOCATION GUIDE
            </p>

            <span className="h-px w-8 bg-[#c89d58]/50" />
          </div>

          {/* Heading */}
          <h2
            className="text-[36px] leading-[1.08] tracking-[-0.02em] text-white sm:text-[46px] md:text-[56px] lg:text-[62px]"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
            }}
          >
            Navigate Gurgaon&apos;s
            <br />

            <span className="relative inline-block text-[#d0a75f]">
              Real Estate Landscape
              <span className="absolute -bottom-2 left-1/2 h-px w-16 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#c89d58] to-transparent opacity-70" />
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-[680px] text-[13px] leading-[1.9] text-white/50 sm:text-[14px] md:text-[15px]">
            From established city neighbourhoods to emerging expressway
            corridors, explore the locations that shape Gurgaon&apos;s
            residential real estate market.
          </p>
        </motion.div>

        {/* =========================================================
            FEATURE GRID
        ========================================================= */}

        <div className="relative">
          {/* Outer frame */}
          <div className="overflow-hidden rounded-[30px] border border-[#c89d58]/20 bg-[#10231d]/70 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4">
              {points.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{
                      opacity: 0,
                      y: 24,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group relative min-h-[315px] overflow-hidden border-b border-white/[0.07] bg-[#10231d]/80 p-7 transition-all duration-500 hover:bg-[#142b23] md:p-8 lg:min-h-[340px] lg:border-b-0 lg:border-r lg:last:border-r-0"
                  >
                    {/* Hover glow */}
                    <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#c89d58]/0 blur-[60px] transition-all duration-700 group-hover:bg-[#c89d58]/10" />

                    {/* Top line */}
                    <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c89d58]/0 to-transparent transition-all duration-500 group-hover:via-[#c89d58]/60" />

                    {/* Number */}
                    <div className="absolute right-7 top-7 text-[10px] font-medium tracking-[2px] text-white/20 transition-colors duration-500 group-hover:text-[#c89d58]/50">
                      {item.number}
                    </div>

                    {/* Icon */}
                    <div className="relative mb-9">
                      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#c89d58]/25 bg-[#c89d58]/[0.07] transition-all duration-500 group-hover:border-[#c89d58]/50 group-hover:bg-[#c89d58]/[0.13] group-hover:shadow-[0_0_30px_rgba(200,157,88,0.10)]">
                        <Icon
                          size={19}
                          strokeWidth={1.4}
                          className="text-[#d0a75f] transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      {/* Decorative ring */}
                      <div className="absolute -left-[5px] -top-[5px] h-[62px] w-[62px] rounded-full border border-[#c89d58]/0 transition-all duration-700 group-hover:border-[#c89d58]/15" />
                    </div>

                    {/* Title */}
                    <h3
                      className="max-w-[220px] text-[18px] leading-[1.35] text-white"
                      style={{
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",
                        fontWeight: 400,
                      }}
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-4 max-w-[255px] text-[12.5px] leading-[1.85] text-white/45 transition-colors duration-500 group-hover:text-white/55">
                      {item.text}
                    </p>

                    {/* Bottom accent */}
                    <div className="absolute bottom-7 left-7 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[2px] text-[#c89d58]/0 transition-all duration-500 group-hover:text-[#c89d58]/70 md:left-8">
                      <span>Explore</span>

                      <ArrowUpRight
                        size={12}
                        strokeWidth={1.5}
                        className="translate-y-1 opacity-0 transition-all duration-500 group-hover:translate-x-0.5 group-hover:translate-y-0 group-hover:opacity-100"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bottom decorative line */}
          <div className="mx-auto mt-7 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#c89d58]/30" />
            <span className="h-1 w-1 rotate-45 border border-[#c89d58]/50" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#c89d58]/30" />
          </div>
        </div>
      </div>
    </section>
  );
}