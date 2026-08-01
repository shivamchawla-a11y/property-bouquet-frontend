"use client";

import {
  ShieldCheck,
  Star,
  Users,
  Lightbulb,
  Lock,
  Leaf,
} from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "We believe in honesty, transparency, and doing what's right.",
  },
  {
    icon: Star,
    title: "Excellence",
    description:
      "We are committed to the highest standards in every interaction.",
  },
  {
    icon: Users,
    title: "Client First",
    description:
      "Our clients' goals and satisfaction are at the heart of everything.",
  },
  {
    icon: Lightbulb,
    title: "Insight Driven",
    description:
      "We use data, research, and market intelligence to deliver better outcomes.",
  },
  {
    icon: Lock,
    title: "Discretion",
    description:
      "We value privacy and handle every client relationship with care.",
  },
  {
    icon: Leaf,
    title: "Long Term",
    description:
      "We build lasting relationships based on trust, value and mutual growth.",
  },
];

export default function ValuesMobile() {
  return (
    <section className="relative overflow-hidden bg-[#F8F5EF] py-20">

      {/* Background Glow */}

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 25%, #d4af37 0, transparent 35%), radial-gradient(circle at 80% 80%, #d4af37 0, transparent 35%)",
        }}
      />

      <div className="relative px-6">

        {/* Heading */}

        <div className="text-center">

          <p className="uppercase tracking-[0.34em] text-[11px] font-semibold text-[#C8A85D]">
            OUR VALUES
          </p>

          <h2 className="mt-5 font-playfair text-[36px] leading-[1.15] text-[#222]">
            The Principles
            <br />
            That Guide Us
          </h2>

          <div className="flex justify-center items-center mt-6">

            <div className="w-10 h-px bg-[#C8A85D]" />

            <div className="w-2 h-2 rotate-45 bg-[#C8A85D] mx-3" />

            <div className="w-10 h-px bg-[#C8A85D]" />

          </div>

        </div>

        {/* Cards */}

        <div className="mt-14 space-y-5">

          {values.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  bg-white/80
                  backdrop-blur-sm
                  rounded-[26px]
                  border
                  border-[#E8DDC2]
                  px-6
                  py-7
                  shadow-[0_12px_35px_rgba(0,0,0,0.05)]
                "
              >
                <div className="flex items-start gap-5">

                  <div
                    className="
                      w-16
                      h-16
                      rounded-full
                      border
                      border-[#D4AF37]/40
                      bg-[#FAF7F1]
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    <Icon
                      size={26}
                      strokeWidth={1.6}
                      className="text-[#C8A85D]"
                    />
                  </div>

                  <div>

                    <h3 className="font-playfair text-[26px] text-[#222]">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-[15px] leading-7 text-[#666]">
                      {item.description}
                    </p>

                  </div>

                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}