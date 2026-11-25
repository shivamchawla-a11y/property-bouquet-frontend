"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import HeroSection from "@/components/emi-calculator/HeroSection";
import EMICalculatorTool from "@/components/emi-calculator/EMICalculatorTool";
import EMIAmortizationTable from "@/components/emi-calculator/EMIAmortizationTable";
import AboutEMICalculator from "@/components/emi-calculator/AboutEMICalculator";
import FAQSection from "@/components/emi-calculator/FAQSection";
import OtherConverters from "@/components/emi-calculator/OtherConverters";
import { calculateEMI, DEFAULT_EMI_VALUES } from "@/components/emi-calculator/emiUtils";

export default function EMICalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(DEFAULT_EMI_VALUES.loanAmount);
  const [interestRate, setInterestRate] = useState(DEFAULT_EMI_VALUES.interestRate);
  const [tenureYears, setTenureYears] = useState(DEFAULT_EMI_VALUES.tenureYears);

  const summary = useMemo(
    () => calculateEMI(loanAmount, interestRate, tenureYears),
    [loanAmount, interestRate, tenureYears]
  );

  function resetCalculator() {
    setLoanAmount(DEFAULT_EMI_VALUES.loanAmount);
    setInterestRate(DEFAULT_EMI_VALUES.interestRate);
    setTenureYears(DEFAULT_EMI_VALUES.tenureYears);
  }

  return (
    <main className="min-h-screen bg-white text-[#10251f]">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section aria-labelledby="emi-calculator-heading" className="relative">
        <HeroSection />
      </section>

      {/* EMI CALCULATOR */}
      <section aria-labelledby="emi-calculator-tool-heading" className="relative">
        <EMICalculatorTool
          loanAmount={loanAmount}
          interestRate={interestRate}
          tenureYears={tenureYears}
          onLoanAmountChange={setLoanAmount}
          onInterestRateChange={setInterestRate}
          onTenureYearsChange={setTenureYears}
          summary={summary}
          onReset={resetCalculator}
        />
      </section>

      {/* REPAYMENT SCHEDULE */}
      <section aria-labelledby="emi-repayment-schedule-heading" className="relative">
        <EMIAmortizationTable
          loanAmount={loanAmount}
          interestRate={interestRate}
          tenureYears={tenureYears}
        />
      </section>

      {/* ABOUT EMI CALCULATOR */}
      <section aria-labelledby="about-emi-calculator-heading" className="relative">
        <AboutEMICalculator />
      </section>

      {/* FAQ */}
      <section aria-labelledby="emi-calculator-faq-heading" className="relative">
        <FAQSection />
      </section>

      {/* OTHER TOOLS */}
      <OtherConverters />

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
