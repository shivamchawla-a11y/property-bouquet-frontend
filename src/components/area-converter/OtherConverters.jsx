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
description: "Calculate your monthly home loan EMI quickly and accurately.",
href: "/tools/emi-calculator",
icon: Calculator,
},
{
title: "Stamp Duty Calculator",
description:
"Estimate stamp duty and registration charges for your property.",
href: "/tools/stamp-duty-calculator",
icon: FileText,
},
{
title: "Construction Area Calculator",
description:
"Estimate carpet area, built-up area and other construction measurements.",
href: "/tools/construction-area-calculator",
icon: Landmark,
},
{
title: "ROI Calculator",
description:
"Calculate potential returns and understand your property's ROI.",
href: "/tools/roi-calculator",
icon: TrendingUp,
},
{
title: "Property Loan Eligibility",
description:
"Estimate your home loan eligibility based on your financial profile.",
href: "/tools/property-loan-eligibility",
icon: Home,
},
];

export default function OtherConverters() {
return ( <section className="w-full bg-[#faf9f6]"> <div className="mx-auto w-full max-w-[1450px] px-5 py-14 sm:px-6 md:py-16 lg:px-8 xl:px-10">
{/* ===================================================== */}
{/* SECTION HEADER */}
{/* ===================================================== */}

    <div className="max-w-[680px]">
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-[#c89d58]" />

        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[2.5px]
            text-[#b58b45]
          "
        >
          Property Tools
        </p>
      </div>

      <h2
        className="
          mt-3
          font-serif
          text-[28px]
          font-normal
          leading-[1.15]
          tracking-[-0.3px]
          text-[#10251f]
          sm:text-[30px]
          md:text-[34px]
        "
      >
        Other Useful Converters
      </h2>

      <p
        className="
          mt-3
          max-w-[620px]
          text-[12px]
          leading-6
          text-[#777]
          sm:text-[13px]
        "
      >
        Explore essential real estate calculators and tools to help you
        make smarter property and financial decisions.
      </p>
    </div>

    {/* ===================================================== */}
    {/* TOOLS GRID */}
    {/* ===================================================== */}

    <div
      className="
        mt-8
        grid
        gap-4
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-5
      "
    >
      {tools.map((tool) => {
        const Icon = tool.icon;

        return (
          <Link
            key={tool.title}
            href={tool.href}
            className="
              group
              relative
              flex
              min-h-[245px]
              flex-col
              overflow-hidden
              rounded-[14px]
              border
              border-[#e5dfd4]
              bg-white
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#c89d58]/70
              hover:shadow-[0_18px_45px_rgba(16,37,31,0.08)]
              focus:outline-none
              focus:ring-2
              focus:ring-[#c89d58]/30
            "
          >
            {/* TOP GOLD ACCENT */}

            <div
              className="
                absolute
                left-0
                top-0
                h-[2px]
                w-0
                bg-[#c89d58]
                transition-all
                duration-300
                group-hover:w-full
              "
            />

            {/* ICON */}

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-[#e0d6c5]
                bg-[#faf7f1]
                text-[#173c31]
                transition-all
                duration-300
                group-hover:border-[#c89d58]/60
                group-hover:bg-[#f7f0e3]
                group-hover:text-[#a47b37]
              "
            >
              <Icon
                size={20}
                strokeWidth={1.6}
              />
            </div>

            {/* CONTENT */}

            <div className="mt-5">
              <h3
                className="
                  text-[14px]
                  font-semibold
                  leading-5
                  text-[#161616]
                  transition-colors
                  duration-300
                  group-hover:text-[#173c31]
                "
              >
                {tool.title}
              </h3>

              <p
                className="
                  mt-2
                  min-h-[63px]
                  text-[11px]
                  leading-[1.8]
                  text-[#777]
                "
              >
                {tool.description}
              </p>
            </div>

            {/* CTA */}

            <div
              className="
                mt-auto
                flex
                items-center
                justify-between
                border-t
                border-[#eee8dc]
                pt-4
              "
            >
              <span
                className="
                  text-[11px]
                  font-semibold
                  tracking-[0.1px]
                  text-[#17382f]
                "
              >
                Calculate Now
              </span>

              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#ded5c5]
                  bg-white
                  text-[#17382f]
                  transition-all
                  duration-300
                  group-hover:border-[#c89d58]
                  group-hover:bg-[#03261e]
                  group-hover:text-white
                "
              >
                <ArrowRight
                  size={13}
                  strokeWidth={1.8}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                  "
                />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  </div>
</section>

);
}
