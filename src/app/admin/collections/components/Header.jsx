"use client";

import {
  Sparkles,
  ScanSearch,
  RefreshCw,
  UploadCloud,
} from "lucide-react";

export default function Header() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#d9c38a]/40 bg-gradient-to-br from-[#0f3b2e] via-[#154735] to-[#1b5742] p-8 shadow-xl">

      {/* Background Glow */}
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#d4af37]/10 blur-3xl" />
      <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        {/* LEFT */}
        <div className="max-w-3xl">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-sm font-medium text-[#f7e3a2]">
            <Sparkles size={16} />
            Intelligent SEO Landing Page Engine
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white">
            SEO Collection Engine
          </h1>

          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/70">
            Automatically discover high-value SEO landing pages from your
            published properties. Review, publish and manage thousands of
            dynamic landing pages without creating them manually.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
              🚀 Auto Generated Pages
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
              ⚡ Dynamic Property Filters
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
              📈 SEO Optimized URLs
            </span>

          </div>

        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4 lg:min-w-[320px]">

          <button
            className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#c9a64b] to-[#e0be69] px-6 py-4 font-semibold text-black transition hover:scale-[1.02] hover:shadow-xl"
          >
            <ScanSearch size={20} />
            Scan Property Database
          </button>

          <button
            className="flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 font-medium text-white transition hover:bg-white/15"
          >
            <UploadCloud size={20} />
            Publish Selected
          </button>

          <button
            className="flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-transparent px-6 py-4 font-medium text-white transition hover:bg-white/10"
          >
            <RefreshCw size={19} />
            Refresh Engine
          </button>

        </div>

      </div>
    </div>
  );
}