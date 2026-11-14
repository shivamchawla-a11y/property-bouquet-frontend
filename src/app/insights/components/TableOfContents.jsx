"use client";

import { useEffect, useState } from "react";

function extractNumberedHeading(heading) {
  const text = String(heading.textContent || "")
    .replace(/\u00A0/g, " ")
    .trim();

  const match = text.match(/^(\d+)\.\s*(.*)$/);
  if (!match) return null;

  return {
    id: `section-${match[1]}`,
    number: match[1],
    text: match[2].trim(),
  };
}

export default function TableOfContents({ containerId }) {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (!containerId) return undefined;

    const container = document.getElementById(containerId);
    if (!container) return undefined;

    const updateHeadings = () => {
      const elements = container.querySelectorAll("h1, h2, h3");
      const nextHeadings = [];

      elements.forEach((heading) => {
        const item = extractNumberedHeading(heading);
        if (!item) return;

        // Preserve the existing numbered-section anchor convention.
        heading.id = item.id;
        nextHeadings.push(item);
      });

      setHeadings(nextHeadings);
    };

    updateHeadings();

    // Supports article content that is amended after the first render,
    // without repeated polling or accumulating setTimeout callbacks.
    const observer = new MutationObserver(updateHeadings);
    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [containerId]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    const top =
      element.getBoundingClientRect().top + window.scrollY - 120;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="
        relative overflow-hidden rounded-[32px]
        border border-[#ebe5db]
        bg-gradient-to-b from-white to-[#fcfaf7]
        p-6 shadow-[0_20px_60px_rgba(0,0,0,.06)]
        transition-all duration-500
        hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,.09)]
        text-[#163629]
      "
    >
      <div
        className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[#b88638]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative">
        <p className="text-[#805b1e] text-[11px] font-semibold uppercase tracking-[3px]">
          Navigation
        </p>

        <h3
          className="mt-2 text-[26px] leading-tight text-[#163629]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Table of Contents
        </h3>
      </div>

      <div className="my-5 h-px bg-gradient-to-r from-transparent via-[#e6ddcf] to-transparent" />

      <nav aria-label="Article table of contents" className="space-y-1.5">
        {headings.map((heading, index) => (
          <button
            key={`${heading.id}-${index}`}
            type="button"
            onClick={() => scrollToHeading(heading.id)}
            className="
              group flex w-full items-start gap-3 rounded-xl
              px-3 py-2.5 text-left transition-all duration-300
              hover:bg-[#f8f4ec] hover:shadow-sm
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-inset focus-visible:ring-[#805b1e]
            "
          >
            <span className="flex shrink-0 flex-col items-center" aria-hidden="true">
              <span className="h-3 w-3 rounded-full border-2 border-[#805b1e] bg-white transition-all duration-300 group-hover:bg-[#805b1e]" />
              {index !== headings.length - 1 && (
                <span className="min-h-[20px] w-px flex-1 bg-[#ddd3c5]" />
              )}
            </span>

            <span className="min-w-0">
              <span className="block text-[11px] font-semibold uppercase tracking-[2px] text-[#805b1e]">
                {heading.number}
              </span>
              <span className="mt-0.5 block text-[14px] font-medium leading-6 text-[#163629] transition-transform duration-300 group-hover:translate-x-1">
                {heading.text}
              </span>
            </span>
          </button>
        ))}

        {headings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#e8dfd1] p-6 text-center">
            <p className="leading-7 text-[#666666]">
              No numbered sections available.
            </p>
          </div>
        )}
      </nav>
    </div>
  );
}
