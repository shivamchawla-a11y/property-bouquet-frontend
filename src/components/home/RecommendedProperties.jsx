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
  Sparkles,
} from "lucide-react";

export default function RecommendedProjects() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setProperties(data.data || []);
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

      <div className="relative max-w-[1450px] mx-auto px-5 xl:px-8">

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

        {/* CARDS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-7">

          {properties.map((item, index) => (
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
                }}
                className="
group
relative
h-full
overflow-hidden
rounded-[28px]
bg-white
shadow-[0_20px_60px_rgba(0,0,0,0.06)]
border
border-[#ece5d8]
"
              >

                {/* IMAGE */}
                <div className="relative h-[340px] overflow-hidden">

                  <img
                    src={
                      item?.media?.heroImageUrl ||
                      "/placeholder-property.jpg"
                    }
                    alt={
                      item?.coreDetails?.title
                    }
                    className="
w-full
h-full
object-cover
duration-700
transition-transform
group-hover:scale-110
"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                  {/* BADGE */}
                  <div
                    className="
absolute
top-5
left-5
bg-white/90
backdrop-blur-md
rounded-full
px-4
py-2
text-[10px]
font-semibold
tracking-[1.5px]
text-[#171717]
"
                  >
                    RECOMMENDED
                  </div>

                  {/* PRICE FLOAT */}
                  <div
                    className="
absolute
bottom-5
left-5
right-5
bg-white/90
backdrop-blur-xl
rounded-2xl
px-5
py-4
"
                  >
                    <p className="text-[10px] uppercase tracking-[1px] text-black/45">
                      Starting Price
                    </p>

                    <h4 className="text-[24px] font-semibold text-[#111]">
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

                {/* CONTENT */}
                <div className="p-6 flex flex-col">

                  <h3
                    className="
font-heading
text-[28px]
leading-[1.1]
text-[#171717]
line-clamp-2
min-h-[62px]
"
                  >
                    {item?.coreDetails?.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-3 text-black/55">

                    <MapPin size={14} />

                    <span className="text-[13px] line-clamp-1">
                      {item?.locationData
                        ?.locationName ||
                        item?.locationData
                          ?.customLocation ||
                        "Prime Location"}
                    </span>

                  </div>

                  {/* SPECS */}
                  <div className="flex items-center gap-5 mt-6 text-black/65">

                    <div className="flex items-center gap-2">

                      <BedDouble size={15} />

                      <span className="text-[13px]">
                        {item
                          ?.unitConfigurations?.[0]
                          ?.bedrooms || "-"}
                        BHK
                      </span>

                    </div>

                    <div className="flex items-center gap-2">

                      <Bath size={15} />

                      <span className="text-[13px]">
                        {item
                          ?.unitConfigurations?.[0]
                          ?.bathrooms || "-"}
                      </span>

                    </div>

                  </div>

                  {/* GOLD LINE */}
                  <div className="mt-6 h-[1px] bg-gradient-to-r from-[#c89d58] via-[#f1d38d] to-transparent" />

                  {/* CTA */}
                  <div className="mt-6 flex items-center justify-between">

                    <span
                      className="
text-[12px]
uppercase
tracking-[1.5px]
font-semibold
text-[#c89d58]
"
                    >
                      Explore Residence
                    </span>

                    <ArrowRight
                      size={18}
                      className="
text-[#c89d58]
transition-transform
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
    </section>
  );
}