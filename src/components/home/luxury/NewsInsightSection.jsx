
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const NEWS_API = "/api/news/latest";

// ============================================================
// DATE FORMATTER
// ============================================================

const formatDate = (date) => {
  if (!date) {
    return {
      day: "--",
      month: "---",
    };
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return {
      day: "--",
      month: "---",
    };
  }

  return {
    day: parsedDate.getDate(),
    month: parsedDate
      .toLocaleString("en-US", {
        month: "short",
      })
      .toUpperCase(),
  };
};

// ============================================================
// NEWS INSIGHTS SECTION
// ============================================================

export default function NewsInsightSection() {
  const [latestInsights, setLatestInsights] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLatestNews() {
      try {
        const response = await fetch(NEWS_API, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            result?.message ||
              `Failed to fetch news: HTTP ${response.status}`
          );
        }

        const articles = Array.isArray(result?.data)
          ? result.data
          : [];

        // Backend already returns the latest three
        // published, non-deleted articles.
        // No browser-side filtering or sorting needed.

        if (!controller.signal.aborted) {
          setLatestInsights(articles);
        }

      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(
            "Latest news loading error:",
            error
          );

          if (!controller.signal.aborted) {
            setLatestInsights([]);
          }
        }
      }
    }

    fetchLatestNews();

    return () => controller.abort();
  }, []);

  return (
    <section className="px-5 py-6 md:px-8 xl:px-10">
      <div className="mx-auto max-w-[1440px]">

        <div className="overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.08)]">

          <div className="grid xl:grid-cols-[0.95fr_1.18fr]">

            {/* ================================================= */}
            {/* NEWS & INSIGHTS */}
            {/* ================================================= */}

            <div className="flex flex-col justify-between border-r border-black/10 bg-[#fbf9f5] px-8 py-8 xl:px-10 xl:py-10">

              <div>

                <p className="mb-7 text-[10px] font-semibold uppercase tracking-[2px] text-black/55">
                  News &amp; Insights
                </p>

                <h2
                  className="mb-10 text-[34px] font-medium leading-[1.12] text-[#171717] xl:text-[38px]"
                  style={{
                    fontFamily:
                      "Georgia, Times New Roman, serif",
                  }}
                >
                  Latest Luxury
                  <br />
                  Market Updates.
                </h2>

                {/* NEWS ARTICLES */}

                <div className="space-y-7">

                  {latestInsights.map((item) => {
                    const date = formatDate(
                      item.publishDate || item.createdAt
                    );

                    return (
                      <Link
                        key={item._id || item.slug}
                        href={`/insights/${item.slug}`}
                        prefetch={false}
                        className="block"
                      >

                        <div className="group flex cursor-pointer gap-4">

                          {/* DATE BADGE */}

                          <div className="flex h-[62px] w-[62px] shrink-0 flex-col items-center justify-center rounded-[12px] border border-black/5 bg-[#f1ece3]/90 backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-[2px] group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]">

                            <span className="text-[24px] font-semibold leading-none text-[#171717]">
                              {date.day}
                            </span>

                            <span className="mt-1 text-[9px] uppercase tracking-[1.4px] text-black/50">
                              {date.month}
                            </span>

                          </div>

                          {/* ARTICLE DETAILS */}

                          <div className="pt-[2px]">

                            <h3 className="max-w-[320px] text-[15px] font-medium leading-[1.55] text-[#171717] transition-all duration-300 group-hover:text-[#b98b3c]">
                              {item.title ||
                                "Property Market Update"}
                            </h3>

                            <div className="mt-2 flex items-center gap-3">

                              <p className="text-[12px] text-black/45">
                                {item.readTime
                                  ? `${item.readTime} Min Read`
                                  : "Latest Update"}
                              </p>

                              <div className="h-1 w-1 rounded-full bg-black/25" />

                              <p className="text-[12px] font-medium text-[#b98b3c]">
                                {item.category ||
                                  "Real Estate"}
                              </p>

                            </div>

                          </div>

                        </div>

                      </Link>
                    );
                  })}

                  {/* EMPTY STATE */}

                  {latestInsights.length === 0 && (
                    <p className="text-sm leading-7 text-black/50">
                      The latest market updates will appear here soon.
                    </p>
                  )}

                </div>

              </div>

              {/* VIEW ALL */}

              <Link
                href="/insights"
                prefetch={false}
                className="group mt-10 flex w-fit items-center gap-2 text-[12px] font-semibold uppercase tracking-[1px] text-[#b98b3c]"
              >
                View All News

                <ArrowRight
                  size={13}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

            </div>

            {/* ================================================= */}
            {/* RIGHT IMAGE */}
            {/* ================================================= */}

            <div className="relative min-h-[540px] overflow-hidden bg-black">

              <Image
                src="/market11.png"
                alt="Luxury interior and premium real estate"
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 100vw, 55vw"
                className="object-cover object-center"
                priority={false}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.18)]" />

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
