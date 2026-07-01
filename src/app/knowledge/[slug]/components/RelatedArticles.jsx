"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock3 } from "lucide-react";

export default function RelatedArticles({
  currentArticle,
  articles = [],
}) {
  const related = articles
    .filter(
      (item) =>
        item.slug !== currentArticle.slug &&
        item.status === "published"
    )
    .slice(0, 3);

  if (!related.length) return null;

  return (
    <section className="mt-28">

      <div className="flex items-end justify-between mb-10">

        <div>

          <p className="uppercase tracking-[4px] text-[#b88638] text-xs font-semibold">

            Continue Reading

          </p>

          <h2
            className="mt-3 text-[46px] text-[#163629]"
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            Related Knowledge
          </h2>

        </div>

        <Link
          href="/knowledge"
          className="
          hidden
          md:flex
          items-center
          gap-2
          text-[#163629]
          font-semibold
          hover:gap-3
          transition-all
          "
        >
          View All

          <ArrowRight size={18} />

        </Link>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

        {related.map((item) => (

          <Link
            key={item._id}
            href={`/knowledge/${item.slug}`}
            className="group"
          >

            <article
              className="
              overflow-hidden
              rounded-[30px]
              bg-white
              border
              border-[#ece7dc]
              shadow-[0_15px_45px_rgba(0,0,0,.05)]
              hover:-translate-y-2
              hover:shadow-[0_25px_60px_rgba(0,0,0,.08)]
              transition-all
              duration-500
              "
            >

              <div className="relative h-64 overflow-hidden">

                <Image
                  src={
                    item.featuredImage ||
                    "/knowledge/article-hero.jpg"
                  }
                  alt={item.title}
                  fill
                  unoptimized
                  className="
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-110
                  "
                />

                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b88638] via-[#e3c37d] to-[#b88638]" />

              </div>

              <div className="p-7">

                <span
                  className="
                  inline-flex
                  items-center
                  rounded-full
                  bg-[#f5ede1]
                  px-4
                  py-2
                  text-[11px]
                  uppercase
                  tracking-[2px]
                  font-semibold
                  text-[#b88638]
                  "
                >
                  {item.category}
                </span>

                <h3
                  className="
                  mt-5
                  text-[28px]
                  leading-9
                  text-[#163629]
                  group-hover:text-[#b88638]
                  transition-colors
                  "
                  style={{
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {item.title}
                </h3>

                <p className="mt-4 text-[#666] leading-7 line-clamp-2">

                  {item.shortDescription}

                </p>

                <div className="mt-7 flex items-center justify-between">

                  <div className="flex items-center gap-2 text-[#777]">

                    <Clock3 size={16} />

                    <span>

                      {item.readTime} min read

                    </span>

                  </div>

                  <span
                    className="
                    flex
                    items-center
                    gap-2
                    text-[#163629]
                    font-semibold
                    group-hover:gap-3
                    transition-all
                    "
                  >

                    Read

                    <ArrowRight size={17} />

                  </span>

                </div>

              </div>

            </article>

          </Link>

        ))}

      </div>

    </section>
  );
}