"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";
import Container from "@/components/layout/Container";

import {
  ArrowRight,
  BedDouble,
  Bath,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function RecommendedProjects() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

const visibleCards = 3;

const handleNext = () => {
  if (properties.length <= visibleCards) return;

  setCurrentIndex((prev) =>
    prev >= properties.length - visibleCards ? 0 : prev + 1
  );
};

const handlePrev = () => {
  if (properties.length <= visibleCards) return;

  setCurrentIndex((prev) =>
    prev <= 0 ? properties.length - visibleCards : prev - 1
  );
};

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await fetch(
          "https://property-bouquet-backend.onrender.com/api/properties?propertyTag=Recommended",
          {
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (data.success) {
  const published = (data.data || []).filter(
    (property) =>
      property.status === "published" &&
      property.isDeleted === false &&
      property.isActive === true
  );

  setProperties(published);
}
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  return (
    <section className="relative py-24 bg-[#faf7f2] overflow-hidden">

      {/* TEXTURE */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_top_right,_#c89d58,_transparent_30%),radial-gradient(circle_at_bottom_left,_#c89d58,_transparent_25%)]" />

      <Container className="relative">

        {/* HEADER */}
        <div className="text-center mb-16">

          <div className="inline-flex items-center gap-2 mb-5">

            <div className="h-[1px] w-12 bg-[#c89d58]" />

            <Sparkles
              size={14}
              className="text-[#c89d58]"
            />

            <div className="h-[1px] w-12 bg-[#c89d58]" />

          </div>

          <p className="text-[11px] uppercase tracking-[3px] text-black/55 font-semibold">
            CURATED RECOMMENDATIONS
          </p>

          <h2 className="mt-5 font-heading text-[44px] lg:text-[58px] leading-none text-[#161616]">
            Handpicked For
            <br />
            Discerning Buyers
          </h2>

          <p className="mt-6 max-w-[650px] mx-auto text-[15px] text-black/55 leading-relaxed">
            A curated collection of residences selected for
            their exceptional location, design excellence,
            future value, and lifestyle appeal.
          </p>

        </div>

        {loading && (
          <p className="text-center py-10">
            Loading recommendations...
          </p>
        )}

        {!loading &&
          properties.length === 0 && (
            <p className="text-center py-10">
              No recommended properties found.
            </p>
          )}

          <div className="flex justify-end gap-3 mb-5">
  <button
    onClick={handlePrev}
    className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#c89948] transition"
  >
    <ChevronLeft size={18} />
  </button>

  <button
    onClick={handleNext}
    className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#c89948] transition"
  >
    <ChevronRight size={18} />
  </button>
</div>

        {/* CARDS */}
       <div className="max-w-[900px] mx-auto grid md:grid-cols-2 xl:grid-cols-3 gap-4">

          {properties
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
    delay: index * 0.08,
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
  <div className="relative h-[180px] overflow-hidden">

    <img
      src={
        item?.media?.heroImageUrl
      }
      alt={item?.coreDetails?.title}
      className="
w-full
h-full
object-cover
scale-110
transition-transform
duration-700
group-hover:scale-125
"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

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
      RECOMMENDED
    </div>

  </div>

  {/* GOLD LINE */}
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
  {(() => {
    const location = item?.locationData?.locationRef;

    if (!location) {
      return (
        item?.locationData?.customLocation ||
        item?.locationData?.locationName ||
        "Prime Location"
      );
    }

    const parts = [];

    // Child
    if (location.name) parts.push(location.name);

    // Parent
    if (location.parent?.name) parts.push(location.parent.name);

    // Grandparent
    if (location.parent?.parent?.name)
      parts.push(location.parent.parent.name);

    return parts.join(", ");
  })()}
</span>

    </div>

    {/* SPECS */}
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
        Explore Residence
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
      </Container>
    </section>
  );
}