"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Phone,
} from "lucide-react";

export default function LocationsCTA() {
  return (
    <section className="relative overflow-hidden bg-[#0b1713] py-24 md:py-28">

      {/* Gold glow */}
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c89d58]/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-[900px] px-5 text-center sm:px-8">

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#d1aa63]">
            YOUR NEXT PROPERTY SEARCH
          </p>

          <h2
            className="mt-5 text-[38px] leading-[1.1] text-white sm:text-[48px] md:text-[56px]"
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",
            }}
          >
            Know the Location.
            <br />
            <span className="text-[#d1aa63]">
              Then Find the Property.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-[650px] text-[14px] leading-[1.9] text-white/50 md:text-[15px]">
            Explore location-specific property opportunities
            across Gurgaon and discover residential projects
            aligned with your requirements.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <Link
              href="/properties"
              className="group flex h-[52px] items-center gap-3 rounded-full bg-[#c89d58] px-7 text-[11px] font-semibold uppercase tracking-[1.5px] text-black transition hover:bg-[#d6b16f]"
            >
              Explore Properties

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
  href="/contact"
  className="group flex h-[52px] items-center gap-3 rounded-full border border-white/15 px-7 text-[11px] font-semibold uppercase tracking-[1.5px] text-white/80 transition-all duration-300 hover:border-[#c89d58]/50 hover:bg-[#c89d58]/[0.06] hover:text-white"
>
  <Phone
    size={15}
    strokeWidth={1.7}
    className="text-[#d1aa63] transition-transform duration-300 group-hover:scale-110"
  />

  Speak With an Advisor
</Link>

          </div>
        </motion.div>
      </div>
    </section>
  );
}