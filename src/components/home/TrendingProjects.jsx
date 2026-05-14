"use client";

import { motion } from "framer-motion";

import {
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const trendingInvestments = [
  {
    id: 1,
    title: "Birla Arika",
    location: "Sector 31, Gurugram",
    image: "/project4.webp",
    demand: "18 Inquiries This Week",
    price: "₹10.25 Cr++",
    appreciation: "24%",
    yield: "3.8%",
  },

  {
    id: 2,
    title: "Godrej Riverine",
    location: "Sector 44, Noida",
    image: "/project5.webp",
    demand: "16 Inquiries This Week",
    price: "₹7.85 Cr++",
    appreciation: "27%",
    yield: "3.8%",
  },

  {
    id: 3,
    title: "Lodha Mahalaxmi",
    location: "Mahalaxmi, Mumbai",
    image: "/project6.webp",
    demand: "12 Inquiries This Week",
    price: "₹9.60 Cr++",
    appreciation: "27%",
    yield: "3.8%",
  },
];

export default function TrendingProjects() {
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

            {/* CARDS */}
            <div className="grid md:grid-cols-3 gap-5">

              {trendingInvestments.map((item, index) => (
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
                    y: -4,
                  }}
                  className="relative rounded-[20px] overflow-hidden border border-[#c89d58]/20 group"
                >

                  {/* IMAGE */}
                  <div className="relative h-[280px]">

                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10" />

                    {/* CONTENT */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">

                      <h3 className="text-[30px] text-white font-heading leading-tight">
                        {item.title}
                      </h3>

                      <p className="text-white/70 text-[13px] mt-2 font-body">
                        {item.location}
                      </p>

                      {/* DEMAND */}
                      <div className="mt-5 flex items-center gap-2 text-[#f0bc63]">

                        <Star
                          size={15}
                          fill="currentColor"
                        />

                        <span className="text-[13px] font-medium font-body">
                          High Demand: {item.demand}
                        </span>
                      </div>

                      {/* STATS */}
                      <div className="flex items-center justify-between mt-6 text-white">

                        <div>
                          <p className="text-[11px] text-white/45 font-body">
                            Price
                          </p>

                          <h4 className="text-[18px] font-semibold font-body mt-1">
                            {item.price}
                          </h4>
                        </div>

                        <div>
                          <p className="text-[11px] text-white/45 font-body">
                            Appreciation
                          </p>

                          <h4 className="text-[18px] font-semibold font-body mt-1">
                            {item.appreciation}
                          </h4>
                        </div>

                        <div>
                          <p className="text-[11px] text-white/45 font-body">
                            Yield
                          </p>

                          <h4 className="text-[18px] font-semibold font-body mt-1">
                            {item.yield}
                          </h4>
                        </div>
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