"use client";

import Link from "next/link";
import { useState } from "react";

export default function LuxuryInsightsSection({
  onConsultationClick,
}) {
  /* ============================================================
     ROI STATE
  ============================================================ */

  const [investment, setInvestment] = useState(100000000); // ₹10 Cr
  const [investmentInput, setInvestmentInput] =
    useState("10,00,00,000");

  const [years, setYears] = useState(5);
  const [yearsInput, setYearsInput] = useState("5");

  const [appreciation, setAppreciation] = useState(20);
  const [appreciationInput, setAppreciationInput] =
    useState("20");

  /* ============================================================
     CONSTANTS
  ============================================================ */

  const MIN_INVESTMENT = 1000000; // ₹10 Lakh
  const MAX_INVESTMENT = 500000000; // ₹50 Cr

  const MIN_YEARS = 1;
  const MAX_YEARS = 20;

  const MIN_APPRECIATION = 1;
  const MAX_APPRECIATION = 30;

  /* ============================================================
     ROI CALCULATIONS
  ============================================================ */

  const projectedValue =
    investment *
    Math.pow(
      1 + appreciation / 100,
      years
    );

  const totalReturns =
    projectedValue - investment;

  const roi =
    investment > 0
      ? ((projectedValue - investment) /
          investment) *
        100
      : 0;

  /* ============================================================
     CURRENCY FORMATTER
  ============================================================ */

  const formatCurrency = (value) => {
    if (!Number.isFinite(value) || value <= 0) {
      return "₹ 0";
    }

    if (value >= 10000000) {
      return `₹ ${(value / 10000000).toFixed(2)} Cr`;
    }

    if (value >= 100000) {
      return `₹ ${(value / 100000).toFixed(2)} L`;
    }

    return `₹ ${Math.round(value).toLocaleString(
      "en-IN"
    )}`;
  };

  /* ============================================================
     INDIAN NUMBER FORMAT
  ============================================================ */

  const formatIndianNumber = (value) => {
    if (
      value === "" ||
      value === null ||
      value === undefined
    ) {
      return "";
    }

    const numericValue = Number(
      String(value).replace(/,/g, "")
    );

    if (!Number.isFinite(numericValue)) {
      return "";
    }

    return numericValue.toLocaleString("en-IN");
  };

  /* ============================================================
     INVESTMENT INPUT
  ============================================================ */

  const handleInvestmentInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "");

    if (raw === "") {
      setInvestmentInput("");
      setInvestment(0);
      return;
    }

    const numericValue = Number(raw);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    const limitedValue = Math.min(
      MAX_INVESTMENT,
      numericValue
    );

    setInvestment(limitedValue);

    setInvestmentInput(
      formatIndianNumber(limitedValue)
    );
  };

  const handleInvestmentBlur = () => {
    let value = Number(
      String(investmentInput).replace(/,/g, "")
    );

    if (!Number.isFinite(value) || value < MIN_INVESTMENT) {
      value = MIN_INVESTMENT;
    }

    if (value > MAX_INVESTMENT) {
      value = MAX_INVESTMENT;
    }

    setInvestment(value);

    setInvestmentInput(
      formatIndianNumber(value)
    );
  };

  /* ============================================================
     INVESTMENT SLIDER
  ============================================================ */

  const handleInvestmentSlider = (e) => {
    const value = Number(e.target.value);

    setInvestment(value);

    setInvestmentInput(
      formatIndianNumber(value)
    );
  };

  /* ============================================================
     YEARS INPUT
  ============================================================ */

  const handleYearsInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "");

    if (raw === "") {
      setYearsInput("");
      return;
    }

    const numericValue = Number(raw);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    const limitedValue = Math.min(
      MAX_YEARS,
      numericValue
    );

    setYears(limitedValue);
    setYearsInput(String(limitedValue));
  };

  const handleYearsBlur = () => {
    let value = Number(yearsInput);

    if (!Number.isFinite(value) || value < MIN_YEARS) {
      value = MIN_YEARS;
    }

    if (value > MAX_YEARS) {
      value = MAX_YEARS;
    }

    setYears(value);
    setYearsInput(String(value));
  };

  /* ============================================================
     YEARS SLIDER
  ============================================================ */

  const handleYearsSlider = (e) => {
    const value = Number(e.target.value);

    setYears(value);
    setYearsInput(String(value));
  };

  /* ============================================================
     APPRECIATION INPUT
  ============================================================ */

  const handleAppreciationInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "");

    if (raw === "") {
      setAppreciationInput("");
      return;
    }

    const numericValue = Number(raw);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    const limitedValue = Math.min(
      MAX_APPRECIATION,
      numericValue
    );

    setAppreciation(limitedValue);

    setAppreciationInput(
      String(limitedValue)
    );
  };

  const handleAppreciationBlur = () => {
    let value = Number(appreciationInput);

    if (
      !Number.isFinite(value) ||
      value < MIN_APPRECIATION
    ) {
      value = MIN_APPRECIATION;
    }

    if (value > MAX_APPRECIATION) {
      value = MAX_APPRECIATION;
    }

    setAppreciation(value);
    setAppreciationInput(String(value));
  };

  /* ============================================================
     APPRECIATION SLIDER
  ============================================================ */

  const handleAppreciationSlider = (e) => {
    const value = Number(e.target.value);

    setAppreciation(value);
    setAppreciationInput(String(value));
  };

  /* ============================================================
     SLIDER PERCENTAGE
  ============================================================ */

  const investmentPercentage =
    ((investment - MIN_INVESTMENT) /
      (MAX_INVESTMENT - MIN_INVESTMENT)) *
    100;

  const yearsPercentage =
    ((years - MIN_YEARS) /
      (MAX_YEARS - MIN_YEARS)) *
    100;

  const appreciationPercentage =
    ((appreciation - MIN_APPRECIATION) /
      (MAX_APPRECIATION -
        MIN_APPRECIATION)) *
    100;

  return (
    <section className="w-full px-4 py-5 sm:px-6 md:px-8 xl:px-10">
      <div className="mx-auto w-full max-w-[1440px]">

        {/* ======================================================
            MAIN ROI CONTAINER
        ====================================================== */}

        <div
          className="
            overflow-hidden
            rounded-[22px]
            border
            border-white/10
            shadow-[0_25px_70px_rgba(0,0,0,0.24)]
            sm:rounded-[28px]
            xl:rounded-[34px]
          "
        >
          <div className="grid xl:grid-cols-2">

            {/* ==================================================
                LEFT — CONTROLS
            ================================================== */}

            <div
              className="
                relative
                overflow-hidden
                border-b
                border-white/10
                bg-gradient-to-br
                from-[#021c18]
                via-[#03241e]
                to-[#02110d]
                px-5
                py-6
                sm:px-7
                sm:py-7
                lg:px-9
                lg:py-8
                xl:border-b-0
                xl:border-r
                xl:px-10
                xl:py-9
              "
            >

              {/* TOP GLOW */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -left-[90px]
                  -top-[90px]
                  h-[230px]
                  w-[230px]
                  rounded-full
                  bg-[#d4ae67]/10
                  blur-[110px]
                "
              />

              {/* BOTTOM GLOW */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-[120px]
                  -right-[80px]
                  h-[250px]
                  w-[250px]
                  rounded-full
                  bg-[#d4ae67]/[0.04]
                  blur-[100px]
                "
              />

              <div className="relative z-10">

              

                {/* =================================================
                    CONTROLS
                ================================================= */}

                <div
                  className="
                    mt-7
                    space-y-6
                    sm:mt-8
                    sm:space-y-7
                  "
                >

                  {/* =================================================
                      INVESTMENT AMOUNT
                  ================================================= */}

                  <div>

                    <div
                      className="
                        mb-2.5
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >

                      <label
                        htmlFor="investment"
                        className="
                          text-[11px]
                          text-white/65
                          sm:text-[12px]
                        "
                      >
                        Investment Amount
                      </label>

                      <div
                        className="
                          flex
                          h-[36px]
                          items-center
                          rounded-lg
                          border
                          border-[#d4ae67]/25
                          bg-white/[0.06]
                          px-2.5
                          sm:h-[38px]
                          sm:px-3
                        "
                      >

                        <span
                          className="
                            mr-1
                            text-[11px]
                            text-[#d4ae67]
                          "
                        >
                          ₹
                        </span>

                        <input
                          id="investment"
                          type="text"
                          inputMode="numeric"
                          value={investmentInput}
                          onChange={
                            handleInvestmentInput
                          }
                          onBlur={
                            handleInvestmentBlur
                          }
                          className="
                            w-[105px]
                            bg-transparent
                            text-right
                            text-[11px]
                            font-medium
                            text-white
                            outline-none
                            placeholder:text-white/30
                            sm:w-[125px]
                            sm:text-[12px]
                          "
                          aria-label="Investment amount"
                        />

                      </div>
                    </div>

                    <input
                      type="range"
                      min={MIN_INVESTMENT}
                      max={MAX_INVESTMENT}
                      step={100000}
                      value={investment}
                      onChange={
                        handleInvestmentSlider
                      }
                      className="luxury-slider w-full"
                      style={{
                        background: `linear-gradient(
                          to right,
                          #d4ae67 ${investmentPercentage}%,
                          rgba(255,255,255,0.14) ${investmentPercentage}%
                        )`,
                      }}
                      aria-label="Investment amount slider"
                    />

                    <div
                      className="
                        mt-1.5
                        flex
                        justify-between
                        text-[8px]
                        text-white/30
                        sm:text-[9px]
                      "
                    >
                      <span>₹10 L</span>
                      <span>₹50 Cr</span>
                    </div>

                  </div>

                  {/* =================================================
                      HOLDING PERIOD
                  ================================================= */}

                  <div>

                    <div
                      className="
                        mb-2.5
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >

                      <label
                        htmlFor="years"
                        className="
                          text-[11px]
                          text-white/65
                          sm:text-[12px]
                        "
                      >
                        Holding Period
                      </label>

                      <div
                        className="
                          flex
                          h-[36px]
                          items-center
                          rounded-lg
                          border
                          border-white/10
                          bg-white/[0.06]
                          px-2.5
                          sm:h-[38px]
                          sm:px-3
                        "
                      >

                        <input
                          id="years"
                          type="number"
                          inputMode="numeric"
                          min={MIN_YEARS}
                          max={MAX_YEARS}
                          value={yearsInput}
                          onChange={handleYearsInput}
                          onBlur={handleYearsBlur}
                          className="
                            w-[38px]
                            bg-transparent
                            text-right
                            text-[11px]
                            font-medium
                            text-white
                            outline-none
                            sm:text-[12px]
                          "
                          aria-label="Holding period"
                        />

                        <span
                          className="
                            ml-1
                            text-[10px]
                            text-white/50
                          "
                        >
                          Years
                        </span>

                      </div>

                    </div>

                    <input
                      type="range"
                      min={MIN_YEARS}
                      max={MAX_YEARS}
                      step="1"
                      value={years}
                      onChange={
                        handleYearsSlider
                      }
                      className="luxury-slider w-full"
                      style={{
                        background: `linear-gradient(
                          to right,
                          #d4ae67 ${yearsPercentage}%,
                          rgba(255,255,255,0.14) ${yearsPercentage}%
                        )`,
                      }}
                      aria-label="Holding period slider"
                    />

                    <div
                      className="
                        mt-1.5
                        flex
                        justify-between
                        text-[8px]
                        text-white/30
                        sm:text-[9px]
                      "
                    >
                      <span>1 Year</span>
                      <span>20 Years</span>
                    </div>

                  </div>

                  {/* =================================================
                      APPRECIATION
                  ================================================= */}

                  <div>

                    <div
                      className="
                        mb-2.5
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >

                      <label
                        htmlFor="appreciation"
                        className="
                          text-[11px]
                          text-white/65
                          sm:text-[12px]
                        "
                      >
                        Expected Appreciation
                      </label>

                      <div
                        className="
                          flex
                          h-[36px]
                          items-center
                          rounded-lg
                          border
                          border-white/10
                          bg-white/[0.06]
                          px-2.5
                          sm:h-[38px]
                          sm:px-3
                        "
                      >

                        <input
                          id="appreciation"
                          type="number"
                          inputMode="numeric"
                          min={MIN_APPRECIATION}
                          max={MAX_APPRECIATION}
                          value={
                            appreciationInput
                          }
                          onChange={
                            handleAppreciationInput
                          }
                          onBlur={
                            handleAppreciationBlur
                          }
                          className="
                            w-[38px]
                            bg-transparent
                            text-right
                            text-[11px]
                            font-medium
                            text-white
                            outline-none
                            sm:text-[12px]
                          "
                          aria-label="Expected appreciation"
                        />

                        <span
                          className="
                            ml-1
                            text-[11px]
                            text-[#d4ae67]
                          "
                        >
                          %
                        </span>

                      </div>

                    </div>

                    <input
                      type="range"
                      min={MIN_APPRECIATION}
                      max={MAX_APPRECIATION}
                      step="1"
                      value={appreciation}
                      onChange={
                        handleAppreciationSlider
                      }
                      className="luxury-slider w-full"
                      style={{
                        background: `linear-gradient(
                          to right,
                          #d4ae67 ${appreciationPercentage}%,
                          rgba(255,255,255,0.14) ${appreciationPercentage}%
                        )`,
                      }}
                      aria-label="Expected appreciation slider"
                    />

                    <div
                      className="
                        mt-1.5
                        flex
                        justify-between
                        text-[8px]
                        text-white/30
                        sm:text-[9px]
                      "
                    >
                      <span>1%</span>
                      <span>30%</span>
                    </div>

                  </div>

                </div>

                {/* NOTE */}

                <div
                  className="
                    mt-5
                    border-t
                    border-white/[0.08]
                    pt-3
                    text-[8px]
                    leading-4
                    text-white/30
                    sm:mt-6
                    sm:pt-4
                    sm:text-[9px]
                  "
                >
                  Adjust the values above to model
                  different investment scenarios.
                </div>

              </div>
            </div>

            {/* ==================================================
                RIGHT — RESULTS
            ================================================== */}

            <div
              className="
                relative
                flex
                items-center
                justify-center
                overflow-hidden
                bg-gradient-to-br
                from-[#032821]
                via-[#021d18]
                to-[#02110d]
                px-5
                py-7
                sm:px-7
                sm:py-8
                xl:px-8
                xl:py-9
              "
            >

              {/* GLOW */}

              <div
                className="
                  pointer-events-none
                  absolute
                  h-[280px]
                  w-[280px]
                  rounded-full
                  bg-[#d4ae67]/10
                  blur-[120px]
                  sm:h-[330px]
                  sm:w-[330px]
                "
              />

              {/* RESULTS CARD */}

              <div
                className="
                  relative
                  z-10
                  w-full
                  max-w-[390px]
                  rounded-[20px]
                  border
                  border-[#d4ae67]/15
                  bg-white/[0.04]
                  px-5
                  py-6
                  shadow-[0_20px_60px_rgba(0,0,0,0.40)]
                  backdrop-blur-3xl
                  sm:rounded-[24px]
                  sm:px-7
                  sm:py-8
                  lg:px-8
                  lg:py-9
                "
              >

                {/* =================================================
                    PROJECTED VALUE
                ================================================= */}

                <div className="text-center">

                  <p
                    className="
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[1.7px]
                      text-white/35
                      sm:text-[9px]
                    "
                  >
                    Projected Value ({years}Y)
                  </p>

                  <div
                    className="
                      mt-4
                      break-words
                      text-[34px]
                      font-semibold
                      leading-none
                      text-[#d4ae67]
                      sm:text-[40px]
                      lg:text-[44px]
                    "
                  >
                    {formatCurrency(
                      projectedValue
                    )}
                  </div>

                  <p
                    className="
                      mt-2
                      text-[9px]
                      text-white/30
                    "
                  >
                    Based on {appreciation}%
                    annual appreciation
                  </p>

                </div>

                {/* DIVIDER */}

                <div
                  className="
                    my-5
                    h-px
                    bg-white/[0.08]
                    sm:my-7
                  "
                />

                {/* =================================================
                    RESULTS
                ================================================= */}

                <div className="space-y-5">

                  {/* TOTAL RETURNS */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >

                    <div>

                      <p
                        className="
                          text-[10px]
                          text-white/40
                          sm:text-[11px]
                        "
                      >
                        Total Returns
                      </p>

                      <p
                        className="
                          mt-1
                          text-[8px]
                          text-white/25
                        "
                      >
                        Estimated capital gain
                      </p>

                    </div>

                    <span
                      className="
                        max-w-[58%]
                        break-words
                        text-right
                        text-[20px]
                        font-semibold
                        text-white
                        sm:text-[23px]
                      "
                    >
                      {formatCurrency(
                        totalReturns
                      )}
                    </span>

                  </div>

                  {/* ROI */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >

                    <div>

                      <p
                        className="
                          text-[10px]
                          text-white/40
                          sm:text-[11px]
                        "
                      >
                        ROI
                      </p>

                      <p
                        className="
                          mt-1
                          text-[8px]
                          text-white/25
                        "
                      >
                        Total return on investment
                      </p>

                    </div>

                    <span
                      className="
                        text-right
                        text-[24px]
                        font-semibold
                        text-[#d4ae67]
                        sm:text-[28px]
                      "
                    >
                      {roi.toFixed(1)}%
                    </span>

                  </div>

                </div>

                {/* =================================================
                    FULL REPORT BUTTON
                ================================================= */}

                <Link
                  href="/tools/roi-calculator"
                  className="
                    mt-6
                    flex
                    h-[48px]
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-gradient-to-b
                    from-[#e0bd74]
                    to-[#b88731]
                    text-[11px]
                    font-semibold
                    tracking-[0.02em]
                    text-black
                    shadow-[0_10px_30px_rgba(212,174,103,0.22)]
                    transition-all
                    duration-300
                    hover:scale-[1.01]
                    hover:brightness-110
                    active:scale-[0.99]
                    sm:mt-7
                    sm:h-[51px]
                    sm:text-[12px]
                  "
                >
                  DOWNLOAD FULL REPORT
                </Link>

                {/* DISCLAIMER */}

                <p
                  className="
                    mt-3
                    text-center
                    text-[8px]
                    leading-4
                    text-white/25
                  "
                >
                  *Indicative returns for reference
                  only. Actual returns may vary.
                </p>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}