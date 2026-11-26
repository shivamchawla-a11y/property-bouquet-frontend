"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is stamp duty when buying a property?",
    answer: <>Stamp duty is a government levy on specified legal documents used in a property transaction, such as a conveyance or sale deed. It is generally payable to the relevant State or Union Territory authority as part of completing the registration process.</>,
  },
  {
    question: "Is stamp duty the same across all Indian states?",
    answer: <>No. Stamp duty is governed by state-specific laws and schedules, and rates can vary across States and Union Territories. Local bodies, property location, document type, transaction value and buyer eligibility may also affect the amount payable.</>,
  },
  {
    question: "What is the difference between stamp duty and registration charges?",
    answer: <><strong>Stamp duty</strong> is the levy on the applicable legal instrument. <strong>Registration charges</strong> are fees for recording the document with the registration authority. They are separate components and should be checked independently.</>,
  },
  {
    question: "Why does the calculator ask for circle rate or guidance value?",
    answer: <>Some state valuation frameworks use the higher of the stated transaction consideration and the applicable government guideline or circle value for assessing duty. The exact rule can vary by state, document and transaction, so verify the applicable valuation method locally.</>,
  },
  {
    question: "Does stamp duty differ for male and female buyers?",
    answer: <>Some jurisdictions provide concessions or different rates based on buyer category or ownership structure, while others do not. The calculator uses the indicative male, female or joint rate entered in its state configuration. Eligibility conditions and caps must be confirmed with the local authority.</>,
  },
  {
    question: "Can stamp duty rates differ between urban and rural properties?",
    answer: <>They can. A state may distinguish areas by municipal limits, local body classification or other notified categories. The Urban / Rural selector is used only where the available rate configuration has a corresponding variation; it does not replace locality-level verification.</>,
  },
  {
    question: "Does this calculator cover commercial property and every type of deed?",
    answer: <>The current rate model is intended as an indicative estimate for a standard residential property sale deed. Commercial property, gifts, leases, transfers, development agreements and other instruments may follow different schedules and are not covered by this estimate.</>,
  },
  {
    question: "Does the estimate include legal fees, brokerage or home-loan costs?",
    answer: <>No. The estimate focuses on configured government charges: stamp duty, registration fee and listed additional levies. Brokerage, legal review, loan processing, mortgage documentation, society charges, taxes and other transaction costs are excluded unless specifically stated.</>,
  },
  {
    question: "How accurate is the Property Bouquet Stamp Duty Calculator?",
    answer: <>It is a planning reference based on the assumptions shown for the selected jurisdiction, not a government quotation. Some local surcharges, slabs, valuation thresholds, caps, exemptions and recent notifications may not be represented. Always confirm the final amount on the official State / UT registration portal or with the Sub-Registrar.</>,
  },
  {
    question: "What should I verify before paying stamp duty?",
    answer: <>Confirm the correct property valuation, deed type, buyer eligibility, local jurisdiction, applicable concession or surcharge, payment method and current fee schedule. Review the draft deed and official guidance before making payment or scheduling registration.</>,
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const visibleFaqs = showAll ? faqs : faqs.slice(0, 8);

  return (
    <section className="bg-[#faf8f3]" aria-labelledby="stamp-duty-faq-heading">
      <div className="mx-auto max-w-[1450px] px-5 pb-16 pt-6 xl:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3"><span className="h-px w-8 bg-[#D4AF37]" /><span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B58B2D]">Helpful Information</span></div>
            <h2 id="stamp-duty-faq-heading" className="font-playfair text-[30px] leading-tight text-[#10251f] md:text-[36px]">Frequently Asked Questions</h2>
            <p className="mt-3 max-w-[680px] text-[13px] leading-6 text-[#777] md:text-[14px]">Find answers to common questions about stamp duty, property registration charges and the assumptions used in this calculator.</p>
          </div>
          <button type="button" onClick={() => setShowAll((value) => !value)} className="group hidden shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#17382e] transition hover:text-[#B58B2D] sm:flex">
            {showAll ? "Show Fewer FAQs" : "View All FAQs"}<ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-7 h-px w-full bg-[#e5dfd2]" />
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {visibleFaqs.map((faq, index) => {
            const isOpen = open === index;
            return (
              <div key={faq.question} className={`group overflow-hidden rounded-[14px] border bg-white transition-all duration-300 ${isOpen ? "border-[#D4AF37]/50 shadow-[0_15px_45px_rgba(0,0,0,0.06)]" : "border-[#e4ddd1] hover:border-[#D4AF37]/40 hover:shadow-[0_10px_35px_rgba(0,0,0,0.04)]"}`}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : index)} className="flex w-full items-center gap-4 px-5 py-5 text-left md:px-6">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 ${isOpen ? "bg-[#D4AF37] text-[#10251f]" : "bg-[#f5f1e8] text-[#B58B2D]"}`}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={`flex-1 text-[13px] font-semibold leading-5 transition-colors duration-300 ${isOpen ? "text-[#10251f]" : "text-[#292929]"}`}>{faq.question}</span>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? "rotate-180 border-[#D4AF37] bg-[#D4AF37] text-[#10251f]" : "border-[#e5dfd2] bg-[#faf8f3] text-[#17382e] group-hover:border-[#D4AF37]"}`}><ChevronDown size={15} /></span>
                </button>
                <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden"><div className="mx-5 h-px bg-[#eee8dc] md:mx-6" /><div className="px-5 pb-6 pt-4 md:px-6"><p className="max-w-[680px] text-[12px] leading-7 text-[#686868] md:text-[13px]">{faq.answer}</p></div></div>
                </div>
              </div>
            );
          })}
        </div>

        <button type="button" onClick={() => setShowAll((value) => !value)} className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#ddd7cc] bg-white text-[11px] font-semibold text-[#17382e] sm:hidden">{showAll ? "Show Fewer FAQs" : "View All FAQs"}<ArrowRight size={13} /></button>
        <div className="mt-8 rounded-[14px] border border-[#e5dfd2] bg-white px-5 py-4 md:px-6"><p className="text-[11px] leading-6 text-[#777] md:text-[12px]"><strong className="font-semibold text-[#17382e]">Important:</strong> Stamp duty and registration requirements are jurisdiction- and document-specific. The calculator provides indicative estimates only. Confirm the current official schedule and final payable amount with the relevant State / UT authority before completing a transaction.</p></div>
      </div>
    </section>
  );
}
