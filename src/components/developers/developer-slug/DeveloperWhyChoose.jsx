"use client";

import {
  ShieldCheck,
  Award,
  Building2,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

const ICONS = [
  ShieldCheck,
  Award,
  Building2,
  TrendingUp,
];

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

export default function DeveloperWhyChoose({
  developer,
  pageContent = {},
}) {
  const section = pageContent?.whyChoose;

  /*
    This is a NEW CMS section.

    There is no previous hardcoded public Why Choose section
    to fall back to.

    Therefore:

    No CMS content → don't show section.
    CMS content → show section.
  */

  if (!section || section.enabled === false) {
    return null;
  }

  /* ==========================================================
      ITEMS
  ========================================================== */

  const items = Array.isArray(section.items)
    ? section.items.filter(
        (item) =>
          item &&
          (
            String(item.title || "").trim() ||
            String(item.description || "").trim()
          )
      )
    : [];

  /* ==========================================================
      RAW CONTENT
  ========================================================== */

  const rawTitle =
    typeof section.title === "string"
      ? section.title.trim()
      : "";

  const rawEyebrow =
    typeof section.eyebrow === "string"
      ? section.eyebrow.trim()
      : "";

  const description = normalizeRichText(
    section.description || ""
  );

  /*
    If the section has absolutely no editable content,
    don't render an empty section.
  */

  if (
    !rawTitle &&
    !rawEyebrow &&
    !description &&
    items.length === 0
  ) {
    return null;
  }

  /* ==========================================================
      CMS FALLBACK LABELS
  ========================================================== */

  const eyebrow =
    rawEyebrow ||
    "Why Choose This Developer";

  const title =
    rawTitle ||
    `Why Choose ${developer?.name || "This Developer"}`;

  /* ==========================================================
      RENDER
  ========================================================== */

  return (
    <section
      id="why-choose"
      className="
        relative
        overflow-hidden
        bg-[#f7f3ee]
        py-16
        sm:py-20
        lg:py-24
      "
    >
      {/* ====================================================
          SOFT DECORATION
      ==================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
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
          -left-40
          bottom-0
          h-80
          w-80
          rounded-full
          bg-[#17342d]/5
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
          max-w-[1240px]
          px-5
          sm:px-8
          lg:px-10
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
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
            duration: 0.55,
          }}
          className="max-w-3xl"
        >
          {/* EYEBROW */}

          <div
            className="
              mb-3
              flex
              items-center
              gap-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.24em]
              text-[#A68142]
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

            {eyebrow}
          </div>

          {/* TITLE */}

          <h2
            className="
              font-playfair
              text-3xl
              font-medium
              leading-[1.08]
              text-[#17342d]
              sm:text-4xl
              lg:text-[46px]
            "
          >
            {title}
          </h2>

          {/* DESCRIPTION */}

          {description && (
            <div
              className="
                mt-5
                max-w-2xl
                text-[13px]
                leading-[1.85]
                text-[#59635e]

                [&_p]:m-0
                [&_p]:mb-4
                [&_p:last-child]:mb-0

                [&_strong]:font-semibold
                [&_b]:font-semibold
                [&_em]:italic

                [&_u]:underline
                [&_u]:underline-offset-2

                [&_a]:font-medium
                [&_a]:text-[#8F7335]
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
                [&_h1]:leading-tight
                [&_h1]:text-[#17342d]

                [&_h2]:mb-3
                [&_h2]:font-playfair
                [&_h2]:text-xl
                [&_h2]:font-medium
                [&_h2]:leading-tight
                [&_h2]:text-[#17342d]

                [&_h3]:mb-2
                [&_h3]:font-playfair
                [&_h3]:text-lg
                [&_h3]:font-medium
                [&_h3]:leading-tight
                [&_h3]:text-[#17342d]

                [&_h4]:mb-2
                [&_h4]:font-semibold
                [&_h4]:text-[#17342d]

                [&_blockquote]:my-4
                [&_blockquote]:border-l-2
                [&_blockquote]:border-[#C89D58]
                [&_blockquote]:pl-4
                [&_blockquote]:italic

                [&_img]:my-4
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
          )}
        </motion.div>

        {/* ==================================================
            ITEMS
        ================================================== */}

        {items.length > 0 && (
          <div
            className="
              mt-10
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {items.map((item, index) => {
              const Icon =
                ICONS[index % ICONS.length];

              const itemTitle =
                typeof item?.title === "string"
                  ? item.title.trim()
                  : "";

              const itemDescription =
                normalizeRichText(
                  item?.description || ""
                );

              return (
                <motion.article
                  key={`${itemTitle || "item"}-${index}`}
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
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.06,
                  }}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-[#17342d]/10
                    bg-white/80
                    p-6
                    shadow-[0_12px_40px_rgba(23,52,45,0.06)]
                    backdrop-blur
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_20px_50px_rgba(23,52,45,0.10)]
                  "
                >
                  {/* CARD GLOW */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      right-0
                      top-0
                      h-24
                      w-24
                      translate-x-8
                      -translate-y-8
                      rounded-full
                      bg-[#C89D58]/10
                      blur-2xl
                    "
                    aria-hidden="true"
                  />

                  {/* ICON */}

                  <div
                    className="
                      relative
                      mb-5
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-[#C89D58]/25
                      bg-[#C89D58]/10
                      text-[#A68142]
                    "
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  </div>

                  {/* TITLE */}

                  {itemTitle && (
                    <h3
                      className="
                        relative
                        font-playfair
                        text-xl
                        font-medium
                        leading-tight
                        text-[#17342d]
                      "
                    >
                      {itemTitle}
                    </h3>
                  )}

                  {/* DESCRIPTION */}

                  {itemDescription && (
                    <div
                      className="
                        relative
                        mt-3
                        text-[12.5px]
                        leading-[1.8]
                        text-[#68716d]

                        [&_p]:m-0
                        [&_p]:mb-3
                        [&_p:last-child]:mb-0

                        [&_strong]:font-semibold
                        [&_b]:font-semibold
                        [&_em]:italic

                        [&_u]:underline
                        [&_u]:underline-offset-2

                        [&_a]:font-medium
                        [&_a]:text-[#8F7335]
                        [&_a]:underline
                        [&_a]:underline-offset-2

                        [&_ul]:my-3
                        [&_ul]:list-disc
                        [&_ul]:pl-4

                        [&_ol]:my-3
                        [&_ol]:list-decimal
                        [&_ol]:pl-4

                        [&_li]:mb-1

                        [&_h1]:mb-2
                        [&_h1]:font-playfair
                        [&_h1]:text-xl
                        [&_h1]:font-medium
                        [&_h1]:text-[#17342d]

                        [&_h2]:mb-2
                        [&_h2]:font-playfair
                        [&_h2]:text-lg
                        [&_h2]:font-medium
                        [&_h2]:text-[#17342d]

                        [&_h3]:mb-2
                        [&_h3]:font-playfair
                        [&_h3]:text-base
                        [&_h3]:font-medium
                        [&_h3]:text-[#17342d]
                      "
                    >
                      {hasRichText(
                        itemDescription
                      ) ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              itemDescription,
                          }}
                        />
                      ) : (
                        <p>
                          {itemDescription}
                        </p>
                      )}
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}