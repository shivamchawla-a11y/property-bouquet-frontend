"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers3,
  MapPin,
  Search,
} from "lucide-react";

/* ============================================================
   LOCATIONS HIERARCHY
   ============================================================

   BEHAVIOUR

   ROOT
   └── Explore Areas
          ↓
      DIRECT CHILDREN ONLY
          ↓
      Click child
          ↓
      THAT CHILD EXPANDS
          ↓
      ITS DIRECT CHILDREN ONLY

   We never render the entire tree at once.

   IMAGE FALLBACK

   Current location image
        ↓
   Closest parent image
        ↓
   Root location image

   ============================================================ */


/* ============================================================
   PREPOSITION
   ============================================================ */

function getLocationPreposition(location) {
  const name = String(location?.name || "")
    .trim()
    .toLowerCase();

  const slug = String(location?.slug || "")
    .trim()
    .toLowerCase();

  const value = `${name} ${slug}`;

  const onKeywords = [
    "expressway",
    "express way",
    "highway",
    "road",
    "street",
    "avenue",
    "boulevard",
    "drive",
    "marg",
  ];

  return onKeywords.some((keyword) =>
    value.includes(keyword)
  )
    ? "on"
    : "in";
}


/* ============================================================
   SLUGIFY
   ============================================================ */

function safeSlugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


/* ============================================================
   PUBLIC LOCATION SLUG

   Examples:

   Gurgaon
   → properties-in-gurgaon

   Dwarka Expressway
   → properties-on-dwarka-expressway-gurgaon

   Sector 103
   → properties-in-sector-103-gurgaon

   ============================================================ */

function buildPublicLocationSlug(
  location,
  rootLocation
) {
  if (!location) {
    return "";
  }

  const currentPart = safeSlugify(
    location?.slug ||
      location?.name ||
      ""
  );

  if (!currentPart) {
    return "";
  }

  const root = rootLocation || location;

  const rootPart = safeSlugify(
    root?.slug ||
      root?.name ||
      ""
  );

  const preposition =
    getLocationPreposition(location);

  if (
    rootPart &&
    rootPart !== currentPart
  ) {
    return `properties-${preposition}-${currentPart}-${rootPart}`;
  }

  return `properties-${preposition}-${currentPart}`;
}


/* ============================================================
   LOCATION URL
   ============================================================ */

function buildLocationUrl(
  location,
  rootLocation
) {
  const publicSlug =
    buildPublicLocationSlug(
      location,
      rootLocation
    );

  if (!publicSlug) {
    return "#";
  }

  return `/locations/${publicSlug}`;
}


/* ============================================================
   CHILDREN
   ============================================================ */

function getChildren(location) {
  if (
    !Array.isArray(
      location?.children
    )
  ) {
    return [];
  }

  return location.children;
}


/* ============================================================
   COUNT ALL DESCENDANTS

   Used only for small informational labels.

   ============================================================ */

function countDescendants(location) {
  const children =
    getChildren(location);

  return children.reduce(
    (total, child) =>
      total +
      1 +
      countDescendants(child),
    0
  );
}


/* ============================================================
   IMAGE URL

   Handles:

   https://...
   /api/...
   /uploads/...
   relative backend image paths

   ============================================================ */

function getAbsoluteImageUrl(image) {
  if (!image) {
    return "";
  }

  const value =
    String(image).trim();

  if (!value) {
    return "";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://propertybouquet.com";

  if (
    value.startsWith("/api/")
  ) {
    return `${siteUrl}${value}`;
  }

  if (value.startsWith("/")) {
    return `${siteUrl}/api${value}`;
  }

  return `${siteUrl}/api/${value}`;
}


/* ============================================================
   BEST IMAGE

   Priority:

   1. Current location
   2. Closest parent
   3. Next parent
   4. Root parent

   ============================================================ */

function getBestLocationImage(
  location,
  ancestors = []
) {
  /* Current location */

  if (location?.image) {
    const image =
      getAbsoluteImageUrl(
        location.image
      );

    if (image) {
      return image;
    }
  }

  /* Closest parent → root */

  for (
    let index =
      ancestors.length - 1;
    index >= 0;
    index--
  ) {
    const ancestor =
      ancestors[index];

    if (!ancestor?.image) {
      continue;
    }

    const image =
      getAbsoluteImageUrl(
        ancestor.image
      );

    if (image) {
      return image;
    }
  }

  return "";
}


/* ============================================================
   LOCATION IMAGE
   ============================================================ */

function LocationImage({
  location,
  ancestors = [],
  className = "",
}) {
  const image =
    getBestLocationImage(
      location,
      ancestors
    );

  if (!image) {
    return (
      <div
        className={`
          ${className}
          relative
          overflow-hidden
          bg-[#17382f]
          flex
          items-center
          justify-center
        `}
      >
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_30%_20%,rgba(200,157,88,0.25),transparent_60%)]
          "
        />

        <MapPin
          size={28}
          strokeWidth={1.2}
          className="
            relative
            text-[#c89d58]/80
          "
        />
      </div>
    );
  }

  return (
    <div
      className={`
        ${className}
        relative
        overflow-hidden
        bg-[#e8e2d8]
      `}
    >
      <img
        src={image}
        alt={
          location?.name ||
          "Property location"
        }
        loading="lazy"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          transition-transform
          duration-700
          group-hover:scale-[1.045]
        "
        onError={(event) => {
          event.currentTarget.style.display =
            "none";
        }}
      />

      <div
        className="
          absolute
          inset-0
          pointer-events-none
          bg-gradient-to-t
          from-black/55
          via-black/10
          to-black/5
        "
      />
    </div>
  );
}


/* ============================================================
   SMALL COUNT BADGE
   ============================================================ */

function CountBadge({
  count,
  label = "Areas",
}) {
  if (!count) {
    return null;
  }

  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        border-white/20
        bg-black/20
        px-2.5
        py-1.5
        backdrop-blur-md
        text-[8px]
        uppercase
        tracking-[1px]
        text-white
        whitespace-nowrap
      "
    >
      <Layers3
        size={10}
      />

      {count}{" "}
      {count === 1
        ? label.replace(/s$/, "")
        : label}
    </span>
  );
}


/* ============================================================
   CLOSED LOCATION CARD
   ============================================================ */

function CompactLocationCard({
  location,
  rootLocation,
  ancestors,
  isOpen,
  onToggle,
  level = 0,
}) {
  const children =
    getChildren(location);

  const hasChildren =
    children.length > 0;

  const locationUrl =
    buildLocationUrl(
      location,
      rootLocation
    );

  const descendantCount =
    countDescendants(location);

  return (
    <motion.article
      layout
      transition={{
        layout: {
          duration: 0.42,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      className={`
        group
        overflow-hidden
        rounded-[22px]
        border
        border-black/[0.07]
        bg-white
        shadow-[0_10px_32px_rgba(0,0,0,0.045)]
        transition-shadow
        duration-300
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.075)]
        ${
          isOpen
            ? "lg:col-span-3 sm:col-span-2 col-span-1"
            : ""
        }
      `}
    >
      {/* ======================================================
          CARD HEADER
          ====================================================== */}

      <div
        className={`
          ${
            isOpen
              ? "grid lg:grid-cols-[330px_1fr] md:grid-cols-[280px_1fr] grid-cols-1"
              : ""
          }
        `}
      >
        {/* ====================================================
            IMAGE
            ==================================================== */}

        <Link
          href={locationUrl}
          className={`
            relative
            block
            overflow-hidden
            ${
              isOpen
                ? "h-[205px] md:h-[235px] lg:h-[255px]"
                : "h-[155px] sm:h-[170px]"
            }
          `}
        >
          <LocationImage
            location={location}
            ancestors={ancestors}
            className="
              absolute
              inset-0
              h-full
              w-full
            "
          />

          {/* top label */}

          <div
            className="
              absolute
              left-4
              top-4
              z-10
            "
          >
            <span
              className="
                inline-flex
                rounded-full
                border
                border-white/20
                bg-black/20
                px-2.5
                py-1.5
                backdrop-blur-md
                text-[8px]
                uppercase
                tracking-[1.4px]
                font-semibold
                text-white
              "
            >
              {level === 0
                ? "Primary Location"
                : "Area"}
            </span>
          </div>

          {/* child count */}

          {hasChildren && (
            <div
              className="
                absolute
                right-4
                top-4
                z-10
              "
            >
              <CountBadge
                count={
                  children.length
                }
              />
            </div>
          )}

          {/* image title */}

          <div
            className="
              absolute
              left-4
              right-4
              bottom-4
              z-10
            "
          >
            <h3
              className={`
                text-white
                leading-[1.05]
                drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]
                ${
                  isOpen
                    ? "text-[30px] sm:text-[34px]"
                    : "text-[27px] sm:text-[30px]"
                }
              `}
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
              }}
            >
              {location?.name}
            </h3>
          </div>
        </Link>


        {/* ====================================================
            CARD CONTENT
            ==================================================== */}

        <div
          className={`
            ${
              isOpen
                ? "flex flex-col justify-center px-5 sm:px-7 lg:px-8 py-5 lg:py-7"
                : "px-4 py-4"
            }
          `}
        >
          {/* OPEN CARD TOP */}

          {isOpen ? (
            <>
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-5
                "
              >
                <div>
                  <p
                    className="
                      text-[8px]
                      uppercase
                      tracking-[2px]
                      font-semibold
                      text-[#b88a3b]
                    "
                  >
                    Explore this location
                  </p>

                  <h4
                    className="
                      mt-2
                      text-[25px]
                      sm:text-[29px]
                      leading-[1.1]
                      text-[#17382f]
                    "
                    style={{
                      fontFamily:
                        "Georgia, 'Times New Roman', serif",
                    }}
                  >
                    {location?.name}
                  </h4>

                  <p
                    className="
                      mt-2.5
                      max-w-[580px]
                      text-[12px]
                      leading-[1.75]
                      text-black/45
                    "
                  >
                    Explore the areas directly
                    associated with{" "}
                    {location?.name}.
                    Select an area below to
                    continue deeper into the
                    location hierarchy.
                  </p>
                </div>


                {/* DIRECT PAGE */}

                <Link
                  href={locationUrl}
                  className="
                    shrink-0
                    w-10
                    h-10
                    rounded-full
                    bg-[#17382f]
                    text-white
                    flex
                    items-center
                    justify-center
                    hover:bg-[#c89d58]
                    hover:text-[#111]
                    transition
                  "
                  aria-label={`Explore ${location?.name}`}
                >
                  <ArrowRight
                    size={15}
                  />
                </Link>
              </div>


              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                {hasChildren && (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-[#f5f1ea]
                      px-3
                      py-1.5
                      text-[8px]
                      uppercase
                      tracking-[1px]
                      font-semibold
                      text-[#17382f]
                    "
                  >
                    <Layers3
                      size={10}
                    />

                    {children.length}{" "}
                    direct{" "}
                    {children.length ===
                    1
                      ? "area"
                      : "areas"}
                  </span>
                )}

                {descendantCount >
                  children.length && (
                  <span
                    className="
                      inline-flex
                      rounded-full
                      border
                      border-black/[0.07]
                      px-3
                      py-1.5
                      text-[8px]
                      uppercase
                      tracking-[1px]
                      text-black/35
                    "
                  >
                    {descendantCount}{" "}
                    locations in network
                  </span>
                )}
              </div>


              {/* COLLAPSE BUTTON */}

              {hasChildren && (
                <button
                  type="button"
                  onClick={onToggle}
                  className="
                    mt-5
                    w-fit
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-[#17382f]/15
                    bg-white
                    px-4
                    h-9
                    text-[8px]
                    uppercase
                    tracking-[1.2px]
                    font-semibold
                    text-[#17382f]
                    hover:bg-[#17382f]
                    hover:text-white
                    transition
                  "
                >
                  Hide Areas

                  <ChevronUp
                    size={12}
                  />
                </button>
              )}
            </>
          ) : (
            <>
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    min-w-0
                  "
                >
                  <Layers3
                    size={13}
                    className="
                      shrink-0
                      text-[#b88a3b]
                    "
                  />

                  <span
                    className="
                      text-[8px]
                      uppercase
                      tracking-[1.1px]
                      text-black/35
                      truncate
                    "
                  >
                    {hasChildren
                      ? `${children.length} ${
                          children.length ===
                          1
                            ? "area"
                            : "areas"
                        }`
                      : "Location"}
                  </span>
                </div>


                <Link
                  href={locationUrl}
                  aria-label={`Explore ${location?.name}`}
                  className="
                    shrink-0
                    w-8
                    h-8
                    rounded-full
                    bg-[#17382f]
                    text-white
                    flex
                    items-center
                    justify-center
                    hover:bg-[#c89d58]
                    hover:text-[#111]
                    transition
                  "
                >
                  <ArrowRight
                    size={13}
                  />
                </Link>
              </div>


              {/* ==================================================
                  EXPLORE BUTTON
                  ================================================== */}

              {hasChildren ? (
                <button
                  type="button"
                  onClick={onToggle}
                  className="
                    mt-3.5
                    w-full
                    h-[39px]
                    rounded-full
                    border
                    border-[#17382f]/15
                    bg-[#f7f3ee]
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-[9px]
                    uppercase
                    tracking-[1.25px]
                    font-semibold
                    text-[#17382f]
                    hover:bg-[#17382f]
                    hover:text-white
                    hover:border-[#17382f]
                    transition-all
                  "
                >
                  Explore Areas

                  <ChevronDown
                    size={12}
                  />
                </button>
              ) : (
                <Link
                  href={locationUrl}
                  className="
                    mt-3.5
                    w-full
                    h-[39px]
                    rounded-full
                    bg-[#17382f]
                    text-white
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-[9px]
                    uppercase
                    tracking-[1.25px]
                    font-semibold
                    hover:bg-[#c89d58]
                    hover:text-[#111]
                    transition-all
                  "
                >
                  Explore Properties

                  <ArrowRight
                    size={12}
                  />
                </Link>
              )}
            </>
          )}
        </div>
      </div>


      {/* ======================================================
          INLINE EXPANSION

          IMPORTANT:

          This is NOT a modal.

          It is physically inside the selected card.

          ====================================================== */}

      <AnimatePresence initial={false}>
        {isOpen &&
          hasChildren && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.42,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="
                overflow-hidden
                border-t
                border-black/[0.06]
                bg-[#f8f5f0]
              "
            >
              <div
                className="
                  px-4
                  sm:px-6
                  lg:px-8
                  py-5
                  sm:py-6
                "
              >
                {/* ==================================================
                    CHILD SECTION HEADER
                    ================================================== */}

                <div
                  className="
                    mb-4
                    flex
                    items-end
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-[8px]
                        uppercase
                        tracking-[2px]
                        text-[#b88a3b]
                        font-semibold
                      "
                    >
                      Areas within{" "}
                      {location?.name}
                    </p>

                    <h5
                      className="
                        mt-1
                        text-[19px]
                        text-[#17382f]
                      "
                      style={{
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",
                      }}
                    >
                      Explore Areas
                    </h5>
                  </div>

                  <span
                    className="
                      shrink-0
                      rounded-full
                      bg-white
                      border
                      border-black/[0.06]
                      px-3
                      py-1.5
                      text-[8px]
                      uppercase
                      tracking-[1px]
                      text-black/35
                    "
                  >
                    {children.length}{" "}
                    {children.length ===
                    1
                      ? "Area"
                      : "Areas"}
                  </span>
                </div>


                {/* ==================================================
                    DIRECT CHILDREN ONLY

                    This is the critical part.

                    We do NOT flatten descendants.
                    ================================================== */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-4
                  "
                >
                  {children.map(
                    (child) => (
                      <ChildLocationCard
                        key={
                          child?._id
                        }
                        location={
                          child
                        }
                        rootLocation={
                          rootLocation
                        }
                        ancestors={[
                          ...ancestors,
                          location,
                        ]}
                        parentLocation={
                          location
                        }
                        level={
                          level + 1
                        }
                      />
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </motion.article>
  );
}


/* ============================================================
   CHILD LOCATION CARD

   This is intentionally a separate component so the same
   expand/collapse behaviour can continue deeper.

   ============================================================ */

function ChildLocationCard({
  location,
  rootLocation,
  ancestors,
  parentLocation,
  level,
}) {
  const children =
    getChildren(location);

  const hasChildren =
    children.length > 0;

  const [isOpen, setIsOpen] =
    useState(false);

  const locationUrl =
    buildLocationUrl(
      location,
      rootLocation
    );

  return (
    <motion.article
      layout
      transition={{
        layout: {
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      className={`
        group
        overflow-hidden
        rounded-[19px]
        border
        border-black/[0.065]
        bg-white
        shadow-[0_7px_25px_rgba(0,0,0,0.035)]
        hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]
        transition-shadow
        ${
          isOpen
            ? "sm:col-span-2 lg:col-span-3"
            : ""
        }
      `}
    >
      {/* ======================================================
          CHILD CARD HEADER
          ====================================================== */}

      <div
        className={`
          ${
            isOpen
              ? "grid lg:grid-cols-[270px_1fr] md:grid-cols-[235px_1fr]"
              : ""
          }
        `}
      >
        {/* IMAGE */}

        <Link
          href={locationUrl}
          className="
            relative
            block
            h-[125px]
            md:h-[145px]
            overflow-hidden
          "
        >
          <LocationImage
            location={location}
            ancestors={ancestors}
            className="
              absolute
              inset-0
              h-full
              w-full
            "
          />

          <div
            className="
              absolute
              left-3.5
              top-3.5
            "
          >
            <span
              className="
                rounded-full
                border
                border-white/20
                bg-black/20
                px-2.5
                py-1.5
                backdrop-blur-md
                text-[7px]
                uppercase
                tracking-[1.3px]
                text-white
              "
            >
              Area
            </span>
          </div>

          <div
            className="
              absolute
              left-3.5
              right-3.5
              bottom-3.5
            "
          >
            <h6
              className="
                text-[21px]
                leading-[1.05]
                text-white
                drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
              }}
            >
              {location?.name}
            </h6>
          </div>
        </Link>


        {/* CONTENT */}

        <div
          className="
            px-4
            py-4
            flex
            flex-col
            justify-center
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-3
            "
          >
            <div>
              <p
                className="
                  text-[7px]
                  uppercase
                  tracking-[1.5px]
                  text-[#b88a3b]
                  font-semibold
                "
              >
                {hasChildren
                  ? `${children.length} ${
                      children.length ===
                      1
                        ? "sub-area"
                        : "sub-areas"
                    }`
                  : "Location"}
              </p>

              <h6
                className="
                  mt-1
                  text-[17px]
                  leading-[1.15]
                  text-[#17382f]
                  font-semibold
                "
              >
                {location?.name}
              </h6>
            </div>


            <Link
              href={locationUrl}
              aria-label={`Explore ${location?.name}`}
              className="
                shrink-0
                w-8
                h-8
                rounded-full
                border
                border-black/[0.08]
                flex
                items-center
                justify-center
                text-[#17382f]
                hover:bg-[#17382f]
                hover:text-white
                transition
              "
            >
              <ArrowRight
                size={12}
              />
            </Link>
          </div>


          {/* ACTION */}

          {hasChildren ? (
            <button
              type="button"
              onClick={() =>
                setIsOpen(
                  (value) => !value
                )
              }
              className="
                mt-3.5
                w-full
                h-[36px]
                rounded-full
                bg-[#f7f3ee]
                border
                border-black/[0.06]
                flex
                items-center
                justify-center
                gap-2
                text-[8px]
                uppercase
                tracking-[1.1px]
                font-semibold
                text-[#17382f]
                hover:bg-[#17382f]
                hover:text-white
                transition
              "
            >
              {isOpen
                ? "Hide Areas"
                : "Explore Areas"}

              {isOpen ? (
                <ChevronUp
                  size={11}
                />
              ) : (
                <ChevronDown
                  size={11}
                />
              )}
            </button>
          ) : (
            <Link
              href={locationUrl}
              className="
                mt-3.5
                w-full
                h-[36px]
                rounded-full
                bg-[#17382f]
                text-white
                flex
                items-center
                justify-center
                gap-2
                text-[8px]
                uppercase
                tracking-[1.1px]
                font-semibold
                hover:bg-[#c89d58]
                hover:text-[#111]
                transition
              "
            >
              Explore Properties

              <ArrowRight
                size={11}
              />
            </Link>
          )}
        </div>
      </div>


      {/* ======================================================
          NEXT LEVEL

          ONLY direct children of this location.

          ====================================================== */}

      <AnimatePresence initial={false}>
        {isOpen &&
          hasChildren && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.4,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="
                overflow-hidden
                border-t
                border-black/[0.055]
                bg-[#faf8f4]
              "
            >
              <div
                className="
                  px-4
                  sm:px-5
                  py-4
                "
              >
                <div
                  className="
                    mb-3
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <span
                    className="
                      text-[8px]
                      uppercase
                      tracking-[1.6px]
                      text-[#b88a3b]
                      font-semibold
                    "
                  >
                    Areas within{" "}
                    {location?.name}
                  </span>

                  <span
                    className="
                      text-[8px]
                      uppercase
                      tracking-[1px]
                      text-black/30
                    "
                  >
                    {children.length}{" "}
                    {children.length ===
                    1
                      ? "location"
                      : "locations"}
                  </span>
                </div>


                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-3.5
                  "
                >
                  {children.map(
                    (child) => (
                      <ChildLocationCard
                        key={
                          child?._id
                        }
                        location={
                          child
                        }
                        rootLocation={
                          rootLocation
                        }
                        ancestors={[
                          ...ancestors,
                          location,
                        ]}
                        parentLocation={
                          location
                        }
                        level={
                          level + 1
                        }
                      />
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </motion.article>
  );
}


/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function LocationsHierarchy({
  locations = [],
  searchQuery = "",
}) {
  /*
    openPath stores the currently expanded hierarchy.

    Example:

    [
      Gurgaon,
      Dwarka Expressway,
      Sector 103
    ]

    This means:

    Gurgaon expanded
       ↓
    Dwarka Expressway expanded
       ↓
    Sector 103 expanded

    We only use this for ROOT → first level.
    Deeper levels manage their own local expansion.
  */

  const [
    openRootId,
    setOpenRootId,
  ] = useState(null);


  /* ==========================================================
     SEARCH
     ========================================================== */

  const filteredLocations =
    useMemo(() => {
      const query =
        String(
          searchQuery || ""
        )
          .trim()
          .toLowerCase();

      if (!query) {
        return locations;
      }

      function branchMatches(
        location
      ) {
        const name =
          String(
            location?.name || ""
          ).toLowerCase();

        if (
          name.includes(query)
        ) {
          return true;
        }

        return getChildren(
          location
        ).some(
          (child) =>
            branchMatches(child)
        );
      }

      return locations.filter(
        (location) =>
          branchMatches(location)
      );
    }, [
      locations,
      searchQuery,
    ]);


  /* ==========================================================
     TOGGLE ROOT
     ========================================================== */

  function toggleRoot(location) {
    const id =
      location?._id ||
      location?.slug ||
      location?.name;

    setOpenRootId(
      (current) =>
        current === id
          ? null
          : id
    );
  }


  /* ==========================================================
     EMPTY STATE
     ========================================================== */

  if (
    !Array.isArray(
      locations
    ) ||
    locations.length === 0
  ) {
    return (
      <section
        className="
          bg-[#f7f3ee]
          py-16
          sm:py-20
        "
      >
        <div
          className="
            max-w-[1320px]
            mx-auto
            px-5
            sm:px-8
            lg:px-10
          "
        >
          <div
            className="
              rounded-[24px]
              border
              border-black/[0.07]
              bg-white
              px-6
              py-16
              text-center
            "
          >
            <MapPin
              size={26}
              className="
                mx-auto
                text-[#c89d58]
              "
            />

            <h3
              className="
                mt-5
                text-[24px]
                text-[#171717]
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
              }}
            >
              Locations Coming Soon
            </h3>

            <p
              className="
                mt-2
                text-[13px]
                text-black/45
              "
            >
              Our location directory is
              currently being updated.
            </p>
          </div>
        </div>
      </section>
    );
  }


  /* ==========================================================
     MAIN
     ========================================================== */

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#f7f3ee]
        py-14
        sm:py-18
        lg:py-22
      "
    >
      {/* ======================================================
          SOFT BACKGROUND LIGHT
          ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-130px]
          -translate-x-1/2
          w-[700px]
          h-[300px]
          rounded-full
          bg-[#c89d58]/[0.045]
          blur-[120px]
        "
      />


      <div
        className="
          relative
          z-10
          max-w-[1320px]
          mx-auto
          px-5
          sm:px-8
          lg:px-10
        "
      >
        {/* ====================================================
            SECTION INTRO
            ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 14,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.45,
          }}
          className="
            max-w-[760px]
            mb-9
            sm:mb-11
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                w-7
                h-px
                bg-[#c89d58]
              "
            />

            <span
              className="
                text-[9px]
                uppercase
                tracking-[2.5px]
                text-[#b88a3b]
                font-semibold
              "
            >
              Explore By Location
            </span>
          </div>


          <h2
            className="
              mt-4
              text-[32px]
              sm:text-[40px]
              lg:text-[46px]
              leading-[1.05]
              tracking-[-0.6px]
              text-[#171717]
            "
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",
            }}
          >
            Explore Properties
            <br />

            <span
              className="
                text-[#b88a3b]
              "
            >
              by Location
            </span>
          </h2>


          <p
            className="
              mt-4
              max-w-[690px]
              text-[13px]
              leading-[1.85]
              text-black/50
            "
          >
            Explore cities, corridors,
            neighbourhoods and sectors
            through our location directory.
            Open a location to discover only
            the areas directly within it, then
            continue deeper when you need to.
          </p>
        </motion.div>


        {/* ====================================================
            SEARCH RESULT
            ==================================================== */}

        {searchQuery?.trim() && (
          <div
            className="
              mb-6
              flex
              items-center
              gap-2
              rounded-[14px]
              border
              border-black/[0.06]
              bg-white
              px-4
              py-3
              text-[10px]
              text-black/45
            "
          >
            <Search
              size={13}
              className="
                text-[#b88a3b]
              "
            />

            <span>
              Showing locations matching{" "}
              <strong
                className="
                  text-[#17382f]
                "
              >
                "{searchQuery}"
              </strong>
            </span>
          </div>
        )}


        {/* ====================================================
            ROOT GRID

            CLOSED:

            3 columns

            OPEN:

            selected card spans the complete row.

            ==================================================== */}

        <motion.div
          layout
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            gap-5
            lg:gap-6
            items-start
          "
        >
          {filteredLocations.map(
            (
              location,
              index
            ) => {
              const id =
                location?._id ||
                location?.slug ||
                location?.name;

              const isOpen =
                openRootId === id;

              return (
                <CompactLocationCard
                  key={id}
                  location={
                    location
                  }
                  rootLocation={
                    location
                  }
                  ancestors={[]}
                  isOpen={isOpen}
                  onToggle={() =>
                    toggleRoot(
                      location
                    )
                  }
                  level={0}
                />
              );
            }
          )}
        </motion.div>


        {/* ====================================================
            NO SEARCH RESULTS
            ==================================================== */}

        {filteredLocations.length ===
          0 && (
          <div
            className="
              rounded-[22px]
              border
              border-black/[0.07]
              bg-white
              px-6
              py-14
              text-center
            "
          >
            <Search
              size={23}
              className="
                mx-auto
                text-[#c89d58]
              "
            />

            <h3
              className="
                mt-4
                text-[22px]
                text-[#171717]
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
              }}
            >
              No locations found
            </h3>

            <p
              className="
                mt-2
                text-[12px]
                text-black/45
              "
            >
              Try searching for another
              city, corridor or area.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}