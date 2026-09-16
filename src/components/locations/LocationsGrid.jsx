"use client";

import Link from "next/link";
import {
  MapPin,
  ArrowUpRight,
} from "lucide-react";

/* ============================================================
   LOCATION PREPOSITION
============================================================ */

function getLocationPreposition(
  location
) {
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

  const value =
    `${name} ${slug}`;

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

  return onKeywords.some(
    (keyword) =>
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
   PUBLIC LOCATION URL
============================================================ */

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
    getLocationPreposition(
      location
    );

  /*
   * Child location:
   *
   * Farukhnagar
   * +
   * Gurgaon
   *
   * →
   * properties-in-farukhnagar-gurgaon
   */

  if (
    rootSlug &&
    rootSlug !== currentSlug
  ) {
    return `/locations/properties-${preposition}-${currentSlug}-${rootSlug}`;
  }

  /*
   * Root location:
   *
   * Gurgaon
   *
   * →
   * properties-in-gurgaon
   */

  return `/locations/properties-${preposition}-${currentSlug}`;
}

/* ============================================================
   LOCATION CARD
============================================================ */

function LocationCard({
  location,
}) {
  const root =
    location?._rootLocation ||
    location;

  const publicUrl =
    getPublicLocationUrl(
      location,
      root
    );

  const isRoot =
    location?._level === 0;

  return (
    <Link
      href={publicUrl}
      className="group relative block overflow-hidden rounded-[28px] border border-[#e8dfd3] bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#C89D58]/50 hover:shadow-2xl"
    >

      {/* Decorative background */}

      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#C89D58]/5 transition-transform duration-500 group-hover:scale-150" />

      <div className="relative p-6">

        {/* Top */}

        <div className="flex items-start justify-between gap-5">

          <div className="flex min-w-0 items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0f3b2e]">
              <MapPin
                size={19}
                className="text-[#D4AF37]"
              />
            </div>

            <div className="min-w-0">

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C89D58]">
                {isRoot
                  ? "Major Location"
                  : "Location"}
              </p>

              <h3 className="mt-1 truncate text-xl font-semibold text-[#081c15] transition-colors group-hover:text-[#C89D58]">
                {location?.name}
              </h3>

            </div>

          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e5e7eb] text-[#081c15] transition-all duration-300 group-hover:border-[#C89D58] group-hover:bg-[#C89D58] group-hover:text-white">

            <ArrowUpRight
              size={17}
            />

          </div>

        </div>

        {/* Parent */}

        {!isRoot &&
          location?._rootLocation
            ?.name && (
            <div className="mt-5 flex items-center gap-2 text-xs text-[#9ca3af]">

              <span>
                Part of
              </span>

              <span className="font-medium text-[#6b7280]">
                {
                  location
                    ._rootLocation
                    .name
                }
              </span>

            </div>
          )}

        {/* Divider */}

        <div className="my-5 h-px w-full bg-[#eee8df]" />

        {/* Bottom */}

        <div className="flex items-center justify-between">

          <span className="text-sm font-medium text-[#081c15]">
            View Properties
          </span>

          <span className="text-xs text-[#9ca3af] transition-colors group-hover:text-[#C89D58]">
            Explore →
          </span>

        </div>

      </div>

    </Link>
  );
}

/* ============================================================
   GRID
============================================================ */

export default function LocationsGrid({
  locations = [],
  loading = false,
}) {
  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <section className="px-6 pb-20 sm:px-8 lg:px-12">

        <div className="mx-auto max-w-7xl">

          <div className="mb-8">
            <div className="h-7 w-48 animate-pulse rounded bg-[#e8dfd3]" />
            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-[#eee8df]" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="h-48 animate-pulse rounded-[28px] border border-[#e8dfd3] bg-white"
              />
            ))}

          </div>

        </div>

      </section>
    );
  }

  /* ==========================================================
     EMPTY
  ========================================================== */

  if (!locations.length) {
    return (
      <section className="px-6 pb-20 sm:px-8 lg:px-12">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-[28px] border border-[#e8dfd3] bg-white px-6 py-16 text-center">

            <MapPin
              size={34}
              className="mx-auto text-[#C89D58]"
            />

            <h2 className="mt-5 text-2xl font-semibold text-[#081c15]">
              No Locations Found
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#6b7280]">
              Try searching for another
              city, sector, locality or
              real estate corridor.
            </p>

          </div>

        </div>

      </section>
    );
  }

  /* ==========================================================
     DIRECTORY
  ========================================================== */

  return (
    <section className="px-6 pb-20 sm:px-8 lg:px-12">

      <div className="mx-auto max-w-7xl">

        {/* Heading */}

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C89D58]">
              Location Directory
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#081c15]">
              Explore Property Markets
            </h2>

          </div>

          <p className="text-sm text-[#6b7280]">
            {locations.length}{" "}
            {locations.length === 1
              ? "location"
              : "locations"}
          </p>

        </div>

        {/* Grid */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {locations.map(
            (location) => (
              <LocationCard
                key={
                  location?._id ||
                  location?.id ||
                  location?.slug ||
                  location?.name
                }
                location={location}
              />
            )
          )}

        </div>

      </div>

    </section>
  );
}