"use client";

import Image from "next/image";

export default function AboutAuthor({ article }) {
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
      {/* Decorative Glow */}
      <div
        className="
        absolute
        -top-16
        -right-16
        w-36
        h-36
        rounded-full
        bg-[#b88638]/10
        blur-3xl
        pointer-events-none
        "
      />

      {/* Heading */}
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
          Editorial Team
        </p>

        <h3
          className="mt-2 text-[30px] leading-tight !text-[#163629]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          About the Author
        </h3>

      </div>

      {/* Divider */}
      <div className="my-7 h-px bg-gradient-to-r from-transparent via-[#e6ddcf] to-transparent" />

      {/* Profile */}
      <div className="flex items-center gap-5">

        <div
          className="
          w-24
          h-24
          rounded-full
          overflow-hidden
          border-4
          border-[#f4ecdf]
          shadow-lg
          shrink-0
          "
        >
          {article.authorImage ? (
            <Image
              src={article.authorImage}
              alt={article.author}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          ) : (
            <div
              className="
              w-full
              h-full
              bg-[#163629]
              text-white
              flex
              items-center
              justify-center
              text-3xl
              font-bold
              "
            >
              {article.author?.charAt(0)}
            </div>
          )}
        </div>

        <div>

          <h4 className="text-xl font-semibold !text-[#163629]">
            {article.author}
          </h4>

          <p className="mt-1 text-sm font-medium uppercase tracking-[2px] !text-[#b88638]">
            Senior Real Estate Analyst
          </p>

        </div>

      </div>

      {/* Bio */}
      <p
        className="
        mt-7
        leading-8
        text-[15px]
        !text-[#666]
        "
      >
        Specializes in luxury residential markets, investment strategy,
        market intelligence, and premium real estate research across
        India's fastest-growing destinations.
      </p>

      {/* Stats */}
      <div className="mt-8 space-y-4">

        <div className="flex justify-between items-center">

          <span className="!text-[#777]">
            Experience
          </span>

          <span className="font-semibold !text-[#163629]">
            8+ Years
          </span>

        </div>

        <div className="h-px bg-[#ece7dc]" />

        <div className="flex justify-between items-center">

          <span className="!text-[#777]">
            Expertise
          </span>

          <span className="font-semibold !text-[#163629]">
            Luxury Real Estate
          </span>

        </div>

        <div className="h-px bg-[#ece7dc]" />

        <div className="flex justify-between items-center">

          <span className="!text-[#777]">
            Focus
          </span>

          <span className="font-semibold !text-[#163629]">
            Investment Advisory
          </span>

        </div>

      </div>

      {/* Button */}
      <button
        className="
        mt-9
        w-full
        h-14
        rounded-full
        border
        border-[#cfa85d]
        bg-white
        !text-[#163629]
        font-semibold
        tracking-wide
        shadow-sm
        hover:bg-[#163629]
        hover:!text-white
        hover:border-[#163629]
        transition-all
        duration-300
        "
      >
        VIEW ALL ARTICLES
      </button>
    </div>
  );
}