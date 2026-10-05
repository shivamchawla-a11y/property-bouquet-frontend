"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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

export default function DeveloperCustomSections({
  developer,
  pageContent = {},
}) {
  const sections = Array.isArray(
    pageContent?.customSections
  )
    ? pageContent.customSections.filter(
        (section) =>
          section &&
          section.enabled !== false &&
          (
            section.title ||
            section.content ||
            section.image
          )
      )
    : [];

  if (sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section, index) => {
        const content = normalizeRichText(
          section.content || ""
        );

        const image =
          typeof section.image === "string"
            ? section.image.trim()
            : "";

        const imagePosition =
          section.imagePosition ||
          "right";

        const imageFirst =
          imagePosition === "left" ||
          imagePosition === "top";

        const isVertical =
          imagePosition === "top" ||
          imagePosition === "bottom";

        return (
          <section
            key={
              section.id ||
              `custom-section-${index}`
            }
            className="
              bg-[#f7f3ee]
              py-16
              sm:py-20
              lg:py-24
            "
          >
            <div
              className="
                mx-auto
                max-w-[1240px]
                px-5
                sm:px-8
                lg:px-10
              "
            >
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
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.55,
                }}
                className={`
                  grid
                  items-center
                  gap-8
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-[#17342d]/10
                  bg-white
                  shadow-[0_15px_50px_rgba(23,52,45,0.06)]
                  ${
                    isVertical
                      ? "grid-cols-1"
                      : "lg:grid-cols-2"
                  }
                `}
              >
                {/* =================================================
                    IMAGE
                ================================================= */}

                {image && (
                  <div
                    className={`
                      relative
                      min-h-[280px]
                      overflow-hidden
                      ${
                        isVertical
                          ? "order-first"
                          : imageFirst
                          ? "lg:order-first"
                          : "lg:order-last"
                      }
                    `}
                  >
                    <Image
                      src={image}
                      alt={
                        section.title ||
                        developer?.name ||
                        "Developer"
                      }
                      fill
                      sizes="
                        (max-width: 1024px) 100vw,
                        50vw
                      "
                      className="
                        object-cover
                        transition
                        duration-700
                        hover:scale-[1.025]
                      "
                    />
                  </div>
                )}

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div
                  className="
                    p-7
                    sm:p-9
                    lg:p-12
                  "
                >
                  {section.eyebrow && (
                    <div
                      className="
                        mb-3
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.24em]
                        text-[#A68142]
                      "
                    >
                      {section.eyebrow}
                    </div>
                  )}

                  {section.title && (
                    <h2
                      className="
                        font-playfair
                        text-3xl
                        font-medium
                        leading-[1.1]
                        text-[#17342d]
                        sm:text-4xl
                      "
                    >
                      {section.title}
                    </h2>
                  )}

                  {section.subtitle && (
                    <p
                      className="
                        mt-3
                        text-sm
                        font-medium
                        leading-relaxed
                        text-[#8F7335]
                      "
                    >
                      {section.subtitle}
                    </p>
                  )}

                  {content && (
                    <div
                      className="
                        mt-5
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
                        [&_h1]:text-[#17342d]

                        [&_h2]:mb-3
                        [&_h2]:font-playfair
                        [&_h2]:text-xl
                        [&_h2]:font-medium
                        [&_h2]:text-[#17342d]

                        [&_h3]:mb-2
                        [&_h3]:font-playfair
                        [&_h3]:text-lg
                        [&_h3]:font-medium
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
                      {hasRichText(content) ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: content,
                          }}
                        />
                      ) : (
                        <p>{content}</p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </section>
        );
      })}
    </>
  );
}