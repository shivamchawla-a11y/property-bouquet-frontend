"use client";

import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Info,
  MapPin,
  RefreshCcw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { INDIAN_STATES, getStateRateConfig } from "./stampDutyRates";
import { formatINR, parseAmount } from "./stampDutyUtils";

const fieldClass = "mt-2 h-[50px] w-full rounded-xl border border-[#ddd7cc] bg-white px-4 text-[13px] text-[#202020] outline-none transition-all duration-200 hover:border-[#cfc2aa] focus:border-[#c89d58] focus:ring-4 focus:ring-[#c89d58]/10";
const labelClass = "block text-[11px] font-semibold uppercase tracking-[0.7px] text-[#666]";

function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-[10px] leading-5 text-[#929292]">{hint}</span> : null}
    </label>
  );
}

function RateForSelection({ config, ownership, area }) {
  if (!config?.configured) return null;
  const areaConfig = config.stampDuty?.[area];
  const rate = areaConfig && typeof areaConfig === "object"
    ? areaConfig[ownership]
    : config.stampDuty?.[ownership];
  return Number.isFinite(Number(rate)) ? Number(rate) : null;
}

export default function StampDutyCalculatorTool({
  agreementValue,
  setAgreementValue,
  circleRateValue,
  setCircleRateValue,
  stateCode,
  setStateCode,
  ownership,
  setOwnership,
  area,
  setArea,
  includeMunicipalSurcharge,
  setIncludeMunicipalSurcharge,
  onReset,
  summary,
  stateLocked = false,
}) {
  const selectedState = INDIAN_STATES.find((state) => state.code === stateCode);
  const rateConfig = getStateRateConfig(stateCode);
  const currentRate = RateForSelection({ config: rateConfig, ownership, area });
  const hasAgreement = parseAmount(agreementValue) > 0;
  const showMunicipalOption = (rateConfig?.additionalCharges || []).some(
    (charge) => charge.optionalKey === "includeMunicipalSurcharge"
  );

  return (
    <section className="w-full" aria-labelledby="stamp-duty-calculator-tool-heading">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-12">
          {/* MAIN CALCULATOR */}
          <div className="min-w-0">
            <div className="px-1 pt-5 sm:px-2">
              <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#b58b45]">Property Cost Calculator</p>
              <h2 id="stamp-duty-calculator-tool-heading" className="mt-2 font-serif text-[30px] font-normal leading-[1.15] text-[#10251f] md:text-[36px]">
                Calculate Stamp Duty & Registration
              </h2>
              <p className="mt-3 max-w-[700px] text-[13px] leading-6 text-[#777] md:text-[14px]">
                Enter the transaction value and choose the applicable ownership and location details to estimate the government charges for a residential sale deed.
              </p>
            </div>

            <div className="relative mt-7 overflow-hidden rounded-[18px] border border-[#e7e0d3] bg-white text-[#161616] shadow-[0_15px_50px_rgba(0,0,0,0.045)]">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#c89d58] to-transparent" />

              <div className="flex flex-col gap-5 border-b border-[#eee8dc] bg-[#fcfaf6] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#17382e] text-[#d4af37]"><Calculator size={19} /></div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#17382e]">Property & transaction details</p>
                    <p className="mt-1 text-[10px] text-[#888]">Standard residential property sale deed estimate</p>
                  </div>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e7dfd0] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.8px] text-[#8f713f]"><MapPin size={12} /> {stateLocked ? selectedState?.name : "India · State-wise"}</span>
              </div>

              <div className="p-5 sm:p-7 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <Field
                    label="State / Union Territory"
                    hint={stateLocked ? "This calculator is dedicated to the selected jurisdiction." : "Select the state where the property is registered."}
                  >
                    {stateLocked ? (
                      <div className={`${fieldClass} flex items-center justify-between bg-[#faf8f3]`}>
                        <span className="font-semibold text-[#17382e]">{selectedState?.name || "Selected jurisdiction"}</span>
                        <span className="rounded-full border border-[#e5dfd2] bg-white px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.7px] text-[#9b7840]">Fixed page</span>
                      </div>
                    ) : (
                      <select id="stamp-duty-state" className={fieldClass} value={stateCode} onChange={(event) => setStateCode(event.target.value)}>
                        <optgroup label="States">
                          {INDIAN_STATES.filter((state) => state.type === "state").map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}
                        </optgroup>
                        <optgroup label="Union Territories">
                          {INDIAN_STATES.filter((state) => state.type === "ut").map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}
                        </optgroup>
                      </select>
                    )}
                  </Field>

                  <Field label="Property location" hint="Choose urban or rural where the selected rate schedule distinguishes them.">
                    <select id="stamp-duty-area" className={fieldClass} value={area} onChange={(event) => setArea(event.target.value)}>
                      <option value="urban">Urban / Municipal Area</option>
                      <option value="rural">Rural Area</option>
                    </select>
                  </Field>

                  <Field label="Agreement / purchase value (₹)" hint="Enter the amount agreed between buyer and seller.">
                    <div className="mt-2 flex h-[58px] items-center rounded-xl border border-[#ddd7cc] bg-white px-4 transition-all focus-within:border-[#c89d58] focus-within:ring-4 focus-within:ring-[#c89d58]/10">
                      <span className="mr-3 text-[15px] font-semibold text-[#b58b45]">₹</span>
                      <input id="agreement-value" type="text" inputMode="numeric" value={agreementValue} onChange={(event) => setAgreementValue(event.target.value.replace(/[^0-9]/g, ""))} placeholder="Enter agreement value" className="min-w-0 flex-1 bg-transparent text-[19px] font-medium text-[#202020] outline-none placeholder:text-[14px] placeholder:font-normal placeholder:text-[#aaa]" />
                    </div>
                    {hasAgreement ? <p className="mt-1.5 text-[10px] font-medium text-[#668073]">{formatINR(parseAmount(agreementValue))}</p> : null}
                  </Field>

                  <Field label="Circle / guidance value (₹)" hint="Optional. The higher of agreement and guidance value is used as the estimate base.">
                    <div className="mt-2 flex h-[58px] items-center rounded-xl border border-[#ddd7cc] bg-white px-4 transition-all focus-within:border-[#c89d58] focus-within:ring-4 focus-within:ring-[#c89d58]/10">
                      <span className="mr-3 text-[15px] font-semibold text-[#b58b45]">₹</span>
                      <input id="circle-rate-value" type="text" inputMode="numeric" value={circleRateValue} onChange={(event) => setCircleRateValue(event.target.value.replace(/[^0-9]/g, ""))} placeholder="Optional guidance value" className="min-w-0 flex-1 bg-transparent text-[19px] font-medium text-[#202020] outline-none placeholder:text-[14px] placeholder:font-normal placeholder:text-[#aaa]" />
                    </div>
                    {parseAmount(circleRateValue) > 0 ? <p className="mt-1.5 text-[10px] font-medium text-[#668073]">{formatINR(parseAmount(circleRateValue))}</p> : null}
                  </Field>

                  <Field label="Buyer / ownership category" hint="Buyer category can affect the applicable stamp-duty rate in some states.">
                    <select id="stamp-duty-ownership" className={fieldClass} value={ownership} onChange={(event) => setOwnership(event.target.value)}>
                      <option value="male">Male ownership</option>
                      <option value="female">Female ownership</option>
                      <option value="joint">Joint ownership</option>
                    </select>
                  </Field>

                  <Field label="Transaction type" hint="Rate configuration currently covers standard residential sale deeds.">
                    <select className={`${fieldClass} bg-[#faf8f3] text-[#777]`} value="residential" disabled>
                      <option value="residential">Residential property · Sale deed</option>
                    </select>
                  </Field>
                </div>

                {showMunicipalOption ? (
                  <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-[#e6dece] bg-[#faf8f3] p-4 transition hover:border-[#d4af37]/60">
                    <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#17382e]" checked={includeMunicipalSurcharge} onChange={(event) => setIncludeMunicipalSurcharge(event.target.checked)} />
                    <span><span className="block text-[12px] font-semibold text-[#17382e]">Property falls within a Nagar Nigam area</span><span className="mt-1 block text-[10px] leading-5 text-[#777]">Include the optional municipal surcharge in this indicative Uttar Pradesh estimate. Confirm exact applicability for the locality.</span></span>
                  </label>
                ) : null}

                <div className="mt-7 rounded-xl border border-[#eee8dc] bg-[#fcfaf6] p-4 sm:p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2"><Info size={15} className="text-[#b58b45]" /><p className="text-[11px] font-semibold text-[#17382e]">Calculation basis</p></div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#9c7a42]">Higher of the two values</span>
                  </div>
                  <p className="mt-2 text-[11px] leading-6 text-[#777]">{summary?.usedCircleRate ? "Your circle / guidance value is higher, so the estimate uses that value as its calculation base." : "Your agreement value is currently the higher value and is used as the calculation base."} The applicable legal valuation method may vary by state, deed type and local rules.</p>
                </div>

                <div className="mt-7 flex flex-col gap-3 border-t border-[#eee8dc] pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-[#333]">{selectedState?.name || "Selected location"}</p>
                    <p className="mt-1 text-[10px] text-[#999]">{rateConfig?.configured ? "Indicative residential rate configuration available" : "Rate configuration pending verification"}</p>
                  </div>
                  <button type="button" onClick={onReset} className="flex h-[46px] items-center justify-center gap-2 rounded-xl border border-[#d9c7a2] bg-white px-5 text-[12px] font-medium text-[#222] transition-all duration-300 hover:border-[#c89d58] hover:bg-[#faf8f3] hover:text-[#8d682d]">
                    Reset Calculator <RefreshCcw size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="min-w-0 rounded-[18px] border border-[#e7e0d3] bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.025)] sm:p-6 lg:mt-[76px] lg:p-6 xl:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5efe4] text-[#b58b45]"><WalletCards size={20} /></div>
              <div><p className="text-[10px] font-semibold uppercase tracking-[1.8px] text-[#b58b45]">Live Estimate</p><h3 className="mt-1 text-[18px] font-semibold leading-tight text-[#161616]">Your Cost Snapshot</h3></div>
            </div>

            {summary?.isValid ? (
              <>
                <div className="mt-6 rounded-[14px] bg-[#062b22] p-5 text-white">
                  <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-[#d4af37]">Total Government Charges</p>
                  <p className="mt-2 font-serif text-[30px] leading-tight text-[#e5c67d] sm:text-[34px]">{formatINR(summary.totalGovernmentCharges)}</p>
                  <p className="mt-2 text-[10px] leading-5 text-white/55">Estimated stamp duty, registration and additional charges combined.</p>
                </div>
                <div className="mt-5 space-y-0">
                  <SnapshotRow label={`Stamp duty (${summary.stampDutyRate}%)`} value={summary.stampDuty} />
                  <SnapshotRow label="Registration fee" value={summary.registrationFee} />
                  {summary.additionalBreakdown.map((item) => <SnapshotRow key={item.label} label={item.label} value={item.amount} />)}
                </div>
                <div className="mt-5 rounded-xl border border-[#e8dfce] bg-[#faf7f0] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[#9b7840]">Estimated Total Outlay</p>
                  <p className="mt-1 text-[21px] font-semibold text-[#17382e]">{formatINR(summary.totalPropertyCost)}</p>
                  <p className="mt-1 text-[10px] leading-5 text-[#888]">Agreement value plus estimated government charges.</p>
                </div>
                {summary.usedCircleRate ? <p className="mt-4 flex items-start gap-2 text-[10px] leading-5 text-[#8a6d39]"><Info size={13} className="mt-0.5 shrink-0" />Circle / guidance value is higher and has been used as the calculation base.</p> : null}
              </>
            ) : (
              <div className="mt-6 rounded-[14px] border border-[#e8dfce] bg-[#faf8f3] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#b58b45]"><Calculator size={19} /></div>
                <h4 className="mt-4 text-[14px] font-semibold text-[#17382e]">Estimate will appear here</h4>
                <p className="mt-2 text-[11px] leading-6 text-[#777]">{!rateConfig?.configured ? `A reviewed rate configuration for ${selectedState?.name || "this State / UT"} has not been added in this version. The calculator will not invent a rate.` : "Enter an agreement value above to calculate the indicative stamp duty and registration charges."}</p>
              </div>
            )}

            <div className="mt-5 border-t border-[#eee8dc] pt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-[#b58b45]">Selected rate reference</p>
              {rateConfig?.configured ? (
                <>
                  <div className="mt-3 flex items-center justify-between gap-3"><span className="text-[11px] text-[#777]">Stamp duty rate</span><strong className="text-[13px] text-[#17382e]">{currentRate === null ? "Not mapped" : `${currentRate}%`}</strong></div>
                  <div className="mt-3 flex items-center justify-between gap-3"><span className="text-[11px] text-[#777]">Registration rate</span><strong className="text-[13px] text-[#17382e]">{rateConfig.registration?.rate ?? 0}%</strong></div>
                  <p className="mt-3 text-[10px] leading-5 text-[#929292]">{rateConfig.notes?.[0] || "Indicative state-level reference. Local fees and concessions may apply."}</p>
                </>
              ) : <p className="mt-3 text-[10px] leading-5 text-[#929292]">No rate is configured for this State / UT yet. Please verify with the official registration department.</p>}
            </div>

            <div className="mt-5 rounded-xl border border-[#e5dfd2] bg-white p-4">
              <div className="flex items-center gap-2"><ShieldCheck size={15} className="text-[#b58b45]" /><p className="text-[11px] font-semibold text-[#17382e]">Planning reference</p></div>
              <p className="mt-2 text-[10px] leading-5 text-[#888]">This tool is for early-stage budgeting. Confirm the final payable amount with the relevant State / UT registration authority or a qualified property professional.</p>
            </div>
          </aside>
        </div>

        {summary?.isValid ? (
          <div className="mt-8 flex flex-col gap-3 rounded-xl border border-[#e6dece] bg-[#faf8f3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#a47b37]" /><p className="text-[11px] text-[#686868]">Estimate calculated for <strong className="text-[#17382e]">{selectedState?.name}</strong></p></div>
            <p className="text-[11px] font-semibold text-[#17382e]">Effective charges: {summary.effectiveChargeRate.toFixed(2)}% of agreement value</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SnapshotRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[#eee8dc] py-3 last:border-b-0">
      <span className="text-[11px] leading-5 text-[#777]">{label}</span>
      <strong className="shrink-0 text-[12px] font-semibold text-[#292929]">{formatINR(value)}</strong>
    </div>
  );
}
