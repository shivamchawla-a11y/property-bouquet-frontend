"use client";

import Link from "next/link";
import Image from "next/image";

import {
  Clock3,
  CalendarDays,
  User,
  ChevronRight,
} from "lucide-react";

export default function ArticleHero({ article }) {
  const publishDate = article?.publishDate
    ? new Date(article.publishDate).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "";

  return (
    <section className="bg-gradient-to-b from-[#f7f4ee] via-[#faf8f4] to-[#fcfbf8] pt-28 pb-24">

      <div className="max-w-[1450px] mx-auto px-5 lg:px-8 scale-[0.95] origin-top">

        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-20 items-center">

          {/* LEFT */}

          <div>

            {/* Breadcrumb */}

            <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#8c8c8c]">

              <Link
                href="/"
                className="hover:text-[#163629] transition"
              >
                Home
              </Link>

              <ChevronRight size={14} />

              <Link
                href="/knowledge"
                className="hover:text-[#163629] transition"
              >
                Knowledge Centre
              </Link>

              <ChevronRight size={14} />

              <span className="text-[#163629] font-medium line-clamp-1">

                {article?.title}

              </span>

            </div>

            {/* GOLD LABEL */}

            <div className="flex items-center gap-4 mt-6">

              <div className="w-16 h-[2px] rounded-full bg-[#b88638]" />

              <span
                className="
                uppercase
                tracking-[4px]
                text-[#b88638]
                text-xs
                font-semibold
                "
              >
                Property Bouquet
              </span>

            </div>

            {/* CATEGORY */}

            <div className="mt-5">

              <span
                className="
                inline-flex
                items-center
                rounded-full
                bg-[#f5ede1]
                text-[#b88638]
                px-5
                py-2
                uppercase
                tracking-[3px]
                text-[11px]
                font-semibold
                "
              >
                {article?.category}
              </span>

            </div>

            {/* TITLE */}

            <h1
  className="
  mt-6
  text-[26px]
  sm:text-[32px]
  md:text-[36px]
  lg:text-[40px]
  xl:text-[44px]
  leading-[1.15]
  tracking-[-0.5px]
  text-[#163629]
  max-w-[680px]
  "
  style={{ fontFamily: "Georgia, serif" }}
>
  {article?.title}
</h1>

            {/* DESCRIPTION */}

            <p
              className="
              mt-6
              max-w-[680px]
              text-[17px]
              md:text-[18px]
              leading-8
              text-[#666]
              "
            >
              {article?.shortDescription}
            </p>

            {/* META CARD */}

              <div
              className="
              mt-8
              rounded-[24px]
              border
              border-[#ece7dc]
              bg-white/75
              backdrop-blur
              p-6
              shadow-[0_10px_30px_rgba(0,0,0,.05)]
              "
            >
              <div className="flex flex-wrap items-center gap-10">

                {/* AUTHOR */}

                <div className="flex items-center gap-4">

                  <div
                    className="
                    w-14
                    h-14
                    rounded-full
                    bg-[#163629]
                    text-white
                    flex
                    items-center
                    justify-center
                    "
                  >
                    <User size={22} />
                  </div>

                  <div>

                    <p className="font-semibold text-[#163629]">

                      {article?.author}

                    </p>

                    <p className="text-sm text-[#999]">

                      Property Bouquet Research

                    </p>

                  </div>

                </div>

                {/* DATE */}

                <div className="flex items-center gap-3 text-[#555]">

                  <CalendarDays
                    size={18}
                    className="text-[#b88638]"
                  />

                  <span>

                    {publishDate}

                  </span>

                </div>

                {/* READ TIME */}

                <div className="flex items-center gap-3 text-[#555]">

                  <Clock3
                    size={18}
                    className="text-[#b88638]"
                  />

                  <span>

                    {article?.readTime} min read

                  </span>

                </div>

              </div>

            </div>

            {/* GOLD DIVIDER */}

            <div className="mt-8 flex items-center gap-4">

              <div className="w-24 h-[2px] rounded-full bg-[#b88638]" />

              <div className="flex-1 h-px bg-[#e6ddd1]" />

            </div>

          </div>

          {/* RIGHT IMAGE */}
          {/* RIGHT IMAGE */}
          {/* RIGHT IMAGE */}

          {/* RIGHT IMAGE */}

<div
  className="
    relative
    h-[640px]
    rounded-[38px]
    overflow-hidden
    border
    border-[#e8dfd2]
    bg-[#f7f4ef]
    shadow-[0_40px_90px_rgba(0,0,0,.12)]
  "
>
  {/* GOLD TOP BAR */}

  <div
    className="
      absolute
      top-0
      left-0
      right-0
      h-1
      z-20
      bg-gradient-to-r
      from-[#b88638]
      via-[#e3c37d]
      to-[#b88638]
    "
  />

  {/* MAIN IMAGE */}

  <div className="relative w-full h-full flex items-center justify-center p-8">

    <Image
  src={article?.featuredImage || "/knowledge/article-hero.jpg"}
  alt={article?.title}
  width={800}
  height={600}
  priority
  className="
    w-full
    h-auto
    object-cover
    rounded-[18px]
    shadow-[0_18px_45px_rgba(0,0,0,.15)]
  "
/>

  </div>

  {/* GOLD CORNER DECOR */}

  <div
    className="
      absolute
      top-8
      right-8
      w-20
      h-20
      rounded-full
      border
      border-[#d7b267]/40
    "
  />

  <div
    className="
      absolute
      top-12
      right-12
      w-12
      h-12
      rounded-full
      border
      border-[#d7b267]/30
    "
  />

</div>

        </div>

      </div>

    </section>

  );
}