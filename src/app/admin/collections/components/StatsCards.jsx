"use client";

import {
  Layers3,
  FileClock,
  Globe,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: "Total Landing Pages",
      value: stats.total,
      icon: Layers3,
      color: "from-[#c9a64b] to-[#e0be69]",
      bg: "bg-[#fffdf8]",
    },
    {
      title: "Draft Pages",
      value: stats.draft,
      icon: FileClock,
      color: "from-[#0f3b2e] to-[#1d5d47]",
      bg: "bg-[#f7faf8]",
    },
    {
      title: "Published",
      value: stats.published,
      icon: Globe,
      color: "from-[#1f8f57] to-[#36b37e]",
      bg: "bg-[#f8fffb]",
    },
    {
      title: "Potential Pages",
      value: stats.potential || 0,
      icon: Lightbulb,
      color: "from-[#7b61ff] to-[#9d7cff]",
      bg: "bg-[#faf8ff]",
    },
    {
      title: "Average SEO Score",
      value: `${stats.averageScore || 0}%`,
      icon: TrendingUp,
      color: "from-[#ff9f43] to-[#ffc371]",
      bg: "bg-[#fffaf4]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`${card.bg} group relative overflow-hidden rounded-3xl border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
          >
            {/* Glow */}
            <div
              className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${card.color} opacity-10 blur-3xl transition group-hover:opacity-20`}
            />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
                  {card.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg`}
              >
                <Icon size={24} />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Live Statistics
              </span>

              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Updated
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}