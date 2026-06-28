"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function KnowledgeCard({
  image,
  badge,
  title,
  description,
}) {
  return (
    <article
      className="
      bg-white
      rounded-2xl
      overflow-hidden
      border
      shadow-sm
      hover:shadow-xl
      transition-all
      duration-300
      group
      "
    >
      <div className="relative">

        <img
          src={image}
          alt={title}
          className="
          w-full
          h-60
          object-cover
          transition-transform
          duration-500
          group-hover:scale-105
          "
        />

        <span
          className="
          absolute
          top-4
          left-4
          bg-[#f7edd1]
          text-[#a87a14]
          text-xs
          font-semibold
          uppercase
          tracking-wide
          px-3
          py-1.5
          rounded-md
          "
        >
          {badge}
        </span>

      </div>

      <div className="p-6">

        <h3
          className="
          text-[30px]
          leading-snug
          font-serif
          text-[#111]
          group-hover:text-[#b88a24]
          transition
          "
        >
          {title}
        </h3>

        <p
          className="
          mt-4
          text-gray-600
          leading-8
          "
        >
          {description}
        </p>

        <Link
          href="#"
          className="
          inline-flex
          items-center
          gap-2
          mt-6
          font-medium
          text-[#b88a24]
          hover:gap-3
          transition-all
          "
        >
          Read More

          <ArrowRight size={18} />

        </Link>

      </div>
    </article>
  );
}