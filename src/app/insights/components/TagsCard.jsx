"use client";

export default function TagsCard({ article }) {
  const tags =
    article.tags?.length > 0
      ? article.tags
      : [
          article.category,
          "Luxury",
          "Investment",
          "Real Estate",
          "Property",
        ];

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
      p-8
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
        -top-16
        -right-16
        w-40
        h-40
        rounded-full
        bg-[#b88638]/10
        blur-3xl
        pointer-events-none
        "
      />

      {/* Header */}

      <div className="relative">

        <p
          className="
          uppercase
          tracking-[3px]
          text-[11px]
          font-semibold
          !text-[#b88638]
          "
        >
          Explore Topics
        </p>

        <h3
          className="
          mt-2
          text-[30px]
          leading-tight
          !text-[#163629]
          "
          style={{
            fontFamily: "Georgia, serif",
          }}
        >
          Popular Tags
        </h3>

      </div>

      {/* Divider */}

      <div className="my-7 h-px bg-gradient-to-r from-transparent via-[#e6ddcf] to-transparent" />

      {/* Tags */}

      <div className="flex flex-wrap gap-3">

        {tags.map((tag) => (

          <button
            key={tag}
            className="
            group
            px-5
            py-3
            rounded-full
            border
            border-[#e8dfd1]
            bg-[#f8f5ef]
            !text-[#163629]
            text-sm
            font-medium
            transition-all
            duration-300
            hover:bg-[#163629]
            hover:!text-white
            hover:border-[#163629]
            hover:-translate-y-0.5
            hover:shadow-lg
            "
          >
            #{tag}
          </button>

        ))}

      </div>

      {/* Footer */}

      <div className="mt-8 pt-6 border-t border-[#ece7dc]">

        <p
          className="
          text-[13px]
          leading-7
          !text-[#777]
          "
        >
          Explore more luxury real estate insights,
          investment strategies, and premium property
          market updates through these curated topics.
        </p>

      </div>

    </div>
  );
}