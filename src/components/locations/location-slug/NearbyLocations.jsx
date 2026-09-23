"use client";

import Link from "next/link";
import {
  ArrowRight,
  MapPin,
} from "lucide-react";

export default function NearbyLocations({
  location,
  locationName,
  properties = [],
  buildPublicLocationSlug,
  pageContent,
}) {
  const custom =
    pageContent?.nearby || {};

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
     DEFAULT COPY
  ============================================================ */

  const eyebrow = value(
    custom.eyebrow,
    "EXPLORE MORE"
  );

  const title = value(
    custom.title,
    "Explore Nearby Locations"
  );

  const description = value(
    custom.description,
    `Discover nearby locations around ${locationName}, with access to complementary residential, commercial, lifestyle and investment opportunities across the wider area.`
  );

  /* ============================================================
     CURRENT LOCATION ID
  ============================================================ */

  const currentLocationId =
    location?._id?.toString?.() ||
    location?.id?.toString?.() ||
    location?.slug ||
    location?.name;

  /* ============================================================
     FIND LOCATION FROM PROPERTY
  ============================================================ */

  const getPropertyLocation =
    (property) => {
      return (
        property?.locationData
          ?.locationRef ||
        property?.locationRef ||
        property?.location
      );
    };

  /* ============================================================
     LOCATION ID HELPER
  ============================================================ */

  const getLocationId = (
    item
  ) => {
    return (
      item?._id?.toString?.() ||
      item?.id?.toString?.() ||
      item?.slug ||
      item?.name
    );
  };

  /* ============================================================
     DIRECT CHILDREN
  ============================================================ */

  const directChildren = Array.isArray(
    location?.children
  )
    ? location.children
    : [];

  /* ============================================================
     COLLECT NEARBY LOCATIONS
     
     Priority:
     1. Direct children of current location
     2. Locations appearing in property hierarchy
     3. Parent's other direct children
  ============================================================ */

  const nearbyMap = new Map();

  /* ------------------------------------------------------------
     1. DIRECT CHILDREN
  ------------------------------------------------------------ */

  directChildren.forEach(
    (child) => {
      const childId =
        getLocationId(child);

      if (
        !childId ||
        childId ===
          currentLocationId
      ) {
        return;
      }

      nearbyMap.set(
        childId,
        child
      );
    }
  );

  /* ------------------------------------------------------------
     2. PROPERTY LOCATION HIERARCHY
  ------------------------------------------------------------ */

  properties.forEach(
    (property) => {
      let current =
        getPropertyLocation(
          property
        );

      const visited =
        new Set();

      while (current) {
        const currentId =
          getLocationId(current);

        if (
          currentId &&
          visited.has(currentId)
        ) {
          break;
        }

        if (currentId) {
          visited.add(currentId);
        }

        if (
          currentId &&
          currentId !==
            currentLocationId
        ) {
          nearbyMap.set(
            currentId,
            current
          );
        }

        current =
          current?.parent;
      }
    }
  );

  /* ------------------------------------------------------------
     3. PARENT SIBLINGS
  ------------------------------------------------------------ */

  const parent =
    location?.parent;

  if (
    parent &&
    Array.isArray(
      parent?.children
    )
  ) {
    parent.children.forEach(
      (sibling) => {
        const siblingId =
          getLocationId(
            sibling
          );

        if (
          !siblingId ||
          siblingId ===
            currentLocationId
        ) {
          return;
        }

        nearbyMap.set(
          siblingId,
          sibling
        );
      }
    );
  }

  /* ============================================================
     SORT LOCATIONS
     
     Natural sorting makes:
     Sector 1
     Sector 2
     Sector 10
     
     appear in the expected order.
  ============================================================ */

  const nearbyLocations =
    Array.from(
      nearbyMap.values()
    )
      .filter(Boolean)
      .sort((a, b) =>
        naturalLocationSort(
          a?.name,
          b?.name
        )
      )
      .slice(0, 10);

  /* ============================================================
     EMPTY STATE
  ============================================================ */

  if (!nearbyLocations.length) {
    return null;
  }

  return (
    <section
      id="nearby-locations"
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
            flex
            flex-col
            justify-between
            gap-6
            lg:flex-row
            lg:items-end
          "
        >
          <div className="max-w-[800px]">
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
                max-w-[760px]
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
        </div>

        {/* ======================================================
            LOCATION CHIPS
        ====================================================== */}

        <div
          className="
            mt-9
            flex
            flex-wrap
            gap-3
          "
        >
          {nearbyLocations.map(
            (nearby, index) => {
              const nearbyId =
                getLocationId(
                  nearby
                );

              const nearbyName =
                nearby?.name ||
                "Location";

              const publicSlug =
                typeof buildPublicLocationSlug ===
                "function"
                  ? buildPublicLocationSlug(
                      nearby
                    )
                  : "";

              if (!publicSlug) {
                return null;
              }

              return (
                <Link
                  key={
                    nearbyId ||
                    `${nearbyName}-${index}`
                  }
                  href={`/locations/${publicSlug}`}
                  className="
                    group
                    inline-flex
                    min-h-[52px]
                    items-center
                    gap-3
                    rounded-[16px]
                    border
                    border-[#17342d]/10
                    bg-white
                    px-4
                    py-3
                    shadow-[0_8px_24px_rgba(23,52,45,0.04)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-[#C89D58]/40
                    hover:shadow-[0_14px_35px_rgba(23,52,45,0.09)]
                  "
                >
                  <span
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#17342d]
                      text-[#D4AF37]
                    "
                  >
                    <MapPin size={13} />
                  </span>

                  <span
                    className="
                      text-[11px]
                      font-semibold
                      text-[#17342d]
                      sm:text-[12px]
                    "
                  >
                    {nearbyName}
                  </span>

                  <ArrowRight
                    size={14}
                    className="
                      text-[#9BA3A5]
                      transition-all
                      duration-300
                      group-hover:translate-x-0.5
                      group-hover:text-[#A47A2B]
                    "
                  />
                </Link>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   NATURAL LOCATION SORT
     
   Examples:

   Sector 1
   Sector 2
   Sector 10
   Sector 52
   Sector 53

   instead of:

   Sector 1
   Sector 10
   Sector 2
   Sector 52
   Sector 53
============================================================ */

function naturalLocationSort(
  first,
  second
) {
  const a = String(
    first || ""
  ).trim();

  const b = String(
    second || ""
  ).trim();

  return a.localeCompare(
    b,
    undefined,
    {
      numeric: true,
      sensitivity: "base",
    }
  );
}