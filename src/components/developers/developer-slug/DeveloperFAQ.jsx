"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  MessageCircleQuestion,
} from "lucide-react";

/* =========================================================
   RICH TEXT HELPERS
========================================================= */

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

/* =========================================================
   FAQ COMPONENT
========================================================= */

export default function DeveloperFAQ({
  developer,
  pageContent = {},
}) {
  const section = pageContent?.faq;

  const [openIndex, setOpenIndex] = useState(0);

  /* =======================================================
     SECTION VISIBILITY
  ======================================================= */

  if (!section || section.enabled === false) {
    return null;
  }

  /* =======================================================
     FILTER VALID FAQ ITEMS
  ======================================================= */

  const items = Array.isArray(section.items)
    ? section.items.filter(
        (item) =>
          String(item?.question || "").trim() ||
          String(item?.answer || "").trim()
      )
    : [];

  if (items.length === 0) {
    return null;
  }

  const developerName =
    developer?.name || "This Developer";

  const title =
    String(section.title || "").trim() ||
    `Frequently Asked Questions About ${developerName}`;

  const eyebrow =
    String(section.eyebrow || "").trim() ||
    "Frequently Asked Questions";

  return (
    <section
      id="faq"
      className="
        relative
        overflow-hidden
        border-t
        border-[#17342d]/8
        bg-[#f7f7f5]
        py-16
        sm:py-20
        lg:py-24
      "
    >
      {/* ===================================================
          SOFT BACKGROUND DETAILS
      =================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -left-32
            top-20
            h-72
            w-72
            rounded-full
            bg-[#C89D58]/5
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -right-32
            bottom-0
            h-80
            w-80
            rounded-full
            bg-[#17342d]/4
            blur-3xl
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-0
            h-px
            w-[min(760px,70%)]
            -translate-x-1/2
            bg-gradient-to-r
            from-transparent
            via-[#C89D58]/25
            to-transparent
          "
        />
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1080px]
          px-5
          sm:px-7
          lg:px-8
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

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
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mx-auto
            mb-10
            max-w-[760px]
            text-center
            sm:mb-12
          "
        >
          {/* Eyebrow */}

          <div
            className="
              mb-4
              flex
              items-center
              justify-center
              gap-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.24em]
              text-[#A68142]
            "
          >
            <span className="h-px w-8 bg-[#C89D58]" />

            <span>{eyebrow}</span>

            <span className="h-px w-8 bg-[#C89D58]" />
          </div>

          {/* Title */}

          <h2
            className="
              font-playfair
              text-[30px]
              font-medium
              leading-[1.12]
              tracking-[-0.015em]
              text-[#17342d]
              sm:text-[36px]
              lg:text-[44px]
            "
          >
            {title}
          </h2>

          {/* Intro */}

          <div className="mt-4 flex items-center justify-center gap-2">
            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                border
                border-[#C89D58]/25
                bg-white
                text-[#A68142]
                shadow-[0_5px_20px_rgba(23,52,45,0.05)]
              "
            >
              <MessageCircleQuestion
                size={15}
                strokeWidth={1.5}
              />
            </span>

            <span
              className="
                text-[11px]
                font-medium
                tracking-[0.04em]
                text-[#6b746f]
              "
            >
              Everything you may want to know
            </span>
          </div>
        </motion.div>

        {/* =================================================
            FAQ LIST
        ================================================= */}

        <div className="space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;

            const question =
              String(item?.question || "").trim();

            const answer = normalizeRichText(
              item?.answer || ""
            );

            return (
              <motion.div
                key={`${question || "faq"}-${index}`}
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.08,
                }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index * 0.035, 0.25),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`
                  group
                  overflow-hidden
                  rounded-[20px]
                  border
                  transition-all
                  duration-300
                  ${
                    isOpen
                      ? "border-[#C89D58]/30 bg-white shadow-[0_14px_40px_rgba(23,52,45,0.07)]"
                      : "border-[#17342d]/9 bg-white/75 hover:border-[#C89D58]/25 hover:bg-white"
                  }
                `}
              >
                {/* =================================================
                    QUESTION BUTTON
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(
                      isOpen ? -1 : index
                    )
                  }
                  aria-expanded={isOpen}
                  aria-controls={`developer-faq-answer-${index}`}
                  className="
                    flex
                    min-h-[72px]
                    w-full
                    items-center
                    gap-4
                    px-4
                    py-4
                    text-left
                    outline-none
                    transition-colors
                    duration-300
                    focus-visible:ring-2
                    focus-visible:ring-[#C89D58]/50
                    focus-visible:ring-inset
                    sm:min-h-[78px]
                    sm:px-6
                    sm:py-5
                  "
                >
                  {/* Number */}

                  <span
                    className={`
                      hidden
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      text-[10px]
                      font-semibold
                      tracking-[0.08em]
                      transition-all
                      duration-300
                      sm:flex
                      ${
                        isOpen
                          ? "border-[#C89D58]/40 bg-[#17342d] text-[#D8B66D]"
                          : "border-[#17342d]/10 bg-[#f7f5ef] text-[#8F7335]"
                      }
                    `}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Question */}

                  <span
                    className={`
                      min-w-0
                      flex-1
                      font-playfair
                      text-[16px]
                      font-medium
                      leading-[1.35]
                      transition-colors
                      duration-300
                      sm:text-[17px]
                      ${
                        isOpen
                          ? "text-[#17342d]"
                          : "text-[#263b34] group-hover:text-[#17342d]"
                      }
                    `}
                  >
                    {question || "Frequently asked question"}
                  </span>

                  {/* Chevron */}

                  <span
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      transition-all
                      duration-300
                      ${
                        isOpen
                          ? "rotate-180 border-[#C89D58]/40 bg-[#17342d] text-[#D8B66D]"
                          : "border-[#C89D58]/25 bg-[#faf9f5] text-[#A68142] group-hover:border-[#C89D58]/40"
                      }
                    `}
                  >
                    <ChevronDown
                      size={17}
                      strokeWidth={1.6}
                    />
                  </span>
                </button>

                {/* =================================================
                    ANSWER
                ================================================= */}

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`developer-faq-answer-${index}`}
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        height: {
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        },
                        opacity: {
                          duration: 0.2,
                        },
                      }}
                    >
                      <div
                        className="
                          px-4
                          pb-5
                          sm:px-6
                          sm:pb-6
                        "
                      >
                        <div
                          className="
                            ml-0
                            border-t
                            border-[#17342d]/8
                            pt-5
                            sm:ml-[48px]

                            text-[13px]
                            leading-[1.85]
                            text-[#626c67]

                            sm:text-[13.5px]
                            md:text-[14px]

                            [&_p]:m-0
                            [&_p]:mb-4
                            [&_p:last-child]:mb-0

                            [&_strong]:font-semibold
                            [&_strong]:text-[#17342d]

                            [&_b]:font-semibold
                            [&_b]:text-[#17342d]

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
                          {answer ? (
                            hasRichText(answer) ? (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: answer,
                                }}
                              />
                            ) : (
                              <p>{answer}</p>
                            )
                          ) : (
                            <p className="text-[#8a918d]">
                              Information for this question
                              will be updated shortly.
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* =================================================
            BOTTOM TRUST STRIP
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
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
            delay: 0.1,
          }}
          className="
            mt-8
            flex
            items-center
            justify-center
            gap-2
            text-center
            sm:mt-10
          "
        >
          <HelpCircle
            size={14}
            strokeWidth={1.5}
            className="text-[#A68142]"
          />

          <span
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-[#7a817d]
            "
          >
            Need more information? Our property advisors
            are here to help.
          </span>
        </motion.div>
      </div>
    </section>
  );
}