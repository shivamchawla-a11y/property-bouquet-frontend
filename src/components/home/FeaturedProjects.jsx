"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";

import {
  ArrowRight,
  BedDouble,
  Bath,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function FeaturedProjects() {
  const [featuredProperties, setFeaturedProperties] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

const visibleCards = 3;
  useEffect(() => {
  const fetchFeaturedProperties = async () => {
    try {
      const res = await fetch(
        "https://property-bouquet-backend.onrender.com/api/properties?propertyTag=Featured",
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (data.success) {
        setFeaturedProperties(data.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchFeaturedProperties();
}, []);

const handleNext = () => {
  if (featuredProperties.length <= visibleCards) return;

  setCurrentIndex((prev) =>
    prev + visibleCards >= featuredProperties.length
      ? 0
      : prev + visibleCards
  );
};

const handlePrev = () => {
  if (featuredProperties.length <= visibleCards) return;

  setCurrentIndex((prev) =>
    prev - visibleCards < 0
      ? Math.max(featuredProperties.length - visibleCards, 0)
      : prev - visibleCards
  );
};
  return (
    <section className="bg-[#f6f3ee] py-16 overflow-hidden">

      <div className="max-w-[1450px] mx-auto px-5 xl:px-8">

        <div className="grid lg:grid-cols-[320px_1fr] gap-10 items-start">

          {/* LEFT */}
          <div className="pt-4">

            <p className="text-[11px] uppercase tracking-[2.5px] text-black/55 font-semibold font-body mb-6">
              FEATURED PROPERTIES
            </p>

            <h2 className="font-heading text-[44px] leading-[1.12] text-[#151515]">
              Exclusive Mandates.
              <br />
              Extraordinary Assets.
            </h2>

            <button className="mt-10 flex items-center gap-3 text-[#bf8b37] text-[13px] tracking-[1px] font-semibold font-body group">
              VIEW ALL PROPERTIES

              <ArrowRight
                size={15}
                className="group-hover:translate-x-1 transition"
              />
            </button>
          </div>

          {/* RIGHT */}
          <div>

            {/* ARROWS */}
            <div className="flex justify-end gap-3 mb-5">

              <button
  onClick={handlePrev}
  className="
    w-11 h-11
    rounded-full
    bg-[#171717]
    text-white
    border border-[#2d2d2d]
    flex items-center justify-center
    transition-all duration-300
    hover:bg-[#c89948]
    hover:border-[#c89948]
    hover:scale-105
    active:scale-95
  "
>
  <ChevronLeft size={18} />
</button>

<button
  onClick={handleNext}
  className="
    w-11 h-11
    rounded-full
    bg-[#171717]
    text-white
    border border-[#2d2d2d]
    flex items-center justify-center
    transition-all duration-300
    hover:bg-[#c89948]
    hover:border-[#c89948]
    hover:scale-105
    active:scale-95
  "
>
  <ChevronRight size={18} />
</button>
            </div>

            {/* CARDS */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5 items-stretch">

  {loading && (
    <p className="col-span-3 text-center">
      Loading featured properties...
    </p>
  )}

  {!loading &&
    featuredProperties.length === 0 && (
      <p className="col-span-3 text-center">
        No featured properties found.
      </p>
    )}

              {featuredProperties
  .slice(currentIndex, currentIndex + visibleCards)
  .map((item, index) => (
  <Link
    key={item._id}
    href={`/${item.slug}`}
    className="block h-full"
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
        delay: index * 0.1,
      }}
      viewport={{
        once: true,
      }}
      whileHover={{
        y: -10,
        scale: 1.01,
      }}
      className="
        group
        bg-white
        rounded-[24px]
        overflow-hidden
        border
        border-[#ebe5da]
        shadow-[0_12px_40px_rgba(0,0,0,0.05)]
        flex
        flex-col
        h-full
        transition-all
        duration-500
        hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)]
      "
    >
      {/* IMAGE */}
      <div className="relative h-[220px] overflow-hidden">
        <img
          src={
            item?.media?.heroImageUrl }
          alt={item?.coreDetails?.title}
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div
          className="
            absolute
            top-4
            left-4
            bg-[#c89948]
            text-white
            text-[10px]
            tracking-[1.5px]
            px-4
            py-2
            rounded-full
            font-semibold
          "
        >
          FEATURED
        </div>
      </div>

      <div className="h-[2px] bg-gradient-to-r from-[#c9a64b] via-[#e3c97d] to-[#c9a64b]" />

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-1">

        {/* TITLE */}
        <h3
          className="
            text-[22px]
            xl:text-[24px]
            text-[#171717]
            font-heading
            leading-tight
            line-clamp-2
          "
        >
          {item?.coreDetails?.title}
        </h3>

        {/* LOCATION */}
        <div className="flex items-start gap-2 text-black/60 mt-2">
          <MapPin
            size={15}
            className="mt-[2px] shrink-0"
          />

          <span
            className="
              text-[13px]
              leading-snug
              line-clamp-2
            "
          >
            {item?.locationData?.locationName ||
              item?.locationData?.customLocation ||
              "Prime Location"}
          </span>
        </div>

        {/* DETAILS */}
        <div
          className="
            flex
            items-center
            flex-wrap
            gap-x-4
            gap-y-2
            mt-4
            text-black/65
          "
        >
          <div className="flex items-center gap-2">
            <BedDouble size={15} />

            <span className="text-[13px]">
              {item?.unitConfigurations?.[0]?.bedrooms
                ? `${item.unitConfigurations[0].bedrooms} Beds`
                : "Luxury"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Bath size={15} />

            <span className="text-[13px]">
              {item?.unitConfigurations?.[0]?.bathrooms
                ? `${item.unitConfigurations[0].bathrooms} Baths`
                : "Residence"}
            </span>
          </div>

          <div className="text-[13px]">
            {item?.unitConfigurations?.[0]?.area
              ? `${item.unitConfigurations[0].area} Sq.Ft.`
              : "Premium"}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-4 border-t border-[#ece7df]" />

        {/* PRICE */}
        <div className="mt-3">
          <p
            className="
              text-[11px]
              uppercase
              tracking-[1px]
              text-black/45
              mb-2
            "
          >
            Starting Price
          </p>

          <h4
            className="
              text-[24px]
              font-bold
              text-[#111]
              leading-none
            "
          >
            ₹
            {formatPrice(
              item?.coreDetails?.startingPrice ||
                item?.unitConfigurations?.[0]?.price ||
                0
            )}
          </h4>
        </div>

        {/* CTA */}
        <div
          className="
            mt-4
            pt-4
            flex
            items-center
            justify-between
            border-t
            border-[#ece7df]
          "
        >
          <span
            className="
              text-[12px]
              tracking-[1.5px]
              uppercase
              text-[#bf8b37]
              font-semibold
            "
          >
            View Property
          </span>

          <ArrowRight
            size={18}
            className="
              text-[#bf8b37]
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />
        </div>
      </div>
    </motion.div>
  </Link>
))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}