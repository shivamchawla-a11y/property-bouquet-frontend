"use client";

import { useState } from "react";

import {
  Plus,
  Minus,
} from "lucide-react";

export default function LocationFAQ({
  locationName,
  properties = [],
  pageContent,
}) {
  // ============================================================
  // ADMIN CUSTOM CONTENT
  // ============================================================

  const customContent =
    pageContent?.faq || {};

  const customEyebrow =
    customContent?.eyebrow?.trim() ||
    "PROPERTY BUYER QUESTIONS";

  const customTitle =
    customContent?.title?.trim() ||
    `Common Questions About ${locationName}`;

  const customDescription =
    customContent?.description?.trim() ||
    `Find answers to common questions buyers and investors may have when researching property opportunities in ${locationName}. For project-specific pricing, inventory, documentation and availability, speak with a Property Bouquet advisor.`;

  // ============================================================
  // DEFAULT FAQS
  // ============================================================

  const defaultFaqs = [
    {
      question: `What types of properties are available in ${locationName}?`,
      answer:
        `${locationName} can offer different residential and, depending on the local market, commercial property formats. The Property Bouquet collection may include apartments, independent floors, plots or other property categories depending on current inventory. Buyers should review each project's configuration, specifications, location and applicable terms individually.`,
    },
    {
      question: `What is the property price range in ${locationName}?`,
      answer:
        `Property prices in ${locationName} vary according to the project, developer, configuration, size, specifications, location within the area and development stage. Property Bouquet displays available project information where pricing has been provided, while current inventory and final commercial terms should be confirmed with an advisor.`,
    },
    {
      question: `What should I consider before buying a property in ${locationName}?`,
      answer:
        `Buyers can evaluate connectivity, surrounding infrastructure, project approvals and documentation, developer track record, construction status, amenities, configuration, maintenance considerations and the property's suitability for their intended use. A location should be assessed together with the individual project's fundamentals.`,
    },
    {
      question: `Is ${locationName} suitable for end-use homebuyers?`,
      answer:
        `Suitability depends on an individual's lifestyle, commute, family requirements, preferred property type and budget. Buyers considering ${locationName} can evaluate residential communities alongside nearby education, healthcare, retail, leisure and connectivity infrastructure before making a decision.`,
    },
    {
      question: `Is ${locationName} suitable for property investment?`,
      answer:
        `Investment suitability depends on factors such as entry price, rental or end-user demand, supply, infrastructure development, project quality, liquidity and the buyer's investment horizon. Past market performance does not guarantee future returns, so each opportunity should be evaluated on its own merits.`,
    },
    {
      question: `How can I find the right property in ${locationName}?`,
      answer:
        `Start by defining your preferred property type, configuration, budget and intended use. You can then compare available projects, locations, developers, amenities and pricing before speaking with a Property Bouquet advisor about current inventory and suitability.`,
    },
    {
      question: `How many properties are currently listed in ${locationName}?`,
      answer:
        `The Property Bouquet collection currently contains ${properties.length || 0} project${properties.length === 1 ? "" : "s"} associated with this location page. Inventory can change as projects are added, updated, sold or become unavailable.`,
    },
    {
      question: `Can Property Bouquet help me compare properties in ${locationName}?`,
      answer:
        `Yes. Property Bouquet can help buyers understand the differences between available projects, configurations, locations and pricing information so they can shortlist properties that match their stated requirements.`,
    },
  ];

  // ============================================================
  // ADMIN FAQ ITEMS
  // ============================================================

  const customFaqs = Array.isArray(
    customContent?.items
  )
    ? customContent.items
        .map((item) => ({
          question:
            typeof item?.question === "string"
              ? item.question.trim()
              : "",

          answer:
            typeof item?.answer === "string"
              ? item.answer.trim()
              : "",
        }))
        .filter(
          (item) =>
            item.question || item.answer
        )
    : [];

  // ============================================================
  // FINAL FAQ DATA
  //
  // Admin content takes priority.
  // If no valid admin FAQs exist, use the default FAQs.
  // ============================================================

  const faqs =
    customFaqs.length > 0
      ? customFaqs
      : defaultFaqs;

  // ============================================================
  // OPEN FAQ
  // ============================================================

  const [openIndex, setOpenIndex] =
    useState(0);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section
      id="faqs"
      aria-labelledby="faq-heading"
      className="
        relative
        overflow-hidden
        border-t
        border-[#e8e1d7]
        bg-white
        py-10
        sm:py-12
        md:py-14
        lg:py-16
      "
    >
      <div
        className="
          mx-auto
          max-w-[1450px]
          px-5
          sm:px-6
          lg:px-8
        "
      >
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="max-w-[850px]">
          {/* EYEBROW */}

          <div
            className="
              flex
              items-center
              gap-2
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-[#8F7335]
              sm:text-[9px]
              md:text-[10px]
            "
          >
            <span className="h-px w-7 bg-[#C89D58]" />

            {customEyebrow}
          </div>

          {/* TITLE */}

          <h2
            id="faq-heading"
            className="
              mt-2
              font-playfair
              text-[27px]
              font-medium
              leading-[1.08]
              tracking-[-0.025em]
              text-[#17342d]
              sm:text-[31px]
              md:text-[35px]
              lg:text-[39px]
            "
          >
            {customTitle}
          </h2>

          <div className="mt-3 h-[2px] w-16 bg-[#C89D58]" />

          {/* DESCRIPTION */}

          <p
            className="
              mt-4
              max-w-[800px]
              text-[10.5px]
              leading-[1.8]
              text-[#59635e]
              sm:text-[11px]
              md:text-[12px]
            "
          >
            {customDescription}
          </p>
        </div>

        {/* ======================================================
            FAQ GRID
        ====================================================== */}

        <div
          className="
            mt-6
            grid
            gap-x-8
            md:grid-cols-2
          "
        >
          {faqs.map((faq, index) => {
            const isOpen =
              openIndex === index;

            return (
              <div
                key={`${faq.question || "faq"}-${index}`}
                className="
                  border-b
                  border-[#e8e1d7]
                "
              >
                {/* QUESTION */}

                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(
                      isOpen ? -1 : index
                    )
                  }
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-5
                    py-4
                    text-left
                  "
                >
                  <span
                    className="
                      text-[9.5px]
                      font-medium
                      leading-5
                      text-[#17342d]
                      sm:text-[10px]
                    "
                  >
                    {faq.question}
                  </span>

                  <span
                    className="
                      flex
                      h-6
                      w-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#ddd4c6]
                      text-[#8F7335]
                    "
                  >
                    {isOpen ? (
                      <Minus size={11} />
                    ) : (
                      <Plus size={11} />
                    )}
                  </span>
                </button>

                {/* ANSWER */}

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    className="pb-4 pr-10"
                  >
                    <p
                      className="
                        text-[9px]
                        leading-[1.8]
                        text-[#727872]
                      "
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}