"use client";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

export default function Filters({
  search,
  setSearch,
  sort,
  setSort,
}) {
  return (
    <section className="px-6 pb-8 pt-14 sm:px-8 lg:px-12">

      <div className="mx-auto max-w-7xl">

        <div className="flex flex-col gap-4 rounded-[28px] border border-[#e8dfd3] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">

          {/* Search */}

          <div className="relative w-full md:max-w-xl">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search by location..."
              aria-label="Search locations"
              className="h-12 w-full rounded-2xl border border-[#e5e7eb] bg-[#faf9f7] pl-11 pr-4 text-sm text-[#081c15] outline-none transition placeholder:text-[#9ca3af] focus:border-[#C89D58] focus:ring-2 focus:ring-[#C89D58]/10"
            />

          </div>

          {/* Sort */}

          <div className="flex w-full items-center gap-3 md:w-auto">

            <div className="flex h-12 items-center gap-2 rounded-2xl border border-[#e5e7eb] bg-[#faf9f7] px-4 text-[#6b7280]">

              <SlidersHorizontal
                size={17}
              />

              <span className="hidden text-xs font-medium uppercase tracking-[0.12em] sm:block">
                Sort
              </span>

            </div>

            <select
              value={sort}
              onChange={(event) =>
                setSort(
                  event.target.value
                )
              }
              aria-label="Sort locations"
              className="h-12 flex-1 rounded-2xl border border-[#e5e7eb] bg-[#faf9f7] px-4 text-sm font-medium text-[#081c15] outline-none transition focus:border-[#C89D58] md:w-48 md:flex-none"
            >
              <option value="latest">
                Latest
              </option>

              <option value="az">
                Name: A–Z
              </option>

              <option value="za">
                Name: Z–A
              </option>
            </select>

          </div>

        </div>

      </div>

    </section>
  );
}