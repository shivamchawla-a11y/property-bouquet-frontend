"use client";

import { useState } from "react";
import {
  ChevronDown,
  ArrowRight,
} from "lucide-react";

const faqs = [
  {
    question:
      "How do I convert square feet to square yards?",
    answer:
      "To convert square feet to square yards, divide the area in square feet by 9. For example, 900 sq ft equals 100 sq yd.",
  },
  {
    question:
      "How many square feet are there in an acre?",
    answer:
      "One acre is equal to 43,560 square feet.",
  },
  {
    question:
      "What is the difference between Guntha (Pune) and Guntha (Nagpur)?",
    answer:
      "The commonly used conversion values differ by region. This calculator provides separate references for Guntha (Pune) and Guntha (Nagpur).",
  },
  {
    question:
      "Why is area conversion important in real estate?",
    answer:
      "Area conversion makes it easier to compare property sizes, evaluate pricing, understand documentation and make informed real estate decisions.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(null);

  return (
    <section className="bg-[#faf9f6]">

      <div className="mx-auto max-w-[1450px] px-5 pb-14 xl:px-8">

        <div className="flex items-end justify-between">

          <div>

            <h2 className="font-serif text-[27px] text-[#10251f] md:text-[31px]">
              Frequently Asked Questions
            </h2>

          </div>

          <button
            className="
              hidden
              items-center
              gap-2
              text-[11px]
              font-medium
              text-[#17382e]
              sm:flex
            "
          >
            View All FAQs

            <ArrowRight size={14} />
          </button>

        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">

          {faqs.map((faq, index) => {
            const isOpen = open === index;

            return (
              <div
                key={faq.question}
                className="
                  overflow-hidden
                  rounded-lg
                  border
                  border-[#e4ddd1]
                  bg-white
                "
              >

                <button
                  onClick={() =>
                    setOpen(
                      isOpen ? null : index
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-4
                    px-4
                    py-4
                    text-left
                  "
                >

                  <span className="text-[12px] font-medium text-[#222]">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`
                      shrink-0
                      text-[#17382e]
                      transition-transform
                      ${isOpen ? "rotate-180" : ""}
                    `}
                  />

                </button>

                {isOpen && (
                  <div className="border-t border-[#eee8dc] px-4 pb-4 pt-3">

                    <p className="text-[11px] leading-6 text-gray-500">
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