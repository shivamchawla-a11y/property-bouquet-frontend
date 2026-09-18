"use client";

import Link from "next/link";

import {
  MapPin,
  ArrowRight,
} from "lucide-react";

export default function NearbyLocations({
  location,
  locationName,
  properties = [],
  buildPublicLocationSlug,
}) {
  // ============================================================
  // COLLECT NEARBY LOCATION NAMES FROM PROPERTY HIERARCHIES
  // ============================================================

  const nearbyMap = new Map();

  properties.forEach((property) => {
    let current =
      property?.locationData?.locationRef;

    const visited = new Set();

    while (current) {
      const id =
        current?._id?.toString?.() ||
        current?.id?.toString?.() ||
        current?.slug ||
        current?.name;

      if (id && visited.has(id)) {
        break;
      }

      if (id) {
        visited.add(id);
      }

      const name = String(
        current?.name || ""
      ).trim();

      if (
        name &&
        name.toLowerCase() !==
          String(locationName)
            .toLowerCase()
            .trim()
      ) {
        if (!nearbyMap.has(name)) {
          nearbyMap.set(name, current);
        }
      }

      current = current?.parent;
    }
  });

  // ============================================================
  // CHILD LOCATIONS
  // ============================================================

  const children =
    Array.isArray(location?.children)
      ? location.children
      : [];

  children.forEach((child) => {
    const name = String(
      child?.name || ""
    ).trim();

    if (
      name &&
      name.toLowerCase() !==
        String(locationName)
          .toLowerCase()
          .trim()
    ) {
      nearbyMap.set(name, child);
    }
  });

  const nearbyLocations =
    Array.from(nearbyMap.values()).slice(0, 10);

  return (
    <section
      id="nearby-locations"
      aria-labelledby="nearby-locations-heading"
      className="
        relative
        overflow-hidden
        border-t
        border-[#e8e1d7]
        bg-[#f7f3ec]
        py-9
        sm:py-11
        md:py-13
        lg:py-14
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
        <div className="max-w-[800px]">
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

            EXPLORE MORE
          </div>

          <h2
            id="nearby-locations-heading"
            className="
              mt-2
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
            Explore Nearby Locations
          </h2>

          <div className="mt-3 h-[2px] w-16 bg-[#C89D58]" />

          <p
            className="
              mt-4
              max-w-[800px]
              text-[10.5px]
              leading-[1.8]
              text-[#59635e]
              sm:text-[11px]
              md:text-[12px]
            "
          >
            Explore connected neighbourhoods and
            surrounding areas to understand the wider real
            estate landscape around {locationName}. Nearby
            locations can offer different property formats,
            price segments and development opportunities.
          </p>
        </div>

        {/* ====================================================
            LOCATION CHIPS
        ==================================================== */}

        <div
          className="
            mt-5
            flex
            flex-wrap
            gap-2
          "
        >
          {nearbyLocations.length > 0 ? (
            nearbyLocations.map((nearby) => {
              const nearbySlug =
                typeof buildPublicLocationSlug ===
                "function"
                  ? buildPublicLocationSlug(
                      nearby
                    )
                  : "";

              if (!nearbySlug) {
                return (
                  <span
                    key={nearby.name}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-[#ddd4c6]
                      bg-white
                      px-3
                      py-1.5
                      text-[8.5px]
                      font-medium
                      text-[#59635e]
                    "
                  >
                    <MapPin
                      size={10}
                      className="text-[#B58B2D]"
                    />

                    {nearby.name}
                  </span>
                );
              }

              return (
                <Link
                  key={nearby.name}
                  href={`/locations/${nearbySlug}`}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-[#ddd4c6]
                    bg-white
                    px-3
                    py-1.5
                    text-[8.5px]
                    font-medium
                    text-[#59635e]
                    transition-all
                    hover:border-[#C89D58]
                    hover:text-[#17342d]
                  "
                >
                  <MapPin
                    size={10}
                    className="text-[#B58B2D]"
                  />

                  {nearby.name}

                  <ArrowRight size={9} />
                </Link>
              );
            })
          ) : (
            <span
              className="
                text-[9px]
                text-[#858b87]
              "
            >
              Explore surrounding locations through
              the Property Bouquet property collection.
            </span>
          )}
        </div>
      </div>
    </section>
  );
}