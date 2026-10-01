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
  // ============================================================
  // ADMIN CUSTOM CONTENT
  // ============================================================

  const custom =
    pageContent?.nearby || {};

  // ============================================================
  // SAFE VALUE HELPER
  // ============================================================

  const value = (
    customValue,
    fallback
  ) => {
    return (
      typeof customValue === "string" &&
      customValue.trim()
    )
      ? customValue.trim()
      : fallback;
  };

  // ============================================================
  // RICH TEXT HELPER
  //
  // nearby.description supports:
  // - Plain text
  // - Rich HTML from RichTextEditor
  // ============================================================

  const normalizeRichText = (text) => {
    if (typeof text !== "string") {
      return "";
    }

    return text
      .replace(/&nbsp;/gi, " ")
      .replace(/&#160;/gi, " ")
      .replace(/&#xA0;/gi, " ")
      .replace(/\u00a0/g, " ")
      .replace(/<p>\s*<\/p>/gi, "");
  };

  const isRichText = (text) => {
    return /<\s*[a-z][^>]*>/i.test(text);
  };

  // ============================================================
  // DEFAULT COPY
  // ============================================================

  const eyebrow = value(
    custom?.eyebrow,
    "EXPLORE MORE"
  );

  const title = value(
    custom?.title,
    "Explore Nearby Locations"
  );

  const description = value(
    custom?.description,
    `Discover nearby locations around ${locationName}, with access to complementary residential, commercial, lifestyle and investment opportunities across the wider area.`
  );

  // ============================================================
  // NORMALIZED DESCRIPTION
  //
  // Supports both:
  //
  // Plain:
  // Discover nearby locations around Gurgaon...
  //
  // Rich:
  // <p>Discover nearby <strong>locations</strong>...</p>
  // ============================================================

  const normalizedDescription =
    normalizeRichText(description);

  const hasRichDescription =
    isRichText(normalizedDescription);

  // ============================================================
  // CURRENT LOCATION ID
  // ============================================================

  const currentLocationId =
    location?._id?.toString?.() ||
    location?.id?.toString?.() ||
    location?.slug ||
    location?.name;

  // ============================================================
  // FIND LOCATION FROM PROPERTY
  // ============================================================

  const getPropertyLocation = (
    property
  ) => {
    return (
      property?.locationData
        ?.locationRef ||
      property?.locationRef ||
      property?.location
    );
  };

  // ============================================================
  // LOCATION ID HELPER
  // ============================================================

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

  // ============================================================
  // DIRECT CHILDREN
  // ============================================================

  const directChildren =
    Array.isArray(location?.children)
      ? location.children
      : [];

  // ============================================================
  // COLLECT NEARBY LOCATIONS
  //
  // Priority:
  // 1. Direct children
  // 2. Locations found in property hierarchy
  // 3. Parent siblings
  //
  // This remains completely dynamic.
  // ============================================================

  const nearbyMap = new Map();

  // ------------------------------------------------------------
  // 1. DIRECT CHILDREN
  // ------------------------------------------------------------

  directChildren.forEach(
    (child) => {
      const childId =
        getLocationId(child);

      if (
        !childId ||
        childId === currentLocationId
      ) {
        return;
      }

      nearbyMap.set(
        childId,
        child
      );
    }
  );

  // ------------------------------------------------------------
  // 2. PROPERTY LOCATION HIERARCHY
  // ------------------------------------------------------------

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

  // ------------------------------------------------------------
  // 3. PARENT SIBLINGS
  // ------------------------------------------------------------

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

  // ============================================================
  // SORT LOCATIONS NATURALLY
  //
  // Sector 1
  // Sector 2
  // Sector 10
  // Sector 52
  // Sector 53
  // ============================================================

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

  // ============================================================
  // EMPTY STATE
  // ============================================================

  if (!nearbyLocations.length) {
    return null;
  }

  // ============================================================
  // RENDER
  // ============================================================

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
                text-[#A47A2B]
                sm:text-[10px]
                md:text-[11px]
              "
            >
              <span className="h-px w-8 bg-[#C89D58]" />

              {eyebrow}
            </div>

            {/* TITLE */}

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

            {/* ==================================================
                DESCRIPTION

                Supports BOTH:
                1. Plain text
                2. Rich HTML from RichTextEditor
            ================================================== */}

            {hasRichDescription ? (
              <div
                className="
                  mt-5
                  max-w-[760px]
                  text-[13px]
                  leading-7
                  text-[#667078]

                  sm:text-[14px]
                  md:text-[15px]

                  [&_p]:m-0
                  [&_p]:mb-4
                  [&_p:last-child]:mb-0

                  [&_strong]:font-semibold
                  [&_b]:font-semibold

                  [&_em]:italic

                  [&_u]:underline
                  [&_u]:underline-offset-2

                  [&_a]:font-medium
                  [&_a]:text-[#A47A2B]
                  [&_a]:underline
                  [&_a]:underline-offset-2

                  [&_ul]:my-4
                  [&_ul]:list-disc
                  [&_ul]:pl-5

                  [&_ol]:my-4
                  [&_ol]:list-decimal
                  [&_ol]:pl-5

                  [&_li]:mb-1.5

                  [&_h1]:mb-3
                  [&_h1]:font-playfair
                  [&_h1]:text-2xl
                  [&_h1]:font-semibold
                  [&_h1]:leading-tight
                  [&_h1]:text-[#17342d]

                  [&_h2]:mb-3
                  [&_h2]:font-playfair
                  [&_h2]:text-xl
                  [&_h2]:font-semibold
                  [&_h2]:leading-tight
                  [&_h2]:text-[#17342d]

                  [&_h3]:mb-2
                  [&_h3]:font-playfair
                  [&_h3]:text-lg
                  [&_h3]:font-semibold
                  [&_h3]:leading-tight
                  [&_h3]:text-[#17342d]

                  [&_h4]:mb-2
                  [&_h4]:font-semibold
                  [&_h4]:text-[#17342d]

                  [&_img]:my-4
                  [&_img]:max-w-full
                  [&_img]:rounded-xl
                "
                dangerouslySetInnerHTML={{
                  __html:
                    normalizedDescription,
                }}
              />
            ) : (
              <div
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
                {normalizedDescription
                  .split(/\n\s*\n/)
                  .map(
                    (
                      paragraph,
                      index
                    ) => {
                      const trimmed =
                        paragraph.trim();

                      if (!trimmed) {
                        return null;
                      }

                      return (
                        <p
                          key={index}
                          className="
                            m-0
                            mb-4
                            last:mb-0
                          "
                        >
                          {trimmed}
                        </p>
                      );
                    }
                  )}
              </div>
            )}
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
                typeof nearby?.name ===
                "string"
                  ? nearby.name.trim()
                  : "Location";

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
                  {/* LOCATION ICON */}

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

                  {/* LOCATION NAME */}

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

                  {/* ARROW */}

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