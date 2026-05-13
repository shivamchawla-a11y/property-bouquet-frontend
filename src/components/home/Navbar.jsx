"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  Menu,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  {
    title: "City",
    items: ["Gurgaon", "Noida", "Delhi", "Dubai"],
  },
  {
    title: "Budget",
    items: ["1 Cr - 2 Cr", "2 Cr - 5 Cr", "5 Cr+"],
  },
  {
    title: "Projects Status",
    items: ["New Launch", "Ready To Move", "Under Construction"],
  },
  {
    title: "Property Type",
    items: ["Apartments", "Penthouses", "Villas", "Plots"],
  },
  {
    title: "Rental",
    items: ["Luxury Rentals", "Commercial Rentals"],
  },
];

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1450px] mx-auto px-5 xl:px-8">

        {/* NAVBAR */}
        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-8">

            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center gap-3 shrink-0"
            >
              <img
                src="/logo.png"
                alt="Property Bouquet"
                className="w-10 h-10 object-contain"
              />

              <div className="leading-tight">
                <h1
                  className={`text-[26px] font-bold tracking-tight transition ${
                    scrolled ? "text-[#111]" : "text-white"
                  }`}
                >
                  Property
                </h1>

                <p
                  className={`text-sm font-medium tracking-[3px] uppercase transition ${
                    scrolled
                      ? "text-gray-500"
                      : "text-white/70"
                  }`}
                >
                  Bouquet
                </p>
              </div>
            </Link>

            {/* DESKTOP MENU */}
            <nav className="hidden xl:flex items-center gap-2">

              {/* MENU ICON */}
              <button
                className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                  scrolled
                    ? "hover:bg-gray-100 text-black"
                    : "hover:bg-white/10 text-white"
                }`}
              >
                <Menu size={18} />
              </button>

              {menuItems.map((item) => (
                <div
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(item.title)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <button
                    className={`flex items-center gap-1.5 px-4 h-10 rounded-full text-[14px] font-medium transition-all ${
                      scrolled
                        ? "text-gray-700 hover:bg-gray-100 hover:text-black"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    {item.title}

                    <ChevronDown
                      size={14}
                      className={`transition ${
                        activeMenu === item.title
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {/* DROPDOWN */}
                  <AnimatePresence>
                    {activeMenu === item.title && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-[52px] left-0 w-[260px]"
                      >
                        <div className="rounded-[28px] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-4">

                          <p className="text-xs uppercase tracking-[3px] text-gray-400 px-3 mb-3">
                            {item.title}
                          </p>

                          <div className="space-y-1">
                            {item.items.map((sub) => (
                              <button
                                key={sub}
                                className="w-full text-left px-4 py-3 rounded-2xl text-[15px] text-gray-700 hover:bg-[#f5f7fb] hover:text-red-500 transition font-medium"
                              >
                                {sub}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* INSIGHTS */}
            <button className="hidden lg:flex h-11 px-5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold items-center shadow-lg hover:scale-105 transition">
              INSIGHTS
            </button>

            {/* GLOBAL */}
            <button className="hidden lg:flex h-11 px-5 rounded-full bg-gradient-to-r from-[#d7b04c] to-[#b88922] text-white text-sm font-semibold items-center relative shadow-lg hover:scale-105 transition">
              Global

              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[9px] px-1.5 py-[1px] rounded-full font-bold">
                NEW
              </span>
            </button>

            {/* SEARCH */}
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                scrolled
                  ? "bg-gray-100 text-black hover:bg-gray-200"
                  : "bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Search size={17} />
            </button>

            {/* LOGIN */}
            <button
              className={`hidden md:flex items-center gap-2 px-2 transition ${
                scrolled ? "text-black" : "text-white"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                  scrolled
                    ? "bg-gray-100"
                    : "bg-white/10 border border-white/10 backdrop-blur-md"
                }`}
              >
                <User size={17} />
              </div>

              <span className="text-sm font-medium">
                Log in
              </span>
            </button>

            {/* POST PROPERTY */}
            <button className="relative overflow-hidden bg-white text-black px-6 h-11 rounded-full font-semibold text-sm shadow-[0_8px_25px_rgba(0,0,0,0.12)] hover:scale-105 transition-all">

              <span className="relative z-10">
                Post Property
              </span>

              <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-yellow-300 text-red-500 text-[9px] px-2 py-[3px] rounded-full font-bold">
                FREE
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}