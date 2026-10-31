
"use client";

import Image from "next/image";
import Link from "next/link";
import SearchPanel from "./SearchPanel";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, Sparkles } from "lucide-react";

const FEATURED_API = "/api/properties/featured";
const ROTATION_MS = 3500;

// ============================================================
// CLOUDINARY IMAGE OPTIMIZATION
// ============================================================

function optimizeHeroImage(url) {
  if (!url || typeof url !== "string") return "";

  const cleanUrl = url.trim();

  if (!cleanUrl.includes("res.cloudinary.com")) {
    return cleanUrl;
  }

  const uploadMarker = "/image/upload/";
  const uploadIndex = cleanUrl.indexOf(uploadMarker);

  if (uploadIndex === -1) return cleanUrl;

  const beforeUpload = cleanUrl.slice(
    0,
    uploadIndex + uploadMarker.length
  );

  const afterUpload = cleanUrl.slice(
    uploadIndex + uploadMarker.length
  );

  const firstSegment = afterUpload.split("/")[0];

  // Avoid adding duplicate automatic format/quality transformations.
  if (
    /(^|,)f_auto(,|$)/.test(firstSegment) ||
    /(^|,)q_auto(:[^,]*)?(,|$)/.test(firstSegment)
  ) {
    return cleanUrl;
  }

  return `${beforeUpload}f_auto,q_auto:good,w_1600,c_limit/${afterUpload}`;
}

// ============================================================
// PROPERTY HELPERS
// ============================================================

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
    property?.media?.gallery?.[0],
    property?.gallery?.[0],
  ];

  for (const candidate of candidates) {
    const value =
      typeof candidate === "string"
        ? candidate
        : candidate?.url || candidate?.secure_url;

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  // No fallback image request.
  return "";
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

    if (parts.length) {
      return [...new Set(parts)].join(", ");
    }
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
    const labels = value
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.label ||
            item?.name ||
            item?.configuration ||
            item?.unitType
      )
      .filter(Boolean);

    if (labels.length) return [...new Set(labels)].join(" / ");
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number") {
    return `${value} BHK`;
  }

  const units = property?.unitConfigurations;

  if (Array.isArray(units) && units.length) {
    const labels = units
      .map((unit) => {
        if (!unit || typeof unit !== "object") return "";

        if (unit.unitType && typeof unit.unitType === "string") {
          return unit.unitType;
        }

        if (unit.bedrooms != null && unit.bedrooms !== "") {
          const bedrooms = Number(unit.bedrooms);

          return Number.isFinite(bedrooms)
            ? `${bedrooms} BHK`
            : `${unit.bedrooms} BHK`;
        }

        return "";
      })
      .filter(Boolean);

    if (labels.length) return [...new Set(labels)].join(" / ");
  }

  return "";
}

// ============================================================
// PRICE HELPERS
// ============================================================

function formatPrice(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) return "";

  if (amount >= 10000000) {
    return `₹${(amount / 10000000)
      .toFixed(2)
      .replace(/\.?0+$/, "")} Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000)
      .toFixed(2)
      .replace(/\.?0+$/, "")} Lac`;
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

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function HeroSection() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  // Track the image currently being displayed and decoded.
  const [imageReady, setImageReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const imageRef = useRef(null);
  const preloadedImagesRef = useRef(new Set());

  const reduceMotion = useReducedMotion();

  // ==========================================================
  // FETCH FEATURED PROPERTIES
  // ==========================================================

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    async function fetchFeaturedProperties() {
      try {
        const response = await fetch(FEATURED_API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Featured properties request failed: ${response.status}`
          );
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

        const validProperties = list.filter(
          (property) =>
            property &&
            typeof property === "object" &&
            typeof property.slug === "string" &&
            property.slug.trim() !== ""
        );

        setProperties(validProperties);
        setActiveIndex(0);
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error("Featured property carousel failed:", error);

          if (mounted) {
            setProperties([]);
            setActiveIndex(0);
          }
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

  // ==========================================================
  // TAB VISIBILITY
  // ==========================================================

  useEffect(() => {
    const handleVisibilityChange = () => {
      setPageVisible(!document.hidden);
    };

    handleVisibilityChange();

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  // ==========================================================
  // ACTIVE PROPERTY DATA
  // ==========================================================

  const activeProperty = properties[activeIndex] || null;

  const rawImage = useMemo(
    () => (activeProperty ? getPropertyImage(activeProperty) : ""),
    [activeProperty]
  );

  const image = useMemo(
    () => optimizeHeroImage(rawImage),
    [rawImage]
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

  // ==========================================================
  // RESET IMAGE STATE WHEN PROPERTY CHANGES
  // ==========================================================

  useEffect(() => {
    setImageReady(false);
    setImageFailed(false);
  }, [image]);

  // ==========================================================
  // IMAGE DECODE HANDLING
  // Reveal the text when the image is ready.
  // ==========================================================

  const handleImageLoad = useCallback(async () => {
    const currentImage = imageRef.current;

    if (!currentImage) return;

    try {
      if (typeof currentImage.decode === "function") {
        await currentImage.decode();
      }
    } catch {
      // Some browsers reject decode() even when the image is usable.
      // The load event itself is sufficient in that case.
    }

    if (imageRef.current === currentImage) {
      setImageReady(true);
    }
  }, []);

  const handleImageError = useCallback(() => {
    setImageFailed(true);
    setImageReady(true);
  }, []);

  // ==========================================================
  // PRELOAD THE NEXT PROPERTY IMAGE
  // Only one upcoming image is preloaded to avoid excess requests.
  // ==========================================================

  useEffect(() => {
    if (properties.length < 2) return;

    const nextIndex = (activeIndex + 1) % properties.length;
    const nextProperty = properties[nextIndex];

    const nextRawImage = getPropertyImage(nextProperty);
    const nextImage = optimizeHeroImage(nextRawImage);

    if (!nextImage || preloadedImagesRef.current.has(nextImage)) {
      return;
    }

    preloadedImagesRef.current.add(nextImage);

    const preload = new window.Image();
    preload.decoding = "async";
    preload.src = nextImage;
  }, [properties, activeIndex]);

  // ==========================================================
  // CONTINUOUS FEATURED PROPERTY AUTOPLAY
  // ==========================================================

  useEffect(() => {
    if (
      properties.length < 2 ||
      paused ||
      !pageVisible
    ) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex(
        (current) => (current + 1) % properties.length
      );
    }, ROTATION_MS);

    return () => window.clearInterval(timer);
  }, [properties.length, paused, pageVisible]);

  // ==========================================================
  // CAROUSEL NAVIGATION
  // ==========================================================

  const goToPrevious = useCallback(() => {
    if (properties.length < 2) return;

    setActiveIndex(
      (current) =>
        (current - 1 + properties.length) % properties.length
    );
  }, [properties.length]);

  const goToNext = useCallback(() => {
    if (properties.length < 2) return;

    setActiveIndex(
      (current) => (current + 1) % properties.length
    );
  }, [properties.length]);

  const showProperty = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  // ==========================================================
  // TEXT ENTRANCE ANIMATION
  // ==========================================================

  const textInitial = reduceMotion
    ? { opacity: 1, x: 0 }
    : { opacity: 0, x: -24 };

  const textAnimate = {
    opacity: imageReady || !image || imageFailed ? 1 : 0,
    x: imageReady || !image || imageFailed ? 0 : -24,
  };

  return (
    <section className="relative z-[10] overflow-visible bg-[#faf9f4] text-[#17342d]">
      {/* FEATURED PROPERTY CAROUSEL */}

      <div
        className="
          group relative h-[365px] w-full overflow-hidden bg-[#102c23]
          sm:h-[400px]
          md:h-[440px]
          lg:h-[465px]
          xl:h-[485px]
        "
      >
        {/* HERO IMAGE */}

        {image && !imageFailed && (
          <Image
            ref={imageRef}
            src={image}
            alt={
              activeProperty
                ? title
                : "Luxury properties by Property Bouquet"
            }
            fill
            priority
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            quality={80}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className="
              object-cover object-center
              transform-gpu
              transition-transform
              duration-[1800ms]
              ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:scale-[1.07]
            "
          />
        )}

        {/* LIGHTER OVERLAYS */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#071d16]/55 via-[#0d291f]/20 to-transparent" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071b14]/55 via-transparent to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af67]/80 to-transparent" />

        <div className="pointer-events-none absolute -right-20 -top-24 h-[300px] w-[300px] rounded-full border border-[#d4af67]/20 sm:h-[360px] sm:w-[360px]" />

        <div className="pointer-events-none absolute -right-6 -top-10 h-[230px] w-[230px] rounded-full border border-white/10 sm:h-[285px] sm:w-[285px]" />

        {/* PROPERTY INFORMATION */}

        <div className="relative mx-auto flex h-full w-full max-w-[1600px] items-end px-5 pb-[65px] sm:px-8 sm:pb-[70px] md:px-10 md:pb-[73px] lg:px-12 lg:pb-[76px] xl:px-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={
                activeProperty
                  ? getPropertyKey(activeProperty)
                  : "fallback-copy"
              }
              initial={textInitial}
              animate={textAnimate}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: -12 }
              }
              transition={{
                duration: reduceMotion ? 0 : 0.48,
                ease: [0.22, 1, 0.36, 1],
              }}
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
                    <span className="text-white/75">
                      Starting at{" "}
                    </span>

                    <span className="font-semibold text-[#f0c66e]">
                      {price}
                    </span>
                  </p>
                )}

                {price && (
                  <span className="hidden h-4 w-px bg-white/35 sm:block" />
                )}

                <p className="flex min-w-0 items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[1.2px] text-white/90 sm:text-[10px] sm:tracking-[1.7px]">
                  <MapPin
                    size={14}
                    className="shrink-0 text-[#e6b85e]"
                  />

                  <span className="line-clamp-2">
                    {location}
                  </span>
                </p>
              </div>

              <div className="mt-4 sm:mt-5">
                <Link
                  href={propertyHref}
                  prefetch={false}
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                  onFocus={() => setPaused(true)}
                  onBlur={() => setPaused(false)}
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

        {/* CAROUSEL ARROWS */}

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

        {/* CAROUSEL INDICATORS */}

        {properties.length > 1 && (
          <div className="absolute bottom-[47px] right-5 z-20 flex items-center gap-1.5 sm:bottom-[52px] sm:right-8 md:right-10">
            {properties.map((property, index) => (
              <button
                key={getPropertyKey(property)}
                type="button"
                onClick={() => showProperty(index)}
                aria-label={`Show featured property ${index + 1}`}
                aria-current={
                  activeIndex === index ? "true" : undefined
                }
                className={`h-[3px] rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5c47e] ${
                  activeIndex === index
                    ? "w-7 bg-[#e4bd70]"
                    : "w-2.5 bg-white/55 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}

        {/* LOADING INDICATOR */}

        {loading && (
          <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2 text-[9px] font-medium uppercase tracking-[1.8px] text-white/70 sm:left-8 md:left-10">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e4bd70]" />
            Discovering featured properties
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#17342d] via-[#d4af67] to-[#17342d]" />
      </div>

      {/* SEARCH PANEL — RENDER IMMEDIATELY */}

      <div className="relative z-30 mx-auto -mt-[31px] w-full max-w-[1420px] px-4 sm:-mt-[34px] sm:px-6 lg:-mt-[37px] lg:px-8 xl:px-10">
        <div
          className="
            rounded-[17px]
            border border-[#e7decd]
            bg-[#fffefa]
            p-[5px]
            shadow-[0_12px_32px_rgba(24,46,36,0.12)]
            sm:rounded-[20px]
            sm:p-[6px]
          "
        >
          <div className="rounded-[13px] sm:rounded-[16px]">
            <SearchPanel />
          </div>
        </div>
      </div>

      {/* SPACING BEFORE NEXT SECTION */}

      <div className="h-5 sm:h-7 lg:h-8" />
    </section>
  );
}
