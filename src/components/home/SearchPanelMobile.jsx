"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SearchPanel from "./SearchPanel";

export default function SearchPanelMobile() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* CLOSED STATE */}
      <button
        onClick={() => setOpen(true)}
        className="
          w-full
          h-[64px]
          rounded-[18px]
          border
          border-white/10
          bg-black/30
          backdrop-blur-xl
          flex
          items-center
          justify-between
          px-5
          text-left
        "
      >
        <div className="flex items-center gap-3">
          <Search
            size={20}
            className="text-[#c89d58]"
          />

          <div>
            <p className="text-white text-[14px] font-medium">
              Search Luxury Properties
            </p>

            <p className="text-white/45 text-[11px]">
              Location • Developer • Budget
            </p>
          </div>
        </div>

        <div
          className="
            text-[#c89d58]
            text-[11px]
            uppercase
            tracking-[2px]
          "
        >
          Open
        </div>
      </button>

      {/* DRAWER */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="
                fixed
                inset-0
                bg-black/70
                backdrop-blur-sm
                z-[99999]
              "
            />

            <motion.div
              initial={{
                y: "100%",
              }}
              animate={{
                y: 0,
              }}
              exit={{
                y: "100%",
              }}
              transition={{
                type: "spring",
                damping: 30,
              }}
              className="
                fixed
                bottom-0
                left-0
                right-0
                h-[88vh]
                bg-[#0b0b0b]
                rounded-t-[32px]
                z-[100000]
                overflow-y-auto
              "
            >
              {/* HEADER */}
              <div
                className="
                  sticky
                  top-0
                  z-20
                  bg-[#0b0b0b]
                  border-b
                  border-white/10
                  px-5
                  py-4
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <p className="text-[#c89d58] text-[11px] uppercase tracking-[3px]">
                    Luxury Search
                  </p>

                  <h3 className="text-white text-lg font-semibold">
                    Find Your Property
                  </h3>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-white/5
                    flex
                    items-center
                    justify-center
                    text-white
                  "
                >
                  <X size={18} />
                </button>
              </div>

              {/* EXISTING DESKTOP SEARCH PANEL */}
              <div className="p-4">
                <SearchPanel />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}