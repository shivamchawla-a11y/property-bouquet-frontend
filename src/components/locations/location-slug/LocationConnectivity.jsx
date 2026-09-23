"use client";

import {
  Plane,
  TrainFront,
  MapPinned,
  Building2,
  ShoppingBag,
  Navigation,
} from "lucide-react";

export default function LocationConnectivity({
  location,
  locationName,
  locationImage = "",
  pageContent,
}) {
  const custom =
    pageContent?.connectivity || {};

  /* ============================================================
     HELPER
  ============================================================ */

  const value = (
    customValue,
    fallback
  ) => {
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
      icon: <Plane size={15} />,
    },

    {
      title: "Metro & Rail",
      subtitle: "Public transport",
      icon: <TrainFront size={15} />,
    },

    {
      title: "Key Road Network",
      subtitle: "Major routes",
      icon: <Navigation size={15} />,
    },

    {
      title: "Business Districts",
      subtitle: "Commercial hubs",
      icon: <Building2 size={15} />,
    },

    {
      title: "Golf & Leisure",
      subtitle: "Lifestyle destinations",
      icon: <MapPinned size={15} />,
    },

    {
      title: "Retail & Hospitality",
      subtitle: "Shopping & dining",
      icon: <ShoppingBag size={15} />,
    },
  ];

  /* ============================================================
     CUSTOM ITEMS

     Only the title/subtitle are configurable.
     Icons remain controlled by the component.
  ============================================================ */

  const connectivityItems =
    defaultItems.map(
      (fallback, index) => {
        const customItem =
          custom?.items?.[index] ||
          {};

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

  return (
    <section
      id="connectivity"
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
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div
          className="
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
              text-[#A47A2B]
              sm:text-[10px]
              md:text-[11px]
            "
          >
            <span className="h-px w-8 bg-[#C89D58]" />

            {eyebrow}
          </div>

          <h2
            className="
              font-playfair
              text-[32px]
              font-semibold
              leading-[1.1]
              tracking-[-0.02em]
              text-[#17342d]
              sm:text-[38px]
              md:text-[44px]
              lg:text-[50px]
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-5
              max-w-[780px]
              text-[13px]
              leading-7
              text-[#667078]
              sm:text-[14px]
              md:text-[15px]
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
            mt-10
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-3
            lg:gap-4
          "
        >
          {connectivityItems.map(
            (item, index) => (
              <ConnectivityCard
                key={index}
                icon={item.icon}
                title={item.title}
                subtitle={
                  item.subtitle
                }
              />
            )
          )}
        </div>

        {/* ======================================================
            IMAGE + ADVANTAGE
        ====================================================== */}

        <div
          className="
            mt-8
            grid
            overflow-hidden
            rounded-[28px]
            border
            border-[#17342d]/10
            bg-[#17342d]
            lg:grid-cols-[1.1fr_0.9fr]
          "
        >
          {/* IMAGE */}

          <div
            className="
              relative
              min-h-[260px]
              overflow-hidden
              lg:min-h-[360px]
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
                    duration-700
                    hover:scale-[1.03]
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#061811]/75
                    via-[#061811]/10
                    to-transparent
                  "
                />

                <div
                  className="
                    absolute
                    bottom-5
                    left-5
                    flex
                    items-center
                    gap-2
                    sm:left-6
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
                      border-white/15
                      bg-black/25
                      text-[#D4AF37]
                      backdrop-blur-md
                    "
                  >
                    <Navigation size={15} />
                  </div>

                  <span
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.17em]
                      text-white/75
                    "
                  >
                    {locationName}
                  </span>
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
                <Navigation
                  size={30}
                  className="text-[#D4AF37]"
                />
              </div>
            )}
          </div>

          {/* ADVANTAGE */}

          <div
            className="
              relative
              flex
              flex-col
              justify-center
              p-7
              sm:p-9
              lg:p-12
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

            <div className="relative">
              <div
                className="
                  flex
                  items-center
                  gap-2.5
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#D4AF37]
                  sm:text-[10px]
                "
              >
                <span className="h-px w-7 bg-[#D4AF37]" />

                {advantageEyebrow}
              </div>

              <h3
                className="
                  mt-5
                  max-w-[500px]
                  font-playfair
                  text-[28px]
                  font-semibold
                  leading-[1.12]
                  text-white
                  sm:text-[34px]
                  lg:text-[40px]
                "
              >
                {advantageTitle}
              </h3>

              <p
                className="
                  mt-5
                  max-w-[500px]
                  text-[12px]
                  leading-6
                  text-white/55
                  sm:text-[13px]
                "
              >
                {locationName} offers a
                practical balance of
                accessibility and
                destination connectivity,
                supporting both everyday
                living and long-term
                property considerations.
              </p>

              <div className="mt-7 h-px w-14 bg-[#D4AF37]" />
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
}) {
  return (
    <div
      className="
        group
        rounded-[20px]
        border
        border-[#17342d]/10
        bg-white
        p-5
        shadow-[0_10px_30px_rgba(23,52,45,0.04)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-[#C89D58]/30
        hover:shadow-[0_16px_40px_rgba(23,52,45,0.08)]
      "
    >
      <div className="flex items-start gap-4">
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
            transition-transform
            duration-300
            group-hover:scale-105
          "
        >
          {icon}
        </div>

        <div className="min-w-0">
          <h3
            className="
              text-[12px]
              font-semibold
              text-[#17342d]
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-1
              text-[10px]
              leading-5
              text-[#7A8388]
            "
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}