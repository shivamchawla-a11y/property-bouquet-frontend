"use client";

import { motion } from "framer-motion";

import {
  Heart,
  MapPin,
  ArrowRight,
  ShieldCheck,
  BedDouble,
  Bath,
} from "lucide-react";

const projects = [
  {
    id: 1,
    title: "DLF Privana",
    location: "Sector 77, Gurgaon",
    price: "₹ 6.2 Cr",
    image: "/project1.webp",
    beds: "4 BHK",
    baths: "4 Bath",
  },

  {
    id: 2,
    title: "Trump Towers",
    location: "Golf Course Ext Road",
    price: "₹ 8.5 Cr",
    image: "/project2.webp",
    beds: "5 BHK",
    baths: "5 Bath",
  },

  {
    id: 3,
    title: "Smartworld One",
    location: "Dwarka Expressway",
    price: "₹ 3.9 Cr",
    image: "/project3.webp",
    beds: "3 BHK",
    baths: "3 Bath",
  },

  {
    id: 4,
    title: "M3M Mansion",
    location: "Sector 113 Gurgaon",
    price: "₹ 5.7 Cr",
    image: "/project4.webp",
    beds: "4 BHK",
    baths: "4 Bath",
  },

  {
    id: 5,
    title: "Elan The Presidential",
    location: "Sector 106, Dwarka Expressway",
    price: "₹ 7.4 Cr",
    image: "/project5.webp",
    beds: "4 BHK",
    baths: "5 Bath",
  },

  {
    id: 6,
    title: "Godrej Aristocrat",
    location: "Sector 49, Gurgaon",
    price: "₹ 4.6 Cr",
    image: "/project6.webp",
    beds: "3 BHK",
    baths: "4 Bath",
  },

  {
    id: 7,
    title: "Sobha Altus",
    location: "Sector 106 Gurgaon",
    price: "₹ 6.9 Cr",
    image: "/project7.webp",
    beds: "4 BHK",
    baths: "5 Bath",
  },

  {
    id: 8,
    title: "DLF The Arbour",
    location: "Sector 63, Gurgaon",
    price: "₹ 8.1 Cr",
    image: "/project8.webp",
    beds: "4 BHK",
    baths: "5 Bath",
  },
];

export default function TrendingProjects() {
  return (
    <section className="py-24 bg-[#fafafa] overflow-hidden">

      <div className="max-w-[1450px] mx-auto px-4">

        {/* TOP */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">

          <div>

            {/* SUBTEXT */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="uppercase tracking-[5px] text-red-500 font-semibold text-sm"
            >
              Most Searched Residences
            </motion.p>

            {/* HEADING */}
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black leading-tight mt-3"
            >
              Trending Projects in{" "}
              <span className="text-red-600">
                Gurgaon
              </span>
            </motion.h2>

            {/* LINE */}
            <div className="w-28 h-[4px] bg-gradient-to-r from-red-500 to-red-300 rounded-full mt-6" />

            {/* DESCRIPTION */}
            <p className="text-gray-500 text-lg mt-6 max-w-2xl leading-relaxed">
              Discover premium luxury residences, iconic towers,
              and elite investment opportunities curated by
              Property Bouquet.
            </p>
          </div>

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="group h-14 px-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-3 transition-all duration-300 shadow-xl w-fit"
          >
            View All Projects

            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition"
            />
          </motion.button>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-7">

          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative bg-white rounded-[30px] overflow-hidden border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-500"
            >

              {/* IMAGE */}
              <div className="relative h-[360px] overflow-hidden">

                {/* IMAGE */}
                <motion.img
                  src={project.image}
                  alt={project.title}
                  whileHover={{ scale: 1.12 }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                  }}
                  className="w-full h-full object-cover"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                {/* LIGHT EFFECT */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]" />

                {/* TOP */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-20">

                  {/* RERA */}
                  <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">

                    <ShieldCheck
                      size={16}
                      className="text-emerald-600"
                    />

                    <span className="text-xs font-bold text-gray-800 tracking-wide">
                      VERIFIED
                    </span>
                  </div>

                  {/* HEART */}
                  <button className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-110 hover:bg-white transition-all duration-300">

                    <Heart
                      size={18}
                      className="text-gray-700"
                    />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">

                  {/* PRICE */}
                  <div className="inline-flex px-4 py-2 rounded-full bg-red-600 text-white text-sm font-bold shadow-lg mb-5">
                    Starting {project.price}
                  </div>

                  {/* TITLE */}
                  <h3 className="text-[28px] font-bold leading-tight">
                    {project.title}
                  </h3>

                  {/* LOCATION */}
                  <div className="flex items-center gap-2 mt-3 text-white/85">

                    <MapPin size={16} />

                    <span className="text-sm">
                      {project.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* BOTTOM */}
              <div className="p-6">

                {/* DETAILS */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-5 text-gray-600">

                  <div className="flex items-center gap-2 text-sm font-medium">

                    <BedDouble size={17} />

                    {project.beds}
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium">

                    <Bath size={17} />

                    {project.baths}
                  </div>
                </div>

                {/* BUTTON */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group mt-5 w-full h-14 rounded-2xl bg-secondary hover:bg-primary text-white font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg"
                >
                  Explore Property

                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition"
                  />
                </motion.button>
              </div>

              {/* PREMIUM BORDER EFFECT */}
              <div className="absolute inset-0 rounded-[30px] border border-white/20 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}