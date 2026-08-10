"use client";

import { useState } from "react";
import {
  ChevronDown,
  ArrowRight,
} from "lucide-react";

const faqs = [
  {
    question: "How do I convert square feet to square yards?",
    answer: (
      <>
        To convert <strong>square feet (sq ft)</strong> to square yards (sq yd),
        divide the total area in square feet by <strong>9</strong>.
        For example, <strong>900 sq ft = 100 sq yd</strong>.
      </>
    ),
  },

  {
    question: "How many square feet are there in an acre?",
    answer: (
      <>
        One <strong>acre</strong> is equal to <strong>43,560 square feet</strong>.
        This is one of the most commonly used land-area conversions when
        comparing larger residential, agricultural, or investment properties.
      </>
    ),
  },

  {
    question: "How many square yards are there in one square foot?",
    answer: (
      <>
        One square foot is equal to approximately{" "}
        <strong>0.1111 square yards</strong>. To convert square feet into
        square yards, simply <strong>divide the area by 9</strong>.
      </>
    ),
  },

  {
    question: "What is the difference between Guntha (Pune) and Guntha (Nagpur)?",
    answer: (
      <>
        The commonly used conversion values for <strong>Guntha</strong> can
        differ by region. This calculator provides separate references for{" "}
        <strong>Guntha (Pune)</strong> and <strong>Guntha (Nagpur)</strong> to
        make regional land-area calculations easier.
      </>
    ),
  },

  {
    question: "How many square feet are there in one square yard?",
    answer: (
      <>
        <strong>1 square yard = 9 square feet.</strong> This is a standard
        conversion and is particularly useful when comparing property sizes
        quoted in different units.
      </>
    ),
  },

  {
    question: "Why is area conversion important in real estate?",
    answer: (
      <>
        Area conversion helps buyers and investors{" "}
        <strong>compare property sizes</strong>, evaluate pricing, understand
        property documentation, and make more informed real estate decisions.
        It is especially useful when properties are advertised using different
        measurement units.
      </>
    ),
  },

  {
    question: "Which area units are commonly used in Indian real estate?",
    answer: (
      <>
        Commonly used units include <strong>square feet, square yards,
        square metres, acres, hectares, bigha, guntha, and cents</strong>.
        The preferred unit can vary depending on the state, location, and type
        of property.
      </>
    ),
  },

  {
    question: "Can I use an area converter for property buying decisions?",
    answer: (
      <>
        Yes. An area converter can help you{" "}
        <strong>compare property sizes and measurements</strong> across
        listings. However, always verify the final area and unit mentioned in
        the property's <strong>official documents, RERA records, or sale
        agreement</strong> before making a purchase decision.
      </>
    ),
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(null);

  return (
    <section className="bg-[#faf8f3]">
      <div className="mx-auto max-w-[1450px] px-5 pb-16 pt-6 xl:px-8">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-[#D4AF37]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B58B2D]">
                Helpful Information
              </span>
            </div>

            <h2
              className="
                font-playfair
                text-[30px]
                leading-tight
                text-[#10251f]
                md:text-[36px]
              "
            >
              Frequently Asked Questions
            </h2>

            <p
              className="
                mt-3
                max-w-[680px]
                text-[13px]
                leading-6
                text-[#777]
                md:text-[14px]
              "
            >
              Find quick answers to common questions about{" "}
              <strong className="font-semibold text-[#4d4d4d]">
                property area conversion
              </strong>
              , land measurement units, and real estate calculations.
            </p>
          </div>

          {/* VIEW ALL */}

          <button
            type="button"
            className="
              group
              hidden
              shrink-0
              items-center
              gap-2
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-[#17382e]
              transition
              hover:text-[#B58B2D]
              sm:flex
            "
          >
            View All FAQs

            <ArrowRight
              size={14}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </button>
        </div>

        {/* GOLD DIVIDER */}

        <div className="mt-7 h-px w-full bg-[#e5dfd2]" />

        {/* ================= FAQ GRID ================= */}

        <div className="mt-7 grid gap-4 md:grid-cols-2">

          {faqs.map((faq, index) => {
            const isOpen = open === index;

            return (
              <div
                key={faq.question}
                className={`
                  group
                  overflow-hidden
                  rounded-[14px]
                  border
                  bg-white
                  transition-all
                  duration-300
                  ${
                    isOpen
                      ? "border-[#D4AF37]/50 shadow-[0_15px_45px_rgba(0,0,0,0.06)]"
                      : "border-[#e4ddd1] hover:border-[#D4AF37]/40 hover:shadow-[0_10px_35px_rgba(0,0,0,0.04)]"
                  }
                `}
              >

                {/* QUESTION */}

                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpen(isOpen ? null : index)
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-4
                    px-5
                    py-5
                    text-left
                    md:px-6
                  "
                >

                  {/* NUMBER */}

                  <span
                    className={`
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      text-[10px]
                      font-bold
                      transition-all
                      duration-300
                      ${
                        isOpen
                          ? "bg-[#D4AF37] text-[#10251f]"
                          : "bg-[#f5f1e8] text-[#B58B2D]"
                      }
                    `}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* QUESTION TEXT */}

                  <span
                    className={`
                      flex-1
                      text-[13px]
                      font-semibold
                      leading-5
                      transition-colors
                      duration-300
                      ${
                        isOpen
                          ? "text-[#10251f]"
                          : "text-[#292929]"
                      }
                    `}
                  >
                    {faq.question}
                  </span>

                  {/* ICON */}

                  <span
                    className={`
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      transition-all
                      duration-300
                      ${
                        isOpen
                          ? "rotate-180 border-[#D4AF37] bg-[#D4AF37] text-[#10251f]"
                          : "border-[#e5dfd2] bg-[#faf8f3] text-[#17382e] group-hover:border-[#D4AF37]"
                      }
                    `}
                  >
                    <ChevronDown size={15} />
                  </span>

                </button>

                {/* ANSWER */}

                <div
                  className={`
                    grid
                    transition-[grid-template-rows,opacity]
                    duration-300
                    ease-in-out
                    ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                  `}
                >
                  <div className="overflow-hidden">

                    <div className="mx-5 h-px bg-[#eee8dc] md:mx-6" />

                    <div className="px-5 pb-6 pt-4 md:px-6">

                      <p
                        className="
                          max-w-[680px]
                          text-[12px]
                          leading-7
                          text-[#686868]
                          md:text-[13px]
                        "
                      >
                        {faq.answer}
                      </p>

                    </div>

                  </div>
                </div>

              </div>
            );
          })}

        </div>

        {/* ================= BOTTOM NOTE ================= */}

        <div
          className="
            mt-8
            rounded-[14px]
            border
            border-[#e5dfd2]
            bg-white
            px-5
            py-4
            md:px-6
          "
        >
          <p className="text-[11px] leading-6 text-[#777] md:text-[12px]">
            <strong className="font-semibold text-[#17382e]">
              Important:
            </strong>{" "}
            Area measurements may vary depending on local conventions and
            documentation. Always verify the{" "}
            <strong className="font-semibold text-[#4d4d4d]">
              official measurement
            </strong>{" "}
            mentioned in the relevant property documents before making a
            transaction.
          </p>
        </div>

      </div>
    </section>
  );
}