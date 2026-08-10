"use client";

import { useState } from "react";
import {
  ChevronDown,
  ArrowRight,
  Calculator,
} from "lucide-react";

const rows = [
  {
    unit: "1 sq ft",
    squareFeet: "1 sq ft",
    squareYards: "0.111 sq yd",
    acres: "0.00002296",
    hectares: "0.00000929",
    gunthaPune: "0.000917",
    gunthaNagpur: "0.000748",
  },
  {
    unit: "1 sq yd",
    squareFeet: "9 sq ft",
    squareYards: "1 sq yd",
    acres: "0.0002066",
    hectares: "0.00008361",
    gunthaPune: "0.00825",
    gunthaNagpur: "0.00672",
  },
  {
    unit: "1 Acre",
    squareFeet: "43,560 sq ft",
    squareYards: "4,840 sq yd",
    acres: "1 Acre",
    hectares: "0.404686",
    gunthaPune: "40.4686",
    gunthaNagpur: "33.0539",
  },
  {
    unit: "1 Hectare",
    squareFeet: "107,639.1 sq ft",
    squareYards: "11,960.95 sq yd",
    acres: "2.471 Acres",
    hectares: "1 Hectare",
    gunthaPune: "100",
    gunthaNagpur: "81.81",
  },
];

const additionalRows = [
  {
    unit: "1 Guntha (Pune)",
    squareFeet: "1,089 sq ft",
    squareYards: "121 sq yd",
    acres: "0.025 Acre",
    hectares: "0.010117 Hectare",
    gunthaPune: "1",
    gunthaNagpur: "1.333",
  },
  {
    unit: "1 Guntha (Nagpur)",
    squareFeet: "1,600 sq ft",
    squareYards: "177.78 sq yd",
    acres: "0.03673 Acre",
    hectares: "0.01486 Hectare",
    gunthaPune: "0.75",
    gunthaNagpur: "1",
  },
];

const columns = [
  {
    key: "squareFeet",
    label: "Square Feet",
    short: "sq ft",
  },
  {
    key: "squareYards",
    label: "Square Yards",
    short: "sq yd",
  },
  {
    key: "acres",
    label: "Acres",
    short: "Acres",
  },
  {
    key: "hectares",
    label: "Hectares",
    short: "Hectares",
  },
  {
    key: "gunthaPune",
    label: "Guntha (Pune)",
    short: "Guntha Pune",
  },
  {
    key: "gunthaNagpur",
    label: "Guntha (Nagpur)",
    short: "Guntha Nagpur",
  },
];

export default function ConversionTable() {
  const [showMore, setShowMore] = useState(false);

  const visibleRows = showMore
    ? [...rows, ...additionalRows]
    : rows;

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1450px] px-5 pb-14 xl:px-8">

        {/* ===================================================== */}
        {/* HEADER                                                */}
        {/* ===================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div className="max-w-[760px]">

            <div className="mb-2 flex items-center gap-2">

              <span
                className="
                  inline-flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#17382e]
                  text-[#d7b66a]
                "
              >
                <Calculator
                  size={14}
                  strokeWidth={1.8}
                />
              </span>

              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-[#8a7552]
                "
              >
                Quick Reference
              </span>

            </div>

            <h2
              className="
                font-serif
                text-[27px]
                font-normal
                leading-tight
                text-[#10251f]
                md:text-[31px]
              "
            >
              Area Conversion Table
            </h2>

            <p
              className="
                mt-2
                max-w-[680px]
                text-[11px]
                leading-5
                text-[#6b6b6b]
                md:text-[12px]
              "
            >
              Quickly compare commonly used land and property
              measurement units including{" "}
              <strong className="font-semibold text-[#37443f]">
                square feet, square yards, acres, hectares
              </strong>{" "}
              and regional{" "}
              <strong className="font-semibold text-[#37443f]">
                Guntha
              </strong>{" "}
              measurements.
            </p>

          </div>

          {/* DESKTOP BUTTON */}

          <button
            type="button"
            onClick={() => setShowMore((prev) => !prev)}
            className="
              hidden
              h-[40px]
              shrink-0
              items-center
              gap-2
              rounded-lg
              border
              border-[#ddd7cc]
              bg-white
              px-4
              text-[11px]
              font-medium
              text-[#333333]
              shadow-[0_3px_12px_rgba(0,0,0,0.03)]
              transition-all
              duration-300
              hover:border-[#c9a64b]
              hover:bg-[#fcfaf5]
              hover:text-[#10251f]
              sm:flex
            "
          >
            <span>
              {showMore
                ? "Show Fewer Units"
                : "View Other Units"}
            </span>

            <ChevronDown
              size={14}
              strokeWidth={1.8}
              className={`
                transition-transform
                duration-300
                ${
                  showMore
                    ? "rotate-180"
                    : ""
                }
              `}
            />
          </button>

        </div>

        {/* ===================================================== */}
        {/* MOBILE SCROLL HINT                                   */}
        {/* ===================================================== */}

        <div
          className="
            mt-5
            flex
            items-center
            justify-between
            rounded-lg
            border
            border-[#eee8dc]
            bg-[#faf8f3]
            px-4
            py-2.5
            sm:hidden
          "
        >
          <div className="flex items-center gap-2">

            <span className="text-[10px] text-[#6b6b6b]">
              Swipe horizontally to view all units
            </span>

          </div>

          <ArrowRight
            size={13}
            className="text-[#8c7651]"
          />

        </div>

        {/* ===================================================== */}
        {/* TABLE WRAPPER                                        */}
        {/* ===================================================== */}

        <div
          className="
            relative
            mt-3
            overflow-hidden
            rounded-xl
            border
            border-[#e4ddd1]
            bg-white
            shadow-[0_6px_25px_rgba(0,0,0,0.035)]
            sm:mt-5
          "
        >

          {/* GOLD TOP ACCENT */}

          <div
            className="
              h-[2px]
              w-full
              bg-gradient-to-r
              from-transparent
              via-[#c9a64b]
              to-transparent
              opacity-70
            "
          />

          {/* ================================================= */}
          {/* SCROLL CONTAINER                                 */}
          {/* ================================================= */}

          <div
            className="
              overflow-x-auto
              overscroll-x-contain
              scrollbar-thin
              scrollbar-thumb-[#d8d0c2]
              scrollbar-track-transparent
            "
          >

            <table
              className="
                w-full
                min-w-[920px]
                border-collapse
                text-center
              "
            >

              {/* ================================================= */}
              {/* HEADER                                            */}
              {/* ================================================= */}

              <thead>

                <tr className="bg-[#faf8f3]">

                  {/* UNIT */}

                  <th
                    className="
                      sticky
                      left-0
                      z-20
                      min-w-[145px]
                      border-r
                      border-[#e7e0d3]
                      bg-[#faf8f3]
                      px-4
                      py-4
                      text-left
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.05em]
                      text-[#17382e]
                    "
                  >
                    Base Unit
                  </th>

                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="
                        min-w-[145px]
                        border-r
                        border-[#e7e0d3]
                        px-4
                        py-4
                        text-[10px]
                        font-semibold
                        leading-5
                        text-[#202020]
                        last:border-r-0
                      "
                    >
                      <span className="hidden md:inline">
                        {column.label}
                      </span>

                      <span className="md:hidden">
                        {column.short}
                      </span>
                    </th>
                  ))}

                </tr>

              </thead>

              {/* ================================================= */}
              {/* BODY                                              */}
              {/* ================================================= */}

              <tbody>

                {visibleRows.map(
                  (row, rowIndex) => (
                    <tr
                      key={row.unit}
                      className="
                        border-t
                        border-[#eee8dc]
                        transition-colors
                        duration-200
                        hover:bg-[#fcfaf5]
                      "
                    >

                      {/* BASE UNIT */}

                      <td
                        className="
                          sticky
                          left-0
                          z-10
                          border-r
                          border-[#eee8dc]
                          bg-white
                          px-4
                          py-4
                          text-left
                          text-[11px]
                          font-semibold
                          leading-5
                          text-[#17382e]
                          transition-colors
                          duration-200
                          group-hover:bg-[#fcfaf5]
                        "
                      >
                        <div className="flex items-center gap-2">

                          <span
                            className="
                              h-1.5
                              w-1.5
                              shrink-0
                              rounded-full
                              bg-[#c9a64b]
                            "
                          />

                          <span>
                            {row.unit}
                          </span>

                        </div>
                      </td>

                      {/* DATA */}

                      {columns.map(
                        (
                          column,
                          columnIndex
                        ) => (
                          <td
                            key={`${row.unit}-${column.key}`}
                            className="
                              border-r
                              border-[#eee8dc]
                              px-4
                              py-4
                              text-[11px]
                              leading-5
                              text-[#4a4a4a]
                              last:border-r-0
                            "
                          >
                            {row[column.key]}
                          </td>
                        )
                      )}

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* MOBILE RIGHT EDGE FADE */}

          <div
            className="
              pointer-events-none
              absolute
              right-0
              top-0
              h-full
              w-8
              bg-gradient-to-l
              from-white
              to-transparent
              sm:hidden
            "
          />

        </div>

        {/* ===================================================== */}
        {/* MOBILE VIEW OTHER UNITS                              */}
        {/* ===================================================== */}

        <button
          type="button"
          onClick={() =>
            setShowMore((prev) => !prev)
          }
          className="
            mt-4
            flex
            h-[44px]
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            border-[#ddd7cc]
            bg-white
            px-4
            text-[11px]
            font-medium
            text-[#333333]
            shadow-[0_3px_12px_rgba(0,0,0,0.03)]
            transition-all
            duration-300
            hover:border-[#c9a64b]
            hover:bg-[#fcfaf5]
            hover:text-[#10251f]
            sm:hidden
          "
        >
          <span>
            {showMore
              ? "Show Fewer Units"
              : "View Other Units"}
          </span>

          <ChevronDown
            size={14}
            strokeWidth={1.8}
            className={`
              transition-transform
              duration-300
              ${
                showMore
                  ? "rotate-180"
                  : ""
              }
            `}
          />
        </button>

        {/* ===================================================== */}
        {/* INFORMATION NOTE                                     */}
        {/* ===================================================== */}

        <div
          className="
            mt-5
            rounded-lg
            border
            border-[#eee7db]
            bg-[#f8f5ee]
            px-4
            py-3.5
            md:px-5
          "
        >

          <p
            className="
              text-[10px]
              leading-5
              text-[#706d67]
              md:text-[11px]
            "
          >
            <strong className="font-semibold text-[#17382e]">
              Note:
            </strong>{" "}
            Area conversion values can vary for certain
            traditional or region-specific units.{" "}
            <strong className="font-semibold text-[#17382e]">
              Guntha measurements
            </strong>{" "}
            may differ by local convention, so always
            verify the applicable measurement standard
            when using these values for legal,
            registration or valuation purposes.
          </p>

        </div>

      </div>
    </section>
  );
}