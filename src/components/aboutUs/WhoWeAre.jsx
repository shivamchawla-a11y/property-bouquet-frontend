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
    <section className="bg-[#FBF9F4] py-24 overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-8">

        <div className="grid lg:grid-cols-[420px_1fr] gap-16 items-start">

          {/* LEFT */}

          <div className="pt-8">

            <p className="text-[#C7A15A] uppercase tracking-[0.38em] text-[12px] font-semibold">
              WHO WE ARE
            </p>

            <h2 className="mt-5 font-playfair text-[52px] leading-[1.12] text-[#222]">
              A Brand Built on
              Trust. Driven by Purpose.
            </h2>

            <div className="w-14 h-[2px] bg-[#C7A15A] mt-8 mb-10" />

            <p className="text-[#666] text-[16px] leading-9">
              Property Bouquet is a luxury real estate advisory platform
              curated for the discerning. We bring together the finest
              properties, market intelligence, and expert guidance to help
              you make confident real estate decisions.
            </p>

            <p className="text-[#666] text-[16px] leading-9 mt-8">
              Backed by years of experience and deep market understanding,
              we go beyond transactions—we build lasting relationships.
            </p>

            <button className="mt-10 bg-[#07281F] hover:bg-[#093328] transition px-8 py-4 text-white flex items-center gap-3 rounded-sm">

              Our Story

              <ArrowRight size={17} />

            </button>

          </div>

          {/* RIGHT */}

          <div className="relative">

            {/* Decorative Border */}

            <div className="absolute top-5 right-5 w-full h-full border border-[#D4AF37]/35 -z-10" />

            {/* Image */}

            <img
              src="/about/who-we-are.png"
              alt=""
              className="w-full h-[430px] object-cover"
            />

            {/* Floating Stats */}

            <div className="absolute left-1/2 -translate-x-1/2 -bottom-14 w-[92%] bg-[#06271F] grid grid-cols-4">

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
    <div className="relative py-8 text-center">

      {/* Divider */}

      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-[#D4AF37]/12 last:hidden" />

      <div className="text-[#C7A15A] flex justify-center mb-4">
        {icon}
      </div>

      <div className="text-white text-[42px] font-semibold leading-none">
        {value}
      </div>

      <div className="text-white/70 mt-3 text-[14px]">
        {label}
      </div>

    </div>
  );
}