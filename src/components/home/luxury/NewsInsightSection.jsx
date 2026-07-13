"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  TrendingUp,
  Landmark,
  Building2,
  Briefcase,
  CalendarDays,
  ChevronRight,
  BadgeDollarSign,
  ShieldCheck,
  Globe2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";


const advisoryPoints = [
  "Asset Structuring",
  "NRI & Global Investor Desk",
  "Portfolio Diversification",
  "Off-Market Access",
];

export default function LuxuryInsightsSection({
  onConsultationClick,
}) {

  const [investment, setInvestment] = useState(100000000); // 10 Cr
const [years, setYears] = useState(5);
const [appreciation, setAppreciation] = useState(20);
const [latestInsights, setLatestInsights] =
  useState([]);
  const [knowledgeArticles, setKnowledgeArticles] = useState([]);

const projectedValue =
  investment *
  Math.pow(
    1 + appreciation / 100,
    years
  );

const totalReturns =
  projectedValue - investment;

const roi =
  ((projectedValue - investment) /
    investment) *
  100;

  const formatCurrency = (value) => {
  if (value >= 10000000) {
    return `₹ ${(value / 10000000).toFixed(2)} Cr`;
  }

  if (value >= 100000) {
    return `₹ ${(value / 100000).toFixed(2)} L`;
  }

  return `₹ ${value.toLocaleString("en-IN")}`;
};

useEffect(() => {
  fetchInsights();
}, []);

const fetchInsights = async () => {
  try {
    const res = await fetch(
      "/api/news",
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (res.ok) {
      const latest =
        data.data
          ?.filter(
            (item) =>
              item.status === "published" &&
              !item.isDeleted
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt) -
              new Date(a.createdAt)
          )
          .slice(0, 3) || [];

      setLatestInsights(latest);
    }
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  const fetchKnowledge = async () => {
    try {
      const res = await fetch(
        "/api/knowledge",
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (data.success) {
        setKnowledgeArticles(
          data.data
            .filter(
              (item) =>
                item.status === "published" &&
                !item.isDeleted
            )
            .slice(0, 5)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchKnowledge();
}, []);

const formatDate = (date) => {
  const d = new Date(date);

  return {
    day: d.getDate(),
    month: d
      .toLocaleString("en-US", {
        month: "short",
      })
      .toUpperCase(),
  };
};

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
                  const date = formatDate(item.createdAt);

                  return (
                    <Link
                      key={item._id}
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

                          <h4 className="text-[15px] leading-[1.55] text-[#171717] font-medium max-w-[320px] transition-all duration-300 group-hover:text-[#b98b3c]">
                            {item.title}
                          </h4>

                          <div className="flex items-center gap-3 mt-2">

                            <p className="text-[12px] text-black/45">
                              6 Min Read
                            </p>

                            <div className="w-1 h-1 rounded-full bg-black/25" />

                            <p className="text-[12px] text-[#b98b3c] font-medium">
                              {item.category}
                            </p>

                          </div>

                        </div>

                      </div>
                    </Link>
                  );
                })}

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
              src="/market1.webp"
              alt="Luxury Interior"
              fill
              sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
              className="absolute inset-0 object-cover object-center"
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