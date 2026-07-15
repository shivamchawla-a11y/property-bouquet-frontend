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

export default function FeaturedProjectsMobile() {
  const [featuredProperties, setFeaturedProperties] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const autoplay = useRef(
    Autoplay({
      delay: 3500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
    },
    [autoplay.current]
  );

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const res = await fetch(
          "/api/properties?propertyTag=Featured",
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

          setFeaturedProperties(published);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  return (
    <section className="bg-[#f6f3ee] py-14 overflow-hidden lg:hidden">

      <div className="px-5">

        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >

          <p className="text-[10px] uppercase tracking-[2.5px] text-black/55 font-semibold">

            FEATURED PROPERTIES

          </p>

          <h2
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
            className="
              inline-flex
              items-center
              gap-2
              mt-7
              text-[#bf8b37]
              text-[12px]
              tracking-[1.5px]
              font-semibold
            "
          >
            VIEW ALL

            <ArrowRight size={14} />

          </Link>

        </motion.div>

        {/* CAROUSEL */}

        <div
          ref={emblaRef}
          className="overflow-hidden mt-10"
        >

          <div className="flex">

                      {loading && (
            <div className="flex-[0_0_100%] text-center py-20 text-black/60">
              Loading featured properties...
            </div>
          )}

          {!loading &&
            featuredProperties.length === 0 && (
              <div className="flex-[0_0_100%] text-center py-20 text-black/60">
                No featured properties found.
              </div>
            )}

          {featuredProperties.map((item, index) => (
            <div
              key={item._id}
              className="
                flex-[0_0_88%]
                mr-4
              "
            >
              <Link
                href={`/${item.slug}`}
                className="block"
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
                    y: -6,
                  }}
                  className="
                    bg-white
                    rounded-[26px]
                    overflow-hidden
                    border
                    border-[#ebe5da]
                    shadow-[0_18px_50px_rgba(0,0,0,0.08)]
                  "
                >

                  {/* IMAGE */}

                  <div className="relative h-[240px]">

                    <img
                      src={item?.media?.heroImageUrl}
                      alt={item?.coreDetails?.title}
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

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

                  <div className="p-5">

                    <h3
                      className="
                        text-[24px]
                        leading-tight
                        text-[#171717]
                        line-clamp-2
                      "
                      style={{
                        fontFamily:
                          "Georgia, Times New Roman, serif",
                      }}
                    >
                      {item?.coreDetails?.title}
                    </h3>

                    <div className="flex gap-2 mt-3">

                      <MapPin
                        size={16}
                        className="shrink-0 mt-[2px] text-[#c89948]"
                      />

                      <span
                        className="
                          text-[13px]
                          text-black/60
                          leading-6
                          line-clamp-2
                        "
                      >
                        {(() => {
                          const location =
                            item?.locationData?.locationRef;

                          if (!location) {
                            return (
                              item?.locationData
                                ?.customLocation ||
                              item?.locationData
                                ?.locationName ||
                              "Prime Location"
                            );
                          }

                          const parts = [];

                          if (location.name)
                            parts.push(location.name);

                          if (location.parent?.name)
                            parts.push(
                              location.parent.name
                            );

                          if (
                            location.parent?.parent?.name
                          ) {
                            parts.push(
                              location.parent.parent
                                .name
                            );
                          }

                          return parts.join(", ");
                        })()}
                      </span>

                    </div>

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        mt-6
                        text-black/65
                      "
                    >

                      <div className="flex items-center gap-2">

                        <BedDouble size={16} />

                        <span className="text-[13px]">
                          {item?.unitConfigurations?.[0]
                            ?.bedrooms
                            ? `${item.unitConfigurations[0].bedrooms} Beds`
                            : "Luxury"}
                        </span>

                      </div>

                      <div className="flex items-center gap-2">

                        <Bath size={16} />

                        <span className="text-[13px]">
                          {item?.unitConfigurations?.[0]
                            ?.bathrooms
                            ? `${item.unitConfigurations[0].bathrooms} Baths`
                            : "Residence"}
                        </span>

                      </div>

                    </div>

                    <div className="border-t border-[#ece7df] mt-5 pt-5">

                                              <p
                        className="
                          text-[11px]
                          uppercase
                          tracking-[1.2px]
                          text-black/45
                          mb-2
                        "
                      >
                        Starting Price
                      </p>

                      <h4
                        className="
                          text-[30px]
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

                    <div
                      className="
                        mt-6
                        pt-5
                        border-t
                        border-[#ece7df]
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <span
                        className="
                          text-[12px]
                          tracking-[1.6px]
                          uppercase
                          font-semibold
                          text-[#bf8b37]
                        "
                      >
                        View Property
                      </span>

                      <div
                        className="
                          w-10
                          h-10
                          rounded-full
                          bg-[#bf8b37]
                          text-white
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <ArrowRight size={18} />
                      </div>

                    </div>

                  </div>

                </motion.div>

              </Link>

            </div>

          ))}

          </div>

        </div>

      </div>

    </section>

  );
}