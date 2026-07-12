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
  <div className="px-5 md:px-8 xl:px-10 py-10">
    <div className="overflow-hidden rounded-[36px] border border-black/10 bg-[#f7f4ee] shadow-[0_25px_70px_rgba(0,0,0,0.08)]">

      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">

        {/* LEFT CONTENT */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#021c18] via-[#03241e] to-[#02110d] px-7 py-12 md:px-10 xl:px-14">

          {/* PREMIUM GLOW */}
          <div className="absolute top-[-100px] left-[-80px] w-[260px] h-[260px] rounded-full bg-[#d4ae67]/10 blur-[120px]" />

          <div className="absolute bottom-[-120px] right-[-80px] w-[240px] h-[240px] rounded-full bg-[#d4ae67]/5 blur-[120px]" />

          {/* GLASS NOISE */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:22px_22px]" />

          <div className="relative z-10 max-w-[560px]">

            {/* LABEL */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4ae67]/20 bg-white/[0.04] backdrop-blur-xl px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.18)]">

              <div className="w-2 h-2 rounded-full bg-[#d4ae67]" />

              <p className="text-[10px] tracking-[2px] uppercase text-[#d4ae67] font-semibold">
                White-Glove Advisory
              </p>
            </div>

            {/* HEADING */}
            <h2
              className="mt-7 text-[34px] md:text-[42px] xl:text-[50px] leading-[1.08] text-white"
              style={{
                fontFamily: "Georgia, Times New Roman, serif",
              }}
            >
              Beyond Transactions.
              <br />
              We Build Legacies.
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-6 text-white/62 text-[13px] leading-[2] max-w-[500px]">
              Tailored advisory for luxury residences,
              branded developments, and high-growth
              investment opportunities across India
              — curated with institutional-grade
              market intelligence and private access.
            </p>

            {/* FEATURE CARDS */}
            <div className="grid sm:grid-cols-2 gap-4 mt-10">

              {advisoryPoints.map((item, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.05] backdrop-blur-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.22)] hover:-translate-y-1 hover:border-[#d4ae67]/20 transition-all duration-500"
                >

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-br from-[#d4ae67]/10 via-transparent to-transparent" />

                  <div className="relative z-10">

                    <div className="w-11 h-11 rounded-2xl border border-[#d4ae67]/30 bg-gradient-to-br from-[#d4ae67]/10 to-transparent text-[#d4ae67] flex items-center justify-center shadow-[0_0_20px_rgba(212,174,103,0.12)]">

                      <ShieldCheck size={17} />

                    </div>

                    <h4 className="mt-4 text-[14px] font-medium text-white leading-[1.5]">
                      {item}
                    </h4>

                    <p className="text-white/50 text-[11px] mt-2 leading-[1.8]">
                      Curated premium advisory &
                      investment strategy for luxury
                      real estate portfolios.
                    </p>

                  </div>

                </div>
              ))}

            </div>

            {/* BUTTON */}
            <button
              onClick={onConsultationClick}
              className="group mt-10 h-[54px] px-9 rounded-2xl bg-gradient-to-b from-[#e0bd74] to-[#b88731] text-black text-[12px] font-semibold tracking-[1px] hover:brightness-110 hover:scale-[1.01] transition-all duration-300 shadow-[0_12px_35px_rgba(212,174,103,0.28)]"
            >

              <span className="flex items-center gap-3">

                SCHEDULE PRIVATE CONSULTATION

                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition"
                />

              </span>

            </button>

          </div>
        </div>

        {/* RIGHT IMAGE SIDE */}
        <div className="relative min-h-[520px] overflow-hidden bg-black">

          <Image
            src="/market2.webp"
            alt="Luxury Advisory"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
            className="absolute inset-0 object-cover object-center scale-[1.03]"
          />

          <div className="absolute inset-0 bg-gradient-to-l from-black/15 via-transparent to-[#021c18]/35" />

          <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.22)]" />

          {/* FLOATING GLASS STATS */}
          <div className="absolute bottom-7 left-7 right-7 z-20">

            <div className="rounded-[28px] border border-white/10 bg-white/[0.08] backdrop-blur-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

              <div className="grid grid-cols-3 gap-5">

                <div>
                  <p className="text-white/55 text-[10px] uppercase tracking-[1.5px] mb-2">
                    Assets Advised
                  </p>

                  <h3 className="text-white text-[26px] leading-none font-semibold">
                    ₹850Cr+
                  </h3>
                </div>

                <div>
                  <p className="text-white/55 text-[10px] uppercase tracking-[1.5px] mb-2">
                    Markets
                  </p>

                  <h3 className="text-white text-[26px] leading-none font-semibold">
                    12+
                  </h3>
                </div>

                <div>
                  <p className="text-white/55 text-[10px] uppercase tracking-[1.5px] mb-2">
                    Retention
                  </p>

                  <h3 className="text-[#d4ae67] text-[26px] leading-none font-semibold">
                    98%
                  </h3>
                </div>

              </div>

            </div>

          </div>

          {/* TOP FLOATING BADGE */}
          <div className="absolute top-7 right-7 z-20">

            <div className="rounded-full border border-white/10 bg-white/[0.08] backdrop-blur-xl px-5 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.28)]">

              <p className="text-white text-[11px] tracking-[1.5px] uppercase">
                Luxury Investment Advisory
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  </div>
);
}