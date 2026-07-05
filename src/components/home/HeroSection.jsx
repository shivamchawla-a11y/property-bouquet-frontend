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
import Image from "next/image";

import { motion } from "framer-motion";
import SearchPanel from "./SearchPanel";
import Container from "@/components/layout/Container";

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
    <section className="relative h-screen min-h-[760px] xl:min-h-[820px] overflow-visible bg-black">

      {/* BACKGROUND IMAGE */}

<Image
  src="/bg-img.webp"
  alt="Luxury Property"
  fill
  priority
  quality={85}
  sizes="100vw"
  className="object-cover scale-[1.02]"
/>

      {/* OVERLAYS */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/20 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

      {/* GOLD GLOW */}
      <div className="absolute left-[12%] top-[28%] w-[420px] h-[420px] bg-[#c89d58]/10 blur-[120px] rounded-full" />

      {/* CONTENT */}
      <div className="relative z-20 h-full flex items-center">

  <Container>

    {/* LEFT CONTENT */}

    <div className="max-w-[620px] -mt-24 xl:-mt-28">

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
              className="text-white font-medium leading-[1.05] tracking-[-1.5px] text-[40px] md:text-[52px] xl:text-[60px]"
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
            </Container>
  </div>

{/* SEARCH PANEL */}
<div className="absolute bottom-12 left-0 w-full z-[200] overflow-visible">
  <Container className="overflow-visible">
    <SearchPanel />
  </Container>
</div>

    </section>
  );
}