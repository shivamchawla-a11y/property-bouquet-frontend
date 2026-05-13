"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

const tabs = [
  "Buy",
  "Rent",
  "New Launch",
  "Commercial",
  "Plots",
  "SCO",
];

const trending = [
  "Sohna Road",
  "Golf Course Road",
  "Dwarka Expressway",
  "New Gurgaon",
  "SPR",
  "NH-48",
];

// ================= SLIDES =================
const projects = [
  {
    image: "/img1.webp",
  },
  {
    image: "/img2.webp",
  },
  {
    image: "/img3.webp",
  },
  {
    image: "/img4.webp",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  // ================= AUTO PLAY =================
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [current]);

  // ================= NEXT =================
  const nextSlide = () => {
    setCurrent((prev) =>
      prev === projects.length - 1 ? 0 : prev + 1
    );
  };

  // ================= PREV =================
  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? projects.length - 1 : prev - 1
    );
  };

  return (
    <section className="relative overflow-hidden bg-[#f7f7f7]">

      {/* HERO */}
      <div className="relative h-[560px] lg:h-[620px] overflow-hidden rounded-b-[40px]">

        {/* SLIDER */}
        <AnimatePresence mode="wait">

          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >

            {/* IMAGE */}
            <motion.img
              src={projects[current].image}
              alt=""
              initial={{
                scale: 1,
                filter: "brightness(0.9)",
              }}
              animate={{
                scale: 1.08,
                filter: "brightness(1)",
              }}
              transition={{
                duration: 7,
                ease: "linear",
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/30" />

            {/* CINEMATIC LIGHT */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

            {/* BOTTOM FADE */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* LEFT ARROW */}
        <button
          onClick={prevSlide}
          className="absolute left-5 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition duration-300 flex items-center justify-center"
        >
          <ChevronLeft size={30} />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={nextSlide}
          className="absolute right-5 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition duration-300 flex items-center justify-center"
        >
          <ChevronRight size={30} />
        </button>

        {/* GLASS INFO STRIP */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 hidden lg:flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3">

          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

          <p className="text-white text-sm tracking-wide">
            Discover Ultra Luxury Properties Across India & Dubai
          </p>
        </div>

        {/* DOTS */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">

          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`transition-all duration-500 ${
                current === index
                  ? "w-12 h-[3px] bg-white rounded-full"
                  : "w-3 h-[3px] bg-white/40 rounded-full hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* SEARCH SECTION */}
      <div className="relative z-40 max-w-[1080px] mx-auto -mt-16 lg:-mt-20 px-4">

        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-white rounded-[30px] shadow-[0_20px_70px_rgba(0,0,0,0.12)] overflow-hidden border border-white"
        >

          {/* TOP TABS */}
          <div className="flex flex-wrap items-center justify-center lg:justify-between gap-2 px-5 lg:px-8 pt-5 border-b border-gray-100 bg-[#fafafa]">

            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`relative px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  index === 0
                    ? "text-white"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {index === 0 && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg"
                  />
                )}

                <span className="relative z-10">
                  {tab}
                </span>
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div className="p-4 lg:p-5">

            <div className="flex flex-col lg:flex-row gap-3">

              {/* INPUT */}
              <div className="relative flex-1 group">

                <Search
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition"
                />

                <input
                  type="text"
                  placeholder='Search "City, Locality, or Project"'
                  className="w-full h-[62px] bg-[#fafafa] border border-gray-200 rounded-2xl pl-14 pr-6 text-[15px] outline-none focus:border-red-500 focus:bg-white transition-all"
                />
              </div>

              {/* BUTTON */}
              <button className="h-[62px] px-10 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-sm lg:text-base transition-all duration-300 shadow-xl hover:scale-[1.02]">
                SEARCH
              </button>
            </div>

            {/* TRENDING */}
            <div className="flex flex-wrap items-center gap-3 mt-5">

              <span className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                Trending
              </span>

              {trending.map((item) => (
                <button
                  key={item}
                  className="px-4 py-2 rounded-full bg-[#f3f3f3] hover:bg-red-50 hover:text-red-500 text-gray-700 transition text-sm font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}