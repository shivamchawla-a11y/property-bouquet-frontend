"use client";

import { motion } from "framer-motion";

import {
  ArrowRight,
  BedDouble,
  Bath,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const featuredProperties = [
  {
    id: 1,
    title: "The Crest Penthouse",
    location: "DLF Camellias, Gurgaon",
    image: "/project1.webp",
    beds: "6 Beds",
    baths: "6 Baths",
    sqft: "12,000 Sq.Ft.",
    price: "₹48.75 Cr++",
    appreciation: "28% - 34%",
  },

  {
    id: 2,
    title: "Aralias Estate",
    location: "Nandi Hills, Bengaluru",
    image: "/project2.webp",
    beds: "5 Beds",
    baths: "7 Baths",
    sqft: "9,500 Sq.Ft.",
    price: "₹32.40 Cr++",
    appreciation: "26% - 31%",
  },

  {
    id: 3,
    title: "Trump Residences",
    location: "Worli, Mumbai",
    image: "/project3.webp",
    beds: "4 Beds",
    baths: "5 Baths",
    sqft: "6,200 Sq.Ft.",
    price: "₹38.90 Cr++",
    appreciation: "24% - 30%",
  },
];

export default function FeaturedProjects() {
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
            <div className="grid md:grid-cols-3 gap-5">

              {featuredProperties.map((item, index) => (
                <motion.div
                  key={item.id}
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
                    y: -5,
                  }}
                  className="bg-white rounded-[18px] overflow-hidden border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
                >

                  {/* IMAGE */}
                  <div className="relative h-[220px] overflow-hidden">

                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition duration-700 hover:scale-105"
                    />

                    {/* BADGE */}
                    <div className="absolute top-4 left-4 bg-[#c89948] text-white text-[9px] tracking-[1px] px-3 py-2 rounded-full font-semibold font-body">
                      EXCLUSIVE MANDATE
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">

                    <h3 className="text-[24px] text-[#171717] font-heading leading-tight">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-2 text-black/55 mt-2 font-body">

                      <MapPin size={14} />

                      <span className="text-[13px]">
                        {item.location}
                      </span>
                    </div>

                    {/* DETAILS */}
                    <div className="flex flex-wrap gap-4 mt-5 text-black/60">

                      <div className="flex items-center gap-1.5">

                        <BedDouble size={15} />

                        <span className="text-[12px] font-body">
                          {item.beds}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">

                        <Bath size={15} />

                        <span className="text-[12px] font-body">
                          {item.baths}
                        </span>
                      </div>

                      <div className="text-[12px] font-body">
                        {item.sqft}
                      </div>
                    </div>

                    {/* BOTTOM */}
                    <div className="grid grid-cols-2 gap-5 mt-6 pt-5 border-t border-black/5">

                      <div>
                        <p className="text-[11px] text-black/45 font-body mb-1">
                          Starting Price
                        </p>

                        <h4 className="text-[24px] font-semibold text-[#111] font-body">
                          {item.price}
                        </h4>
                      </div>

                      <div>
                        <p className="text-[11px] text-black/45 font-body mb-1">
                          Est. Appreciation (5Y)
                        </p>

                        <h4 className="text-[24px] font-semibold text-[#111] font-body">
                          {item.appreciation}
                        </h4>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}