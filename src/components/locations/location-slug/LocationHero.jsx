"use client";

import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Trophy,
  Building2,
  TrendingUp,
  Home,
  ShieldCheck,
} from "lucide-react";

export default function LocationHero({
  location,
  locationName,
  locationImage,
  heroImage,
  properties = [],
  buildPublicLocationSlug,
  pageContent,
}) {
  const custom =
    pageContent?.hero || {};

  const value = (
    customValue,
    fallback
  ) => {
    return typeof customValue ===
      "string" &&
      customValue.trim()
      ? customValue.trim()
      : fallback;
  };

  /* ============================================================
     HIERARCHY
  ============================================================ */

  const hierarchy = [];
  const visited = new Set();

  let current = location;

  while (current) {
    const currentId =
      current?._id?.toString?.() ||
      current?.id?.toString?.() ||
      current?.slug ||
      current?.name;

    if (
      currentId &&
      visited.has(currentId)
    ) {
      break;
    }

    if (currentId) {
      visited.add(currentId);
    }

    hierarchy.unshift(current);
    current = current?.parent;
  }

  /* ============================================================
     STATS
  ============================================================ */

  const projectCount =
    properties?.length || 0;

  const developerNames = new Set();

  properties.forEach((property) => {
    const developerName =
      property?.developerName ||
      property?.coreDetails
        ?.developerName ||
      property?.developer?.name ||
      property?.developerData?.name ||
      property?.developerRef?.name;

    if (developerName) {
      developerNames.add(
        String(
          developerName
        ).trim()
      );
    }
  });

  const developerCount =
    developerNames.size;

  const configurationSet =
    new Set();

  properties.forEach((property) => {
    const floorPlans =
      property?.gatedContent
        ?.floorPlans || [];

    floorPlans.forEach((plan) => {
      if (plan?.unitType) {
        configurationSet.add(
          String(
            plan.unitType
          ).trim()
        );
      }
    });

    const unitConfigurations =
      property?.unitConfigurations ||
      [];

    unitConfigurations.forEach(
      (unit) => {
        if (unit?.unitType) {
          configurationSet.add(
            String(
              unit.unitType
            ).trim()
          );
        }

        if (unit?.bhk) {
          configurationSet.add(
            String(unit.bhk).trim()
          );
        }
      }
    );
  });

  const configurationList =
    Array.from(
      configurationSet
    )
      .filter(Boolean)
      .slice(0, 2);

  const configurationText =
    configurationList.length
      ? configurationList.join(
          " & "
        )
      : "Multiple";

  /* ============================================================
     DEFAULT HERO CONTENT
  ============================================================ */

  const locationSlug =
    String(
      location?.slug ||
        location?.name ||
        ""
    ).toLowerCase();

  const isGrowthCorridor =
    locationSlug.includes(
      "expressway"
    ) ||
    locationSlug.includes(
      "highway"
    ) ||
    locationSlug.includes(
      "road"
    ) ||
    locationSlug.includes("marg");

  const defaultEyebrow =
    isGrowthCorridor
      ? "A PREMIUM GROWTH CORRIDOR"
      : "A PREMIUM REAL ESTATE DESTINATION";

  const defaultDescription =
    isGrowthCorridor
      ? `Modern residences, strategic connectivity, and a promising future in ${locationName}.`
      : `Premium residences, landmark developments, and carefully curated real estate opportunities in ${locationName}.`;

  const eyebrow = value(
    custom.eyebrow,
    defaultEyebrow
  );

  const title = value(
    custom.title,
    `Luxury Properties in ${locationName}`
  );

  const heroSubtitle = value(
    custom.description,
    defaultDescription
  );

  const locationLabel =
    value(
      custom.locationLabel,
      "Prime Location"
    );

  const whyTitle = value(
    custom.whyTitle,
    `Why ${locationName}`
  );

  const whyDescription =
    value(
      custom.whyDescription,
      "A carefully curated collection of premium residential and investment opportunities."
    );

  const benefitsDefaults = [
    "Strategic connectivity & accessibility",
    "Premium residential developments",
    "Leading developer presence",
    "Curated investment opportunities",
  ];

  const mobileDefaults = [
    "Strategic Connectivity",
    "Premium Developments",
    "Leading Developers",
    "Curated Opportunities",
  ];

  const benefits =
    benefitsDefaults.map(
      (fallback, index) =>
        value(
          custom?.benefits?.[index],
          fallback
        )
    );

  const mobileBenefits =
    mobileDefaults.map(
      (fallback, index) =>
        value(
          custom?.mobileBenefits?.[index],
          fallback
        )
    );

  const primaryCtaText =
    value(
      custom.primaryCtaText,
      "Explore Properties"
    );

  const primaryCtaLink =
    value(
      custom.primaryCtaLink,
      "#projects"
    );

  const secondaryCtaText =
    value(
      custom.secondaryCtaText,
      "Contact Advisor"
    );

  const secondaryCtaLink =
    value(
      custom.secondaryCtaLink,
      "/contact"
    );

  const footerEyebrow =
    value(
      custom.footerEyebrow,
      "Property Bouquet"
    );

  const footerText =
    value(
      custom.footerText,
      "Premium properties, thoughtfully curated."
    );

  /* ============================================================
     IMAGE
  ============================================================ */

  const finalHeroImage =
    custom.image?.trim() ||
    heroImage ||
    locationImage ||
    properties?.[0]?.media
      ?.heroImageUrl ||
    "";

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#061811]
        pt-[84px]
        text-white
      "
    >
      {finalHeroImage ? (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={finalHeroImage}
            alt={`${locationName} real estate`}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
              scale-[1.02]
              md:scale-105
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#04130d]/[0.98]
              via-[#061811]/[0.82]
              via-[52%]
              to-[#061811]/[0.30]
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-b
              from-[#061811]/[0.82]
              via-transparent
              to-[#061811]/[0.94]
            "
          />

          <div
            className="
              absolute
              right-[2%]
              top-[5%]
              h-[440px]
              w-[440px]
              rounded-full
              bg-[#D4AF37]/[0.08]
              blur-[130px]
            "
          />

          <div
            className="
              absolute
              right-0
              top-0
              h-full
              w-[55%]
              bg-black/[0.08]
            "
          />
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-[#061811]" />

          <div
            className="
              absolute
              right-[-160px]
              top-[-80px]
              h-[520px]
              w-[520px]
              rounded-full
              bg-[#D4AF37]/[0.09]
              blur-[130px]
            "
          />

          <div
            className="
              absolute
              left-[-180px]
              bottom-[-100px]
              h-[450px]
              w-[450px]
              rounded-full
              bg-[#1D5945]/[0.20]
              blur-[130px]
            "
          />
        </>
      )}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1500px]
          px-5
          pb-8
          sm:px-6
          md:px-8
          lg:px-10
          xl:pb-10
        "
      >
        {/* BREADCRUMB */}

        <nav
          aria-label="Breadcrumb"
          className="
            mb-6
            flex
            flex-wrap
            items-center
            gap-x-2
            gap-y-1
            text-[10px]
            font-medium
            uppercase
            tracking-[0.16em]
            text-white/55
            sm:text-[11px]
            md:gap-x-3
            md:text-xs
          "
        >
          <Link
            href="/"
            className="transition-colors duration-200 hover:text-[#D4AF37]"
          >
            Home
          </Link>

          <span className="text-white/25">
            /
          </span>

          <Link
            href="/locations"
            className="transition-colors duration-200 hover:text-[#D4AF37]"
          >
            Locations
          </Link>

          {hierarchy.map(
            (item, index) => {
              const itemName =
                item?.name ||
                "Location";

              const isLast =
                index ===
                hierarchy.length - 1;

              const itemKey =
                item?._id?.toString?.() ||
                item?.id?.toString?.() ||
                item?.slug ||
                `${itemName}-${index}`;

              return (
                <div
                  key={itemKey}
                  className="flex items-center gap-x-2 md:gap-x-3"
                >
                  <span className="text-white/25">
                    /
                  </span>

                  {isLast ? (
                    <span className="font-semibold text-[#D4AF37]">
                      {itemName}
                    </span>
                  ) : (
                    <Link
                      href={`/locations/${buildPublicLocationSlug(
                        item
                      )}`}
                      className="transition-colors duration-200 hover:text-[#D4AF37]"
                    >
                      {itemName}
                    </Link>
                  )}
                </div>
              );
            }
          )}
        </nav>

        <div
          className="
            grid
            items-end
            gap-8
            lg:grid-cols-[minmax(0,1fr)_350px]
            lg:gap-12
            xl:grid-cols-[minmax(0,1fr)_390px]
          "
        >
          <div
            className="
              min-w-0
              max-w-[850px]
            "
          >
            <div
              className="
                mb-4
                flex
                items-center
                gap-2.5
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[#D4AF37]
                sm:text-[10px]
                md:text-[11px]
              "
            >
              <span className="h-px w-7 bg-[#D4AF37] sm:w-9" />
              {eyebrow}
            </div>

            <div className="mb-3 flex items-center gap-2 text-white/70">
              <MapPin
                size={15}
                strokeWidth={1.7}
                className="text-[#D4AF37]"
              />

              <span className="text-[11px] font-medium sm:text-xs">
                {locationLabel}
              </span>
            </div>

            <h1
              className="
                max-w-[850px]
                font-playfair
                text-[38px]
                font-semibold
                leading-[1.04]
                tracking-[-0.025em]
                text-white
                sm:text-[46px]
                md:text-[52px]
                lg:text-[58px]
                xl:text-[64px]
              "
            >
              {title}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-[2px] w-16 bg-[#D4AF37] sm:w-20 md:w-24" />

              <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
            </div>

            <p
              className="
                mt-4
                max-w-[670px]
                text-[13px]
                leading-6
                text-white/70
                sm:text-[14px]
                sm:leading-7
                md:text-[15px]
              "
            >
              {heroSubtitle}
            </p>

            <div
              className="
                mt-6
                grid
                max-w-[850px]
                grid-cols-2
                divide-x
                divide-white/10
                overflow-hidden
                rounded-[18px]
                border
                border-white/10
                bg-black/[0.16]
                backdrop-blur-md
                sm:grid-cols-4
              "
            >
              <HeroStat
                icon={<Building2 size={14} />}
                value={`${projectCount}+`}
                label="Luxury Projects"
              />

              <HeroStat
                icon={<Home size={14} />}
                value={configurationText}
                label="Configurations"
                mobileTop
              />

              <HeroStat
                icon={<ShieldCheck size={14} />}
                value={
                  developerCount > 0
                    ? `${developerCount}+`
                    : "Multiple"
                }
                label="Developers"
              />

              <HeroStat
                icon={<TrendingUp size={14} />}
                value="Premium"
                label="Market"
                mobileTop
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3 sm:gap-4">
              <a
                href={primaryCtaLink}
                className="
                  inline-flex
                  h-[48px]
                  items-center
                  justify-center
                  rounded-[14px]
                  bg-gradient-to-r
                  from-[#D4AF37]
                  to-[#B8862E]
                  px-6
                  text-[12px]
                  font-semibold
                  uppercase
                  tracking-[0.06em]
                  text-[#08140f]
                  shadow-[0_12px_35px_rgba(212,175,55,0.18)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_16px_40px_rgba(212,175,55,0.25)]
                  sm:h-[50px]
                  sm:px-7
                "
              >
                {primaryCtaText}

                <ArrowRight
                  size={15}
                  className="ml-2.5"
                />
              </a>

              <Link
                href={secondaryCtaLink}
                className="
                  inline-flex
                  h-[48px]
                  items-center
                  justify-center
                  rounded-[14px]
                  border
                  border-white/20
                  bg-white/[0.06]
                  px-6
                  text-[12px]
                  font-semibold
                  uppercase
                  tracking-[0.06em]
                  text-white
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:border-[#D4AF37]/60
                  hover:bg-white/[0.09]
                  hover:text-[#D4AF37]
                  sm:h-[50px]
                  sm:px-7
                "
              >
                {secondaryCtaText}
              </Link>
            </div>
          </div>

          {/* DESKTOP PANEL */}

          <div className="hidden lg:block">
            <div
              className="
                relative
                overflow-hidden
                rounded-[24px]
                border
                border-white/15
                bg-[#061811]/[0.62]
                p-5
                shadow-[0_25px_70px_rgba(0,0,0,0.28)]
                backdrop-blur-xl
                xl:p-6
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  h-48
                  w-48
                  rounded-full
                  bg-[#D4AF37]/10
                  blur-[70px]
                "
              />

              {finalHeroImage && (
                <div className="relative h-[155px] overflow-hidden rounded-[17px] border border-white/10">
                  <img
                    src={finalHeroImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#061811]/80 via-transparent to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/30 backdrop-blur-md">
                      <MapPin
                        size={14}
                        className="text-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <p className="text-[8px] uppercase tracking-[0.18em] text-[#D4AF37]">
                        Location
                      </p>

                      <p className="mt-0.5 text-xs font-semibold text-white">
                        {locationName}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative mt-5">
                <div className="flex items-center gap-2">
                  <Trophy
                    size={14}
                    className="text-[#D4AF37]"
                  />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                    {whyTitle}
                  </p>
                </div>

                <p className="mt-2 text-[12px] leading-5 text-white/60">
                  {whyDescription}
                </p>
              </div>

              <div className="relative mt-4 space-y-2.5">
                {benefits.map(
                  (benefit, index) => (
                    <Benefit
                      key={index}
                      text={benefit}
                    />
                  )
                )}
              </div>

              <div className="relative mt-5 border-t border-white/10 pt-4">
                <p className="text-[9px] uppercase tracking-[0.15em] text-white/35">
                  {footerEyebrow}
                </p>

                <p className="mt-1 text-[11px] text-white/70">
                  {footerText}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 lg:hidden">
          {mobileBenefits.map(
            (benefit, index) => (
              <MobileBenefit
                key={index}
                text={benefit}
              />
            )
          )}
        </div>
      </div>

      <div
        className="
          pointer-events-none
          relative
          z-[5]
          h-10
          bg-gradient-to-t
          from-[#f7f7f7]
          to-transparent
        "
      />
    </section>
  );
}

/* ============================================================
   HERO STAT
============================================================ */

function HeroStat({
  icon,
  value,
  label,
  mobileTop = false,
}) {
  return (
    <div
      className={`
        min-w-0
        px-3
        py-3
        ${
          mobileTop
            ? "border-t border-white/10 sm:border-t-0"
            : ""
        }
        sm:px-4
        sm:py-4
      `}
    >
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-[#D4AF37]">
          {icon}
        </span>

        <p className="truncate text-[14px] font-semibold text-white sm:text-[16px]">
          {value}
        </p>
      </div>

      <p className="mt-1.5 truncate text-[8px] font-medium uppercase tracking-[0.12em] text-white/45 sm:text-[9px]">
        {label}
      </p>
    </div>
  );
}

/* ============================================================
   BENEFIT
============================================================ */

function Benefit({ text }) {
  if (!text) return null;

  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />

      <span className="text-[11px] leading-5 text-white/70">
        {text}
      </span>
    </div>
  );
}

/* ============================================================
   MOBILE BENEFIT
============================================================ */

function MobileBenefit({ text }) {
  if (!text) return null;

  return (
    <div
      className="
        rounded-[13px]
        border
        border-white/10
        bg-black/[0.20]
        px-3
        py-2.5
        text-[9px]
        font-medium
        uppercase
        tracking-[0.05em]
        text-white/65
        backdrop-blur-md
      "
    >
      <span className="mr-1.5 text-[#D4AF37]">
        •
      </span>

      {text}
    </div>
  );
}