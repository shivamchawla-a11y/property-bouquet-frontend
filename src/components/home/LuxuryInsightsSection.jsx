
"use client";

import KnowledgeSection from "../home/luxury/KnowledgeSection";
import NewsInsightSection from "../home/luxury/NewsInsightSection";
import AdvisorySection from "../home/luxury/AdvisorySection";
import ToolsSection from "./luxury/ToolsSection";

export default function LuxuryInsightsSection({
  onConsultationClick,
}) {
  return (
    <section className="bg-[#f6f3ee]">

      {/* Knowledge */}
      <div className="py-24">
        <KnowledgeSection />
      </div>

      {/* News */}
      <div className="py-10">
        <NewsInsightSection />
      </div>

      {/* Tools */}
      <ToolsSection />

      {/* Advisory */}
      <div className="bg-[#f7f4ee] py-28 pb-36">
        <AdvisorySection
          onConsultationClick={onConsultationClick}
        />
      </div>

    </section>
  );
}
