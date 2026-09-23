"use client";

import { useMemo } from "react";
import {
  ArrowRight,
  Building2,
  MapPin,
  TrendingUp,
  Users,
  Quote,
} from "lucide-react";

/* ============================================================
   ABOUT LOCATION
============================================================ */

export default function AboutLocation({
  location,
  locationName,
  locationDescription = "",
  properties = [],
  locationImage = "",
  pageContent,
}) {
  const custom = pageContent?.about || {};

  /* ============================================================
     HELPER
  ============================================================ */

  const value = (customValue, fallback) => {
    return typeof customValue === "string" &&
      customValue.trim()
      ? customValue.trim()
      : fallback;
  };

  /* ============================================================
     IMAGE
  ============================================================ */

  const resolveImage = () => {
    const customImage =
      typeof custom?.image === "string"
        ? custom.image.trim()
        : "";

    if (customImage) {
      return customImage;
    }

    const candidates = [
      locationImage,
      location?.image,
      location?.imageUrl,
      properties?.[0]?.locationImage,
      properties?.[0]?.media?.locationImageUrl,
      properties?.[0]?.media?.heroImageUrl,
      properties?.[0]?.media?.images?.[0]?.url,
    ];

    return (
      candidates.find(
        (image) =>
          typeof image === "string" &&
          image.trim()
      ) || ""
    );
  };

  const resolvedImage = resolveImage();

  /* ============================================================
     PROPERTY TYPES
  ============================================================ */

  const propertyTypes = useMemo(() => {
    const types = new Set();

    properties.forEach((property) => {
      const values = [
        property?.categoryData?.categoryName,
        property?.category?.name,
        property?.propertyType,
        property?.propertyCategory,
        property?.coreDetails?.propertyType,
      ];

      values.forEach((item) => {
        if (
          typeof item === "string" &&
          item.trim()
        ) {
          types.add(item.trim());
        }
      });
    });

    return Array.from(types);
  }, [properties]);

  /* ============================================================
     DEVELOPERS
  ============================================================ */

  const developerNames = useMemo(() => {
    const developers = new Set();

    properties.forEach((property) => {
      const values = [
        property?.developerName,
        property?.coreDetails?.developerName,
        property?.developer?.name,
        property?.developerData?.name,
        property?.developerRef?.name,
      ];

      values.forEach((item) => {
        if (
          typeof item === "string" &&
          item.trim()
        ) {
          developers.add(item.trim());
        }
      });
    });

    return Array.from(developers);
  }, [properties]);

  /* ============================================================
     STARTING PRICES
  ============================================================ */

  const startingPrices = useMemo(() => {
    return properties
      .map((property) =>
        Number(
          property?.coreDetails?.startingPrice
        )
      )
      .filter(
        (price) =>
          Number.isFinite(price) &&
          price > 0
      );
  }, [properties]);

  /* ============================================================
     FORMAT PRICE
  ============================================================ */

  const formatPrice = (price) => {
    if (!Number.isFinite(price)) {
      return "";
    }

    if (price >= 10000000) {
      const value = price / 10000000;

      return `₹${value
        .toFixed(value >= 10 ? 0 : 1)
        .replace(/\.0$/, "")} Cr`;
    }

    if (price >= 100000) {
      const value = price / 100000;

      return `₹${value
        .toFixed(value >= 10 ? 0 : 1)
        .replace(/\.0$/, "")} L`;
    }

    return `₹${price.toLocaleString(
      "en-IN"
    )}`;
  };

  const pricePositioning =
    startingPrices.length
      ? (() => {
          const min = Math.min(
            ...startingPrices
          );

          const max = Math.max(
            ...startingPrices
          );

          if (min === max) {
            return formatPrice(min);
          }

          return `${formatPrice(
            min
          )} onwards`;
        })()
      : "Premium segment";

  /* ============================================================
     DEFAULT CONTENT
  ============================================================ */

  const defaultDescription =
    locationDescription ||
    `Explore the real estate landscape of ${locationName}, including premium residences, landmark developments, thoughtfully planned communities and property opportunities across different segments. ${locationName} offers buyers and investors an address to evaluate through the combined lens of connectivity, infrastructure, lifestyle convenience, development quality and long-term suitability. Property Bouquet brings together curated property opportunities to help you research the area, compare available projects and identify homes or investments aligned with your requirements.`;

  const eyebrow = value(
    custom.eyebrow,
    "ABOUT THE LOCATION"
  );

  const title = value(
    custom.title,
    locationName
  );

  const content = value(
    custom.content,
    defaultDescription
  );

  const marketEyebrow = value(
    custom.marketEyebrow,
    "REAL ESTATE MARKET"
  );

  const marketTitle = value(
    custom.marketTitle,
    "A Thriving Real Estate Destination"
  );

  const marketDescription = value(
    custom.marketDescription,
    `${locationName} continues to attract attention from homebuyers and investors looking for a combination of established infrastructure, everyday convenience, strong connectivity and quality residential development. The area's evolving real estate landscape offers opportunities across multiple configurations and price segments.`
  );

  const perspectiveEyebrow = value(
    custom.perspectiveEyebrow,
    "PROPERTY BOUQUET PERSPECTIVE"
  );

  const perspectiveQuote = value(
    custom.perspectiveQuote,
    `${locationName} brings together connectivity, lifestyle convenience and a growing selection of residential opportunities, making it an address worth evaluating on both present-day livability and long-term potential.`
  );

  /* ============================================================
     DEFAULT HIGHLIGHTS
  ============================================================ */

  const defaultHighlights = [
    {
      title: "Property Types",
      description:
        propertyTypes.length
          ? propertyTypes
              .slice(0, 3)
              .join(", ")
          : "Premium residential developments",
    },
    {
      title: "Developer Presence",
      description:
        developerNames.length
          ? developerNames
              .slice(0, 3)
              .join(", ")
          : "Multiple established developers",
    },
    {
      title: "Price Positioning",
      description: pricePositioning,
    },
  ];

  const highlights =
    defaultHighlights.map(
      (fallback, index) => {
        const customItem =
          custom?.highlights?.[index] ||
          {};

        return {
          title: value(
            customItem.title,
            fallback.title
          ),

          description: value(
            customItem.description,
            fallback.description
          ),
        };
      }
    );

  /* ============================================================
     DEFAULT MARKET INSIGHTS
  ============================================================ */

  const defaultMarketInsights = [
    {
      title: "Connectivity",
      description:
        "Strategic road networks and access to important destinations support convenient movement across the wider region.",
    },
    {
      title: "Development",
      description:
        "A growing pipeline of residential projects creates greater choice across formats, configurations and communities.",
    },
    {
      title: "Lifestyle",
      description:
        "Everyday amenities, retail, hospitality and social infrastructure contribute to a more complete residential experience.",
    },
  ];

  const marketInsights =
    defaultMarketInsights.map(
      (fallback, index) => {
        const customItem =
          custom?.marketInsights?.[index] ||
          {};

        return {
          title: value(
            customItem.title,
            fallback.title
          ),

          description: value(
            customItem.description,
            fallback.description
          ),
        };
      }
    );

  /* ============================================================
     CLEAN RICH TEXT
     
     IMPORTANT:
     ReactQuill can store:
       &nbsp;
       &#160;
       actual NBSP characters

     These are non-breaking spaces.

     A long sequence of them can force a paragraph
     to extend horizontally underneath the image.

     We convert them into normal spaces before rendering.
  ============================================================ */

  const normalizedContent =
    typeof content === "string"
      ? content
          .replace(/&nbsp;/gi, " ")
          .replace(/&#160;/gi, " ")
          .replace(/&#xA0;/gi, " ")
          .replace(/\u00a0/g, " ")
      : "";

  /* ============================================================
     RICH TEXT DETECTION
  ============================================================ */

  const hasRichText =
    /<\/?[a-z][\s\S]*>/i.test(
      normalizedContent
    );

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      {/* ======================================================
          ABOUT LOCATION
      ====================================================== */}

      <section
        id="about-location"
        className="
          relative
          overflow-hidden
          bg-[#f7f7f7]
          py-16
          sm:py-20
          lg:py-24
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1450px]
            px-5
            sm:px-6
            md:px-8
            lg:px-10
          "
        >
          {/* ==================================================
              MAIN GRID

              IMPORTANT FIX:
              minmax(0, ...) prevents long text from
              expanding the first grid column underneath
              the image.
          ================================================== */}

          <div
            className="
              grid
              min-w-0
              items-start
              gap-10
              lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.75fr)]
              lg:gap-12
              xl:gap-16
              2xl:gap-20
            "
          >
            {/* ==================================================
                CONTENT
            ================================================== */}

            <div
              className="
                min-w-0
                max-w-full
              "
            >
              <div
                className="
                  mb-4
                  flex
                  min-w-0
                  max-w-full
                  items-center
                  gap-2.5
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-[#A47A2B]
                  sm:text-[10px]
                  md:text-[11px]
                "
              >
                <span className="h-px w-8 shrink-0 bg-[#C89D58]" />

                <span className="min-w-0 break-words">
                  {eyebrow}
                </span>
              </div>

              <h2
                className="
                  max-w-full
                  break-words
                  font-playfair
                  text-[34px]
                  font-semibold
                  leading-[1.08]
                  tracking-[-0.025em]
                  text-[#17342d]
                  sm:text-[40px]
                  md:text-[46px]
                  lg:text-[52px]
                  [overflow-wrap:anywhere]
                "
              >
                {title}
              </h2>

              <div className="mt-5 h-px w-20 bg-[#C89D58]" />

              {/* ==================================================
                  RICH TEXT CONTENT

                  IMPORTANT:
                  overflow-wrap:anywhere is deliberately added
                  so even malformed/very long editor content
                  cannot cross into the image column.
              ================================================== */}

              {hasRichText ? (
                <div
                  className="
                    mt-6
                    min-w-0
                    max-w-full
                    overflow-hidden
                    break-words
                    text-[13px]
                    leading-7
                    text-[#47545a]
                    [overflow-wrap:anywhere]
                    [word-break:break-word]
                    [&_*]:max-w-full
                    [&_p]:mb-4
                    [&_p:last-child]:mb-0
                    [&_p]:break-words
                    [&_p]:[overflow-wrap:anywhere]
                    [&_strong]:font-semibold
                    [&_strong]:text-[#263832]
                    [&_b]:font-semibold
                    [&_b]:text-[#263832]
                    [&_em]:italic
                    [&_a]:font-medium
                    [&_a]:text-[#A47A2B]
                    [&_a]:underline
                    [&_a]:underline-offset-2
                    [&_ul]:mb-4
                    [&_ul]:ml-5
                    [&_ul]:max-w-full
                    [&_ul]:list-disc
                    [&_ol]:mb-4
                    [&_ol]:ml-5
                    [&_ol]:max-w-full
                    [&_ol]:list-decimal
                    [&_li]:mb-1
                    [&_li]:break-words
                    [&_li]:[overflow-wrap:anywhere]
                    [&_h1]:max-w-full
                    [&_h2]:max-w-full
                    [&_h3]:max-w-full
                    [&_h4]:max-w-full
                    [&_h5]:max-w-full
                    [&_h6]:max-w-full
                    [&_h3]:mb-3
                    [&_h3]:mt-5
                    [&_h3]:font-playfair
                    [&_h3]:text-xl
                    [&_h3]:font-semibold
                    [&_h3]:text-[#17342d]
                    [&_h4]:mb-2
                    [&_h4]:mt-4
                    [&_h4]:font-semibold
                    [&_h4]:text-[#17342d]
                    sm:text-[14px]
                    sm:leading-7
                    md:text-[15px]
                  "
                  dangerouslySetInnerHTML={{
                    __html:
                      normalizedContent,
                  }}
                />
              ) : (
                <div
                  className="
                    mt-6
                    min-w-0
                    max-w-full
                    space-y-4
                    break-words
                    text-[13px]
                    leading-7
                    text-[#47545a]
                    [overflow-wrap:anywhere]
                    [word-break:break-word]
                    sm:text-[14px]
                    sm:leading-7
                    md:text-[15px]
                  "
                >
                  {normalizedContent
                    .split(/\n\s*\n/)
                    .map(
                      (
                        paragraph,
                        index
                      ) => (
                        <p
                          key={index}
                          className="
                            max-w-full
                            break-words
                            [overflow-wrap:anywhere]
                          "
                        >
                          {paragraph.trim()}
                        </p>
                      )
                    )}
                </div>
              )}

              <a
                href="#real-estate-market"
                className="
                  mt-7
                  inline-flex
                  max-w-full
                  items-center
                  gap-2
                  break-words
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#17342d]
                  transition-colors
                  duration-300
                  hover:text-[#A47A2B]
                "
              >
                <span>Read More</span>

                <ArrowRight
                  size={14}
                  className="shrink-0"
                />
              </a>
            </div>

            {/* ==================================================
                IMAGE

                IMPORTANT:
                min-w-0 + w-full ensures image never
                overlaps the content column.
            ================================================== */}

            <div
              className="
                relative
                min-w-0
                w-full
                self-start
              "
            >
              {resolvedImage ? (
                <div
                  className="
                    relative
                    w-full
                    min-w-0
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-[#17342d]/10
                    bg-white
                    shadow-[0_24px_70px_rgba(23,52,45,0.12)]
                  "
                >
                  <div
                    className="
                      relative
                      aspect-[4/3]
                      w-full
                      min-w-0
                      overflow-hidden
                    "
                  >
                    <img
                      src={resolvedImage}
                      alt={`${locationName} real estate`}
                      className="
                        block
                        h-full
                        w-full
                        max-w-full
                        object-cover
                        transition-transform
                        duration-700
                        hover:scale-[1.03]
                      "
                    />
                  </div>

                  <div
                    className="
                      absolute
                      inset-x-0
                      bottom-0
                      bg-gradient-to-t
                      from-[#061811]/90
                      via-[#061811]/45
                      to-transparent
                      px-5
                      pb-5
                      pt-20
                    "
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <MapPin
                        size={14}
                        className="
                          shrink-0
                          text-[#D4AF37]
                        "
                      />

                      <span
                        className="
                          min-w-0
                          break-words
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.16em]
                          text-white/75
                        "
                      >
                        Location Snapshot
                      </span>
                    </div>

                    <p
                      className="
                        mt-1
                        max-w-full
                        break-words
                        font-playfair
                        text-[22px]
                        font-semibold
                        leading-tight
                        text-white
                        [overflow-wrap:anywhere]
                      "
                    >
                      {locationName}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="
                    flex
                    aspect-[4/3]
                    w-full
                    min-w-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-[28px]
                    bg-[#17342d]
                    text-white/60
                  "
                >
                  <MapPin
                    size={28}
                    className="text-[#D4AF37]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ====================================================
              SNAPSHOT CARDS
          ==================================================== */}

          <div
            className="
              mt-10
              grid
              min-w-0
              gap-3
              sm:grid-cols-3
              lg:mt-14
              lg:gap-4
            "
          >
            {highlights.map(
              (item, index) => (
                <SnapshotCard
                  key={index}
                  icon={
                    index === 0 ? (
                      <Building2 size={16} />
                    ) : index === 1 ? (
                      <Users size={16} />
                    ) : (
                      <TrendingUp size={16} />
                    )
                  }
                  title={item.title}
                  description={
                    item.description
                  }
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* ======================================================
          REAL ESTATE MARKET
      ====================================================== */}

      <section
        id="real-estate-market"
        className="
          relative
          overflow-hidden
          bg-[#17342d]
          py-16
          text-white
          sm:py-20
          lg:py-24
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#D4AF37]/[0.07]
            blur-[120px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            -left-32
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#0B251E]
            blur-[100px]
          "
        />

        <div
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-[1450px]
            min-w-0
            px-5
            sm:px-6
            md:px-8
            lg:px-10
          "
        >
          <div className="min-w-0 max-w-[850px]">
            <div
              className="
                mb-4
                flex
                min-w-0
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
              <span className="h-px w-8 shrink-0 bg-[#D4AF37]" />

              <span className="min-w-0 break-words">
                {marketEyebrow}
              </span>
            </div>

            <h2
              className="
                max-w-full
                break-words
                font-playfair
                text-[32px]
                font-semibold
                leading-[1.1]
                tracking-[-0.02em]
                text-white
                [overflow-wrap:anywhere]
                sm:text-[38px]
                md:text-[44px]
                lg:text-[50px]
              "
            >
              {marketTitle}
            </h2>

            <p
              className="
                mt-5
                max-w-[760px]
                break-words
                text-[13px]
                leading-7
                text-white/65
                [overflow-wrap:anywhere]
                sm:text-[14px]
                md:text-[15px]
              "
            >
              {marketDescription}
            </p>
          </div>

          {/* ====================================================
              MARKET INSIGHTS
          ==================================================== */}

          <div
            className="
              mt-10
              grid
              min-w-0
              gap-4
              md:grid-cols-3
              lg:mt-14
            "
          >
            {marketInsights.map(
              (item, index) => (
                <MarketInsight
                  key={index}
                  index={index}
                  title={item.title}
                  description={
                    item.description
                  }
                />
              )
            )}
          </div>

          {/* ====================================================
              PERSPECTIVE
          ==================================================== */}

          <div
            className="
              mt-10
              min-w-0
              overflow-hidden
              rounded-[24px]
              border
              border-white/10
              bg-white/[0.045]
              p-6
              backdrop-blur-xl
              sm:p-8
              lg:mt-12
            "
          >
            <div className="flex min-w-0 gap-4">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#D4AF37]/25
                  bg-[#D4AF37]/10
                "
              >
                <Quote
                  size={16}
                  className="text-[#D4AF37]"
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    max-w-full
                    break-words
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-[#D4AF37]
                  "
                >
                  {perspectiveEyebrow}
                </p>

                <p
                  className="
                    mt-3
                    max-w-[1050px]
                    break-words
                    font-playfair
                    text-[19px]
                    leading-8
                    text-white/90
                    [overflow-wrap:anywhere]
                    sm:text-[22px]
                    sm:leading-9
                  "
                >
                  {perspectiveQuote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ============================================================
   SNAPSHOT CARD
============================================================ */

function SnapshotCard({
  icon,
  title,
  description,
}) {
  return (
    <div
      className="
        min-w-0
        overflow-hidden
        rounded-[20px]
        border
        border-[#17342d]/10
        bg-white
        p-5
        shadow-[0_12px_35px_rgba(23,52,45,0.05)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_18px_45px_rgba(23,52,45,0.09)]
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#17342d]
          text-[#D4AF37]
        "
      >
        {icon}
      </div>

      <p
        className="
          mt-4
          max-w-full
          break-words
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.14em]
          text-[#17342d]
          [overflow-wrap:anywhere]
        "
      >
        {title}
      </p>

      <p
        className="
          mt-2
          max-w-full
          break-words
          text-[12px]
          leading-5
          text-[#667078]
          [overflow-wrap:anywhere]
        "
      >
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   MARKET INSIGHT
============================================================ */

function MarketInsight({
  index,
  title,
  description,
}) {
  return (
    <div
      className="
        relative
        min-w-0
        overflow-hidden
        rounded-[22px]
        border
        border-white/10
        bg-white/[0.045]
        p-6
        backdrop-blur-xl
      "
    >
      <span
        className="
          font-playfair
          text-[32px]
          font-semibold
          text-[#D4AF37]/35
        "
      >
        {String(index + 1).padStart(
          2,
          "0"
        )}
      </span>

      <h3
        className="
          mt-5
          max-w-full
          break-words
          font-playfair
          text-[22px]
          font-semibold
          text-white
          [overflow-wrap:anywhere]
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-3
          max-w-full
          break-words
          text-[12px]
          leading-6
          text-white/55
          [overflow-wrap:anywhere]
        "
      >
        {description}
      </p>

      <div className="mt-5 h-px w-10 bg-[#D4AF37]" />
    </div>
  );
}