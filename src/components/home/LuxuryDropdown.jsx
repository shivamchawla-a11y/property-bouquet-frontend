"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { Range, getTrackBackground } from "react-range";

export default function LuxuryDropdown({
  icon: Icon,
  label,
  placeholder,
  options = [],
  value,
  onChange,
  budgetSlider = false,
  locationAction = false,
  locationLoading = false,
}) {
  const [open, setOpen] = useState(false);

  const [budgetValues, setBudgetValues] = useState([50, 500]);

  const ref = useRef(null);

  /* ============================================================
     CLOSE WHEN CLICKING OUTSIDE
  ============================================================ */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ============================================================
     FORMAT BUDGET
  ============================================================ */

  const formatBudget = (amount) => {
    if (amount >= 500) {
      return "₹5Cr+";
    }

    if (amount >= 100) {
      return `₹${(amount / 100).toFixed(
        amount % 100 === 0 ? 0 : 1
      )}Cr`;
    }

    return `₹${amount}L`;
  };

  /* ============================================================
     APPLY BUDGET
  ============================================================ */

  const handleApplyBudget = () => {
    const min = budgetValues[0] * 100000;
    const max = budgetValues[1] * 100000;

    onChange({
      value: `${min}-${max}`,
      label: `${formatBudget(budgetValues[0])} - ${formatBudget(
        budgetValues[1]
      )}`,
    });

    setOpen(false);
  };

  /* ============================================================
     SELECT OPTION
  ============================================================ */

  const handleOptionSelect = (item) => {
    onChange(item);
    setOpen(false);
  };

  /* ============================================================
     LOCATION
  ============================================================ */

  const handleLocation = () => {
    onChange("__USE_MY_LOCATION__");
  };

  return (
    <div
      ref={ref}
      className="
        group
        relative
        flex
        h-full
        min-w-0
        items-center
        gap-3
        px-4
        py-3
      "
    >
      {/* ========================================================
          ICON
      ======================================================== */}

      <div className="relative shrink-0">
        <div
          className="
            absolute
            inset-0
            rounded-full
            bg-[#c89d58]/20
            blur-xl
            opacity-0
            transition-all
            duration-500
            group-hover:opacity-100
          "
        />

        <div
          className="
            relative
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-xl
            border
            border-[#c89d58]/30
            bg-[#fbfaf6]
          "
        >
          {Icon && (
            <Icon
              size={16}
              strokeWidth={1.7}
              className="text-[#c18f3f]"
            />
          )}
        </div>
      </div>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <div className="min-w-0 flex-1">
        <p
          className="
            mb-1
            truncate
            text-[8px]
            font-semibold
            uppercase
            tracking-[2.5px]
            text-[#87938e]
          "
        >
          {label}
        </p>

        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((previous) => !previous)}
          className="
            flex
            w-full
            min-w-0
            items-center
            justify-between
            gap-2
            text-left
            outline-none
          "
        >
          <span
            className="
              min-w-0
              truncate
              text-[13px]
              font-medium
              text-[#17342d]
            "
          >
            {value || placeholder}
          </span>

          <motion.span
            className="shrink-0"
            animate={{
              rotate: open ? 180 : 0,
            }}
            transition={{
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <ChevronDown
              size={15}
              strokeWidth={1.8}
              className="text-[#c89d58]"
            />
          </motion.span>
        </button>
      </div>

      {/* ========================================================
          DROPDOWN
      ======================================================== */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.98,
            }}
            transition={{
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            role="listbox"
            className="
              absolute
              left-0
              top-full
              z-[999999]
              mt-3
              w-[300px]
              max-w-[calc(100vw-32px)]
              overflow-hidden
              rounded-[18px]
              border
              border-[#ded8cb]
              bg-white
              shadow-[0_24px_70px_rgba(23,52,45,0.18)]
            "
          >
            {/* ==================================================
                BUDGET DROPDOWN
            ================================================== */}

            {budgetSlider ? (
              <div className="p-5">
                {/* HEADER */}

                <div
                  className="
                    mb-5
                    rounded-[15px]
                    border
                    border-[#e9e3d7]
                    bg-[#faf8f3]
                    p-4
                  "
                >
                  <div className="flex items-start justify-between gap-6">
                    {/* MINIMUM */}

                    <div>
                      <p
                        className="
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[2px]
                          text-[#8d9691]
                        "
                      >
                        Minimum
                      </p>

                      <p
                        className="
                          mt-1
                          text-[15px]
                          font-semibold
                          text-[#17342d]
                        "
                      >
                        {formatBudget(budgetValues[0])}
                      </p>
                    </div>

                    {/* MAXIMUM */}

                    <div className="text-right">
                      <p
                        className="
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[2px]
                          text-[#8d9691]
                        "
                      >
                        Maximum
                      </p>

                      <p
                        className="
                          mt-1
                          text-[15px]
                          font-semibold
                          text-[#b9822e]
                        "
                      >
                        {formatBudget(budgetValues[1])}
                      </p>
                    </div>
                  </div>
                </div>

                {/* RANGE */}

                <div className="px-2 py-4">
                  <Range
                    values={budgetValues}
                    step={10}
                    min={50}
                    max={500}
                    onChange={(values) => {
                      setBudgetValues(values);
                    }}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className="
                          h-[4px]
                          w-full
                          rounded-full
                        "
                        style={{
                          background: getTrackBackground({
                            values: budgetValues,
                            colors: [
                              "#e7e2d9",
                              "#c89d58",
                              "#e7e2d9",
                            ],
                            min: 50,
                            max: 500,
                          }),
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => {
                      const { key, ...restProps } = props;

                      return (
                        <div
                          key={key}
                          {...restProps}
                          className="
                            h-5
                            w-5
                            rounded-full
                            border
                            border-white
                            bg-gradient-to-b
                            from-[#e6c57b]
                            to-[#b9822e]
                            shadow-[0_3px_12px_rgba(200,157,88,0.35)]
                            outline-none
                          "
                        />
                      );
                    }}
                  />
                </div>

                {/* PRESETS */}

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBudgetValues([50, 100]);
                    }}
                    className="
                      h-[36px]
                      rounded-xl
                      border
                      border-[#e5dfd4]
                      bg-[#fbfaf7]
                      text-[11px]
                      font-medium
                      text-[#4b5a54]
                      transition-all
                      duration-200
                      hover:border-[#c89d58]/50
                      hover:bg-[#f8f2e7]
                    "
                  >
                    ₹50L - ₹1Cr
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBudgetValues([100, 200]);
                    }}
                    className="
                      h-[36px]
                      rounded-xl
                      border
                      border-[#e5dfd4]
                      bg-[#fbfaf7]
                      text-[11px]
                      font-medium
                      text-[#4b5a54]
                      transition-all
                      duration-200
                      hover:border-[#c89d58]/50
                      hover:bg-[#f8f2e7]
                    "
                  >
                    ₹1Cr - ₹2Cr
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBudgetValues([200, 500]);
                    }}
                    className="
                      h-[36px]
                      rounded-xl
                      border
                      border-[#e5dfd4]
                      bg-[#fbfaf7]
                      text-[11px]
                      font-medium
                      text-[#4b5a54]
                      transition-all
                      duration-200
                      hover:border-[#c89d58]/50
                      hover:bg-[#f8f2e7]
                    "
                  >
                    ₹2Cr - ₹5Cr+
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBudgetValues([500, 500]);
                    }}
                    className="
                      h-[36px]
                      rounded-xl
                      border
                      border-[#c89d58]/40
                      bg-[#c89d58]/10
                      text-[11px]
                      font-semibold
                      text-[#a87322]
                      transition-all
                      duration-200
                      hover:bg-[#c89d58]/15
                    "
                  >
                    ₹5Cr+
                  </button>
                </div>

                {/* APPLY */}

                <button
                  type="button"
                  onClick={handleApplyBudget}
                  className="
                    mt-5
                    h-[44px]
                    w-full
                    rounded-[14px]
                    bg-[#123d31]
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[2px]
                    text-white
                    shadow-[0_10px_25px_rgba(18,61,49,0.18)]
                    transition-all
                    duration-200
                    hover:bg-[#0d3027]
                    active:scale-[0.99]
                  "
                >
                  Apply Budget
                </button>
              </div>
            ) : (
              <>
                {/* ==================================================
                    USE MY LOCATION
                ================================================== */}

                {locationAction && (
                  <button
                    type="button"
                    onClick={handleLocation}
                    disabled={locationLoading}
                    className="
                      w-full
                      border-b
                      border-[#eee9df]
                      bg-[#faf7ef]
                      px-5
                      py-4
                      text-left
                      transition-all
                      duration-200
                      hover:bg-[#f6f0e4]
                      disabled:cursor-wait
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[#c89d58]/35
                          bg-[#c89d58]/10
                        "
                      >
                        {locationLoading ? (
                          <span
                            className="
                              h-4
                              w-4
                              animate-spin
                              rounded-full
                              border-2
                              border-[#c89d58]/30
                              border-t-[#c89d58]
                            "
                          />
                        ) : (
                          <MapPin
                            size={17}
                            strokeWidth={1.7}
                            className="text-[#b9822e]"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            truncate
                            text-[12px]
                            font-semibold
                            text-[#17342d]
                          "
                        >
                          {locationLoading
                            ? "Detecting your location..."
                            : "Use My Current Location"}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[10px]
                            text-[#8b9691]
                          "
                        >
                          Find properties near you
                        </p>
                      </div>
                    </div>
                  </button>
                )}

                {/* ==================================================
                    OPTIONS
                ================================================== */}

                <div className="max-h-[320px] overflow-y-auto">
                  {options.length > 0 ? (
                    options.map((item) => (
                      <button
                        key={item}
                        type="button"
                        role="option"
                        aria-selected={value === item}
                        onClick={() => handleOptionSelect(item)}
                        className="
                          w-full
                          border-b
                          border-[#f0ece5]
                          px-5
                          py-4
                          text-left
                          text-[13px]
                          font-medium
                          text-[#30453e]
                          transition-all
                          duration-200
                          last:border-none
                          hover:bg-[#faf7f1]
                          hover:text-[#17342d]
                        "
                      >
                        {item}
                      </button>
                    ))
                  ) : (
                    <div
                      className="
                        px-5
                        py-5
                        text-center
                        text-[12px]
                        text-[#929b96]
                      "
                    >
                      No options available
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}