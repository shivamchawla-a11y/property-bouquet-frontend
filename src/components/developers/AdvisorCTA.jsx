"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AdvisorCTA() {
  return (
    <section className="pb-10 lg:pb-14">
      <div className="max-w-[1380px] mx-auto px-5 lg:px-8">

        <div
          className="
            relative
            overflow-hidden
            rounded-[18px]
            bg-[#041610]
            border
            border-[#143129]
          "
        >
          {/* Background Glow */}
          <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-[#D4AF37]/5 blur-3xl" />


          <div
            className="
              relative
              flex
              flex-col
              lg:flex-row
              items-center
              justify-between
              gap-8
              px-8
              lg:px-14
              py-8
            "
          >
            {/* Left */}

            <div className="max-w-[520px]">

              <p
                className="
                  text-[#D4AF37]
                  text-[11px]
                  font-semibold
                  tracking-[2px]
                  uppercase
                "
              >
                Let's Find the Right Property For You
              </p>

              <h2
                className="
                  mt-2
                  text-white
                  font-playfair
                  text-[24px]
                  lg:text-[34px]
                  leading-[1.25]
                "
              >
                Connect with our experts for
                <br />
                personalized guidance.
              </h2>

            </div>

            {/* Button */}

            <Link
              href="/contact"
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-lg
                bg-[#E6B66A]
                px-8
                py-3.5
                text-[14px]
                font-semibold
                text-[#1b1b1b]
                transition-all
                duration-300
                hover:bg-[#D4AF37]
                hover:-translate-y-0.5
                shadow-lg
                shrink-0
              "
            >
              Talk to an Advisor

              <ArrowRight
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}