
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
// Server Component - No Client-Side JavaScript Required
// ======================================================

export default function HeroSection() {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-[#050b13]
        min-h-[590px]
        isolate
      "
    >

      {/* ==================================================
          OPTIMIZED HERO BACKGROUND
      ================================================== */}

      <div className="absolute inset-0 -z-10">

        <Image
          src="/knowledge/hero.png"
          alt="Knowledge Centre"
          fill
          preload
          quality={75}
          sizes="100vw"
          className="
            object-cover
            object-center
            scale-105
            brightness-[0.95]
          "
        />

        {/* LEFT DARK OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#04070d]
            via-[#04070d]/72
            to-transparent
          "
          aria-hidden="true"
        />

        {/* BOTTOM GRADIENT */}

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

      {/* ==================================================
          HERO CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          max-w-[1400px]
          mx-auto
          px-6
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
            flex
            items-center
            text-sm
            text-white/70
            gap-2
            mb-10
          "
        >

          <Link
            href="/"
            className="
              hover:text-[#d4af37]
              transition-colors
              duration-300
            "
          >
            Home
          </Link>

          <ChevronRight
            size={15}
            aria-hidden="true"
          />

          <Link
            href="/knowledge"
            className="
              hover:text-[#d4af37]
              transition-colors
              duration-300
            "
          >
            Knowledge Centre
          </Link>

          <ChevronRight
            size={15}
            aria-hidden="true"
          />

          <span
            className="text-white"
            aria-current="page"
          >
            Buying Guides
          </span>

        </nav>

        {/* MAIN HERO TEXT */}

        <div className="max-w-2xl">

          <h1
            className="
              text-white
              text-[48px]
              sm:text-[58px]
              lg:text-[68px]
              leading-[1.08]
              tracking-[-1px]
              font-serif
            "
          >
            Buying Guides
          </h1>

          {/* GOLD DIVIDER */}

          <div
            className="
              mt-7
              w-24
              h-[3px]
              bg-[#c9a64b]
            "
          />

          {/* DESCRIPTION */}

          <p
            className="
              mt-10
              text-lg
              lg:text-xl
              leading-8
              lg:leading-9
              text-gray-200
              max-w-[560px]
            "
          >
            Your complete resource to understand everything
            about buying a property in India.
          </p>

        </div>

      </div>

      {/* ==================================================
          FLOATING FEATURES
      ================================================== */}

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
        gap-5
        px-4
        sm:px-6
        lg:px-10
        py-6
        lg:py-9
        ${
          !last
            ? "border-r border-[#8a6d2f]/40"
            : ""
        }
      `}
    >

      {/* ICON */}

      <div className="text-[#c9a64b] shrink-0">
        {icon}
      </div>

      {/* TEXT */}

      <div className="min-w-0">

        <p className="text-white text-base lg:text-xl font-medium">
          {title}
        </p>

        <p className="text-gray-400 text-sm lg:text-[17px]">
          {subtitle}
        </p>

      </div>

    </div>
  );
}
