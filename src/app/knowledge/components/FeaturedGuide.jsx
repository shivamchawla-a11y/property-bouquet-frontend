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
  // Featured article first, otherwise latest article
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
      border-[#e9e1d5]
      bg-white
      shadow-[0_25px_70px_rgba(0,0,0,.07)]
      "
    >
      {/* Gold Glow */}
      <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#c9a64b]/10 blur-3xl" />
      <div className="absolute -left-24 bottom-0 w-80 h-80 rounded-full bg-[#163629]/5 blur-3xl" />

      <div className="grid lg:grid-cols-2">

        {/* LEFT */}

        <div className="relative z-10 p-10 lg:p-14 xl:p-16 flex flex-col justify-center">

          {/* Badge */}

          <div className="flex items-center gap-3">

            <span
              className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#163629]
              px-5
              py-2
              text-[11px]
              uppercase
              tracking-[3px]
              font-semibold
              text-white
              "
            >
              <Sparkles size={14} />
              Featured Guide
            </span>

            <div className="h-px flex-1 bg-gradient-to-r from-[#c9a64b] to-transparent" />

          </div>

          {/* Category */}

          <p className="mt-10 uppercase tracking-[3px] text-[#b88638] text-xs font-semibold">
            {featured.category}
          </p>

          {/* Title */}

          <h2
            className="
            mt-5
            text-4xl
            lg:text-5xl
            xl:text-[52px]
            leading-tight
            text-[#163629]
            "
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            {featured.title}
          </h2>

          {/* Description */}

          <p className="mt-7 text-lg leading-9 text-[#666] max-w-[620px]">
            {featured.shortDescription}
          </p>

          {/* Meta */}

          <div className="mt-10 flex flex-wrap gap-7 text-[#666]">

            <div className="flex items-center gap-3">

              <Clock3
                size={18}
                className="text-[#b88638]"
              />

              <span>
                {featured.readTime} min read
              </span>

            </div>

            <div className="flex items-center gap-3">

              <CalendarDays
                size={18}
                className="text-[#b88638]"
              />

              <span>
                {publishDate}
              </span>

            </div>

          </div>

          {/* Button */}

          <div className="mt-12">

            <Link
              href={`/knowledge/${featured.slug}`}
              className="
              inline-flex
              items-center
              gap-3
              rounded-full
              bg-[#163629]
              px-8
              py-4
              text-white
              font-medium
              hover:bg-[#214a39]
              transition-all
              duration-300
              hover:gap-5
              "
            >
              Read Complete Guide

              <ArrowRight size={18} />

            </Link>

          </div>

        </div>

        {/* RIGHT */}

        <div className="relative min-h-[520px]">

          <Image
            src={featured.featuredImage}
            alt={featured.title}
            fill
            priority
            unoptimized
            className="
            object-cover
            transition-transform
            duration-700
            hover:scale-105
            "
          />

          {/* Overlay */}

          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/60" />

          {/* Gold Border */}

          <div
            className="
            absolute
            inset-6
            rounded-[28px]
            border
            border-[#c9a64b]/30
            pointer-events-none
            "
          />

        </div>

      </div>
    </section>
  );
}