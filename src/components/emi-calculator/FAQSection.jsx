"use client";

import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";

const faqs = [
  {
    question: "What is a home loan EMI?",
    answer: <>A home loan EMI, or <strong>Equated Monthly Instalment</strong>, is the amount you pay to the lender each month towards repayment of your loan. It generally includes both principal repayment and interest.</>,
  },
  {
    question: "How is home loan EMI calculated?",
    answer: <>EMI is calculated using the <strong>loan principal, monthly interest rate and total number of monthly instalments</strong>. The standard reducing-balance formula accounts for interest on the outstanding loan balance over the repayment period.</>,
  },
  {
    question: "Does a longer loan tenure reduce my EMI?",
    answer: <>A longer tenure generally reduces the monthly EMI because repayment is spread over more months. However, it can also increase the <strong>total interest payable</strong> over the life of the loan.</>,
  },
  {
    question: "How does the interest rate affect my EMI?",
    answer: <>For the same principal and tenure, a higher interest rate generally results in a higher EMI and a larger total repayment. Compare the lender's offered rate and understand whether it is fixed or floating.</>,
  },
  {
    question: "Does the EMI calculator include the down payment?",
    answer: <>No. The calculator estimates repayments on the <strong>loan amount you enter</strong>. A down payment is typically the portion of the property price you pay from your own funds and is not part of the loan principal entered here.</>,
  },
  {
    question: "Are processing fees and other charges included in the EMI?",
    answer: <>No. This estimate is based on principal, interest rate and tenure. Processing fees, legal or valuation charges, insurance, taxes and other lender-specific costs are not included unless they are added to the financed loan amount.</>,
  },
  {
    question: "Can my EMI change during the loan tenure?",
    answer: <>It can. With a floating-rate home loan, a change in the applicable interest rate may affect the EMI, the remaining tenure or both, depending on the lender's terms and the repayment arrangement.</>,
  },
  {
    question: "Can I use this calculator to decide how much home loan I can afford?",
    answer: <>You can use it to compare estimated repayments against your monthly budget. However, affordability also depends on income, existing obligations, household expenses, savings, lender eligibility criteria and other costs of owning a property.</>,
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(null);

  return (
    <section className="bg-[#faf8f3]">
      <div className="mx-auto max-w-[1450px] px-5 pb-16 pt-6 xl:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-[#D4AF37]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B58B2D]">Helpful Information</span>
            </div>
            <h2 id="emi-calculator-faq-heading" className="font-playfair text-[30px] leading-tight text-[#10251f] md:text-[36px]">Frequently Asked Questions</h2>
            <p className="mt-3 max-w-[680px] text-[13px] leading-6 text-[#777] md:text-[14px]">
              Find answers to common questions about <strong className="font-semibold text-[#4d4d4d]">home loan EMIs</strong>, repayment periods, interest rates and estimated borrowing costs.
            </p>
          </div>

          <a href="#emi-calculator-heading" className="group hidden shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#17382e] transition hover:text-[#B58B2D] sm:flex">
            Back to Calculator <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        <div className="mt-7 h-px w-full bg-[#e5dfd2]" />

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {faqs.map((faq, index) => {
            const isOpen = open === index;
            return (
              <div key={faq.question} className={`group overflow-hidden rounded-[14px] border bg-white transition-all duration-300 ${isOpen ? "border-[#D4AF37]/50 shadow-[0_15px_45px_rgba(0,0,0,0.06)]" : "border-[#e4ddd1] hover:border-[#D4AF37]/40 hover:shadow-[0_10px_35px_rgba(0,0,0,0.04)]"}`}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : index)} className="flex w-full items-center gap-4 px-5 py-5 text-left md:px-6">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 ${isOpen ? "bg-[#D4AF37] text-[#10251f]" : "bg-[#f5f1e8] text-[#B58B2D]"}`}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={`flex-1 text-[13px] font-semibold leading-5 transition-colors duration-300 ${isOpen ? "text-[#10251f]" : "text-[#292929]"}`}>{faq.question}</span>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? "rotate-180 border-[#D4AF37] bg-[#D4AF37] text-[#10251f]" : "border-[#e5dfd2] bg-[#faf8f3] text-[#17382e] group-hover:border-[#D4AF37]"}`}><ChevronDown size={15} /></span>
                </button>
                <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="mx-5 h-px bg-[#eee8dc] md:mx-6" />
                    <div className="px-5 pb-6 pt-4 md:px-6">
                      <p className="max-w-[680px] text-[12px] leading-7 text-[#686868] md:text-[13px]">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-[14px] border border-[#e5dfd2] bg-white px-5 py-4 md:px-6">
          <p className="text-[11px] leading-6 text-[#777] md:text-[12px]">
            <strong className="font-semibold text-[#17382e]">Important:</strong> EMI figures are indicative estimates and are not an approval, sanction or offer of credit. Confirm the applicable interest rate, charges, eligibility and repayment terms directly with your lender before taking a loan.
          </p>
        </div>
      </div>
    </section>
  );
}
