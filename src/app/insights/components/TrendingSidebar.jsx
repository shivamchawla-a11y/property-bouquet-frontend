"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TrendingSidebar({
  articles = [],
}) {
  return (
    <div
      className="
      mt-8
      rounded-[28px]
      border
      border-[#ebe4d9]
      bg-white
      p-7
      "
    >
      <h3
        className="text-3xl text-[#111]"
        style={{
          fontFamily: "Georgia, serif",
        }}
      >
        Trending Now
      </h3>

      <div className="mt-7 space-y-6">
        {articles.slice(0, 5).map(
          (article, index) => (
            <Link
              href={`/insights/${article.slug}`}
              key={article._id}
              className="group flex gap-4"
            >
              <div
                className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                bg-[#C89D58]
                text-xs
                font-semibold
                text-white
                "
              >
                {index + 1}
              </div>

              <div className="relative h-20 w-24 overflow-hidden rounded-xl shrink-0">
                <Image
                  src={article.heroImage}
                  alt={article.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex-1">
                <h4 className="text-sm font-medium leading-6 text-[#222] group-hover:text-[#C89D58] transition">
                  {article.title}
                </h4>

                <p className="mt-1 text-xs text-gray-500">
                  {new Date(
                    article.publishDate
                  ).toLocaleDateString()}
                </p>
              </div>
            </Link>
          )
        )}
      </div>

      <Link
        href="/insights"
        className="
        mt-8
        flex
        items-center
        justify-center
        gap-3
        rounded-xl
        border
        border-[#C89D58]/40
        py-4
        font-medium
        text-[#C89D58]
        hover:bg-[#C89D58]
        hover:text-white
        transition
        "
      >
        VIEW ALL ARTICLES

        <ArrowRight size={18} />
      </Link>
    </div>
  );
}