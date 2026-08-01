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

export default function Values() {
  return (
    <section className="relative overflow-hidden bg-[#FBF9F5] py-28">

      {/* Soft Luxury Background */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #d4af37 0, transparent 35%), radial-gradient(circle at 80% 70%, #d4af37 0, transparent 35%)",
        }}
      />

      <div className="relative max-w-[1380px] mx-auto px-8 lg:px-16 xl:px-20">

        <div className="grid lg:grid-cols-[360px_1fr] gap-20">

          {/* LEFT */}

          <div className="pt-8">

            <p className="uppercase tracking-[0.38em] text-[12px] font-semibold text-[#C8A85D]">
              OUR VALUES
            </p>

            <h2 className="mt-5 font-playfair text-[50px] leading-[1.12] text-[#222]">
              The Principles That
              <br />
              Guide Us
            </h2>

            <div className="w-14 h-[2px] bg-[#C8A85D] mt-8" />

          </div>

          {/* RIGHT */}

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-14">

            {values.map((item, index) => {
              const Icon = item.icon;

              return (

                <div
                  key={index}
                  className="group"
                >

                  {/* Icon */}

                  <div
                    className="
                      w-16
                      h-16
                      rounded-full
                      border
                      border-[#B8A57A]
                      flex
                      items-center
                      justify-center
                      transition-all
                      duration-300
                      group-hover:border-[#D4AF37]
                      group-hover:bg-white
                    "
                  >
                    <Icon
                      size={24}
                      strokeWidth={1.6}
                      className="text-[#575757]"
                    />
                  </div>

                  {/* Title */}

                  <h3 className="mt-5 text-[26px] font-playfair text-[#222]">
                    {item.title}
                  </h3>

                  {/* Description */}

                  <p className="mt-3 text-[15px] leading-8 text-[#666] max-w-[240px]">
                    {item.description}
                  </p>

                </div>

              );
            })}

          </div>

        </div>

      </div>

    </section>
  );
}