"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const LATEST_NEWS_API = "/api/news/latest";

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

export default function NewsInsightSection() {
  const [latestInsights, setLatestInsights] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchLatestNews = async () => {
      try {
        const response = await fetch(LATEST_NEWS_API, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
          next: {
            revalidate: 300,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch latest news: ${response.status}`
          );
        }

        const result = await response.json();

        if (!result?.success || !Array.isArray(result.data)) {
          setLatestInsights([]);
          return;
        }

        // The backend should already return only the latest
        // three published, non-deleted news articles.
        setLatestInsights(
          result.data
            .filter(
              (item) =>
                item &&
                item.status === "published" &&
                item.isDeleted !== true &&
                item.slug
            )
            .slice(0, 3)
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Latest news loading error:", error);
          setLatestInsights([]);
        }
      }
    };

    fetchLatestNews();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section className="px-5 md:px-8 xl:px-10 py-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.08)]">
          <div className="grid xl:grid-cols-[0.95fr_1.18fr]">
            {/* NEWS & INSIGHTS */}
            <div className="bg-[#fbf9f5] border-r border-black/10 px-8 py-8 xl:px-10 xl:py-10 flex flex-col justify-between">
              <div>
                <p className="text-[10px] tracking-[2px] uppercase text-black/55 font-semibold mb-7">
                  News & Insights
                </p>

                <h2
                  className="text-[34px] xl:text-[38px] leading-[1.12] text-[#171717] font-medium mb-10"
                  style={{
                    fontFamily: "Georgia, Times New Roman, serif",
                  }}
                >
                  Latest Luxury
                  <br />
                  Market Updates.
                </h2>

                <div className="space-y-7">
                  {latestInsights.map((item) => {
                    const date = formatDate(
                      item.publishDate || item.createdAt
                    );

                    return (
                      <Link
                        key={item._id || item.slug}
                        href={`/insights/${item.slug}`}
                        className="block"
                      >
                        <div className="flex gap-4 group cursor-pointer">
                          {/* DATE */}
                          <div className="w-[62px] h-[62px] rounded-[12px] bg-[#f1ece3]/90 backdrop-blur-xl border border-black/5 flex flex-col items-center justify-center shrink-0 transition-all duration-300 group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] group-hover:-translate-y-[2px]">
                            <span className="text-[24px] leading-none font-semibold text-[#171717]">
                              {date.day}
                            </span>

                            <span className="text-[9px] tracking-[1.4px] uppercase text-black/50 mt-1">
                              {date.month}
                            </span>
                          </div>

                          {/* TEXT */}
                          <div className="pt-[2px]">
                            <h3 className="text-[15px] leading-[1.55] text-[#171717] font-medium max-w-[320px] transition-all duration-300 group-hover:text-[#b98b3c]">
                              {item.title}
                            </h3>

                            <div className="flex items-center gap-3 mt-2">
                              <p className="text-[12px] text-black/45">
                                {item.readTime
                                  ? `${item.readTime} Min Read`
                                  : "Latest Update"}
                              </p>

                              <div className="w-1 h-1 rounded-full bg-black/25" />

                              <p className="text-[12px] text-[#b98b3c] font-medium">
                                {item.category || "Real Estate"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}

                  {latestInsights.length === 0 && (
                    <p className="text-sm leading-7 text-black/50">
                      The latest market updates will appear here soon.
                    </p>
                  )}
                </div>
              </div>

              <Link
                href="/insights"
                className="group mt-10 flex items-center gap-2 text-[#b98b3c] text-[12px] font-semibold uppercase tracking-[1px] w-fit"
              >
                View All News

                <ArrowRight
                  size={13}
                  className="group-hover:translate-x-1 transition"
                />
              </Link>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative min-h-[540px] overflow-hidden bg-black">
              <Image
                src="/market11.png"
                alt="Luxury interior and premium real estate"
                fill
                sizes="(max-width: 1279px) 100vw, 55vw"
                className="absolute inset-0 object-cover object-center"
                priority={false}
              />

              {/* PREMIUM OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

              {/* SOFT SHADOW */}
              <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.18)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}