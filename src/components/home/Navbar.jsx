"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    title: "PROPERTIES",
    items: ["Apartments", "Penthouses", "Villas", "Plots"],
  },
  {
    title: "INVESTMENT INTELLIGENCE",
    items: ["Market Reports", "ROI Analysis", "Luxury Trends"],
  },
  {
    title: "LOCATIONS",
    items: ["Dubai", "Gurgaon", "Goa", "London"],
  },
  {
    title: "ADVISORY",
    items: ["Private Advisory", "Investment Planning"],
  },
  {
    title: "MARKET INSIGHTS",
    items: ["Insights", "Guides", "Luxury News"],
  },
  {
    title: "ABOUT US",
    items: ["Our Story", "Clients", "Vision"],
  },
];

export default function Navbar() {
  const [active, setActive] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[999] transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1450px] mx-auto px-5 xl:px-8">
        
        <div className="h-[82px] flex items-center justify-between">
          
          {/* LEFT */}
          <div className="flex items-center gap-10">

            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center gap-3 shrink-0"
            >
              <img
                src="/logo.png"
                alt="logo"
                className="w-[48px] h-[48px] object-contain"
              />

              <div className="leading-none">
                <h2 className="text-[24px] xl:text-[26px] font-semibold text-white tracking-tight font-heading">
                  PROPERTY
                </h2>

                <p className="text-[#c59d4f] tracking-[4px] text-[11px] xl:text-[12px] font-medium mt-1">
                  BOUQUET
                </p>
              </div>
            </Link>

            {/* DESKTOP MENU */}
            <nav className="hidden xl:flex items-center gap-[2px]">
              {navItems.map((item) => (
                <div
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => setActive(item.title)}
                  onMouseLeave={() => setActive(null)}
                >
                  <button className="flex items-center gap-1 text-white/85 hover:text-[#d6aa53] transition text-[11px] xl:text-[12px] font-medium tracking-[0.08em] px-2.5 h-9 uppercase">
                    {item.title}

                    <ChevronDown
                      size={13}
                      className={`transition duration-300 ${
                        active === item.title
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {active === item.title && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 12,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: 8,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="absolute top-[48px] left-0 w-[240px]"
                      >
                        <div className="rounded-[22px] border border-white/10 bg-[#0b0b0b]/95 backdrop-blur-2xl p-3 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">

                          <div className="space-y-1">
                            {item.items.map((sub) => (
                              <button
                                key={sub}
                                className="w-full text-left px-4 py-3 rounded-xl text-white/75 hover:bg-white/5 hover:text-[#d6aa53] transition text-[13px]"
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

            {/* CONSULTATION BUTTON */}
            <button className="hidden lg:flex h-[44px] px-6 rounded-xl bg-gradient-to-b from-[#d9b061] to-[#b8862e] text-black font-semibold text-[11px] tracking-[0.12em] shadow-[0_10px_35px_rgba(0,0,0,0.35)] hover:scale-[1.03] transition uppercase items-center">
              Private Consultation
            </button>

            {/* MENU */}
            <button className="w-[46px] h-[46px] rounded-full border border-[#b8862e]/40 bg-black/30 backdrop-blur-xl flex items-center justify-center text-[#d9b061] hover:bg-[#d9b061] hover:text-black transition-all duration-300">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}