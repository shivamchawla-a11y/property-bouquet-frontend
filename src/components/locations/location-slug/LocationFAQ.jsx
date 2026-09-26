"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function LocationFAQ({
  locationName,
  properties = [],
  pageContent,
}) {
  // ============================================================
  // ADMIN CUSTOM CONTENT
  // ============================================================

  const customContent = pageContent?.faq || {};

  const customEyebrow =
    typeof customContent?.eyebrow === "string" &&
    customContent.eyebrow.trim()
      ? customContent.eyebrow.trim()
      : "PROPERTY BUYER QUESTIONS";

  const customTitle =
    typeof customContent?.title === "string" &&
    customContent.title.trim()
      ? customContent.title.trim()
      : `Common Questions About ${locationName}`;

  const customDescription =
    typeof customContent?.description === "string" &&
    customContent.description.trim()
      ? customContent.description.trim()
      : `Explore answers to common questions about buying property in ${locationName}, including property types, pricing, investment considerations and how to compare available projects.`;

  // ============================================================
  // DEFAULT FAQS
  // ============================================================

  const defaultFaqs = [
    {
      question: `What types of properties are available in ${locationName}?`,
      answer: `${locationName} may offer a range of residential and, depending on the local market, commercial property formats. Available inventory can include apartments, independent floors, plots and other configurations. Options vary by project, so buyers should review each property's configuration, specifications, location and applicable terms.`,
    },

    {
      question: `What is the property price range in ${locationName}?`,
      answer: `Property prices in ${locationName} vary based on the project, developer, property type, configuration, size, specifications, location and stage of development. Pricing displayed on Property Bouquet reflects the information available for listed projects, while current inventory and final commercial terms should be confirmed with the respective advisor.`,
    },

    {
      question: `What should I consider before buying property in ${locationName}?`,
      answer: `Buyers can consider connectivity, surrounding infrastructure, project approvals and documentation, developer credentials, construction status, amenities, configuration, maintenance requirements and the property's suitability for their intended use. The location should always be evaluated together with the fundamentals of the individual project.`,
    },

    {
      question: `Is ${locationName} suitable for end-use homebuyers?`,
      answer: `Suitability depends on an individual's lifestyle, commute, family requirements, preferred property type and budget. Buyers exploring ${locationName} can also consider access to education, healthcare, retail, leisure destinations and major transport corridors when selecting a home.`,
    },

    {
      question: `Is ${locationName} suitable for property investment?`,
      answer: `Investment considerations can include entry price, rental and end-user demand, available supply, infrastructure development, project quality, liquidity and the intended investment horizon. Market conditions can change over time, so each property should be evaluated against the buyer's individual objectives and risk considerations.`,
    },

    {
      question: `How can I find the right property in ${locationName}?`,
      answer: `Start by defining your preferred property type, configuration, budget and intended use. You can then compare projects, developers, locations, amenities and available pricing before discussing current inventory and suitability with a Property Bouquet advisor.`,
    },

    {
      question: `How many properties are currently listed in ${locationName}?`,
      answer: `The Property Bouquet collection currently contains ${
        properties.length || 0
      } project${
        properties.length === 1 ? "" : "s"
      } associated with this location page. Inventory can change as projects are added, updated, sold or become unavailable.`,
    },

    {
      question: `Can Property Bouquet help me compare properties in ${locationName}?`,
      answer: `Yes. Property Bouquet can help buyers understand differences between available projects, configurations, locations, developers and pricing information, making it easier to create a shortlist based on their stated requirements.`,
    },
  ];

  // ============================================================
  // ADMIN FAQ ITEMS
  // ============================================================

  const customFaqs = Array.isArray(customContent?.items)
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
            item.question &&
            item.answer
        )
    : [];

  // ============================================================
  // FINAL FAQ DATA
  // ============================================================

  const faqs =
    customFaqs.length > 0
      ? customFaqs
      : defaultFaqs;

  // ============================================================
  // OPEN FAQ
  // ============================================================

  const [openIndex, setOpenIndex] = useState(0);

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
        py-16
        sm:py-18
        md:py-20
        lg:py-24
      "
    >
      <div
        className="
          mx-auto
          max-w-[1380px]
          px-5
          sm:px-7
          lg:px-10
        "
      >
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div
          className="
            mx-auto
            max-w-[900px]
            text-center
          "
        >
          {/* EYEBROW */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.24em]
              text-[#8F7335]
              sm:text-[11px]
            "
          >
            <span className="h-px w-8 bg-[#C89D58]" />

            <span>{customEyebrow}</span>

            <span className="h-px w-8 bg-[#C89D58]" />
          </div>

          {/* TITLE */}

          <h2
            id="faq-heading"
            className="
              mt-4
              font-playfair
              text-[34px]
              font-medium
              leading-[1.08]
              tracking-[-0.025em]
              text-[#17342d]
              sm:text-[39px]
              md:text-[44px]
              lg:text-[48px]
            "
          >
            {customTitle}
          </h2>

          {/* GOLD ACCENT */}

          <div
            className="
              mx-auto
              mt-5
              h-[2px]
              w-16
              bg-[#C89D58]
            "
          />

          {/* DESCRIPTION */}

          <p
            className="
              mx-auto
              mt-5
              max-w-[760px]
              text-[13px]
              leading-[1.85]
              text-[#626963]
              sm:text-[14px]
              md:text-[15px]
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
            mx-auto
            mt-12
            grid
            max-w-[1160px]
            gap-x-14
            md:grid-cols-2
            lg:gap-x-20
          "
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={`${faq.question || "faq"}-${index}`}
                className="
                  group
                  border-b
                  border-[#ded7cc]
                "
              >
                {/* ==================================================
                    QUESTION
                ================================================== */}

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
                    gap-7
                    py-6
                    text-left
                    transition-all
                    duration-200
                  "
                >
                  {/* QUESTION TEXT */}

                  <span
                    className={`
                      max-w-[calc(100%-50px)]
                      text-[14px]
                      font-semibold
                      leading-[1.55]
                      transition-colors
                      duration-200
                      sm:text-[15px]
                      md:text-[16px]
                      ${
                        isOpen
                          ? "text-[#8F7335]"
                          : "text-[#17342d] group-hover:text-[#8F7335]"
                      }
                    `}
                  >
                    {faq.question}
                  </span>

                  {/* PLUS / MINUS */}

                  <span
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      transition-all
                      duration-300
                      ${
                        isOpen
                          ? "border-[#C89D58] bg-[#C89D58] text-white"
                          : "border-[#d8d0c3] bg-[#faf8f4] text-[#8F7335] group-hover:border-[#C89D58] group-hover:bg-[#fffaf1]"
                      }
                    `}
                  >
                    {isOpen ? (
                      <Minus
                        size={15}
                        strokeWidth={1.8}
                      />
                    ) : (
                      <Plus
                        size={15}
                        strokeWidth={1.8}
                      />
                    )}
                  </span>
                </button>

                {/* ==================================================
                    ANSWER
                ================================================== */}

                <div
                  id={`faq-answer-${index}`}
                  hidden={!isOpen}
                  className="
                    max-w-[680px]
                    pb-6
                    pr-10
                  "
                >
                  <p
                    className="
                      text-[12.5px]
                      leading-[1.9]
                      text-[#69716c]
                      sm:text-[13px]
                      md:text-[14px]
                    "
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ======================================================
            BOTTOM TRUST NOTE
        ====================================================== */}

        <div
          className="
            mx-auto
            mt-12
            flex
            max-w-[1160px]
            items-center
            justify-center
            gap-3
            border-t
            border-[#eee8df]
            pt-7
            text-center
          "
        >
          <span className="h-px w-6 bg-[#C89D58]" />

          <p
            className="
              text-[10px]
              leading-5
              text-[#8a908b]
              sm:text-[11px]
            "
          >
            Property information, availability and pricing may change.
            Please verify current project details before making a decision.
          </p>

          <span className="h-px w-6 bg-[#C89D58]" />
        </div>
      </div>
    </section>
  );
}