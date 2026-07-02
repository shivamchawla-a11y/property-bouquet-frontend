"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  CalendarDays,
  Sparkles,
} from "lucide-react";

export default function FeaturedGuide({
  articles = [],
}) {
  const featured =
    articles.find((a) => a.featured) ||
    articles[0];

  if (!featured) return null;

  const publishDate = featured.publishDate
    ? new Date(
        featured.publishDate
      ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <section
      className="
      relative
      overflow-hidden
      rounded-[36px]
      border
      border-[#ece4d8]
      bg-[#fcfbf8]
      shadow-[0_30px_80px_rgba(0,0,0,.08)]
      "
    >
      {/* Background Glow */}

      <div className="absolute -right-32 -top-32 w-[420px] h-[420px] rounded-full bg-[#c8a34d]/8 blur-3xl" />

      <div className="absolute -left-20 bottom-0 w-[300px] h-[300px] rounded-full bg-[#163629]/5 blur-3xl" />

      <div className="grid lg:grid-cols-[1.05fr_1.15fr] items-center">

        {/* LEFT */}

        <div className="relative z-10 px-8 py-10 lg:px-14 xl:px-16 lg:py-14">

          {/* Badge */}

          <div className="flex items-center gap-4">

            <span
              className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#163629]
              px-5
              py-2
              text-[10px]
              uppercase
              tracking-[3px]
              font-semibold
              text-white
              "
            >
              <Sparkles size={13} />
              Featured Guide
            </span>

            <div className="h-px flex-1 bg-gradient-to-r from-[#c9a64b] to-transparent" />

          </div>

          {/* Category */}

          <p className="mt-8 text-[11px] uppercase tracking-[3px] font-semibold text-[#b88638]">
            {featured.category}
          </p>

          {/* Title */}

          <h2
            className="
            mt-4
            text-[34px]
            lg:text-[44px]
            xl:text-[50px]
            leading-[1.12]
            font-light
            text-[#163629]
            "
            style={{
              fontFamily: "Cormorant Garamond, serif",
            }}
          >
            {featured.title}
          </h2>

          {/* Description */}

          <p className="mt-6 text-[17px] leading-8 text-[#6d6d6d] max-w-[560px]">
            {featured.shortDescription}
          </p>

          {/* Meta */}

          <div className="mt-8 flex flex-wrap gap-8 text-[14px] text-[#666]">

            <div className="flex items-center gap-3">

              <Clock3
                size={16}
                className="text-[#b88638]"
              />

              {featured.readTime} min read

            </div>

            <div className="flex items-center gap-3">

              <CalendarDays
                size={16}
                className="text-[#b88638]"
              />

              {publishDate}

            </div>

          </div>

          {/* CTA */}

          <div className="mt-10">

            <Link
              href={`/knowledge/${featured.slug}`}
              className="
              inline-flex
              items-center
              gap-3
              rounded-full
              bg-[#163629]
              px-8
              h-[54px]
              text-white
              font-medium
              hover:bg-[#214a39]
              transition-all
              duration-300
              hover:gap-5
              shadow-lg
              "
            >
              Read Complete Guide

              <ArrowRight size={18} />

            </Link>

          </div>

        </div>

        {/* RIGHT */}

        <div className="relative p-6 lg:p-8">

          <div
            className="
            relative
            h-[340px]
            lg:h-[500px]
            rounded-[30px]
            overflow-hidden
            shadow-[0_30px_80px_rgba(0,0,0,.18)]
            "
          >

            <div className="relative rounded-[30px] overflow-hidden">
  <Image
    src={featured.featuredImage}
    alt={featured.title}
    width={900}
    height={1100}
    priority
    unoptimized
    className="
      w-full
      h-auto
      object-contain
    "
  />
</div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

            <div
              className="
              absolute
              inset-5
              rounded-[24px]
              border
              border-white/20
              pointer-events-none
              "
            />

          </div>

        </div>

      </div>
    </section>
  );
}