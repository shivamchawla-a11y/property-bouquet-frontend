"use client";

import {
  ShieldCheck,
  Award,
  Building2,
  TrendingUp,
  Sparkles,
  Clock3,
} from "lucide-react";

/* ============================================================
   ICONS
============================================================ */

const ICONS = [
  ShieldCheck,
  Award,
  Building2,
  TrendingUp,
  Sparkles,
  Clock3,
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

export default function DeveloperWhyChoose({
  developer,
  pageContent = {},
}) {
  /* ==========================================================
     CMS CONTENT
  ========================================================== */

  const customContent = pageContent?.whyChoose || {};

  /* ==========================================================
     HEADER CONTENT
  ========================================================== */

  const eyebrow = value(
    customContent?.eyebrow,
    "WHY CHOOSE?"
  );

  const title = value(
    customContent?.title,
    `Why Choose ${developer?.name || "This Developer"}?`
  );

  /* ==========================================================
     DESCRIPTION

     Supports:

     1. Plain text
     2. Rich HTML from RichTextEditor
  ========================================================== */

  const description = value(
    customContent?.description,
    `Choosing the right developer is about more than an individual project. Buyers often evaluate development quality, planning, execution, credibility, project portfolio, design standards and the overall experience offered across a developer's properties. These factors can provide a broader framework when assessing a developer and its projects.`
  );

  const normalizedDescription =
    normalizeRichText(description);

  const descriptionIsRich =
    hasRichText(normalizedDescription);

  /* ==========================================================
     DEFAULT DEVELOPER ADVANTAGES

     These remain available when the admin has not
     provided custom items.

     The structure intentionally follows WhyBuyLocation.
  ========================================================== */

  const defaultReasons = [
    {
      title: "Established Reputation",
      description:
        "A credible development track record can provide buyers with greater confidence when evaluating a project's quality, delivery and overall proposition.",
    },
    {
      title: "Quality Development",
      description:
        "Established development practices can contribute to thoughtful planning, construction quality and a more consistent project experience.",
    },
    {
      title: "Strong Portfolio",
      description:
        "A diverse portfolio can demonstrate experience across locations, property types, configurations and different segments of the real estate market.",
    },
    {
      title: "Professional Execution",
      description:
        "Experienced developers can bring structured planning, professional execution and coordinated delivery across multiple project stages.",
    },
    {
      title: "Design & Lifestyle",
      description:
        "Thoughtful design, amenities and community planning can contribute to a more refined and comfortable living experience.",
    },
    {
      title: "Long-Term Value",
      description:
        "Buyers can consider a developer's reputation, project quality, location strategy and market presence when evaluating long-term ownership potential.",
    },
  ];

  /* ==========================================================
     ADMIN REASONS

     Merge by position.

     Example:

     Admin changes item #2
     → item #1, #3, #4, #5 and #6 retain defaults.

     Extra admin items are preserved.
  ========================================================== */

  const customReasons = Array.isArray(
    customContent?.items
  )
    ? customContent.items
    : [];

  const reasonsLength = Math.max(
    defaultReasons.length,
    customReasons.length
  );

  const reasons = Array.from(
    { length: reasonsLength },
    (_, index) => {
      const fallback =
        defaultReasons[index] || {
          title: "",
          description: "",
        };

      const custom =
        customReasons[index] || {};

      return {
        title: value(
          custom?.title,
          fallback.title
        ),

        description: value(
          custom?.description,
          fallback.description
        ),
      };
    }
  ).filter(
    (reason) =>
      reason.title ||
      reason.description
  );

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section
      id="why-choose"
      aria-labelledby="why-choose-heading"
      className="
        relative
        overflow-hidden
        border-t
        border-[#e8e1d7]
        bg-white
        py-16
        sm:py-18
        md:py-20
        lg:py-24
      "
    >
      {/* ====================================================
          SOFT BACKGROUND
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
          bg-[#C89D58]/8
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
          max-w-[1380px]
          px-5
          sm:px-7
          lg:px-10
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="max-w-[900px]">
          {/* EYEBROW */}

          <div
            className="
              flex
              items-center
              gap-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.24em]
              text-[#8F7335]
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
            id="why-choose-heading"
            className="
              mt-4
              max-w-[850px]
              font-playfair
              text-[34px]
              font-medium
              leading-[1.08]
              tracking-[-0.025em]
              text-[#17342d]
              sm:text-[39px]
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
              w-16
              bg-[#C89D58]
            "
            aria-hidden="true"
          />

          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          {descriptionIsRich ? (
            <div
              className="
                mt-5
                max-w-[850px]
                break-words
                text-[13px]
                leading-[1.85]
                text-[#59635e]
                [overflow-wrap:anywhere]
                [word-break:break-word]

                [&_*]:max-w-full

                [&_p]:m-0
                [&_p]:mb-4
                [&_p:last-child]:mb-0
                [&_p]:break-words
                [&_p]:[overflow-wrap:anywhere]

                [&_strong]:font-semibold
                [&_strong]:text-[#263832]

                [&_b]:font-semibold
                [&_b]:text-[#263832]

                [&_em]:italic

                [&_u]:underline
                [&_u]:underline-offset-2

                [&_a]:font-medium
                [&_a]:text-[#A47A2B]
                [&_a]:underline
                [&_a]:underline-offset-2

                [&_ul]:mb-4
                [&_ul]:ml-5
                [&_ul]:max-w-full
                [&_ul]:list-disc

                [&_ol]:mb-4
                [&_ol]:ml-5
                [&_ol]:max-w-full
                [&_ol]:list-decimal

                [&_li]:mb-1
                [&_li]:break-words
                [&_li]:[overflow-wrap:anywhere]

                [&_h1]:max-w-full
                [&_h2]:max-w-full
                [&_h3]:max-w-full
                [&_h4]:max-w-full
                [&_h5]:max-w-full
                [&_h6]:max-w-full

                [&_h1]:font-playfair
                [&_h2]:font-playfair
                [&_h3]:font-playfair
                [&_h4]:font-playfair

                [&_h1]:mb-3
                [&_h2]:mb-3
                [&_h3]:mb-3

                [&_h1]:mt-5
                [&_h2]:mt-5
                [&_h3]:mt-5

                [&_h1]:text-2xl
                [&_h2]:text-xl
                [&_h3]:text-xl

                [&_h1]:font-medium
                [&_h2]:font-medium
                [&_h3]:font-semibold

                [&_h1]:leading-tight
                [&_h2]:leading-tight
                [&_h3]:leading-tight

                [&_h1]:text-[#17342d]
                [&_h2]:text-[#17342d]
                [&_h3]:text-[#17342d]

                [&_h4]:mb-2
                [&_h4]:mt-4
                [&_h4]:font-semibold
                [&_h4]:text-[#17342d]

                [&_blockquote]:my-4
                [&_blockquote]:border-l-2
                [&_blockquote]:border-[#C89D58]
                [&_blockquote]:pl-4
                [&_blockquote]:italic

                [&_img]:h-auto
                [&_img]:max-w-full
                [&_img]:rounded-xl

                sm:text-[14px]
                md:text-[15px]
              "
              dangerouslySetInnerHTML={{
                __html:
                  normalizedDescription,
              }}
            />
          ) : (
            <div
              className="
                mt-5
                max-w-[850px]
                text-[13px]
                leading-[1.85]
                text-[#59635e]
                sm:text-[14px]
                md:text-[15px]
              "
            >
              {normalizedDescription
                .split(/\n\s*\n/)
                .map(
                  (paragraph, index) => (
                    <p
                      key={index}
                      className="
                        m-0
                        mb-4
                        last:mb-0
                        max-w-full
                        break-words
                        [overflow-wrap:anywhere]
                      "
                    >
                      {paragraph.trim()}
                    </p>
                  )
                )}
            </div>
          )}
        </div>

        {/* ==================================================
            DEVELOPER ADVANTAGES
        ================================================== */}

        {reasons.length > 0 && (
          <div
            className="
              mt-10
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-6
            "
          >
            {reasons.map(
              (reason, index) => {
                const Icon =
                  ICONS[
                    index % ICONS.length
                  ] || Sparkles;

                const reasonDescription =
                  normalizeRichText(
                    reason.description
                  );

                const reasonIsRich =
                  hasRichText(
                    reasonDescription
                  );

                return (
                  <article
                    key={`${reason.title || "reason"}-${index}`}
                    className="
                      group
                      relative
                      flex
                      h-full
                      min-h-[235px]
                      flex-col
                      overflow-hidden
                      rounded-[20px]
                      border
                      border-[#e2dbd0]
                      bg-[#fbfaf7]
                      p-6
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#d2c4af]
                      hover:bg-white
                      hover:shadow-[0_18px_45px_rgba(23,52,45,0.08)]
                    "
                  >
                    {/* TOP ACCENT */}

                    <div
                      className="
                        absolute
                        left-6
                        top-0
                        h-[2px]
                        w-10
                        bg-[#C89D58]
                        opacity-70
                        transition-all
                        duration-300
                        group-hover:w-16
                      "
                      aria-hidden="true"
                    />

                    {/* ICON */}

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-[13px]
                        border
                        border-[#D4AF37]/35
                        bg-[#f5f0e7]
                        text-[#A9822E]
                        transition-all
                        duration-300
                        group-hover:border-[#C89D58]/50
                        group-hover:bg-[#17342d]
                        group-hover:text-[#D4AF37]
                      "
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </div>

                    {/* NUMBER */}

                    <span
                      className="
                        absolute
                        right-5
                        top-5
                        text-[10px]
                        font-semibold
                        tracking-[0.12em]
                        text-[#b7afa3]
                      "
                    >
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    {/* TITLE */}

                    {reason.title && (
                      <h3
                        className="
                          mt-6
                          text-[15px]
                          font-semibold
                          leading-[1.35]
                          text-[#17342d]
                          sm:text-[16px]
                        "
                      >
                        {reason.title}
                      </h3>
                    )}

                    {/* DESCRIPTION */}

                    {reasonDescription && (
                      <div
                        className="
                          relative
                          mt-3
                          text-[12px]
                          leading-[1.75]
                          text-[#6d746f]
                          sm:text-[13px]

                          [&_p]:m-0
                          [&_p]:mb-3
                          [&_p:last-child]:mb-0

                          [&_strong]:font-semibold
                          [&_strong]:text-[#263832]

                          [&_b]:font-semibold
                          [&_b]:text-[#263832]

                          [&_em]:italic

                          [&_u]:underline
                          [&_u]:underline-offset-2

                          [&_a]:font-medium
                          [&_a]:text-[#A47A2B]
                          [&_a]:underline
                          [&_a]:underline-offset-2

                          [&_ul]:my-3
                          [&_ul]:ml-4
                          [&_ul]:list-disc

                          [&_ol]:my-3
                          [&_ol]:ml-4
                          [&_ol]:list-decimal

                          [&_li]:mb-1

                          [&_h1]:mb-2
                          [&_h1]:mt-3
                          [&_h1]:font-playfair
                          [&_h1]:text-lg
                          [&_h1]:font-medium
                          [&_h1]:leading-tight
                          [&_h1]:text-[#17342d]

                          [&_h2]:mb-2
                          [&_h2]:mt-3
                          [&_h2]:font-playfair
                          [&_h2]:text-base
                          [&_h2]:font-medium
                          [&_h2]:leading-tight
                          [&_h2]:text-[#17342d]

                          [&_h3]:mb-2
                          [&_h3]:mt-3
                          [&_h3]:font-playfair
                          [&_h3]:text-base
                          [&_h3]:font-medium
                          [&_h3]:leading-tight
                          [&_h3]:text-[#17342d]

                          [&_blockquote]:my-3
                          [&_blockquote]:border-l-2
                          [&_blockquote]:border-[#C89D58]
                          [&_blockquote]:pl-3
                          [&_blockquote]:italic

                          [&_img]:my-3
                          [&_img]:h-auto
                          [&_img]:max-w-full
                          [&_img]:rounded-xl
                        "
                      >
                        {reasonIsRich ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                reasonDescription,
                            }}
                          />
                        ) : (
                          <p>
                            {reasonDescription}
                          </p>
                        )}
                      </div>
                    )}

                    {/* BOTTOM DETAIL */}

                    <div
                      className="
                        mt-auto
                        pt-6
                      "
                    >
                      <div
                        className="
                          h-px
                          w-full
                          bg-[#e9e3da]
                        "
                      />

                      <div
                        className="
                          mt-4
                          flex
                          items-center
                          gap-2
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.12em]
                          text-[#8F7335]
                        "
                      >
                        <span
                          className="
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full
                            bg-[#C89D58]
                          "
                          aria-hidden="true"
                        />

                        Developer Advantage
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </div>
    </section>
  );
}