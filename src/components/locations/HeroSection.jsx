"use client";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="locations-page-heading"
      className="relative min-h-[520px] overflow-hidden bg-[#081512]"
    >
      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#17342d] via-[#081512] to-black" />

      {/* Decorative glow */}

      <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#C89D58]/10 blur-3xl" />

      <div className="absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-[#17342d]/40 blur-3xl" />

      {/* Content */}

      <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-6 pb-16 pt-32 sm:px-8 lg:px-12">

        <div className="max-w-4xl">

          {/* Eyebrow */}

          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">
            Property Bouquet
          </p>

          {/* H1 */}

          <h1
            id="locations-page-heading"
            className="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Luxury Properties by Location
          </h1>

          {/* Description */}

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg"
          >
            Discover curated luxury residences,
            premium developments and investment
            opportunities across the most sought-after
            real estate locations.
          </p>

          {/* Bottom line */}

          <div className="mt-10 flex items-center gap-4">

            <div className="h-px w-16 bg-[#C89D58]" />

            <span className="text-sm tracking-wide text-white/50">
              Explore your next address
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}