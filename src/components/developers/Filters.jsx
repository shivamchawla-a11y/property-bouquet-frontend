"use client";

import { Search, ChevronDown } from "lucide-react";

export default function Filters({
  search,
  setSearch,
  sort,
  setSort,
}) {
  return (
    <section className="py-10">
      <div className="max-w-[1380px] mx-auto px-5 lg:px-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          {/* Search */}
          <div className="relative w-full lg:w-[420px]">

            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search developers..."
              className="
                w-full
                h-[56px]
                rounded-xl
                border
                border-gray-200
                bg-white
                pl-14
                pr-5
                text-[15px]
                text-[#181818]
                placeholder:text-gray-400
                outline-none
                transition-all
                duration-300
                focus:border-[#D4AF37]
                focus:ring-2
                focus:ring-[#D4AF37]/20
              "
            />

          </div>

          {/* Sort */}
          <div className="flex items-center gap-4">

            <span className="text-[14px] text-[#555]">
              Sort by
            </span>

            <div className="relative">

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="
                  appearance-none
                  h-[56px]
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  pl-5
                  pr-12
                  text-[15px]
                  text-[#181818]
                  outline-none
                  cursor-pointer
                  transition-all
                  duration-300
                  focus:border-[#D4AF37]
                  focus:ring-2
                  focus:ring-[#D4AF37]/20
                "
              >
                <option value="latest">Latest</option>
                <option value="az">A - Z</option>
                <option value="za">Z - A</option>
              </select>

              <ChevronDown
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}