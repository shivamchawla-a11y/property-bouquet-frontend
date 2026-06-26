"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function InsightCard({ article }) {
  return (
    <motion.article
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: .3,
      }}
      className="
      group
      overflow-hidden
      rounded-[28px]
      border
      border-[#ebe4d9]
      bg-white
      shadow-sm
      hover:shadow-xl
      transition-all
      duration-300
      "
    >
      {/* IMAGE */}

      <Link
        href={`/insights/${article.slug}`}
        className="block"
      >
        <div className="relative h-[260px] overflow-hidden">

          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            className="
            object-cover
            transition-transform
            duration-700
            group-hover:scale-105
            "
          />

          <div
            className="
            absolute
            left-5
            top-5
            rounded-full
            bg-white/90
            backdrop-blur-md
            px-4
            py-2
            text-[11px]
            font-semibold
            uppercase
            tracking-[2px]
            text-[#111]
            "
          >
            {article.category}
          </div>

        </div>
      </Link>

      {/* CONTENT */}

      <div className="p-7">

        <p className="text-sm text-gray-500">

          {new Date(
            article.publishDate
          ).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}

        </p>

        <Link
          href={`/insights/${article.slug}`}
        >
          <h3
            className="
            mt-4
            text-2xl
            leading-snug
            text-[#111]
            transition
            group-hover:text-[#C89D58]
            "
            style={{
              fontFamily:
                "Georgia, serif",
            }}
          >
            {article.title}
          </h3>
        </Link>

        <p
          className="
          mt-5
          text-gray-600
          leading-7
          line-clamp-3
          "
        >
          {article.shortDescription}
        </p>

        <Link
          href={`/insights/${article.slug}`}
          className="
          mt-8
          inline-flex
          items-center
          gap-2
          text-[#C89D58]
          font-medium
          group/link
          "
        >
          Read More

          <ArrowRight
            size={17}
            className="
            transition-transform
            duration-300
            group-hover/link:translate-x-1
            "
          />

        </Link>

      </div>

    </motion.article>
  );
}