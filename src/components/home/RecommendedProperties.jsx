"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Container from "@/components/layout/Container";
import { formatPrice } from "@/utils/formatPrice";

import {
  ArrowRight,
  BedDouble,
  Bath,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const RECOMMENDED_API = "/api/properties?propertyTag=Recommended";
const AUTOPLAY_DELAY = 4500;
const MAX_RECOMMENDED = 12;

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
// LOADING SKELETON
// ============================================================

function RecommendedSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="min-w-0 flex-[0_0_100%] pl-2 md:flex-[0_0_50%] xl:flex-[0_0_33.3333%]"
    >
      <div className="h-full overflow-hidden rounded-[24px] border border-[#ebe5da] bg-white">
        <div className="h-[180px] animate-pulse bg-[#eae5dc]" />

        <div className="h-[2px] bg-[#d4af68]" />

        <div className="space-y-4 p-5">
          <div className="h-6 w-4/5 animate-pulse rounded bg-[#eeeae3]" />
          <div className="h-4 w-3/5 animate-pulse rounded bg-[#f0ede7]" />

          <div className="flex gap-3">
            <div className="h-4 w-16 animate-pulse rounded bg-[#f0ede7]" />
            <div className="h-4 w-16 animate-pulse rounded bg-[#f0ede7]" />
          </div>

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

function RecommendedPropertyCard({ item, index }) {
  const title = item?.coreDetails?.title || "Recommended Property";
  const image = item?.media?.heroImageUrl;

  const configuration = item?.unitConfigurations?.[0];

  return (
    <Link
      href={`/${item.slug}`}
      aria-label={`Explore ${title}`}
      className="block min-w-0 flex-[0_0_100%] pl-2 md:flex-[0_0_50%] xl:flex-[0_0_33.3333%]"
    >
      <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#ebe5da] bg-white shadow-[0_10px_32px_rgba(0,0,0,0.045)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.10)]">
        {/* IMAGE */}
        <div className="relative h-[180px] overflow-hidden bg-[#eee9df]">
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
            RECOMMENDED
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

          {/* PROPERTY DETAILS */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-black/65">
            <div className="flex items-center gap-2">
              <BedDouble size={15} />
              <span className="text-[13px]">
                {configuration?.bedrooms
                  ? `${configuration.bedrooms} Beds`
                  : "Luxury"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Bath size={15} />
              <span className="text-[13px]">
                {configuration?.bathrooms
                  ? `${configuration.bathrooms} Baths`
                  : "Residence"}
              </span>
            </div>

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
              Explore Residence
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

export default function RecommendedProjects() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);

  // Create the autoplay plugin only once.
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

  // ==========================================================
  // FETCH RECOMMENDED PROPERTIES
  // ==========================================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadRecommended() {
      try {
        const response = await fetch(RECOMMENDED_API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Recommended properties request failed: ${response.status}`
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
              ? property.propertyTag.includes("Recommended")
              : property?.propertyTag === "Recommended")
        );

        // Randomize once when the data arrives.
        const shuffled = shuffleArray(published).slice(
          0,
          MAX_RECOMMENDED
        );

        if (!controller.signal.aborted) {
          setProperties(shuffled);
          setFetchFailed(false);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load recommended properties:", error);

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

    loadRecommended();

    return () => controller.abort();
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-[#faf7f2] py-14 md:py-20 lg:py-24"
      aria-labelledby="recommended-projects-heading"
    >
      {/* LIGHTWEIGHT BACKGROUND TEXTURE */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#c89d58,_transparent_30%),radial-gradient(circle_at_bottom_left,_#c89d58,_transparent_25%)] opacity-[0.04]"
      />

      <Container className="relative">
        {/* HEADER */}
        <div className="mb-10 text-center md:mb-14 lg:mb-16">
          <div className="mb-5 inline-flex items-center gap-2">
            <div className="h-px w-12 bg-[#c89d58]" />
            <Sparkles size={14} className="text-[#c89d58]" />
            <div className="h-px w-12 bg-[#c89d58]" />
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[3px] text-black/55">
            Curated Recommendations
          </p>

          <h2
            id="recommended-projects-heading"
            className="mt-5 font-heading text-[36px] leading-[1.08] text-[#161616] md:text-[46px] lg:text-[58px]"
          >
            Handpicked For
            <br />
            Discerning Buyers
          </h2>

          <p className="mx-auto mt-5 max-w-[650px] text-[14px] leading-relaxed text-black/55 md:mt-6 md:text-[15px]">
            A curated collection of residences selected for
            their exceptional location, design excellence,
            future value, and lifestyle appeal.
          </p>
        </div>

        {/* CAROUSEL CONTROLS */}
        <div className="mb-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous recommended properties"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-[#c89948] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c89948] md:h-11 md:w-11"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next recommended properties"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-[#c89948] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c89948] md:h-11 md:w-11"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* CAROUSEL */}
        <div className="mx-auto max-w-[1100px] overflow-hidden" ref={emblaRef}>
          <div className="-ml-2 flex">
            {loading &&
              Array.from({ length: 3 }, (_, index) => (
                <RecommendedSkeleton key={`skeleton-${index}`} />
              ))}

            {!loading &&
              properties.map((item, index) => (
                <RecommendedPropertyCard
                  key={item._id || item.slug}
                  item={item}
                  index={index}
                />
              ))}

            {!loading && properties.length === 0 && (
              <div className="w-full rounded-2xl border border-[#e8e1d6] bg-white px-5 py-10 text-center">
                <p className="text-sm text-black/65">
                  {fetchFailed
                    ? "Recommended properties are temporarily unavailable."
                    : "New recommendations will appear here soon."}
                </p>

                <Link
                  href="/properties"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#bf8b37]"
                >
                  Explore all properties <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
