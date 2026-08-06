"use client";

import { CalendarDays, ArrowRight } from "lucide-react";

export default function ConsultationBanner() {
  return (
    <section className="bg-[#F8F5EF] pb-24">

      <div className="max-w-[1450px] mx-auto px-10 lg:px-16">

        <div
          className="
            relative
            overflow-hidden
            rounded-[22px]
            border
            border-[#17473A]
            bg-[#041E19]
            px-10
            py-8
            flex
            items-center
            justify-between
            shadow-[0_18px_50px_rgba(0,0,0,.12)]
          "
        >

          {/* Glow */}

          <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-[#C89B4F]/8 blur-[120px]" />

          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:34px_34px]" />

          {/* LEFT */}

          <div className="relative z-10 flex items-center gap-6">

            <div
              className="
                w-[62px]
                h-[62px]
                rounded-full
                border
                border-[#C89B4F]/30
                bg-[#072821]
                flex
                items-center
                justify-center
                text-[#C89B4F]
                shrink-0
              "
            >
              <CalendarDays
                size={26}
                strokeWidth={1.6}
              />
            </div>

            <div>

              <h3 className="font-playfair text-[32px] leading-none text-white">
                Prefer a Personal Conversation?
              </h3>

              <p className="mt-3 text-[15px] leading-7 text-white/65 max-w-[520px]">
                Schedule a one-on-one consultation with our real estate
                expert at a time that works best for you.
              </p>

            </div>

          </div>

          {/* RIGHT */}

          <button
            className="
              relative
              z-10
              group
              h-[52px]
              px-8
              rounded-md
              border
              border-[#C89B4F]
              text-[#C89B4F]
              text-[14px]
              font-medium
              flex
              items-center
              gap-4
              hover:bg-[#C89B4F]
              hover:text-[#041E19]
              transition-all
              duration-300
            "
          >

            Schedule a Consultation

            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition"
            />

          </button>

        </div>

      </div>

    </section>
  );
}