"use client";

import {
  Plane,
  TrainFront,
  MapPinned,
  Building2,
  ShoppingBag,
  Navigation,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function LocationConnectivity({
  location,
  locationName,
  locationImage = "",
  pageContent,
}) {
  const custom = pageContent?.connectivity || {};

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
     DEFAULT CONNECTIVITY
  ============================================================ */

  const defaultItems = [
    {
      title: "Major Airport",
      subtitle: "Air connectivity",
      icon: <Plane size={20} strokeWidth={1.7} />,
    },

    {
      title: "Metro & Rail",
      subtitle: "Public transport",
      icon: <TrainFront size={20} strokeWidth={1.7} />,
    },

    {
      title: "Key Road Network",
      subtitle: "Major routes",
      icon: <Navigation size={20} strokeWidth={1.7} />,
    },

    {
      title: "Business Districts",
      subtitle: "Commercial hubs",
      icon: <Building2 size={20} strokeWidth={1.7} />,
    },

    {
      title: "Golf & Leisure",
      subtitle: "Lifestyle destinations",
      icon: <MapPinned size={20} strokeWidth={1.7} />,
    },

    {
      title: "Retail & Hospitality",
      subtitle: "Shopping & dining",
      icon: <ShoppingBag size={20} strokeWidth={1.7} />,
    },
  ];

  /* ============================================================
     CUSTOM ITEMS

     Only title/subtitle are configurable.
     Icons remain controlled by the component.
  ============================================================ */

  const connectivityItems = defaultItems.map(
    (fallback, index) => {
      const customItem =
        custom?.items?.[index] || {};

      return {
        ...fallback,

        title: value(
          customItem.title,
          fallback.title
        ),

        subtitle: value(
          customItem.subtitle,
          fallback.subtitle
        ),
      };
    }
  );

  /* ============================================================
     DEFAULT COPY
  ============================================================ */

  const defaultDescription = `Located in ${locationName}, the address benefits from access to important roads, transportation networks, business destinations, lifestyle districts and everyday conveniences. Its connectivity profile adds to the practicality of the location for both residents and investors.`;

  const eyebrow = value(
    custom.eyebrow,
    "CONNECTIVITY & KEY DESTINATIONS"
  );

  const title = value(
    custom.title,
    "Seamless Connectivity to Key Destinations"
  );

  const description = value(
    custom.description,
    defaultDescription
  );

  const advantageEyebrow = value(
    custom.advantageEyebrow,
    "LOCATION ADVANTAGE"
  );

  const advantageTitle = value(
    custom.advantageTitle,
    "A well-connected address for a brighter tomorrow."
  );

  /* ============================================================
     IMAGE
  ============================================================ */

  const resolvedImage =
    typeof custom?.image === "string" &&
    custom.image.trim()
      ? custom.image.trim()
      : locationImage ||
        location?.image ||
        location?.imageUrl ||
        "";

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <section
      id="connectivity"
      aria-labelledby="connectivity-heading"
      className="
        relative
        overflow-hidden
        border-t
        border-[#e5ded4]
        bg-[#f7f7f5]
        py-14
        sm:py-16
        md:py-18
        lg:py-20
      "
    >
      {/* ========================================================
          BACKGROUND DETAILS
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-[-180px]
          top-[-180px]
          h-[460px]
          w-[460px]
          rounded-full
          bg-[#D4AF37]/[0.035]
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-200px]
          right-[-180px]
          h-[480px]
          w-[480px]
          rounded-full
          bg-[#17342d]/[0.025]
          blur-[130px]
        "
      />

      {/* ========================================================
          MAIN CONTAINER
      ======================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1450px]
          px-5
          sm:px-7
          lg:px-10
          xl:px-12
        "
      >
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="max-w-[880px]">
          {/* Eyebrow */}

          <div
            className="
              flex
              items-center
              gap-2.5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.24em]
              text-[#8F7335]
              sm:text-[11px]
            "
          >
            <span className="h-px w-8 bg-[#C89D58]" />

            <span>{eyebrow}</span>

            <span className="hidden h-px w-5 bg-[#C89D58]/40 sm:block" />
          </div>

          {/* Heading */}

          <h2
            id="connectivity-heading"
            className="
              mt-3
              max-w-[850px]
              font-playfair
              text-[34px]
              font-medium
              leading-[1.08]
              tracking-[-0.03em]
              text-[#17342d]
              sm:text-[39px]
              md:text-[44px]
              lg:text-[48px]
              xl:text-[50px]
            "
          >
            {title}
          </h2>

          {/* Gold divider */}

          <div className="mt-5 flex items-center gap-2">
            <div className="h-[2px] w-14 bg-[#C89D58]" />

            <div className="h-[2px] w-2 bg-[#D4AF37]/40" />
          </div>

          {/* Description */}

          <p
            className="
              mt-5
              max-w-[820px]
              text-[13px]
              leading-[1.8]
              text-[#59635e]
              sm:text-[13.5px]
              md:text-[14px]
              lg:text-[14.5px]
            "
          >
            {description}
          </p>
        </div>

        {/* ======================================================
            CONNECTIVITY GRID
        ====================================================== */}

        <div
          className="
            mt-9
            grid
            gap-4
            sm:mt-10
            sm:grid-cols-2
            lg:grid-cols-3
            lg:gap-5
          "
        >
          {connectivityItems.map(
            (item, index) => (
              <ConnectivityCard
                key={`${item.title}-${index}`}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                index={index}
              />
            )
          )}
        </div>

        {/* ======================================================
            IMAGE + LOCATION ADVANTAGE
        ====================================================== */}

        <div
          className="
            relative
            mt-8
            grid
            overflow-hidden
            rounded-[26px]
            border
            border-[#17342d]/10
            bg-[#17342d]
            shadow-[0_22px_60px_rgba(23,52,45,0.10)]
            lg:mt-10
            lg:grid-cols-[1.08fr_0.92fr]
          "
        >
          {/* ====================================================
              IMAGE PANEL
          ==================================================== */}

          <div
            className="
              relative
              min-h-[300px]
              overflow-hidden
              sm:min-h-[340px]
              lg:min-h-[430px]
            "
          >
            {resolvedImage ? (
              <>
                <img
                  src={resolvedImage}
                  alt={`${locationName} connectivity`}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-1000
                    ease-out
                    hover:scale-[1.035]
                  "
                />

                {/* Image overlay */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-[#061811]/35
                    via-[#061811]/5
                    to-transparent
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

                {/* Image top label */}

                <div
                  className="
                    absolute
                    left-5
                    top-5
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/15
                    bg-black/20
                    px-3
                    py-2
                    backdrop-blur-md
                    sm:left-6
                    sm:top-6
                  "
                >
                  <Sparkles
                    size={12}
                    strokeWidth={1.6}
                    className="text-[#D4AF37]"
                  />

                  <span
                    className="
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-white/75
                      sm:text-[9px]
                    "
                  >
                    Location Connectivity
                  </span>
                </div>

                {/* Image bottom location */}

                <div
                  className="
                    absolute
                    bottom-5
                    left-5
                    flex
                    items-center
                    gap-3
                    sm:bottom-6
                    sm:left-6
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/15
                      bg-black/25
                      text-[#D4AF37]
                      backdrop-blur-md
                    "
                  >
                    <Navigation
                      size={17}
                      strokeWidth={1.7}
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-white/50
                      "
                    >
                      Location
                    </p>

                    <span
                      className="
                        mt-0.5
                        block
                        text-[12px]
                        font-medium
                        text-white
                        sm:text-[13px]
                      "
                    >
                      {locationName}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  bg-[#0B251E]
                "
              >
                <div className="text-center">
                  <div
                    className="
                      mx-auto
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#D4AF37]/20
                      bg-[#D4AF37]/10
                    "
                  >
                    <Navigation
                      size={28}
                      strokeWidth={1.5}
                      className="text-[#D4AF37]"
                    />
                  </div>

                  <p
                    className="
                      mt-4
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-white/45
                    "
                  >
                    {locationName}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ====================================================
              ADVANTAGE PANEL
          ==================================================== */}

          <div
            className="
              relative
              flex
              min-h-[340px]
              flex-col
              justify-center
              overflow-hidden
              p-7
              sm:p-9
              lg:min-h-[430px]
              lg:p-12
              xl:p-14
            "
          >
            {/* Decorative glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-64
                w-64
                rounded-full
                bg-[#D4AF37]/10
                blur-[85px]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                bottom-[-100px]
                left-[-80px]
                h-52
                w-52
                rounded-full
                bg-[#D4AF37]/[0.035]
                blur-[70px]
              "
            />

            {/* Decorative circle */}

            <div
              className="
                pointer-events-none
                absolute
                right-8
                top-8
                h-20
                w-20
                rounded-full
                border
                border-[#D4AF37]/10
                sm:right-10
                sm:top-10
              "
            />

            <div className="relative">
              {/* Eyebrow */}

              <div
                className="
                  flex
                  items-center
                  gap-2.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-[#D4AF37]
                  sm:text-[11px]
                "
              >
                <span className="h-px w-8 bg-[#D4AF37]" />

                <span>{advantageEyebrow}</span>
              </div>

              {/* Title */}

              <h3
                className="
                  mt-5
                  max-w-[520px]
                  font-playfair
                  text-[30px]
                  font-medium
                  leading-[1.12]
                  tracking-[-0.02em]
                  text-white
                  sm:text-[35px]
                  lg:text-[40px]
                  xl:text-[42px]
                "
              >
                {advantageTitle}
              </h3>

              {/* Description */}

              <p
                className="
                  mt-5
                  max-w-[520px]
                  text-[12.5px]
                  leading-[1.8]
                  text-white/55
                  sm:text-[13px]
                  lg:text-[13.5px]
                "
              >
                {locationName} offers a practical
                balance of accessibility and
                destination connectivity,
                supporting both everyday living
                and long-term property
                considerations.
              </p>

              {/* Divider */}

              <div className="mt-7 flex items-center gap-2">
                <div className="h-[2px] w-14 bg-[#D4AF37]" />
                <div className="h-[2px] w-2 bg-[#D4AF37]/40" />
              </div>

              {/* Bottom mini information */}

              <div
                className="
                  mt-7
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#D4AF37]/20
                    bg-[#D4AF37]/10
                    text-[#D4AF37]
                  "
                >
                  <ArrowRight
                    size={15}
                    strokeWidth={1.7}
                  />
                </div>

                <p
                  className="
                    max-w-[350px]
                    text-[10px]
                    leading-[1.55]
                    text-white/40
                    sm:text-[10.5px]
                  "
                >
                  A location profile shaped by
                  accessibility, convenience
                  and connections to key
                  destinations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CONNECTIVITY CARD
============================================================ */

function ConnectivityCard({
  icon,
  title,
  subtitle,
  index,
}) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[20px]
        border
        border-[#ddd8d0]
        bg-white
        p-5
        shadow-[0_8px_28px_rgba(23,52,45,0.035)]
        transition-all
        duration-400
        hover:-translate-y-1
        hover:border-[#C89D58]/40
        hover:shadow-[0_18px_45px_rgba(23,52,45,0.085)]
        sm:p-6
      "
    >
      {/* Subtle hover glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-24
          w-24
          rounded-full
          bg-[#D4AF37]/0
          blur-[25px]
          transition-all
          duration-500
          group-hover:bg-[#D4AF37]/[0.07]
        "
      />

      {/* Top line */}

      <div
        className="
          absolute
          left-5
          right-5
          top-0
          h-[2px]
          scale-x-0
          bg-[#D4AF37]
          transition-transform
          duration-500
          origin-left
          group-hover:scale-x-100
        "
      />

      <div className="relative flex items-start gap-4">
        {/* Icon */}

        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-[14px]
            bg-[#17342d]
            text-[#D4AF37]
            shadow-[0_7px_20px_rgba(23,52,45,0.10)]
            transition-all
            duration-300
            group-hover:scale-105
            group-hover:bg-[#D4AF37]
            group-hover:text-[#17342d]
          "
        >
          {icon}
        </div>

        {/* Content */}

        <div className="min-w-0 flex-1">
          {/* Number */}

          <div
            className="
              mb-1.5
              text-[8px]
              font-semibold
              tracking-[0.18em]
              text-[#A18A5A]
            "
          >
            0{index + 1}
          </div>

          {/* Title */}

          <h3
            className="
              font-playfair
              text-[17px]
              font-medium
              leading-[1.25]
              tracking-[-0.01em]
              text-[#17342d]
              sm:text-[18px]
            "
          >
            {title}
          </h3>

          {/* Subtitle */}

          <p
            className="
              mt-1.5
              text-[11px]
              leading-[1.55]
              text-[#7A8388]
              sm:text-[11.5px]
            "
          >
            {subtitle}
          </p>
        </div>

        {/* Arrow */}

        <div
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-[#e3ddd3]
            text-[#8F7335]
            opacity-0
            translate-x-1
            transition-all
            duration-300
            group-hover:translate-x-0
            group-hover:opacity-100
          "
        >
          <ArrowRight
            size={12}
            strokeWidth={1.7}
          />
        </div>
      </div>
    </div>
  );
}