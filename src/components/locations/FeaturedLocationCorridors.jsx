"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  TrendingUp,
} from "lucide-react";

const API = "/api";

function getLocationPreposition(location) {
  const value = `${location?.name || ""} ${
    location?.slug || ""
  }`
    .trim()
    .toLowerCase();

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

function slugify(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildPublicLocationSlug(location) {
  if (!location) return "";

  const currentPart = slugify(
    location.slug || location.name || ""
  );

  if (!currentPart) return "";

  let root = location;
  const visited = new Set();

  while (root?.parent) {
    const parentId =
      root.parent?._id?.toString?.() ||
      root.parent?.toString?.();

    if (!parentId || visited.has(parentId)) break;

    visited.add(parentId);

    /*
      LocationsHierarchy normally provides nested objects.
      This component therefore expects the hierarchy data
      to already contain the parent chain.
    */

    if (typeof root.parent === "object") {
      root = root.parent;
    } else {
      break;
    }
  }

  const rootPart = slugify(
    root?.slug || root?.name || ""
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

function getImage(location) {
  if (!location?.image) {
    return "https://placehold.co/900x1100/f3f0e9/777777?text=Location";
  }

  return location.image.startsWith("http")
    ? location.image
    : `${API}${location.image}`;
}

export default function FeaturedLocationCorridors({
  locations = [],
}) {
  if (!locations.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#f7f3ee] py-24 md:py-28">
      {/* Background */}
      <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#c89d58]/[0.08] blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">

        {/* Heading */}
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
            Discover established neighbourhoods, emerging
            micro-markets and strategic growth corridors
            across Gurgaon and surrounding regions.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {locations.map((location, index) => {
            const publicSlug =
              buildPublicLocationSlug(location);

            if (!publicSlug) return null;

            return (
              <Link
                key={location._id}
                href={`/locations/${publicSlug}`}
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
                    delay: index * 0.06,
                  }}
                  whileHover={{
                    y: -8,
                  }}
                  className="relative h-[430px] overflow-hidden rounded-[30px] border border-black/[0.06] bg-[#111]"
                >
                  {/* Image */}
                  <img
                    src={getImage(location)}
                    alt={`${location.name} property market`}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://placehold.co/900x1100/f3f0e9/777777?text=Location";
                    }}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.07]"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                  {/* Top badge */}
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

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-6">

                    <div className="mb-3 flex items-center gap-2 text-white/70">
                      <MapPin size={14} />

                      <span className="text-[10px] uppercase tracking-[1.8px]">
                        Gurgaon
                      </span>
                    </div>

                    <h3 className="text-[25px] font-medium leading-tight text-white">
                      {location.name}
                    </h3>

                    <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">

                      <span className="text-[11px] uppercase tracking-[1.5px] text-white/60">
                        Explore Location
                      </span>

                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c89d58] text-black transition-transform duration-300 group-hover:rotate-45">
                        <ArrowUpRight size={17} />
                      </div>

                    </div>
                  </div>
                </motion.article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}