"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import HeroSection from "@/components/stamp-duty-calculator/HeroSection";
import StampDutyCalculatorTool from "@/components/stamp-duty-calculator/StampDutyCalculatorTool";
import StampDutyBreakdown from "@/components/stamp-duty-calculator/StampDutyBreakdown";
import AboutStampDutyCalculator from "@/components/stamp-duty-calculator/AboutStampDutyCalculator";
import FAQSection from "@/components/stamp-duty-calculator/FAQSection";
import OtherConverters from "@/components/stamp-duty-calculator/OtherConverters";
import StateDirectory from "@/components/stamp-duty-calculator/StateDirectory";
import { calculateStampDuty } from "@/components/stamp-duty-calculator/stampDutyUtils";
import { getStateRateConfig, INDIAN_STATES } from "@/components/stamp-duty-calculator/stampDutyRates";

export default function StampDutyCalculatorExperience({
  initialStateCode = "HR",
  stateLocked = false,
}) {
  const [agreementValue, setAgreementValue] = useState("10000000");
  const [circleRateValue, setCircleRateValue] = useState("");
  const [stateCode, setStateCode] = useState(initialStateCode);
  const [ownership, setOwnership] = useState("male");
  const [area, setArea] = useState("urban");
  const [includeMunicipalSurcharge, setIncludeMunicipalSurcharge] = useState(false);

  // Keep the selected jurisdiction in sync when navigating between state slugs.
  useEffect(() => {
    setStateCode(initialStateCode);
  }, [initialStateCode]);

  const rateConfig = useMemo(
    () => getStateRateConfig(stateCode),
    [stateCode]
  );

  const summary = useMemo(
    () =>
      calculateStampDuty({
        agreementValue,
        circleRateValue,
        stateCode,
        rateConfig,
        ownership,
        area,
        includeMunicipalSurcharge,
      }),
    [
      agreementValue,
      circleRateValue,
      stateCode,
      rateConfig,
      ownership,
      area,
      includeMunicipalSurcharge,
    ]
  );

  const selectedState = INDIAN_STATES.find(
    (state) => state.code === stateCode
  );

  function resetCalculator() {
    setAgreementValue("10000000");
    setCircleRateValue("");
    setStateCode(initialStateCode);
    setOwnership("male");
    setArea("urban");
    setIncludeMunicipalSurcharge(false);
  }

  return (
    <main className="min-h-screen bg-white text-[#10251f]">
      <Navbar />
      <HeroSection stateName={stateLocked ? selectedState?.name : null} />

      <StampDutyCalculatorTool
        agreementValue={agreementValue}
        setAgreementValue={setAgreementValue}
        circleRateValue={circleRateValue}
        setCircleRateValue={setCircleRateValue}
        stateCode={stateCode}
        setStateCode={setStateCode}
        ownership={ownership}
        setOwnership={setOwnership}
        area={area}
        setArea={setArea}
        includeMunicipalSurcharge={includeMunicipalSurcharge}
        setIncludeMunicipalSurcharge={setIncludeMunicipalSurcharge}
        onReset={resetCalculator}
        summary={summary}
        stateLocked={stateLocked}
      />

      <StampDutyBreakdown
        summary={summary}
        rateConfig={rateConfig}
        stateName={selectedState?.name || "Selected State / UT"}
        ownership={ownership}
        area={area}
      />

      {!stateLocked ? <StateDirectory /> : null}

      <AboutStampDutyCalculator />
      <FAQSection />
      <OtherConverters />
      <Footer />
    </main>
  );
}
