
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";

import {
  ArrowRight,
  Star,
  MapPin,
} from "lucide-react";

const TRENDING_API = "/api/properties?propertyTag=Trending";
const AUTOPLAY_DELAY = 3500;
const MAX_TRENDING = 12;

// ============================================================
// CLOUDINARY IMAGE OPTIMIZATION
// ============================================================

function optimizeCloudinaryImage(url, width = 900) {
  if (!url || typeof url !== "string") return "";

  // Only transform Cloudinary images.
  if (!url.includes("res.cloudinary.com")) return url;

  const uploadMarker = "/image/upload/";
  const uploadIndex = url.indexOf(uploadMarker);

  if (uploadIndex === -1) return url;

  const prefix = url.slice(0, uploadIndex + uploadMarker.length);
  const remaining = url.slice(uploadIndex + uploadMarker.length);

  // Avoid adding duplicate transformations.
  if (
    /(^|\/)(f_auto|q_auto|w_\d+|c_limit)(,|\/)/.test(remaining)
  ) {
    return url;
  }

  return `${prefix}f_auto,q_auto:good,w_${width},c_limit/${remaining}`;
}

// ============================================================
// HELPERS
// ============================================================

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

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

function getPrice(item) {
  const details = item?.coreDetails;
  const configuration = item?.unitConfigurations?.[0];

  if (details?.priceOnRequest) {
    return "On Request";
  }

  const price = details?.startingPrice ?? configuration?.price;

  if (price === null || price === undefined || price === "") {
    return "Price Unavailable";
  }

  return `₹${formatPrice(price)}`;
}

// ============================================================
// PROPERTY IMAGE
// ============================================================

function TrendingMobileImage({ src, alt }) {
  const [imageFailed, setImageFailed] = useState(false);

  const optimizedSrc = useMemo(
    () => optimizeCloudinaryImage(src, 900),
    [src]
  );

  useEffect(() => {
    setImageFailed(false);
  }, [optimizedSrc]);

  if (!optimizedSrc || imageFailed) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-black/45">
        Property image coming soon
      </div>
    );
  }

  return (
    <img
      src={optimizedSrc}
      alt={alt || "Trending property"}
      width="900"
      height="600"
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      onError={() => setImageFailed(true)}
      className="h-full w-full object-cover transition-transform duration-500"
    />
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function TrendingProjectsMobile() {
  const [trendingProperties, setTrendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);

  // Keep the autoplay plugin stable.
  const autoplay = useRef(null);

  if (!autoplay.current) {
    autoplay.current = Autoplay({
      delay: AUTOPLAY_DELAY,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    });
  }

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      containScroll: "trimSnaps",
      slidesToScroll: 1,
    },
    [autoplay.current]
  );

  // ==========================================================
  // FETCH TRENDING PROPERTIES
  // ==========================================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchTrendingProperties() {
      try {
        const res = await fetch(TRENDING_API, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(
            `Trending properties request failed: ${res.status}`
          );
        }

        const result = await res.json();

        const records = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.properties)
              ? result.properties
              : [];

        const published = records.filter(
          (property) =>
            property?.slug &&
            property?.coreDetails?.title &&
            property?.status === "published" &&
            property?.isDeleted !== true &&
            property?.isActive !== false &&
            (Array.isArray(property?.propertyTag)
              ? property.propertyTag.includes("Trending")
              : property?.propertyTag === "Trending")
        );

        const shuffled = shuffleArray(published).slice(0, MAX_TRENDING);

        if (!controller.signal.aborted) {
          setTrendingProperties(shuffled);
          setFetchFailed(false);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load mobile trending properties:", error);

          if (!controller.signal.aborted) {
            setFetchFailed(true);
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchTrendingProperties();

    return () => controller.abort();
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[#101010] py-14 lg:hidden">

      {/* GOLD GLOW */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_top_left,_#c89d58,_transparent_30%),radial-gradient(circle_at_bottom_right,_#c89d58,_transparent_25%)]"
      />

      <div className="relative px-5">

        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
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
        >
          <p className="text-[10px] uppercase tracking-[2.5px] text-white/55 font-semibold">
            TRENDING INVESTMENTS
          </p>

          <h2
            className="mt-4 text-[34px] leading-[1.1] text-white"
            style={{
              fontFamily: "Georgia, Times New Roman, serif",
            }}
          >
            High Demand.
            <br />
            Strong Momentum.
          </h2>

          <Link
            href="/properties"
            prefetch={false}
            className="inline-flex items-center gap-2 mt-7 text-[#d6a454] text-[12px] tracking-[1.5px] font-semibold"
          >
            VIEW ALL INVESTMENTS
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* CAROUSEL */}
        <div
          ref={emblaRef}
          className="overflow-hidden mt-10"
        >
          <div className="flex">

            {/* LOADING */}
            {loading && (
              <div className="flex-[0_0_100%] text-center py-20 text-white/70">
                Loading trending investments...
              </div>
            )}

            {/* EMPTY STATE */}
            {!loading && trendingProperties.length === 0 && (
              <div className="flex-[0_0_100%] text-center py-20 text-white/70">
                {fetchFailed
                  ? "Trending investments are temporarily unavailable."
                  : "No trending investments found."}
              </div>
            )}

            {/* PROPERTY CARDS */}
            {!loading &&
              trendingProperties.map((item, index) => {
                const configuration = item?.unitConfigurations?.[0];
                const title = item?.coreDetails?.title || "Trending Property";

                return (
                  <div
                    key={item._id || item.slug}
                    className="min-w-0 flex-[0_0_88%] mr-4"
                  >
                    <Link
                      href={`/${item.slug}`}
                      prefetch={false}
                      aria-label={`Explore ${title}`}
                      className="group block"
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
                          duration: 0.6,
                          delay: Math.min(index * 0.08, 0.24),
                        }}
                        viewport={{
                          once: true,
                        }}
                        whileHover={{
                          y: -6,
                        }}
                        className="bg-white rounded-[26px] overflow-hidden border border-[#ebe5da] shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
                      >

                        {/* IMAGE */}
                        <div className="relative h-[240px] overflow-hidden bg-[#eee9df]">
                          <TrendingMobileImage
                            src={item?.media?.heroImageUrl}
                            alt={title}
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                          {/* TRENDING BADGE */}
                          <div className="absolute top-4 left-4 bg-[#c89948] text-white text-[10px] tracking-[1.5px] px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                            <Star size={10} fill="currentColor" />
                            TRENDING
                          </div>
                        </div>

                        <div className="h-[2px] bg-gradient-to-r from-[#c9a64b] via-[#e3c97d] to-[#c9a64b]" />

                        {/* CONTENT */}
                        <div className="p-5">

                          <h3
                            className="text-[24px] leading-tight text-[#171717] line-clamp-2"
                            style={{
                              fontFamily: "Georgia, Times New Roman, serif",
                            }}
                          >
                            {title}
                          </h3>

                          {/* LOCATION */}
                          <div className="flex gap-2 mt-3">
                            <MapPin
                              size={16}
                              className="shrink-0 mt-[2px] text-[#c89948]"
                            />

                            <span className="text-[13px] text-black/60 leading-6 line-clamp-2">
                              {getLocationName(item)}
                            </span>
                          </div>

                          {/* TRENDING LABEL */}
                          <div className="flex items-center gap-2 mt-4 text-[#bf8b37]">
                            <Star
                              size={13}
                              fill="currentColor"
                            />

                            <span className="text-[12px] font-medium">
                              Trending Investment Opportunity
                            </span>
                          </div>

                          {/* DETAILS */}
                          <div className="flex items-center justify-between mt-6 text-black/65 gap-2">
                            <span className="text-[13px]">
                              {configuration?.bedrooms
                                ? `${configuration.bedrooms} Beds`
                                : "Luxury"}
                            </span>

                            <span className="text-[13px]">
                              {configuration?.bathrooms
                                ? `${configuration.bathrooms} Baths`
                                : "Residence"}
                            </span>

                            <span className="text-[13px]">
                              {configuration?.area
                                ? `${configuration.area} Sq.Ft.`
                                : "Premium"}
                            </span>
                          </div>

                          {/* PRICE */}
                          <div className="border-t border-[#ece7df] mt-5 pt-5">
                            <p className="text-[11px] uppercase tracking-[1.2px] text-black/45 mb-2">
                              {item?.coreDetails?.priceOnRequest
                                ? "Price"
                                : "Starting Price"}
                            </p>

                            <h4 className="text-[30px] font-bold text-[#111] leading-none">
                              {getPrice(item)}
                            </h4>
                          </div>

                          {/* CTA */}
                          <div className="mt-6 pt-5 border-t border-[#ece7df] flex items-center justify-between">
                            <span className="text-[12px] tracking-[1.6px] uppercase font-semibold text-[#bf8b37]">
                              Explore Investment
                            </span>

                            <div className="w-10 h-10 rounded-full bg-[#bf8b37] text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                              <ArrowRight size={18} />
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    </Link>
                  </div>
                );
              })}

          </div>
        </div>
      </div>
    </section>
  );
}
