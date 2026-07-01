"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  ArrowRight,
  Clock3,
  CalendarDays,
} from "lucide-react";

export default function KnowledgeGrid({
  articles = [],
}) {
  return (
    <section>

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">

        <div>

          <p className="uppercase tracking-[4px] text-[#b88638] text-xs font-semibold">
            Knowledge Library
          </p>

          <h2
            className="mt-3 text-5xl text-[#163629]"
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            Explore Knowledge Articles
          </h2>

          <p className="mt-4 text-[#6f6f6f] max-w-2xl leading-8">
            Curated articles, buying guides,
            investment strategies, legal advice and
            market insights to help you make
            informed real estate decisions.
          </p>

        </div>

        <button
          className="
          hidden
          md:flex
          items-center
          gap-2
          rounded-full
          border
          border-[#e6dfd4]
          bg-white
          px-5
          py-3
          text-[#163629]
          shadow-sm
          "
        >
          Latest

          <ChevronDown size={18} />

        </button>

      </div>

      {/* Grid */}

      {articles.length === 0 ? (

        <div
          className="
          rounded-[32px]
          bg-white
          border
          border-[#ece7dc]
          py-24
          text-center
          "
        >

          <h3
            className="text-3xl text-[#163629]"
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            No Articles Found
          </h3>

          <p className="mt-4 text-[#777]">
            Articles will appear here once they are
            published.
          </p>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {articles.map((article) => {

            const publishDate =
              article.publishDate
                ? new Date(
                    article.publishDate
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "";

            return (

              <Link
                key={article._id}
                href={`/knowledge/${article.slug}`}
                className="group"
              >

                <article
                  className="
                  h-full
                  overflow-hidden
                  rounded-[32px]
                  bg-white
                  border
                  border-[#ebe5da]
                  shadow-[0_12px_40px_rgba(0,0,0,.05)]
                  hover:shadow-[0_30px_70px_rgba(0,0,0,.10)]
                  hover:-translate-y-2
                  transition-all
                  duration-500
                  "
                >

                  {/* Image */}

                  <div className="relative h-64 overflow-hidden">

                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      unoptimized
                      className="
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-110
                      "
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    <span
                      className="
                      absolute
                      top-5
                      left-5
                      rounded-full
                      bg-white/95
                      backdrop-blur
                      px-4
                      py-2
                      text-[11px]
                      uppercase
                      tracking-[2px]
                      font-semibold
                      text-[#163629]
                      "
                    >
                      {article.category}
                    </span>

                  </div>

                  {/* Content */}

                  <div className="relative p-7">

                    {/* Gold line */}

                    <div className="w-14 h-[2px] bg-[#b88638] rounded-full mb-6" />

                    <h3
                      className="
                      text-[28px]
                      leading-[38px]
                      text-[#163629]
                      group-hover:text-[#b88638]
                      transition-colors
                      "
                      style={{
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {article.title}
                    </h3>

                    <p className="mt-5 text-[#666] leading-8 line-clamp-3">

                      {article.shortDescription}

                    </p>

                    {/* Footer */}

                    <div
                      className="
                      mt-8
                      pt-6
                      border-t
                      border-[#efe8dc]
                      flex
                      items-center
                      justify-between
                      "
                    >

                      <div className="space-y-2 text-sm text-[#777]">

                        <div className="flex items-center gap-2">

                          <Clock3
                            size={15}
                            className="text-[#b88638]"
                          />

                          {article.readTime} min read

                        </div>

                        <div className="flex items-center gap-2">

                          <CalendarDays
                            size={15}
                            className="text-[#b88638]"
                          />

                          {publishDate}

                        </div>

                      </div>

                      <div
                        className="
                        w-12
                        h-12
                        rounded-full
                        bg-[#163629]
                        text-white
                        flex
                        items-center
                        justify-center
                        group-hover:bg-[#b88638]
                        group-hover:rotate-45
                        transition-all
                        duration-300
                        "
                      >

                        <ArrowRight size={18} />

                      </div>

                    </div>

                  </div>

                </article>

              </Link>

            );

          })}

        </div>

      )}

    </section>
  );
}