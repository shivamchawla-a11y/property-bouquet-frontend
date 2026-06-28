"use client";

import KnowledgeCard from "./KnowledgeCard";
import { ChevronDown } from "lucide-react";

const cards = [
  {
    badge: "GET STARTED",
    image: "/knowledge/card1.jpg",
    title: "Step-by-Step Home Buying Process",
    description:
      "A complete roadmap to help you buy your dream home smoothly.",
  },
  {
    badge: "ESSENTIALS",
    image: "/knowledge/card2.jpg",
    title: "Documents Required to Buy Property",
    description:
      "Check the complete list of documents you need for a hassle-free purchase.",
  },
  {
    badge: "LEGAL",
    image: "/knowledge/card3.jpg",
    title: "Agreement to Possession: Key Legal Steps",
    description:
      "Understand the legal process from agreement to getting possession.",
  },
  {
    badge: "PROPERTY TYPES",
    image: "/knowledge/card4.jpg",
    title: "Under Construction vs Ready-to-Move",
    description:
      "Compare the pros, cons and risks before you decide.",
  },
  {
    badge: "FINANCE",
    image: "/knowledge/card5.jpg",
    title: "Budgeting & Cost Breakdown",
    description:
      "Understand all costs involved beyond the property price.",
  },
  {
    badge: "TIPS & CHECKLISTS",
    image: "/knowledge/card6.jpg",
    title: "Home Buying Checklist: Don't Miss Anything",
    description:
      "Use this complete checklist to ensure you're ready at every step.",
  },
];

export default function KnowledgeGrid() {
  return (
    <section className="mt-12">

      <div className="flex items-center justify-between mb-8">

        <h2 className="text-5xl font-serif">
          Explore Buying Guides
        </h2>

        <button
          className="
          flex
          items-center
          gap-2
          text-gray-700
          hover:text-[#b88a24]
          "
        >
          Sort by:

          <span className="font-medium">
            Latest
          </span>

          <ChevronDown size={18} />

        </button>

      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-7">

        {cards.map((card) => (
          <KnowledgeCard
            key={card.title}
            {...card}
          />
        ))}

      </div>

    </section>
  );
}