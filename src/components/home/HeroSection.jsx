"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <img
        src="/lamborghini.png"
        alt="banner"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/35" />

      {/* SIDE ARROWS */}
      <button className="absolute left-8 top-1/2 -translate-y-1/2 z-20 text-white">
        <ChevronLeft size={60} />
      </button>

      <button className="absolute right-8 top-1/2 -translate-y-1/2 z-20 text-white">
        <ChevronRight size={60} />
      </button>

      {/* CONTENT */}
      <div className="relative z-10 flex h-full items-center justify-center px-10">

        <div className="max-w-7xl w-full flex items-center justify-between">

          {/* LEFT BUILDING IMAGE */}
          <div className="hidden lg:block w-[40%]">
            <img
              src="/building.png"
              alt="building"
              className="w-full object-contain"
            />
          </div>

        </div>
      </div>

      {/* SEARCH BOX */}
      <div className="absolute bottom-[-90px] left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-7xl">

        <div className="bg-white rounded-[30px] shadow-2xl overflow-hidden">

          {/* TABS */}
          <div className="flex items-center px-10 pt-8">

            <button className="bg-red-600 text-white px-10 py-4 rounded-full font-bold">
              Buy
            </button>

            <div className="flex-1 flex justify-evenly text-gray-600 font-medium">
              <button>Rent</button>
              <button>New Launch</button>
              <button>Commercial</button>
              <button>Plots</button>
              <button>SCO</button>
            </div>
          </div>

          {/* SEARCH */}
          <div className="flex gap-4 p-6">

            <input
              type="text"
              placeholder='Search "City, Locality, or Project"'
              className="flex-1 h-20 border border-gray-200 rounded-2xl px-6 text-lg outline-none"
            />

            <button className="bg-red-600 text-white px-10 rounded-2xl font-bold text-xl">
              SEARCH
            </button>
          </div>

          {/* TRENDING */}
          <div className="flex flex-wrap items-center gap-3 px-6 pb-6">

            <span className="text-gray-400 text-sm font-bold uppercase">
              Trending
            </span>

            {[
              "Sohna Road",
              "Golf Course Road",
              "Dwarka Expressway",
              "New Gurgaon",
              "SPR",
            ].map((item) => (
              <button
                key={item}
                className="px-5 py-2 bg-gray-100 rounded-full text-gray-600"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}