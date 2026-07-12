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
      "https://property-bouquet-backend.onrender.com/api/news",
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
        "https://property-bouquet-backend.onrender.com/api/knowledge",
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

      <div className="relative overflow-hidden rounded-[40px] border border-white/30 bg-[#f8f5ef] shadow-[0_35px_100px_rgba(0,0,0,0.08)]">

        {/* BACKGROUND GLOWS */}
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-[#c89d58]/10 rounded-full blur-3xl" />

        <div className="absolute bottom-[-180px] right-[-120px] w-[420px] h-[420px] bg-emerald-950/10 rounded-full blur-3xl" />

        {/* GRID LINES */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:38px_38px]" />

        {/* TOP CONTENT */}
        <div className="relative z-10 text-center px-6 md:px-10 pt-16 md:pt-20 pb-14">

          {/* BADGE */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-2xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.05)]">

            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-[#c89d58]" />
              <div className="absolute inset-0 rounded-full bg-[#c89d58] animate-ping opacity-60" />
            </div>

            <p className="text-[10px] tracking-[3px] uppercase text-black/55 font-semibold">
              Real Estate Decoded
            </p>

          </div>

          {/* HEADING */}
          <h2
            className="mt-8 text-[40px] md:text-[58px] xl:text-[66px] leading-[1.05] tracking-[-2px] text-[#161616]"
            style={{
              fontFamily: "Georgia, Times New Roman, serif",
            }}
          >
            Clarity. Knowledge.
            <br />

            <span className="text-[#b98b3c]">
              Better Decisions
            </span>

          </h2>

          {/* DESC */}
          <p className="mt-7 max-w-[760px] mx-auto text-[14px] md:text-[15px] leading-[2] text-black/55">
            Discover premium insights, luxury investment
            strategies, high-growth micro-markets and
            curated advisory content crafted for modern
            wealth creators and elite investors.
          </p>

          {/* BUTTON */}
          <Link
            href="/knowledge"
            className="group relative overflow-hidden mt-9 inline-flex items-center gap-4 h-[56px] px-8 rounded-full bg-[#081512] text-white text-[12px] tracking-[2px] uppercase font-semibold shadow-[0_18px_45px_rgba(0,0,0,0.18)] hover:scale-[1.03] transition-all duration-500"
          >

            <div className="absolute inset-0 bg-gradient-to-r from-[#c89d58]/20 via-transparent to-[#c89d58]/10 opacity-0 group-hover:opacity-100 transition duration-500" />

            <span className="relative z-10">
              Explore All Articles
            </span>

            <div className="relative z-10 w-8 h-8 rounded-full bg-[#c89d58] flex items-center justify-center group-hover:translate-x-1 transition duration-300">
              <ArrowRight size={14} />
            </div>

          </Link>

        </div>

        {/* CARDS */}
        <div className="relative z-10 grid md:grid-cols-2 xl:grid-cols-5 gap-7 px-6 md:px-10 pb-10 md:pb-12">

          {knowledgeArticles.map((item, index) => (
            <Link
              key={item._id || item.slug || index}
              href={`/knowledge/${item.slug}`}
              className="block"
            >

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.07,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  scale: 1.015,
                }}
                className={`group relative overflow-hidden rounded-[30px] border backdrop-blur-2xl min-h-[300px] transition-all duration-700 ${
                  index === 0
                    ? "bg-gradient-to-br from-[#041e19]/95 via-[#072922]/95 to-[#03110d]/95 border-[#c89d58]/20 shadow-[0_30px_70px_rgba(0,0,0,0.3)]"
                    : "bg-white/55 border-white/70 shadow-[0_20px_55px_rgba(0,0,0,0.06)] hover:bg-white/75"
                }`}
              >

                {/* CARD GLOW */}
                <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-[#c89d58]/10 blur-3xl opacity-80 group-hover:scale-150 transition duration-700" />

                {/* SHINE EFFECT */}
                <div className="absolute top-0 -left-[130%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent rotate-[18deg] group-hover:left-[150%] transition-all duration-[1300ms]" />

                <div className="relative z-10 p-7 flex flex-col h-full justify-between">

                  <div>

                    <div
                      className={`relative w-[62px] h-[62px] rounded-[20px] flex items-center justify-center border mb-7 overflow-hidden ${
                        index === 0
                          ? "bg-[#c89d58]/10 border-[#c89d58]/20"
                          : "bg-white/70 border-white"
                      }`}
                    >

                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

                      <BookOpen
                        size={24}
                        strokeWidth={1.8}
                        className="relative z-10 text-[#c89d58]"
                      />

                    </div>

                    <h3
                      className={`text-[18px] leading-[1.45] font-semibold tracking-[-0.3px] ${
                        index === 0
                          ? "text-white"
                          : "text-[#171717]"
                      }`}
                    >
                      {item.title}
                    </h3>

                  </div>

                  <div className="flex items-center justify-between mt-10">

                    <button
                      className={`text-[13px] font-semibold tracking-wide ${
                        index === 0
                          ? "text-[#d6b06a]"
                          : "text-[#b98b3c]"
                      }`}
                    >
                      Read Article
                    </button>

                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        index === 0
                          ? "bg-[#c89d58] text-black"
                          : "bg-[#f3ece0] text-[#b98b3c] group-hover:bg-[#c89d58] group-hover:text-white"
                      }`}
                    >
                      <ChevronRight
                        size={16}
                        className="group-hover:translate-x-[2px] transition"
                      />
                    </div>

                  </div>

                </div>

                <div className="absolute inset-0 rounded-[30px] border border-white/10 pointer-events-none" />

              </motion.div>

            </Link>
          ))}

        </div>

      </div>

    </div>
  </section>
);
}