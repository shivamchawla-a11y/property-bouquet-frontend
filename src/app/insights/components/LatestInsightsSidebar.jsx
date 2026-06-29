"use client";

import Link from "next/link";
import Image from "next/image";

export default function LatestInsightsSidebar({
  articles,
  currentSlug,
}) {
  const latest = articles
    .filter((a) => a.slug !== currentSlug)
    .slice(0, 4);

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
          Editorial Picks
        </p>

        <h3
          className="mt-2 text-[30px] leading-tight !text-[#163629]"
          style={{
            fontFamily: "Georgia, serif",
          }}
        >
          Latest Insights
        </h3>

      </div>

      {/* Divider */}

      <div className="my-7 h-px bg-gradient-to-r from-transparent via-[#e6ddcf] to-transparent" />

      {/* Articles */}

      <div className="space-y-5">

        {latest.map((item, index) => (

          <Link
            key={item.slug}
            href={`/property-insights/${item.slug}`}
            className="
            group
            block
            rounded-2xl
            p-3
            transition-all
            duration-300
            hover:bg-[#f8f4ec]
            hover:shadow-md
            "
          >

            <div className="flex gap-4">

              <div
                className="
                relative
                w-[105px]
                h-[82px]
                shrink-0
                overflow-hidden
                rounded-2xl
                "
              >

                <Image
                  src={item.featuredImage}
                  fill
                  alt={item.title}
                  className="
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-105
                  "
                />

              </div>

              <div className="flex flex-col justify-between">

                <span
                  className="
                  text-[11px]
                  uppercase
                  tracking-[2px]
                  font-semibold
                  !text-[#b88638]
                  "
                >
                  Article {index + 1}
                </span>

                <h4
                  className="
                  mt-2
                  text-[16px]
                  leading-7
                  font-semibold
                  !text-[#163629]
                  group-hover:!text-[#b88638]
                  transition-colors
                  "
                >
                  {item.title}
                </h4>

                <p className="mt-3 text-sm !text-[#777]">
                  {item.readTime} min read
                </p>

              </div>

            </div>

          </Link>

        ))}

      </div>

      {/* Button */}

      <Link
        href="/property-insights"
        className="
        mt-8
        flex
        items-center
        justify-center
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
        VIEW ALL INSIGHTS →
      </Link>
    </div>
  );
}