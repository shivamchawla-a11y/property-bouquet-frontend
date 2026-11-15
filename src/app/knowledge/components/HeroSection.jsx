
import Image from "next/image";
import Link from "next/link";

import {
  BookOpen,
  ShieldCheck,
  FileText,
  Building2,
  ChevronRight,
} from "lucide-react";

// ======================================================
// KNOWLEDGE CENTRE HERO SECTION
// SERVER COMPONENT
// ======================================================

export default function HeroSection() {
  return (
    <section
      className="
        relative
        isolate
        w-full
        min-h-[590px]
        overflow-hidden
        bg-[#050b13]
      "
    >

      {/* BACKGROUND IMAGE */}

      <div className="absolute inset-0 -z-10">

        <Image
          src="/knowledge/hero.png"
          alt="Property Bouquet Knowledge Centre"
          fill
          preload
          quality={75}
          sizes="100vw"
          className="
            scale-105
            object-cover
            object-center
            brightness-[0.95]
          "
        />

        {/* LEFT OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#04070d]
            via-[#04070d]/75
            to-transparent
          "
          aria-hidden="true"
        />

        {/* BOTTOM OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-black/15
            via-transparent
            to-[#050b13]
          "
          aria-hidden="true"
        />

      </div>

      {/* HERO CONTENT */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1400px]
          px-5
          sm:px-6
          lg:px-10
          pt-28
          lg:pt-36
          pb-48
        "
      >

        {/* BREADCRUMB */}

        <nav
          aria-label="Breadcrumb"
          className="
            mb-10
            flex
            items-center
            gap-2
            text-sm
            text-white/70
          "
        >

          <Link
            href="/"
            className="
              transition-colors
              duration-300
              hover:text-[#d4af37]
            "
          >
            Home
          </Link>

          <ChevronRight
            size={15}
            aria-hidden="true"
          />

          <span
            className="text-white"
            aria-current="page"
          >
            Knowledge Centre
          </span>

        </nav>

        {/* MAIN HERO TEXT */}

        <div className="max-w-2xl">

          <p
            className="
              mb-5
              text-[11px]
              font-semibold
              uppercase
              tracking-[4px]
              text-[#d4af37]
            "
          >
            PROPERTY BOUQUET
          </p>

          <h1
            className="
              text-white
              text-[42px]
              sm:text-[54px]
              lg:text-[68px]
              leading-[1.08]
              tracking-[-1px]
              font-serif
            "
          >
            Knowledge Centre
          </h1>

          {/* GOLD DIVIDER */}

          <div
            className="
              mt-7
              h-[3px]
              w-24
              bg-[#c9a64b]
            "
          />

          {/* DESCRIPTION */}

          <p
            className="
              mt-8
              max-w-[560px]
              text-base
              leading-8
              text-gray-200
              sm:text-lg
              lg:text-xl
            "
          >
            Explore expert real estate guides, investment
            strategies, area insights, project reviews and
            legal resources to make informed property decisions.
          </p>

        </div>

      </div>

      {/* FLOATING FEATURES */}

      <div
        className="
          absolute
          bottom-[30px]
          left-1/2
          z-30
          w-[92%]
          max-w-[1360px]
          -translate-x-1/2
          sm:bottom-[38px]
        "
      >

        <div
          className="
            grid
            grid-cols-2
            overflow-hidden
            rounded-[18px]
            border
            border-[#8d6f30]
            bg-[#0d1118]
            shadow-[0_30px_80px_rgba(0,0,0,0.45)]
            lg:grid-cols-4
          "
        >

          <Feature
            icon={<BookOpen size={30} />}
            title="Step-by-step"
            subtitle="Guides"
          />

          <Feature
            icon={<ShieldCheck size={30} />}
            title="Expert"
            subtitle="Insights"
          />

          <Feature
            icon={<FileText size={30} />}
            title="Legal & Financial"
            subtitle="Clarity"
          />

          <Feature
            icon={<Building2 size={30} />}
            title="Make Confident"
            subtitle="Decisions"
            last
          />

        </div>

      </div>

    </section>
  );
}

// ======================================================
// FEATURE ITEM
// ======================================================

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
        gap-3
        px-3
        py-5
        sm:gap-5
        sm:px-6
        sm:py-6
        lg:px-8
        lg:py-8
        ${
          !last
            ? "border-r border-[#8a6d2f]/40"
            : ""
        }
      `}
    >

      {/* ICON */}

      <div className="shrink-0 text-[#c9a64b]">
        {icon}
      </div>

      {/* TEXT */}

      <div className="min-w-0">

        <p className="text-sm font-medium text-white sm:text-base lg:text-lg">
          {title}
        </p>

        <p className="text-xs text-gray-400 sm:text-sm">
          {subtitle}
        </p>

      </div>

    </div>
  );
}
