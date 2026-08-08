"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  RefreshCcw,
  Repeat2,
} from "lucide-react";

const UNITS = {
  "Square Feet (sq ft)": 1,
  "Square Yards (sq yd)": 9,
  Acres: 43560,
  Hectares: 107639.104,
  "Guntha (Pune)": 1089,
  "Guntha (Nagpur)": 1337.8,
  Cent: 435.6,
  Bigha: 27225,
  "Square Metres (sq m)": 10.7639,
};

export default function AreaConverterTool() {
  const [fromUnit, setFromUnit] = useState(
    "Square Feet (sq ft)"
  );

  const [toUnit, setToUnit] = useState(
    "Square Yards (sq yd)"
  );

  const [value, setValue] = useState("");

  // ================= CONVERSION RESULT =================
  const result = useMemo(() => {
    if (
      !value ||
      Number.isNaN(Number(value)) ||
      Number(value) < 0
    ) {
      return "0.00";
    }

    const squareFeet =
      Number(value) * UNITS[fromUnit];

    const converted =
      squareFeet / UNITS[toUnit];

    return converted.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  }, [value, fromUnit, toUnit]);

  // ================= SWAP =================
  function swapUnits() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setValue("");
  }

  // ================= RESET =================
  function reset() {
    setFromUnit("Square Feet (sq ft)");
    setToUnit("Square Yards (sq yd)");
    setValue("");
  }

  return (
    <section className="w-full bg-[#fdfcf9] text-[#161616]">
      <div className="mx-auto max-w-[1450px] px-5 py-14 xl:px-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* ========================================================= */}
          {/* MAIN CONVERTER */}
          {/* ========================================================= */}

          <div className="min-w-0">

            <h2
              className="
                font-serif
                text-[28px]
                font-normal
                leading-tight
                text-[#10251f]
                md:text-[34px]
              "
            >
              Convert Area Units
            </h2>

            <div
              className="
                relative
                mt-5
                overflow-hidden
                rounded-[12px]
                border
                border-[#e7e0d3]
                bg-white
                text-[#161616]
                shadow-[0_10px_35px_rgba(0,0,0,0.03)]
              "
            >

              {/* ===================================================== */}
              {/* INPUT AREA */}
              {/* ===================================================== */}

              <div className="grid md:grid-cols-2">

                {/* ================= FROM ================= */}

                <div
                  className="
                    border-b
                    border-[#eee8dc]
                    p-6
                    md:border-b-0
                    md:border-r
                  "
                >

                  <p className="text-[12px] font-semibold text-[#1b1b1b]">
                    From
                  </p>

                  {/* SELECT UNIT */}

                  <label className="mt-5 block text-[11px] font-medium text-[#666]">
                    Select Unit
                  </label>

                  <select
                    value={fromUnit}
                    onChange={(e) =>
                      setFromUnit(e.target.value)
                    }
                    className="
                      mt-2
                      h-[48px]
                      w-full
                      rounded-lg
                      border
                      border-[#ddd7cc]
                      bg-white
                      px-4
                      text-[13px]
                      text-[#202020]
                      outline-none
                      transition
                      focus:border-[#c89d58]
                      focus:ring-1
                      focus:ring-[#c89d58]/20
                    "
                  >
                    {Object.keys(UNITS).map(
                      (unit) => (
                        <option
                          key={unit}
                          value={unit}
                          className="text-[#202020]"
                        >
                          {unit}
                        </option>
                      )
                    )}
                  </select>

                  {/* ENTER VALUE */}

                  <label className="mt-5 block text-[11px] font-medium text-[#666]">
                    Enter Value
                  </label>

                  <div
                    className="
                      mt-2
                      flex
                      h-[48px]
                      items-center
                      rounded-lg
                      border
                      border-[#ddd7cc]
                      bg-white
                      px-4
                      transition
                      focus-within:border-[#c89d58]
                      focus-within:ring-1
                      focus-within:ring-[#c89d58]/20
                    "
                  >

                    <input
                      type="number"
                      min="0"
                      value={value}
                      onChange={(e) =>
                        setValue(e.target.value)
                      }
                      placeholder="Enter value"
                      className="
                        min-w-0
                        flex-1
                        bg-transparent
                        text-[14px]
                        text-[#202020]
                        outline-none
                        placeholder:text-[#999]
                      "
                    />

                    <span className="ml-3 shrink-0 text-[11px] font-medium text-[#666]">
                      {unitShort(fromUnit)}
                    </span>

                  </div>

                </div>

                {/* ================= TO ================= */}

                <div className="p-6">

                  <p className="text-[12px] font-semibold text-[#1b1b1b]">
                    To
                  </p>

                  {/* SELECT UNIT */}

                  <label className="mt-5 block text-[11px] font-medium text-[#666]">
                    Select Unit
                  </label>

                  <select
                    value={toUnit}
                    onChange={(e) =>
                      setToUnit(e.target.value)
                    }
                    className="
                      mt-2
                      h-[48px]
                      w-full
                      rounded-lg
                      border
                      border-[#ddd7cc]
                      bg-white
                      px-4
                      text-[13px]
                      text-[#202020]
                      outline-none
                      transition
                      focus:border-[#c89d58]
                      focus:ring-1
                      focus:ring-[#c89d58]/20
                    "
                  >
                    {Object.keys(UNITS).map(
                      (unit) => (
                        <option
                          key={unit}
                          value={unit}
                          className="text-[#202020]"
                        >
                          {unit}
                        </option>
                      )
                    )}
                  </select>

                  {/* CONVERTED VALUE */}

                  <label className="mt-5 block text-[11px] font-medium text-[#666]">
                    Converted Value
                  </label>

                  <div
                    className="
                      mt-2
                      flex
                      h-[48px]
                      items-center
                      rounded-lg
                      border
                      border-[#e3dbcd]
                      bg-[#f2ede4]
                      px-4
                    "
                  >

                    <span
                      className="
                        min-w-0
                        flex-1
                        truncate
                        text-[27px]
                        font-medium
                        leading-none
                        text-[#111111]
                      "
                    >
                      {result}
                    </span>

                    <span className="ml-3 shrink-0 text-[11px] font-medium text-[#666]">
                      {unitShort(toUnit)}
                    </span>

                  </div>

                </div>
              </div>

              {/* ===================================================== */}
              {/* SWAP BUTTON */}
              {/* ===================================================== */}

              <button
                type="button"
                onClick={swapUnits}
                aria-label="Swap conversion units"
                className="
                  absolute
                  left-1/2
                  top-1/2
                  flex
                  h-10
                  w-10
                  -translate-x-1/2
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#d8d0c1]
                  bg-white
                  text-[#17342b]
                  shadow-[0_4px_15px_rgba(0,0,0,0.08)]
                  transition-all
                  duration-300
                  hover:border-[#c89d58]
                  hover:text-[#c89d58]
                  hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]
                  md:h-10
                  md:w-10
                "
              >
                <Repeat2 size={17} />
              </button>

              {/* ===================================================== */}
              {/* ACTION BUTTONS */}
              {/* ===================================================== */}

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  border-t
                  border-[#eee8dc]
                  p-5
                  sm:flex-row
                "
              >

                {/* CONVERT */}

                <button
                  type="button"
                  className="
                    flex
                    h-[48px]
                    flex-1
                    items-center
                    justify-center
                    gap-3
                    rounded-lg
                    bg-[#03261e]
                    text-[13px]
                    font-semibold
                    text-white
                    transition-all
                    duration-300
                    hover:bg-[#0a3c30]
                    hover:shadow-[0_8px_25px_rgba(3,38,30,0.18)]
                  "
                >
                  Convert Now

                  <ArrowRight size={16} />
                </button>

                {/* RESET */}

                <button
                  type="button"
                  onClick={reset}
                  className="
                    flex
                    h-[48px]
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-[#d9c7a2]
                    bg-white
                    text-[13px]
                    font-medium
                    text-[#222]
                    transition-all
                    duration-300
                    hover:border-[#c89d58]
                    hover:bg-[#faf8f3]
                    hover:text-[#8d682d]
                    sm:w-[155px]
                  "
                >
                  Reset

                  <RefreshCcw size={14} />
                </button>

              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* POPULAR CONVERSIONS */}
          {/* ========================================================= */}

          <PopularConversions />

        </div>
      </div>
    </section>
  );
}


/* =============================================================== */
/* POPULAR CONVERSIONS */
/* =============================================================== */

function PopularConversions() {
  const conversions = [
    ["1 Acre", "43,560 sq ft"],
    ["1 Guntha (Pune)", "1,089 sq ft"],
    ["1 Guntha (Nagpur)", "1,337 sq ft"],
    ["1 Hectare", "2.471 Acres"],
    ["1 Cent", "435.6 sq ft"],
  ];

  return (
    <aside
      className="
        h-fit
        rounded-[12px]
        border
        border-[#e4ddd1]
        bg-white
        p-5
        text-[#161616]
        shadow-[0_8px_30px_rgba(0,0,0,0.03)]
      "
    >

      {/* TITLE */}

      <h3 className="text-[13px] font-semibold text-[#161616]">
        Popular Conversions
      </h3>

      {/* LIST */}

      <div className="mt-4">

        {conversions.map(
          ([left, right]) => (
            <div
              key={left}
              className="
                flex
                items-center
                justify-between
                gap-4
                border-t
                border-[#eee8dc]
                py-3
                text-[12px]
              "
            >

              <span className="text-[#333333]">
                {left}
              </span>

              <span className="whitespace-nowrap text-[#555555]">
                = {right}
              </span>

            </div>
          )
        )}

      </div>

      {/* VIEW ALL */}

      <button
        type="button"
        className="
          mt-4
          flex
          h-[42px]
          w-full
          items-center
          justify-center
          gap-3
          rounded-lg
          border
          border-[#d9c7a2]
          bg-white
          text-[12px]
          font-medium
          text-[#17342b]
          transition-all
          duration-300
          hover:bg-[#03261e]
          hover:text-white
        "
      >
        View All Conversions

        <ArrowRight size={15} />
      </button>

    </aside>
  );
}


/* =============================================================== */
/* UNIT SHORT NAME */
/* =============================================================== */

function unitShort(unit) {
  const map = {
    "Square Feet (sq ft)": "sq ft",
    "Square Yards (sq yd)": "sq yd",
    Acres: "acres",
    Hectares: "ha",
    "Guntha (Pune)": "guntha",
    "Guntha (Nagpur)": "guntha",
    Cent: "cent",
    Bigha: "bigha",
    "Square Metres (sq m)": "sq m",
  };

  return map[unit] || "";
}