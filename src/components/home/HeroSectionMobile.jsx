"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";
import SearchPanelMobile from "./SearchPanelMobile";
import Image from "next/image";

export default function HeroSectionMobile() {
  return (
    <section className="relative min-h-screen overflow-hidden lg:hidden">
      {/* BACKGROUND */}
      
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
      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-black/10" />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* GOLD GLOW */}
      <div className="absolute top-[18%] left-[-20%] w-[280px] h-[280px] bg-[#c89d58]/20 blur-[120px] rounded-full" />

      {/* CONTENT */}
      <div className="relative z-20 flex flex-col justify-between min-h-screen px-6 pt-[110px] pb-8">
        {/* TOP CONTENT */}
        <div>
          {/* BADGE */}
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
              gap-2
              px-4
              py-2
              rounded-full
              border
              border-[#c89d58]/20
              bg-white/5
              backdrop-blur-xl
            "
          >
            <div className="w-2 h-2 rounded-full bg-[#c89d58]" />

            <span
              className="
                text-[#d6b06a]
                text-[10px]
                tracking-[2px]
                uppercase
                font-semibold
              "
            >
              Curated For Generational Wealth
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
              text-[42px]
              leading-[1.02]
              tracking-[-2px]
              font-medium
            "
            style={{
              fontFamily:
                "Georgia, Times New Roman, serif",
            }}
          >
            Curating India's Most

            <span className="block text-[#c89d58] mt-2">
              Intelligent
            </span>

            <span className="block">
              Luxury Assets
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
              max-w-[340px]
            "
          >
            Institutional-grade advisory for
            ultra-premium residences,
            branded developments and legacy
            investments across India.
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
              group
            "
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#c89d58]/30 blur-xl opacity-0 group-hover:opacity-100 transition" />

              <div
                className="
                  relative
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
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
            duration: 0.8,
          }}
          className="mt-10"
        >
          <SearchPanelMobile />
        </motion.div>
      </div>
    </section>
  );
}