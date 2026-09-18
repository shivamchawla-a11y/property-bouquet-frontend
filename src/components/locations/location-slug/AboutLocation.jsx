"use client";

import {
  MapPin,
  TrendingUp,
  Navigation,
  BadgeCheck,
  ArrowRight,
  Landmark,
  BarChart3,
  Building2,
} from "lucide-react";

export default function AboutLocation({
  location,
  locationName,
  locationDescription,
  properties = [],
  locationImage = "",
}) {
  // ============================================================
  // RESOLVE LOCATION IMAGE
  // ============================================================

  const resolvedLocationImage =
    locationImage ||
    location?.image ||
    location?.imageUrl ||
    properties?.[0]?.locationImage ||
    properties?.[0]?.media?.locationImageUrl ||
    properties?.[0]?.media?.heroImageUrl ||
    properties?.[0]?.media?.images?.[0]?.url ||
    "";

  // ============================================================
  // LOCATION DESCRIPTION
  // ============================================================

  const description =
    locationDescription ||
    `Explore ${locationName} through a curated view of its residential character, connectivity, infrastructure and evolving real estate landscape. Property Bouquet brings together premium developments and property opportunities for buyers and investors looking to understand this market with greater clarity.`;

  const paragraphs = description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  // ============================================================
  // DEVELOPERS
  // ============================================================

  const developers = new Set();

  properties.forEach((property) => {
    const developer =
      property?.developerName ||
      property?.coreDetails?.developerName ||
      property?.developer?.name ||
      property?.developerData?.name ||
      property?.developerRef?.name;

    if (developer) {
      developers.add(String(developer).trim());
    }
  });

  // ============================================================
  // PROPERTY TYPES
  // ============================================================

  const propertyTypes = new Set();

  properties.forEach((property) => {
    const type =
      property?.categoryName ||
      property?.coreDetails?.categoryName ||
      property?.propertyType ||
      property?.type;

    if (type) {
      propertyTypes.add(String(type).trim());
    }
  });

  const propertyTypeText =
    Array.from(propertyTypes)
      .filter(Boolean)
      .slice(0, 3)
      .join(", ") || "Premium Residences";

  // ============================================================
  // PRICE RANGE
  // ============================================================

  const prices = properties
    .map((property) => {
      const value =
        property?.coreDetails?.startingPrice ??
        property?.startingPrice ??
        property?.unitConfigurations?.[0]?.price;

      const numericValue = Number(value);

      return Number.isFinite(numericValue) &&
        numericValue > 0
        ? numericValue
        : null;
    })
    .filter(Boolean);

  const formatPrice = (value) => {
    if (!value) return null;

    const crore = value / 10000000;

    if (crore >= 10) {
      return `₹${crore.toFixed(0)} Cr+`;
    }

    return `₹${crore.toFixed(1)} Cr`;
  };

  const minPrice =
    prices.length > 0
      ? Math.min(...prices)
      : null;

  const maxPrice =
    prices.length > 0
      ? Math.max(...prices)
      : null;

  const priceRange =
    minPrice && maxPrice
      ? minPrice === maxPrice
        ? formatPrice(minPrice)
        : `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
      : "Premium Segment";

  // ============================================================
  // MARKET INSIGHTS
  // ============================================================

  const marketInsights = [
    {
      icon: <TrendingUp size={15} strokeWidth={1.7} />,
      title: "Growing Demand",
      description:
        "Increasing interest across residential segments",
    },
    {
      icon: <Building2 size={15} strokeWidth={1.7} />,
      title: "Premium Developments",
      description:
        "Established and emerging residential communities",
    },
    {
      icon: <Navigation size={15} strokeWidth={1.7} />,
      title: "Connectivity Advantage",
      description:
        "Access shaped by roads, transit and infrastructure",
    },
  ];

  return (
    <>
      {/* ========================================================
          SECTION 1 — ABOUT THE LOCATION
          ======================================================== */}

      <section
        id="about-location"
        aria-labelledby="about-location-heading"
        className="
          relative
          overflow-hidden
          border-t
          border-[#e8e1d7]
          bg-[#f7f3ec]
          py-9
          sm:py-10
          md:py-12
          lg:py-14
        "
      >
        {/* ======================================================
            SUBTLE DECORATIVE ELEMENT
        ====================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[-160px]
            top-[-180px]
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#D4AF37]/[0.035]
            blur-[110px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[-220px]
            left-[-180px]
            h-[400px]
            w-[400px]
            rounded-full
            bg-[#17342d]/[0.025]
            blur-[120px]
          "
        />

        {/* ======================================================
            MAIN CONTAINER
        ====================================================== */}

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-[1450px]
            px-5
            sm:px-6
            lg:px-8
          "
        >
          {/* ====================================================
              TOP EDITORIAL GRID
          ==================================================== */}

          <div
            className="
              grid
              items-start
              gap-6
              lg:grid-cols-[minmax(0,1fr)_225px_245px]
              lg:gap-4
              xl:grid-cols-[minmax(0,1fr)_245px_260px]
              xl:gap-5
            "
          >
            {/* ==================================================
                LEFT — LOCATION STORY
            ================================================== */}

            <div
              className="
                min-w-0
                lg:pr-4
                xl:pr-7
              "
            >
              {/* EYEBROW */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-[#8F7335]
                  sm:text-[9px]
                  md:text-[10px]
                "
              >
                <span
                  className="
                    h-px
                    w-7
                    bg-[#C89D58]
                    sm:w-9
                  "
                />

                About The Location
              </div>

              {/* ==================================================
                  HEADING
              ================================================== */}

              <h2
                id="about-location-heading"
                className="
                  mt-2
                  max-w-[720px]
                  font-playfair
                  text-[28px]
                  font-medium
                  leading-[1.08]
                  tracking-[-0.028em]
                  text-[#17342d]
                  sm:text-[32px]
                  md:text-[36px]
                  lg:text-[39px]
                  xl:text-[42px]
                "
              >
                {locationName}
              </h2>

              {/* GOLD ACCENT */}

              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-2
                "
              >
                <div
                  className="
                    h-[2px]
                    w-16
                    bg-[#C89D58]
                    sm:w-20
                  "
                />

                <div
                  className="
                    h-1
                    w-1
                    rounded-full
                    bg-[#C89D58]
                  "
                />
              </div>

              {/* ==================================================
                  DESCRIPTION
              ================================================== */}

              <div
                className="
                  mt-4
                  max-w-[720px]
                  space-y-3
                "
              >
                {paragraphs.map(
                  (paragraph, index) => (
                    <p
                      key={`location-description-${index}`}
                      className="
                        whitespace-pre-line
                        text-[10.5px]
                        leading-[1.75]
                        text-[#59635e]
                        sm:text-[11px]
                        md:text-[12px]
                        lg:text-[12.5px]
                        lg:leading-[1.82]
                      "
                    >
                      {paragraph}
                    </p>
                  )
                )}
              </div>

              {/* ==================================================
                  READ MORE
              ================================================== */}

              <a
                href="#real-estate-market"
                className="
                  mt-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-[8px]
                  bg-[#17342d]
                  px-3.5
                  py-2
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-white
                  shadow-[0_8px_22px_rgba(23,52,45,0.10)]
                  transition-all
                  duration-300
                  hover:-translate-y-[1px]
                  hover:bg-[#0f2922]
                  sm:px-4
                  sm:py-2.5
                  sm:text-[9px]
                "
              >
                Read More

                <ArrowRight
                  size={11}
                  strokeWidth={1.8}
                />
              </a>
            </div>

            {/* ==================================================
                CENTER — LOCATION IMAGE
            ================================================== */}

            <div
              className="
                relative
                h-[190px]
                overflow-hidden
                rounded-[16px]
                border
                border-[#ddd4c6]
                bg-[#17342d]
                shadow-[0_12px_35px_rgba(23,52,45,0.08)]
                sm:h-[205px]
                md:h-[215px]
                lg:h-[190px]
                xl:h-[220px]
              "
            >
              {resolvedLocationImage ? (
                <>
                  <img
                    src={resolvedLocationImage}
                    alt={`${locationName} real estate`}
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-cover
                      object-center
                      transition-transform
                      duration-700
                      hover:scale-[1.035]
                    "
                  />

                  {/* IMAGE OVERLAY */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-[#061811]/45
                      via-transparent
                      to-white/[0.03]
                    "
                  />

                  {/* IMAGE BORDER */}

                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      inset-3
                      rounded-[11px]
                      border
                      border-white/15
                    "
                  />

                  {/* IMAGE LABEL */}

                  <div
                    className="
                      absolute
                      bottom-3
                      left-3
                      right-3
                      flex
                      items-center
                      gap-2
                      rounded-[9px]
                      border
                      border-white/10
                      bg-[#061811]/45
                      px-3
                      py-2
                      backdrop-blur-md
                    "
                  >
                    <MapPin
                      size={12}
                      className="shrink-0 text-[#D4AF37]"
                    />

                    <div className="min-w-0">
                      <p
                        className="
                          text-[7px]
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          text-[#D4AF37]
                        "
                      >
                        Prime Location
                      </p>

                      <p
                        className="
                          mt-0.5
                          truncate
                          text-[9px]
                          font-medium
                          text-white
                        "
                      >
                        {locationName}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    bg-gradient-to-br
                    from-[#17342d]
                    to-[#0b221b]
                  "
                >
                  <MapPin
                    size={36}
                    strokeWidth={1.1}
                    className="text-[#D4AF37]/70"
                  />
                </div>
              )}
            </div>

            {/* ==================================================
                RIGHT — LOCATION SNAPSHOT
            ================================================== */}

            <div
              className="
                overflow-hidden
                rounded-[16px]
                bg-[#17342d]
                text-white
                shadow-[0_12px_35px_rgba(15,59,46,0.12)]
              "
            >
              {/* HEADER */}

              <div
                className="
                  border-b
                  border-white/10
                  px-4
                  py-3.5
                  sm:px-5
                  sm:py-4
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <div
                    className="
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-md
                      bg-[#D4AF37]/10
                    "
                  >
                    <MapPin
                      size={12}
                      className="text-[#D4AF37]"
                    />
                  </div>

                  <p
                    className="
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.17em]
                      text-[#D4AF37]
                      sm:text-[9px]
                    "
                  >
                    Location Snapshot
                  </p>
                </div>
              </div>

              {/* SNAPSHOT ROWS */}

              <div className="divide-y divide-white/10 px-4 sm:px-5">
                <SnapshotRow
                  label="Location"
                  value={locationName}
                />

                <SnapshotRow
                  label="Projects"
                  value={`${properties.length || 0}+`}
                />

                <SnapshotRow
                  label="Property Types"
                  value={propertyTypeText}
                />

                <SnapshotRow
                  label="Segment"
                  value="Premium & Luxury"
                />

                <SnapshotRow
                  label="Developers"
                  value={
                    developers.size
                      ? `${developers.size}+`
                      : "Multiple"
                  }
                />

                <SnapshotRow
                  label="Price Range"
                  value={priceRange}
                />
              </div>
            </div>
          </div>

          {/* ====================================================
              SECTION DIVIDER
          ==================================================== */}

          <div
            className="
              mt-8
              h-px
              w-full
              bg-[#e3dbcf]
              md:mt-9
            "
          />
        </div>
      </section>

      {/* ========================================================
          SECTION 2 — REAL ESTATE MARKET
          ======================================================== */}

      <section
        id="real-estate-market"
        aria-labelledby="real-estate-market-heading"
        className="
          relative
          overflow-hidden
          bg-[#f7f3ec]
          pb-10
          pt-8
          sm:pb-11
          sm:pt-9
          md:pb-12
          md:pt-10
          lg:pb-14
          lg:pt-11
        "
      >
        <div
          className="
            relative
            z-10
            mx-auto
            max-w-[1450px]
            px-5
            sm:px-6
            lg:px-8
          "
        >
          {/* ====================================================
              MARKET GRID
          ==================================================== */}

          <div
            className="
              grid
              items-stretch
              gap-5
              lg:grid-cols-[minmax(0,1fr)_390px]
              xl:grid-cols-[minmax(0,1fr)_430px]
              lg:gap-7
            "
          >
            {/* ==================================================
                LEFT — MARKET STORY
            ================================================== */}

            <div className="min-w-0">
              {/* EYEBROW */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-[#8F7335]
                  sm:text-[9px]
                  md:text-[10px]
                "
              >
                <span
                  className="
                    h-px
                    w-7
                    bg-[#C89D58]
                    sm:w-9
                  "
                />

                Real Estate Market
              </div>

              {/* H2 */}

              <h2
                id="real-estate-market-heading"
                className="
                  mt-2
                  max-w-[620px]
                  font-playfair
                  text-[28px]
                  font-medium
                  leading-[1.08]
                  tracking-[-0.028em]
                  text-[#17342d]
                  sm:text-[32px]
                  md:text-[36px]
                  lg:text-[39px]
                "
              >
                A Thriving Real Estate
                Destination
              </h2>

              {/* GOLD ACCENT */}

              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-2
                "
              >
                <div
                  className="
                    h-[2px]
                    w-16
                    bg-[#C89D58]
                    sm:w-20
                  "
                />

                <div
                  className="
                    h-1
                    w-1
                    rounded-full
                    bg-[#C89D58]
                  "
                />
              </div>

              {/* MARKET DESCRIPTION */}

              <p
                className="
                  mt-4
                  max-w-[760px]
                  text-[10.5px]
                  leading-[1.75]
                  text-[#59635e]
                  sm:text-[11px]
                  md:text-[12px]
                  md:leading-[1.82]
                  lg:text-[12.5px]
                "
              >
                {locationName} continues to evolve as a
                residential destination, shaped by
                connectivity, infrastructure and the
                development of new communities. The market
                brings together established neighbourhoods,
                premium residences and emerging
                opportunities, giving homebuyers and
                investors a broader range of property choices
                to consider.
              </p>

              {/* ==================================================
                  MARKET INSIGHTS
              ================================================== */}

              <div
                className="
                  mt-5
                  grid
                  gap-2.5
                  sm:grid-cols-3
                  sm:gap-3
                  lg:max-w-[820px]
                "
              >
                {marketInsights.map(
                  (insight) => (
                    <MarketInsight
                      key={insight.title}
                      icon={insight.icon}
                      title={insight.title}
                      description={
                        insight.description
                      }
                    />
                  )
                )}
              </div>
            </div>

            {/* ==================================================
                RIGHT — EDITORIAL QUOTE
            ================================================== */}

            <div
              className="
                relative
                flex
                min-h-[210px]
                flex-col
                justify-between
                overflow-hidden
                rounded-[16px]
                border
                border-[#e2d9cb]
                bg-[#fbf8f2]
                p-5
                sm:p-6
                lg:min-h-full
              "
            >
              {/* DECORATIVE QUOTE */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  right-5
                  top-0
                  font-playfair
                  text-[72px]
                  leading-none
                  text-[#D4AF37]/[0.16]
                "
              >
                “
              </div>

              {/* TOP CONTENT */}

              <div className="relative z-10">
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      h-px
                      w-5
                      bg-[#C89D58]
                    "
                  />

                  <p
                    className="
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-[#B58B2D]
                    "
                  >
                    Market Perspective
                  </p>
                </div>

                <blockquote
                  className="
                    mt-4
                    max-w-[330px]
                    font-playfair
                    text-[21px]
                    font-medium
                    leading-[1.28]
                    tracking-[-0.018em]
                    text-[#17342d]
                    sm:text-[23px]
                    lg:text-[24px]
                  "
                >
                  A well-connected address,
                  shaped for modern living
                  and long-term opportunity.
                </blockquote>
              </div>

              {/* BOTTOM META */}

              <div
                className="
                  relative
                  z-10
                  mt-6
                  flex
                  items-center
                  justify-between
                  border-t
                  border-[#e5ddd1]
                  pt-4
                "
              >
                <div className="min-w-0">
                  <p
                    className="
                      text-[7px]
                      font-medium
                      uppercase
                      tracking-[0.17em]
                      text-[#9a9b94]
                    "
                  >
                    Location
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-[10px]
                      font-semibold
                      text-[#17342d]
                    "
                  >
                    {locationName}
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#17342d]
                    shadow-[0_5px_15px_rgba(23,52,45,0.15)]
                  "
                >
                  <ArrowRight
                    size={13}
                    strokeWidth={1.8}
                    className="text-[#D4AF37]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* =============================================================
   SNAPSHOT ROW
============================================================= */

function SnapshotRow({
  label,
  value,
}) {
  return (
    <div
      className="
        flex
        min-h-[34px]
        items-center
        justify-between
        gap-3
        py-2
      "
    >
      <span
        className="
          shrink-0
          text-[8px]
          font-medium
          text-white/45
          sm:text-[9px]
        "
      >
        {label}
      </span>

      <span
        className="
          max-w-[64%]
          text-right
          text-[8px]
          font-medium
          leading-[1.4]
          text-white/80
          sm:text-[9px]
        "
      >
        {value}
      </span>
    </div>
  );
}

/* =============================================================
   MARKET INSIGHT CARD
============================================================= */

function MarketInsight({
  icon,
  title,
  description,
}) {
  return (
    <div
      className="
        flex
        min-w-0
        items-start
        gap-3
        rounded-[12px]
        border
        border-[#e3dbd0]
        bg-white/65
        px-3
        py-3
        transition-all
        duration-300
        hover:-translate-y-[1px]
        hover:border-[#d6c7b2]
        hover:bg-white
        sm:px-3.5
        sm:py-3.5
      "
    >
      {/* ICON */}

      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-[9px]
          bg-[#17342d]
          text-[#D4AF37]
          shadow-[0_5px_15px_rgba(23,52,45,0.08)]
        "
      >
        {icon}
      </div>

      {/* CONTENT */}

      <div className="min-w-0">
        <p
          className="
            text-[9px]
            font-semibold
            leading-4
            text-[#17342d]
            sm:text-[10px]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            text-[8px]
            leading-[1.45]
            text-[#858b87]
            sm:text-[9px]
            sm:leading-4
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}