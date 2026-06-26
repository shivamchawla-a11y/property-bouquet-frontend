"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Building2,
  LineChart,
  Database,
  ShieldCheck,
} from "lucide-react";

export default function HeroSectionInsights() {
  return (
    <section className="relative overflow-hidden bg-[#050608]">

      {/* ================= BACKGROUND GLOW ================= */}

      <div className="absolute -top-44 -left-44 w-[520px] h-[520px] rounded-full bg-[#C89D58]/10 blur-[150px]" />

      <div className="absolute right-[-180px] top-[15%] w-[480px] h-[480px] rounded-full bg-[#244768]/15 blur-[170px]" />

      {/* ================= GRID PATTERN ================= */}

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      {/* ================= DARK OVERLAY ================= */}

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      {/* ================= CONTAINER ================= */}

      <div className="relative z-20 max-w-[1500px] mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-[1fr_.95fr] gap-16 items-center py-24 lg:py-28">

          {/* ================= LEFT CONTENT ================= */}

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .8 }}
          >

            {/* Breadcrumb */}

            <div className="flex items-center gap-3 text-sm text-white/45">

              <Link
                href="/"
                className="hover:text-[#C89D58] transition"
              >
                Home
              </Link>

              <ChevronRight size={14} />

              <span className="text-white">
                Property Insights
              </span>

            </div>

            {/* Small Badge */}

            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#C89D58]/20 bg-white/[0.04] px-5 py-2">

              <div className="relative">

                <div className="w-2.5 h-2.5 rounded-full bg-[#C89D58]" />

                <div className="absolute inset-0 rounded-full bg-[#C89D58] animate-ping opacity-60" />

              </div>

              <span className="uppercase tracking-[3px] text-[11px] font-semibold text-[#C89D58]">

                Knowledge Centre

              </span>

            </div>

            {/* Heading */}

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: .15,
                duration: .8,
              }}
              className="
              mt-8
              text-5xl
              md:text-6xl
              xl:text-7xl
              leading-none
              tracking-[-2px]
              text-white
              "
              style={{
                fontFamily:
                  "Georgia, Times New Roman, serif",
              }}
            >
              Property

              <br />

              <span className="text-[#D7B16B]">
                Insights
              </span>

            </motion.h1>

            {/* Gold Accent */}

            <div className="mt-6 w-24 h-[2px] bg-[#C89D58]" />

            {/* Description */}

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: .25,
                duration: .8,
              }}
              className="
              mt-8
              max-w-[560px]
              text-[17px]
              leading-8
              text-white/65
              "
            >
              Stay informed with the latest luxury real estate news,
              investment trends, market intelligence, infrastructure
              developments and expert insights that empower smarter
              property decisions.
            </motion.p>

          </motion.div>

          {/* ================= RIGHT SIDE ================= */}

<motion.div
  initial={{
    opacity: 0,
    x: 50,
  }}
  animate={{
    opacity: 1,
    x: 0,
  }}
  transition={{
    duration: .9,
  }}
  className="relative"
>

  {/* Main Image */}

  <div className="relative overflow-hidden rounded-[36px] border border-white/10 shadow-[0_35px_90px_rgba(0,0,0,.45)]">

    <img
      src="/hero-img.png"
      alt="Property Insights"
      className="
      w-full
      h-[520px]
      lg:h-[560px]
      object-cover
      object-center
      transition-transform
      duration-700
      hover:scale-105
      "
    />

    {/* Top Overlay */}

    <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/15" />

    {/* Bottom Overlay */}

    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

    {/* Luxury Shadow */}

    <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,.35)]" />

  </div>

  {/* Floating Label */}

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
      delay: .4,
      duration: .6,
    }}
    className="
    absolute
    top-8
    right-8
    rounded-full
    border
    border-white/10
    bg-black/50
    backdrop-blur-xl
    px-6
    py-3
    "
  >

    <p className="text-[11px] uppercase tracking-[2px] text-white/90">

      Luxury Real Estate Intelligence

    </p>

  </motion.div>

  {/* Floating Stats Card */}

  <motion.div
    initial={{
      opacity: 0,
      y: 25,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    transition={{
      delay: .55,
      duration: .7,
    }}
    className="
    absolute
    left-8
    bottom-8
    rounded-[24px]
    border
    border-white/10
    bg-black/55
    backdrop-blur-xl
    px-7
    py-6
    max-w-[240px]
    "
  >

    <p className="text-4xl font-semibold text-[#D7B16B]">

      +12%

    </p>

    <p className="mt-2 text-white font-medium">

      Market Appreciation

    </p>

    <p className="mt-1 text-sm leading-6 text-white/60">

      Premium residential corridors continue to outperform with
      sustained demand and infrastructure-led growth.

    </p>

  </motion.div>

  {/* Decorative Ring */}

  <div
    className="
    absolute
    -bottom-12
    -right-12
    w-40
    h-40
    rounded-full
    border
    border-[#C89D58]/15
    "
  />

  <div
    className="
    absolute
    -bottom-6
    -right-6
    w-24
    h-24
    rounded-full
    border
    border-[#C89D58]/20
    "
  />

</motion.div>

        </div>

        {/* ================= FEATURES ================= */}

{(() => {
  const features = [
    {
      title: "Market Updates",
      description: "Timely & relevant information",
      icon: Building2,
    },
    {
      title: "Expert Analysis",
      description: "Actionable insights from experts",
      icon: LineChart,
    },
    {
      title: "Data-Driven",
      description: "Trusted data and market reports",
      icon: Database,
    },
    {
      title: "Informed Decisions",
      description: "Insights that help you stay ahead",
      icon: ShieldCheck,
    },
  ];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 35,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: .45,
        duration: .8,
      }}
      className="
      mt-8
      lg:mt-12
      border-t
      border-white/10
      pt-10
      "
    >

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

        {features.map((item) => {

          const Icon = item.icon;

          return (

            <motion.div
              key={item.title}
              whileHover={{
                y: -6,
              }}
              transition={{
                duration: .25,
              }}
              className="
              group
              flex
              items-start
              gap-5
              rounded-2xl
              border
              border-white/10
              bg-white/[0.02]
              px-6
              py-6
              transition-all
              duration-300
              hover:border-[#C89D58]/30
              hover:bg-white/[0.04]
              "
            >

              {/* Icon */}

              <div
                className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#C89D58]/20
                bg-[#C89D58]/10
                transition-all
                duration-300
                group-hover:bg-[#C89D58]/20
                "
              >

                <Icon
                  size={24}
                  className="text-[#D7B16B]"
                />

              </div>

              {/* Content */}

              <div>

                <h3
                  className="
                  text-white
                  font-semibold
                  text-[17px]
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                  mt-2
                  text-sm
                  leading-6
                  text-white/60
                  "
                >
                  {item.description}
                </p>

              </div>

            </motion.div>

          );

        })}

      </div>

    </motion.div>
  );
})()}

      </div>

    </section>
  );
}