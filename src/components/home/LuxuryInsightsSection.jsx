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
import KnowledgeSection from "../home/luxury/KnowledgeSection";
import NewsInsightSection from "../home/luxury/NewsInsightSection";
import ROICalculator from "../home/luxury/ROICalculator";
import AdvisorySection from "../home/luxury/AdvisorySection";


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
  <section className="bg-[#f6f3ee]">

    {/* Knowledge */}
    <div className="py-24">
      <KnowledgeSection />
    </div>

    {/* News */}
    <div className="py-10">
      <NewsInsightSection />
    </div>

    {/* ROI */}
    <div className="bg-[#031511] py-28">
      <ROICalculator />
    </div>

    {/* Advisory */}
    <div className="bg-[#f7f4ee] py-28 pb-36">
      <AdvisorySection
        onConsultationClick={onConsultationClick}
      />
    </div>

  </section>
);
}