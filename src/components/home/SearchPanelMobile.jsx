"use client";

import { useEffect, useState } from "react";
import { Search, X, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SearchPanel from "./SearchPanel";

export default function SearchPanelMobile() {
  const [open, setOpen] = useState(false);

  /* Lock background scrolling while drawer is open */
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <>
      {/* =========================================================
          CLOSED SEARCH BUTTON
          ========================================================= */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.985 }}
        className="
          relative
          w-full
          h-[64px]
          overflow-hidden
          rounded-[18px]
          border
          border-[#c89d58]/25
          bg-[#0f3b2e]/90
          backdrop-blur-xl
          flex
          items-center
          justify-between
          px-4
          text-left
          shadow-[0_12px_35px_rgba(0,0,0,0.22)]
        "
      >
        {/* Soft gold glow */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-8
            -top-10
            h-24
            w-24
            rounded-full
            bg-[#c89d58]/10
            blur-2xl
          "
        />

        {/* Bottom gold line */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-0
            left-6
            right-6
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#c89d58]/35
            to-transparent
          "
        />

        <div className="relative flex min-w-0 items-center gap-3">
          {/* Search icon */}
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-[13px]
              border
              border-[#c89d58]/20
              bg-[#071b16]/75
            "
          >
            <Search
              size={19}
              strokeWidth={1.8}
              className="text-[#c89d58]"
            />
          </div>

          {/* Search text */}
          <div className="min-w-0">
            <p
              className="
                truncate
                text-[13px]
                font-medium
                text-[#f7f3ee]
              "
            >
              Search Luxury Properties
            </p>

            <p
              className="
                mt-0.5
                truncate
                text-[10.5px]
                text-white/45
              "
            >
              Location • Developer • Budget
            </p>
          </div>
        </div>

        {/* Open label */}
        <div
          className="
            relative
            shrink-0
            text-[9px]
            font-semibold
            uppercase
            tracking-[1.8px]
            text-[#c89d58]
          "
        >
          Open
        </div>
      </motion.button>

      {/* =========================================================
          DRAWER
          ========================================================= */}
      <AnimatePresence>
        {open && (
          <>
            {/* =====================================================
                BACKDROP
                ===================================================== */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="
                fixed
                inset-0
                bg-[#020806]/75
                backdrop-blur-sm
                z-[99999]
              "
            />

            {/* =====================================================
                DRAWER
                ===================================================== */}
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
                bg-[#071b16]
                rounded-t-[26px]
                border
                border-b-0
                border-[#c89d58]/15
                z-[100000]
                overflow-y-auto
                overscroll-contain
                shadow-[0_-20px_70px_rgba(0,0,0,0.45)]
              "
              role="dialog"
              aria-modal="true"
              aria-label="Luxury property search"
            >
              {/* =================================================
                  TOP GOLD HANDLE
                  ================================================= */}
              <div
                aria-hidden="true"
                className="
                  absolute
                  left-1/2
                  top-2
                  z-30
                  h-[3px]
                  w-12
                  -translate-x-1/2
                  rounded-full
                  bg-[#c89d58]/70
                "
              />

              {/* =================================================
                  HEADER
                  ================================================= */}
              <div
                className="
                  sticky
                  top-0
                  z-30
                  border-b
                  border-white/[0.07]
                  bg-[#0f3b2e]/95
                  px-5
                  pb-4
                  pt-6
                  backdrop-blur-xl
                "
              >
                {/* Header glow */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-14
                    h-28
                    w-28
                    rounded-full
                    bg-[#c89d58]/10
                    blur-3xl
                  "
                />

                <div className="relative flex items-center justify-between gap-3">
                  {/* Heading */}
                  <div>
                    <div className="mb-1 flex items-center gap-1.5">
                      <Sparkles
                        size={11}
                        strokeWidth={1.8}
                        className="text-[#c89d58]"
                      />

                      <p
                        className="
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[2.5px]
                          text-[#c89d58]
                        "
                      >
                        Luxury Search
                      </p>
                    </div>

                    <h3
                      className="
                        font-playfair
                        text-[20px]
                        font-medium
                        leading-tight
                        text-[#f7f3ee]
                      "
                    >
                      Find Your Property
                    </h3>

                    <p
                      className="
                        mt-1
                        text-[10.5px]
                        leading-relaxed
                        text-white/45
                      "
                    >
                      Find a property by location, developer or budget.
                    </p>
                  </div>

                  {/* Close */}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close property search"
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/10
                      bg-[#071b16]/70
                      text-white/75
                      transition
                      active:scale-95
                    "
                  >
                    <X
                      size={18}
                      strokeWidth={1.8}
                    />
                  </button>
                </div>
              </div>

              {/* =================================================
                  SEARCH CONTENT
                  ================================================= */}
              <div
                className="
                  relative
                  z-10
                  px-4
                  pb-[calc(24px+env(safe-area-inset-bottom))]
                  pt-4
                "
              >
                {/* Section label */}
                <div className="mb-3 flex items-center gap-2 px-1">
                  <span
                    className="
                      h-px
                      w-5
                      bg-[#c89d58]/45
                    "
                  />

                  <span
                    className="
                      text-[8.5px]
                      font-semibold
                      uppercase
                      tracking-[2px]
                      text-[#c89d58]/80
                    "
                  >
                    Refine Your Search
                  </span>
                </div>

                {/* =================================================
                    SEARCH PANEL

                    IMPORTANT:
                    Do NOT use overflow-hidden here.

                    SearchPanel contains dropdowns which need to
                    extend outside this card.
                    ================================================= */}
                <div
                  className="
                    relative
                    z-20
                    rounded-[20px]
                    border
                    border-white/[0.07]
                    bg-[#0b241d]/80
                    shadow-[0_12px_35px_rgba(0,0,0,0.18)]
                  "
                >
                  <SearchPanel />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}