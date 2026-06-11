"use client";

import {
  Search,
  Play,
  Building2,
  SlidersHorizontal,
  MapPin,
  Target,
  ChevronDown,
} from "lucide-react";

import { motion } from "framer-motion";

const filters = [
  {
    icon: Building2,
    title: "PROPERTY TYPE",
    value: "Select Type",
  },
  {
    icon: SlidersHorizontal,
    title: "BUDGET RANGE",
    value: "Select Budget",
  },
  {
    icon: MapPin,
    title: "LOCATION",
    value: "Select Location",
  },
  {
    icon: Target,
    title: "INVESTMENT GOAL",
    value: "Select Goal",
  },
];

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[820px] overflow-hidden bg-black">

      {/* BACKGROUND IMAGE */}
      <img
        src="/bg-img.png"
        alt="Luxury"
        className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
      />

      {/* OVERLAYS */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/20 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

      {/* GOLD GLOW */}
      <div className="absolute left-[12%] top-[28%] w-[420px] h-[420px] bg-[#c89d58]/10 blur-[120px] rounded-full" />

      {/* CONTENT */}
      <div className="relative z-20 h-full flex items-center">

        <div className="max-w-[1400px] mx-auto w-full px-6 xl:px-10">

          {/* LEFT CONTENT */}
          <div className="max-w-[620px] -mt-20">

            {/* TOP TEXT */}
            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="text-[#c89d58] uppercase tracking-[3px] text-[11px] font-semibold mb-5"
            >
              CURATED FOR GENERATIONS OF WEALTH
            </motion.p>

            {/* HEADING */}
            <motion.h1
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              className="text-white font-medium leading-[1.02] tracking-[-2px] text-[44px] md:text-[58px] xl:text-[66px]"
              style={{
                fontFamily:
                  "Georgia, Times New Roman, serif",
              }}
            >
              Curating India’s Most

              <br />

              <span className="text-[#c89d58]">
                Intelligent Luxury Assets
              </span>
            </motion.h1>

            {/* DESCRIPTION */}
            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
              }}
              className="mt-6 text-white/75 text-[15px] leading-[1.95] max-w-[560px]"
            >
              Institutional-grade advisory for
              ultra-premium residences,
              branded developments, and legacy
              investments across India & Dubai.
            </motion.p>

            {/* BUTTON */}
            <motion.button
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.9,
              }}
              className="mt-10 flex items-center gap-4 group"
            >

              {/* PLAY ICON */}
              <div className="relative">

                {/* GLOW */}
                <div className="absolute inset-0 rounded-full bg-[#c89d58]/30 blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />

                <div className="relative w-[54px] h-[54px] rounded-full border border-[#c89d58]/70 bg-white/5 backdrop-blur-md flex items-center justify-center text-[#c89d58] group-hover:bg-[#c89d58] group-hover:text-black transition-all duration-500">

                  <Play
                    size={16}
                    fill="currentColor"
                    className="ml-[2px]"
                  />
                </div>
              </div>

              {/* TEXT */}
              <span className="text-[#d3ae69] tracking-[1px] text-[13px] font-semibold">
                DISCOVER OUR APPROACH
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* SEARCH PANEL */}
      <div className="absolute bottom-12 left-0 w-full z-40 px-5">

        <div className="max-w-[1120px] mx-auto">

          <motion.div
            initial={{
              opacity: 0,
              y: 45,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
            }}
            className="
              relative
              rounded-[26px]
              overflow-hidden
              border border-white/15
              bg-white/[0.08]
              backdrop-blur-[30px]
              shadow-[0_25px_80px_rgba(0,0,0,0.55)]
              before:absolute
              before:inset-0
              before:bg-gradient-to-br
              before:from-white/10
              before:via-white/[0.03]
              before:to-transparent
              before:pointer-events-none
            "
          >

            {/* OUTER GLOW */}
            <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-[#c89d58]/30 via-white/10 to-[#c89d58]/20 blur-xl opacity-60" />

            {/* INNER SHINE */}
            <div className="absolute top-0 left-[-120%] w-[40%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] animate-[shine_7s_linear_infinite]" />

            {/* GRID */}
            <div className="relative z-20 grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.15fr_1fr_88px]">

              {filters.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className={`group flex items-center gap-4 px-6 py-5 transition-all duration-300 hover:bg-white/[0.03] ${
                      index !== filters.length - 1
                        ? "lg:border-r border-white/10"
                        : ""
                    }`}
                  >

                    {/* ICON */}
                    <div className="relative shrink-0">

                      {/* ICON GLOW */}
                      <div className="absolute inset-0 bg-[#c89d58]/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition duration-500" />

                      <div className="relative w-10 h-10 rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-xl flex items-center justify-center">
 
                        <Icon
                          size={18}
                          className="text-[#d4ae67]"
                        />
                      </div>
                    </div>

                    {/* TEXT */}
                    <div className="flex-1 min-w-0">

                      <p className="text-[8px] uppercase tracking-[2px] text-white/40 font-semibold mb-1">
                        {item.title}
                      </p>

                      <button className="flex items-center gap-2 text-white text-[13px] font-medium">

                        {item.value}

                        <ChevronDown
                          size={13}
                          className="text-[#c89d58]"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* SEARCH BUTTON */}
              <button className="relative overflow-hidden bg-gradient-to-b from-[#e3c176] to-[#c39031] hover:brightness-110 transition-all duration-300 flex items-center justify-center group">

                {/* BUTTON GLOW */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition duration-300" />

                <div className="relative flex items-center justify-center h-full min-h-[84px] w-full">

                  <Search
                    size={26}
                    className="text-black group-hover:scale-110 transition duration-300"
                    strokeWidth={2.5}
                  />
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}