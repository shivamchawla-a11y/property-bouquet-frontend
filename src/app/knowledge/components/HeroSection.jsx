"use client";

import Link from "next/link";
import {
  BookOpen,
  ShieldCheck,
  FileText,
  Building2,
  ChevronRight,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section
  className="
  relative
  w-full
  overflow-hidden
  bg-[#050b13]
  min-h-[590px]
  "
>

      {/* Background */}

      <div className="absolute inset-0">
        <img
          src="/knowledge/hero.png"
          alt="Knowledge Centre"
          className="
h-full
w-full
object-cover
object-center
scale-105
brightness-[0.95]
"
        />

        <div
  className="
  absolute
  inset-0
  bg-gradient-to-r
  from-[#04070d]
  via-[#04070d]/72
  to-transparent
  "
/>

<div
  className="
  absolute
  inset-0
  bg-gradient-to-b
  from-black/15
  via-transparent
  to-[#050b13]
  "
/>
      </div>

      {/* Content */}

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-28
lg:pt-36
pb-48">

        {/* Breadcrumb */}

        <div className="flex items-center text-sm text-white/70 gap-2 mb-10">

          <Link
            href="/"
            className="hover:text-[#d4af37] transition"
          >
            Home
          </Link>

          <ChevronRight size={15} />

          <Link
            href="/knowledge"
            className="hover:text-[#d4af37] transition"
          >
            Knowledge Centre
          </Link>

          <ChevronRight size={15} />

          <span className="text-white">
            Buying Guides
          </span>

        </div>

        {/* Main */}

        <div className="max-w-2xl">

          <h1
            className="
            text-white
            text-[68px]
            leading-[1.08]
            tracking-[-1px]
            font-serif
            leading-tight
            "
          >
            Buying Guides
          </h1>

          <div className="mt-7 w-24 h-[3px] bg-[#c9a64b]" />

          <p
            className="
            mt-10
            text-xl
            leading-9
            text-gray-200
            max-w-[560px]
            "
          >
            Your complete resource to understand everything
            about buying a property in India.
          </p>

        </div>

      </div>

      {/* Floating Features */}

      {/* Floating Features */}

<div
  className="
  absolute
  left-1/2
  -translate-x-1/2
  bottom-[38px]
  z-30
  w-[92%]
  max-w-[1360px]
  "
>

        <div
  className="
  grid
  grid-cols-2
  lg:grid-cols-4
  bg-[#0d1118]
  border
  border-[#8d6f30]
  rounded-[18px]
  overflow-hidden
  shadow-[0_30px_80px_rgba(0,0,0,0.45)]
  backdrop-blur-sm
  "
>

          <Feature
            icon={<BookOpen size={34} />}
            title="Step-by-step"
            subtitle="guides"
          />

          <Feature
            icon={<ShieldCheck size={34} />}
            title="Expert"
            subtitle="insights"
          />

          <Feature
            icon={<FileText size={34} />}
            title="Legal & financial"
            subtitle="clarity"
          />

          <Feature
            icon={<Building2 size={34} />}
            title="Make confident"
            subtitle="decisions"
            last
          />

        </div>

      </div>

    </section>
  );
}

function Feature({
  icon,
  title,
  subtitle,
  last = false,
}) {
  return (
    <div
      className={`
      flex
      items-center
      gap-5
      px-10
    py-9
      ${
        !last
          ? "border-r border-[#8a6d2f]/40"
          : ""
      }
      `}
    >
      <div className="text-[#c9a64b]">
        {icon}
      </div>

      <div>

        <p className="text-white text-xl font-medium">
          {title}
        </p>

        <p className="text-gray-400 text-[17px]">
          {subtitle}
        </p>

      </div>

    </div>
  );
}