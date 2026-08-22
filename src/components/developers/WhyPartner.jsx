"use client";

import {
  ShieldCheck,
  BadgeCheck,
  FileText,
  Clock3,
  Building2,
  Handshake,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Rigorous Due\nDiligence",
  },
  {
    icon: BadgeCheck,
    title: "RERA Compliant\nProjects",
  },
  {
    icon: FileText,
    title: "Transparent\nProcess",
  },
  {
    icon: Clock3,
    title: "Timely Delivery\nFocus",
  },
  {
    icon: Building2,
    title: "Quality & Design\nExcellence",
  },
  {
    icon: Handshake,
    title: "Long-term Value\nCreation",
  },
];

export default function WhyPartner() {
  return (
    <section className="relative py-14 lg:py-16 overflow-hidden">

      <div className="relative max-w-[1380px] mx-auto px-5 lg:px-8">

        {/* Heading */}

        <div className="text-center">

          <p className="uppercase tracking-[4px] text-[10px] font-semibold text-[#C89D58]">
            WHY WE PARTNER
          </p>

          <h2 className="mt-3 font-playfair text-[#1b1b1b] text-[28px] lg:text-[42px] leading-tight">
            Because Trust Builds Better Communities
          </h2>

          <div className="flex items-center justify-center gap-2 mt-4">

            <div className="w-10 h-px bg-[#D4AF37]" />

            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />

            <div className="w-10 h-px bg-[#D4AF37]" />

          </div>

        </div>

        {/* Features */}

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">

          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  flex
                  items-center
                  justify-center
                  gap-3
                  px-5
                  py-3
                  text-left
                  border-r
                  border-[#e8dfcf]
                  last:border-r-0
                "
              >
                <Icon
                  size={28}
                  strokeWidth={1.7}
                  className="text-[#C89D58] shrink-0"
                />

                <p
                  className="
                    whitespace-pre-line
                    text-[13px]
                    leading-6
                    font-medium
                    text-[#303030]
                  "
                >
                  {item.title}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}