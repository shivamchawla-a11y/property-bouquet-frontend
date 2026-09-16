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
// Roads / expressways / highways etc.
// → "on"
//
// Sectors / cities / localities etc.
// → "in"
// ============================================================

function getLocationPreposition(location) {
  const name = String(
    location?.name || ""
  )
    .trim()
    .toLowerCase();

  const slug = String(
    location?.slug || ""
  )
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
// BUILD PUBLIC LOCATION SLUG
// ============================================================
//
// Examples:
//
// Dwarka Expressway + Gurgaon
// → properties-on-dwarka-expressway-gurgaon
//
// Golf Course Extension Road + Gurgaon
// → properties-on-golf-course-extension-road-gurgaon
//
// Sohna + Gurgaon
// → properties-in-sohna-gurgaon
//
// Sector 56 + Gurgaon
// → properties-in-sector-56-gurgaon
// ============================================================

function buildPublicLocationSlug(location) {
  if (!location) {
    return "";
  }

  const currentPart = String(
    location.slug ||
    location.name ||
    ""
  )
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/\s+/g, "-");

  if (!currentPart) {
    return "";
  }

  // ----------------------------------------------------------
  // Find root / top-level parent.
  //
  // The location tree currently provides parent information
  // through nested children. Therefore, for this component,
  // Gurgaon is the root used by the featured locations.
  // ----------------------------------------------------------

  let root = location;

  while (root?.parent) {
    root = root.parent;
  }

  const rootPart = String(
    root?.slug ||
    root?.name ||
    "gurgaon"
  )
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/\s+/g, "-");

  const preposition =
    getLocationPreposition(location);

  // ----------------------------------------------------------
  // Don't duplicate root if current location itself is root.
  // ----------------------------------------------------------

  if (
    rootPart &&
    rootPart !== currentPart
  ) {
    return `properties-${preposition}-${currentPart}-${rootPart}`;
  }

  return `properties-${preposition}-${currentPart}`;
}


// ============================================================
// COMPONENT
// ============================================================

export default function ExploreLocations() {
  const [locations, setLocations] =
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
        `${API}/locations/tree`
      );

      const data =
        await res.json();

      if (res.ok) {
        const tree =
          data.data || [];

        // ----------------------------------------------------
        // Gurgaon parent
        // ----------------------------------------------------

        const gurgaon =
          tree.find(
            (item) =>
              item.name
                ?.toLowerCase() ===
              "gurgaon"
          );

        // ----------------------------------------------------
        // Featured locations
        // ----------------------------------------------------

        const featuredLocations = [
          "Dwarka expressway",
          "Sohna",
          "Golf Course Extension Road",
          "SPR",
        ];

        // ----------------------------------------------------
        // Only selected Gurgaon locations
        // ----------------------------------------------------

        const filteredLocations =
          (
            gurgaon?.children ||
            []
          ).filter(
            (location) =>
              featuredLocations.some(
                (name) =>
                  name.toLowerCase() ===
                  location.name?.toLowerCase()
              )
          );

        // ----------------------------------------------------
        // Preserve desired order
        // ----------------------------------------------------

        const orderedLocations =
          featuredLocations
            .map((name) =>
              filteredLocations.find(
                (location) =>
                  location.name
                    ?.toLowerCase() ===
                  name.toLowerCase()
              )
            )
            .filter(Boolean);

        setLocations(
          orderedLocations
        );
      }
    } catch (err) {
      console.error(err);
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
  // RENDER
  // ==========================================================

  return (
    <section className="relative bg-[#f6f3ee] py-24 overflow-hidden border-t border-black/5">

      {/* ====================================================
          BACKGROUND GLOW
      ==================================================== */}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#c89d58]/10 blur-[120px] rounded-full" />


      <div className="max-w-[1440px] mx-auto px-5 relative z-10">


        {/* ==================================================
            TOP HEADING
        ================================================== */}

        <div className="text-center mb-16">

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
            className="text-[11px] uppercase tracking-[3px] text-[#b88a3b] font-semibold mb-5"
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
            className="text-[38px] md:text-[54px] leading-[1.08] text-[#171717]"
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
            className="max-w-[760px] mx-auto mt-7 text-[15px] leading-[2] text-black/55"
          >
            Explore Gurgaon’s highest-performing luxury
            micro-markets curated for appreciation,
            exclusivity, lifestyle and institutional-grade
            investment potential.
          </motion.p>


          {/* ==================================================
              BUTTONS
          ================================================== */}

          <div className="flex items-center justify-center gap-4 mt-10">

            <Link
              href="/properties"
              className="group flex items-center gap-3 h-[52px] px-7 rounded-full bg-[#171717] text-white text-[13px] tracking-[1px] font-semibold shadow-[0_10px_35px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-all duration-300"
            >
              VIEW ALL LOCATIONS

              <ArrowRight
                size={15}
                className="group-hover:translate-x-1 transition"
              />
            </Link>


            {/* =================================================
                ARROWS
            ================================================= */}

            <div className="flex items-center gap-3">

              <button
                type="button"
                className="w-12 h-12 rounded-full border border-black/10 bg-white/80 backdrop-blur-xl shadow-lg flex items-center justify-center text-black/70 hover:bg-black hover:text-white transition-all duration-300"
              >
                <ChevronLeft
                  size={18}
                />
              </button>


              <button
                type="button"
                className="w-12 h-12 rounded-full border border-black/10 bg-white/80 backdrop-blur-xl shadow-lg flex items-center justify-center text-black/70 hover:bg-black hover:text-white transition-all duration-300"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {locations.map(
            (location, index) => {

              // ------------------------------------------------
              // IMPORTANT:
              // Use the new canonical location URL.
              // ------------------------------------------------

              const publicLocationSlug =
                buildPublicLocationSlug(
                  location
                );

              const locationUrl =
                publicLocationSlug
                  ? `/locations/${publicLocationSlug}`
                  : "/properties";


              return (
                <Link
                  href={locationUrl}
                  key={location._id}
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
                    className="group relative h-[390px] rounded-[34px] overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.18)] transition-all duration-700"
                  >

                    {/* ==================================================
                        GLASS OUTER
                    ================================================== */}

                    <div className="absolute inset-0 rounded-[28px] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.08)]" />


                    {/* ==================================================
                        IMAGE
                    ================================================== */}

                    <motion.img
                      src={
                        location.image
                          ? location.image.startsWith(
                              "http"
                            )
                            ? location.image
                            : `https://propertybouquet.com/api${location.image}`
                          : "https://placehold.co/600x800/f3f4f6/999999?text=Location"
                      }
                      alt={
                        `${location.name} properties in Gurgaon`
                      }
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/600x800/f3f4f6/999999?text=Location";
                      }}
                      whileHover={{
                        scale: 1.08,
                      }}
                      transition={{
                        duration: 1,
                        ease: "easeOut",
                      }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />


                    {/* ==================================================
                        OVERLAY
                    ================================================== */}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-black/35 to-transparent" />


                    {/* ==================================================
                        SHINE EFFECT
                    ================================================== */}

                    <div className="absolute inset-0 overflow-hidden">

                      <div className="absolute top-0 -left-[120%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 group-hover:left-[140%] transition-all duration-1000" />

                    </div>


                    {/* ==================================================
                        TOP TAG
                    ================================================== */}

                    <div className="absolute top-5 left-5 z-20">

                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/15">

                        <TrendingUp
                          size={14}
                          className="text-[#d7b26d]"
                        />

                        <span className="text-[11px] tracking-[1px] font-semibold text-white">
                          PREMIUM LOCATION
                        </span>

                      </div>

                    </div>


                    {/* ==================================================
                        CONTENT
                    ================================================== */}

                    <div className="absolute bottom-0 left-0 right-0 z-20 p-6">

                      {/* CITY */}

                      <div className="flex items-center gap-2 text-white/75 mb-3">

                        <MapPin
                          size={14}
                        />

                        <h3 className="text-[24px] leading-[1.15] font-semibold text-white">
                          {location.name}
                        </h3>

                      </div>


                      {/* ==================================================
                          LUXURY CTA
                      ================================================== */}

                      <div className="mt-7 pt-5 border-t border-white/10 flex items-center justify-between">

                        <div>

                          <p className="text-[10px] uppercase tracking-[2px] text-white/50 mb-2">
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
                          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#d8b46b] via-[#c89d58] to-[#a9782f] flex items-center justify-center text-black shadow-[0_15px_40px_rgba(201,157,88,0.45)]"
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

                    <div className="absolute inset-0 rounded-[28px] border border-white/10 pointer-events-none" />


                    {/* ==================================================
                        GOLD GLOW
                    ================================================== */}

                    <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-[120px] h-[120px] bg-[#c89d58]/20 blur-[60px] opacity-0 group-hover:opacity-100 transition duration-500" />

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