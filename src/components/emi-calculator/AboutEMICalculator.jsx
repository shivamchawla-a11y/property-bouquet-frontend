"use client";

import {
  CheckCircle2,
  Wallet,
  Percent,
  CalendarDays,
  History,
  Building2,
  ShieldCheck,
  Landmark,
} from "lucide-react";

const factors = [
  {
    icon: Wallet,
    title: "Loan Amount",
    short: "Principal",
    description: "The amount borrowed from the lender. A higher principal generally results in a higher monthly EMI when the rate and tenure stay the same.",
    detail: "Your down payment reduces the amount you need to finance. Consider other purchase costs separately when planning your budget.",
  },
  {
    icon: Percent,
    title: "Interest Rate",
    short: "Rate",
    description: "The annual rate charged by the lender. Even a small rate difference can affect the EMI and the total interest paid over a long tenure.",
    detail: "The rate offered may depend on the lender, loan product, credit profile and prevailing lending terms.",
  },
  {
    icon: CalendarDays,
    title: "Loan Tenure",
    short: "Duration",
    description: "The period over which the loan is repaid. A longer tenure usually reduces the monthly EMI but can increase the total interest paid.",
    detail: "Compare monthly affordability with the overall repayment cost before selecting a repayment period.",
  },
];

export default function AboutEMICalculator() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1450px] px-5 pb-16 xl:px-8">
        {/* MAIN INTRO CARD */}
        <div className="relative overflow-hidden rounded-[24px] border border-[#e8e0d2] bg-[#f7f3eb] shadow-[0_15px_60px_rgba(0,0,0,0.04)]">
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-[380px] w-[380px] rounded-full bg-[#D4AF37]/10 blur-[100px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-32 h-[320px] w-[320px] rounded-full bg-[#17382e]/5 blur-[90px]" />

          <div className="relative z-10 p-6 md:p-9 lg:p-11">
            <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-9 bg-[#D4AF37]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B58B2D]">Home Loan Planning Guide</span>
                </div>

                <h2 id="about-emi-calculator-heading" className="mt-5 font-playfair text-[30px] leading-[1.15] text-[#10251f] md:text-[38px]">
                  What is a <span className="text-[#B58B2D]">Home Loan EMI?</span>
                </h2>
                <div className="mt-5 h-[2px] w-20 bg-[#D4AF37]" />

                <p className="mt-6 max-w-[720px] text-[13px] leading-7 text-[#666] md:text-[14px] md:leading-8">
                  EMI stands for <strong className="font-semibold text-[#17382e]">Equated Monthly Instalment</strong>. It is the fixed periodic payment a borrower makes to repay a loan over an agreed tenure. Each instalment includes a portion of the principal amount and the interest charged by the lender.
                </p>
                <p className="mt-4 max-w-[720px] text-[13px] leading-7 text-[#666] md:text-[14px] md:leading-8">
                  A home loan EMI calculator helps you estimate the monthly repayment using the <strong className="font-semibold text-[#17382e]">loan amount, annual interest rate and repayment tenure</strong>. It can help you compare scenarios and assess whether a potential loan fits your property budget before you proceed with a lender.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    "Estimate monthly repayment obligations",
                    "Compare different loan tenures",
                    "Understand total interest costs",
                    "Plan a more informed property budget",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-xl border border-[#e6dece] bg-white/70 px-4 py-3">
                      <CheckCircle2 size={16} className="shrink-0 text-[#B58B2D]" />
                      <span className="text-[11px] font-medium text-[#555]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUICK REFERENCE CARD */}
              <div className="rounded-[20px] border border-[#e5dccb] bg-white p-6 shadow-[0_15px_50px_rgba(0,0,0,0.05)] md:p-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#17382e] text-[#D4AF37]"><CalculatorIcon /></div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B58B2D]">Quick Reference</p>
                    <h3 className="mt-1 text-[21px] font-semibold text-[#17382e]">What goes into EMI?</h3>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    ["P", "Principal loan amount"],
                    ["R", "Monthly interest rate"],
                    ["N", "Total monthly instalments"],
                  ].map(([symbol, meaning]) => (
                    <div key={symbol} className="flex items-center gap-3 rounded-xl bg-[#f8f5ee] px-4 py-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white font-serif text-[16px] font-semibold text-[#17382e]">{symbol}</span>
                      <span className="text-[12px] font-medium text-[#555]">{meaning}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-[#eadfc9] bg-[#faf7f0] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8a7552]">Standard EMI Formula</p>
                  <p className="mt-2 break-words font-serif text-[19px] leading-8 text-[#17382e]">EMI = P × R × (1 + R)<sup>N</sup> / ((1 + R)<sup>N</sup> − 1)</p>
                  <p className="mt-2 text-[10px] leading-5 text-[#888]">R is the monthly rate expressed as a decimal, and N is the number of monthly instalments.</p>
                </div>
                <p className="mt-5 text-[10px] leading-5 text-[#888]">The calculator provides an estimate. Lender-specific fees, insurance, rate changes and loan conditions may affect your actual repayment.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FACTORS */}
        <div className="mt-12">
          <div className="max-w-[780px]">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-[#D4AF37]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B58B2D]">Understanding Your Repayment</span>
            </div>
            <h2 className="mt-4 font-playfair text-[29px] leading-tight text-[#10251f] md:text-[35px]">The three factors that shape your <span className="text-[#B58B2D]">home loan EMI</span></h2>
            <p className="mt-4 text-[13px] leading-7 text-[#777] md:text-[14px]">Your monthly instalment is determined primarily by the amount borrowed, the applicable interest rate and the time allowed for repayment. Changing any one of these inputs can change the overall loan cost.</p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {factors.map((factor) => {
              const Icon = factor.icon;
              return (
                <div key={factor.title} className="group rounded-[18px] border border-[#e7dfd1] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f1e8] text-[#B58B2D] transition duration-300 group-hover:bg-[#17382e] group-hover:text-[#D4AF37]"><Icon size={20} /></div>
                    <span className="rounded-full bg-[#f5f1e8] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8b6b2d]">{factor.short}</span>
                  </div>
                  <h3 className="mt-5 font-playfair text-[22px] text-[#17382e]">{factor.title}</h3>
                  <p className="mt-3 text-[12px] leading-6 text-[#666]">{factor.description}</p>
                  <div className="mt-5 border-t border-[#eee8dc] pt-4">
                    <div className="flex items-start gap-2">
                      <History size={14} className="mt-0.5 shrink-0 text-[#B58B2D]" />
                      <p className="text-[10px] leading-5 text-[#888]"><strong className="font-semibold text-[#555]">Planning point:</strong> {factor.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* IMPORTANT NOTE */}
        <div className="relative mt-10 overflow-hidden rounded-[18px] bg-[#17382e] px-6 py-7 md:px-8">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-[220px] w-[220px] rounded-full bg-[#D4AF37]/10 blur-[70px]" />
          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[900px]">
              <div className="flex items-center gap-3">
                <ShieldCheck size={17} className="text-[#D4AF37]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Important Before You Borrow</span>
              </div>
              <h3 className="mt-3 font-playfair text-[23px] text-white md:text-[27px]">An EMI estimate is not a loan offer.</h3>
              <p className="mt-3 max-w-[850px] text-[11px] leading-6 text-white/65 md:text-[12px]">The final interest rate, eligibility, processing charges, insurance requirements and repayment terms are determined by the lender. Floating-rate changes and prepayments can also affect the repayment schedule. Review the lender's official offer and loan agreement before making a commitment.</p>
            </div>
            <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 md:flex">
              <Landmark size={30} strokeWidth={1.4} className="text-[#D4AF37]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CalculatorIcon() {
  return <Building2 size={22} />;
}
