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

              <button className="w-11 h-11 rounded-full bg-white border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition">

                <ChevronLeft size={18} />
              </button>

              <button className="w-11 h-11 rounded-full bg-white border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition">

                <ChevronRight size={18} />
              </button>
            </div>

            {/* CARDS */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">

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

              {featuredProperties.map((item, index) => (
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
        y: -8,
      }}
      className="
group
bg-white
rounded-[22px]
overflow-hidden
border
border-[#e7e2d8]
shadow-[0_15px_45px_rgba(0,0,0,0.06)]
h-full
flex
flex-col
transition-all
duration-500
hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]
"
    >
      {/* IMAGE */}
      <div className="relative h-[260px] overflow-hidden">
        <img
          src={
            item?.media?.heroImageUrl ||
            "/placeholder-property.jpg"
          }
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

        {/* GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* BADGE */}
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
      <div className="p-6 flex flex-col flex-1">
        {/* TITLE */}
        <h3
          className="
            text-[24px]
xl:text-[28px]
            text-[#171717]
            font-heading
            leading-[1.15]
            h-[70px]
            overflow-hidden
          "
        >
          {item?.coreDetails?.title}
        </h3>

        {/* LOCATION */}
        <div className="flex items-center gap-2 text-black/60 mt-3">
          <MapPin size={15} />

          <span
  className="
  text-[14px]
  leading-relaxed
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
            gap-4
            mt-6
            text-black/65
            min-h-[28px]
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
        <div className="mt-6 border-t border-[#ece7df]" />

        {/* PRICE */}
        <div className="mt-5">
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
  text-[22px]
  xl:text-[26px]
  font-semibold
  text-[#111]
  font-body
"
>
  ₹{formatPrice(
    item?.coreDetails?.startingPrice ||
      item?.unitConfigurations?.[0]?.price ||
      0
  )}
</h4>
        </div>

        {/* CTA */}
        <div
  className="
  mt-auto
  pt-6
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
            className="text-[#bf8b37]"
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