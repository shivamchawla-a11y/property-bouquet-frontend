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

      <div className="max-w-[1450px] mx-auto px-5 lg:px-8">

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

            <div className="flex items-center gap-5 mt-10">

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

            <div className="mt-8">

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
              mt-8
              text-[46px]
              md:text-[58px]
              xl:text-[68px]
              leading-[1.05]
              tracking-[-1px]
              text-[#163629]
              max-w-[760px]
              "
              style={{
                fontFamily: "Georgia, serif",
              }}
            >
              {article?.title}
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
              mt-9
              max-w-[680px]
              text-[20px]
              leading-10
              text-[#666]
              "
            >
              {article?.shortDescription}
            </p>

            {/* META CARD */}

            <div
              className="
              mt-12
              rounded-[32px]
              border
              border-[#ece7dc]
              bg-white/75
              backdrop-blur
              p-8
              shadow-[0_15px_40px_rgba(0,0,0,.05)]
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

            <div className="mt-12 flex items-center gap-6">

              <div className="w-24 h-[2px] rounded-full bg-[#b88638]" />

              <div className="flex-1 h-px bg-[#e6ddd1]" />

            </div>

          </div>

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
            bg-[#f6f2ea]
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
    flex
    items-center
    justify-center
  "
>
  {/* Blurred Background */}
  <Image
    src={
      article?.featuredImage ||
      "/knowledge/article-hero.jpg"
    }
    alt=""
    fill
    priority
    className="
      object-cover
      blur-2xl
      scale-110
      opacity-30
    "
  />

  {/* Main Image */}
  <div className="relative z-10 w-full h-full p-8 flex items-center justify-center">
    <Image
      src={
        article?.featuredImage ||
        "/knowledge/article-hero.jpg"
      }
      alt={article?.title}
      fill={false}
      width={900}
      height={700}
      priority
      className="
        max-w-full
        max-h-full
        w-auto
        h-auto
        object-contain
        rounded-[22px]
        shadow-[0_25px_60px_rgba(0,0,0,.18)]
      "
    />
  </div>

  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" />
</div>

            {/* IMAGE OVERLAY */}

            <div
              className="
              absolute
              inset-0
              bg-gradient-to-tr
              from-black/15
              via-transparent
              to-white/20
              "
            />

            {/* FLOATING CARD */}

            <div
              className="
              absolute
              bottom-8
              left-8
              z-20
              bg-white/90
              backdrop-blur-xl
              rounded-[24px]
              border
              border-[#ece7dc]
              shadow-2xl
              px-7
              py-6
              max-w-[320px]
              "
            >

              <p
                className="
                uppercase
                tracking-[3px]
                text-[11px]
                font-semibold
                text-[#b88638]
                "
              >
                Luxury Knowledge
              </p>

              <h4
                className="
                mt-3
                text-[28px]
                leading-8
                text-[#163629]
                "
                style={{
                  fontFamily: "Georgia, serif",
                }}
              >
                Expert Verified
                <br />
                Property Insights
              </h4>

              <div className="flex items-center gap-3 mt-6">

                <div className="w-10 h-[2px] rounded-full bg-[#b88638]" />

                <span className="text-sm text-[#666]">

                  Trusted Research

                </span>

              </div>

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