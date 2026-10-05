"use client";

import {
  MapPin,
  ArrowUpRight,
  Building2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { motion } from "framer-motion";

/* ============================================================
   RICH TEXT HELPERS
============================================================ */

const normalizeRichText = (text) => {
  if (typeof text !== "string") return "";

  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/&#xA0;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/<p>\s*<\/p>/gi, "")
    .trim();
};

const hasRichText = (text) => {
  if (typeof text !== "string") return false;

  return /<\s*[a-z][^>]*>/i.test(text);
};

/* ============================================================
   SAFE VALUE HELPER
============================================================ */

const value = (customValue, fallback) => {
  return typeof customValue === "string" &&
    customValue.trim()
    ? customValue.trim()
    : fallback;
};

/* ============================================================
   COMPONENT
============================================================ */

export default function DeveloperPresence({
  developer,
  pageContent = {},
}) {
  const section = pageContent?.presence;

  /* ==========================================================
     CMS SECTION STATE
  ========================================================== */

  if (!section || section.enabled === false) {
    return null;
  }

  /* ==========================================================
     NORMALIZE CONTENT
  ========================================================== */

  const eyebrow = value(
    section?.eyebrow,
    "MARKET PRESENCE"
  );

  const title = value(
    section?.title,
    `${developer?.name || "Developer"} Market Presence`
  );

  const description = normalizeRichText(
    value(
      section?.description,
      ""
    )
  );

  /*
    There is no reason to render a completely empty section.
  */

  if (!eyebrow && !title && !description) {
    return null;
  }

  const developerName =
    developer?.name || "Developer";

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section
      id="presence"
      aria-labelledby="developer-presence-heading"
      className="
        relative
        overflow-hidden
        bg-[#17342d]
        py-14
        sm:py-16
        md:py-20
        lg:py-22
      "
    >
      {/* ====================================================
          BACKGROUND DECORATION
      ==================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-80
          w-80
          rounded-full
          bg-[#C89D58]/10
          blur-3xl
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-36
          -left-28
          h-96
          w-96
          rounded-full
          bg-white/[0.035]
          blur-3xl
        "
        aria-hidden="true"
      />

      {/* Fine architectural line */}

      <div
        className="
          pointer-events-none
          absolute
          right-[8%]
          top-0
          h-full
          w-px
          bg-gradient-to-b
          from-transparent
          via-[#C89D58]/10
          to-transparent
        "
        aria-hidden="true"
      />

      {/* ====================================================
          CONTENT
      ==================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-[1380px]
          px-5
          sm:px-7
          lg:px-10
        "
      >
        <div
          className="
            grid
            grid-cols-1
            items-center
            gap-9
            lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]
            lg:gap-14
            xl:gap-20
          "
        >
          {/* ==================================================
              LEFT — INTRODUCTION
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -22,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="
              relative
              max-w-[620px]
            "
          >
            {/* Small decorative number */}

            <div
              className="
                absolute
                -left-1
                -top-5
                hidden
                font-playfair
                text-[88px]
                font-medium
                leading-none
                text-white/[0.035]
                select-none
                lg:block
              "
              aria-hidden="true"
            >
              03
            </div>

            {/* EYEBROW */}

            <div
              className="
                relative
                mb-4
                flex
                items-center
                gap-3
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.24em]
                text-[#D8B66E]
                sm:text-[11px]
              "
            >
              <span
                className="
                  h-px
                  w-8
                  bg-[#C89D58]
                "
                aria-hidden="true"
              />

              <span>
                {eyebrow}
              </span>
            </div>

            {/* TITLE */}

            <h2
              id="developer-presence-heading"
              className="
                relative
                max-w-[600px]
                font-playfair
                text-[34px]
                font-medium
                leading-[1.08]
                tracking-[-0.02em]
                text-white
                sm:text-[40px]
                md:text-[44px]
                lg:text-[48px]
              "
            >
              {title}
            </h2>

            {/* GOLD ACCENT */}

            <div
              className="
                mt-5
                h-[2px]
                w-14
                bg-[#C89D58]
              "
              aria-hidden="true"
            />

            {/* DEVELOPER IDENTITY */}

            <div
              className="
                mt-7
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-white/10
                bg-white/[0.045]
                px-3
                py-2
                backdrop-blur-sm
              "
            >
              <span
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#C89D58]/30
                  bg-[#C89D58]/10
                  text-[#D8B66E]
                "
              >
                <MapPin
                  size={16}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>

              <div>
                <div
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-white/35
                  "
                >
                  Developer
                </div>

                <div
                  className="
                    mt-0.5
                    text-[12px]
                    font-medium
                    tracking-[0.02em]
                    text-white/85
                  "
                >
                  {developerName}
                </div>
              </div>
            </div>

            {/* MINI SUPPORTING LINE */}

            <div
              className="
                mt-7
                flex
                items-center
                gap-3
                text-[10px]
                uppercase
                tracking-[0.14em]
                text-white/35
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#C89D58]
                "
                aria-hidden="true"
              />

              <span>
                Development • Presence • Experience
              </span>
            </div>
          </motion.div>

          {/* ==================================================
              RIGHT — CONTENT PANEL
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 22,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
              delay: 0.08,
              ease: "easeOut",
            }}
            className="
              relative
            "
          >
            {/* Outer gold frame */}

            <div
              className="
                absolute
                -inset-[1px]
                rounded-[26px]
                bg-gradient-to-br
                from-[#C89D58]/30
                via-transparent
                to-white/5
                opacity-80
              "
              aria-hidden="true"
            />

            {/* MAIN CARD */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[26px]
                border
                border-white/10
                bg-white/[0.055]
                shadow-[0_24px_70px_rgba(0,0,0,0.18)]
                backdrop-blur-xl
              "
            >
              {/* Card glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  -top-16
                  h-48
                  w-48
                  rounded-full
                  bg-[#C89D58]/10
                  blur-3xl
                "
                aria-hidden="true"
              />

              {/* Content */}

              <div
                className="
                  relative
                  p-6
                  sm:p-8
                  lg:p-9
                  xl:p-10
                "
              >
                {/* TOP META */}

                <div
                  className="
                    mb-6
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-[#D8B66E]
                    "
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-[#C89D58]
                      "
                      aria-hidden="true"
                    />

                    Developer Overview
                  </div>

                  <Building2
                    size={18}
                    strokeWidth={1.35}
                    className="text-white/25"
                    aria-hidden="true"
                  />
                </div>

                {/* DESCRIPTION */}

                {description ? (
                  <div
                    className="
                      max-w-[760px]
                      break-words
                      text-[13px]
                      leading-[1.9]
                      text-white/70
                      [overflow-wrap:anywhere]
                      [word-break:break-word]

                      [&_*]:max-w-full

                      [&_p]:m-0
                      [&_p]:mb-4
                      [&_p:last-child]:mb-0

                      [&_p]:break-words
                      [&_p]:[overflow-wrap:anywhere]

                      [&_strong]:font-semibold
                      [&_strong]:text-white

                      [&_b]:font-semibold
                      [&_b]:text-white

                      [&_em]:italic

                      [&_u]:underline
                      [&_u]:underline-offset-2

                      [&_a]:font-medium
                      [&_a]:text-[#D8B66E]
                      [&_a]:underline
                      [&_a]:underline-offset-2

                      [&_ul]:my-4
                      [&_ul]:ml-5
                      [&_ul]:list-disc

                      [&_ol]:my-4
                      [&_ol]:ml-5
                      [&_ol]:list-decimal

                      [&_li]:mb-1.5

                      [&_h1]:mb-3
                      [&_h1]:mt-5
                      [&_h1]:font-playfair
                      [&_h1]:text-2xl
                      [&_h1]:font-medium
                      [&_h1]:leading-tight
                      [&_h1]:text-white

                      [&_h2]:mb-3
                      [&_h2]:mt-5
                      [&_h2]:font-playfair
                      [&_h2]:text-xl
                      [&_h2]:font-medium
                      [&_h2]:leading-tight
                      [&_h2]:text-white

                      [&_h3]:mb-2
                      [&_h3]:mt-4
                      [&_h3]:font-playfair
                      [&_h3]:text-lg
                      [&_h3]:font-medium
                      [&_h3]:leading-tight
                      [&_h3]:text-white

                      [&_h4]:mb-2
                      [&_h4]:mt-4
                      [&_h4]:font-semibold
                      [&_h4]:text-white

                      [&_blockquote]:my-5
                      [&_blockquote]:border-l-2
                      [&_blockquote]:border-[#C89D58]
                      [&_blockquote]:pl-4
                      [&_blockquote]:italic
                      [&_blockquote]:text-white/60

                      [&_img]:my-4
                      [&_img]:h-auto
                      [&_img]:max-w-full
                      [&_img]:rounded-xl
                    "
                  >
                    {hasRichText(description) ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: description,
                        }}
                      />
                    ) : (
                      <p>{description}</p>
                    )}
                  </div>
                ) : (
                  <p
                    className="
                      text-[13px]
                      leading-[1.9]
                      text-white/60
                    "
                  >
                    Discover the developer's market presence,
                    development philosophy and growing portfolio
                    through Property Bouquet.
                  </p>
                )}

                {/* ==================================================
                    FEATURE STRIP
                ================================================== */}

                <div
                  className="
                    mt-8
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-3
                  "
                >
                  {/* ITEM 1 */}

                  <div
                    className="
                      rounded-[16px]
                      border
                      border-white/8
                      bg-white/[0.035]
                      px-4
                      py-4
                    "
                  >
                    <ShieldCheck
                      size={17}
                      strokeWidth={1.5}
                      className="text-[#C89D58]"
                      aria-hidden="true"
                    />

                    <div
                      className="
                        mt-3
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.13em]
                        text-white/35
                      "
                    >
                      Profile
                    </div>

                    <div
                      className="
                        mt-1
                        text-[12px]
                        font-medium
                        text-white/80
                      "
                    >
                      Verified Developer
                    </div>
                  </div>

                  {/* ITEM 2 */}

                  <div
                    className="
                      rounded-[16px]
                      border
                      border-white/8
                      bg-white/[0.035]
                      px-4
                      py-4
                    "
                  >
                    <TrendingUp
                      size={17}
                      strokeWidth={1.5}
                      className="text-[#C89D58]"
                      aria-hidden="true"
                    />

                    <div
                      className="
                        mt-3
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.13em]
                        text-white/35
                      "
                    >
                      Presence
                    </div>

                    <div
                      className="
                        mt-1
                        text-[12px]
                        font-medium
                        text-white/80
                      "
                    >
                      Growing Portfolio
                    </div>
                  </div>

                  {/* ITEM 3 */}

                  <div
                    className="
                      rounded-[16px]
                      border
                      border-white/8
                      bg-white/[0.035]
                      px-4
                      py-4
                    "
                  >
                    <Building2
                      size={17}
                      strokeWidth={1.5}
                      className="text-[#C89D58]"
                      aria-hidden="true"
                    />

                    <div
                      className="
                        mt-3
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.13em]
                        text-white/35
                      "
                    >
                      Portfolio
                    </div>

                    <div
                      className="
                        mt-1
                        text-[12px]
                        font-medium
                        text-white/80
                      "
                    >
                      Property Collection
                    </div>
                  </div>
                </div>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div
                  className="
                    mt-7
                    flex
                    items-center
                    justify-between
                    gap-5
                    border-t
                    border-white/10
                    pt-5
                  "
                >
                  <div>
                    <div
                      className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-white/30
                      "
                    >
                      Presented by
                    </div>

                    <div
                      className="
                        mt-1
                        text-[11px]
                        font-medium
                        tracking-[0.04em]
                        text-white/65
                      "
                    >
                      Property Bouquet
                    </div>
                  </div>

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#C89D58]/25
                      bg-[#C89D58]/8
                    "
                  >
                    <ArrowUpRight
                      size={17}
                      className="text-[#C89D58]"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ====================================================
          BOTTOM TRANSITION
      ==================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-10
          w-full
          bg-gradient-to-t
          from-[#17342d]
          to-transparent
        "
        aria-hidden="true"
      />
    </section>
  );
}