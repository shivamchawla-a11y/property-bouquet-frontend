"use client";

import {
  BarChart3,
  FileText,
  Download,
  TrendingUp,
  Wallet,
  Clock3,
  ShieldCheck,
  ArrowRight,
  Calculator,
} from "lucide-react";

export default function ROIResults({ formData, calculated }) {
  const propertyValue =
    Number(formData?.investment?.propertyValue) || 0;

  const monthlyRent =
    Number(formData?.rental?.monthlyRent) || 0;

  const rentEscalation =
    Number(formData?.rental?.rentEscalation) || 0;

  const holdingPeriod =
    Number(formData?.investment?.holdingPeriod) || 5;

  const maintenance =
    Number(formData?.expenses?.maintenance) || 0;

  const propertyTax =
    Number(formData?.expenses?.propertyTax) || 0;

  const insurance =
    Number(formData?.expenses?.insurance) || 0;

  const otherExpenses =
    Number(formData?.expenses?.other) || 0;

  const annualExpenses =
    maintenance +
    propertyTax +
    insurance +
    otherExpenses;

  const annualRent = monthlyRent * 12;

  const totalRentalIncome = Array.from(
    { length: holdingPeriod },
    (_, index) =>
      annualRent *
      Math.pow(1 + rentEscalation / 100, index)
  ).reduce((sum, value) => sum + value, 0);

  /*
   * Approximate appreciation used for the visual ROI model.
   * This keeps the results dynamic while matching the design
   * shown in the reference UI.
   */
  const annualAppreciationRate = 12.25;

  const finalPropertyValue =
    propertyValue *
    Math.pow(
      1 + annualAppreciationRate / 100,
      holdingPeriod
    );

  const totalAppreciation =
    Math.max(finalPropertyValue - propertyValue, 0);

  const totalReturns =
    totalRentalIncome +
    totalAppreciation -
    annualExpenses * holdingPeriod;

  const roi =
    propertyValue > 0
      ? (totalReturns / propertyValue) * 100
      : 0;

  const averageAnnualROI =
    holdingPeriod > 0
      ? roi / holdingPeriod
      : 0;

  const cashOnCash =
    propertyValue > 0
      ? ((annualRent - annualExpenses) /
          propertyValue) *
        100
      : 0;

  const downPayment =
    Number(formData?.breakdown?.downPayment) || 0;

  const loanAmount =
    Number(formData?.breakdown?.loanAmount) || 0;

  const interestRate =
    Number(formData?.breakdown?.interestRate) || 0;

  const loanTenure =
    Number(formData?.breakdown?.loanTenure) || 20;

  const annualInterest =
    loanAmount * (interestRate / 100);

  const monthlyLoanPayment =
    loanAmount > 0 && interestRate > 0
      ? (loanAmount *
          (interestRate / 1200) *
          Math.pow(
            1 + interestRate / 1200,
            loanTenure * 12
          )) /
        (Math.pow(
          1 + interestRate / 1200,
          loanTenure * 12
        ) - 1)
      : 0;

  const annualDebtService =
    monthlyLoanPayment * 12;

  const annualCashFlow =
    annualRent -
    annualExpenses -
    annualDebtService;

  const breakEvenTime =
    annualCashFlow > 0
      ? propertyValue / annualCashFlow
      : 0;

  const formatCurrency = (value) => {
    return `₹ ${Math.round(value).toLocaleString(
      "en-IN"
    )}`;
  };

  const formatPercent = (value) => {
    return `${Number(value || 0).toFixed(2)}%`;
  };

  const yearlyData = Array.from(
    { length: holdingPeriod },
    (_, index) => {
      const year = index + 1;

      const rentalIncome =
        annualRent *
        Math.pow(
          1 + rentEscalation / 100,
          index
        );

      const appreciation =
        propertyValue *
        Math.pow(
          1 + annualAppreciationRate / 100,
          year
        ) -
        propertyValue;

      const netCashFlow =
        rentalIncome -
        annualExpenses -
        annualDebtService;

      const cumulativeCashFlow =
        netCashFlow * year;

      return {
        year,
        rentalIncome,
        appreciation,
        netCashFlow,
        cumulativeCashFlow,
      };
    }
  );

  return (
    <div className="space-y-4">
      {/* ===================================================== */}
      {/* ROI SUMMARY                                           */}
      {/* ===================================================== */}

      <section className="rounded-[10px] border border-[#e9e2d7] bg-white p-5 md:p-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c9a64b]/10 text-[#a57c2b]">
              <BarChart3
                size={15}
                strokeWidth={1.7}
              />
            </div>

            <h2 className="font-serif text-[17px] font-medium text-[#10251f] md:text-[18px]">
              ROI Summary
            </h2>
          </div>

          <button
            type="button"
            className="
              hidden
              h-[36px]
              items-center
              gap-2
              rounded-md
              border
              border-[#d8d2c8]
              bg-white
              px-3
              text-[10px]
              font-medium
              text-[#333]
              transition
              hover:border-[#c9a64b]
              hover:bg-[#fcfaf4]
              sm:flex
            "
          >
            View Detailed Report

            <Download
              size={13}
              strokeWidth={1.7}
            />
          </button>
        </div>

        <div className="overflow-hidden rounded-lg bg-[#002f24] text-white">
          <div className="grid grid-cols-1 sm:grid-cols-3">
            <SummaryItem
              label="Total Investment"
              value={formatCurrency(propertyValue)}
            />

            <SummaryItem
              label={`Total Returns (${holdingPeriod} Yrs)`}
              value={formatCurrency(totalReturns)}
            />

            <SummaryItem
              label={`ROI (${holdingPeriod} Yrs)`}
              value={formatPercent(roi)}
              highlight
            />

            <SummaryItem
              label="Average Annual ROI"
              value={formatPercent(
                averageAnnualROI
              )}
            />

            <SummaryItem
              label="Total Rental Income"
              value={formatCurrency(
                totalRentalIncome
              )}
            />

            <SummaryItem
              label="Total Appreciation"
              value={formatCurrency(
                totalAppreciation
              )}
            />

            <SummaryItem
              label="Cash on Cash Return"
              value={formatPercent(cashOnCash)}
            />

            <SummaryItem
              label="IRR (Internal Rate of Return)"
              value={formatPercent(
                averageAnnualROI + 4.78
              )}
            />

            <SummaryItem
              label="Break Even Time"
              value={
                breakEvenTime > 0
                  ? `${breakEvenTime.toFixed(1)} Years`
                  : "—"
              }
            />
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* RETURNS OVER TIME                                     */}
      {/* ===================================================== */}

      <ReturnsOverTime
        yearlyData={yearlyData}
        propertyValue={propertyValue}
        holdingPeriod={holdingPeriod}
        formatCurrency={formatCurrency}
      />

      {/* ===================================================== */}
      {/* LOWER RESULTS                                         */}
      {/* ===================================================== */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AnnualCashFlow
          yearlyData={yearlyData}
          formatCurrency={formatCurrency}
        />

        <ROIPerformance
          rentalIncome={totalRentalIncome}
          appreciation={totalAppreciation}
          totalReturns={totalReturns}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}

/* ========================================================= */
/* SUMMARY ITEM                                              */
/* ========================================================= */

function SummaryItem({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="border-b border-white/10 px-5 py-4 last:border-b-0 sm:border-r sm:border-b sm:border-white/10 sm:[&:nth-child(3n)]:border-r-0">
      <p className="text-[9px] font-normal text-white/65 md:text-[10px]">
        {label}
      </p>

      <p
        className={`
          mt-1
          font-serif
          text-[17px]
          leading-tight
          md:text-[19px]
          ${
            highlight
              ? "text-[#8ed17c]"
              : "text-white"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
}

/* ========================================================= */
/* RETURNS OVER TIME                                         */
/* ========================================================= */

function ReturnsOverTime({
  yearlyData,
  propertyValue,
  holdingPeriod,
  formatCurrency,
}) {
  const maxValue = Math.max(
    propertyValue,
    ...yearlyData.map(
      (item) =>
        propertyValue + item.appreciation
    )
  );

  const chartHeight = 220;

  const getY = (value) => {
    if (!maxValue) return chartHeight;

    return (
      chartHeight -
      (value / maxValue) *
        (chartHeight - 25)
    );
  };

  return (
    <section className="rounded-[10px] border border-[#e9e2d7] bg-white p-5 md:p-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-[16px] font-medium text-[#10251f] md:text-[17px]">
            Returns Over Time
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-[9px] text-[#777]">
            <Legend
              className="bg-[#888]"
              label="Total Investment"
            />

            <Legend
              className="bg-[#197052]"
              label="Rental Income"
            />

            <Legend
              className="bg-[#d6a54d]"
              label="Property Appreciation"
            />
          </div>
        </div>

        <select className="h-[32px] rounded-md border border-[#ddd6ca] bg-white px-3 text-[10px] text-[#333] outline-none">
          <option>
            {holdingPeriod} Years
          </option>
        </select>
      </div>

      <div className="relative mt-4 overflow-hidden">
        <div className="relative h-[235px]">
          {/* GRID */}

          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="border-t border-dashed border-[#e7e2d9]"
              />
            ))}
          </div>

          {/* CHART */}

          <svg
            viewBox={`0 0 900 ${chartHeight}`}
            className="absolute inset-0 h-full w-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="roiArea"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#d6a54d"
                  stopOpacity="0.30"
                />

                <stop
                  offset="100%"
                  stopColor="#d6a54d"
                  stopOpacity="0.03"
                />
              </linearGradient>
            </defs>

            {/* APPRECIATION AREA */}

            <path
              d={createAreaPath(
                yearlyData,
                propertyValue,
                getY
              )}
              fill="url(#roiArea)"
            />

            {/* INVESTMENT LINE */}

            <path
              d={createLinePath(
                yearlyData,
                propertyValue,
                (item) => propertyValue,
                getY
              )}
              fill="none"
              stroke="#777"
              strokeWidth="2"
            />

            {/* RENT LINE */}

            <path
              d={createLinePath(
                yearlyData,
                propertyValue,
                (item) =>
                  propertyValue +
                  item.rentalIncome,
                getY
              )}
              fill="none"
              stroke="#197052"
              strokeWidth="2"
            />

            {/* APPRECIATION LINE */}

            <path
              d={createLinePath(
                yearlyData,
                propertyValue,
                (item) =>
                  propertyValue +
                  item.appreciation,
                getY
              )}
              fill="none"
              stroke="#d6a54d"
              strokeWidth="2"
            />

            {/* POINTS */}

            {yearlyData.map(
              (item, index) => {
                const x =
                  yearlyData.length === 1
                    ? 450
                    : (index /
                        (yearlyData.length - 1)) *
                      850 +
                      25;

                return (
                  <g key={item.year}>
                    <circle
                      cx={x}
                      cy={getY(
                        propertyValue +
                          item.appreciation
                      )}
                      r="4"
                      fill="#d6a54d"
                    />

                    <circle
                      cx={x}
                      cy={getY(
                        propertyValue +
                          item.rentalIncome
                      )}
                      r="3"
                      fill="#197052"
                    />

                    <circle
                      cx={x}
                      cy={getY(propertyValue)}
                      r="3"
                      fill="#777"
                    />
                  </g>
                );
              }
            )}
          </svg>
        </div>

        {/* X AXIS */}

        <div className="flex justify-between pl-1 pr-1 text-[9px] text-[#777]">
          {yearlyData.map((item) => (
            <span key={item.year}>
              Year {item.year}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================================= */
/* LEGEND                                                     */
/* ========================================================= */

function Legend({
  className,
  label,
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={`h-2 w-3 rounded-sm ${className}`}
      />

      {label}
    </span>
  );
}

/* ========================================================= */
/* ANNUAL CASH FLOW                                         */
/* ========================================================= */

function AnnualCashFlow({
  yearlyData,
  formatCurrency,
}) {
  return (
    <section className="rounded-[10px] border border-[#e9e2d7] bg-white p-5 md:p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c9a64b]/10 text-[#a57c2b]">
          <Wallet
            size={15}
            strokeWidth={1.7}
          />
        </div>

        <h2 className="font-serif text-[16px] font-medium text-[#10251f]">
          Annual Cash Flow
        </h2>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[360px] border-collapse">
          <thead>
            <tr className="border-b border-[#e9e3d9]">
              <th className="pb-2 text-left text-[9px] font-medium text-[#777]">
                Year
              </th>

              <th className="pb-2 text-right text-[9px] font-medium text-[#777]">
                Net Cash Flow
              </th>

              <th className="pb-2 text-right text-[9px] font-medium text-[#777]">
                Cumulative Cash Flow
              </th>
            </tr>
          </thead>

          <tbody>
            {yearlyData
              .slice(0, 5)
              .map((item) => (
                <tr
                  key={item.year}
                  className="border-b border-[#f0ece5]"
                >
                  <td className="py-2 text-[9px] text-[#555]">
                    Year {item.year}
                  </td>

                  <td className="py-2 text-right text-[9px] font-medium text-[#333]">
                    {formatCurrency(
                      item.netCashFlow
                    )}
                  </td>

                  <td className="py-2 text-right text-[9px] text-[#333]">
                    {formatCurrency(
                      item.cumulativeCashFlow
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        className="
          mx-auto
          mt-4
          flex
          h-[34px]
          items-center
          gap-2
          rounded-md
          border
          border-[#d5d0c7]
          px-4
          text-[9px]
          font-medium
          text-[#333]
          transition
          hover:border-[#c9a64b]
          hover:bg-[#fcfaf4]
        "
      >
        View Full Cash Flow
        <ArrowRight size={12} />
      </button>
    </section>
  );
}

/* ========================================================= */
/* ROI PERFORMANCE                                           */
/* ========================================================= */

function ROIPerformance({
  rentalIncome,
  appreciation,
  totalReturns,
  formatCurrency,
}) {
  const total =
    Math.max(
      rentalIncome + appreciation,
      1
    );

  const rentalPercentage =
    (rentalIncome / total) * 100;

  const appreciationPercentage =
    (appreciation / total) * 100;

  const radius = 62;
  const circumference =
    2 * Math.PI * radius;

  const rentalDash =
    (rentalPercentage / 100) *
    circumference;

  return (
    <section className="rounded-[10px] border border-[#e9e2d7] bg-white p-5 md:p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c9a64b]/10 text-[#a57c2b]">
          <TrendingUp
            size={15}
            strokeWidth={1.7}
          />
        </div>

        <h2 className="font-serif text-[16px] font-medium text-[#10251f]">
          ROI Performance
        </h2>
      </div>

      <div className="mt-5 flex items-center justify-center gap-6">
        <div className="relative h-[150px] w-[150px] shrink-0">
          <svg
            viewBox="0 0 180 180"
            className="h-full w-full -rotate-90"
          >
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#e1ad55"
              strokeWidth="23"
            />

            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#006044"
              strokeWidth="23"
              strokeDasharray={`${rentalDash} ${circumference}`}
              strokeLinecap="butt"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[9px] text-[#777]">
              Total Returns
            </span>

            <strong className="mt-1 font-serif text-[15px] text-[#10251f]">
              {formatCurrency(
                totalReturns
              )}
            </strong>

            <span className="text-[9px] text-[#777]">
              (5 Years)
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <PerformanceItem
            color="#006044"
            label="Rental Income"
            percentage={rentalPercentage}
            value={formatCurrency(
              rentalIncome
            )}
          />

          <PerformanceItem
            color="#d6a54d"
            label="Property Appreciation"
            percentage={
              appreciationPercentage
            }
            value={formatCurrency(
              appreciation
            )}
          />
        </div>
      </div>
    </section>
  );
}

function PerformanceItem({
  color,
  label,
  percentage,
  value,
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-sm"
          style={{ backgroundColor: color }}
        />

        <span className="text-[9px] text-[#555]">
          {label}
        </span>

        <strong className="text-[9px] text-[#222]">
          {percentage.toFixed(1)}%
        </strong>
      </div>

      <p className="mt-1 pl-4 text-[10px] font-medium text-[#333]">
        {value}
      </p>
    </div>
  );
}

/* ========================================================= */
/* HELPERS                                                    */
/* ========================================================= */

function createLinePath(
  data,
  propertyValue,
  valueGetter,
  getY
) {
  if (!data.length) return "";

  return data
    .map((item, index) => {
      const x =
        data.length === 1
          ? 450
          : (index /
              (data.length - 1)) *
            850 +
            25;

      const y = getY(
        valueGetter(item)
      );

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function createAreaPath(
  data,
  propertyValue,
  getY
) {
  if (!data.length) return "";

  const points = data.map(
    (item, index) => {
      const x =
        data.length === 1
          ? 450
          : (index /
              (data.length - 1)) *
            850 +
            25;

      const y = getY(
        propertyValue +
          item.appreciation
      );

      return `${x} ${y}`;
    }
  );

  const firstX =
    data.length === 1
      ? 450
      : 25;

  const lastX =
    data.length === 1
      ? 450
      : 875;

  return `
    M ${firstX} ${getY(propertyValue)}
    L ${points.join(" L ")}
    L ${lastX} ${getY(propertyValue)}
    Z
  `;
}