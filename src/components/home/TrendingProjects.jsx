
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { formatPrice } from "@/utils/formatPrice";

import {
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";

const TRENDING_API = "/api/properties?propertyTag=Trending";
const AUTOPLAY_DELAY = 3500;
const MAX_TRENDING = 12;

// ============================================================
// CLOUDINARY IMAGE OPTIMIZATION
// ============================================================

function optimizeCloudinaryImage(url, width = 800) {
  if (!url || typeof url !== "string") return "";

  // Only transform Cloudinary images.
  if (!url.includes("res.cloudinary.com")) return url;

  // Keep already optimized Cloudinary URLs unchanged.
  const uploadIndex = url.indexOf("/image/upload/");

  if (uploadIndex === -1) return url;

  const beforeUpload = url.slice(0, uploadIndex + 14);
  const afterUpload = url.slice(uploadIndex + 14);

  // Avoid adding duplicate transformations.
  if (
    /(^|\/)(f_auto|q_auto|w_\d+|c_limit)(,|\/)/.test(afterUpload)
  ) {
    return url;
  }

  return `${beforeUpload}f_auto,q_auto:good,w_${width},c_limit/${afterUpload}`;
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

function TrendingPropertyImage({ src, alt }) {
  const [imageFailed, setImageFailed] = useState(false);

  const optimizedSrc = useMemo(
    () => optimizeCloudinaryImage(src, 800),
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
      alt={alt}
      width="800"
      height="520"
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      onError={() => setImageFailed(true)}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
    />
  );
}

// ============================================================
// SKELETON
// ============================================================

function TrendingSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="min-w-0 flex-[0_0_100%] pl-2 md:flex-[0_0_50%] xl:flex-[0_0_33.3333%]"
    >
      <div className="h-full overflow-hidden rounded-[24px] border border-white/10 bg-white">
        <div className="h-[160px] animate-pulse bg-[#eae5dc]" />

        <div className="h-[2px] bg-[#d4af68]" />

        <div className="space-y-4 p-5">
          <div className="h-6 w-4/5 animate-pulse rounded bg-[#eeeae3]" />
          <div className="h-4 w-3/5 animate-pulse rounded bg-[#f0ede7]" />

          <div className="h-4 w-2/3 animate-pulse rounded bg-[#f0ede7]" />

          <div className="mt-5 border-t border-[#ece7df] pt-4">
            <div className="mb-3 h-3 w-1/3 animate-pulse rounded bg-[#f0ede7]" />
            <div className="h-7 w-1/2 animate-pulse rounded bg-[#eeeae3]" />
          </div>

          <div className="border-t border-[#ece7df] pt-4">
            <div className="h-4 w-2/5 animate-pulse rounded bg-[#f0ede7]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TRENDING PROPERTY CARD
// ============================================================

function TrendingPropertyCard({ item }) {
  const title = item?.coreDetails?.title || "Trending Property";
  const image = item?.media?.heroImageUrl;
  const configuration = item?.unitConfigurations?.[0];

  return (
    <Link
      href={`/${item.slug}`}
      prefetch={false}
      aria-label={`Explore ${title}`}
      className="block min-w-0 flex-[0_0_100%] pl-2 md:flex-[0_0_50%] xl:flex-[0_0_33.3333%]"
    >
      <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#ebe5da] bg-white shadow-[0_10px_32px_rgba(0,0,0,0.045)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)]">

        {/* IMAGE */}
        <div className="relative h-[160px] overflow-hidden bg-[#eee9df]">
          <TrendingPropertyImage src={image} alt={title} />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* TRENDING BADGE */}
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#c89948] px-4 py-2 text-[10px] font-semibold tracking-[1.5px] text-white">
            <Star size={10} fill="currentColor" />
            TRENDING
          </span>
        </div>

        {/* GOLD LINE */}
        <div className="h-[2px] bg-gradient-to-r from-[#c9a64b] via-[#e3c97d] to-[#c9a64b]" />

        {/* CONTENT */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 font-heading text-[22px] leading-tight text-[#171717] xl:text-[24px]">
            {title}
          </h3>

          {/* LOCATION */}
          <div className="mt-2 flex items-start gap-2 text-black/60">
            <MapPin size={15} className="mt-[2px] shrink-0" />

            <span className="line-clamp-2 text-[13px] leading-snug">
              {getLocationName(item)}
            </span>
          </div>

          {/* TRENDING LABEL */}
          <div className="mt-3 flex items-center gap-2 text-[#bf8b37]">
            <Star size={13} fill="currentColor" />

            <span className="text-[12px] font-medium">
              Trending Investment Opportunity
            </span>
          </div>

          {/* DETAILS */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-black/65">
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

          {/* DIVIDER */}
          <div className="mt-4 border-t border-[#ece7df]" />

          {/* PRICE */}
          <div className="mt-3">
            <p className="mb-2 text-[11px] uppercase tracking-[1px] text-black/45">
              {item?.coreDetails?.priceOnRequest ? "Price" : "Starting Price"}
            </p>

            <p className="text-[24px] font-bold leading-tight text-[#111]">
              {getPrice(item)}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-4 flex items-center justify-between border-t border-[#ece7df] pt-4">
            <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#bf8b37]">
              Explore Investment
            </span>

            <ArrowRight
              size={18}
              className="text-[#bf8b37] transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function TrendingProjects() {
  const [trendingProperties, setTrendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);

  // Keep autoplay stable between renders.
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: AUTOPLAY_DELAY,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
      }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
    },
    [autoplay]
  );

  const handlePrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const handleNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  // ==========================================================
  // FETCH TRENDING PROPERTIES
  // ==========================================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadTrendingProperties() {
      try {
        const response = await fetch(TRENDING_API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Trending properties request failed: ${response.status}`
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
          console.error("Failed to load trending properties:", error);

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

    loadTrendingProperties();

    return () => controller.abort();
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-[#071312] py-12 md:py-16"
      aria-labelledby="trending-projects-heading"
    >
      {/* LIGHTWEIGHT GOLD TEXTURE */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#c89d58,_transparent_30%),radial-gradient(circle_at_bottom_right,_#c89d58,_transparent_25%)] opacity-[0.07]"
      />

      <div className="relative mx-auto max-w-[1450px] px-5 xl:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr] xl:gap-10">

          {/* LEFT */}
          <div className="pt-2 lg:pt-4">
            <p className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[2.5px] text-white/55">
              Trending Investments
            </p>

            <h2
              id="trending-projects-heading"
              className="font-heading text-[36px] leading-[1.12] text-white md:text-[42px]"
            >
              High Demand.
              <br />
              Strong Momentum.
            </h2>

            <Link
              href="/properties"
              prefetch={false}
              className="group mt-8 inline-flex items-center gap-3 font-body text-[13px] font-semibold tracking-[1px] text-[#d6a454]"
            >
              VIEW ALL INVESTMENTS

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* RIGHT */}
          <div className="min-w-0">

            {/* ARROWS */}
            <div className="mb-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous trending investments"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-[#c89948] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c89948] md:h-11 md:w-11"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next trending investments"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-[#c89948] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c89948] md:h-11 md:w-11"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* CAROUSEL */}
            <div
              className="min-w-0 max-w-[900px] overflow-hidden"
              ref={emblaRef}
            >
              <div className="-ml-2 flex">
                {loading &&
                  Array.from({ length: 3 }, (_, index) => (
                    <TrendingSkeleton key={`skeleton-${index}`} />
                  ))}

                {!loading &&
                  trendingProperties.map((item) => (
                    <TrendingPropertyCard
                      key={item._id || item.slug}
                      item={item}
                    />
                  ))}

                {!loading && trendingProperties.length === 0 && (
                  <div className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-10 text-center">
                    <p className="text-sm text-white/70">
                      {fetchFailed
                        ? "Trending investments are temporarily unavailable."
                        : "New trending investments will appear here soon."}
                    </p>

                    <Link
                      href="/properties"
                      prefetch={false}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#d6a454]"
                    >
                      Explore all properties <ArrowRight size={15} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
