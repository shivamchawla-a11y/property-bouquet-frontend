
"use client";

import { useEffect, useState } from "react";

// ======================================================
// CREATE HEADING SLUG
// ======================================================

function slugify(text) {
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

// ======================================================
// TABLE OF CONTENTS
// ======================================================

export default function ArticleTableOfContents({
  containerId,
}) {
  const [headings, setHeadings] = useState([]);

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
          const text = String(
            heading.textContent || ""
          )
            .replace(/\u00A0/g, " ")
            .replace(/\s+/g, " ")
            .trim();

          if (!text) return null;

          let id = heading.id;

          const existingElement = id
            ? document.getElementById(id)
            : null;

          const validExistingId =
            id &&
            !usedIds.has(id) &&
            (
              !existingElement ||
              existingElement === heading
            );

          if (!validExistingId) {
            const base = slugify(text);

            id = base;

            let suffix = 2;

            while (
              usedIds.has(id) ||
              (
                document.getElementById(id) &&
                document.getElementById(id) !== heading
              )
            ) {
              id = `${base}-${suffix++}`;
            }

            heading.id = id;
          }

          usedIds.add(id);

          return {
            id,
            text,
            level:
              heading.tagName.toLowerCase() === "h3"
                ? 3
                : 2,
          };
        })
        .filter(Boolean);

      setHeadings((previous) => {
        const unchanged =
          previous.length === nextHeadings.length &&
          previous.every((item, index) => {
            const next = nextHeadings[index];

            return (
              item.id === next.id &&
              item.text === next.text &&
              item.level === next.level
            );
          });

        return unchanged
          ? previous
          : nextHeadings;
      });
    };

    updateHeadings();

    const observer = new MutationObserver(
      updateHeadings
    );

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [containerId]);

  if (!headings.length) {
    return null;
  }

  return (
    <details
      open
      className="
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-[#ebe5db]
        bg-gradient-to-b
        from-white
        to-[#fcfaf7]
        shadow-[0_15px_45px_rgba(0,0,0,.05)]
        text-[#163629]
      "
    >

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

      <summary className="
        relative
        cursor-pointer
        list-none
        px-6
        py-5
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-inset
        focus-visible:ring-[#805b1e]
      ">

        <p className="
          text-[#805b1e]
          text-[11px]
          uppercase
          font-semibold
          tracking-[3px]
        ">
          Navigation
        </p>

        <div className="
          mt-1
          flex
          items-center
          justify-between
          gap-4
        ">

          <span
            className="
              text-[25px]
              leading-tight
              text-[#163629]
            "
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            In This Guide
          </span>

          <span
            className="
              text-[#805b1e]
              text-xl
              transition-transform
              duration-300
            "
            aria-hidden="true"
          >
            +
          </span>

        </div>

        <p className="
          text-sm
          text-[#888]
          mt-2
        ">
          {headings.length} sections · Jump to any topic
        </p>

      </summary>

      <div className="
        border-t
        border-[#ece7dc]
        mx-6
      " />

      <nav
        aria-label="Knowledge article table of contents"
        className="relative px-4 py-4"
      >

        <ol className="
          list-none
          m-0
          p-0
          space-y-1
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
                  transition-all
                  duration-200
                  hover:bg-[#f8f4ec]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-inset
                  focus-visible:ring-[#805b1e]
                "
              >

                <span className="
                  shrink-0
                  pt-0.5
                  text-[11px]
                  font-semibold
                  tracking-wider
                  text-[#b88638]
                ">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="
                  text-[14px]
                  leading-6
                  font-medium
                  text-[#163629]
                  min-w-0
                  group-hover:text-[#805b1e]
                  transition-colors
                ">
                  {heading.text}
                </span>

              </a>

            </li>
          ))}

        </ol>

      </nav>

    </details>
  );
}
