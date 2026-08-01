"use client";

import {
  Gem,
  Users,
  BriefcaseBusiness,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function WhoWeAre() {
  return (
    <section className="bg-[#F8F5F0] py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-[420px_1fr] gap-14 lg:gap-16 items-start">

          {/* LEFT */}

          <div className="pt-0 lg:pt-8">

            <p className="text-[#C7A15A] uppercase tracking-[0.38em] text-[11px] md:text-[12px] font-semibold">
              WHO WE ARE
            </p>

            <h2 className="mt-4 md:mt-5 font-playfair text-[36px] md:text-[44px] lg:text-[52px] leading-[1.12] text-[#222]">
              A Brand Built on
              <br />
              Trust. Driven by Purpose.
            </h2>

            <div className="w-12 md:w-14 h-[2px] bg-[#C7A15A] mt-6 md:mt-8 mb-8 md:mb-10" />

            <p className="text-[#666] text-[15px] md:text-[16px] leading-8 md:leading-9">
              Property Bouquet is a luxury real estate advisory platform
              curated for the discerning. We bring together the finest
              properties, market intelligence, and expert guidance to help
              you make confident real estate decisions.
            </p>

            <p className="text-[#666] text-[15px] md:text-[16px] leading-8 md:leading-9 mt-6 md:mt-8">
              Backed by years of experience and deep market understanding,
              we go beyond transactions—we build lasting relationships.
            </p>

            <button className="mt-8 md:mt-10 bg-[#07281F] hover:bg-[#093328] transition px-7 md:px-8 py-3.5 md:py-4 text-white flex items-center gap-3 rounded-sm">
              Our Story
              <ArrowRight size={17} />
            </button>

          </div>

          {/* RIGHT */}

          <div className="relative pb-36 md:pb-28">

            {/* Decorative Border */}

            <div className="hidden lg:block absolute top-5 right-5 w-full h-full border border-[#D4AF37]/35 -z-10" />

            {/* Image */}

            <img
              src="/about/who-we-are.png"
              alt="Who We Are"
              className="
                w-full
                h-[280px]
                sm:h-[360px]
                lg:h-[430px]
                object-cover
              "
            />

            {/* Floating Stats */}

            <div
              className="
                absolute
                left-1/2
                -translate-x-1/2
                -bottom-20
                md:-bottom-14
                w-[94%]
                md:w-[92%]
                bg-[#06271F]
                grid
                grid-cols-2
                lg:grid-cols-4
              "
            >

              <Stat
                icon={<Gem size={20} />}
                value="5+"
                label="Years of Trust"
              />

              <Stat
                icon={<Users size={20} />}
                value="1000+"
                label="Families Served"
              />

              <Stat
                icon={<BriefcaseBusiness size={20} />}
                value="₹1000+ Cr"
                label="Advisory Value"
              />

              <Stat
                icon={<ShieldCheck size={20} />}
                value="50+"
                label="Premium Projects"
              />

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div
      className="
        relative
        py-6
        md:py-8
        px-3
        text-center
        border-[#D4AF37]/12
        border-b
        border-r
        lg:border-b-0
        even:border-r-0
        lg:even:border-r
        lg:last:border-r-0
      "
    >

      <div className="text-[#C7A15A] flex justify-center mb-3 md:mb-4">
        {icon}
      </div>

      <div className="text-white text-[28px] md:text-[36px] lg:text-[42px] font-semibold leading-none">
        {value}
      </div>

      <div className="text-white/70 mt-2 md:mt-3 text-[12px] md:text-[13px] lg:text-[14px] leading-5">
        {label}
      </div>

    </div>
  );
}