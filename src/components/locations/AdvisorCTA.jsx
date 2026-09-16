"use client";

import Link from "next/link";
import {
  ArrowRight,
  Phone,
} from "lucide-react";

export default function AdvisorCTA() {
  return (
    <section className="bg-[#f7f5f0] px-6 py-16 sm:px-8 lg:px-12">

      <div className="mx-auto max-w-7xl">

        <div className="relative overflow-hidden rounded-[32px] bg-[#0f3b2e] px-7 py-12 sm:px-10 lg:px-14">

          {/* Decorative elements */}

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#C89D58]/10 blur-2xl" />

          <div className="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-black/20 blur-2xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            {/* Content */}

            <div className="max-w-2xl">

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                Property Bouquet Advisory
              </p>

              <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Looking for a Property in a Specific Location?
              </h2>

              <p className="mt-4 text-base leading-7 text-white/65">
                Speak with our property advisors for
                assistance finding suitable projects,
                residences and investment opportunities
                based on your preferred location.
              </p>

            </div>

            {/* Actions */}

            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">

              <a
                href="tel:+919090106101"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                <Phone size={17} />
                Call Advisor
              </a>

              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C89D58] px-6 py-3.5 text-sm font-semibold text-[#081512] transition hover:bg-[#D4AF37]"
              >
                Explore Properties
                <ArrowRight
                  size={17}
                />
              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}