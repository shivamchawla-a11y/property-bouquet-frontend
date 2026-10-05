"use client";

import Link from "next/link";
import {
  ArrowRight,
  Trophy,
  Building2,
  TrendingUp,
  Home,
  ShieldCheck,
  MapPin,
} from "lucide-react";

const HERO_IMAGE_WIDTH = 1600;
const LOGO_IMAGE_WIDTH = 300;

/* ============================================================
   IMAGE OPTIMIZATION
============================================================ */

function optimizeImageUrl(src, width) {
  if (!src) {
    return "";
  }

  const value = String(src);

  if (
    value.includes("res.cloudinary.com") &&
    value.includes("/image/upload/")
  ) {
    return value.replace(
      "/image/upload/",
      `/image/upload/f_auto,q_auto,w_${width},c_limit/`
    );
  }

  return value;
}

/* ============================================================
   SAFE CMS VALUE
============================================================ */

function value(customValue, fallback) {
  return typeof customValue === "string" && customValue.trim()
    ? customValue.trim()
    : fallback;
}

/* ============================================================
   DEVELOPER HERO
============================================================ */

export default function DeveloperHero({
  developer,
  properties = [],
  pageContent = {},
}) {
  if (!developer) {
    return null;
  }

  const hero = pageContent?.hero || {};
  const stats = Array.isArray(pageContent?.stats?.items)
    ? pageContent.stats.items
    : [];

  /* ==========================================================
     HERO CONTENT
  ========================================================== */

  const heroEyebrow = value(
    hero.eyebrow,
    "Luxury Developer Collection"
  );

  const heroTitle = value(
    hero.title,
    developer?.name || "Premium Real Estate Developer"
  );

  const heroDescription = value(
    hero.description,
    `Explore iconic luxury residences, landmark developments, and investment opportunities by ${developer.name}, one of India's trusted names in premium real estate.`
  );

  /* ==========================================================
     HERO IMAGE

     CMS image
       ↓
     Existing developer image
  ========================================================== */

  const heroImage = value(
    hero.image,
    developer?.image || ""
  );

  const finalHeroImage = optimizeImageUrl(
    heroImage,
    HERO_IMAGE_WIDTH
  );

  const optimizedDeveloperLogo = optimizeImageUrl(
    developer?.logo,
    LOGO_IMAGE_WIDTH
  );

  /* ==========================================================
     EXISTING DYNAMIC DATA
  ========================================================== */

  const projectCount = properties?.length || 0;

  /* ==========================================================
     CMS STATS + FALLBACK

     If CMS stats exist:
       → use CMS stats

     If CMS stats are empty:
       → preserve the old three hero stats
  ========================================================== */

  const hasCustomStats =
    stats.length > 0 &&
    stats.some(
      (item) =>
        String(item?.value || "").trim() ||
        String(item?.label || "").trim()
    );

  const defaultStats = [
    {
      value: `${projectCount}+`,
      label: "Luxury Projects",
      icon: <Building2 size={14} />,
    },
    {
      value: "Verified",
      label: "Developer",
      icon: <ShieldCheck size={14} />,
    },
    {
      value: "Premium",
      label: "Collection",
      icon: <TrendingUp size={14} />,
    },
  ];

  const customStats = stats
    .map((item, index) => {
      const fallback = defaultStats[index] || {
        value: "",
        label: "",
        icon: <Building2 size={14} />,
      };

      return {
        value: value(item?.value, fallback.value),
        label: value(item?.label, fallback.label),
        icon: fallback.icon,
      };
    })
    .filter(
      (item) =>
        item.value ||
        item.label
    );

  const heroStats = hasCustomStats
    ? customStats
    : defaultStats;

  /* ==========================================================
     CTA
  ========================================================== */

  const primaryCtaText = value(
    hero.primaryCtaText,
    "Explore Projects"
  );

  const primaryCtaLink = value(
    hero.primaryCtaLink,
    "#projects"
  );

  const secondaryCtaText = value(
    hero.secondaryCtaText,
    "Contact Advisor"
  );

  const secondaryCtaLink = value(
    hero.secondaryCtaLink,
    "/contact"
  );

  /* ==========================================================
     RIGHT PANEL

     These fields are intentionally kept compatible with the
     same visual approach as LocationHero.

     Existing static fallback remains available.
  ========================================================== */

  const whyTitle = value(
    hero.whyTitle,
    `Why ${developer.name}`
  );

  const whyDescription = value(
    hero.whyDescription,
    "A carefully curated collection of premium developments and investment opportunities from one of India's established real estate developers."
  );

  const footerEyebrow = value(
    hero.footerEyebrow,
    "Property Bouquet"
  );

  const footerText = value(
    hero.footerText,
    "Premium developer projects, thoughtfully curated."
  );

  /* ==========================================================
     BENEFITS

     CMS:
       hero.benefits[]

     Fallback:
       existing static developer benefits
  ========================================================== */

  const benefitsDefaults = [
    "Established real estate legacy",
    "Premium residential developments",
    "Strategic project locations",
    "Curated investment opportunities",
  ];

  const mobileDefaults = [
    "Established Legacy",
    "Premium Developments",
    "Strategic Locations",
    "Curated Opportunities",
  ];

  const mergeBenefitArray = (
    defaults,
    customItems
  ) => {
    const customArray = Array.isArray(customItems)
      ? customItems
      : [];

    const totalLength = Math.max(
      defaults.length,
      customArray.length
    );

    return Array.from(
      { length: totalLength },
      (_, index) => {
        const fallback =
          defaults[index] || "";

        const customValue =
          customArray[index];

        return value(
          customValue,
          fallback
        );
      }
    ).filter(Boolean);
  };

  const benefits = mergeBenefitArray(
    benefitsDefaults,
    hero?.benefits
  );

  const mobileBenefits = mergeBenefitArray(
    mobileDefaults,
    hero?.mobileBenefits
  );

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
      {/* ======================================================
          HERO IMAGE
      ====================================================== */}

      {finalHeroImage ? (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={finalHeroImage}
            alt={`${developer.name} real estate`}
            width={1600}
            height={900}
            loading="eager"
            fetchPriority="high"
            decoding="async"
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

          {/* LEFT DARK OVERLAY */}

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
            aria-hidden="true"
          />

          {/* TOP / BOTTOM DEPTH */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-b
              from-[#061811]/[0.82]
              via-transparent
              to-[#061811]/[0.94]
            "
            aria-hidden="true"
          />

          {/* GOLD GLOW */}

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
            aria-hidden="true"
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
            aria-hidden="true"
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
            aria-hidden="true"
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
            aria-hidden="true"
          />
        </>
      )}

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

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
        {/* ====================================================
            BREADCRUMB
        ==================================================== */}

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
            className="
              transition-colors
              duration-200
              hover:text-[#D4AF37]
            "
          >
            Home
          </Link>

          <span className="text-white/25">
            /
          </span>

          <Link
            href="/developers"
            className="
              transition-colors
              duration-200
              hover:text-[#D4AF37]
            "
          >
            Developers
          </Link>

          <span className="text-white/25">
            /
          </span>

          <span className="font-semibold text-[#D4AF37]">
            {developer.name}
          </span>
        </nav>

        {/* ====================================================
            TWO-COLUMN HERO
        ==================================================== */}

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
          {/* ==================================================
              LEFT CONTENT
          ================================================== */}

          <div
            className="
              min-w-0
              max-w-[850px]
            "
          >
            {/* EYEBROW */}

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

              {heroEyebrow}
            </div>

            {/* LOCATION / DEVELOPER LABEL */}

            <div className="mb-3 flex items-center gap-2 text-white/70">
              <Trophy
                size={15}
                strokeWidth={1.7}
                className="text-[#D4AF37]"
                aria-hidden="true"
              />

              <span className="text-[11px] font-medium sm:text-xs">
                Premium Developer
              </span>
            </div>

            {/* TITLE */}

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
              {heroTitle}
            </h1>

            {/* GOLD LINE */}

            <div className="mt-4 flex items-center gap-3">
              <div className="h-[2px] w-16 bg-[#D4AF37] sm:w-20 md:w-24" />

              <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
            </div>

            {/* DESCRIPTION */}

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
              {heroDescription}
            </p>

            {/* ==================================================
                DEVELOPER LOGO
            ================================================== */}

            {optimizedDeveloperLogo && (
              <div className="mt-5">
                <div
                  className="
                    relative
                    flex
                    h-[72px]
                    w-[72px]
                    items-center
                    justify-center
                    rounded-[18px]
                    border
                    border-white/15
                    bg-white/95
                    shadow-[0_20px_45px_rgba(0,0,0,0.25)]
                  "
                >
                  <div
                    className="
                      absolute
                      inset-0
                      rounded-[18px]
                      border
                      border-[#D4AF37]/25
                    "
                    aria-hidden="true"
                  />

                  <img
                    src={optimizedDeveloperLogo}
                    alt={`${developer.name} logo`}
                    width={300}
                    height={300}
                    loading="eager"
                    decoding="async"
                    className="
                      relative
                      z-10
                      max-h-[48px]
                      max-w-[48px]
                      object-contain
                    "
                  />
                </div>
              </div>
            )}

            {/* ==================================================
                STATS
            ================================================== */}

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
                sm:grid-cols-3
              "
            >
              {heroStats.map(
                (stat, index) => (
                  <HeroStat
                    key={`${index}-${stat.label}-${stat.value}`}
                    icon={stat.icon}
                    value={stat.value}
                    label={stat.label}
                    mobileTop={
                      index === 2
                    }
                  />
                )
              )}
            </div>

            {/* ==================================================
                CTA
            ================================================== */}

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

          {/* ==================================================
              DESKTOP RIGHT PANEL
          ================================================== */}

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
              {/* GOLD GLOW */}

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
                aria-hidden="true"
              />

              {/* ==================================================
                  IMAGE PANEL
              ================================================== */}

              {finalHeroImage && (
                <div
                  className="
                    relative
                    h-[155px]
                    overflow-hidden
                    rounded-[17px]
                    border
                    border-white/10
                  "
                >
                  <img
                    src={finalHeroImage}
                    alt=""
                    width={1600}
                    height={900}
                    loading="eager"
                    decoding="async"
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-[#061811]/80
                      via-transparent
                      to-transparent
                    "
                  />

                  <div
                    className="
                      absolute
                      bottom-3
                      left-3
                      right-3
                      flex
                      items-center
                      gap-2.5
                    "
                  >
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/15
                        bg-black/30
                        backdrop-blur-md
                      "
                    >
                      <Trophy
                        size={14}
                        className="text-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <p
                        className="
                          text-[8px]
                          uppercase
                          tracking-[0.18em]
                          text-[#D4AF37]
                        "
                      >
                        Developer
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-xs
                          font-semibold
                          text-white
                        "
                      >
                        {developer.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================
                  WHY DEVELOPER
              ================================================== */}

              <div className="relative mt-5">
                <div className="flex items-center gap-2">
                  <Trophy
                    size={14}
                    className="text-[#D4AF37]"
                  />

                  <p
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-[#D4AF37]
                    "
                  >
                    {whyTitle}
                  </p>
                </div>

                <p
                  className="
                    mt-2
                    text-[12px]
                    leading-5
                    text-white/60
                  "
                >
                  {whyDescription}
                </p>
              </div>

              {/* ==================================================
                  BENEFITS
              ================================================== */}

              <div className="relative mt-4 space-y-2.5">
                {benefits.map(
                  (benefit, index) => (
                    <Benefit
                      key={`${index}-${benefit}`}
                      text={benefit}
                    />
                  )
                )}
              </div>

              {/* ==================================================
                  FOOTER
              ================================================== */}

              <div
                className="
                  relative
                  mt-5
                  border-t
                  border-white/10
                  pt-4
                "
              >
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.15em]
                    text-white/35
                  "
                >
                  {footerEyebrow}
                </p>

                <p
                  className="
                    mt-1
                    text-[11px]
                    text-white/70
                  "
                >
                  {footerText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            MOBILE BENEFITS
        ====================================================== */}

        <div
          className="
            mt-6
            grid
            grid-cols-2
            gap-2
            lg:hidden
          "
        >
          {mobileBenefits.map(
            (benefit, index) => (
              <MobileBenefit
                key={`${index}-${benefit}`}
                text={benefit}
              />
            )
          )}
        </div>
      </div>

      {/* ======================================================
          SECTION TRANSITION
      ====================================================== */}

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
  value: statValue,
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

        <p
          className="
            truncate
            text-[14px]
            font-semibold
            text-white
            sm:text-[16px]
          "
        >
          {statValue}
        </p>
      </div>

      <p
        className="
          mt-1.5
          truncate
          text-[8px]
          font-medium
          uppercase
          tracking-[0.12em]
          text-white/45
          sm:text-[9px]
        "
      >
        {label}
      </p>
    </div>
  );
}

/* ============================================================
   BENEFIT
============================================================ */

function Benefit({ text }) {
  if (!text) {
    return null;
  }

  return (
    <div className="flex items-start gap-2.5">
      <span
        className="
          mt-[5px]
          h-1.5
          w-1.5
          shrink-0
          rounded-full
          bg-[#D4AF37]
        "
      />

      <span
        className="
          text-[11px]
          leading-5
          text-white/70
        "
      >
        {text}
      </span>
    </div>
  );
}

/* ============================================================
   MOBILE BENEFIT
============================================================ */

function MobileBenefit({ text }) {
  if (!text) {
    return null;
  }

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