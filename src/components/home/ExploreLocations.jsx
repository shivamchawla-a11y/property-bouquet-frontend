"use client";

import { motion } from "framer-motion";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MapPin,
} from "lucide-react";

const locations = [
  {
    id: 1,
    name: "Golf Course Road",
    city: "Gurugram",
    appreciation: "24%",
    image: "/location1.webp",
  },

  {
    id: 2,
    name: "Bandra Kurla Complex",
    city: "Mumbai",
    appreciation: "22%",
    image: "/location2.webp",
  },

  {
    id: 3,
    name: "Nandi Hills",
    city: "Bengaluru",
    appreciation: "30%",
    image: "/location3.webp",
  },

  {
    id: 4,
    name: "Marine Drive",
    city: "Mumbai",
    appreciation: "20%",
    image: "/location4.webp",
  },

  {
    id: 5,
    name: "DLF Phase 5",
    city: "Gurugram",
    appreciation: "23%",
    image: "/location5.webp",
  },

  {
    id: 6,
    name: "Sahakar Nagar",
    city: "Pune",
    appreciation: "20%",
    image: "/location6.webp",
  },
];

export default function ExploreLocations() {
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

            <button className="group flex items-center gap-3 h-[52px] px-7 rounded-full bg-[#171717] text-white text-[13px] tracking-[1px] font-semibold shadow-[0_10px_35px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-all duration-300">

              VIEW ALL LOCATIONS

              <ArrowRight
                size={15}
                className="group-hover:translate-x-1 transition"
              />
            </button>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">

          {locations.map((location, index) => (
            <motion.div
              key={location.id}
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
                src={location.image}
                alt={location.name}
                whileHover={{
                  scale: 1.08,
                }}
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
                    HIGH GROWTH
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">

                {/* CITY */}
                <div className="flex items-center gap-2 text-white/75 mb-3">

                  <MapPin size={14} />

                  <span className="text-[12px] uppercase tracking-[1px] font-medium">
                    {location.city}
                  </span>
                </div>

                {/* NAME */}
                <h3 className="text-[24px] leading-[1.15] font-semibold text-white">
                  {location.name}
                </h3>

                {/* APPRECIATION */}
                <div className="mt-6 flex items-end justify-between">

                  <div>

                    <p className="text-[10px] uppercase tracking-[1.5px] text-white/60 mb-2">
                      Top Appreciation
                    </p>

                    <p className="text-[38px] leading-none font-semibold text-[#d7b26d]">
                      {location.appreciation}
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
          ))}
        </div>
      </div>
    </section>
  );
}