"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const normalizeRichText = (text) => {
  if (typeof text !== "string") return "";

  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/&#xA0;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/<p>\s*<\/p>/gi, "");
};

const hasRichText = (text) => {
  if (typeof text !== "string") return false;

  return /<\s*[a-z][^>]*>/i.test(text);
};

export default function DeveloperFAQ({
  developer,
  pageContent = {},
}) {
  const section = pageContent?.faq;

  const [openIndex, setOpenIndex] =
    useState(0);

  if (!section || section.enabled === false) {
    return null;
  }

  const items = Array.isArray(section.items)
    ? section.items.filter(
        (item) =>
          item?.question ||
          item?.answer
      )
    : [];

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id="faq"
      className="
        bg-white
        py-16
        sm:py-20
        lg:py-24
      "
    >
      <div
        className="
          mx-auto
          max-w-[980px]
          px-5
          sm:px-8
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
          className="mb-10 text-center"
        >
          {section.eyebrow && (
            <div
              className="
                mb-3
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

              {section.eyebrow}

              <span className="h-px w-8 bg-[#C89D58]" />
            </div>
          )}

          <h2
            className="
              font-playfair
              text-3xl
              font-medium
              leading-tight
              text-[#17342d]
              sm:text-4xl
              lg:text-[42px]
            "
          >
            {section.title ||
              `Frequently Asked Questions About ${
                developer?.name || "This Developer"
              }`}
          </h2>
        </motion.div>

        {/* ==================================================
            FAQ LIST
        ================================================== */}

        <div className="space-y-3">
          {items.map((item, index) => {
            const isOpen =
              openIndex === index;

            const answer = normalizeRichText(
              item?.answer || ""
            );

            return (
              <motion.div
                key={`${item?.question || "faq"}-${index}`}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.1,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.03,
                }}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#17342d]/10
                  bg-[#faf9f5]
                  transition
                  duration-300
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(
                      isOpen ? -1 : index
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-5
                    px-5
                    py-5
                    text-left
                    sm:px-6
                  "
                  aria-expanded={isOpen}
                >
                  <span
                    className="
                      font-playfair
                      text-[17px]
                      font-medium
                      leading-snug
                      text-[#17342d]
                      sm:text-lg
                    "
                  >
                    {item?.question}
                  </span>

                  <span
                    className={`
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#C89D58]/25
                      bg-white
                      text-[#A68142]
                      transition-transform
                      duration-300
                      ${
                        isOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  >
                    <ChevronDown
                      size={17}
                      strokeWidth={1.6}
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
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
                        duration: 0.28,
                      }}
                    >
                      <div className="px-5 pb-6 sm:px-6">
                        <div
                          className="
                            border-t
                            border-[#17342d]/10
                            pt-5
                            text-[13px]
                            leading-[1.85]
                            text-[#626c67]

                            [&_p]:m-0
                            [&_p]:mb-4
                            [&_p:last-child]:mb-0

                            [&_strong]:font-semibold
                            [&_strong]:text-[#17342d]

                            [&_b]:font-semibold
                            [&_b]:text-[#17342d]

                            [&_em]:italic

                            [&_a]:font-medium
                            [&_a]:text-[#8F7335]
                            [&_a]:underline

                            [&_ul]:my-4
                            [&_ul]:list-disc
                            [&_ul]:pl-5

                            [&_ol]:my-4
                            [&_ol]:list-decimal
                            [&_ol]:pl-5

                            [&_li]:mb-1.5

                            [&_blockquote]:my-4
                            [&_blockquote]:border-l-2
                            [&_blockquote]:border-[#C89D58]
                            [&_blockquote]:pl-4
                            [&_blockquote]:italic
                          "
                        >
                          {hasRichText(
                            answer
                          ) ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html:
                                  answer,
                              }}
                            />
                          ) : (
                            <p>{answer}</p>
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
      </div>
    </section>
  );
}