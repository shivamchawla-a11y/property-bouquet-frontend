"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MapPin,
} from "lucide-react";



export default function ExploreLocations() {
  const API =
  "/api";

const [locations, setLocations] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchLocations();
}, []);

const fetchLocations = async () => {
  try {
    const res = await fetch(`${API}/locations/tree`);
    const data = await res.json();

    if (res.ok) {
      const roots = (data.data || []).filter(
        (item) => !item.parent
      );

      setLocations(roots);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

if (loading) {
  return (
    <section className="py-24 text-center">
      Loading locations...
    </section>
  );
}
  return (
    <section className="relative bg-[#f6f3ee] py-24 overflow-hidden border-t border-black/5">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#c89d58]/10 blur-[120px] rounded-full" />

      <div className="max-w-[1440px] mx-auto px-5 relative z-10">

        {/* TOP HEADING */}
        <div className="text-center mb-16">

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            viewport={{
              once: true,
            }}
            className="text-[11px] uppercase tracking-[3px] text-[#b88a3b] font-semibold mb-5"
          >
            EXPLORE BY LOCATION
          </motion.p>

          <motion.h2
            initial={{
              opacity: 0,
              y: 30,
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
            className="text-[38px] md:text-[54px] leading-[1.08] text-[#171717]"
            style={{
              fontFamily:
                "Georgia, Times New Roman, serif",
            }}
          >
            India’s Most Premium
            <br />

            <span className="text-[#b88a3b]">
              Investment Corridors
            </span>
          </motion.h2>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            viewport={{
              once: true,
            }}
            className="max-w-[760px] mx-auto mt-7 text-[15px] leading-[2] text-black/55"
          >
            Explore India’s highest-performing luxury
            micro-markets curated for appreciation,
            exclusivity, lifestyle and institutional-grade
            investment potential.
          </motion.p>

          {/* BUTTONS */}
          <div className="flex items-center justify-center gap-4 mt-10">

            <Link
  href="/properties"
  className="group flex items-center gap-3 h-[52px] px-7 rounded-full bg-[#171717] text-white text-[13px] tracking-[1px] font-semibold shadow-[0_10px_35px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-all duration-300"
>
  VIEW ALL LOCATIONS

  <ArrowRight
    size={15}
    className="group-hover:translate-x-1 transition"
  />
</Link>

            {/* ARROWS */}
            <div className="flex items-center gap-3">

              <button className="w-12 h-12 rounded-full border border-black/10 bg-white/80 backdrop-blur-xl shadow-lg flex items-center justify-center text-black/70 hover:bg-black hover:text-white transition-all duration-300">

                <ChevronLeft size={18} />
              </button>

              <button className="w-12 h-12 rounded-full border border-black/10 bg-white/80 backdrop-blur-xl shadow-lg flex items-center justify-center text-black/70 hover:bg-black hover:text-white transition-all duration-300">

                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {locations.map((location, index) => (
            <Link
  href={`/properties?location=${encodeURIComponent(location.name)}`}
  key={location._id}
>
            <motion.div
              key={location._id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              viewport={{
                once: true,
              }}
              whileHover={{
                y: -10,
              }}
              className="group relative h-[340px] rounded-[28px] overflow-hidden"
            >

              {/* GLASS OUTER */}
              <div className="absolute inset-0 rounded-[28px] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.08)]" />

              {/* IMAGE */}
              <motion.img
  src={
  location.image
    ? location.image.startsWith("http")
      ? location.image
      : `https://propertybouquet.com/api${location.image}`
    : "https://placehold.co/600x800/f3f4f6/999999?text=Location"
}
  alt={location.name}
  loading="lazy"
  onError={(e) => {
    e.currentTarget.src =
      "https://placehold.co/600x800/f3f4f6/999999?text=Location";
  }}
  whileHover={{ scale: 1.08 }}
  transition={{
    duration: 1,
    ease: "easeOut",
  }}
  className="absolute inset-0 w-full h-full object-cover"
/>

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />

              {/* SHINE EFFECT */}
              <div className="absolute inset-0 overflow-hidden">

                <div className="absolute top-0 -left-[120%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 group-hover:left-[140%] transition-all duration-1000" />
              </div>

              {/* TOP TAG */}
              <div className="absolute top-5 left-5 z-20">

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/15">

                  <TrendingUp
                    size={14}
                    className="text-[#d7b26d]"
                  />

                  <span className="text-[11px] tracking-[1px] font-semibold text-white">
                    PREMIUM LOCATION
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">

                {/* CITY */}
                <div className="flex items-center gap-2 text-white/75 mb-3">

                  <MapPin size={14} />

                    <h3 className="text-[24px] leading-[1.15] font-semibold text-white">
                  {location.name}
                </h3>
                  
                </div>

                {/* APPRECIATION */}
                <div className="mt-6 flex items-end justify-between">

                  <div>

                    <p className="text-[10px] uppercase tracking-[1.5px] text-white/60 mb-2">
                      Sub Locations
                    </p>

                    <p className="text-[38px] leading-none font-semibold text-[#d7b26d]">
                      {location.children?.length || 0}
                    </p>
                  </div>

                  {/* ARROW */}
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 flex items-center justify-center text-white group-hover:bg-[#c89d58] group-hover:text-black transition-all duration-300 shadow-lg">

                    <ArrowRight size={17} />
                  </div>
                </div>
              </div>

              {/* BORDER */}
              <div className="absolute inset-0 rounded-[28px] border border-white/10 pointer-events-none" />

              {/* GOLD GLOW */}
              <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-[120px] h-[120px] bg-[#c89d58]/20 blur-[60px] opacity-0 group-hover:opacity-100 transition duration-500" />
            </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}