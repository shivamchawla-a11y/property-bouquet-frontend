"use client";

import { ArrowRight, Calculator, CheckCircle2, FileText, Info, Landmark, ReceiptText } from "lucide-react";
import { formatINR } from "./stampDutyUtils";

export default function StampDutyBreakdown({ summary, rateConfig, stateName, ownership, area }) {
  const rows = summary?.isValid ? [
    { label: "Agreement / purchase value", value: summary.agreementValue, note: "Value entered by you", type: "base" },
    { label: "Circle / guidance value", value: summary.circleRateValue, note: "Optional value entered by you", type: "base" },
    { label: "Calculation base", value: summary.calculationBase, note: summary.usedCircleRate ? "Higher guidance value selected" : "Agreement value selected", type: "base" },
    { label: `Stamp duty (${summary.stampDutyRate}%)`, value: summary.stampDuty, note: "Indicative state-wise rate", type: "charge" },
    { label: "Registration fee", value: summary.registrationFee, note: "As represented in the selected rate configuration", type: "charge" },
    ...summary.additionalBreakdown.map((item) => ({ label: item.label, value: item.amount, note: "Additional configured charge", type: "charge" })),
  ] : [];

  return (
    <section className="w-full" aria-labelledby="stamp-duty-breakdown-heading">
      <div className="mx-auto max-w-[1450px] px-5 pb-14 pt-16 xl:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[760px]">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#17382e] text-[#d7b66a]"><ReceiptText size={14} strokeWidth={1.8} /></span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8a7552]">Calculation Details</span>
            </div>
            <h2 id="stamp-duty-breakdown-heading" className="font-serif text-[27px] font-normal leading-tight text-[#10251f] md:text-[31px]">Stamp Duty & Cost Breakdown</h2>
            <p className="mt-2 max-w-[680px] text-[11px] leading-5 text-[#6b6b6b] md:text-[12px]">Review how the indicative government charges contribute to your property acquisition outlay.</p>
          </div>
          {summary?.isValid ? <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a7552]"><CheckCircle2 size={14} /> Estimate ready</span> : null}
        </div>

        {summary?.isValid ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="overflow-hidden rounded-xl border border-[#e4ddd1] bg-white shadow-[0_6px_25px_rgba(0,0,0,0.035)]">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#c9a64b] to-transparent opacity-70" />
              <div className="flex items-center justify-between gap-3 border-b border-[#eee8dc] bg-[#faf8f3] px-5 py-4 sm:px-6">
                <div><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a7552]">Selected jurisdiction</p><p className="mt-1 text-[13px] font-semibold text-[#17382e]">{stateName}</p></div>
                <div className="text-right"><p className="text-[10px] text-[#999]">Ownership / area</p><p className="mt-1 text-[11px] font-semibold capitalize text-[#333]">{ownership} · {area}</p></div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[580px] border-collapse text-left">
                  <thead><tr className="bg-white"><th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#777] sm:px-6">Description</th><th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#777] sm:px-6">Calculation note</th><th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-[#777] sm:px-6">Amount</th></tr></thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={`${row.label}-${index}`} className="border-t border-[#eee8dc]">
                        <td className="px-5 py-4 sm:px-6"><p className={`text-[12px] font-semibold ${row.type === "charge" ? "text-[#17382e]" : "text-[#333]"}`}>{row.label}</p></td>
                        <td className="px-5 py-4 text-[10px] leading-5 text-[#888] sm:px-6">{row.note}</td>
                        <td className="px-5 py-4 text-right text-[12px] font-semibold tabular-nums text-[#222] sm:px-6">{formatINR(row.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot><tr className="border-t border-[#e5dfd2] bg-[#faf8f3]"><td colSpan={2} className="px-5 py-4 text-[12px] font-semibold text-[#17382e] sm:px-6">Total government charges</td><td className="px-5 py-4 text-right text-[15px] font-bold text-[#17382e] sm:px-6">{formatINR(summary.totalGovernmentCharges)}</td></tr></tfoot>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-[#e4ddd1] bg-white p-5 shadow-[0_6px_25px_rgba(0,0,0,0.035)] sm:p-6">
              <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f5efe4] text-[#b58b45]"><Landmark size={18} /></span><div><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b58b45]">Purchase Snapshot</p><h3 className="mt-1 text-[17px] font-semibold text-[#17382e]">Estimated outlay</h3></div></div>
              <div className="mt-6 space-y-4">
                <SummaryBar label="Property value" amount={summary.agreementValue} total={summary.totalPropertyCost} />
                <SummaryBar label="Government charges" amount={summary.totalGovernmentCharges} total={summary.totalPropertyCost} />
              </div>
              <div className="mt-6 border-t border-[#eee8dc] pt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#999]">Total estimated property cost</p>
                <p className="mt-2 font-serif text-[29px] leading-tight text-[#17382e]">{formatINR(summary.totalPropertyCost)}</p>
                <p className="mt-2 text-[10px] leading-5 text-[#888]">Based on the agreement value plus the calculated government charges. Brokerage, legal, loan and other costs are excluded.</p>
              </div>
              <div className="mt-5 flex items-start gap-2 rounded-lg border border-[#eadfc9] bg-[#faf7f0] p-3"><Info size={14} className="mt-0.5 shrink-0 text-[#b58b45]" /><p className="text-[10px] leading-5 text-[#777]">The estimate uses the selected configuration for {stateName}. Always confirm current rates and applicable concessions before execution.</p></div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-[#e4ddd1] bg-white p-6 shadow-[0_6px_25px_rgba(0,0,0,0.035)] sm:p-8">
            <div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7f2e8] text-[#b58b45]"><Calculator size={19} /></div><div><h3 className="text-[15px] font-semibold text-[#17382e]">Your detailed breakdown will appear here</h3><p className="mt-2 max-w-[760px] text-[11px] leading-6 text-[#777]">Enter a property value and select a jurisdiction with a configured rate to view the calculation base, stamp duty, registration fee, additional charges and estimated total cost.</p></div></div>
          </div>
        )}

        <div className="mt-5 flex items-start gap-2 rounded-xl border border-[#e5dfd2] bg-[#faf8f3] px-5 py-4"><Info size={14} className="mt-0.5 shrink-0 text-[#9b7840]" /><p className="text-[10px] leading-5 text-[#777]">{rateConfig?.notes?.[0] || "State and local schedules may include additional conditions, slabs, caps, concessions or document-specific fees not represented in a simplified estimate."}</p></div>
      </div>
    </section>
  );
}

function SummaryBar({ label, amount, total }) {
  const width = total > 0 ? Math.min(100, (amount / total) * 100) : 0;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3"><span className="text-[11px] text-[#777]">{label}</span><strong className="text-[11px] text-[#333]">{formatINR(amount)}</strong></div>
      <div className="h-2 overflow-hidden rounded-full bg-[#f1eee7]"><div className="h-full rounded-full bg-[#17382e]" style={{ width: `${width}%` }} /></div>
    </div>
  );
}
