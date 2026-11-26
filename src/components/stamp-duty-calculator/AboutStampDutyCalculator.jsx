"use client";

import {
  CheckCircle2,
  FileCheck2,
  Landmark,
  MapPin,
  ReceiptText,
  ShieldCheck,
  WalletCards,
  ArrowRight,
} from "lucide-react";

const benefits = [
  "Plan registration costs before finalising a purchase",
  "Compare the effect of ownership categories",
  "Understand the role of circle or guidance value",
  "Review major government-charge components together",
];

const chargeTypes = [
  { icon: ReceiptText, title: "Stamp Duty", text: "A state or UT levy on specified legal instruments, including property conveyance documents." },
  { icon: FileCheck2, title: "Registration Fee", text: "A fee payable for registering the property document with the relevant registration authority." },
  { icon: Landmark, title: "Additional Levies", text: "Applicable cess, surcharge, transfer duty or local charges may add to the transaction cost." },
  { icon: MapPin, title: "Local Variations", text: "Rates and concessions can depend on the location, property details, buyer category and applicable schedule." },
];

export default function AboutStampDutyCalculator() {
  return (
    <section className="bg-white" aria-labelledby="about-stamp-duty-heading">
      <div className="mx-auto max-w-[1450px] px-5 pb-16 pt-2 xl:px-8">
        <div className="relative overflow-hidden rounded-[24px] border border-[#e8e0d2] bg-[#f7f3eb] shadow-[0_15px_60px_rgba(0,0,0,0.04)]">
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-[380px] w-[380px] rounded-full bg-[#D4AF37]/10 blur-[100px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-32 h-[320px] w-[320px] rounded-full bg-[#17382e]/5 blur-[90px]" />
          <div className="relative z-10 p-6 md:p-9 lg:p-11">
            <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="flex items-center gap-3"><span className="h-px w-9 bg-[#D4AF37]" /><span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B58B2D]">Property Registration Guide</span></div>
                <h2 id="about-stamp-duty-heading" className="mt-5 font-playfair text-[30px] leading-[1.15] text-[#10251f] md:text-[38px]">What is a <span className="text-[#B58B2D]">Stamp Duty Calculator?</span></h2>
                <div className="mt-5 h-[2px] w-20 bg-[#D4AF37]" />
                <p className="mt-6 max-w-[720px] text-[13px] leading-7 text-[#666] md:text-[14px] md:leading-8">A stamp duty calculator is a planning tool that helps estimate the statutory charges involved in registering a property transaction. When buying a home, the purchase price is not the only amount to budget for. Stamp duty, registration fees and applicable additional levies can meaningfully affect the total acquisition cost.</p>
                <p className="mt-4 max-w-[720px] text-[13px] leading-7 text-[#666] md:text-[14px] md:leading-8">The applicable amounts can vary across Indian States and Union Territories. They may also depend on the <strong className="font-semibold text-[#17382e]">type of document, property location, transaction value and buyer eligibility</strong>. This calculator provides an indicative reference for a standard residential sale deed using the rate assumptions shown for the selected jurisdiction.</p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {benefits.map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-[#e6dece] bg-white/70 px-4 py-3"><CheckCircle2 size={16} className="shrink-0 text-[#B58B2D]" /><span className="text-[11px] font-medium text-[#555]">{item}</span></div>)}
                </div>
              </div>

              <div className="rounded-[20px] border border-[#e5dccb] bg-white p-6 shadow-[0_15px_50px_rgba(0,0,0,0.05)] md:p-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#17382e] text-[#D4AF37]"><WalletCards size={22} /></div>
                  <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B58B2D]">Cost Components</p><h3 className="mt-1 text-[21px] font-semibold text-[#17382e]">What goes into the estimate?</h3></div>
                </div>
                <div className="mt-6 space-y-3">
                  {chargeTypes.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-3 rounded-xl bg-[#f8f5ee] p-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#a47b37]"><Icon size={17} /></div><div><p className="text-[12px] font-semibold text-[#333]">{title}</p><p className="mt-1 text-[10px] leading-5 text-[#777]">{text}</p></div></div>)}
                </div>
                <div className="mt-5 rounded-xl border border-[#eadfc9] bg-[#faf7f0] p-4"><div className="flex items-center gap-2"><ShieldCheck size={15} className="text-[#B58B2D]" /><p className="text-[11px] font-semibold text-[#17382e]">A note on accuracy</p></div><p className="mt-2 text-[10px] leading-5 text-[#777]">The calculator is an estimate, not a government assessment. Confirm current rates, caps, exemptions and local surcharges with the applicable authority before signing or registering a deed.</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="max-w-[780px]"><div className="flex items-center gap-3"><span className="h-px w-9 bg-[#D4AF37]" /><span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B58B2D]">Before You Register</span></div><h2 className="mt-4 font-playfair text-[29px] leading-tight text-[#10251f] md:text-[35px]">Four details worth <span className="text-[#B58B2D]">checking carefully</span></h2><p className="mt-3 text-[12px] leading-6 text-[#777] md:text-[13px]">A useful estimate starts with the right transaction details. Check these items against your draft agreement and the relevant state registration guidance.</p></div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "01", title: "Correct valuation", text: "Check the agreement consideration against the applicable circle or guidance value." },
              { n: "02", title: "Buyer category", text: "Confirm whether the buyer qualifies for any gender, ownership or other concession." },
              { n: "03", title: "Local jurisdiction", text: "Verify whether the property falls under a municipal, rural or special local area schedule." },
              { n: "04", title: "Document type", text: "Confirm the instrument being registered and the fee schedule that applies to it." },
            ].map((item) => <div key={item.n} className="rounded-[14px] border border-[#e5dfd2] bg-white p-5 shadow-[0_8px_25px_rgba(0,0,0,0.025)]"><span className="font-serif text-[24px] text-[#c29a50]">{item.n}</span><h3 className="mt-3 text-[13px] font-semibold text-[#17382e]">{item.title}</h3><p className="mt-2 text-[11px] leading-6 text-[#777]">{item.text}</p></div>)}
          </div>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-medium text-[#8b7655]"><ArrowRight size={13} /> Use the calculator above for a preliminary estimate, then verify the official payable amount.</div>
        </div>
      </div>
    </section>
  );
}
