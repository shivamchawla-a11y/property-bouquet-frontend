"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";
import SearchPanel from "./SearchPanel";

export default function HeroSectionMobile() {
return ( <section className="relative min-h-screen overflow-hidden">

  {/* BACKGROUND */}
  <img
    src="/bg-img.png"
    alt="Luxury"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* OVERLAYS */}
  <div className="absolute inset-0 bg-black/65" />

  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/90" />

  {/* GOLD GLOW */}
  <div
    className="
      absolute
      top-[15%]
      left-[-20%]
      w-[250px]
      h-[250px]
      rounded-full
      bg-[#c89d58]/15
      blur-[90px]
    "
  />

  {/* CONTENT */}
  <div
    className="
      relative
      z-20
      px-6
      pt-[120px]
      pb-[320px]
    "
  >
    {/* TAG */}
    <motion.div
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
      className="
        inline-flex
        items-center
        px-4
        py-2
        rounded-full
        border
        border-[#c89d58]/30
        bg-white/5
        backdrop-blur-xl
      "
    >
      <span
        className="
          text-[#c89d58]
          text-[10px]
          tracking-[3px]
          uppercase
          font-semibold
        "
      >
        Curated For Generations Of Wealth
      </span>
    </motion.div>

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
        duration: 0.8,
      }}
      className="
        mt-8
        text-white
        text-[38px]
        leading-[1.05]
        tracking-[-1.5px]
        font-medium
      "
      style={{
        fontFamily:
          "Georgia, Times New Roman, serif",
      }}
    >
      Curating India’s Most

      <span className="block text-[#c89d58] mt-2">
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
        duration: 1,
      }}
      className="
        mt-6
        text-white/75
        text-[14px]
        leading-[1.9]
      "
    >
      Institutional-grade advisory for
      ultra-premium residences,
      branded developments and
      legacy investments across
      India & Dubai.
    </motion.p>

    {/* CTA */}
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
        duration: 1.1,
      }}
      className="
        mt-8
        flex
        items-center
        gap-4
      "
    >
      <div
        className="
          w-12
          h-12
          rounded-full
          border
          border-[#c89d58]/70
          flex
          items-center
          justify-center
          text-[#c89d58]
          bg-white/5
          backdrop-blur-xl
        "
      >
        <Play
          size={14}
          fill="currentColor"
          className="ml-[2px]"
        />
      </div>

      <span
        className="
          text-[#d3ae69]
          text-[12px]
          font-semibold
          tracking-[1px]
        "
      >
        DISCOVER OUR APPROACH
      </span>
    </motion.button>
  </div>

  {/* SEARCH PANEL */}
  <div
    className="
      absolute
      left-4
      right-4
      bottom-6
      z-30
    "
  >
    <SearchPanel />
  </div>
</section>

);
}
