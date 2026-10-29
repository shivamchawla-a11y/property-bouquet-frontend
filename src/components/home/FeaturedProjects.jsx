"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  ArrowRight,
  BedDouble,
  Bath,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";

const FEATURED_API = "/api/properties/featured";
const AUTOPLAY_DELAY = 4500;
const MAX_FEATURED = 12;

// ============================================================
// HELPERS
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

function getBedroomLabel(item) {
  const value = item?.unitConfigurations?.[0]?.bedrooms;
  return value ? `${value} Beds` : "Luxury";
}

function getBathroomLabel(item) {
  const value = item?.unitConfigurations?.[0]?.bathrooms;
  return value ? `${value} Baths` : "Residence";
}

function getAreaLabel(item) {
  const value = item?.unitConfigurations?.[0]?.area;
  return value ? `${value} Sq.Ft.` : "Premium";
}

// ============================================================
// SKELETON
// ============================================================

function PropertySkeleton() {
  return (
    <div
      aria-hidden="true"
      className="min-w-0 flex-[0_0_100%] md:flex-[0_0_50%] xl:flex-[0_0_33.3333%] pl-2"
    >
      <div className="h-full overflow-hidden rounded-[24px] border border-[#ebe5da] bg-white">
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
// PROPERTY CARD
// ============================================================

function FeaturedPropertyCard({ item, index }) {
  const title = item?.coreDetails?.title || "Featured Property";
  const image = item?.media?.heroImageUrl;
  const configuration = item?.unitConfigurations?.[0];

  return (
    <Link
      href={item?.slug ? `/${item.slug}` : "/properties"}
      className="min-w-0 flex-[0_0_100%] pl-2 md:flex-[0_0_50%] xl:flex-[0_0_33.3333%] block"
      aria-label={`View ${title}`}
    >
      <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#ebe5da] bg-white shadow-[0_10px_32px_rgba(0,0,0,0.045)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.10)]">
        {/* IMAGE */}
        <div className="relative h-[160px] overflow-hidden bg-[#eee9df]">
          {image ? (
            <img
              src={image}
              alt={title}
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={index === 0 ? "high" : "auto"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-black/45">
              Property image coming soon
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <span className="absolute left-4 top-4 rounded-full bg-[#c89948] px-4 py-2 text-[10px] font-semibold tracking-[1.5px] text-white">
            FEATURED
          </span>
        </div>

        <div className="h-[2px] bg-gradient-to-r from-[#c9a64b] via-[#e3c97d] to-[#c9a64b]" />

        {/* CONTENT */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 font-heading text-[22px] leading-tight text-[#171717] xl:text-[24px]">
            {title}
          </h3>

          <div className="mt-2 flex items-start gap-2 text-black/60">
            <MapPin size={15} className="mt-[2px] shrink-0" />
            <span className="line-clamp-2 text-[13px] leading-snug">
              {getLocationName(item)}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-black/65">
            <div className="flex items-center gap-2">
              <BedDouble size={15} />
              <span className="text-[13px]">{getBedroomLabel(item)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Bath size={15} />
              <span className="text-[13px]">{getBathroomLabel(item)}</span>
            </div>

            <span className="text-[13px]">{getAreaLabel(item)}</span>
          </div>

          <div className="mt-4 border-t border-[#ece7df]" />

          <div className="mt-3">
            <p className="mb-2 text-[11px] uppercase tracking-[1px] text-black/45">
              {item?.coreDetails?.priceOnRequest ? "Price" : "Starting Price"}
            </p>

            <p className="text-[24px] font-bold leading-tight text-[#111]">
              {getPrice(item)}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#ece7df] pt-4">
            <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#bf8b37]">
              View Property
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

export default function FeaturedProjects() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);

  // Keep the autoplay plugin stable between renders.
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: AUTOPLAY_DELAY,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
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

  // Fetch once per component mount; allow normal browser caching.
  useEffect(() => {
    const controller = new AbortController();

    async function loadFeaturedProperties() {
      try {
        const response = await fetch(FEATURED_API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Featured properties request failed: ${response.status}`);
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
              (property?.propertyTag || []).includes("Featured")
          )
          .slice(0, MAX_FEATURED);

        if (!controller.signal.aborted) {
          setFeaturedProperties(published);
          setFetchFailed(false);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load featured properties:", error);

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

    loadFeaturedProperties();

    return () => controller.abort();
  }, []);

  return (
    <section
      className="overflow-hidden bg-[#f6f3ee] py-12 md:py-16"
      aria-labelledby="featured-projects-heading"
    >
      <div className="mx-auto max-w-[1450px] px-5 xl:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr] xl:gap-10">
          {/* LEFT */}
          <div className="pt-2 lg:pt-4">
            <p className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[2.5px] text-black/55">
              Featured Properties
            </p>

            <h2
              id="featured-projects-heading"
              className="font-heading text-[36px] leading-[1.12] text-[#151515] md:text-[42px]"
            >
              Exclusive Mandates.
              <br />
              Extraordinary Assets.
            </h2>

            <Link
              href="/properties"
              className="group mt-8 inline-flex items-center gap-3 font-body text-[13px] font-semibold tracking-[1px] text-[#bf8b37]"
            >
              VIEW ALL PROPERTIES
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* RIGHT */}
          <div className="min-w-0">
            <div className="mb-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous featured properties"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-[#c89948] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c89948] md:h-11 md:w-11"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next featured properties"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-[#c89948] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c89948] md:h-11 md:w-11"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="min-w-0 overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-2">
                {loading &&
                  Array.from({ length: 3 }, (_, index) => (
                    <PropertySkeleton key={`skeleton-${index}`} />
                  ))}

                {!loading &&
                  featuredProperties.map((item, index) => (
                    <FeaturedPropertyCard
                      key={item._id || item.slug}
                      item={item}
                      index={index}
                    />
                  ))}

                {!loading && featuredProperties.length === 0 && (
                  <div className="w-full rounded-2xl border border-[#e8e1d6] bg-white p-8 text-center">
                    <p className="text-sm text-black/65">
                      {fetchFailed
                        ? "Featured properties are temporarily unavailable."
                        : "New featured properties will appear here soon."}
                    </p>
                    <Link
                      href="/properties"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#bf8b37]"
                    >
                      Explore properties <ArrowRight size={15} />
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
