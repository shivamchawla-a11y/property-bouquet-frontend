"use client";

import {
  Building2,
  SlidersHorizontal,
  MapPin,
  Target,
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
    <section
      className="
        relative
        h-screen
        min-h-[700px]
        sm:min-h-[740px]
        lg:min-h-[760px]
        xl:min-h-[800px]
        2xl:min-h-[820px]
        overflow-visible
        bg-black
      "
    >
      {/* =========================================================
          BACKGROUND IMAGE
      ========================================================= */}

      <Image
        src="/bg-img.webp"
        alt="Luxury Property"
        fill
        priority
        quality={85}
        sizes="100vw"
        className="
          object-cover
          object-center
          scale-[1.02]
        "
      />

      {/* =========================================================
          OVERLAYS
      ========================================================= */}

      <div className="absolute inset-0 bg-black/50" />

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-black/85
          via-black/20
          to-transparent
        "
      />

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/80
          via-transparent
          to-black/10
        "
      />

      {/* =========================================================
          GOLD GLOW
      ========================================================= */}

      <div
        className="
          absolute
          left-[8%]
          top-[25%]
          w-[300px]
          h-[300px]
          sm:left-[10%]
          sm:top-[27%]
          sm:w-[360px]
          sm:h-[360px]
          lg:left-[12%]
          lg:top-[28%]
          lg:w-[420px]
          lg:h-[420px]
          bg-[#c89d58]/10
          blur-[100px]
          lg:blur-[120px]
          rounded-full
          pointer-events-none
        "
      />

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <div
        className="
          relative
          z-20
          h-full
          flex
          items-center
        "
      >
        <Container>
          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}

          <div
            className="
              max-w-[560px]
              sm:max-w-[580px]
              lg:max-w-[620px]

              pt-16
              sm:pt-12
              md:pt-8
              lg:pt-0

              pb-32
              sm:pb-36
              lg:pb-40

              xl:-translate-y-3
              2xl:-translate-y-5
            "
          >
            {/* =================================================
                TOP TEXT
            ================================================= */}

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
              className="
                text-[#c89d58]
                uppercase
                tracking-[2.5px]
                sm:tracking-[3px]
                text-[10px]
                sm:text-[11px]
                font-semibold
                mb-4
                sm:mb-5
              "
            >
              CURATED FOR GENERATIONS OF WEALTH
            </motion.p>

            {/* =================================================
                HEADING
            ================================================= */}

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
              className="
                text-white
                font-medium
                leading-[1.06]
                tracking-[-1.2px]

                text-[38px]
                sm:text-[44px]
                md:text-[50px]
                lg:text-[54px]
                xl:text-[60px]

                max-w-[620px]
              "
              style={{
                fontFamily: "Georgia, Times New Roman, serif",
              }}
            >
              Curating India’s Most

              <br />

              <span className="text-[#c89d58]">
                Intelligent Luxury Assets
              </span>
            </motion.h1>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

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
              className="
                mt-5
                sm:mt-6

                text-white/75

                text-[13px]
                sm:text-[14px]
                lg:text-[15px]

                leading-[1.8]
                sm:leading-[1.9]
                lg:leading-[1.95]

                max-w-[500px]
                sm:max-w-[530px]
                lg:max-w-[560px]
              "
            >
              Institutional-grade advisory for ultra-premium residences,
              branded developments, and legacy investments across India.
            </motion.p>
          </div>
        </Container>
      </div>

      {/* =========================================================
    SEARCH PANEL
========================================================= */}

<div
  className="
    absolute
    bottom-10
    sm:bottom-11
    lg:bottom-12
    xl:bottom-14

    left-0
    w-full

    z-[200]

    overflow-visible
  "
>
  <Container className="overflow-visible">
    <SearchPanel />
  </Container>
</div>
    </section>
  );
}