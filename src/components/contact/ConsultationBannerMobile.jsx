"use client";

import {
  CalendarDays,
  ArrowRight,
} from "lucide-react";

export default function ConsultationBannerMobile() {
  return (
    <section className="bg-[#F9F8F4] py-16">

      <div className="max-w-md mx-auto px-5">

        <div
          className="
            relative
            overflow-hidden
            rounded-[24px]
            border
            border-[#18463A]
            bg-[#041E19]
            px-6
            py-8
            shadow-[0_18px_45px_rgba(0,0,0,.14)]
          "
        >

          {/* Gold Glow */}

          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-[#C89B4F]/10 blur-[90px]" />

          {/* Grid Pattern */}

          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:28px_28px]" />

          <div className="relative z-10">

            {/* Icon */}

            <div
              className="
                w-14
                h-14
                rounded-full
                border
                border-[#C89B4F]/30
                bg-[#072821]
                text-[#C89B4F]
                flex
                items-center
                justify-center
                mx-auto
              "
            >
              <CalendarDays
                size={22}
                strokeWidth={1.7}
              />
            </div>

            {/* Heading */}

            <h3
              className="
                mt-6
                text-center
                font-playfair
                text-[28px]
                leading-tight
                text-white
              "
            >
              Prefer a Personal
              <br />
              Conversation?
            </h3>

            {/* Description */}

            <p
              className="
                mt-4
                text-center
                text-[14px]
                leading-7
                text-white/65
              "
            >
              Schedule a one-on-one consultation with our
              experienced real estate advisor at a time
              convenient for you.
            </p>

            {/* Button */}

            <button
              className="
                group
                mt-8
                w-full
                h-[50px]
                rounded-xl
                border
                border-[#C89B4F]
                text-[#C89B4F]
                font-medium
                text-[14px]
                flex
                items-center
                justify-center
                gap-3
                transition-all
                duration-300
                hover:bg-[#C89B4F]
                hover:text-[#041E19]
              "
            >
              Schedule Consultation

              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition"
              />

            </button>

          </div>

        </div>

      </div>

    </section>
  );
}