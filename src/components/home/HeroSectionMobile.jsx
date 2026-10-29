"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Sparkles,
  Building2,
  Home,
  ShieldCheck,
  Target,
  Landmark,
  Trees,
} from "lucide-react";

import SearchPanelMobile from "./SearchPanelMobile";

const FEATURED_API = "/api/properties/featured";
const CATEGORIES_API = "/api/properties/categories";
const ROTATION_MS = 5000;
const SWIPE_THRESHOLD = 45;

/* ============================================================
   PROPERTY HELPERS
============================================================ */

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
    core.configuration ||
    core.configurations ||
    core.bedrooms ||
    core.bhk ||
    configuration.configuration ||
    configuration.configurations ||
    configuration.bedroom ||
    configuration.bhk ||
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

    if (labels.length) {
      return [...new Set(labels)].join(" / ");
    }
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number") {
    return `${value} BHK`;
  }

  const units = property?.unitConfigurations;

  if (Array.isArray(units)) {
    const labels = units
      .map((unit) => {
        if (!unit || typeof unit !== "object") return "";

        if (typeof unit.unitType === "string" && unit.unitType.trim()) {
          return unit.unitType.trim();
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

    if (labels.length) {
      return [...new Set(labels)].join(" / ");
    }
  }

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

/* ============================================================
   CATEGORY HELPERS
============================================================ */

function getCategoryScore(name) {
  const value = String(name || "").toLowerCase();

  if (
    value.includes("apartment") ||
    value.includes("residential") ||
    value.includes("flat")
  ) return 100;

  if (value.includes("villa")) return 90;

  if (value.includes("plot") || value.includes("land")) return 80;

  if (
    value.includes("commercial") ||
    value.includes("office") ||
    value.includes("retail")
  ) return 70;

  if (value.includes("builder") || value.includes("floor")) return 60;

  if (value.includes("penthouse")) return 55;

  if (value.includes("investment")) return 50;

  return 10;
}

function getCategoryIcon(categoryName) {
  const value = String(categoryName || "").toLowerCase();

  if (value.includes("plot") || value.includes("land")) return Trees;

  if (
    value.includes("commercial") ||
    value.includes("office") ||
    value.includes("retail")
  ) return Landmark;

  if (value.includes("villa")) return Home;

  return Building2;
}

/* ============================================================
   MAIN MOBILE HERO
============================================================ */

export default function HeroSectionMobile() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const [propertyCategories, setPropertyCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const reduceMotion = useReducedMotion();

  // Store touch coordinates without triggering extra renders.
  const touchStartRef = useRef(null);

  /* ==========================================================
     FETCH FEATURED PROPERTIES
  ========================================================== */

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    async function fetchFeaturedProperties() {
      try {
        const response = await fetch(FEATURED_API, {
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
            property &&
            typeof property === "object" &&
            typeof property.slug === "string" &&
            property.slug.trim() !== "" &&
            property.status === "published" &&
            property.isDeleted !== true &&
            property.isActive !== false &&
            property.deletedFromStatus !== "trash"
        );

        setProperties(published);
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

  /* ==========================================================
     FETCH PROPERTY CATEGORIES INDEPENDENTLY
  ========================================================== */

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    async function fetchPropertyCategories() {
      try {
        const response = await fetch(CATEGORIES_API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Property categories request failed: ${response.status}`);
        }

        const result = await response.json();

        if (!mounted) return;

        const categoryNames = Array.isArray(result?.data)
          ? result.data
          : [];

        const uniqueCategories = [
          ...new Set(
            categoryNames
              .filter((name) => typeof name === "string")
              .map((name) => name.trim())
              .filter(Boolean)
          ),
        ];

        uniqueCategories.sort((a, b) => {
          const difference = getCategoryScore(b) - getCategoryScore(a);
          return difference || a.localeCompare(b);
        });

        setPropertyCategories(uniqueCategories.slice(0, 4));
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error("Property category fetch failed:", error);

          if (mounted) setPropertyCategories([]);
        }
      } finally {
        if (mounted) setCategoriesLoading(false);
      }
    }

    fetchPropertyCategories();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  /* ==========================================================
     AUTOMATIC CAROUSEL ROTATION
  ========================================================== */

  useEffect(() => {
    if (properties.length < 2 || paused) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % properties.length);
    }, ROTATION_MS);

    return () => window.clearInterval(timer);
  }, [properties.length, paused]);

  /* ==========================================================
     CAROUSEL CONTROLS AND SWIPE
  ========================================================== */

  const goToPrevious = useCallback(() => {
    if (properties.length < 2) return;

    setActiveIndex(
      (current) => (current - 1 + properties.length) % properties.length
    );
  }, [properties.length]);

  const goToNext = useCallback(() => {
    if (properties.length < 2) return;

    setActiveIndex((current) => (current + 1) % properties.length);
  }, [properties.length]);

  const handleTouchStart = useCallback((event) => {
    const touch = event.touches?.[0];

    if (!touch) return;

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    setPaused(true);
  }, []);

  const handleTouchEnd = useCallback(
    (event) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;

      if (!start) {
        setPaused(false);
        return;
      }

      const touch = event.changedTouches?.[0];

      if (!touch) {
        setPaused(false);
        return;
      }

      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;

      // Only change properties for intentional horizontal swipes.
      // Normal vertical page scrolling is not intercepted.
      if (
        Math.abs(deltaX) >= SWIPE_THRESHOLD &&
        Math.abs(deltaX) > Math.abs(deltaY) * 1.2
      ) {
        if (deltaX < 0) {
          goToNext();
        } else {
          goToPrevious();
        }
      }

      setPaused(false);
    },
    [goToNext, goToPrevious]
  );

  const handleTouchCancel = useCallback(() => {
    touchStartRef.current = null;
    setPaused(false);
  }, []);

  /* ==========================================================
     ACTIVE PROPERTY DATA
  ========================================================== */

  const activeProperty = properties[activeIndex] || null;

  const image = activeProperty
    ? getPropertyImage(activeProperty)
    : "/img1.jpg";

  const title = activeProperty
    ? getPropertyTitle(activeProperty)
    : "Discover Exceptional Properties";

  const location = activeProperty
    ? getPropertyLocation(activeProperty)
    : "Explore premium real estate across India";

  const configuration = activeProperty
    ? getPropertyConfiguration(activeProperty)
    : "";

  const price = activeProperty ? getStartingPrice(activeProperty) : "";

  const propertyHref = activeProperty?.slug
    ? `/${activeProperty.slug}`
    : "/properties";

  const categoryCards = useMemo(
    () =>
      propertyCategories.map((categoryName, index) => ({
        title: categoryName,
        icon: getCategoryIcon(categoryName),
        image: `/img${index + 4}.webp`,
      })),
    [propertyCategories]
  );

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section className="relative z-[100] overflow-visible bg-[#faf9f4] text-[#17342d]">

      {/* FEATURED PROPERTY CAROUSEL */}

      <div
        className="
          relative h-[365px] w-full overflow-hidden bg-[#102c23]
          touch-pan-y
          min-[380px]:h-[390px]
          min-[430px]:h-[410px]
          sm:h-[430px]
        "
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setPaused(false);
          }
        }}
      >
        {/* Featured image */}

        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeProperty ? getPropertyKey(activeProperty) : "fallback"}
            initial={{ opacity: reduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={image}
              alt={
                activeProperty
                  ? title
                  : "Luxury properties by Property Bouquet"
              }
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              quality={75}
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Lighter overlays to reveal property photography */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#071d16]/55 via-[#0d291f]/20 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#071b14]/65 via-[#071b14]/10 to-transparent" />

        {/* Gold accent */}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af67] to-transparent" />

        {/* Decorative rings */}

        <div className="pointer-events-none absolute -right-[100px] top-[20px] h-[260px] w-[260px] rounded-full border border-[#d4af67]/20 min-[430px]:h-[300px] min-[430px]:w-[300px]" />

        <div className="pointer-events-none absolute -right-[60px] top-[60px] h-[190px] w-[190px] rounded-full border border-white/10 min-[430px]:h-[225px] min-[430px]:w-[225px]" />

        {/* PROPERTY INFORMATION */}

        <div className="relative mx-auto flex h-full w-full max-w-[640px] items-end px-5 pb-[64px] min-[380px]:px-6 min-[430px]:px-7 sm:px-8">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={activeProperty ? getPropertyKey(activeProperty) : "fallback-copy"}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.22 }}
              className="relative z-10 w-full"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#d4af67]/55 bg-[#d4af67]/10 text-[#e5c47e]">
                  <Sparkles size={14} strokeWidth={1.7} />
                </span>

                <span className="text-[9px] font-semibold uppercase tracking-[2.1px] text-[#f0d9a5] min-[430px]:text-[10px] min-[430px]:tracking-[2.7px]">
                  Featured Properties
                </span>

                <span className="h-px w-8 bg-[#d4af67]/80 min-[380px]:w-10" />
              </div>

              {configuration && (
                <p className="mb-1.5 line-clamp-1 font-serif text-[15px] text-[#f0d9a5] min-[380px]:text-[17px] min-[430px]:text-[19px]">
                  {configuration}
                </p>
              )}

              <h1 className="max-w-[520px] font-serif text-[29px] font-medium leading-[1.08] tracking-[-0.7px] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] min-[380px]:text-[32px] min-[430px]:text-[35px] sm:text-[39px]">
                {title}
              </h1>

              {price && (
                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-[10px] text-white/90 min-[380px]:text-[11px]">
                    Starting at
                  </span>

                  <span className="text-[15px] font-semibold text-[#f0c66e] drop-shadow-sm min-[380px]:text-[17px]">
                    {price}
                  </span>
                </div>
              )}

              <p className="mt-2.5 flex max-w-full items-start gap-1.5 text-[9px] font-medium leading-[1.5] tracking-[0.7px] text-white drop-shadow-sm min-[380px]:text-[10px] min-[430px]:tracking-[1px]">
                <MapPin size={14} className="mt-[1px] shrink-0 text-[#e6b85e]" />
                <span className="line-clamp-2 min-w-0">{location}</span>
              </p>

              <div className="mt-4 min-[380px]:mt-5">
                <Link
                  href={propertyHref}
                  className="
                    inline-flex min-h-[39px] items-center justify-center gap-2
                    rounded-full border border-[#e5c47e]/75
                    bg-[#d4af67] px-4 py-2.5
                    text-[10px] font-bold tracking-[0.2px] text-[#142c22]
                    shadow-[0_6px_20px_rgba(0,0,0,0.18)]
                    transition-colors duration-200
                    hover:bg-[#e6c783]
                    active:scale-[0.98]
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

        {/* PREVIOUS / NEXT */}

        {properties.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous featured property"
              className="
                absolute left-2 top-[44%] z-20
                flex h-8 w-8 -translate-y-1/2 items-center justify-center
                rounded-full border border-white/50 bg-[#102c23]/35
                text-white backdrop-blur-sm transition-colors
                hover:border-[#d4af67] hover:bg-[#d4af67] hover:text-[#17342d]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5c47e]
                min-[430px]:left-3 min-[430px]:h-9 min-[430px]:w-9
              "
            >
              <ArrowLeft size={15} />
            </button>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Next featured property"
              className="
                absolute right-2 top-[44%] z-20
                flex h-8 w-8 -translate-y-1/2 items-center justify-center
                rounded-full border border-white/50 bg-[#102c23]/35
                text-white backdrop-blur-sm transition-colors
                hover:border-[#d4af67] hover:bg-[#d4af67] hover:text-[#17342d]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5c47e]
                min-[430px]:right-3 min-[430px]:h-9 min-[430px]:w-9
              "
            >
              <ArrowRight size={15} />
            </button>
          </>
        )}

        {/* INDICATORS */}

        {properties.length > 1 && (
          <div className="absolute bottom-[37px] right-5 z-20 flex max-w-[55%] items-center justify-end gap-1.5 min-[380px]:right-6 min-[430px]:right-7">
            {properties.map((property, index) => (
              <button
                key={getPropertyKey(property)}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show featured property ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                className={`h-[3px] rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5c47e] ${
                  activeIndex === index
                    ? "w-6 bg-[#e4bd70]"
                    : "w-2 bg-white/65 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}

        {loading && (
          <div className="absolute bottom-[35px] left-5 z-20 flex items-center gap-2 text-[8px] font-medium uppercase tracking-[1.1px] text-white/90 min-[380px]:left-6 min-[430px]:left-7">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e4bd70]" />
            Loading properties
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#17342d] via-[#d4af67] to-[#17342d]" />
      </div>

      {/* MOBILE SEARCH PANEL — RENDER IMMEDIATELY */}

      <div className="relative z-[1000] mx-auto -mt-[25px] w-full max-w-[640px] px-3 min-[380px]:px-4 min-[430px]:px-5">
        <div
          className="
            relative z-[1000]
            rounded-[17px] border border-[#e7decd]
            bg-[#fffefa] p-[5px]
            shadow-[0_12px_32px_rgba(24,46,36,0.12)]
            sm:rounded-[20px] sm:p-[6px]
          "
        >
          <div className="relative z-[1000] overflow-visible rounded-[13px]">
            <SearchPanelMobile />
          </div>
        </div>
      </div>

      {/* TRUST FEATURES */}

      <div className="relative z-[1] mx-auto mt-5 w-full max-w-[640px] px-4 pb-5 min-[430px]:px-5">
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 border-b border-[#e9e5dc] pb-5">
          <TrustItem
            icon={ShieldCheck}
            title="Exclusive Listings"
            subtitle="Handpicked premium properties"
          />

          <TrustItem
            icon={Building2}
            title="Verified Developers"
            subtitle="Trusted & established brands"
          />

          <TrustItem
            icon={Target}
            title="End-to-End Support"
            subtitle="From search to possession"
          />

          <TrustItem
            icon={ShieldCheck}
            title="Better Investment"
            subtitle="Build wealth for tomorrow"
          />
        </div>
      </div>

      {/* EXPLORE BY CATEGORY */}

      <section className="relative z-[1] overflow-visible bg-[#fbfaf6] px-4 py-6 min-[430px]:px-5 min-[430px]:py-7">
        <div className="mx-auto w-full max-w-[600px]">
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-3">
              <span className="text-[8px] font-semibold uppercase tracking-[2.2px] text-[#888379]">
                Explore by Category
              </span>

              <span className="h-px w-9 bg-[#c89d58]" />
            </div>

            <h2
              className="font-serif text-[25px] leading-[1.1] tracking-[-0.7px] text-[#173a31] min-[430px]:text-[28px]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Find Properties That Match
              <br />
              Your Dreams
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {categoriesLoading ? (
              <>
                <CategorySkeleton />
                <CategorySkeleton />
                <CategorySkeleton />
                <CategorySkeleton />
              </>
            ) : categoryCards.length > 0 ? (
              categoryCards.map((category) => (
                <CategoryCard
                  key={category.title}
                  title={category.title}
                  icon={category.icon}
                  image={category.image}
                />
              ))
            ) : (
              <div className="col-span-2 flex min-h-[100px] items-center justify-center rounded-[14px] border border-[#e8e2d7] bg-white px-4 text-center text-[9px] uppercase tracking-[1.5px] text-[#8a8f8b]">
                Explore our property collection
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}

/* ============================================================
   TRUST ITEM
============================================================ */

function TrustItem({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 px-1">
      <span className="flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full border border-[#d9bd86] text-[#bd914d]">
        <Icon size={14} strokeWidth={1.7} />
      </span>

      <span className="min-w-0">
        <span className="block truncate text-[9px] font-semibold text-[#394e47] min-[430px]:text-[10px]">
          {title}
        </span>

        <span className="mt-[3px] block truncate text-[7.5px] text-[#8a918c] min-[430px]:text-[8px]">
          {subtitle}
        </span>
      </span>
    </div>
  );
}

/* ============================================================
   CATEGORY SKELETON
============================================================ */

function CategorySkeleton() {
  return (
    <div className="h-[112px] animate-pulse rounded-[14px] border border-[#e7e1d6] bg-[#eeeae1] min-[430px]:h-[125px]" />
  );
}

/* ============================================================
   CATEGORY CARD
============================================================ */

function CategoryCard({ title, icon: Icon = Building2, image }) {
  const href = `/properties?propertyType=${encodeURIComponent(title)}`;

  return (
    <Link
      href={href}
      className="
        group relative h-[112px] overflow-hidden
        rounded-[14px] border border-white bg-[#163a31]
        shadow-[0_7px_20px_rgba(22,48,40,0.08)]
        min-[430px]:h-[125px]
      "
    >
      <Image
        src={image}
        alt={`${title} properties`}
        fill
        sizes="(max-width: 639px) 50vw, 300px"
        loading="lazy"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#12392f]/85 via-[#12392f]/20 to-transparent" />

      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Icon
            size={13}
            strokeWidth={1.7}
            className="shrink-0 text-[#d4b16d]"
          />

          <span className="truncate text-[8.5px] font-medium text-white min-[430px]:text-[9px]">
            {title}
          </span>
        </div>

        <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-white/55 text-white transition-colors duration-200 group-hover:border-[#d4b16d] group-hover:bg-[#d4b16d] group-hover:text-[#17342d]">
          <ArrowRight size={10} strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
