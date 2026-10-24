"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, Sparkles } from "lucide-react";

const FEATURED_API = "/api/properties?propertyTag=Featured";
const ROTATION_MS = 5000;

const SearchPanel = dynamic(() => import("./SearchPanel"), {
  ssr: false,
  loading: () => (
    <div className="h-[64px] w-full animate-pulse rounded-[16px] border border-[#e8e0d1] bg-white" />
  ),
});

function getPropertyKey(property) {
  return (
    property?._id ||
    property?.id ||
    property?.slug ||
    property?.coreDetails?.title ||
    "featured-property"
  );
}

function getPropertyImage(property) {
  const candidates = [
    property?.media?.heroImageUrl,
    property?.media?.heroImage,
    property?.heroImageUrl,
    property?.image,
    property?.coreDetails?.image,
    property?.media?.images?.[0],
    property?.gallery?.[0],
  ];

  for (const candidate of candidates) {
    const value =
      typeof candidate === "string"
        ? candidate
        : candidate?.url || candidate?.secure_url;

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "/img1.jpg";
}

function getPropertyTitle(property) {
  return (
    property?.coreDetails?.title ||
    property?.title ||
    property?.name ||
    "Featured Property"
  );
}

function getPropertyLocation(property) {
  const location = property?.locationData?.locationRef;

  if (location) {
    const parts = [
      location?.name,
      location?.parent?.name,
      location?.parent?.parent?.name,
    ].filter(Boolean);

    if (parts.length) return [...new Set(parts)].join(", ");
  }

  return (
    property?.locationData?.customLocation ||
    property?.locationData?.locationName ||
    property?.location ||
    property?.address ||
    "Explore the location"
  );
}

function getPropertyConfiguration(property) {
  const core = property?.coreDetails || {};
  const configuration = property?.configurationData || {};

  const value =
    core?.configuration ||
    core?.configurations ||
    core?.bedrooms ||
    core?.bhk ||
    configuration?.configuration ||
    configuration?.configurations ||
    configuration?.bedroom ||
    configuration?.bhk ||
    property?.configurations;

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.label || item?.name || item?.configuration
      )
      .filter(Boolean)
      .join(" / ");
  }

  if (typeof value === "string") return value;
  if (typeof value === "number") return `${value} BHK`;

  return "";
}

function formatPrice(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) return "";

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2).replace(/\.?0+$/, "")} Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2).replace(/\.?0+$/, "")} Lac`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

function getStartingPrice(property) {
  if (
    property?.coreDetails?.priceOnRequest === true ||
    property?.pricing?.priceOnRequest === true
  ) {
    return "Price on Request";
  }

  const candidates = [
    property?.pricing?.startingPrice,
    property?.pricing?.minPrice,
    property?.pricing?.priceFrom,
    property?.coreDetails?.startingPrice,
    property?.coreDetails?.minPrice,
    property?.startingPrice,
    property?.minPrice,
    property?.priceRange?.min,
  ];

  for (const value of candidates) {
    if (typeof value === "number" && value > 0) {
      return formatPrice(value);
    }

    if (typeof value === "string" && value.trim()) {
      const cleaned = value.trim();

      if (/price on request/i.test(cleaned)) {
        return "Price on Request";
      }

      if (/\d/.test(cleaned)) {
        const numeric = Number(cleaned.replace(/[₹,\s]/g, ""));

        if (Number.isFinite(numeric) && numeric > 0) {
          return formatPrice(numeric);
        }

        return cleaned;
      }
    }
  }

  return "";
}

export default function HeroSection() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    async function fetchFeaturedProperties() {
      try {
        const response = await fetch(FEATURED_API, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Featured properties request failed: ${response.status}`);
        }

        const result = await response.json();

        if (!mounted) return;

        const list = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.properties)
            ? result.properties
            : Array.isArray(result)
              ? result
              : [];

        const published = list.filter(
          (property) =>
            property?.status === "published" &&
            property?.isDeleted !== true &&
            property?.isActive !== false &&
            property?.deletedFromStatus !== "trash"
        );

        setProperties(published);
        setActiveIndex(0);
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error("Featured property carousel failed:", error);
          if (mounted) setProperties([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchFeaturedProperties();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (properties.length < 2 || paused) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % properties.length);
    }, ROTATION_MS);

    return () => window.clearInterval(timer);
  }, [properties.length, paused]);

  const activeProperty = properties[activeIndex] || null;

  const image = useMemo(
    () => (activeProperty ? getPropertyImage(activeProperty) : "/img1.jpg"),
    [activeProperty]
  );

  const title = activeProperty
    ? getPropertyTitle(activeProperty)
    : "Discover Exceptional Properties";

  const location = activeProperty
    ? getPropertyLocation(activeProperty)
    : "Explore premium real estate across India";

  const configuration = activeProperty
    ? getPropertyConfiguration(activeProperty)
    : "";

  const price = activeProperty
    ? getStartingPrice(activeProperty)
    : "";

  const propertyHref = activeProperty?.slug
    ? `/${activeProperty.slug}`
    : "/properties";

  function goToPrevious() {
    if (properties.length < 2) return;

    setActiveIndex(
      (current) => (current - 1 + properties.length) % properties.length
    );
  }

  function goToNext() {
    if (properties.length < 2) return;

    setActiveIndex((current) => (current + 1) % properties.length);
  }

  return (
    <section className="relative z-[10] overflow-visible bg-[#faf9f4] text-[#17342d]">
      {/* COMPACT FULL-WIDTH FEATURED CAROUSEL */}

      <div
  className="
    relative w-full overflow-hidden
    h-[340px]
    sm:h-[380px]
    md:h-[420px]
    lg:h-[440px]
    xl:h-[460px]
    bg-[#102c23]
  "
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setPaused(false);
          }
        }}
      >
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={activeProperty ? getPropertyKey(activeProperty) : "fallback"}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.65 }}
            className="absolute inset-0"
          >
            <Image
              src={image}
              alt={activeProperty ? title : "Luxury properties by Property Bouquet"}
              fill
              priority
              sizes="100vw"
              quality={88}
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Luxury green image treatment */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#071d16]/85 via-[#0d291f]/45 to-[#0d291f]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071b14]/80 via-transparent to-[#071b14]/15" />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af67]/80 to-transparent" />
        <div className="pointer-events-none absolute -right-20 -top-24 h-[300px] w-[300px] rounded-full border border-[#d4af67]/20 sm:h-[360px] sm:w-[360px]" />
        <div className="pointer-events-none absolute -right-6 -top-10 h-[230px] w-[230px] rounded-full border border-white/10 sm:h-[285px] sm:w-[285px]" />

        {/* Property information: vertically compact */}

        <div className="relative mx-auto flex h-full w-full max-w-[1600px] items-end px-5 pb-[65px] sm:px-8 sm:pb-[70px] md:px-10 md:pb-[73px] lg:px-12 lg:pb-[76px] xl:px-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeProperty ? getPropertyKey(activeProperty) : "fallback-copy"}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
              transition={{ duration: reduceMotion ? 0 : 0.35 }}
              className="relative z-10 w-full max-w-[760px]"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d4af67]/55 bg-[#d4af67]/10 text-[#e5c47e]">
                  <Sparkles size={14} strokeWidth={1.7} />
                </span>

                <span className="text-[9px] font-semibold uppercase tracking-[2.7px] text-[#f0d9a5] sm:text-[10px] sm:tracking-[3.5px]">
                  Featured Properties
                </span>

                <span className="h-px w-10 bg-[#d4af67]/80 sm:w-14" />
              </div>

              {configuration && (
                <p className="mb-1 font-serif text-[16px] text-[#f0d9a5] sm:text-[19px] md:text-[21px]">
                  {configuration}
                </p>
              )}

              <h1 className="max-w-[720px] font-serif text-[28px] font-medium leading-[1.08] tracking-[-0.5px] text-white drop-shadow sm:text-[34px] md:text-[39px] lg:text-[43px] xl:text-[47px]">
                {title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mt-4">
                {price && (
                  <p className="text-[12px] font-medium text-white sm:text-[14px]">
                    <span className="text-white/75">Starting at </span>
                    <span className="font-semibold text-[#f0c66e]">{price}</span>
                  </p>
                )}

                {price && (
                  <span className="hidden h-4 w-px bg-white/35 sm:block" />
                )}

                <p className="flex min-w-0 items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[1.2px] text-white/90 sm:text-[10px] sm:tracking-[1.7px]">
                  <MapPin size={14} className="shrink-0 text-[#e6b85e]" />
                  <span className="line-clamp-2">{location}</span>
                </p>
              </div>

              <div className="mt-4 sm:mt-5">
                <Link
                  href={propertyHref}
                  className="
                    inline-flex min-h-[38px] items-center gap-2.5
                    rounded-full border border-[#e5c47e]/70
                    bg-[#d4af67] px-4 py-2.5
                    text-[10px] font-bold tracking-[0.2px] text-[#142c22]
                    shadow-[0_6px_20px_rgba(0,0,0,0.16)]
                    transition-colors duration-200
                    hover:bg-[#e6c783]
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-[#f0d9a5]
                  "
                >
                  Explore Property
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel arrows */}

        {properties.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous featured property"
              className="
                absolute left-3 top-1/2 z-20
                flex h-9 w-9 -translate-y-1/2 items-center justify-center
                rounded-full border border-white/45 bg-[#102c23]/25
                text-white backdrop-blur-md transition-colors
                hover:border-[#d4af67] hover:bg-[#d4af67] hover:text-[#17342d]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5c47e]
                sm:left-5 sm:h-10 sm:w-10 md:left-7
              "
            >
              <ArrowLeft size={17} />
            </button>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Next featured property"
              className="
                absolute right-3 top-1/2 z-20
                flex h-9 w-9 -translate-y-1/2 items-center justify-center
                rounded-full border border-white/45 bg-[#102c23]/25
                text-white backdrop-blur-md transition-colors
                hover:border-[#d4af67] hover:bg-[#d4af67] hover:text-[#17342d]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5c47e]
                sm:right-5 sm:h-10 sm:w-10 md:right-7
              "
            >
              <ArrowRight size={17} />
            </button>
          </>
        )}

        {/* Compact carousel indicators */}

        {properties.length > 1 && (
          <div className="absolute bottom-[47px] right-5 z-20 flex items-center gap-1.5 sm:bottom-[52px] sm:right-8 md:right-10">
            {properties.map((property, index) => (
              <button
                key={getPropertyKey(property)}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show featured property ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                className={`h-[3px] rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5c47e] ${
                  activeIndex === index
                    ? "w-7 bg-[#e4bd70]"
                    : "w-2.5 bg-white/55 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}

        {loading && (
          <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2 text-[9px] font-medium uppercase tracking-[1.8px] text-white/70 sm:left-8 md:left-10">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e4bd70]" />
            Discovering featured properties
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#17342d] via-[#d4af67] to-[#17342d]" />
      </div>

      {/* SEARCH PANEL: smaller overlap so more of it is visible */}

      <div className="relative z-30 mx-auto -mt-[31px] w-full max-w-[1420px] px-4 sm:-mt-[34px] sm:px-6 lg:-mt-[37px] lg:px-8 xl:px-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.1 }}
          className="
            rounded-[17px] border border-[#e7decd]
            bg-[#fffefa] p-[5px]
            shadow-[0_12px_32px_rgba(24,46,36,0.14)]
            sm:rounded-[20px] sm:p-[6px]
          "
        >
          <div className="rounded-[13px] sm:rounded-[16px]">
            <SearchPanel />
          </div>
        </motion.div>
      </div>

      {/* Controlled spacing before the next section */}

      <div className="h-5 sm:h-7 lg:h-8" />
    </section>
  );
}
