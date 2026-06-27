"use client";

export default function TableOfContents({ article }) {
  const headings = [];

  if (typeof window !== "undefined") {
    document.querySelectorAll(".article-content h2").forEach((item) => {
      headings.push(item.innerText);
    });
  }

  return (
    <div className="bg-white border border-[#ece7dc] rounded-xl p-7">

      <h3
        className="text-[28px] text-[#163629]"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Table of Contents
      </h3>

      <div className="mt-6 space-y-5">

        {headings.map((heading, index) => (
          <div
            key={index}
            className="flex gap-4 items-start"
          >
            <div className="flex flex-col items-center">

              <div className="w-3 h-3 rounded-full border-2 border-[#b08a46]" />

              {index !== headings.length - 1 && (
                <div className="w-px h-8 bg-[#d7d7d7]" />
              )}

            </div>

            <p className="text-[15px] leading-6 text-[#555]">

              {heading}

            </p>

          </div>
        ))}

      </div>

    </div>
  );
}