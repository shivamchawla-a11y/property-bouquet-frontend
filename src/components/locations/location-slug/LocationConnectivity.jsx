"use client";

import {
  Plane,
  TrainFront,
  MapPinned,
  Building2,
  ShoppingBag,
  Navigation,
  ArrowRight,
} from "lucide-react";

export default function LocationConnectivity({
  location,
  locationName,
  locationImage = "",
}) {
  const connectivityItems = [
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

  const resolvedImage =
    locationImage ||
    location?.image ||
    location?.imageUrl ||
    "";

  return (
    <section
      id="connectivity"
      aria-labelledby="connectivity-heading"
      className="
        relative
        overflow-hidden
        border-t
        border-[#e8e1d7]
        bg-white
        py-10
        sm:py-12
        md:py-14
        lg:py-16
      "
    >
      <div
        className="
          mx-auto
          max-w-[1450px]
          px-5
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            grid
            items-stretch
            gap-5
            lg:grid-cols-[minmax(0,1fr)_250px]
            xl:grid-cols-[minmax(0,1fr)_280px]
            lg:gap-6
          "
        >
          {/* ====================================================
              LEFT
          ==================================================== */}

          <div className="min-w-0">
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
              <span className="h-px w-7 bg-[#C89D58]" />

              CONNECTIVITY & KEY DESTINATIONS
            </div>

            <h2
              id="connectivity-heading"
              className="
                mt-2
                max-w-[700px]
                font-playfair
                text-[27px]
                font-medium
                leading-[1.08]
                tracking-[-0.025em]
                text-[#17342d]
                sm:text-[31px]
                md:text-[35px]
                lg:text-[39px]
              "
            >
              Seamless Connectivity
              to Key Destinations
            </h2>

            <div className="mt-3 h-[2px] w-16 bg-[#C89D58]" />

            <p
              className="
                mt-4
                max-w-[820px]
                text-[10.5px]
                leading-[1.8]
                text-[#59635e]
                sm:text-[11px]
                md:text-[12px]
              "
            >
              Connectivity is one of the most important
              considerations when evaluating a real estate
              location. For buyers and investors in{" "}
              {locationName}, access to major roads,
              transport networks, employment hubs,
              commercial districts, educational
              institutions and lifestyle destinations can
              play an important role in everyday convenience
              and long-term property appeal. Use the
              destinations below as a framework for
              understanding the location's broader
              connectivity profile.
            </p>

            {/* DESTINATION CARDS */}

            <div
              className="
                mt-5
                grid
                grid-cols-2
                gap-2
                sm:grid-cols-3
                sm:gap-3
                lg:grid-cols-6
              "
            >
              {connectivityItems.map((item) => (
                <div
                  key={item.title}
                  className="
                    rounded-[12px]
                    border
                    border-[#e6dfd4]
                    bg-[#fbfaf7]
                    px-3
                    py-3
                  "
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#17342d]
                        text-[#D4AF37]
                      "
                    >
                      {item.icon}
                    </div>
                  </div>

                  <p
                    className="
                      mt-3
                      text-[9px]
                      font-semibold
                      leading-4
                      text-[#17342d]
                    "
                  >
                    {item.title}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[8px]
                      leading-4
                      text-[#858b87]
                    "
                  >
                    {item.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ====================================================
              IMAGE
          ==================================================== */}

          <div
            className="
              relative
              min-h-[220px]
              overflow-hidden
              rounded-[15px]
              bg-[#17342d]
            "
          >
            {resolvedImage ? (
              <>
                <img
                  src={resolvedImage}
                  alt={`${locationName} connectivity and surrounding area`}
                  className="
                    absolute
                    inset-0
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
                    from-[#061811]
                    via-[#061811]/30
                    to-transparent
                  "
                />
              </>
            ) : (
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-[#17342d]
                  to-[#081b15]
                "
              />
            )}

            <div
              className="
                absolute
                bottom-0
                left-0
                right-0
                p-5
              "
            >
              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[#D4AF37]
                "
              >
                LOCATION ADVANTAGE
              </p>

              <h3
                className="
                  mt-2
                  font-playfair
                  text-[21px]
                  leading-[1.2]
                  text-white
                "
              >
                A well-connected
                address for a
                brighter tomorrow.
              </h3>

              <div className="mt-3 flex items-center gap-2">
                <span
                  className="
                    h-px
                    w-8
                    bg-[#D4AF37]
                  "
                />

                <ArrowRight
                  size={12}
                  className="text-[#D4AF37]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}