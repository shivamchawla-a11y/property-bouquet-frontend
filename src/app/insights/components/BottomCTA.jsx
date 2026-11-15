
import Link from "next/link";

import {
  ArrowRight,
  Phone,
  Sparkles,
} from "lucide-react";

// ======================================================
// PROPERTY INSIGHTS BOTTOM CTA
// ======================================================

export default function BottomCTA() {
  return (
    <section className="
      bg-[#f7f5ef]
      px-5
      pb-16
      pt-4
      sm:px-8
      sm:pb-20
      lg:px-10
    ">

      <div className="
        relative
        mx-auto
        max-w-[1450px]
        overflow-hidden
        rounded-[26px]
        border
        border-[#294638]
        bg-gradient-to-br
        from-[#163629]
        via-[#143326]
        to-[#0b2119]
        px-6
        py-12
        sm:px-10
        sm:py-14
        lg:px-16
      ">

        {/* BACKGROUND GLOW */}

        <div className="
          pointer-events-none
          absolute
          -right-24
          -top-32
          h-72
          w-72
          rounded-full
          bg-[#b88638]/10
          blur-3xl
        " />

        <div className="
          pointer-events-none
          absolute
          -bottom-32
          -left-24
          h-64
          w-64
          rounded-full
          bg-white/5
          blur-3xl
        " />

        {/* CONTENT */}

        <div className="
          relative
          flex
          flex-col
          items-start
          justify-between
          gap-8
          lg:flex-row
          lg:items-center
        ">

          <div className="max-w-[700px]">

            {/* EYEBROW */}

            <div className="flex items-center gap-2">

              <Sparkles
                size={14}
                className="text-[#d8b46b]"
              />

              <p className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[2.5px]
                text-[#d8b46b]
              ">
                Property Bouquet
              </p>

            </div>

            {/* HEADING */}

            <h2
              className="
                mt-4
                text-[30px]
                leading-[1.16]
                text-white
                sm:text-[38px]
                lg:text-[44px]
              "
              style={{
                fontFamily: "Georgia, serif",
              }}
            >
              Make Your Next Property Decision
              <span className="block text-[#d8b46b]">
                with Clarity and Confidence.
              </span>
            </h2>

            {/* DESCRIPTION */}

            <p className="
              mt-4
              max-w-[620px]
              text-sm
              leading-7
              text-white/60
            ">
              Have questions about the market, an investment
              opportunity or a location? Speak with our team
              for personalised real estate guidance.
            </p>

          </div>

          {/* CTA BUTTONS */}

          <div className="
            flex
            w-full
            shrink-0
            flex-col
            gap-3
            sm:w-auto
            sm:flex-row
          ">

            <a
              href="tel:+919090106101"
              className="
                inline-flex
                h-[50px]
                items-center
                justify-center
                gap-2.5
                rounded-full
                bg-[#d8b46b]
                px-6
                text-xs
                font-semibold
                uppercase
                tracking-[1px]
                text-[#14281e]
                transition-all
                hover:-translate-y-0.5
                hover:bg-white
              "
            >

              <Phone size={15} />

              Talk to an Advisor

            </a>

            <Link
              href="/properties"
              className="
                inline-flex
                h-[50px]
                items-center
                justify-center
                gap-2.5
                rounded-full
                border
                border-white/20
                px-6
                text-xs
                font-semibold
                uppercase
                tracking-[1px]
                text-white
                transition-all
                hover:border-[#d8b46b]
                hover:text-[#d8b46b]
              "
            >

              Explore Properties

              <ArrowRight size={15} />

            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}
