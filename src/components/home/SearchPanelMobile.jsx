"use client";

import { useState } from "react";
import { Search, X, ChevronDown, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SearchPanel from "./SearchPanel";

export default function SearchPanelMobile() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative z-30 w-full">
      {/* Compact search bar — always visible */}
      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        whileTap={{ scale: 0.99 }}
        aria-expanded={open}
        aria-controls="mobile-property-search"
        className="
          relative flex w-full items-center gap-3
          overflow-hidden rounded-2xl border
          border-[#c89d58]/30 bg-white
          px-3 py-3 text-left
          shadow-[0_6px_20px_rgba(15,59,46,0.08)]
        "
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0f3b2e]">
          <Search size={18} className="text-[#c89d58]" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12px] font-semibold text-[#17342d]">
            Search properties, projects...
          </span>
          <span className="mt-1 block truncate text-[10px] text-[#17342d]/55">
            Location · Developer · Budget
          </span>
        </span>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f7f3ee] text-[#98723c]">
          {open ? <X size={17} /> : <ChevronDown size={18} />}
        </span>
      </motion.button>

      {/* Expand the original search form on demand */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-property-search"
            key="mobile-search-form"
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="relative z-30 overflow-visible"
          >
            <div className="mt-2 rounded-2xl border border-[#c89d58]/25 bg-white p-3 shadow-[0_10px_28px_rgba(15,59,46,0.10)]">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-[#17342d]">
                    Refine your search
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#17342d]/55">
                    Choose your property preferences
                  </p>
                </div>
                <Sparkles size={15} className="text-[#c89d58]" />
              </div>

              <SearchPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}