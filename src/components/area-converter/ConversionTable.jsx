"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const rows = [
  {
    unit: "1 sq ft",
    values: [
      "0.111 sq yd",
      "0.00002296",
      "0.00000929",
      "0.000917",
      "0.000748",
    ],
  },
  {
    unit: "1 sq yd",
    values: [
      "1 sq yd",
      "0.0002066",
      "0.00008361",
      "0.00825",
      "0.00672",
    ],
  },
  {
    unit: "1 Acre",
    values: [
      "4,840 sq yd",
      "1 Acre",
      "0.404686",
      "40.4686",
      "33.0539",
    ],
  },
  {
    unit: "1 Hectare",
    values: [
      "11,960.95 sq yd",
      "2.471 Acres",
      "1 Hectare",
      "100",
      "81.81",
    ],
  },
];

export default function ConversionTable() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="w-full bg-[#fdfcf9]">
      <div className="mx-auto max-w-[1450px] px-5 pb-12 xl:px-8">

        {/* ===================================================== */}
        {/* HEADER                                                */}
        {/* ===================================================== */}

        <div className="flex items-end justify-between gap-5">

          <div>
            <h2
              className="
                font-serif
                text-[26px]
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
                mt-1
                text-[11px]
                leading-5
                text-[#6b6b6b]
              "
            >
              Quick reference for commonly used area conversions in
              real estate.
            </p>
          </div>

          {/* VIEW OTHER UNITS */}

          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="
              hidden
              h-[40px]
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
              hover:text-[#10251f]
              sm:flex
            "
          >
            <span className="text-[#333333]">
              View Other Units
            </span>

            <ChevronDown
              size={14}
              strokeWidth={1.8}
              className={`
                text-[#333333]
                transition-transform
                duration-300
                ${showMore ? "rotate-180" : ""}
              `}
            />
          </button>
        </div>

        {/* ===================================================== */}
        {/* TABLE                                                 */}
        {/* ===================================================== */}

        <div
          className="
            mt-5
            overflow-x-auto
            rounded-lg
            border
            border-[#e4ddd1]
            bg-white
            shadow-[0_4px_20px_rgba(0,0,0,0.025)]
          "
        >
          <table
            className="
              w-full
              min-w-[850px]
              border-collapse
              text-center
            "
          >
            {/* ================================================= */}
            {/* TABLE HEADER                                      */}
            {/* ================================================= */}

            <thead>
              <tr className="bg-[#faf8f3]">

                <th
                  className="
                    border-r
                    border-[#e7e0d3]
                    px-4
                    py-3
                    text-[11px]
                    font-semibold
                    leading-5
                    text-[#202020]
                  "
                >
                  Square Feet (sq ft)
                </th>

                <th
                  className="
                    border-r
                    border-[#e7e0d3]
                    px-4
                    py-3
                    text-[11px]
                    font-semibold
                    leading-5
                    text-[#202020]
                  "
                >
                  Square Yards (sq yd)
                </th>

                <th
                  className="
                    border-r
                    border-[#e7e0d3]
                    px-4
                    py-3
                    text-[11px]
                    font-semibold
                    leading-5
                    text-[#202020]
                  "
                >
                  Acres
                </th>

                <th
                  className="
                    border-r
                    border-[#e7e0d3]
                    px-4
                    py-3
                    text-[11px]
                    font-semibold
                    leading-5
                    text-[#202020]
                  "
                >
                  Hectares
                </th>

                <th
                  className="
                    border-r
                    border-[#e7e0d3]
                    px-4
                    py-3
                    text-[11px]
                    font-semibold
                    leading-5
                    text-[#202020]
                  "
                >
                  Guntha (Pune)
                </th>

                <th
                  className="
                    px-4
                    py-3
                    text-[11px]
                    font-semibold
                    leading-5
                    text-[#202020]
                  "
                >
                  Guntha (Nagpur)
                </th>

              </tr>
            </thead>

            {/* ================================================= */}
            {/* TABLE BODY                                        */}
            {/* ================================================= */}

            <tbody>

              {rows.map((row) => (
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

                  {/* FIRST COLUMN */}

                  <td
                    className="
                      border-r
                      border-[#eee8dc]
                      px-4
                      py-3
                      text-[11px]
                      font-medium
                      leading-5
                      text-[#333333]
                    "
                  >
                    {row.unit}
                  </td>

                  {/* REMAINING COLUMNS */}

                  {row.values.map((value, index) => (
                    <td
                      key={`${row.unit}-${index}`}
                      className={`
                        px-4
                        py-3
                        text-[11px]
                        leading-5
                        text-[#4a4a4a]
                        ${
                          index !== row.values.length - 1
                            ? "border-r border-[#eee8dc]"
                            : ""
                        }
                      `}
                    >
                      {value}
                    </td>
                  ))}

                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {/* ===================================================== */}
        {/* MOBILE VIEW OTHER UNITS                              */}
        {/* ===================================================== */}

        <button
          type="button"
          onClick={() => setShowMore(!showMore)}
          className="
            mt-4
            flex
            h-[42px]
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
            hover:text-[#10251f]
            sm:hidden
          "
        >
          <span className="text-[#333333]">
            View Other Units
          </span>

          <ChevronDown
            size={14}
            strokeWidth={1.8}
            className={`
              text-[#333333]
              transition-transform
              duration-300
              ${showMore ? "rotate-180" : ""}
            `}
          />
        </button>

      </div>
    </section>
  );
}