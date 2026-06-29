"use client";

import { useEffect, useState } from "react";

export default function TableOfContents({
  article,
  articleRef,
}) {
  const [headings, setHeadings] = useState([]);

useEffect(() => {
  if (!article) return;

  const generateTOC = () => {
    const elements =
  articleRef.current?.querySelectorAll(
    "h1,h2,h3"
  ) || [];

    if (!elements.length) {
      // Try again shortly if the content isn't ready yet
      setTimeout(generateTOC, 100);
      return;
    }

    const list = [];

elements.forEach((heading) => {
  // Normalize nbsp to normal spaces
  const text = heading.textContent
    .replace(/\u00A0/g, " ")
    .trim();

  // Keep ONLY headings beginning with:
  // 1.
  // 2.
  // 10.
  if (!/^\d+\.\s*/.test(text)) return;

  const number = text.match(/^\d+/)?.[0];

  const cleanTitle = text.replace(/^\d+\.\s*/, "").trim();

  const id = `section-${number}`;

  heading.id = id;

  list.push({
    id,
    number,
    text: cleanTitle,
  });
});

setHeadings(list);
  };

  const timer = setInterval(() => {
  generateTOC();

  if (articleRef.current?.querySelector("h1,h2,h3")) {
    clearInterval(timer);
  }
}, 100);

return () => clearInterval(timer);
}, [article]);

  const scrollToHeading = (id) => {
  const element = document.getElementById(id);

  if (!element) return;

  const y =
    element.getBoundingClientRect().top +
    window.scrollY -
    120;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
};

  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-[32px]
      border
      border-[#ebe5db]
      bg-gradient-to-b
      from-white
      to-[#fcfaf7]
      p-6
      shadow-[0_20px_60px_rgba(0,0,0,.06)]
      transition-all
      duration-500
      hover:-translate-y-1
      hover:shadow-[0_30px_80px_rgba(0,0,0,.09)]
      !text-[#163629]
      "
    >
      {/* Gold Glow */}

      <div
        className="
        absolute
        -top-20
        -right-20
        w-40
        h-40
        rounded-full
        bg-[#b88638]/10
        blur-3xl
        pointer-events-none
        "
      />

      {/* Header */}

      <div>

        <p
          className="
          uppercase
          tracking-[3px]
          text-[11px]
          font-semibold
          !text-[#b88638]
          "
        >
          Navigation
        </p>

        <h3
          className="
          mt-2
          text-[26px]
          leading-tight
          !text-[#163629]
          "
          style={{
            fontFamily: "Georgia, serif",
          }}
        >
          Table of Contents
        </h3>

      </div>

      {/* Divider */}

      <div className="my-5 h-px bg-gradient-to-r from-transparent via-[#e6ddcf] to-transparent" />

      {/* Contents */}

      <div className="space-y-1.5">

        {headings.map((heading, index) => (

          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className="
group
w-full
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
"
          >

            {/* Timeline */}

            <div className="flex flex-col items-center shrink-0">

              <div
                className="
                w-3
                h-3 
                rounded-full
                border-2
                border-[#b88638]
                bg-white
                group-hover:bg-[#b88638]
                transition-all
                duration-300
                "
              />

              {index !== headings.length - 1 && (

                <div
                  className="
                  w-px
                  flex-1
                  min-h-[20px]
                  bg-[#ddd3c5]
                  "
                />

              )}

            </div>

            {/* Text */}

            <div>

              <span
                className="
                block
                text-[11px]
                uppercase
                tracking-[2px]
                font-semibold
                !text-[#b88638]
                "
              >
                {heading.number}
              </span>

              <p
                className="
                mt-0.5
text-[14px]
leading-6
                font-medium
                !text-[#163629]
                group-hover:translate-x-1
                transition-all
                duration-300
                "
              >
                {heading.text}
              </p>

            </div>

          </button>

        ))}

        {headings.length === 0 && (

          <div
            className="
            rounded-2xl
            border
            border-dashed
            border-[#e8dfd1]
            p-6
            text-center
            "
          >

            <p className="!text-[#777] leading-7">
              Loading table of contents...
            </p>

          </div>

        )}

      </div>

    </div>
  );
}