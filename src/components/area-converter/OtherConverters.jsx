"use client";

import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  FileText,
  Home,
  Landmark,
  TrendingUp,
} from "lucide-react";

const tools = [
  {
    title: "EMI Calculator",
    description:
      "Calculate your loan EMIs instantly.",
    href: "/tools/emi-calculator",
    icon: Calculator,
  },
  {
    title: "Stamp Duty Calculator",
    description:
      "Calculate stamp duty & registration charges.",
    href: "/tools/stamp-duty-calculator",
    icon: FileText,
  },
  {
    title: "Construction Area Calculator",
    description:
      "Estimate built-up area, carpet area and more.",
    href: "/tools/construction-area-calculator",
    icon: Landmark,
  },
  {
    title: "ROI Calculator",
    description:
      "Calculate return on investment for your property.",
    href: "/tools/roi-calculator",
    icon: TrendingUp,
  },
  {
    title: "Property Loan Eligibility",
    description:
      "Check how much loan you can get.",
    href: "/tools/property-loan-eligibility",
    icon: Home,
  },
];

export default function OtherConverters() {
  return (
    <section className="bg-[#faf9f6]">

      <div className="mx-auto max-w-[1450px] px-5 pb-14 xl:px-8">

        <h2 className="font-serif text-[27px] text-[#10251f] md:text-[31px]">
          Other Useful Converters
        </h2>

        <p className="mt-1 text-[11px] text-gray-500">
          Explore other important real estate calculators and converters.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                key={tool.title}
                href={tool.href}
                className="
                  group
                  rounded-[9px]
                  border
                  border-[#e4ddd1]
                  bg-white
                  p-5
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#c89d58]/60
                  hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]
                "
              >

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-[#d9d0c0]
                    text-[#123b30]
                  "
                >
                  <Icon size={22} strokeWidth={1.5} />
                </div>

                <h3 className="mt-5 text-[13px] font-semibold text-[#161616]">
                  {tool.title}
                </h3>

                <p className="mt-2 min-h-[42px] text-[11px] leading-5 text-gray-500">
                  {tool.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-[11px] font-medium text-[#16382e]">
                  Calculate Now

                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>

              </Link>
            );
          })}

        </div>
      </div>
    </section>
  );
}