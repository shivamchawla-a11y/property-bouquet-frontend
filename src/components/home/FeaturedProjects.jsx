"use client";

import { motion } from "framer-motion";
import {
  Heart,
  MapPin,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const featuredProjects = [
  {
    id: 1,
    title: "Trump Towers",
    location: "Sector 65, Golf Course Ext Road",
    image: "/project1.webp",
  },
  {
    id: 2,
    title: "DLF The Camellias",
    location: "Golf Course Road, Gurgaon",
    image: "/project2.webp",
  },
  {
    id: 3,
    title: "M3M Capital",
    location: "Sector 113, Dwarka Expressway",
    image: "/project3.webp",
  },
  {
    id: 4,
    title: "Smartworld One DXP",
    location: "Sector 113, Gurgaon",
    image: "/project4.webp",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="bg-[#f7f7f7] py-20">

      <div className="max-w-[1450px] mx-auto px-4">

        {/* HEADING */}
        <div className="text-center mb-14">

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black"
          >
            <span className="text-red-600">
              Featured
            </span>{" "}
            <span className="text-secondary">
              Projects
            </span>
          </motion.h2>

          <div className="w-24 h-1 bg-red-500 rounded-full mx-auto mt-5" />

          <p className="text-gray-500 text-lg mt-6 max-w-3xl mx-auto leading-8">
            Explore handpicked luxury residences and investment
            opportunities from top developers across Gurgaon,
            Delhi NCR and Dubai.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-7">

          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
              }}
              className="group relative overflow-hidden rounded-[30px] bg-white shadow-[0_10px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-all duration-500"
            >

              {/* IMAGE */}
              <div className="relative h-[430px] overflow-hidden">

                {/* MAIN IMAGE */}
                <motion.img
                  src={project.image}
                  alt={project.title}
                  whileHover={{
                    scale: 1.12,
                    rotate: 1,
                  }}
                  transition={{
                    duration: 0.9,
                    ease: "easeOut",
                  }}
                  className="w-full h-full object-cover"
                />

                {/* PREMIUM OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95" />

                {/* LIGHT EFFECT */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-700" />

                {/* TOP BADGES */}
                <div className="absolute top-5 left-5 right-5 flex justify-between z-20">

                  <div className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-white/40">

                    <ShieldCheck
                      size={16}
                      className="text-emerald-600"
                    />

                    <span className="text-[11px] font-bold tracking-wide text-gray-800">
                      RERA APPROVED
                    </span>
                  </div>

                  <button className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-xl flex items-center justify-center shadow-lg hover:scale-110 hover:bg-white transition duration-300">

                    <Heart
                      size={18}
                      className="text-gray-700"
                    />
                  </button>
                </div>

                {/* FLOATING SHINE */}
                <div className="absolute inset-0 overflow-hidden">

                  <div className="absolute top-0 -left-[120%] w-[80%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 group-hover:left-[140%] transition-all duration-1000" />
                </div>

                {/* CONTENT */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">

                  <motion.h3
                    whileHover={{ x: 2 }}
                    className="text-[28px] font-bold mb-3 leading-tight"
                  >
                    {project.title}
                  </motion.h3>

                  <div className="flex items-center gap-2 text-white/85 mb-6">

                    <MapPin size={16} />

                    <span className="text-sm tracking-wide">
                      {project.location}
                    </span>
                  </div>

                  {/* BUTTON */}
                  <button className="w-full h-14 rounded-2xl bg-white text-secondary font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all duration-300 shadow-xl">

                    Explore Project

                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* VIEW ALL */}
        <div className="flex justify-center mt-14">

          <button className="group h-16 px-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-lg shadow-[0_15px_40px_rgba(239,68,68,0.35)] transition-all duration-300 flex items-center gap-3 hover:scale-105">

            View All Projects

            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition"
            />
          </button>
        </div>
      </div>
    </section>
  );
}