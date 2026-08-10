"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  RefreshCcw,
  Repeat2,
  Check,
} from "lucide-react";

/* ===============================================================
   AREA UNITS
================================================================ */

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

/* ===============================================================
   UNIT SHORT NAMES
================================================================ */

const UNIT_SHORT_NAMES = {
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

/* ===============================================================
   POPULAR CONVERSIONS
================================================================ */

const POPULAR_CONVERSIONS = [
  {
    from: "1 Acre",
    to: "43,560 sq ft",
  },
  {
    from: "1 Guntha (Pune)",
    to: "1,089 sq ft",
  },
  {
    from: "1 Guntha (Nagpur)",
    to: "1,337.8 sq ft",
  },
  {
    from: "1 Hectare",
    to: "2.471 Acres",
  },
  {
    from: "1 Cent",
    to: "435.6 sq ft",
  },
];

/* ===============================================================
   NUMBER FORMATTER
================================================================ */

const numberFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

/* ===============================================================
   MAIN COMPONENT
================================================================ */

export default function AreaConverterTool() {
  const [fromUnit, setFromUnit] = useState("Square Feet (sq ft)");
  const [toUnit, setToUnit] = useState("Square Yards (sq yd)");
  const [value, setValue] = useState("");

  /* =============================================================
     VALIDATION
  ============================================================= */

  const numericValue = Number(value);

  const hasValue =
    value.trim() !== "" &&
    Number.isFinite(numericValue) &&
    numericValue >= 0;

  /* =============================================================
     CONVERSION
  ============================================================= */

  const conversion = useMemo(() => {
    if (!hasValue) {
      return {
        value: 0,
        formatted: "0.00",
      };
    }

    const squareFeet = numericValue * UNITS[fromUnit];

    const converted = squareFeet / UNITS[toUnit];

    if (!Number.isFinite(converted)) {
      return {
        value: 0,
        formatted: "0.00",
      };
    }

    return {
      value: converted,
      formatted: numberFormatter.format(converted),
    };
  }, [hasValue, numericValue, fromUnit, toUnit]);

  /* =============================================================
     INPUT HANDLER
  ============================================================= */

  function handleValueChange(event) {
    const nextValue = event.target.value;

    if (nextValue === "") {
      setValue("");
      return;
    }

    if (/^\d*\.?\d*$/.test(nextValue)) {
      setValue(nextValue);
    }
  }

  /* =============================================================
     SWAP UNITS
  ============================================================= */

  function swapUnits() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  /* =============================================================
     RESET
  ============================================================= */

  function reset() {
    setFromUnit("Square Feet (sq ft)");
    setToUnit("Square Yards (sq yd)");
    setValue("");
  }

  /* =============================================================
     RENDER
  ============================================================= */

  return (
    <section className="w-full">
      {/* =========================================================
          OUTER CONTENT WRAPPER

          Added responsive horizontal padding here so the entire
          calculator has breathing room from the left/right edges.
      ========================================================= */}

      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div
          className="
            grid
            gap-8
            lg:grid-cols-[minmax(0,1fr)_320px]
            lg:gap-10
            xl:grid-cols-[minmax(0,1fr)_340px]
            xl:gap-12
          "
        >
          {/* =====================================================
              MAIN CONVERTER
          ===================================================== */}

          <div className="min-w-0">
            {/* HEADER */}

            <div className="px-1 pt-5 sm:px-2">
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[2.5px]
                  text-[#b58b45]
                "
              >
                Area Calculator
              </p>

              <h2
                className="
                  mt-2
                  font-serif
                  text-[30px]
                  font-normal
                  leading-[1.15]
                  text-[#10251f]
                  md:text-[36px]
                "
              >
                Convert Area Units
              </h2>

              <p
                className="
                  mt-3
                  max-w-[620px]
                  text-[13px]
                  leading-6
                  text-[#777]
                  md:text-[14px]
                "
              >
                Quickly convert land and property measurements
                between commonly used area units.
              </p>
            </div>

            {/* =================================================
                CONVERTER CARD
            ================================================= */}

            <div
              className="
                relative
                mt-7
                overflow-hidden
                rounded-[18px]
                border
                border-[#e7e0d3]
                bg-white
                text-[#161616]
                shadow-[0_15px_50px_rgba(0,0,0,0.045)]
              "
            >
              {/* TOP GOLD ACCENT */}

              <div
                className="
                  h-[2px]
                  w-full
                  bg-gradient-to-r
                  from-transparent
                  via-[#c89d58]
                  to-transparent
                "
              />

              {/* =================================================
                  INPUT AREA
              ================================================= */}

              <div className="grid md:grid-cols-2">
                {/* ================= FROM ================= */}

                <div
                  className="
                    border-b
                    border-[#eee8dc]
                    p-6
                    sm:p-7
                    md:border-b-0
                    md:border-r
                    md:p-8
                  "
                >
                  {/* SECTION HEADER */}

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p
                        className="
                          text-[12px]
                          font-semibold
                          uppercase
                          tracking-[1px]
                          text-[#1b1b1b]
                        "
                      >
                        From
                      </p>

                      <p className="mt-1 text-[11px] text-[#999]">
                        Enter your measurement
                      </p>
                    </div>

                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#f7f2e8]
                        text-[#b58b45]
                      "
                    >
                      <span className="text-[11px] font-semibold">
                        01
                      </span>
                    </div>
                  </div>

                  {/* SELECT UNIT */}

                  <label
                    htmlFor="area-from-unit"
                    className="
                      mt-6
                      block
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.7px]
                      text-[#666]
                    "
                  >
                    Select Unit
                  </label>

                  <select
                    id="area-from-unit"
                    value={fromUnit}
                    onChange={(event) =>
                      setFromUnit(event.target.value)
                    }
                    className="
                      mt-2
                      h-[50px]
                      w-full
                      rounded-xl
                      border
                      border-[#ddd7cc]
                      bg-white
                      px-4
                      text-[13px]
                      text-[#202020]
                      outline-none
                      transition-all
                      duration-200
                      hover:border-[#cfc2aa]
                      focus:border-[#c89d58]
                      focus:ring-4
                      focus:ring-[#c89d58]/10
                    "
                  >
                    {Object.keys(UNITS).map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>

                  {/* ENTER VALUE */}

                  <label
                    htmlFor="area-value"
                    className="
                      mt-5
                      block
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.7px]
                      text-[#666]
                    "
                  >
                    Enter Value
                  </label>

                  <div
                    className="
                      mt-2
                      flex
                      h-[58px]
                      items-center
                      rounded-xl
                      border
                      border-[#ddd7cc]
                      bg-white
                      px-4
                      transition-all
                      duration-200
                      focus-within:border-[#c89d58]
                      focus-within:ring-4
                      focus-within:ring-[#c89d58]/10
                    "
                  >
                    <input
                      id="area-value"
                      type="text"
                      inputMode="decimal"
                      value={value}
                      onChange={handleValueChange}
                      placeholder="Enter value"
                      aria-label="Area value"
                      className="
                        min-w-0
                        flex-1
                        bg-transparent
                        text-[20px]
                        font-medium
                        text-[#202020]
                        outline-none
                        placeholder:text-[16px]
                        placeholder:font-normal
                        placeholder:text-[#aaa]
                      "
                    />

                    <span
                      className="
                        ml-3
                        shrink-0
                        rounded-md
                        bg-[#f7f3eb]
                        px-2.5
                        py-1.5
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.5px]
                        text-[#777]
                      "
                    >
                      {unitShort(fromUnit)}
                    </span>
                  </div>
                </div>

                {/* ================= TO ================= */}

                <div className="p-6 sm:p-7 md:p-8">
                  {/* SECTION HEADER */}

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p
                        className="
                          text-[12px]
                          font-semibold
                          uppercase
                          tracking-[1px]
                          text-[#1b1b1b]
                        "
                      >
                        To
                      </p>

                      <p className="mt-1 text-[11px] text-[#999]">
                        Your converted measurement
                      </p>
                    </div>

                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#f7f2e8]
                        text-[#b58b45]
                      "
                    >
                      <span className="text-[11px] font-semibold">
                        02
                      </span>
                    </div>
                  </div>

                  {/* SELECT UNIT */}

                  <label
                    htmlFor="area-to-unit"
                    className="
                      mt-6
                      block
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.7px]
                      text-[#666]
                    "
                  >
                    Select Unit
                  </label>

                  <select
                    id="area-to-unit"
                    value={toUnit}
                    onChange={(event) =>
                      setToUnit(event.target.value)
                    }
                    className="
                      mt-2
                      h-[50px]
                      w-full
                      rounded-xl
                      border
                      border-[#ddd7cc]
                      bg-white
                      px-4
                      text-[13px]
                      text-[#202020]
                      outline-none
                      transition-all
                      duration-200
                      hover:border-[#cfc2aa]
                      focus:border-[#c89d58]
                      focus:ring-4
                      focus:ring-[#c89d58]/10
                    "
                  >
                    {Object.keys(UNITS).map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>

                  {/* CONVERTED VALUE */}

                  <label
                    htmlFor="converted-value"
                    className="
                      mt-5
                      block
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.7px]
                      text-[#666]
                    "
                  >
                    Converted Value
                  </label>

                  <div
                    id="converted-value"
                    aria-live="polite"
                    className="
                      mt-2
                      flex
                      min-h-[58px]
                      items-center
                      rounded-xl
                      border
                      border-[#dfd4c0]
                      bg-gradient-to-r
                      from-[#f5f0e7]
                      to-[#f9f6f0]
                      px-4
                    "
                  >
                    <span
                      className="
                        min-w-0
                        flex-1
                        truncate
                        text-[25px]
                        font-semibold
                        leading-none
                        tracking-[-0.5px]
                        text-[#10251f]
                      "
                    >
                      {conversion.formatted}
                    </span>

                    <span
                      className="
                        ml-3
                        shrink-0
                        rounded-md
                        bg-white
                        px-2.5
                        py-1.5
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.5px]
                        text-[#777]
                        shadow-sm
                      "
                    >
                      {unitShort(toUnit)}
                    </span>
                  </div>
                </div>
              </div>

              {/* =================================================
                  SWAP BUTTON
              ================================================= */}

              <button
                type="button"
                onClick={swapUnits}
                aria-label="Swap conversion units"
                title="Swap units"
                className="
                  absolute
                  left-1/2
                  top-1/2
                  z-10
                  flex
                  h-11
                  w-11
                  -translate-x-1/2
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#d8d0c1]
                  bg-white
                  text-[#17342b]
                  shadow-[0_5px_20px_rgba(0,0,0,0.1)]
                  transition-all
                  duration-300
                  hover:rotate-180
                  hover:border-[#c89d58]
                  hover:text-[#b58b45]
                  hover:shadow-[0_8px_25px_rgba(0,0,0,0.14)]
                "
              >
                <Repeat2 size={17} strokeWidth={1.8} />
              </button>

              {/* =================================================
                  CONVERSION SUMMARY
              ================================================= */}

              {hasValue && (
                <div
                  className="
                    border-t
                    border-[#eee8dc]
                    bg-[#fcfaf6]
                    px-5
                    py-3.5
                    sm:px-7
                    md:px-8
                  "
                >
                  <div className="flex items-center gap-2">
                    <Check
                      size={14}
                      strokeWidth={2}
                      className="shrink-0 text-[#a47b37]"
                    />

                    <p className="text-[11px] text-[#777]">
                      {numberFormatter.format(numericValue)}{" "}
                      {unitShort(fromUnit)}
                      {" = "}
                      <span className="font-semibold text-[#333]">
                        {conversion.formatted}{" "}
                        {unitShort(toUnit)}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  border-t
                  border-[#eee8dc]
                  p-5
                  sm:flex-row
                  sm:p-6
                  md:p-7
                "
              >
                {/* CONVERT */}

                <button
                  type="button"
                  disabled={!hasValue}
                  className="
                    flex
                    h-[50px]
                    flex-1
                    items-center
                    justify-center
                    gap-3
                    rounded-xl
                    bg-[#03261e]
                    text-[13px]
                    font-semibold
                    tracking-[0.2px]
                    text-white
                    transition-all
                    duration-300
                    hover:bg-[#0a3c30]
                    hover:shadow-[0_10px_30px_rgba(3,38,30,0.18)]
                    disabled:cursor-not-allowed
                    disabled:bg-[#d8d4cc]
                    disabled:text-[#8d8981]
                    disabled:shadow-none
                  "
                >
                  Convert Now

                  <ArrowRight
                    size={16}
                    strokeWidth={1.8}
                  />
                </button>

                {/* RESET */}

                <button
                  type="button"
                  onClick={reset}
                  className="
                    flex
                    h-[50px]
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
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

                  <RefreshCcw
                    size={14}
                    strokeWidth={1.8}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDEBAR
          ===================================================== */}

          <aside
            className="
              min-w-0
              rounded-[18px]
              border
              border-[#e7e0d3]
              bg-white
              p-5
              shadow-[0_10px_35px_rgba(0,0,0,0.025)]
              sm:p-6
              lg:mt-[76px]
              lg:p-6
              xl:p-7
            "
          >
            <PopularConversions />
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ===============================================================
   POPULAR CONVERSIONS
================================================================ */

function PopularConversions() {
  return (
    <div className="w-full">
      {/* HEADER */}

      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[#f5efe4]
            text-[#b58b45]
          "
        >
          <span className="font-serif text-[15px]">
            ≈
          </span>
        </div>

        <div className="min-w-0">
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[1.8px]
              text-[#b58b45]
            "
          >
            Quick Reference
          </p>

          <h3
            className="
              mt-1
              text-[18px]
              font-semibold
              leading-tight
              text-[#161616]
            "
          >
            Popular Conversions
          </h3>
        </div>
      </div>

      {/* LIST */}

      <div className="mt-5">
        {POPULAR_CONVERSIONS.map(({ from, to }) => (
          <div
            key={from}
            className="
              border-t
              border-[#eee8dc]
              py-3.5
            "
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] font-medium text-[#333]">
                {from}
              </p>

              <span
                className="
                  shrink-0
                  text-[11px]
                  font-medium
                  text-[#777]
                "
              >
                =
              </span>
            </div>

            <p
              className="
                mt-1
                text-[11px]
                leading-5
                text-[#777]
              "
            >
              {to}
            </p>
          </div>
        ))}
      </div>

      {/* INFORMATION NOTE */}

      <div
        className="
          mt-3
          rounded-xl
          border
          border-[#eadfc9]
          bg-[#faf7f0]
          p-4
        "
      >
        <p
          className="
            text-[11px]
            leading-5
            text-[#777]
          "
        >
          Conversion values are provided for general
          reference. Local land-measurement practices
          may vary by region.
        </p>
      </div>

      {/* VIEW ALL */}

      <button
        type="button"
        className="
          mt-4
          flex
          h-[44px]
          w-full
          items-center
          justify-center
          gap-3
          rounded-xl
          border
          border-[#d9c7a2]
          bg-white
          text-[12px]
          font-medium
          text-[#17342b]
          transition-all
          duration-300
          hover:border-[#03261e]
          hover:bg-[#03261e]
          hover:text-white
        "
      >
        View All Conversions

        <ArrowRight
          size={15}
          strokeWidth={1.8}
        />
      </button>
    </div>
  );
}

/* ===============================================================
   UNIT SHORT NAME
================================================================ */

function unitShort(unit) {
  return UNIT_SHORT_NAMES[unit] || "";
}

