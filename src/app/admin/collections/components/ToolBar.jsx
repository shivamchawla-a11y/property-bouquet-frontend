"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Wand2,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Loader2,
} from "lucide-react";

export default function ToolBar({
  selectedPages = [],
  generateCollections,
  generating = false,
  refreshCollections,
}) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const tabs = [
    {
      id: "all",
      label: "All Pages",
    },
    {
      id: "draft",
      label: "Draft",
    },
    {
      id: "published",
      label: "Published",
    },
    {
      id: "ignored",
      label: "Ignored",
    },
  ];

  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">

      {/* ===================== TABS ===================== */}

      <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 p-5">

        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              tab === item.id
                ? "bg-[#0f3b2e] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        ))}

      </div>

      {/* ===================== SEARCH + ACTIONS ===================== */}

      <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}

        <div className="relative w-full lg:max-w-md">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              h-12
              w-full
              rounded-2xl
              border
              border-gray-200
              bg-white
              pl-11
              pr-4
              text-gray-900
              placeholder:text-gray-400
              outline-none
              transition
              focus:border-[#c9a64b]
            "
          />

        </div>

        {/* Buttons */}

        <div className="flex flex-wrap gap-3">

          <button
            className="
              flex
              items-center
              gap-2
              rounded-2xl
              border
              border-gray-200
              bg-white
              px-5
              py-3
              font-medium
              text-gray-700
              transition
              hover:bg-gray-50
            "
          >
            <Filter size={18} />
            Filters
          </button>

          <button
            onClick={refreshCollections}
            className="
              flex
              items-center
              gap-2
              rounded-2xl
              border
              border-gray-200
              bg-white
              px-5
              py-3
              font-medium
              text-gray-700
              transition
              hover:bg-gray-50
            "
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            onClick={generateCollections}
            disabled={generating}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold shadow transition ${
              generating
                ? "cursor-not-allowed bg-gray-300 text-gray-700"
                : "bg-gradient-to-r from-[#c9a64b] to-[#e0be69] text-black hover:scale-[1.02]"
            }`}
          >
            {generating ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Generating...
              </>
            ) : (
              <>
                <Wand2 size={18} />
                Generate Collections
              </>
            )}
          </button>

          <button
            disabled={!selectedPages.length}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition ${
              selectedPages.length
                ? "bg-[#0f3b2e] text-white hover:opacity-90"
                : "cursor-not-allowed bg-gray-200 text-gray-500"
            }`}
          >
            <CheckCircle2 size={18} />
            Publish ({selectedPages.length})
          </button>

          <button
            disabled={!selectedPages.length}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition ${
              selectedPages.length
                ? "bg-red-600 text-white hover:bg-red-700"
                : "cursor-not-allowed bg-gray-200 text-gray-500"
            }`}
          >
            <Trash2 size={18} />
            Delete ({selectedPages.length})
          </button>

        </div>

      </div>

    </div>
  );
}