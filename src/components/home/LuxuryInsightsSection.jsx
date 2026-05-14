"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";

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

const news = [
  {
    day: "16",
    month: "MAY",
    title:
      "Luxury Real Estate: Why Ultra HNIs Are Moving Beyond Traditional Assets",
  },
  {
    day: "12",
    month: "MAY",
    title:
      "Top 5 Micro-Markets That Outperformed in 2024",
  },
  {
    day: "08",
    month: "MAY",
    title:
      "Branded Residences: The New Benchmark of Luxury Living",
  },
];

const advisoryPoints = [
  "Asset Structuring",
  "NRI & Global Investor Desk",
  "Portfolio Diversification",
  "Off-Market Access",
];

export default function LuxuryInsightsSection() {
  return (
    <section className="bg-[#f6f3ee] pb-24">

      <div className="max-w-[1440px] mx-auto px-5">

        {/* PREMIUM INSIGHTS SECTION */}
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
    <button className="group relative overflow-hidden mt-9 inline-flex items-center gap-4 h-[56px] px-8 rounded-full bg-[#081512] text-white text-[12px] tracking-[2px] uppercase font-semibold shadow-[0_18px_45px_rgba(0,0,0,0.18)] hover:scale-[1.03] transition-all duration-500">

      {/* BUTTON GLOW */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#c89d58]/20 via-transparent to-[#c89d58]/10 opacity-0 group-hover:opacity-100 transition duration-500" />

      <span className="relative z-10">
        Explore All Articles
      </span>

      <div className="relative z-10 w-8 h-8 rounded-full bg-[#c89d58] flex items-center justify-center group-hover:translate-x-1 transition duration-300">

        <ArrowRight size={14} />
      </div>
    </button>
  </div>

  {/* CARDS */}
  <div className="relative z-10 grid md:grid-cols-2 xl:grid-cols-5 gap-7 px-6 md:px-10 pb-10 md:pb-12">

    {articles.map((item, index) => (
      <motion.div
        key={index}
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
          item.active
            ? "bg-gradient-to-br from-[#041e19]/95 via-[#072922]/95 to-[#03110d]/95 border-[#c89d58]/20 shadow-[0_30px_70px_rgba(0,0,0,0.3)]"
            : "bg-white/55 border-white/70 shadow-[0_20px_55px_rgba(0,0,0,0.06)] hover:bg-white/75"
        }`}
      >

        {/* CARD GLOW */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-[#c89d58]/10 blur-3xl opacity-80 group-hover:scale-150 transition duration-700" />

        {/* SHINE EFFECT */}
        <div className="absolute top-0 -left-[130%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent rotate-[18deg] group-hover:left-[150%] transition-all duration-[1300ms]" />

        {/* NOISE TEXTURE */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />

        {/* CONTENT */}
        <div className="relative z-10 p-7 flex flex-col h-full justify-between">

          <div>

            {/* ICON BOX */}
<div
  className={`relative w-[62px] h-[62px] rounded-[20px] flex items-center justify-center border mb-7 overflow-hidden ${
    item.active
      ? "bg-[#c89d58]/10 border-[#c89d58]/20"
      : "bg-white/70 border-white"
  }`}
>

  {/* ICON GLOW */}
  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

  {/* ICON */}
  <item.icon
    size={24}
    strokeWidth={1.8}
    className={`relative z-10 ${
      item.active
        ? "text-[#d6b06a]"
        : "text-[#c89d58]"
    }`}
  />
</div>

            {/* TITLE */}
            <h3
              className={`text-[18px] leading-[1.45] font-semibold tracking-[-0.3px] ${
                item.active
                  ? "text-white"
                  : "text-[#171717]"
              }`}
            >
              {item.title}
            </h3>

            {/* DESCRIPTION */}
            <p
              className={`mt-4 text-[13px] leading-[1.9] ${
                item.active
                  ? "text-white/65"
                  : "text-black/50"
              }`}
            >
              {item.desc}
            </p>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between mt-10">

            <button
              className={`text-[13px] font-semibold tracking-wide ${
                item.active
                  ? "text-[#d6b06a]"
                  : "text-[#b98b3c]"
              }`}
            >
              Read Article
            </button>

            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                item.active
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
    ))}
  </div>
</div>

        {/* MIDDLE GRID */}
<div className="grid xl:grid-cols-[1.02fr_0.95fr_1.18fr] border-x border-b border-black/10 overflow-hidden rounded-t-[10px]">

  {/* MARKET INSIGHTS */}
  <div className="bg-[#f7f4ee] border-r border-black/10 px-8 py-8 xl:px-10 xl:py-10">

    <p className="text-[10px] tracking-[2px] uppercase text-black/55 font-semibold mb-5">
      Market Insights
    </p>

    <h2
      className="text-[34px] xl:text-[38px] leading-[1.12] text-[#171717] font-medium"
      style={{
        fontFamily:
          "Georgia, Times New Roman, serif",
      }}
    >
      India’s Luxury Market
      <br />
      At A Glance.
    </h2>

    <div className="grid grid-cols-2 gap-x-7 gap-y-8 mt-10">

      {insights.map((item, index) => (
        <div
          key={index}
          className="relative"
        >

          <p className="text-[9px] uppercase tracking-[1.5px] text-black/40 font-semibold mb-2">
            {item.label}
          </p>

          <h4 className="text-[28px] leading-none text-[#b98b3c] font-semibold">
            {item.value}
          </h4>

          {/* MINI CHART */}
          <div className="mt-3 opacity-60">
            <svg
              width="90"
              height="28"
              viewBox="0 0 90 28"
              fill="none"
            >
              <path
                d="M2 23C12 22 14 16 22 18C29 19 35 8 44 12C54 16 57 7 67 8C75 9 80 2 88 4"
                stroke="#b98b3c"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              <circle
                cx="88"
                cy="4"
                r="2.6"
                fill="#b98b3c"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between mt-10 pt-5 border-t border-black/5">

      <p className="text-[11px] text-black/45">
        Source: Internal Research &
        Market Reports
      </p>

      <button className="group flex items-center gap-2 text-[#b98b3c] text-[12px] font-semibold uppercase tracking-[1px]">

        View All Insights

        <ArrowRight
          size={13}
          className="group-hover:translate-x-1 transition"
        />
      </button>
    </div>
  </div>

  {/* NEWS & INSIGHTS */}
  <div className="bg-[#fbf9f5] border-r border-black/10 px-8 py-8 xl:px-10 xl:py-10">

    <p className="text-[10px] tracking-[2px] uppercase text-black/55 font-semibold mb-7">
      News & Insights
    </p>

    <div className="space-y-7">

      {news.map((item, index) => (
        <div
          key={index}
          className="flex gap-4 group cursor-pointer"
        >

          {/* DATE */}
          <div className="w-[62px] h-[62px] rounded-[10px] bg-[#f1ece3] border border-black/5 flex flex-col items-center justify-center shrink-0 transition-all duration-300 group-hover:shadow-md">

            <span className="text-[24px] leading-none font-semibold text-[#171717]">
              {item.day}
            </span>

            <span className="text-[9px] tracking-[1.4px] uppercase text-black/50 mt-1">
              {item.month}
            </span>
          </div>

          {/* TEXT */}
          <div className="pt-[2px]">

            <h4 className="text-[15px] leading-[1.55] text-[#171717] font-medium max-w-[280px] transition group-hover:text-[#b98b3c]">
              {item.title}
            </h4>

            <p className="mt-2 text-[12px] text-black/45">
              6 Min Read
            </p>
          </div>
        </div>
      ))}
    </div>

    <button className="group mt-10 flex items-center gap-2 text-[#b98b3c] text-[12px] font-semibold uppercase tracking-[1px]">

      View All News

      <ArrowRight
        size={13}
        className="group-hover:translate-x-1 transition"
      />
    </button>
  </div>

  {/* TOP IMAGE */}
  <div className="relative min-h-[540px] overflow-hidden bg-black">

    <img
      src="/market1.png"
      alt="Luxury Interior"
      className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01]"
    />

    {/* SMOOTH OVERLAY */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

    {/* EDGE SHADOW */}
    <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.18)]" />
  </div>
</div>

{/* BOTTOM GRID */}
<div className="grid xl:grid-cols-[1fr_1.08fr_1.05fr] border-x border-b border-black/10 overflow-hidden rounded-b-[10px]">

  {/* ROI CALCULATOR */}
  <div className="relative overflow-hidden bg-gradient-to-br from-[#021c18] via-[#03241e] to-[#02110d] border-r border-white/10 px-8 py-8 xl:px-10 xl:py-10">

    {/* GLOW */}
    <div className="absolute top-[-80px] left-[-80px] w-[220px] h-[220px] bg-[#d4ae67]/10 blur-[120px]" />

    <div className="relative z-10">

      <p className="text-[10px] tracking-[2px] uppercase text-[#d4ae67] font-semibold mb-5">
        ROI Calculator
      </p>

      <h2
        className="text-[34px] xl:text-[38px] leading-[1.12] text-white"
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

        {[
          "Investment Amount",
          "Holding Period",
          "Expected Appreciation",
        ].map((item, index) => (
          <div key={index}>

            <div className="flex items-center justify-between text-[12px] text-white/70 mb-3">

              <span>{item}</span>

              <span>
                {index === 0
                  ? "₹ 10,00,00,000"
                  : index === 1
                  ? "5 Years"
                  : "20%"}
              </span>
            </div>

            {/* SLIDER */}
            <div className="relative h-[3px] rounded-full bg-white/10 overflow-visible">

              <div className="absolute left-0 top-0 h-full w-[65%] bg-gradient-to-r from-[#b98b3c] to-[#d9b56c]" />

              <div className="absolute left-[65%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#d4ae67] border-[3px] border-[#08201b] shadow-[0_0_15px_rgba(212,174,103,0.7)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* RETURNS CARD */}
  <div className="relative overflow-hidden bg-gradient-to-br from-[#032821] via-[#021d18] to-[#02110d] border-r border-white/10 flex items-center justify-center px-6 py-8">

    {/* GLOW */}
    <div className="absolute w-[280px] h-[280px] rounded-full bg-[#d4ae67]/10 blur-[120px]" />

    <div className="relative z-10 w-full max-w-[310px] rounded-[24px] border border-[#d4ae67]/15 bg-white/[0.03] backdrop-blur-2xl px-8 py-8 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">

      <p className="text-[10px] uppercase tracking-[2px] text-white/40 font-semibold">
        Projected Value (5Y)
      </p>

      <h3 className="text-[#d4ae67] text-[44px] leading-none font-semibold mt-5">
        ₹ 24.88 Cr*
      </h3>

      <div className="space-y-6 mt-8">

        <div className="flex items-center justify-between">

          <span className="text-white/55 text-[13px]">
            Total Returns
          </span>

          <span className="text-[26px] text-white font-semibold">
            ₹ 14.88 Cr
          </span>
        </div>

        <div className="flex items-center justify-between">

          <span className="text-white/55 text-[13px]">
            ROI
          </span>

          <span className="text-[28px] text-[#d4ae67] font-semibold">
            148.8%
          </span>
        </div>
      </div>

      <button className="mt-9 h-[52px] rounded-xl bg-gradient-to-b from-[#e0bd74] to-[#b88731] text-black text-[13px] font-semibold w-full hover:brightness-110 transition-all duration-300 shadow-[0_10px_30px_rgba(212,174,103,0.25)]">

        DOWNLOAD FULL REPORT
      </button>

      <p className="text-[10px] text-white/35 mt-4 text-center">
        *Indicative returns for reference only
      </p>
    </div>
  </div>

  {/* ADVISORY */}
  <div className="relative min-h-[430px] overflow-hidden bg-black">

    {/* IMAGE */}
    <img
      src="/market2.png"
      alt="Luxury Advisory"
      className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01]"
    />

    {/* OVERLAY */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#021c18]/96 via-[#03221c]/88 to-black/25" />

    {/* SHADOW */}
    <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.35)]" />

    {/* CONTENT */}
    <div className="relative z-10 h-full flex flex-col justify-center px-8 py-10 xl:px-10 text-white">

      <p className="text-[10px] tracking-[2px] uppercase text-[#d4ae67] font-semibold mb-5">
        White-Glove Advisory
      </p>

      <h2
        className="text-[34px] xl:text-[38px] leading-[1.12]"
        style={{
          fontFamily:
            "Georgia, Times New Roman, serif",
        }}
      >
        Beyond Transactions.
        <br />
        We Build Legacies.
      </h2>

      <div className="mt-9 space-y-5">

        {advisoryPoints.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4"
          >

            <div className="w-10 h-10 rounded-full border border-[#d4ae67]/35 bg-white/[0.03] backdrop-blur-md flex items-center justify-center shrink-0 text-[#d4ae67]">

              <ShieldCheck size={16} />
            </div>

            <div>

              <h4 className="text-[15px] font-medium">
                {item}
              </h4>

              <p className="text-white/55 text-[12px] mt-1 leading-[1.7]">
                Curated premium advisory &
                investment strategy.
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-10 h-[52px] px-8 rounded-xl bg-gradient-to-b from-[#e0bd74] to-[#b88731] text-black text-[13px] font-semibold w-fit hover:brightness-110 transition-all duration-300 shadow-[0_10px_30px_rgba(212,174,103,0.25)]">

        SCHEDULE PRIVATE CONSULTATION
      </button>
    </div>
  </div>
</div>
      </div>
    </section>
  );
}