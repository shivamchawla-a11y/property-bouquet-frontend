
"use client";

import { useEffect, useState } from "react";

// ============================================================
// CREATE SAFE HEADING ID
// ============================================================

function slugifyHeading(text) {
  return (
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "section"
  );
}

// ============================================================
// EXTRACT HEADING INFORMATION
// ============================================================

function getHeadingInfo(heading, index) {
  const text = String(
    heading.textContent || ""
  )
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return null;

  // Recognize headings such as:
  // 1. Introduction
  // 2.1 Property Prices
  // 3) Investment Opportunities

  const numberedMatch = text.match(
    /^(\d+(?:\.\d+)*)(?:[.)])?\s+(.+)$/
  );

  const displayText = numberedMatch
    ? numberedMatch[2].trim()
    : text;

  const number = numberedMatch
    ? numberedMatch[1]
    : String(index + 1).padStart(2, "0");

  return {
    text,
    displayText,
    number,
    level:
      heading.tagName.toLowerCase() === "h3"
        ? 3
        : 2,
  };
}

// ============================================================
// TABLE OF CONTENTS
// ============================================================

export default function TableOfContents({
  containerId,
  compact = false,
}) {
  const [headings, setHeadings] = useState([]);

  // ==========================================================
  // DETECT ARTICLE HEADINGS
  // ==========================================================

  useEffect(() => {
    if (!containerId) return undefined;

    const container = document.getElementById(
      containerId
    );

    if (!container) return undefined;

    const updateHeadings = () => {
      const elements = Array.from(
        container.querySelectorAll("h2, h3")
      );

      const usedIds = new Set();

      const nextHeadings = elements
        .map((heading, index) => {
          const info = getHeadingInfo(
            heading,
            index
          );

          if (!info) return null;

          let id = heading.id;

          const existingElement = id
            ? document.getElementById(id)
            : null;

          const canKeepExistingId =
            Boolean(id) &&
            !usedIds.has(id) &&
            (
              !existingElement ||
              existingElement === heading
            );

          // Preserve existing unique IDs.
          // Generate a unique ID when one is missing
          // or already being used by another element.

          if (!canKeepExistingId) {
            const base = slugifyHeading(
              info.text
            );

            id = base;

            let suffix = 2;

            while (
              usedIds.has(id) ||
              (
                document.getElementById(id) &&
                document.getElementById(id) !== heading
              )
            ) {
              id = `${base}-${suffix}`;
              suffix++;
            }

            heading.id = id;
          }

          usedIds.add(id);

          return {
            id,
            ...info,
          };
        })
        .filter(Boolean);

      // Avoid unnecessary component updates.

      setHeadings((previous) => {
        const unchanged =
          previous.length === nextHeadings.length &&
          previous.every((item, index) => {
            const next = nextHeadings[index];

            return (
              item.id === next.id &&
              item.text === next.text &&
              item.displayText === next.displayText &&
              item.number === next.number &&
              item.level === next.level
            );
          });

        return unchanged
          ? previous
          : nextHeadings;
      });
    };

    // Initial detection.

    updateHeadings();

    // Detect article HTML changes.

    const observer = new MutationObserver(() => {
      updateHeadings();
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [containerId]);

  // ==========================================================
  // HIDE WHEN NO HEADINGS EXIST
  // ==========================================================

  if (headings.length === 0) {
    return null;
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className={`
        relative
        overflow-hidden
        border
        border-[#ebe5db]
        bg-gradient-to-b
        from-white
        to-[#fcfaf7]
        shadow-[0_20px_60px_rgba(0,0,0,.06)]
        text-[#163629]
        ${
          compact
            ? "rounded-2xl p-5"
            : "rounded-[32px] p-6"
        }
      `}
    >

      {/* DECORATIVE GLOW */}

      <div
        className="
          absolute
          -top-20
          -right-20
          h-40
          w-40
          rounded-full
          bg-[#b88638]/10
          blur-3xl
          pointer-events-none
        "
        aria-hidden="true"
      />

      {/* HEADER */}

      <div className="relative">

        <p className="
          text-[#805b1e]
          text-[11px]
          font-semibold
          uppercase
          tracking-[3px]
        ">
          Navigation
        </p>

        <h3
          className="
            mt-2
            text-[25px]
            leading-tight
            text-[#163629]
          "
          style={{
            fontFamily: "Georgia, serif",
          }}
        >
          In This Article
        </h3>

        <p className="
          mt-2
          text-sm
          text-[#888]
        ">
          Jump directly to any section.
        </p>

      </div>

      {/* DIVIDER */}

      <div className="
        my-5
        h-px
        bg-gradient-to-r
        from-transparent
        via-[#e6ddcf]
        to-transparent
      " />

      {/* NAVIGATION */}

      <nav
        aria-label="Article table of contents"
        className="relative"
      >

        <ol className="
          list-none
          space-y-1.5
          p-0
          m-0
        ">

          {headings.map((heading, index) => (
            <li
              key={heading.id}
              className={
                heading.level === 3
                  ? "ml-5"
                  : ""
              }
            >

              <a
                href={`#${encodeURIComponent(
                  heading.id
                )}`}
                className="
                  group
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-left
                  transition-all
                  duration-300
                  hover:bg-[#f8f4ec]
                  hover:shadow-sm
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-inset
                  focus-visible:ring-[#805b1e]
                "
              >

                {/* NUMBER */}

                <span
                  className="
                    flex
                    shrink-0
                    items-center
                    justify-center
                    min-w-[24px]
                    pt-0.5
                    text-[11px]
                    font-semibold
                    tracking-wider
                    text-[#b88638]
                  "
                  aria-hidden="true"
                >
                  {heading.number}
                </span>

                {/* HEADING TEXT */}

                <span className="
                  min-w-0
                  text-[14px]
                  font-medium
                  leading-6
                  text-[#163629]
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                ">
                  {heading.displayText}
                </span>

              </a>

            </li>
          ))}

        </ol>

      </nav>

      {/* FOOTER */}

      <div className="
        mt-5
        pt-4
        border-t
        border-[#ece7dc]
      ">

        <p className="
          text-[11px]
          text-[#999]
          leading-5
        ">
          {headings.length} article sections
        </p>

      </div>

    </div>
  );
}
