"use client";

import {
  Award,
  Building2,
  TrendingUp,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";

/* ============================================================
   ICONS
============================================================ */

const STAT_ICONS = [
  Trophy,
  Building2,
  Award,
  TrendingUp,
  ShieldCheck,
];

/* ============================================================
   COMPONENT
============================================================ */

export default function DeveloperStats({
  developer,
  pageContent = {},
}) {
  if (!developer) {
    return null;
  }

  const stats = pageContent?.stats || {};

  /*
    IMPORTANT:

    There was no separate public Stats section in the
    previous developer page.

    Therefore:

    CMS stats exist
      ↓
    Render the new section

    CMS stats do not exist
      ↓
    Return null

    This prevents old developer pages from changing
    unexpectedly.
  */

  const items = Array.isArray(stats.items)
    ? stats.items.filter(
        (item) =>
          item &&
          (
            String(item.label || "").trim() ||
            String(item.value || "").trim()
          )
      )
    : [];

  if (!stats.enabled || items.length === 0) {
    return null;
  }

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#f7f3ec]
        py-20
        md:py-24
      "
    >
      {/* ==================================================
          BACKGROUND DECORATION
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-0
          h-[420px]
          w-[420px]
          rounded-full
          bg-[#D4AF37]/10
          blur-[120px]
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-0
          h-[420px]
          w-[420px]
          rounded-full
          bg-[#0B221B]/10
          blur-[120px]
        "
        aria-hidden="true"
      />

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1450px]
          px-6
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mx-auto max-w-3xl text-center">
          <span
            className="
              inline-flex
              items-center
              rounded-full
              bg-[#0B221B]
              px-5
              py-2
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.28em]
              text-[#D4AF37]
            "
          >
            Developer Highlights
          </span>

          <h2
            className="
              mt-6
              font-playfair
              text-4xl
              font-medium
              leading-tight
              text-[#0B221B]
              md:text-5xl
            "
          >
            {developer.name}
          </h2>

          <div
            className="
              mx-auto
              mt-6
              h-[2px]
              w-24
              bg-[#D4AF37]
            "
            aria-hidden="true"
          />
        </div>

        {/* ==================================================
            STATS GRID
        ================================================== */}

        <div
          className={`
            mx-auto
            mt-14
            grid
            max-w-[1200px]
            gap-5

            ${
              items.length === 1
                ? "max-w-[500px] grid-cols-1"
                : items.length === 2
                ? "md:grid-cols-2"
                : items.length === 3
                ? "md:grid-cols-3"
                : items.length === 4
                ? "md:grid-cols-2 xl:grid-cols-4"
                : "md:grid-cols-2 xl:grid-cols-5"
            }
          `}
        >
          {items.map((item, index) => {
            const Icon =
              STAT_ICONS[
                index % STAT_ICONS.length
              ];

            const value =
              typeof item.value === "string"
                ? item.value.trim()
                : item.value ?? "";

            const label =
              typeof item.label === "string"
                ? item.label.trim()
                : item.label ?? "";

            return (
              <motion.div
                key={`${label}-${index}`}
                initial={{
                  opacity: 0,
                  y: 20,
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
                  duration: 0.45,
                  delay: index * 0.06,
                }}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-[#e6dccb]
                  bg-white
                  p-7
                  shadow-[0_18px_55px_rgba(0,0,0,0.06)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_25px_65px_rgba(0,0,0,0.10)]
                "
              >
                {/* GOLD ACCENT */}

                <div
                  className="
                    absolute
                    left-0
                    top-0
                    h-1
                    w-full
                    bg-gradient-to-r
                    from-[#D4AF37]
                    to-[#B8862E]
                  "
                  aria-hidden="true"
                />

                {/* ICON */}

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#0B221B]
                    text-[#D4AF37]
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                >
                  <Icon
                    size={21}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                {/* VALUE */}

                <p
                  className="
                    mt-7
                    break-words
                    font-playfair
                    text-3xl
                    font-semibold
                    leading-tight
                    text-[#0B221B]
                    md:text-4xl
                  "
                >
                  {value}
                </p>

                {/* LABEL */}

                <p
                  className="
                    mt-3
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    leading-5
                    text-[#8b806f]
                  "
                >
                  {label}
                </p>

                {/* DECORATIVE GOLD DOT */}

                <div
                  className="
                    absolute
                    bottom-6
                    right-6
                    h-2
                    w-2
                    rounded-full
                    bg-[#D4AF37]/60
                  "
                  aria-hidden="true"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}