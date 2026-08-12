"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Download,
  Leaf,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import InvestmentForm from "./InvestmentForm";

/* =========================================================
   INITIAL FORM
========================================================= */

const INITIAL_FORM = {
  investment: {
    propertyType: "Residential",
    location: "Gurgaon",
    propertyValue: "25000000",
    carpetArea: "1500",
    purchaseDate: "2024-05",
    holdingPeriod: "5",
  },

  breakdown: {
    downPayment: "7500000",
    downPaymentPercent: "30",
    interestRate: "8.50",
    loanAmount: "17500000",
    loanPercent: "70",
    loanTenure: "20",
  },

  rental: {
    monthlyRent: "50000",
    rentEscalation: "5",
  },

  expenses: {
    maintenance: "30000",
    propertyTax: "20000",
    insurance: "10000",
    other: "15000",
  },
};

/* =========================================================
   HELPERS
========================================================= */

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(toNumber(value));
};

const formatCrOrLakh = (value) => {
  const number = toNumber(value);

  if (number >= 10000000) {
    return `₹ ${(number / 10000000).toFixed(1)} Cr`;
  }

  if (number >= 100000) {
    return `₹ ${(number / 100000).toFixed(0)} L`;
  }

  return `₹ ${formatINR(number)}`;
};

const formatPercent = (value) => {
  return `${toNumber(value).toFixed(2)}%`;
};

/* =========================================================
   IRR CALCULATOR
========================================================= */

/*
 * Calculates annual IRR using Newton-Raphson first,
 * followed by a binary-search fallback.
 *
 * Cash-flow example:
 *
 * Year 0  = -Initial Equity
 * Year 1  = Net Cash Flow
 * Year 2  = Net Cash Flow
 * ...
 * Final Year = Net Cash Flow + Net Sale Proceeds
 */
function calculateIRR(cashFlows) {
  if (!Array.isArray(cashFlows) || cashFlows.length < 2) {
    return 0;
  }

  const hasPositive = cashFlows.some(
    (value) => value > 0
  );

  const hasNegative = cashFlows.some(
    (value) => value < 0
  );

  if (!hasPositive || !hasNegative) {
    return 0;
  }

  let rate = 0.1;

  for (let iteration = 0; iteration < 100; iteration++) {
    let npv = 0;
    let derivative = 0;

    for (let t = 0; t < cashFlows.length; t++) {
      const denominator = Math.pow(
        1 + rate,
        t
      );

      npv += cashFlows[t] / denominator;

      if (t > 0) {
        derivative -=
          (t * cashFlows[t]) /
          Math.pow(1 + rate, t + 1);
      }
    }

    if (
      Math.abs(npv) < 0.01 ||
      Math.abs(derivative) < 0.00000001
    ) {
      return rate * 100;
    }

    const nextRate =
      rate - npv / derivative;

    if (
      !Number.isFinite(nextRate) ||
      nextRate <= -0.9999 ||
      nextRate > 100
    ) {
      break;
    }

    if (
      Math.abs(nextRate - rate) <
      0.000000001
    ) {
      return nextRate * 100;
    }

    rate = nextRate;
  }

  /* -------------------------------------------------------
     BINARY SEARCH FALLBACK
  ------------------------------------------------------- */

  let low = -0.99;
  let high = 10;

  const npvAt = (candidateRate) => {
    return cashFlows.reduce(
      (sum, cashFlow, index) =>
        sum +
        cashFlow /
          Math.pow(
            1 + candidateRate,
            index
          ),
      0
    );
  };

  const lowNPV = npvAt(low);
  const highNPV = npvAt(high);

  if (
    !Number.isFinite(lowNPV) ||
    !Number.isFinite(highNPV) ||
    lowNPV * highNPV > 0
  ) {
    return 0;
  }

  for (let iteration = 0; iteration < 150; iteration++) {
    const middle = (low + high) / 2;
    const middleNPV = npvAt(middle);

    if (Math.abs(middleNPV) < 0.01) {
      return middle * 100;
    }

    if (lowNPV * middleNPV <= 0) {
      high = middle;
    } else {
      low = middle;
    }
  }

  return ((low + high) / 2) * 100;
}

/* =========================================================
   CALCULATION ENGINE
========================================================= */

function calculateROI(formData) {
  const propertyValue = Math.max(
    0,
    toNumber(
      formData?.investment?.propertyValue
    )
  );

  const holdingPeriod = Math.max(
    1,
    Math.round(
      toNumber(
        formData?.investment?.holdingPeriod
      ) || 5
    )
  );

  const monthlyRent = Math.max(
    0,
    toNumber(
      formData?.rental?.monthlyRent
    )
  );

  const rentEscalation =
    Math.max(
      0,
      toNumber(
        formData?.rental?.rentEscalation
      )
    ) / 100;

  const maintenance = Math.max(
    0,
    toNumber(
      formData?.expenses?.maintenance
    )
  );

  const propertyTax = Math.max(
    0,
    toNumber(
      formData?.expenses?.propertyTax
    )
  );

  const insurance = Math.max(
    0,
    toNumber(
      formData?.expenses?.insurance
    )
  );

  const otherExpenses = Math.max(
    0,
    toNumber(
      formData?.expenses?.other
    )
  );

  const downPayment = Math.min(
    propertyValue,
    Math.max(
      0,
      toNumber(
        formData?.breakdown?.downPayment
      )
    )
  );

  const loanAmount = Math.min(
    propertyValue,
    Math.max(
      0,
      toNumber(
        formData?.breakdown?.loanAmount
      )
    )
  );

  const interestRate =
    Math.max(
      0,
      toNumber(
        formData?.breakdown?.interestRate
      )
    ) / 100;

  const loanTenure = Math.max(
    1,
    toNumber(
      formData?.breakdown?.loanTenure
    ) || 20
  );

  /* -------------------------------------------------------
     ASSUMED PROPERTY APPRECIATION
  ------------------------------------------------------- */

  /*
   * This is an assumption used by the calculator.
   *
   * It is NOT being presented as a guaranteed return.
   */
  const annualAppreciation = 0.1225;

  /* -------------------------------------------------------
     ANNUAL OPERATING EXPENSE
  ------------------------------------------------------- */

  const annualExpense =
    maintenance +
    propertyTax +
    insurance +
    otherExpenses;

  /* -------------------------------------------------------
     LOAN EMI
  ------------------------------------------------------- */

  const monthlyRate =
    interestRate / 12;

  const totalMonths =
    loanTenure * 12;

  let monthlyEMI = 0;

  if (
    loanAmount > 0 &&
    monthlyRate > 0
  ) {
    monthlyEMI =
      (loanAmount *
        monthlyRate *
        Math.pow(
          1 + monthlyRate,
          totalMonths
        )) /
      (Math.pow(
        1 + monthlyRate,
        totalMonths
      ) - 1);
  } else if (loanAmount > 0) {
    monthlyEMI =
      loanAmount / totalMonths;
  }

  const annualEMI =
    monthlyEMI * 12;

  /* -------------------------------------------------------
     YEAR-BY-YEAR MODEL
  ------------------------------------------------------- */

  const yearly = [];

  let currentLoanBalance =
    loanAmount;

  let currentMonthlyRent =
    monthlyRent;

  let cumulativeCashFlow = 0;

  let cumulativeInterest = 0;

  let cumulativePrincipal = 0;

  let cumulativeRentalIncome = 0;

  let cumulativeAppreciation = 0;

  for (
    let year = 1;
    year <= holdingPeriod;
    year++
  ) {
    /* ---------------------------------------------
       LOAN AMORTIZATION FOR THIS YEAR
    --------------------------------------------- */

    let annualInterest = 0;
    let annualPrincipal = 0;

    for (
      let month = 0;
      month < 12;
      month++
    ) {
      if (currentLoanBalance <= 0) {
        break;
      }

      let interestForMonth = 0;
      let principalForMonth = 0;

      if (monthlyRate > 0) {
        interestForMonth =
          currentLoanBalance *
          monthlyRate;

        principalForMonth =
          Math.min(
            currentLoanBalance,
            Math.max(
              0,
              monthlyEMI -
                interestForMonth
            )
          );
      } else {
        principalForMonth =
          Math.min(
            currentLoanBalance,
            monthlyEMI
          );
      }

      currentLoanBalance =
        Math.max(
          0,
          currentLoanBalance -
            principalForMonth
        );

      annualInterest +=
        interestForMonth;

      annualPrincipal +=
        principalForMonth;
    }

    /* ---------------------------------------------
       RENTAL INCOME
    --------------------------------------------- */

    const annualRent =
      currentMonthlyRent * 12;

    const netRentalIncome =
      annualRent -
      annualExpense;

    /*
     * Actual cash left after:
     *
     * Rent
     * - Operating expenses
     * - Full EMI
     */
    const rentalCashFlow =
      netRentalIncome -
      annualEMI;

    cumulativeCashFlow +=
      rentalCashFlow;

    cumulativeInterest +=
      annualInterest;

    cumulativePrincipal +=
      annualPrincipal;

    cumulativeRentalIncome +=
      netRentalIncome;

    /* ---------------------------------------------
       PROPERTY VALUE
    --------------------------------------------- */

    const propertyValueAtStart =
      propertyValue *
      Math.pow(
        1 + annualAppreciation,
        year - 1
      );

    const currentPropertyValue =
      propertyValue *
      Math.pow(
        1 + annualAppreciation,
        year
      );

    const appreciation =
      currentPropertyValue -
      propertyValueAtStart;

    cumulativeAppreciation =
      currentPropertyValue -
      propertyValue;

    /* ---------------------------------------------
       EQUITY
    --------------------------------------------- */

    const investorEquity =
      currentPropertyValue -
      currentLoanBalance;

    /*
     * This represents the investor's economic
     * position if the property were sold at the
     * end of this year, before selling costs/taxes.
     */
    const netSaleProceeds =
      investorEquity;

    /*
     * Total wealth position relative to the
     * original equity contribution.
     */
    const wealthGain =
      netSaleProceeds +
      cumulativeCashFlow -
      downPayment;

    yearly.push({
      year,

      propertyValue:
        currentPropertyValue,

      propertyValueAtStart,

      appreciation,

      cumulativeAppreciation,

      annualRent,

      netRentalIncome,

      rentalCashFlow,

      cumulativeRentalIncome,

      annualEMI,

      annualInterest,

      annualPrincipal,

      cumulativeInterest,

      cumulativePrincipal,

      remainingLoanBalance:
        currentLoanBalance,

      investorEquity,

      netSaleProceeds,

      cumulativeCashFlow,

      wealthGain,
    });

    /* ---------------------------------------------
       RENT ESCALATION
    --------------------------------------------- */

    currentMonthlyRent =
      currentMonthlyRent *
      (1 + rentEscalation);
  }

  /* =======================================================
     FINAL YEAR
  ======================================================= */

  const finalYear =
    yearly[yearly.length - 1] || {
      propertyValue,
      annualRent: 0,
      netRentalIncome: 0,
      rentalCashFlow: 0,
      appreciation: 0,
      cumulativeAppreciation: 0,
      annualInterest: 0,
      annualPrincipal: 0,
      cumulativeInterest: 0,
      cumulativePrincipal: 0,
      remainingLoanBalance:
        loanAmount,
      investorEquity:
        propertyValue -
        loanAmount,
      netSaleProceeds:
        propertyValue -
        loanAmount,
      cumulativeCashFlow: 0,
      wealthGain:
        -downPayment,
    };

  /* =======================================================
     TOTALS
  ======================================================= */

  const totalRentalIncome =
    yearly.reduce(
      (sum, item) =>
        sum + item.netRentalIncome,
      0
    );

  const totalInterestPaid =
    yearly.reduce(
      (sum, item) =>
        sum + item.annualInterest,
      0
    );

  const totalPrincipalRepaid =
    yearly.reduce(
      (sum, item) =>
        sum + item.annualPrincipal,
      0
    );

  const totalAppreciation =
    finalYear.propertyValue -
    propertyValue;

  /*
   * Gross investment returns before financing
   * cost.
   */
  const grossReturns =
    totalRentalIncome +
    totalAppreciation;

  /*
   * Actual investor profit after accounting for
   * loan interest.
   *
   * Principal repayment is NOT treated as an
   * expense here because it increases the
   * investor's equity.
   */
  const totalProfit =
    grossReturns -
    totalInterestPaid;

  /*
   * Initial investor cash invested.
   */
  const initialInvestment =
    downPayment;

  /*
   * Leveraged total ROI.
   */
  const roi =
    initialInvestment > 0
      ? (totalProfit /
          initialInvestment) *
        100
      : 0;

  /* =======================================================
     CASH FLOW IRR
  ======================================================= */

  const investorCashFlows = [
    -initialInvestment,
  ];

  yearly.forEach(
    (item, index) => {
      let cashFlow =
        item.rentalCashFlow;

      /*
       * At the end of the holding period we
       * assume the property is sold.
       *
       * Selling costs, capital-gains tax and
       * brokerage are intentionally excluded
       * because they are not part of the form.
       */
      if (
        index ===
        yearly.length - 1
      ) {
        cashFlow +=
          item.netSaleProceeds;
      }

      investorCashFlows.push(
        cashFlow
      );
    }
  );

  const annualizedROI =
    calculateIRR(
      investorCashFlows
    );

  /* =======================================================
     CASH ON CASH
  ======================================================= */

  const cashOnCashReturn =
    initialInvestment > 0
      ? (finalYear.rentalCashFlow /
          initialInvestment) *
        100
      : 0;

  /* =======================================================
     AVERAGE ANNUAL ROI
  ======================================================= */

  const averageAnnualROI =
    holdingPeriod > 0
      ? roi / holdingPeriod
      : 0;

  /* =======================================================
     BREAK-EVEN
  ======================================================= */

  /*
   * Equity break-even:
   *
   * Property equity
   * + cumulative rental cash flow
   * - initial equity
   *
   * This is much more meaningful than:
   *
   * propertyValue / rentalIncome
   */
  const breakEvenYear =
    yearly.find(
      (item) =>
        item.wealthGain >= 0
    )?.year || null;

  /* =======================================================
     FINAL EQUITY
  ======================================================= */

  const finalEquity =
    finalYear.investorEquity;

  const totalWealth =
    finalEquity +
    finalYear.cumulativeCashFlow;

  return {
    propertyValue,

    holdingPeriod,

    downPayment,

    loanAmount,

    monthlyEMI,

    annualEMI,

    totalRentalIncome,

    totalAppreciation,

    grossReturns,

    totalProfit,

    roi,

    averageAnnualROI,

    cashOnCashReturn,

    annualizedROI,

    breakEvenYear,

    totalInterestPaid,

    totalPrincipalRepaid,

    remainingLoanBalance:
      finalYear.remainingLoanBalance,

    finalEquity,

    totalWealth,

    yearly,
  };
}

/* =========================================================
   RETURNS CHART
========================================================= */

function ReturnsChart({
  data,
  years,
}) {
  const chartWidth = 760;
  const chartHeight = 245;

  const points = data.yearly;

  const maxValue = Math.max(
    data.propertyValue,

    ...points.map(
      (item) =>
        item.propertyValue
    ),

    ...points.map(
      (item) =>
        item.cumulativeAppreciation
    ),

    ...points.map(
      (item) =>
        item.cumulativeRentalIncome
    ),

    1
  );

  const chartMax =
    Math.ceil(
      maxValue / 5000000
    ) * 5000000;

  const getX = (index) => {
    if (points.length === 1) {
      return 70;
    }

    return (
      70 +
      (index /
        (points.length - 1)) *
        (chartWidth - 100)
    );
  };

  const getY = (value) => {
    return (
      chartHeight -
      25 -
      (value / chartMax) *
        (chartHeight - 55)
    );
  };

  const createPath = (key) => {
    return points
      .map((point, index) => {
        const x =
          getX(index);

        const y =
          getY(
            point[key]
          );

        return `${
          index === 0
            ? "M"
            : "L"
        } ${x} ${y}`;
      })
      .join(" ");
  };

  return (
    <div className="mt-5">
      {/* HEADER */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-[17px] text-[#10251f]">
            Returns Over Time
          </h3>

          <p className="mt-1 text-[9px] text-[#888]">
            Estimated property value,
            appreciation and cumulative
            rental income.
          </p>
        </div>

        <div
          className="
            hidden
            h-[34px]
            items-center
            rounded-lg
            border
            border-[#ddd8ce]
            bg-[#faf9f6]
            px-3
            text-[10px]
            text-[#555]
            sm:flex
          "
        >
          {years} Years
        </div>
      </div>

      {/* LEGEND */}

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Legend
          className="bg-[#777]"
          label="Property Value"
        />

        <Legend
          className="bg-[#176b51]"
          label="Rental Income"
        />

        <Legend
          className="bg-[#d5a449]"
          label="Appreciation"
        />
      </div>

      {/* CHART */}

      <div className="mt-2 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-[220px] w-full"
          preserveAspectRatio="none"
        >
          {/* GRID */}

          {[0, 1, 2, 3, 4].map(
            (index) => {
              const y =
                25 +
                (index / 4) *
                  (chartHeight -
                    55);

              return (
                <line
                  key={index}
                  x1="65"
                  x2={
                    chartWidth - 30
                  }
                  y1={y}
                  y2={y}
                  stroke="#ebe6dc"
                  strokeWidth="1"
                />
              );
            }
          )}

          {/* Y LABELS */}

          {[1, 0.75, 0.5, 0.25, 0].map(
            (value, index) => (
              <text
                key={index}
                x="3"
                y={
                  30 +
                  index * 53
                }
                fontSize="9"
                fill="#888"
              >
                {formatCrOrLakh(
                  chartMax * value
                )}
              </text>
            )
          )}

          {/* APPRECIATION AREA */}

          <path
            d={`
              ${createPath(
                "cumulativeAppreciation"
              )}
              L ${getX(
                points.length - 1
              )}
                ${
                  chartHeight - 25
                }
              L ${getX(0)}
                ${
                  chartHeight - 25
                }
              Z
            `}
            fill="rgba(213,164,73,0.16)"
          />

          {/* PROPERTY VALUE */}

          <path
            d={createPath(
              "propertyValue"
            )}
            fill="none"
            stroke="#777"
            strokeWidth="2"
          />

          {/* RENT */}

          <path
            d={createPath(
              "cumulativeRentalIncome"
            )}
            fill="none"
            stroke="#176b51"
            strokeWidth="2.5"
          />

          {/* APPRECIATION */}

          <path
            d={createPath(
              "cumulativeAppreciation"
            )}
            fill="none"
            stroke="#d5a449"
            strokeWidth="2.5"
          />

          {/* POINTS */}

          {points.map(
            (point) => {
              const x =
                getX(
                  point.year - 1
                );

              return (
                <g
                  key={
                    point.year
                  }
                >
                  <circle
                    cx={x}
                    cy={getY(
                      point.propertyValue
                    )}
                    r="3"
                    fill="#777"
                  />

                  <circle
                    cx={x}
                    cy={getY(
                      point.cumulativeRentalIncome
                    )}
                    r="3"
                    fill="#176b51"
                  />

                  <circle
                    cx={x}
                    cy={getY(
                      point.cumulativeAppreciation
                    )}
                    r="3"
                    fill="#d5a449"
                  />

                  <text
                    x={x}
                    y={
                      chartHeight - 5
                    }
                    textAnchor="middle"
                    fontSize="9"
                    fill="#666"
                  >
                    Year{" "}
                    {
                      point.year
                    }
                  </text>
                </g>
              );
            }
          )}
        </svg>
      </div>
    </div>
  );
}

function Legend({
  className,
  label,
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-[7px] w-[14px] rounded-full ${className}`}
      />

      <span className="text-[9px] text-[#777]">
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   ROI SUMMARY
========================================================= */

function ROISummary({
  data,
}) {
  return (
    <div className="mt-3 overflow-hidden rounded-[9px] bg-[#002b20]">
      <div className="grid grid-cols-1 sm:grid-cols-3">
        <SummaryItem
          label="Initial Equity"
          value={`₹ ${formatINR(
            data.downPayment
          )}`}
        />

        <SummaryItem
          label={`Net Profit (${data.holdingPeriod} Yrs)`}
          value={`₹ ${formatINR(
            data.totalProfit
          )}`}
        />

        <SummaryItem
          label={`Equity ROI (${data.holdingPeriod} Yrs)`}
          value={formatPercent(
            data.roi
          )}
          highlight
        />

        <SummaryItem
          label="Annualized ROI (IRR)"
          value={formatPercent(
            data.annualizedROI
          )}
        />

        <SummaryItem
          label="Net Rental Income"
          value={`₹ ${formatINR(
            data.totalRentalIncome
          )}`}
        />

        <SummaryItem
          label="Property Appreciation"
          value={`₹ ${formatINR(
            data.totalAppreciation
          )}`}
        />

        <SummaryItem
          label="Cash on Cash Return"
          value={formatPercent(
            data.cashOnCashReturn
          )}
        />

        <SummaryItem
          label="Interest Paid"
          value={`₹ ${formatINR(
            data.totalInterestPaid
          )}`}
        />

        <SummaryItem
          label="Equity Break Even"
          value={
            data.breakEvenYear
              ? `Year ${data.breakEvenYear}`
              : "Not reached"
          }
          noBorder
        />
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  highlight = false,
  noBorder = false,
}) {
  return (
    <div
      className={`
        min-h-[78px]
        px-5
        py-4
        ${
          !noBorder
            ? "border-b border-white/10"
            : ""
        }
        sm:border-r
        sm:border-white/10
        ${
          noBorder
            ? "sm:border-r-0"
            : ""
        }
      `}
    >
      <p className="text-[9px] text-white/65">
        {label}
      </p>

      <p
        className={`
          mt-2
          font-serif
          text-[19px]
          leading-none
          ${
            highlight
              ? "text-[#bde68e]"
              : "text-white"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   ANNUAL CASH FLOW
========================================================= */

function AnnualCashFlow({
  data,
}) {
  return (
    <div
      className="
        rounded-[9px]
        border
        border-[#e9e2d7]
        bg-white
        p-4
      "
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-[16px] text-[#10251f]">
          Annual Cash Flow
        </h3>

        <WalletCards
          size={16}
          strokeWidth={1.5}
          className="text-[#b88b36]"
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[430px] border-collapse">
          <thead>
            <tr className="border-b border-[#eee8de]">
              <th className="pb-2 text-left text-[8px] font-medium text-[#777]">
                Year
              </th>

              <th className="pb-2 text-right text-[8px] font-medium text-[#777]">
                Net Cash Flow
              </th>

              <th className="pb-2 text-right text-[8px] font-medium text-[#777]">
                Principal
              </th>

              <th className="pb-2 text-right text-[8px] font-medium text-[#777]">
                Cumulative
              </th>
            </tr>
          </thead>

          <tbody>
            {data.yearly
              .slice(0, 5)
              .map((row) => (
                <tr
                  key={row.year}
                  className="border-b border-[#f1ede6] last:border-0"
                >
                  <td className="py-[7px] text-left text-[9px] text-[#444]">
                    Year{" "}
                    {row.year}
                  </td>

                  <td
                    className={`
                      py-[7px]
                      text-right
                      text-[9px]
                      ${
                        row.rentalCashFlow >=
                        0
                          ? "text-[#176b51]"
                          : "text-[#a54d45]"
                      }
                    `}
                  >
                    ₹{" "}
                    {formatINR(
                      row.rentalCashFlow
                    )}
                  </td>

                  <td className="py-[7px] text-right text-[9px] text-[#333]">
                    ₹{" "}
                    {formatINR(
                      row.annualPrincipal
                    )}
                  </td>

                  <td className="py-[7px] text-right text-[9px] text-[#333]">
                    ₹{" "}
                    {formatINR(
                      row.cumulativeCashFlow
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {data.yearly.length > 5 && (
        <button
          type="button"
          className="
            mx-auto
            mt-3
            flex
            h-[32px]
            items-center
            gap-2
            rounded-md
            border
            border-[#d7d1c7]
            px-4
            text-[9px]
            text-[#333]
            transition
            hover:border-[#c9a64b]
            hover:text-[#17382e]
          "
        >
          View Full Cash Flow
          <ArrowRight size={11} />
        </button>
      )}
    </div>
  );
}

/* =========================================================
   ROI PERFORMANCE
========================================================= */

function ROIPerformance({
  data,
}) {
  const total =
    data.totalRentalIncome +
    data.totalAppreciation;

  const rentalPercent =
    total > 0
      ? (data.totalRentalIncome /
          total) *
        100
      : 0;

  const appreciationPercent =
    total > 0
      ? (data.totalAppreciation /
          total) *
        100
      : 0;

  const rentalDegrees =
    rentalPercent * 3.6;

  return (
    <div
      className="
        rounded-[9px]
        border
        border-[#e9e2d7]
        bg-white
        p-4
      "
    >
      <h3 className="font-serif text-[16px] text-[#10251f]">
        ROI Performance
      </h3>

      <div className="mt-3 flex items-center gap-5">
        {/* DONUT */}

        <div className="relative flex h-[145px] w-[145px] shrink-0 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                #176b51 0deg ${rentalDegrees}deg,
                #d5a449 ${rentalDegrees}deg 360deg
              )`,
            }}
          />

          <div className="absolute inset-[22px] rounded-full bg-white" />

          <div className="relative z-10 text-center">
            <p className="text-[8px] text-[#666]">
              Gross Returns
            </p>

            <p className="mt-1 font-serif text-[14px] text-[#10251f]">
              ₹{" "}
              {formatINR(
                data.grossReturns
              )}
            </p>

            <p className="text-[8px] text-[#777]">
              ({data.holdingPeriod} Years)
            </p>
          </div>
        </div>

        {/* LEGEND */}

        <div className="flex-1 space-y-4">
          <PerformanceItem
            dot="#176b51"
            title="Net Rental Income"
            percent={`${rentalPercent.toFixed(
              1
            )}%`}
            amount={`₹ ${formatINR(
              data.totalRentalIncome
            )}`}
          />

          <PerformanceItem
            dot="#d5a449"
            title="Property Appreciation"
            percent={`${appreciationPercent.toFixed(
              1
            )}%`}
            amount={`₹ ${formatINR(
              data.totalAppreciation
            )}`}
          />

          <div>
            <p className="text-[8px] leading-4 text-[#888]">
              Financing cost is deducted
              separately when calculating
              your final investor profit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PerformanceItem({
  dot,
  title,
  percent,
  amount,
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="h-[7px] w-[7px] rounded-full"
            style={{
              backgroundColor:
                dot,
            }}
          />

          <span className="text-[9px] text-[#555]">
            {title}
          </span>
        </div>

        <span className="text-[9px] font-medium text-[#333]">
          {percent}
        </span>
      </div>

      <p className="mt-1 pl-4 text-[9px] text-[#555]">
        {amount}
      </p>
    </div>
  );
}

/* =========================================================
   KEY INSIGHTS
========================================================= */

function KeyInsights({ data }) {
  const appreciationRate = 12.25;

  const appreciationContribution =
    data.grossReturns > 0
      ? (data.totalAppreciation / data.grossReturns) * 100
      : 0;

  const firstYearCashFlow =
    data.yearly?.[0]?.rentalCashFlow || 0;

  const isPositiveCashFlow = firstYearCashFlow >= 0;

  const insights = [
    {
      icon: Leaf,
      eyebrow: "GROWTH",
      title: "High Growth Potential",
      text: (
        <>
          This scenario uses{" "}
          <strong className="font-semibold text-[#263d35]">
            {appreciationRate.toFixed(2)}% annual appreciation
          </strong>{" "}
          as the assumed property growth rate.
        </>
      ),
    },

    {
      icon: WalletCards,
      eyebrow: "CASH FLOW",
      title: isPositiveCashFlow
        ? "Positive Cash Flow"
        : "Negative Cash Flow",
      text: isPositiveCashFlow ? (
        <>
          Rental income covers operating expenses and financing costs,
          generating{" "}
          <strong className="font-semibold text-[#263d35]">
            positive annual cash flow
          </strong>
          .
        </>
      ) : (
        <>
          Current rental income does not fully cover operating expenses
          and EMI, resulting in{" "}
          <strong className="font-semibold text-[#263d35]">
            negative annual cash flow
          </strong>
          .
        </>
      ),
    },

    {
      icon: ShieldCheck,
      eyebrow: "RETURNS",
      title: "Investment Return",
      text: (
        <>
          Estimated investor profit is{" "}
          <strong className="font-semibold text-[#263d35]">
            ₹ {formatINR(data.totalProfit)}
          </strong>{" "}
          over {data.holdingPeriod} years, before taxes and selling
          costs.
        </>
      ),
    },

    {
      icon: Sparkles,
      eyebrow: "WEALTH",
      title: "Long-Term Wealth",
      text: (
        <>
          Property appreciation contributes approximately{" "}
          <strong className="font-semibold text-[#263d35]">
            {appreciationContribution.toFixed(1)}%
          </strong>{" "}
          of gross investment returns in this scenario.
        </>
      ),
    },
  ];

  return (
    <section
      className="
        relative
        mt-5
        overflow-hidden
        rounded-[14px]
        border
        border-[#e6dfd3]
        bg-[#fdfcf9]
        shadow-[0_8px_35px_rgba(35,45,40,0.035)]
      "
    >
      {/* TOP ACCENT */}

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a64b]/60 to-transparent" />

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          gap-3
          border-b
          border-[#ebe5db]
          px-5
          py-5
          sm:flex-row
          sm:items-center
          sm:justify-between
          md:px-6
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-[38px]
              w-[38px]
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#d5b15f]/30
              bg-[#f4eee1]
            "
          >
            <TrendingUp
              size={17}
              strokeWidth={1.5}
              className="text-[#a47a2c]"
            />
          </div>

          <div>
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[#b08a42]
              "
            >
              Investment Analysis
            </p>

            <h3
              className="
                mt-0.5
                font-serif
                text-[18px]
                leading-tight
                text-[#10251f]
              "
            >
              Key Insights
            </h3>
          </div>
        </div>

        <p
          className="
            max-w-[360px]
            text-[9px]
            leading-5
            text-[#858078]
            sm:text-right
          "
        >
          A quick view of the factors influencing your projected
          investment performance.
        </p>
      </div>

      {/* INSIGHTS */}

      <div
        className="
          grid
          grid-cols-1
          divide-y
          divide-[#ebe5db]
          sm:grid-cols-2
          sm:divide-x
          sm:divide-y-0
          lg:grid-cols-4
          lg:divide-x
        "
      >
        {insights.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                group
                relative
                px-5
                py-5
                transition-all
                duration-300
                hover:bg-[#faf8f3]
                md:px-6
                md:py-6
              "
            >
              {/* GOLD HOVER LINE */}

              <div
                className="
                  absolute
                  inset-x-5
                  top-0
                  h-[2px]
                  origin-left
                  scale-x-0
                  bg-[#c9a64b]
                  transition-transform
                  duration-300
                  group-hover:scale-x-100
                  md:inset-x-6
                "
              />

              {/* ICON */}

              <div
                className="
                  flex
                  h-[42px]
                  w-[42px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#dfe6df]
                  bg-[#f0f4ef]
                  transition-all
                  duration-300
                  group-hover:border-[#d7c28c]
                  group-hover:bg-[#f5efe2]
                "
              >
                <Icon
                  size={18}
                  strokeWidth={1.5}
                  className="
                    text-[#45675b]
                    transition-colors
                    duration-300
                    group-hover:text-[#a47a2c]
                  "
                />
              </div>

              {/* EYEBROW */}

              <p
                className="
                  mt-5
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#b18a43]
                "
              >
                {item.eyebrow}
              </p>

              {/* TITLE */}

              <h4
                className="
                  mt-1
                  font-serif
                  text-[15px]
                  leading-tight
                  text-[#182b25]
                "
              >
                {item.title}
              </h4>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-2
                  text-[9px]
                  leading-[1.8]
                  text-[#77736d]
                "
              >
                {item.text}
              </p>

              {/* NUMBER */}

              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-4
                  right-5
                  font-serif
                  text-[30px]
                  leading-none
                  text-[#eee9df]
                  transition-colors
                  duration-300
                  group-hover:text-[#e6ddca]
                  md:right-6
                "
              >
                0{index + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* DISCLAIMER */}

      <div
        className="
          flex
          items-start
          gap-2
          border-t
          border-[#ebe5db]
          bg-[#faf9f5]
          px-5
          py-3
          md:px-6
        "
      >
        <ShieldCheck
          size={12}
          strokeWidth={1.5}
          className="mt-[1px] shrink-0 text-[#9b8a69]"
        />

        <p className="text-[8px] leading-4 text-[#8a867f]">
          These insights are based on the assumptions entered above and
          are for illustrative purposes only. Actual investment returns
          may vary.
        </p>
      </div>
    </section>
  );
}


/* =========================================================
   SCENARIO BANNER
========================================================= */

function ScenarioBanner() {
  return (
    <section
      className="
        relative
        mt-5
        overflow-hidden
        rounded-[14px]
        border
        border-[#24493d]
        bg-[#00291f]
        shadow-[0_12px_40px_rgba(0,43,32,0.12)]
      "
    >
      {/* BACKGROUND GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          -left-20
          -top-24
          h-[260px]
          w-[260px]
          rounded-full
          bg-[#1d7052]/25
          blur-[70px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-28
          right-[12%]
          h-[230px]
          w-[230px]
          rounded-full
          bg-[#c9a64b]/10
          blur-[75px]
        "
      />

      {/* SUBTLE GRID */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
          [background-size:32px_32px]
        "
      />

      {/* CONTENT */}

      <div
        className="
          relative
          z-10
          flex
          flex-col
          gap-6
          px-5
          py-6
          md:flex-row
          md:items-center
          md:justify-between
          md:px-7
          md:py-7
        "
      >
        {/* LEFT */}

        <div className="flex min-w-0 items-center gap-4 md:gap-5">
          {/* ICON */}

          <div
            className="
              flex
              h-[58px]
              w-[58px]
              shrink-0
              items-center
              justify-center
              rounded-[13px]
              border
              border-[#d5a449]/35
              bg-[#d5a449]/[0.07]
              shadow-[inset_0_0_25px_rgba(213,164,73,0.04)]
              sm:h-[64px]
              sm:w-[64px]
            "
          >
            <BarChart3
              size={29}
              strokeWidth={1.35}
              className="text-[#d8b15e]"
            />
          </div>

          {/* COPY */}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="
                  h-[5px]
                  w-[5px]
                  rounded-full
                  bg-[#d5a449]
                  shadow-[0_0_10px_rgba(213,164,73,0.8)]
                "
              />

              <p
                className="
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-[#d5a449]
                "
              >
                Scenario Planning
              </p>
            </div>

            <h3
              className="
                mt-1
                font-serif
                text-[20px]
                leading-tight
                text-white
                md:text-[22px]
              "
            >
              Try Different Scenarios
            </h3>

            <p
              className="
                mt-2
                max-w-[590px]
                text-[9px]
                leading-[1.8]
                text-white/60
                md:text-[10px]
              "
            >
              Change rent, appreciation, interest rate or holding period
              to explore how different assumptions can affect your
              projected investment returns.
            </p>
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            className="
              group
              relative
              flex
              h-[45px]
              items-center
              justify-center
              gap-2
              overflow-hidden
              rounded-[8px]
              border
              border-white/15
              bg-white/[0.04]
              px-5
              text-[9px]
              font-medium
              text-white/80
              transition-all
              duration-300
              hover:border-[#d5a449]/40
              hover:bg-white/[0.08]
              hover:text-white
            "
          >
            <span
              className="
                absolute
                inset-y-0
                -left-full
                w-1/2
                skew-x-[-20deg]
                bg-white/10
                transition-all
                duration-700
                group-hover:left-[130%]
              "
            />

            <span className="relative z-10">
              Compare Scenarios
            </span>

            <BarChart3
              size={13}
              strokeWidth={1.5}
              className="relative z-10"
            />
          </button>

          <button
            type="button"
            className="
              group
              flex
              h-[45px]
              items-center
              justify-center
              gap-2
              rounded-[8px]
              bg-[#d5a449]
              px-5
              text-[9px]
              font-semibold
              text-[#10251f]
              shadow-[0_8px_25px_rgba(0,0,0,0.2)]
              transition-all
              duration-300
              hover:-translate-y-[1px]
              hover:bg-[#e1b35b]
              hover:shadow-[0_10px_30px_rgba(0,0,0,0.28)]
            "
          >
            <span>Recalculate</span>

            <ArrowRight
              size={13}
              strokeWidth={1.8}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </button>
        </div>
      </div>

      {/* BOTTOM GOLD LINE */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#d5a449]/60
          to-transparent
        "
      />
    </section>
  );
}
/* =========================================================
   MAIN ROI CALCULATOR
========================================================= */

export default function ROICalculator() {
  const [formData, setFormData] =
    useState(INITIAL_FORM);

  /*
   * IMPORTANT:
   *
   * formData = what the user is currently editing.
   *
   * calculatedFormData = the values that were
   * actually submitted through "Calculate ROI".
   *
   * This fixes the previous data-flow problem where
   * useMemo recalculated the results on every keystroke
   * even before the user clicked Calculate ROI.
   */
  const [
    calculatedFormData,
    setCalculatedFormData,
  ] = useState(INITIAL_FORM);

  const [calculated, setCalculated] =
    useState(true);

  /* =======================================================
     RESULTS
  ======================================================= */

  const results = useMemo(() => {
    return calculateROI(
      calculatedFormData
    );
  }, [calculatedFormData]);

  /* =======================================================
     CALCULATE
  ======================================================= */

  const handleCalculate = () => {
    setCalculatedFormData(
      formData
    );

    setCalculated(true);
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = () => {
    const resetData = {
      investment: {
        ...INITIAL_FORM.investment,
      },

      breakdown: {
        ...INITIAL_FORM.breakdown,
      },

      rental: {
        ...INITIAL_FORM.rental,
      },

      expenses: {
        ...INITIAL_FORM.expenses,
      },
    };

    setFormData(
      resetData
    );

    setCalculatedFormData(
      resetData
    );

    setCalculated(true);
  };

  return (
    <section className="bg-[#faf9f6] py-5 md:py-6">
      <div className="mx-auto max-w-[1450px] px-5 xl:px-8">
        {/* =================================================
            MAIN CALCULATOR GRID
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[377px_minmax(0,1fr)]">
          {/* LEFT */}

          <InvestmentForm
            formData={formData}
            setFormData={setFormData}
            onCalculate={
              handleCalculate
            }
            onReset={
              handleReset
            }
          />

          {/* RIGHT */}

          <div
            className="
              min-w-0
              rounded-[10px]
              border
              border-[#e9e2d7]
              bg-white
              p-4
              md:p-5
            "
          >
            {/* HEADER */}

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Calculator
                  size={18}
                  strokeWidth={1.6}
                  className="text-[#17382e]"
                />

                <h2 className="font-serif text-[17px] text-[#10251f]">
                  ROI Summary
                </h2>
              </div>

              <button
                type="button"
                className="
                  hidden
                  h-[34px]
                  items-center
                  gap-2
                  rounded-md
                  border
                  border-[#cfc9bf]
                  bg-white
                  px-4
                  text-[9px]
                  text-[#222]
                  transition
                  hover:border-[#c9a64b]
                  hover:text-[#17382e]
                  sm:flex
                "
              >
                View Detailed Report
                <Download
                  size={12}
                />
              </button>
            </div>

            {/* MOBILE REPORT */}

            <button
              type="button"
              className="
                mt-3
                flex
                h-[36px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-md
                border
                border-[#ddd7cc]
                text-[9px]
                text-[#333]
                sm:hidden
              "
            >
              View Detailed Report
              <Download
                size={12}
              />
            </button>

            {/* RESULTS */}

            {calculated && (
              <>
                <ROISummary
                  data={results}
                />

                <ReturnsChart
                  data={results}
                  years={
                    results.holdingPeriod
                  }
                />

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <AnnualCashFlow
                    data={results}
                  />

                  <ROIPerformance
                    data={results}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* KEY INSIGHTS */}

        {calculated && (
          <KeyInsights
            data={results}
          />
        )}

        {/* SCENARIO CTA */}

        {calculated && (
          <ScenarioBanner />
        )}
      </div>
    </section>
  );
}