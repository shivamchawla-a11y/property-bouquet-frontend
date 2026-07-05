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

const articles = [
  {
    title: "Understanding Capital Appreciation",
    desc: "Key drivers that impact property value over time.",
    active: true,
    icon: TrendingUp,
  },

  {
    title: "Rental Yield Explained",
    desc: "How to evaluate rental income potential.",
    icon: BadgeDollarSign,
  },

  {
    title: "NRI Investment Guide",
    desc: "Everything NRIs must know before investing.",
    icon: Globe2,
  },

  {
    title: "Tax Benefits on Home Investments",
    desc: "Save more with the right structuring.",
    icon: Landmark,
  },

  {
    title: "Off-Market Opportunities",
    desc: "Access exclusive inventory before launch.",
    icon: Sparkles,
  },
];

const insights = [
  {
    label: "Capital Appreciation (YOY)",
    value: "18.7%",
  },
  {
    label: "Luxury Sales (YOY)",
    value: "32.4%",
  },
  {
    label: "Avg. Rental Yield",
    value: "3.6% – 4.8%",
  },
  {
    label: "High Net Worth Sales",
    value: "41%",
  },
  {
    label: "Foreign Investor Interest",
    value: "27%",
  },
  {
    label: "Supply Vs Demand",
    value: "DEMAND +62%",
  },
];


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
    <section className="bg-[#f6f3ee] pb-24">

      <div className="max-w-[1440px] mx-auto px-5">

        {/* PREMIUM KNOWLEDGE SECTION */}
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
        fontFamily:
          "Georgia, Times New Roman, serif",
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

      {/* BUTTON GLOW */}
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
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: index * 0.07,
        }}
        viewport={{
          once: true,
        }}
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

        {/* CONTENT */}
        <div className="relative z-10 p-7 flex flex-col h-full justify-between">

          <div>

            {/* ICON BOX */}
<div
  className={`relative w-[62px] h-[62px] rounded-[20px] flex items-center justify-center border mb-7 overflow-hidden ${
    index === 0
      ? "bg-[#c89d58]/10 border-[#c89d58]/20"
      : "bg-white/70 border-white"
  }`}
>

  {/* ICON GLOW */}
  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

  {/* ICON */}
  <BookOpen
  size={24}
  strokeWidth={1.8}
  className="relative z-10 text-[#c89d58]"
/>
</div>

            {/* TITLE */}
            <h3
              className={`text-[18px] leading-[1.45] font-semibold tracking-[-0.3px] ${
                index === 0
                  ? "text-white"
                  : "text-[#171717]"
              }`}
            >
              {item.title}
            </h3>

            {/* DESCRIPTION */}
            
          </div>

          {/* FOOTER */}
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

        {/* PREMIUM BORDER */}
        <div className="absolute inset-0 rounded-[30px] border border-white/10 pointer-events-none" />
        </motion.div>
</Link>
    ))}
  </div>
</div>

        {/* MIDDLE GRID */}
<div className="grid xl:grid-cols-[0.95fr_1.18fr] border-x border-b border-black/10 overflow-hidden rounded-t-[10px]">



  {/* NEWS & INSIGHTS */}
  <div className="bg-[#fbf9f5] border-r border-black/10 px-8 py-8 xl:px-10 xl:py-10 flex flex-col justify-between">

    <div>

      <p className="text-[10px] tracking-[2px] uppercase text-black/55 font-semibold mb-7">
        News & Insights
      </p>

      <h2
        className="text-[34px] xl:text-[38px] leading-[1.12] text-[#171717] font-medium mb-10"
        style={{
          fontFamily:
            "Georgia, Times New Roman, serif",
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
  sizes="100vw"
  className="absolute inset-0 object-cover object-center"
/>

    {/* PREMIUM OVERLAY */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

    {/* SOFT SHADOW */}
    <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.18)]" />

  </div>
</div>

{/* PREMIUM TRANSITION DIVIDER */}
<div className="relative h-[120px] overflow-hidden border-x border-black/10 bg-[#f6f3ee]">

  {/* TOP FADE */}
  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent" />

  {/* GLOW */}
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[#c89d58]/10 blur-[130px]" />

  {/* GLASS STRIP */}
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[82%] h-[1px] bg-gradient-to-r from-transparent via-[#c89d58]/30 to-transparent" />

  {/* FLOATING BADGE */}
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

    <div className="px-6 py-3 rounded-full border border-white/60 bg-white/60 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.06)]">

      <p className="text-[10px] tracking-[3px] uppercase text-black/45 font-semibold">
        Wealth Intelligence
      </p>
    </div>
  </div>
</div>

{/* BOTTOM SECTION */}
<div className="border-x border-b border-black/10 overflow-hidden rounded-b-[10px] bg-[#02110d]">

  {/* TOP TWO CARDS */}
  <div className="grid xl:grid-cols-2">

    {/* ROI CALCULATOR */}
    <div className="relative overflow-hidden bg-gradient-to-br from-[#021c18] via-[#03241e] to-[#02110d] border-b xl:border-b-0 xl:border-r border-white/10 px-8 py-8 xl:px-10 xl:py-10">

      {/* GLOW */}
      <div className="absolute top-[-80px] left-[-80px] w-[220px] h-[220px] bg-[#d4ae67]/10 blur-[120px]" />

      <div className="relative z-10">

        <p className="text-[10px] tracking-[2px] uppercase text-[#d4ae67] font-semibold mb-5">
          ROI Calculator
        </p>

        <h2
          className="text-[32px] xl:text-[36px] leading-[1.12] text-white"
          style={{
            fontFamily:
              "Georgia, Times New Roman, serif",
          }}
        >
          Model Your Investment.
          <br />
          Plan Your Returns.
        </h2>

        <div className="mt-10 space-y-8">

          <div className="mt-10 space-y-8">

  {/* INVESTMENT */}
  <div>
  <div className="flex items-center justify-between text-[12px] text-white/70 mb-3">
    <span>Investment Amount</span>

    <span>
      {formatCurrency(investment)}
    </span>
  </div>

  <input
    type="range"
    min="1000000"
    max="500000000"
    step="1000000"
    value={investment}
    onChange={(e) =>
      setInvestment(Number(e.target.value))
    }
    className="
      luxury-slider
      w-full
    "
  />
</div>

  {/* YEARS */}
  <div>
  <div className="flex items-center justify-between text-[12px] text-white/70 mb-3">
    <span>Holding Period</span>

    <span>{years} Years</span>
  </div>

  <input
    type="range"
    min="1"
    max="20"
    value={years}
    onChange={(e) =>
      setYears(Number(e.target.value))
    }
    className="
      luxury-slider
      w-full
    "
  />
</div>

  {/* APPRECIATION */}
 <div>
  <div className="flex items-center justify-between text-[12px] text-white/70 mb-3">
    <span>Expected Appreciation</span>

    <span>{appreciation}%</span>
  </div>

  <input
    type="range"
    min="1"
    max="30"
    value={appreciation}
    onChange={(e) =>
      setAppreciation(Number(e.target.value))
    }
    className="
      luxury-slider
      w-full
    "
  />
</div>

</div>
        </div>
      </div>
    </div>

    {/* RETURNS CARD */}
    <div className="relative overflow-hidden bg-gradient-to-br from-[#032821] via-[#021d18] to-[#02110d] flex items-center justify-center px-6 py-10 xl:py-12">

      {/* GLOW */}
      <div className="absolute w-[320px] h-[320px] rounded-full bg-[#d4ae67]/10 blur-[130px]" />

      <div className="relative z-10 w-full max-w-[370px] rounded-[28px] border border-[#d4ae67]/15 bg-white/[0.04] backdrop-blur-3xl px-8 py-9 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">

        {/* TOP */}
        <div className="text-center">

          <p className="text-[10px] uppercase tracking-[2px] text-white/40 font-semibold">
            Projected Value (5Y)
          </p>

          <h3 className="text-[#d4ae67] text-[48px] leading-none font-semibold mt-5">
            {formatCurrency(projectedValue)}
          </h3>
        </div>

        {/* RETURNS */}
        <div className="space-y-6 mt-10">

          <div className="flex items-center justify-between">

            <span className="text-white/55 text-[13px]">
              Total Returns
            </span>

            <span className="text-[28px] text-white font-semibold">
              {formatCurrency(totalReturns)}
            </span>
          </div>

          <div className="h-px bg-white/10" />

          <div className="flex items-center justify-between">

            <span className="text-white/55 text-[13px]">
              ROI
            </span>

            <span className="text-[30px] text-[#d4ae67] font-semibold">
              {roi.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* BUTTON */}
        <button className="mt-10 h-[54px] rounded-2xl bg-gradient-to-b from-[#e0bd74] to-[#b88731] text-black text-[13px] font-semibold w-full hover:brightness-110 hover:scale-[1.01] transition-all duration-300 shadow-[0_10px_30px_rgba(212,174,103,0.25)]">

          DOWNLOAD FULL REPORT
        </button>

        <p className="text-[10px] text-white/35 mt-4 text-center">
          *Indicative returns for reference only
        </p>
      </div>
    </div>
  </div>


  {/* PREMIUM ADVISORY TRANSITION */}
<div className="relative h-[140px] overflow-hidden bg-[#02110d] border-t border-white/10">

  {/* GOLD LIGHT */}
  <div className="absolute left-1/2 top-[-120px] -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-[#d4ae67]/10 blur-[140px]" />

  {/* LINE */}
  <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4ae67]/20 to-transparent" />

  {/* CENTER GLASS */}
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

    <div className="rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-2xl px-7 py-3 shadow-[0_15px_45px_rgba(0,0,0,0.25)]">

      <div className="flex items-center gap-3">

        <div className="w-2 h-2 rounded-full bg-[#d4ae67]" />

        <p className="text-[10px] uppercase tracking-[3px] text-white/60 font-semibold">
          Private Advisory Network
        </p>
      </div>
    </div>
  </div>

  {/* BOTTOM SHADOW */}
  <div className="absolute bottom-0 inset-x-0 h-[120px] bg-gradient-to-b from-transparent to-black/25" />
</div>

 {/* ADVISORY SECTION */}
<div className="grid lg:grid-cols-[0.95fr_1.05fr] overflow-hidden rounded-[34px] border border-black/10 bg-[#f7f4ee] shadow-[0_20px_70px_rgba(0,0,0,0.06)]">

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
          fontFamily:
            "Georgia, Times New Roman, serif",
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
        investment opportunities across India &
        Dubai — curated with institutional-grade
        market intelligence and private access.
      </p>

      {/* FEATURE CARDS */}
      <div className="grid sm:grid-cols-2 gap-4 mt-10">

        {advisoryPoints.map((item, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.05] backdrop-blur-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.22)] hover:-translate-y-1 hover:border-[#d4ae67]/20 transition-all duration-500"
          >

            {/* HOVER LIGHT */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-br from-[#d4ae67]/10 via-transparent to-transparent" />

            <div className="relative z-10">

              {/* ICON */}
              <div className="w-11 h-11 rounded-2xl border border-[#d4ae67]/30 bg-gradient-to-br from-[#d4ae67]/10 to-transparent text-[#d4ae67] flex items-center justify-center shadow-[0_0_20px_rgba(212,174,103,0.12)]">

                <ShieldCheck size={17} />
              </div>

              {/* TITLE */}
              <h4 className="mt-4 text-[14px] font-medium text-white leading-[1.5]">
                {item}
              </h4>

              {/* TEXT */}
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
      <button onClick={onConsultationClick} className="group mt-10 h-[54px] px-9 rounded-2xl bg-gradient-to-b from-[#e0bd74] to-[#b88731] text-black text-[12px] font-semibold tracking-[1px] hover:brightness-110 hover:scale-[1.01] transition-all duration-300 shadow-[0_12px_35px_rgba(212,174,103,0.28)]">

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

    {/* IMAGE */}

<Image
  src="/market2.webp"
  alt="Luxury Advisory"
  fill
  sizes="100vw"
  className="absolute inset-0 object-cover object-center scale-[1.03]"
/>

    {/* OVERLAYS */}
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
    </section>
  );
}