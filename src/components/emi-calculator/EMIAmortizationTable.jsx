"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Calculator, ChevronDown } from "lucide-react";
import { buildYearlyAmortization, formatCurrency } from "./emiUtils";

export default function EMIAmortizationTable({ loanAmount, interestRate, tenureYears }) {
  const [showAll, setShowAll] = useState(false);
  const rows = useMemo(
    () => buildYearlyAmortization(loanAmount, interestRate, tenureYears),
    [loanAmount, interestRate, tenureYears]
  );
  const visibleRows = showAll ? rows : rows.slice(0, 5);
  const columns = [
    { key: "openingBalance", label: "Opening Balance", short: "Opening" },
    { key: "emiPaid", label: "Total EMI Paid", short: "EMI Paid" },
    { key: "principalPaid", label: "Principal Repaid", short: "Principal" },
    { key: "interestPaid", label: "Interest Paid", short: "Interest" },
    { key: "closingBalance", label: "Closing Balance", short: "Closing" },
  ];

  return (
    <section id="emi-repayment-schedule" className="w-full scroll-mt-28">
      <div className="mx-auto max-w-[1450px] px-5 pb-14 xl:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[760px]">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#17382e] text-[#d7b66a]"><Calculator size={14} strokeWidth={1.8} /></span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8a7552]">Loan Breakdown</span>
            </div>
            <h2 id="emi-repayment-schedule-heading" className="font-serif text-[27px] font-normal leading-tight text-[#10251f] md:text-[31px]">Year-wise EMI Repayment Schedule</h2>
            <p className="mt-2 max-w-[680px] text-[11px] leading-5 text-[#6b6b6b] md:text-[12px]">
              See how each year's repayments are divided between principal and interest, and how the outstanding loan balance reduces over time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAll((previous) => !previous)}
            className="hidden h-[40px] shrink-0 items-center gap-2 rounded-lg border border-[#ddd7cc] bg-white px-4 text-[11px] font-medium text-[#333] shadow-[0_3px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#c9a64b] hover:bg-[#fcfaf5] hover:text-[#10251f] sm:flex"
          >
            <span>{showAll ? "Show Fewer Years" : "View Full Schedule"}</span>
            <ChevronDown size={14} strokeWidth={1.8} className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-lg border border-[#eee8dc] bg-[#faf8f3] px-4 py-2.5 sm:hidden">
          <span className="text-[10px] text-[#6b6b6b]">Swipe horizontally to view all figures</span>
          <ArrowRight size={13} className="text-[#8c7651]" />
        </div>

        <div className="relative mt-3 overflow-hidden rounded-xl border border-[#e4ddd1] bg-white shadow-[0_6px_25px_rgba(0,0,0,0.035)] sm:mt-5">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#c9a64b] to-transparent opacity-70" />
          <div className="overflow-x-auto overscroll-x-contain scrollbar-thin scrollbar-thumb-[#d8d0c2] scrollbar-track-transparent">
            <table className="w-full min-w-[920px] border-collapse text-center">
              <thead>
                <tr className="bg-[#faf8f3]">
                  <th className="sticky left-0 z-20 min-w-[100px] border-r border-[#e7e0d3] bg-[#faf8f3] px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.05em] text-[#17382e]">Year</th>
                  {columns.map((column) => (
                    <th key={column.key} className="min-w-[155px] border-r border-[#e7e0d3] px-4 py-4 text-[10px] font-semibold leading-5 text-[#202020] last:border-r-0">
                      <span className="hidden md:inline">{column.label}</span>
                      <span className="md:hidden">{column.short}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.length ? visibleRows.map((row) => (
                  <tr key={row.year} className="border-t border-[#eee8dc] transition-colors duration-200 hover:bg-[#fcfaf5]">
                    <td className="sticky left-0 z-10 border-r border-[#eee8dc] bg-white px-4 py-4 text-left text-[11px] font-semibold leading-5 text-[#17382e]">Year {row.year}</td>
                    {columns.map((column) => (
                      <td key={`${row.year}-${column.key}`} className="border-r border-[#eee8dc] px-4 py-4 text-[11px] leading-5 text-[#4a4a4a] last:border-r-0">{formatCurrency(row[column.key])}</td>
                    ))}
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="px-4 py-10 text-[12px] text-[#888]">Enter valid loan details to view the repayment schedule.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {rows.length > 5 && (
          <button
            type="button"
            onClick={() => setShowAll((previous) => !previous)}
            className="mt-4 flex h-[42px] w-full items-center justify-center gap-2 rounded-lg border border-[#ddd7cc] bg-white px-4 text-[11px] font-medium text-[#333] transition-all duration-300 hover:border-[#c9a64b] hover:bg-[#fcfaf5] sm:hidden"
          >
            {showAll ? "Show Fewer Years" : "View Full Schedule"}
            <ChevronDown size={14} className={`transition-transform ${showAll ? "rotate-180" : ""}`} />
          </button>
        )}

        <div className="mt-4 rounded-[14px] border border-[#e5dfd2] bg-[#faf8f3] px-5 py-4 md:px-6">
          <p className="text-[11px] leading-6 text-[#777] md:text-[12px]">
            <strong className="font-semibold text-[#17382e]">Note:</strong> This is an illustrative schedule based on the current loan amount, interest rate and tenure. Actual repayment figures can change if the lender revises a floating rate, or if you make part-prepayments or other changes to the loan.
          </p>
        </div>
      </div>
    </section>
  );
}
