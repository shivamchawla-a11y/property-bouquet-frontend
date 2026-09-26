"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import {
  ArrowUpRight,
  MapPin,
  TrendingUp,
} from "lucide-react";

const API = "/api";

const FALLBACK_IMAGE =
  "https://placehold.co/900x1100/f3f0e9/777777?text=Location";

/* ============================================================
   LOCATION PREPOSITION
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

function slugifyLocation(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ============================================================
   FIND LOCATION + MOST-PARENT LOCATION
============================================================ */

/*
  IMPORTANT:

  This is the SAME hierarchy approach used by your Navbar.

  We do NOT depend on location.parent.

  Instead we search:

  /api/locations/tree

  Example:

  Gurgaon
    ├── Dwarka Expressway
    ├── Golf Course Road
    ├── Sector 56
    └── Farukhnagar

  If we find:

  Dwarka Expressway

  we return:

  {
    location: Dwarka Expressway,
    root: Gurgaon
  }
*/

function findLocationInTree(
  tree,
  targetId,
  targetSlug,
  targetName,
  root = null
) {
  if (!Array.isArray(tree)) {
    return null;
  }

  const normalizedId = String(
    targetId || ""
  )
    .trim()
    .toLowerCase();

  const normalizedSlug = String(
    targetSlug || ""
  )
    .trim()
    .toLowerCase();

  const normalizedName = String(
    targetName || ""
  )
    .trim()
    .toLowerCase();

  for (const location of tree) {
    const currentRoot =
      root || location;

    const currentId = String(
      location?._id || ""
    )
      .trim()
      .toLowerCase();

    const currentSlug = String(
      location?.slug || ""
    )
      .trim()
      .toLowerCase();

    const currentName = String(
      location?.name || ""
    )
      .trim()
      .toLowerCase();

    /* --------------------------------------------------------
       MATCH BY ID
    -------------------------------------------------------- */

    if (
      normalizedId &&
      currentId &&
      normalizedId === currentId
    ) {
      return {
        location,
        root: currentRoot,
      };
    }

    /* --------------------------------------------------------
       MATCH BY SLUG
    -------------------------------------------------------- */

    if (
      normalizedSlug &&
      currentSlug &&
      normalizedSlug === currentSlug
    ) {
      return {
        location,
        root: currentRoot,
      };
    }

    /* --------------------------------------------------------
       MATCH BY NAME
    -------------------------------------------------------- */

    if (
      normalizedName &&
      currentName &&
      normalizedName === currentName
    ) {
      return {
        location,
        root: currentRoot,
      };
    }

    /* --------------------------------------------------------
       SEARCH CHILDREN
    -------------------------------------------------------- */

    const found = findLocationInTree(
      location?.children || [],
      targetId,
      targetSlug,
      targetName,
      currentRoot
    );

    if (found) {
      return found;
    }
  }

  return null;
}

/* ============================================================
   PUBLIC LOCATION SEO URL
============================================================ */

/*
  EXACT SAME URL RULE AS NAVBAR.

  Gurgaon
  →
  /locations/properties-in-gurgaon

  Farukhnagar
  →
  /locations/properties-in-farukhnagar-gurgaon

  Sector 56
  →
  /locations/properties-in-sector-56-gurgaon

  Golf Course Road
  →
  /locations/properties-on-golf-course-road-gurgaon

  Dwarka Expressway
  →
  /locations/properties-on-dwarka-expressway-gurgaon
*/

function getPublicLocationUrl(
  location,
  root = null
) {
  if (!location) {
    return "/locations";
  }

  const currentSlug =
    slugifyLocation(
      location?.slug ||
        location?.name ||
        ""
    );

  if (!currentSlug) {
    return "/locations";
  }

  const rootSlug =
    slugifyLocation(
      root?.slug ||
        root?.name ||
        ""
    );

  const preposition =
    getLocationPreposition(location);

  /* ----------------------------------------------------------
     CHILD LOCATION

     Current + most-parent

     Dwarka Expressway + Gurgaon
  ---------------------------------------------------------- */

  if (
    rootSlug &&
    rootSlug !== currentSlug
  ) {
    return `/locations/properties-${preposition}-${currentSlug}-${rootSlug}`;
  }

  /* ----------------------------------------------------------
     ROOT LOCATION

     Gurgaon

     → /locations/properties-in-gurgaon
  ---------------------------------------------------------- */

  return `/locations/properties-${preposition}-${currentSlug}`;
}

/* ============================================================
   IMAGE
============================================================ */

function getImage(location) {
  if (!location?.image) {
    return FALLBACK_IMAGE;
  }

  return location.image.startsWith("http")
    ? location.image
    : `${API}${location.image}`;
}

/* ============================================================
   FEATURED LOCATION CORRIDORS
============================================================ */

export default function FeaturedLocationCorridors({
  locations = [],
}) {
  const [locationTree, setLocationTree] =
    useState([]);

  const [treeLoading, setTreeLoading] =
    useState(true);

  /* ==========================================================
     FETCH LOCATION TREE
  ========================================================== */

  useEffect(() => {
    let mounted = true;

    const fetchLocationTree = async () => {
      try {
        const response = await fetch(
          "/api/locations/tree",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch location tree: ${response.status}`
          );
        }

        const data =
          await response.json();

        if (!mounted) {
          return;
        }

        setLocationTree(
          Array.isArray(data?.data)
            ? data.data
            : []
        );
      } catch (error) {
        console.error(
          "Featured Location Corridors tree error:",
          error
        );

        if (mounted) {
          setLocationTree([]);
        }
      } finally {
        if (mounted) {
          setTreeLoading(false);
        }
      }
    };

    fetchLocationTree();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========================================================
     DO NOT RENDER WITHOUT LOCATIONS
  ========================================================== */

  if (!locations.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#f7f3ee] py-24 md:py-28">

      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#c89d58]/[0.08] blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">

        {/* ====================================================
            HEADING
        ==================================================== */}

        <div className="mb-14 max-w-[780px]">

          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[3px] text-[#b4873d]">
            FEATURED MICRO-MARKETS
          </p>

          <h2
            className="text-[36px] leading-[1.1] text-[#171717] sm:text-[46px] md:text-[54px]"
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",
            }}
          >
            Explore Gurgaon&apos;s
            <br />

            <span className="text-[#b4873d]">
              Key Investment Corridors
            </span>
          </h2>

          <p className="mt-6 max-w-[700px] text-[14px] leading-[1.9] text-black/55 md:text-[15px]">
            Discover established neighbourhoods,
            emerging micro-markets and strategic
            growth corridors across Gurgaon and
            surrounding regions.
          </p>

        </div>

        {/* ====================================================
            CARDS
        ==================================================== */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {locations.map(
            (location, index) => {

              /* =================================================
                 FIND LOCATION IN FULL TREE
              ================================================= */

              const locationData =
                findLocationInTree(
                  locationTree,

                  location?._id,

                  location?.slug,

                  location?.name
                );

              /*
                IMPORTANT:

                Once tree lookup succeeds:

                locationData.location
                  = actual location from tree

                locationData.root
                  = most-parent/root

                Example:

                locationData.location
                  = Dwarka Expressway

                locationData.root
                  = Gurgaon
              */

              const actualLocation =
                locationData?.location ||
                location;

              const rootLocation =
                locationData?.root ||
                null;

              /* =================================================
                 BUILD CANONICAL PUBLIC URL
              ================================================= */

              const publicUrl =
                getPublicLocationUrl(
                  actualLocation,
                  rootLocation
                );

              if (
                publicUrl === "/locations"
              ) {
                return null;
              }

              return (
                <Link
                  key={
                    location?._id ||
                    location?.slug ||
                    index
                  }
                  href={publicUrl}
                  className="group block"
                >

                  <motion.article
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.5,
                      delay:
                        index * 0.06,
                    }}
                    whileHover={{
                      y: -8,
                    }}
                    className="relative h-[430px] overflow-hidden rounded-[30px] border border-black/[0.06] bg-[#111]"
                  >

                    {/* ========================================
                        IMAGE
                    ======================================== */}

                    <img
                      src={getImage(
                        location
                      )}
                      alt={`${location?.name || "Location"} property market`}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src =
                          FALLBACK_IMAGE;
                      }}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.07]"
                    />

                    {/* ========================================
                        OVERLAY
                    ======================================== */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                    {/* ========================================
                        TOP BADGE
                    ======================================== */}

                    <div className="absolute left-5 top-5">

                      <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3.5 py-2 backdrop-blur-xl">

                        <TrendingUp
                          size={13}
                          className="text-[#d4af62]"
                        />

                        <span className="text-[9px] font-semibold uppercase tracking-[1.5px] text-white">
                          Featured Market
                        </span>

                      </div>

                    </div>

                    {/* ========================================
                        CONTENT
                    ======================================== */}

                    <div className="absolute inset-x-0 bottom-0 p-6">

                      <div className="mb-3 flex items-center gap-2 text-white/70">

                        <MapPin size={14} />

                        <span className="text-[10px] uppercase tracking-[1.8px]">
                          Gurgaon
                        </span>

                      </div>

                      <h3 className="text-[25px] font-medium leading-tight text-white">
                        {location?.name}
                      </h3>

                      <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">

                        <span className="text-[11px] uppercase tracking-[1.5px] text-white/60">
                          Explore Location
                        </span>

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c89d58] text-black transition-transform duration-300 group-hover:rotate-45">

                          <ArrowUpRight
                            size={17}
                          />

                        </div>

                      </div>

                    </div>

                  </motion.article>

                </Link>
              );
            }
          )}

        </div>

      </div>
    </section>
  );
}