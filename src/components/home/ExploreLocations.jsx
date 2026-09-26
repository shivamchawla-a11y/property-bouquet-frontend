"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MapPin,
} from "lucide-react";

// ============================================================
// API
// ============================================================

const API = "/api";

// ============================================================
// LOCATION PREPOSITION
// ============================================================
//
// Same logic as Navbar.
//
// Roads / expressways / highways etc.
// → "on"
//
// Sectors / cities / localities etc.
// → "in"
// ============================================================

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

// ============================================================
// SLUGIFY
// ============================================================
//
// Same logic as Navbar.
// ============================================================

function slugifyLocation(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ============================================================
// FIND LOCATION IN TREE
// ============================================================
//
// IMPORTANT:
//
// Do NOT use:
//
// location.parent
//
// Do NOT use:
//
// location.__rootLocation
//
// Instead, recursively search the actual location tree.
//
// Example:
//
// Gurgaon
//   ├── Dwarka Expressway
//   ├── Sohna
//   ├── Golf Course Extension Road
//   ├── SPR
//   └── ...
//
// Searching for:
//
// Dwarka Expressway
//
// returns:
//
// {
//   location: Dwarka Expressway,
//   root: Gurgaon
// }
// ============================================================

function findLocationInTree(
  tree,
  locationName,
  root = null
) {
  if (!Array.isArray(tree)) {
    return null;
  }

  const target = String(locationName || "")
    .trim()
    .toLowerCase();

  for (const location of tree) {
    const currentRoot =
      root || location;

    const currentName = String(
      location?.name || ""
    )
      .trim()
      .toLowerCase();

    // --------------------------------------------------------
    // CURRENT LOCATION MATCH
    // --------------------------------------------------------

    if (currentName === target) {
      return {
        location,
        root: currentRoot,
      };
    }

    // --------------------------------------------------------
    // SEARCH CHILDREN
    // --------------------------------------------------------

    const found = findLocationInTree(
      location?.children || [],
      locationName,
      currentRoot
    );

    if (found) {
      return found;
    }
  }

  return null;
}

// ============================================================
// PUBLIC LOCATION URL
// ============================================================
//
// EXACT SAME RULE AS NAVBAR.
//
// Gurgaon
// → /locations/properties-in-gurgaon
//
// Dwarka Expressway
// → /locations/properties-on-dwarka-expressway-gurgaon
//
// Golf Course Extension Road
// → /locations/properties-on-golf-course-extension-road-gurgaon
//
// Sohna
// → /locations/properties-in-sohna-gurgaon
//
// SPR
// → /locations/properties-in-spr-gurgaon
//
// Sector 56
// → /locations/properties-in-sector-56-gurgaon
//
// Farukhnagar
// → /locations/properties-in-farukhnagar-gurgaon
// ============================================================

function getPublicLocationUrl(
  location,
  root = null
) {
  if (!location) {
    return "/locations";
  }

  const currentSlug =
    slugifyLocation(
      location.slug ||
        location.name ||
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

  // ----------------------------------------------------------
  // CHILD LOCATION
  // ----------------------------------------------------------

  if (
    rootSlug &&
    rootSlug !== currentSlug
  ) {
    return `/locations/properties-${preposition}-${currentSlug}-${rootSlug}`;
  }

  // ----------------------------------------------------------
  // ROOT LOCATION
  // ----------------------------------------------------------

  return `/locations/properties-${preposition}-${currentSlug}`;
}

// ============================================================
// IMAGE
// ============================================================

function getImage(location) {
  if (!location?.image) {
    return "https://placehold.co/600x800/f3f4f6/999999?text=Location";
  }

  return location.image.startsWith("http")
    ? location.image
    : `${API}${location.image}`;
}

// ============================================================
// COMPONENT
// ============================================================

export default function ExploreLocations() {
  const [locations, setLocations] =
    useState([]);

  const [locationTree, setLocationTree] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ==========================================================
  // FETCH LOCATIONS
  // ==========================================================

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch(
        `${API}/locations/tree`,
        {
          cache: "no-store",
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          `Location tree request failed: ${res.status}`
        );
      }

      const tree =
        Array.isArray(data?.data)
          ? data.data
          : [];

      // ------------------------------------------------------
      // SAVE COMPLETE TREE
      // ------------------------------------------------------

      setLocationTree(tree);

      // ------------------------------------------------------
      // FIND GURGAON ROOT
      // ------------------------------------------------------

      const gurgaon =
        tree.find(
          (item) =>
            String(item?.name || "")
              .trim()
              .toLowerCase() ===
            "gurgaon"
        );

      // ------------------------------------------------------
      // FEATURED LOCATIONS
      // ------------------------------------------------------

      const featuredLocations = [
        "Dwarka expressway",
        "Sohna",
        "Golf Course Extension Road",
        "SPR",
      ];

      // ------------------------------------------------------
      // ONLY SELECTED GURGAON LOCATIONS
      // ------------------------------------------------------

      const filteredLocations =
        (
          gurgaon?.children ||
          []
        ).filter(
          (location) =>
            featuredLocations.some(
              (name) =>
                name.toLowerCase() ===
                String(
                  location?.name || ""
                )
                  .trim()
                  .toLowerCase()
            )
        );

      // ------------------------------------------------------
      // PRESERVE DESIRED ORDER
      // ------------------------------------------------------

      const orderedLocations =
        featuredLocations
          .map((name) =>
            filteredLocations.find(
              (location) =>
                String(
                  location?.name || ""
                )
                  .trim()
                  .toLowerCase() ===
                name.toLowerCase()
            )
          )
          .filter(Boolean);

      setLocations(
        orderedLocations
      );
    } catch (err) {
      console.error(
        "Failed to fetch featured locations:",
        err
      );

      setLocations([]);
      setLocationTree([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <section className="py-24 text-center">
        Loading locations...
      </section>
    );
  }

  // ==========================================================
  // EMPTY
  // ==========================================================

  if (!locations.length) {
    return null;
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="relative overflow-hidden border-t border-black/5 bg-[#f6f3ee] py-24">

      {/* ====================================================
          BACKGROUND GLOW
      ==================================================== */}

      <div className="absolute left-1/2 top-0 h-[350px] w-[700px] -translate-x-1/2 rounded-full bg-[#c89d58]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5">

        {/* ==================================================
            TOP HEADING
        ================================================== */}

        <div className="mb-16 text-center">

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            viewport={{
              once: true,
            }}
            className="mb-5 text-[11px] font-semibold uppercase tracking-[3px] text-[#b88a3b]"
          >
            EXPLORE BY LOCATION
          </motion.p>

          <motion.h2
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            viewport={{
              once: true,
            }}
            className="text-[38px] leading-[1.08] text-[#171717] md:text-[54px]"
            style={{
              fontFamily:
                "Georgia, Times New Roman, serif",
            }}
          >
            Gurgaon’s Most Premium
            <br />

            <span className="text-[#b88a3b]">
              Investment Corridors
            </span>
          </motion.h2>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            viewport={{
              once: true,
            }}
            className="mx-auto mt-7 max-w-[760px] text-[15px] leading-[2] text-black/55"
          >
            Explore Gurgaon’s highest-performing luxury
            micro-markets curated for appreciation,
            exclusivity, lifestyle and institutional-grade
            investment potential.
          </motion.p>

          {/* ==================================================
              BUTTONS
          ================================================== */}

          <div className="mt-10 flex items-center justify-center gap-4">

            <Link
              href="/properties"
              className="group flex h-[52px] items-center gap-3 rounded-full bg-[#171717] px-7 text-[13px] font-semibold tracking-[1px] text-white shadow-[0_10px_35px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-[1.02]"
            >
              VIEW ALL LOCATIONS

              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            {/* =================================================
                ARROWS
            ================================================= */}

            <div className="flex items-center gap-3">

              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black/70 shadow-lg backdrop-blur-xl transition-all duration-300 hover:bg-black hover:text-white"
              >
                <ChevronLeft
                  size={18}
                />
              </button>

              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black/70 shadow-lg backdrop-blur-xl transition-all duration-300 hover:bg-black hover:text-white"
              >
                <ChevronRight
                  size={18}
                />
              </button>

            </div>
          </div>
        </div>

        {/* ==================================================
            LOCATION CARDS
        ================================================== */}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {locations.map(
            (location, index) => {

              // ------------------------------------------------
              // FIND THIS LOCATION IN THE FULL TREE
              // ------------------------------------------------
              //
              // This is the important part.
              //
              // We do NOT use:
              //
              // location.parent
              //
              // We do NOT use:
              //
              // location.__rootLocation
              //
              // We search the same tree used by Navbar.
              // ------------------------------------------------

              const locationData =
                findLocationInTree(
                  locationTree,
                  location?.name
                );

              // ------------------------------------------------
              // ACTUAL LOCATION FROM TREE
              // ------------------------------------------------

              const actualLocation =
                locationData?.location ||
                location;

              // ------------------------------------------------
              // MOST-PARENT ROOT
              // ------------------------------------------------

              const rootLocation =
                locationData?.root ||
                null;

              // ------------------------------------------------
              // CANONICAL URL
              // ------------------------------------------------

              const locationUrl =
                getPublicLocationUrl(
                  actualLocation,
                  rootLocation
                );

              return (
                <Link
                  href={locationUrl}
                  key={
                    location?._id ||
                    location?.slug ||
                    index
                  }
                  className="block"
                >

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 40,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay:
                        index * 0.08,
                    }}
                    viewport={{
                      once: true,
                    }}
                    whileHover={{
                      y: -10,
                    }}
                    className="group relative h-[390px] overflow-hidden rounded-[34px] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.18)] transition-all duration-700"
                  >

                    {/* ==================================================
                        GLASS OUTER
                    ================================================== */}

                    <div className="absolute inset-0 rounded-[28px] border border-white/20 bg-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl" />

                    {/* ==================================================
                        IMAGE
                    ================================================== */}

                    <motion.img
                      src={getImage(
                        location
                      )}
                      alt={`${location?.name || "Location"} properties in Gurgaon`}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src =
                          "https://placehold.co/600x800/f3f4f6/999999?text=Location";
                      }}
                      whileHover={{
                        scale: 1.08,
                      }}
                      transition={{
                        duration: 1,
                        ease: "easeOut",
                      }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    {/* ==================================================
                        OVERLAY
                    ================================================== */}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-black/35 to-transparent" />

                    {/* ==================================================
                        SHINE EFFECT
                    ================================================== */}

                    <div className="absolute inset-0 overflow-hidden">

                      <div className="absolute left-[-120%] top-0 h-full w-[70%] rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000 group-hover:left-[140%]" />

                    </div>

                    {/* ==================================================
                        TOP TAG
                    ================================================== */}

                    <div className="absolute left-5 top-5 z-20">

                      <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-xl">

                        <TrendingUp
                          size={14}
                          className="text-[#d7b26d]"
                        />

                        <span className="text-[11px] font-semibold tracking-[1px] text-white">
                          PREMIUM LOCATION
                        </span>

                      </div>

                    </div>

                    {/* ==================================================
                        CONTENT
                    ================================================== */}

                    <div className="absolute bottom-0 left-0 right-0 z-20 p-6">

                      {/* CITY */}

                      <div className="mb-3 flex items-center gap-2 text-white/75">

                        <MapPin
                          size={14}
                        />

                        <h3 className="text-[24px] font-semibold leading-[1.15] text-white">
                          {location?.name}
                        </h3>

                      </div>

                      {/* ==================================================
                          LUXURY CTA
                      ================================================== */}

                      <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">

                        <div>

                          <p className="mb-2 text-[10px] uppercase tracking-[2px] text-white/50">
                            Investment Corridor
                          </p>

                          <p className="text-[16px] font-medium text-white">
                            Explore Location
                          </p>

                        </div>

                        <motion.div
                          whileHover={{
                            scale: 1.08,
                          }}
                          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#d8b46b] via-[#c89d58] to-[#a9782f] text-black shadow-[0_15px_40px_rgba(201,157,88,0.45)]"
                        >
                          <ArrowRight
                            size={18}
                          />
                        </motion.div>

                      </div>
                    </div>

                    {/* ==================================================
                        BORDER
                    ================================================== */}

                    <div className="pointer-events-none absolute inset-0 rounded-[28px] border border-white/10" />

                    {/* ==================================================
                        GOLD GLOW
                    ================================================== */}

                    <div className="absolute bottom-[-40px] left-1/2 h-[120px] w-[120px] -translate-x-1/2 bg-[#c89d58]/20 opacity-0 blur-[60px] transition duration-500 group-hover:opacity-100" />

                  </motion.div>

                </Link>
              );
            }
          )}

        </div>
      </div>
    </section>
  );
}