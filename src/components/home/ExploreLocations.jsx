"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  ArrowRight,
  Building2,
} from "lucide-react";

const locations = [
  {
    id: 1,
    name: "Golf Course Road",
    city: "Gurgaon",
    image: "/location1.webp",
    projects: "120+ Projects",
  },

  {
    id: 2,
    name: "Dwarka Expressway",
    city: "Gurgaon",
    image: "/location2.webp",
    projects: "95+ Projects",
  },

  {
    id: 3,
    name: "Sohna Road",
    city: "Gurgaon",
    image: "/location3.webp",
    projects: "80+ Projects",
  },

  {
    id: 4,
    name: "New Gurgaon",
    city: "Gurgaon",
    image: "/location4.webp",
    projects: "70+ Projects",
  },

  {
    id: 5,
    name: "Palm Jumeirah",
    city: "Dubai",
    image: "/location5.webp",
    projects: "40+ Projects",
  },

  {
    id: 6,
    name: "Downtown Dubai",
    city: "Dubai",
    image: "/location6.webp",
    projects: "65+ Projects",
  },
];

export default function ExploreLocations() {
  return (
    <section className="bg-[#f7f7f7] py-24 overflow-hidden">

      <div className="max-w-[1450px] mx-auto px-4">

        {/* HEADING */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">

          <div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="uppercase tracking-[5px] text-red-500 font-semibold text-sm"
            >
              Prime Destinations
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-black text-secondary mt-3 leading-tight"
            >
              Explore <span className="text-red-600">Locations</span>
            </motion.h2>

            <p className="text-gray-500 text-lg mt-6 max-w-3xl leading-8">
              Discover the most sought-after luxury real estate
              destinations featuring iconic residences, investment
              hotspots and premium lifestyle communities.
            </p>
          </div>

          {/* BUTTON */}
          <button className="group hidden lg:flex items-center gap-3 h-16 px-8 rounded-full bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300">

            <span className="font-bold text-secondary">
              Explore All Locations
            </span>

            <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center group-hover:translate-x-1 transition">
              <ArrowRight size={18} />
            </div>
          </button>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
              }}
              className="group relative overflow-hidden rounded-[32px] h-[420px] cursor-pointer shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
            >

              {/* IMAGE */}
              <motion.img
                src={location.image}
                alt={location.name}
                whileHover={{
                  scale: 1.12,
                }}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                }}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* LIGHT EFFECT */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-700" />

              {/* FLOATING GLASS */}
              <div className="absolute top-5 left-5 z-20 bg-white/15 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 flex items-center gap-2">

                <Building2
                  size={16}
                  className="text-white"
                />

                <span className="text-white text-sm font-semibold">
                  {location.projects}
                </span>
              </div>

              {/* CONTENT */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-7">

                {/* CITY */}
                <div className="flex items-center gap-2 text-white/80 mb-3">

                  <MapPin size={16} />

                  <span className="text-sm tracking-wide uppercase">
                    {location.city}
                  </span>
                </div>

                {/* NAME */}
                <h3 className="text-3xl font-bold text-white leading-tight">
                  {location.name}
                </h3>

                {/* BUTTON */}
                <div className="mt-7 flex items-center justify-between">

                  <button className="text-white font-semibold tracking-wide">
                    Explore Area
                  </button>

                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all duration-300">

                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>

              {/* SHINE EFFECT */}
              <div className="absolute inset-0 overflow-hidden">

                <div className="absolute top-0 -left-[120%] w-[80%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 group-hover:left-[140%] transition-all duration-1000" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* MOBILE BUTTON */}
        <div className="flex justify-center mt-12 lg:hidden">

          <button className="group flex items-center gap-3 h-14 px-8 rounded-full bg-red-500 text-white font-bold shadow-xl">

            Explore All Locations

            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition"
            />
          </button>
        </div>
      </div>
    </section>
  );
}