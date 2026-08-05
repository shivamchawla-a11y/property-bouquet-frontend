"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-[#06120f] overflow-hidden">

      {/* Background */}
      <img
        src="/developers/bg-img.png"
        alt="Luxury Developers"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          object-center
          brightness-[1.28]
          contrast-[1.06]
          saturate-[1.08]
        "
      />

      {/* Dark Gradient */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-[#06120f]
          via-[#06120fdc]
          to-[#06120f25]
        "
      />

      {/* Soft Dark Overlay */}
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative max-w-[1380px] mx-auto px-6 lg:px-8">

        {/* Space for Navbar */}
        <div className="h-[88px] lg:h-[96px]" />

        {/* Breadcrumb */}

        <div className="flex items-center gap-2 text-[11px] text-white/70">

          <Link
            href="/"
            className="hover:text-[#D4AF37] transition-colors"
          >
            Home
          </Link>

          <ChevronRight size={11} />

          <span className="text-white">
            Developers
          </span>

        </div>

        {/* Hero */}

        <div className="grid lg:grid-cols-[43%_57%] items-center min-h-[430px]">

          {/* LEFT */}

          <div className="max-w-[430px]">

            <h1
              className="
                font-playfair
                font-normal
                leading-[1.12]
                tracking-[-0.03em]
                text-white
                text-[30px]
                md:text-[42px]
                lg:text-[50px]
              "
            >
              Top Real Estate
              <br />

              Developers in

              <span className="text-[#D4AF37]">
                {" "}
                Gurgaon
              </span>

            </h1>

            {/* Divider */}

            <div className="flex items-center gap-3 mt-6 mb-6">

              <div className="w-12 h-[2px] bg-[#D4AF37]" />

              <div className="w-[6px] h-[6px] rotate-45 bg-[#D4AF37]" />

              <div className="w-12 h-[2px] bg-[#D4AF37]" />

            </div>

            <p
              className="
                max-w-[400px]
                text-[14px]
                leading-7
                text-white/80
              "
            >
              We partner with the most trusted and reputed
              developers to bring you curated properties that
              stand for quality, transparency and long-term
              value.
            </p>

          </div>

          {/* Right Empty */}

          <div />

        </div>

      </div>
    </section>
  );
}