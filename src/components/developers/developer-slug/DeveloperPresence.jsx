"use client";

import { MapPin, ArrowUpRight } from "lucide-react";
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
   COMPONENT
============================================================ */

export default function DeveloperPresence({
  developer,
  pageContent = {},
}) {
  const section = pageContent?.presence;

  /*
    Presence is a NEW CMS section.

    There was no previous hardcoded Presence section that
    needs to be preserved.

    Therefore:

    CMS disabled → hidden
    CMS empty → hidden
    CMS populated → shown
  */

  if (!section || section.enabled === false) {
    return null;
  }

  /* ==========================================================
      NORMALIZE VALUES
  ========================================================== */

  const eyebrow =
    typeof section.eyebrow === "string"
      ? section.eyebrow.trim()
      : "";

  const title =
    typeof section.title === "string"
      ? section.title.trim()
      : "";

  const description = normalizeRichText(
    section.description || ""
  );

  /*
    Do not render an empty section.
  */

  if (!eyebrow && !title && !description) {
    return null;
  }

  /* ==========================================================
      FALLBACK DISPLAY LABELS
  ========================================================== */

  const displayEyebrow =
    eyebrow || "Market Presence";

  const displayTitle =
    title ||
    `${developer?.name || "Developer"} Market Presence`;

  const developerName =
    developer?.name ||
    "Developer Presence";

  /* ==========================================================
      RENDER
  ========================================================== */

  return (
    <section
      id="presence"
      className="
        relative
        overflow-hidden
        bg-[#17342d]
        py-16
        sm:py-20
        lg:py-24
      "
    >
      {/* ====================================================
          DECORATIVE ELEMENTS
      ==================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-72
          w-72
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
          -bottom-32
          -left-24
          h-80
          w-80
          rounded-full
          bg-white/5
          blur-3xl
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
          max-w-[1180px]
          px-5
          sm:px-8
          lg:px-10
        "
      >
        <div
          className="
            grid
            grid-cols-1
            items-center
            gap-10
            lg:grid-cols-[0.8fr_1.2fr]
            lg:gap-16
          "
        >
          {/* ==================================================
              LEFT
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -20,
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
            }}
          >
            {/* EYEBROW */}

            <div
              className="
                mb-5
                flex
                items-center
                gap-3
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.24em]
                text-[#D8B66E]
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

              {displayEyebrow}
            </div>

            {/* TITLE */}

            <h2
              className="
                max-w-xl
                font-playfair
                text-3xl
                font-medium
                leading-[1.08]
                text-white
                sm:text-4xl
                lg:text-[46px]
              "
            >
              {displayTitle}
            </h2>

            {/* DEVELOPER NAME */}

            <div
              className="
                mt-6
                flex
                items-center
                gap-3
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[#D8B66E]
              "
            >
              <span
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#C89D58]/30
                  bg-white/5
                "
              >
                <MapPin
                  size={16}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>

              {developerName}
            </div>
          </motion.div>

          {/* ==================================================
              RIGHT CONTENT
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 20,
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
            }}
            className="
              rounded-[28px]
              border
              border-white/10
              bg-white/[0.045]
              p-6
              shadow-[0_20px_60px_rgba(0,0,0,0.12)]
              backdrop-blur-md
              sm:p-8
              lg:p-10
            "
          >
            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            {description && (
              <div
                className="
                  text-[13px]
                  leading-[1.9]
                  text-white/70

                  [&_p]:m-0
                  [&_p]:mb-4
                  [&_p:last-child]:mb-0

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
                  [&_ul]:list-disc
                  [&_ul]:pl-5

                  [&_ol]:my-4
                  [&_ol]:list-decimal
                  [&_ol]:pl-5

                  [&_li]:mb-1.5

                  [&_h1]:mb-3
                  [&_h1]:font-playfair
                  [&_h1]:text-2xl
                  [&_h1]:font-medium
                  [&_h1]:text-white

                  [&_h2]:mb-3
                  [&_h2]:font-playfair
                  [&_h2]:text-xl
                  [&_h2]:font-medium
                  [&_h2]:text-white

                  [&_h3]:mb-2
                  [&_h3]:font-playfair
                  [&_h3]:text-lg
                  [&_h3]:font-medium
                  [&_h3]:text-white

                  [&_h4]:mb-2
                  [&_h4]:font-semibold
                  [&_h4]:text-white

                  [&_blockquote]:my-5
                  [&_blockquote]:border-l-2
                  [&_blockquote]:border-[#C89D58]
                  [&_blockquote]:pl-4
                  [&_blockquote]:italic
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
            )}

            {/* ==================================================
                FOOTER LINE
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
              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-white/40
                "
              >
                Property Bouquet
              </span>

              <ArrowUpRight
                size={18}
                className="text-[#C89D58]"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}