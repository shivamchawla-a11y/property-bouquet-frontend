"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ================= BANNERS =================
const banners = [
  "/luxurybanner1.webp",
  "/luxurybanner2.webp"
];

export default function LuxuryBanner() {
  const [current, setCurrent] = useState(0);

  // ================= AUTO SLIDE =================
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#f6f6f6] pt-8 pb-4">

      <div className="max-w-[1450px] mx-auto px-4">

        <div className="relative overflow-hidden rounded-[26px] shadow-xl">

          {/* SLIDER */}
          <AnimatePresence mode="wait">

            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="relative"
            >

              {/* IMAGE */}
              <motion.img
                src={banners[current]}
                alt=""
                initial={{ scale: 1 }}
                animate={{ scale: 1.06 }}
                transition={{
                  duration: 8,
                  ease: "linear",
                }}
                className="w-full h-[170px] md:h-[220px] object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* DOTS */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">

            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`transition-all duration-500 ${
                  current === index
                    ? "w-10 h-[3px] bg-white rounded-full"
                    : "w-3 h-[3px] bg-white/50 rounded-full hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}