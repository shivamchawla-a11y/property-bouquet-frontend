
"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";
import Link from "next/link";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MapPin,
} from "lucide-react";

// ============================================================
// CONFIGURATION
// ============================================================

const API = "/api";

const FALLBACK_IMAGE =
  "https://placehold.co/600x800/f3f4f6/999999?text=Location";

const FEATURED_LOCATIONS = [
  "Dwarka expressway",
  "Sohna",
  "Golf Course Extension Road",
  "SPR",
];

// ============================================================
// LOCATION HELPERS
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
    const currentRoot = root || location;

    const currentName = String(
      location?.name || ""
    )
      .trim()
      .toLowerCase();

    if (currentName === target) {
      return {
        location,
        root: currentRoot,
      };
    }

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

function getPublicLocationUrl(location, root = null) {
  if (!location) {
    return "/locations";
  }

  const currentSlug = slugifyLocation(
    location.slug || location.name || ""
  );

  if (!currentSlug) {
    return "/locations";
  }

  const rootSlug = slugifyLocation(
    root?.slug || root?.name || ""
  );

  const preposition =
    getLocationPreposition(location);

  if (rootSlug && rootSlug !== currentSlug) {
    return `/locations/properties-${preposition}-${currentSlug}-${rootSlug}`;
  }

  return `/locations/properties-${preposition}-${currentSlug}`;
}

// ============================================================
// IMAGE OPTIMIZATION
// ============================================================

function optimizeCloudinaryImage(url, width = 900) {
  if (!url || typeof url !== "string") {
    return FALLBACK_IMAGE;
  }

  const imageUrl = url.trim();

  // Only optimize Cloudinary-hosted images.
  if (
    !imageUrl.includes("res.cloudinary.com") ||
    !imageUrl.includes("/image/upload/")
  ) {
    return imageUrl;
  }

  // Avoid adding transformations twice.
  if (
    /\/image\/upload\/[^/]*(?:f_auto|q_auto|w_\d+)/i.test(
      imageUrl
    )
  ) {
    return imageUrl;
  }

  return imageUrl.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto:good,w_${width},c_limit/`
  );
}

function getImage(location) {
  const image = String(location?.image || "").trim();

  if (!image) {
    return FALLBACK_IMAGE;
  }

  if (/^https?:\/\//i.test(image)) {
    return optimizeCloudinaryImage(image, 900);
  }

  return `${API}${image.startsWith("/") ? "" : "/"}${image}`;
}

// ============================================================
// LOCATION IMAGE
// ============================================================

const LocationImage = memo(function LocationImage({
  location,
}) {
  const image = useMemo(
    () => getImage(location),
    [location]
  );

  const [imageSrc, setImageSrc] = useState(image);

  useEffect(() => {
    setImageSrc(image);
  }, [image]);

  const handleImageError = useCallback(() => {
    setImageSrc((current) => {
      if (current === FALLBACK_IMAGE) {
        return current;
      }

      return FALLBACK_IMAGE;
    });
  }, []);

  return (
    <img
      src={imageSrc}
      alt={`${location?.name || "Location"} properties in Gurgaon`}
      width="900"
      height="1200"
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      onError={handleImageError}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
    />
  );
});

// ============================================================
// LOCATION CARD
// ============================================================

const LocationCard = memo(function LocationCard({
  location,
  index,
}) {
  return (
    <Link
      href={location.url}
      className="block min-w-0"
      aria-label={`Explore properties in ${location.name}`}
      prefetch={false}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          delay: index * 0.04,
        }}
        viewport={{ once: true, amount: 0.15 }}
        className="group relative h-[390px] overflow-hidden rounded-[34px] border border-white/10 shadow-[0_20px_55px_rgba(0,0,0,0.14)] transition-shadow duration-500 hover:shadow-[0_28px_65px_rgba(0,0,0,0.2)]"
      >
        {/* GLASS BACKING */}

        <div className="pointer-events-none absolute inset-0 z-[1] rounded-[28px] border border-white/20 bg-white/[0.04]" />

        {/* LOCATION IMAGE */}

        <LocationImage location={location} />

        {/* DARK OVERLAY */}

        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#070707] via-black/35 to-transparent" />

        {/* SHINE EFFECT */}

        <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
          <div className="absolute -left-[120%] top-0 h-full w-[70%] rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-[left] duration-1000 group-hover:left-[140%]" />
        </div>

        {/* TOP TAG */}

        <div className="absolute left-5 top-5 z-10">
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
            <TrendingUp
              size={14}
              className="text-[#d7b26d]"
            />

            <span className="text-[11px] font-semibold tracking-[1px] text-white">
              PREMIUM LOCATION
            </span>
          </div>
        </div>

        {/* CARD CONTENT */}

        <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
          <div className="mb-3 flex items-center gap-2 text-white/75">
            <MapPin size={14} />

            <h3 className="text-[24px] font-semibold leading-[1.15] text-white">
              {location.name}
            </h3>
          </div>

          <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[2px] text-white/50">
                Investment Corridor
              </p>

              <p className="text-[16px] font-medium text-white">
                Explore Location
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d8b46b] via-[#c89d58] to-[#a9782f] text-black shadow-[0_12px_30px_rgba(201,157,88,0.35)] transition-transform duration-300 group-hover:scale-105">
              <ArrowRight size={18} />
            </div>
          </div>
        </div>

        {/* BORDER */}

        <div className="pointer-events-none absolute inset-0 z-10 rounded-[28px] border border-white/10" />

        {/* GOLD GLOW */}

        <div className="pointer-events-none absolute -bottom-10 left-1/2 z-[1] h-[120px] w-[120px] -translate-x-1/2 bg-[#c89d58]/20 opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-100" />
      </motion.div>
    </Link>
  );
});

// ============================================================
// SKELETON
// ============================================================

function LocationSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURED_LOCATIONS.map((name) => (
        <div
          key={name}
          className="h-[390px] animate-pulse rounded-[34px] border border-black/5 bg-white/60"
          aria-label={`Loading ${name}`}
        />
      ))}
    </div>
  );
}

// ============================================================
// EXPLORE LOCATIONS
// ============================================================

export default function ExploreLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);

  // ----------------------------------------------------------
  // FETCH AND PREPARE LOCATIONS
  // ----------------------------------------------------------

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLocations() {
      try {
        const response = await fetch(
          `${API}/locations/tree`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Location tree request failed: ${response.status}`
          );
        }

        const result = await response.json();

        if (controller.signal.aborted) {
          return;
        }

        const tree = Array.isArray(result?.data)
          ? result.data
          : [];

        const gurgaon = tree.find(
          (item) =>
            String(item?.name || "")
              .trim()
              .toLowerCase() === "gurgaon"
        );

        const children = Array.isArray(gurgaon?.children)
          ? gurgaon.children
          : [];

        const childrenByName = new Map(
          children.map((location) => [
            String(location?.name || "")
              .trim()
              .toLowerCase(),
            location,
          ])
        );

        // Preserve featured location order.
        const preparedLocations = FEATURED_LOCATIONS
          .map((name) =>
            childrenByName.get(name.toLowerCase())
          )
          .filter(Boolean)
          .map((location) => {
            const found = findLocationInTree(
              tree,
              location?.name
            );

            const actualLocation =
              found?.location || location;

            const rootLocation = found?.root || null;

            return {
              ...actualLocation,
              url: getPublicLocationUrl(
                actualLocation,
                rootLocation
              ),
            };
          });

        if (!controller.signal.aborted) {
          setLocations(preparedLocations);
        }
      } catch (error) {
        if (
          error?.name !== "AbortError" &&
          !controller.signal.aborted
        ) {
          console.error(
            "Failed to fetch featured locations:",
            error
          );

          setLocations([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchLocations();

    return () => {
      controller.abort();
    };
  }, []);

  // ----------------------------------------------------------
  // SCROLL CONTROLS
  // ----------------------------------------------------------

  const scrollLocations = useCallback((direction) => {
    const container = scrollRef.current;

    if (!container) return;

    const firstCard = container.querySelector(
      "[data-location-card]"
    );

    const cardWidth = firstCard
      ? firstCard.getBoundingClientRect().width
      : 300;

    container.scrollBy({
      left: direction * (cardWidth + 24),
      behavior: "smooth",
    });
  }, []);

  // ----------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------

  if (loading) {
    return (
      <section className="border-t border-black/5 bg-[#f6f3ee] py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-5">
          <div className="mb-12 text-center md:mb-16">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[3px] text-[#b88a3b]">
              EXPLORE BY LOCATION
            </p>

            <h2
              className="text-[34px] leading-[1.08] text-[#171717] md:text-[54px]"
              style={{
                fontFamily: "Georgia, Times New Roman, serif",
              }}
            >
              Gurgaon’s Most Premium
              <br />

              <span className="text-[#b88a3b]">
                Investment Corridors
              </span>
            </h2>
          </div>

          <LocationSkeleton />
        </div>
      </section>
    );
  }

  // ----------------------------------------------------------
  // EMPTY STATE
  // ----------------------------------------------------------

  if (!locations.length) {
    return null;
  }

  // ----------------------------------------------------------
  // MAIN SECTION
  // ----------------------------------------------------------

  return (
    <section className="relative overflow-hidden border-t border-black/5 bg-[#f6f3ee] py-16 md:py-24">
      {/* BACKGROUND GLOW */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-[350px] w-[700px] -translate-x-1/2 rounded-full bg-[#c89d58]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5">
        {/* HEADING */}

        <div className="mb-12 text-center md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            viewport={{ once: true }}
            className="mb-5 text-[11px] font-semibold uppercase tracking-[3px] text-[#b88a3b]"
          >
            EXPLORE BY LOCATION
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="text-[34px] leading-[1.08] text-[#171717] md:text-[54px]"
            style={{
              fontFamily: "Georgia, Times New Roman, serif",
            }}
          >
            Gurgaon’s Most Premium
            <br />

            <span className="text-[#b88a3b]">
              Investment Corridors
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true }}
            className="mx-auto mt-7 max-w-[760px] text-[15px] leading-[2] text-black/55"
          >
            Explore Gurgaon’s highest-performing luxury
            micro-markets curated for appreciation,
            exclusivity, lifestyle and institutional-grade
            investment potential.
          </motion.p>

          {/* BUTTONS AND ARROWS */}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/locations"
              prefetch={false}
              className="group flex h-[52px] items-center gap-3 rounded-full bg-[#171717] px-7 text-[13px] font-semibold tracking-[1px] text-white shadow-[0_10px_35px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-[1.02]"
            >
              VIEW ALL LOCATIONS

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Scroll locations left"
                onClick={() => scrollLocations(-1)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black/70 shadow-lg backdrop-blur-xl transition-colors duration-300 hover:bg-black hover:text-white"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                aria-label="Scroll locations right"
                onClick={() => scrollLocations(1)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black/70 shadow-lg backdrop-blur-xl transition-colors duration-300 hover:bg-black hover:text-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* LOCATION CARDS */}

        <div
          ref={scrollRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {locations.map((location, index) => (
            <div
              key={
                location?._id ||
                location?.slug ||
                location?.name
              }
              data-location-card
              className="min-w-0"
            >
              <LocationCard
                location={location}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
