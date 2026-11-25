"use client";

import {
  ArrowRight,
  Calculator,
  RefreshCcw,
  Wallet,
  Percent,
  CalendarDays,
  Check,
} from "lucide-react";
import { formatCurrency } from "./emiUtils";

const POPULAR_SCENARIOS = [
  { amount: 5000000, rate: 8.5, years: 20, label: "₹50 lakh · 8.5% · 20 years" },
  { amount: 7500000, rate: 8.5, years: 25, label: "₹75 lakh · 8.5% · 25 years" },
  { amount: 10000000, rate: 9, years: 20, label: "₹1 crore · 9% · 20 years" },
];

function getEMI(principal, annualRate, years) {
  const p = Number(principal);
  const n = Number(years) * 12;
  const r = Number(annualRate) / 1200;
  if (!p || !n || p <= 0 || r < 0 || !Number.isFinite(p + n + r)) return 0;
  if (r === 0) return p / n;
  return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function EMICalculatorTool({
  loanAmount,
  interestRate,
  tenureYears,
  onLoanAmountChange,
  onInterestRateChange,
  onTenureYearsChange,
  summary,
  onReset,
}) {
  const valid = summary?.valid;
  const principalShare = valid && summary.totalPayment > 0
    ? (summary.principal / summary.totalPayment) * 100
    : 0;
  const interestShare = valid ? 100 - principalShare : 0;

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-12">
          {/* MAIN CALCULATOR */}
          <div className="min-w-0">
            <div className="px-1 pt-5 sm:px-2">
              <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#b58b45]">
                Home Loan Calculator
              </p>
              <h2 id="emi-calculator-tool-heading" className="mt-2 font-serif text-[30px] font-normal leading-[1.15] text-[#10251f] md:text-[36px]">
                Calculate Your Home Loan EMI
              </h2>
              <p className="mt-3 max-w-[650px] text-[13px] leading-6 text-[#777] md:text-[14px]">
                Enter your loan details to estimate the monthly instalment and understand the total cost of repayment.
              </p>
            </div>

            <div className="relative mt-7 overflow-hidden rounded-[18px] border border-[#e7e0d3] bg-white text-[#161616] shadow-[0_15px_50px_rgba(0,0,0,0.045)]">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#c89d58] to-transparent" />

              <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                {/* INPUTS */}
                <div className="border-b border-[#eee8dc] p-6 sm:p-7 lg:border-b-0 lg:border-r lg:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[1px] text-[#1b1b1b]">Loan Details</p>
                      <p className="mt-1 text-[11px] text-[#999]">Adjust the values to calculate your EMI</p>
                    </div>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f7f2e8] text-[11px] font-semibold text-[#b58b45]">01</span>
                  </div>

                  <div className="mt-7 space-y-7">
                    <LoanField
                      id="emi-loan-amount"
                      label="Loan Amount"
                      helper="Enter the amount you plan to borrow"
                      value={loanAmount}
                      min={100000}
                      max={50000000}
                      step={50000}
                      prefix="₹"
                      onChange={onLoanAmountChange}
                    />
                    <LoanField
                      id="emi-interest-rate"
                      label="Interest Rate"
                      helper="Annual interest rate offered by the lender"
                      value={interestRate}
                      min={5}
                      max={18}
                      step={0.05}
                      suffix="% p.a."
                      onChange={onInterestRateChange}
                    />
                    <LoanField
                      id="emi-tenure-years"
                      label="Loan Tenure"
                      helper="Choose the repayment period"
                      value={tenureYears}
                      min={1}
                      max={30}
                      step={1}
                      suffix="Years"
                      onChange={onTenureYearsChange}
                    />
                  </div>
                </div>

                {/* RESULTS */}
                <div className="bg-[#fcfaf6] p-6 sm:p-7 lg:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[1px] text-[#1b1b1b]">Your EMI Estimate</p>
                      <p className="mt-1 text-[11px] text-[#999]">Indicative monthly repayment</p>
                    </div>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f7f2e8] text-[11px] font-semibold text-[#b58b45]">02</span>
                  </div>

                  <div className="mt-7 rounded-[16px] border border-[#dfd4c0] bg-gradient-to-r from-[#f5f0e7] to-[#f9f6f0] p-5 sm:p-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[1.6px] text-[#8a7552]">Monthly EMI</p>
                    <p className="mt-2 break-words font-serif text-[32px] leading-tight text-[#10251f] sm:text-[38px]">
                      {valid ? formatCurrency(summary.monthlyEmi) : "—"}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-[#777]">
                      <Check size={13} className="shrink-0 text-[#a47b37]" />
                      <span>Calculated using the reducing-balance EMI formula</span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <ResultCard label="Principal Amount" value={valid ? formatCurrency(summary.principal) : "—"} icon={<Wallet size={15} />} />
                    <ResultCard label="Total Interest" value={valid ? formatCurrency(summary.totalInterest) : "—"} icon={<Percent size={15} />} />
                    <ResultCard label="Total Payment" value={valid ? formatCurrency(summary.totalPayment) : "—"} icon={<Calculator size={15} />} />
                    <ResultCard label="Loan Duration" value={valid ? `${summary.months} months` : "—"} icon={<CalendarDays size={15} />} />
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between gap-3 text-[10px] text-[#777]">
                      <span>Principal vs. interest</span>
                      <span className="font-semibold text-[#333]">{valid ? `${interestShare.toFixed(1)}% interest` : "—"}</span>
                    </div>
                    <div className="flex h-2.5 overflow-hidden rounded-full bg-[#e8e1d5]">
                      <div className="h-full bg-[#17382e] transition-all" style={{ width: `${principalShare}%` }} />
                      <div className="h-full bg-[#c89d58] transition-all" style={{ width: `${interestShare}%` }} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#777]">
                      <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#17382e]" /> Principal</span>
                      <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#c89d58]" /> Interest</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#eee8dc] p-5 sm:flex-row sm:p-6 md:p-7">
                <a
                  href="#emi-repayment-schedule"
                  className="flex h-[50px] flex-1 items-center justify-center gap-3 rounded-xl bg-[#03261e] text-[13px] font-semibold tracking-[0.2px] text-white transition-all duration-300 hover:bg-[#0a3c30] hover:shadow-[0_10px_30px_rgba(3,38,30,0.18)]"
                >
                  View Repayment Schedule <ArrowRight size={16} strokeWidth={1.8} />
                </a>
                <button
                  type="button"
                  onClick={onReset}
                  className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl border border-[#d9c7a2] bg-white text-[13px] font-medium text-[#222] transition-all duration-300 hover:border-[#c89d58] hover:bg-[#faf8f3] hover:text-[#8d682d] sm:w-[145px]"
                >
                  Reset <RefreshCcw size={14} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="min-w-0 rounded-[18px] border border-[#e7e0d3] bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.025)] sm:p-6 lg:mt-[76px] lg:p-6 xl:p-7">
            <PopularScenarios />
          </aside>
        </div>
      </div>
    </section>
  );
}

function LoanField({ id, label, helper, value, min, max, step, prefix, suffix, onChange }) {
  const safeSliderValue = Math.min(max, Math.max(min, Number(value) || min));

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <label htmlFor={id} className="block text-[11px] font-semibold uppercase tracking-[0.7px] text-[#666]">{label}</label>
          <p className="mt-1 text-[10px] leading-5 text-[#999]">{helper}</p>
        </div>
      </div>
      <div className="mt-2 flex h-[52px] items-center rounded-xl border border-[#ddd7cc] bg-white px-4 transition-all duration-200 focus-within:border-[#c89d58] focus-within:ring-4 focus-within:ring-[#c89d58]/10">
        {prefix && <span className="mr-2 text-[14px] font-semibold text-[#8b7653]">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[18px] font-semibold text-[#202020] outline-none"
        />
        {suffix && <span className="ml-2 shrink-0 rounded-md bg-[#f7f3eb] px-2.5 py-1.5 text-[10px] font-semibold text-[#777]">{suffix}</span>}
        {prefix && <span className="ml-2 shrink-0 text-[10px] font-medium text-[#888]">INR</span>}
      </div>
      <input
        aria-label={`${label} slider`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeSliderValue}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-1.5 w-full cursor-pointer accent-[#17382e]"
      />
      <div className="mt-1 flex justify-between text-[9px] text-[#aaa]">
        <span>{prefix ? "₹1 lakh" : suffix === "% p.a." ? "5%" : "1 year"}</span>
        <span>{prefix ? "₹5 crore" : suffix === "% p.a." ? "18%" : "30 years"}</span>
      </div>
    </div>
  );
}

function ResultCard({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-[#e9e2d7] bg-white p-3.5">
      <div className="flex items-center gap-2 text-[#b58b45]">
        {icon}
        <p className="text-[9px] font-semibold uppercase tracking-[0.7px] text-[#8a7552]">{label}</p>
      </div>
      <p className="mt-2 break-words text-[14px] font-semibold leading-5 text-[#17382e]">{value}</p>
    </div>
  );
}

function PopularScenarios() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5efe4] text-[#b58b45]"><Calculator size={18} /></div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[1.8px] text-[#b58b45]">Quick Reference</p>
          <h3 className="mt-1 text-[18px] font-semibold leading-tight text-[#161616]">Sample EMI Estimates</h3>
        </div>
      </div>

      <div className="mt-5">
        {POPULAR_SCENARIOS.map((scenario) => (
          <div key={scenario.label} className="border-t border-[#eee8dc] py-3.5">
            <p className="text-[11px] font-medium leading-5 text-[#333]">{scenario.label}</p>
            <p className="mt-1 text-[13px] font-semibold text-[#17382e]">{formatCurrency(getEMI(scenario.amount, scenario.rate, scenario.years))} <span className="text-[10px] font-normal text-[#888]">/ month</span></p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-[#eadfc9] bg-[#faf7f0] p-4">
        <p className="text-[10px] leading-5 text-[#777]">
          Examples are illustrative and use the stated annual rates and repayment periods. Your lender's final rate, fees and terms may differ.
        </p>
      </div>
    </div>
  );
}
