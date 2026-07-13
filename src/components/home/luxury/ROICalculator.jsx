"use client";

import { useEffect, useState } from "react";

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

      <div className="overflow-hidden rounded-[36px] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">

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
                  fontFamily: "Georgia, Times New Roman, serif",
                }}
              >
                Model Your Investment.
                <br />
                Plan Your Returns.
              </h2>

              <div className="mt-10 space-y-8">

                {/* INVESTMENT */}
                <div>
                  <div className="flex items-center justify-between text-[12px] text-white/70 mb-3">
                    <span>Investment Amount</span>
                    <span>{formatCurrency(investment)}</span>
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
                    className="luxury-slider w-full"
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
                    className="luxury-slider w-full"
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
                    className="luxury-slider w-full"
                  />
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

      </div>

    </div>
  </section>
);
}