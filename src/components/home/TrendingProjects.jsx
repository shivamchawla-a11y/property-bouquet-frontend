"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";

import {
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";

export default function TrendingProjects() {
  const [trendingProperties, setTrendingProperties] =
    useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingProperties = async () => {
      try {
        const res = await fetch(
          "https://property-bouquet-backend.onrender.com/api/properties?propertyTag=Trending",
          {
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (data.success) {
          setTrendingProperties(data.data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProperties();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#071312] py-16">

      {/* GOLD TEXTURE */}
      <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_top_left,_#c89d58,_transparent_30%),radial-gradient(circle_at_bottom_right,_#c89d58,_transparent_25%)]" />

      <div className="relative max-w-[1450px] mx-auto px-5 xl:px-8">

        <div className="grid lg:grid-cols-[320px_1fr] gap-10 items-start">

          {/* LEFT */}
          <div className="pt-4">

            <p className="text-[11px] uppercase tracking-[2.5px] text-white/55 font-semibold font-body mb-6">
              TRENDING INVESTMENTS
            </p>

            <h2 className="font-heading text-[44px] leading-[1.12] text-white">
              High Demand.
              <br />
              Strong Momentum.
            </h2>

            <button className="mt-10 flex items-center gap-3 text-[#d6a454] text-[13px] tracking-[1px] font-semibold font-body group">
              VIEW ALL INVESTMENTS

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

              <button className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#c89948] transition">
                <ChevronLeft size={18} />
              </button>

              <button className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#c89948] transition">
                <ChevronRight size={18} />
              </button>

            </div>

            {/* LOADING */}
            {loading && (
              <p className="text-center text-white/70 py-12">
                Loading trending investments...
              </p>
            )}

            {/* EMPTY */}
            {!loading &&
              trendingProperties.length === 0 && (
                <p className="text-center text-white/70 py-12">
                  No trending investments found.
                </p>
              )}

            {/* CARDS */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {trendingProperties.map((item, index) => (
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
                      relative
                      rounded-[24px]
                      overflow-hidden
                      border
                      border-[#c89d58]/20
                      h-full
                    "
                  >

                    {/* IMAGE */}
                    <div className="relative h-[520px]">

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

                      {/* OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />

                      {/* BADGE */}
                      <div
                        className="
                          absolute
                          top-5
                          left-5
                          flex
                          items-center
                          gap-2
                          bg-[#c89948]
                          text-white
                          px-4
                          py-2
                          rounded-full
                          text-[11px]
                          font-semibold
                          tracking-[1px]
                        "
                      >
                        <Star
                          size={12}
                          fill="currentColor"
                        />
                        TRENDING
                      </div>

                      {/* CONTENT */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">

                        {/* TITLE */}
                        <h3
                          className="
                            text-[28px]
                            xl:text-[34px]
                            text-white
                            font-heading
                            leading-tight
                            
                          "
                        >
                          {item?.coreDetails?.title}
                        </h3>

                        {/* LOCATION */}
                        <div className="flex items-center gap-2 mt-3 text-white/70">

                          <MapPin size={14} />

                          <span className="text-[13px] line-clamp-2">
                            {item?.locationData
                              ?.locationName ||
                              item?.locationData
                                ?.customLocation ||
                              "Prime Location"}
                          </span>

                        </div>

                        {/* TRENDING TEXT */}
                        <div className="mt-5 flex items-center gap-2 text-[#f0bc63]">

                          <Star
                            size={15}
                            fill="currentColor"
                          />

                          <span className="text-[13px] font-medium">
                            Trending Investment Opportunity
                          </span>

                        </div>

                        {/* STATS */}
                        <div className="grid grid-cols-3 gap-4 mt-8 text-white">

                          <div>
                            <p className="text-[11px] text-white/45 uppercase tracking-[1px]">
                              Price
                            </p>

                            <h4 className="text-[18px] font-semibold mt-2">
                              ₹
                              {formatPrice(
                                item?.coreDetails
                                  ?.startingPrice ||
                                  item
                                    ?.unitConfigurations?.[0]
                                    ?.price ||
                                  0
                              )}
                            </h4>
                          </div>

                          

                        </div>

                        {/* CTA */}
                        <div
                          className="
                            mt-8
                            pt-5
                            border-t
                            border-white/10
                            flex
                            items-center
                            justify-between
                          "
                        >
                          <span
                            className="
                              text-[#d6a454]
                              text-[12px]
                              uppercase
                              tracking-[1.5px]
                              font-semibold
                            "
                          >
                            Explore Investment
                          </span>

                          <ArrowRight
                            size={18}
                            className="text-[#d6a454]"
                          />
                        </div>

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