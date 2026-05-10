"use client";

import { ChevronDown, Search, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="absolute top-0 left-0 z-50 w-full">
      <div className="flex items-center justify-between px-8 py-6">

        {/* LEFT */}
        <div className="flex items-center gap-10">

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="logo"
              className="w-12 h-12 object-contain"
            />

            <h1 className="text-white text-3xl font-bold">
              Property Bouquet
            </h1>
          </div>

          {/* MENU */}
          <nav className="hidden xl:flex items-center gap-8 text-white font-semibold">

            <button className="flex items-center gap-1">
              Buy <ChevronDown size={16} />
            </button>

            <button className="flex items-center gap-1">
              City <ChevronDown size={16} />
            </button>

            <button className="flex items-center gap-1">
              Budget <ChevronDown size={16} />
            </button>

            <button className="flex items-center gap-1">
              Projects Status <ChevronDown size={16} />
            </button>

            <button className="flex items-center gap-1">
              Property Type <ChevronDown size={16} />
            </button>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          <button className="hidden lg:flex h-12 px-6 rounded-full bg-blue-600 text-white font-semibold items-center">
            INSIGHTS
          </button>

          <button className="hidden lg:flex h-12 px-6 rounded-full bg-gold text-white font-semibold items-center relative">
            Global

            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-full">
              NEW
            </span>
          </button>

          <button className="w-12 h-12 rounded-full border border-white/40 bg-white/10 backdrop-blur flex items-center justify-center text-white">
            <Search size={20} />
          </button>

          <button className="hidden md:flex items-center gap-2 text-white">
            <div className="w-12 h-12 rounded-full border border-white/40 bg-white/10 backdrop-blur flex items-center justify-center">
              <User size={20} />
            </div>

            Log in
          </button>

          <button className="bg-white text-black px-7 py-4 rounded-full font-semibold shadow-lg relative">
            Post Property

            <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-yellow-300 text-red-500 text-[10px] px-2 py-1 rounded-full font-bold">
              FREE
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}