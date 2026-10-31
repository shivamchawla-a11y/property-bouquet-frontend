
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

import { formatPrice } from "@/utils/formatPrice";

import {
  ArrowRight,
  BedDouble,
  Bath,
  MapPin,
} from "lucide-react";

// ============================================================
// CONFIGURATION
// ============================================================

const FEATURED_API = "/api/properties/featured";

const AUTOPLAY_DELAY = 3500;

const MAX_FEATURED = 12;

const FALLBACK_IMAGE =
  "https://placehold.co/600x400/f3f4f6/999999?text=Property";

// ============================================================
// IMAGE OPTIMIZATION
// ============================================================

function optimizeCloudinaryImage(url, width = 900) {
  if (!url || typeof url !== "string") {
    return FALLBACK_IMAGE;
  }

  const imageUrl = url.trim();

  if (
    !imageUrl.includes("res.cloudinary.com") ||
    !imageUrl.includes("/image/upload/")
  ) {
    return imageUrl;
  }

  const uploadPath =
    imageUrl.split("/image/upload/")[1] || "";

  // Avoid applying transformations twice.
  if (
    /^(?:[^/]*,)*(?:f_auto|q_auto|w_\d+|c_limit)(?:,|\/)/i.test(
      uploadPath
    )
  ) {
    return imageUrl;
  }

  return imageUrl.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto:good,w_${width},c_limit/`
  );
}

// ============================================================
// LOCATION HELPER
// ============================================================

function getLocationName(item) {
  const location = item?.locationData?.locationRef;

  if (!location) {
    return (
      item?.locationData?.customLocation ||
      item?.locationData?.locationName ||
      "Prime Location"
    );
  }

  return [
    location.name,
    location.parent?.name,
    location.parent?.parent?.name,
  ]
    .filter(Boolean)
    .join(", ") || "Prime Location";
}

// ============================================================
// PRICE HELPER
// ============================================================

function getPrice(item) {
  const details = item?.coreDetails;
  const configuration = item?.unitConfigurations?.[0];

  if (details?.priceOnRequest) {
    return "On Request";
  }

  const price =
    details?.startingPrice ?? configuration?.price;

  if (
    price === null ||
    price === undefined ||
    price === ""
  ) {
    return "Price Unavailable";
  }

  return `₹${formatPrice(price)}`;
}

// ============================================================
// PROPERTY IMAGE
// ============================================================

function PropertyImage({ item }) {
  const originalImage = item?.media?.heroImageUrl;

  const image = optimizeCloudinaryImage(
    originalImage,
    900
  );

  const [imageSrc, setImageSrc] = useState(image);

  useEffect(() => {
    setImageSrc(image);
  }, [image]);

  const handleImageError = (event) => {
    if (event.currentTarget.src !== FALLBACK_IMAGE) {
      event.currentTarget.onerror = null;
      setImageSrc(FALLBACK_IMAGE);
    }
  };

  if (!originalImage) {
    return (
      <div className="flex h-full items-center justify-center bg-[#eee9df] text-sm text-black/45">
        Property image coming soon
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={
        item?.coreDetails?.title ||
        "Featured property in Gurgaon"
      }
      width="900"
      height="600"
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      draggable="false"
      onError={handleImageError}
      className="h-full w-full object-cover"
    />
  );
}

// ============================================================
// PROPERTY CARD
// ============================================================

function FeaturedMobileCard({ item, index }) {
  const title =
    item?.coreDetails?.title || "Featured Property";

  const bedrooms =
    item?.unitConfigurations?.[0]?.bedrooms;

  const bathrooms =
    item?.unitConfigurations?.[0]?.bathrooms;

  return (
    <div className="mr-4 min-w-0 flex-[0_0_88%]">
      <Link
        href={item?.slug ? `/${item.slug}` : "/properties"}
        prefetch={false}
        aria-label={`View ${title}`}
        className="block h-full"
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
          transition={{
            duration: 0.45,
            delay: Math.min(index * 0.05, 0.15),
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          className="overflow-hidden rounded-[26px] border border-[#ebe5da] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
        >
          {/* IMAGE */}

          <div className="relative h-[240px] overflow-hidden bg-[#eee9df]">
            <PropertyImage item={item} />

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

            <div className="absolute left-4 top-4 rounded-full bg-[#c89948] px-4 py-2 text-[10px] font-semibold tracking-[1.5px] text-white">
              FEATURED
            </div>
          </div>

          {/* GOLD LINE */}

          <div className="h-[2px] bg-gradient-to-r from-[#c9a64b] via-[#e3c97d] to-[#c9a64b]" />

          {/* CONTENT */}

          <div className="p-5">

            {/* TITLE */}

            <h3
              className="line-clamp-2 text-[24px] leading-tight text-[#171717]"
              style={{
                fontFamily:
                  "Georgia, Times New Roman, serif",
              }}
            >
              {title}
            </h3>

            {/* LOCATION */}

            <div className="mt-3 flex gap-2">
              <MapPin
                size={16}
                className="mt-[2px] shrink-0 text-[#c89948]"
              />

              <span className="line-clamp-2 text-[13px] leading-6 text-black/60">
                {getLocationName(item)}
              </span>
            </div>

            {/* PROPERTY DETAILS */}

            <div className="mt-6 flex items-center justify-between text-black/65">

              <div className="flex items-center gap-2">
                <BedDouble size={16} />

                <span className="text-[13px]">
                  {bedrooms
                    ? `${bedrooms} Beds`
                    : "Luxury"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Bath size={16} />

                <span className="text-[13px]">
                  {bathrooms
                    ? `${bathrooms} Baths`
                    : "Residence"}
                </span>
              </div>
            </div>

            {/* PRICE */}

            <div className="mt-5">
              <p className="mb-2 text-[11px] uppercase tracking-[1px] text-black/45">
                {item?.coreDetails?.priceOnRequest
                  ? "Price"
                  : "Starting Price"}
              </p>

              <h4 className="text-[24px] font-bold leading-none text-[#111]">
                {getPrice(item)}
              </h4>
            </div>

            {/* VIEW PROPERTY */}

            <div className="mt-6 flex items-center justify-between border-t border-[#ece7df] pt-5">
              <span className="text-[12px] font-semibold uppercase tracking-[1.6px] text-[#bf8b37]">
                View Property
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#bf8b37] text-white">
                <ArrowRight size={18} />
              </div>
            </div>

          </div>
        </motion.article>
      </Link>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function FeaturedProjectsMobile() {
  const [featuredProperties, setFeaturedProperties] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const [fetchFailed, setFetchFailed] = useState(false);

  // ----------------------------------------------------------
  // AUTOPLAY
  // ----------------------------------------------------------

  const autoplay = useRef(null);

  if (!autoplay.current) {
    autoplay.current = Autoplay({
      delay: AUTOPLAY_DELAY,

      // Continue after manual interaction.
      stopOnInteraction: false,

      // Do not pause when hovered.
      stopOnMouseEnter: false,
    });
  }

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
    },
    [autoplay.current]
  );

  // ----------------------------------------------------------
  // FETCH FEATURED PROPERTIES
  // ----------------------------------------------------------

  useEffect(() => {
    const controller = new AbortController();

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

        const records = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.properties)
              ? result.properties
              : [];

        const published = records
          .filter(
            (property) =>
              property?.slug &&
              property?.coreDetails?.title &&
              property?.status === "published" &&
              property?.isDeleted !== true &&
              property?.isActive !== false &&
              (property?.propertyTag || []).includes(
                "Featured"
              )
          )
          .slice(0, MAX_FEATURED);

        if (!controller.signal.aborted) {
          setFeaturedProperties(published);
          setFetchFailed(false);
        }
      } catch (error) {
        if (
          error?.name !== "AbortError" &&
          !controller.signal.aborted
        ) {
          console.error(
            "Failed to load mobile featured properties:",
            error
          );

          setFetchFailed(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchFeaturedProperties();

    return () => {
      controller.abort();
    };
  }, []);

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <section
      className="overflow-hidden bg-[#f6f3ee] py-14 lg:hidden"
      aria-labelledby="featured-mobile-heading"
    >
      <div className="px-5">

        {/* HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
          viewport={{
            once: true,
          }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-black/55">
            FEATURED PROPERTIES
          </p>

          <h2
            id="featured-mobile-heading"
            className="mt-4 text-[34px] leading-[1.1] text-[#171717]"
            style={{
              fontFamily:
                "Georgia, Times New Roman, serif",
            }}
          >
            Exclusive Mandates.
            <br />
            Extraordinary Assets.
          </h2>

          <Link
            href="/properties"
            prefetch={false}
            className="mt-7 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[1.5px] text-[#bf8b37]"
          >
            VIEW ALL

            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* CAROUSEL */}

        <div
          ref={emblaRef}
          className="mt-10 overflow-hidden"
        >
          <div className="flex">

            {/* LOADING */}

            {loading && (
              <div className="flex-[0_0_100%] py-20 text-center text-sm text-black/60">
                Loading featured properties...
              </div>
            )}

            {/* EMPTY STATE */}

            {!loading &&
              featuredProperties.length === 0 && (
                <div className="flex-[0_0_100%] py-20 text-center text-sm text-black/60">
                  {fetchFailed
                    ? "Featured properties are temporarily unavailable."
                    : "No featured properties found."}

                  <div>
                    <Link
                      href="/properties"
                      prefetch={false}
                      className="mt-4 inline-flex items-center gap-2 font-semibold text-[#bf8b37]"
                    >
                      Explore properties
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              )}

            {/* PROPERTY CARDS */}

            {!loading &&
              featuredProperties.map((item, index) => (
                <FeaturedMobileCard
                  key={item._id || item.slug}
                  item={item}
                  index={index}
                />
              ))}

          </div>
        </div>
      </div>
    </section>
  );
}
