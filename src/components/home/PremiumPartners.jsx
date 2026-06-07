"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PremiumPartners() {
const [developers, setDevelopers] = useState([]);

useEffect(() => {
const fetchDevelopers = async () => {
try {
const res = await fetch(
"https://property-bouquet-backend.onrender.com/api/developers"
);

    const data = await res.json();

    console.log("Developers API Response:", data);

    if (data.success) {
      setDevelopers(data.data || []);
    } else {
      setDevelopers([]);
    }
  } catch (err) {
    console.error(
      "Error fetching developers:",
      err
    );

    setDevelopers([]);
  }
};

fetchDevelopers();


}, []);

if (!developers.length) return null;

return ( <section className="py-24 bg-[#faf8f5] overflow-hidden"> <div className="max-w-[1600px] mx-auto px-5">


    {/* TOP BORDER */}
    <div className="border-t border-black/10 pt-14">

      <div className="grid lg:grid-cols-[260px_1fr] gap-14 items-center">

        {/* LEFT CONTENT */}
        <div>

          <p className="text-[11px] tracking-[2.5px] uppercase text-black/45 font-semibold mb-3">
            Platinum Partners
          </p>

          <h3 className="text-[34px] leading-[1.2] text-[#161616]">
            Trusted By
            <br />
            Industry Leaders.
          </h3>

        </div>

        {/* RIGHT MARQUEE */}
        <div className="overflow-hidden">

          {/* TOP ROW */}
          <motion.div
            className="flex gap-5 w-max mb-5"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...developers, ...developers].map(
              (developer, index) => (
                <Link
                  key={`top-${developer._id}-${index}`}
                  href={`/developers/${developer.slug}`}
                >
                  <div
                    className="
                      group
                      relative
                      w-[240px]
                      h-[120px]
                      rounded-[24px]
                      border
                      border-black/10
                      bg-white
                      overflow-hidden
                      shadow-[0_4px_25px_rgba(0,0,0,0.04)]
                      hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]
                      transition-all
                      duration-500
                      cursor-pointer
                    "
                  >
                    {/* LIGHT EFFECT */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#c89d58]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                    {/* SHINE */}
                    <div className="absolute top-0 -left-[120%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent rotate-12 group-hover:left-[140%] transition-all duration-1000" />

                    {/* LOGO */}
                    <div className="h-full w-full flex items-center justify-center p-2">

                      <img
                        src={developer.logo}
                        alt={developer.name}
                        className="
                          max-h-[90px]
                          max-w-[90%]
                          object-contain
                          transition-all
                          duration-500
                          group-hover:scale-105
                        "
                      />

                    </div>

                    {/* BORDER */}
                    <div className="absolute inset-0 rounded-[24px] border border-white/40 pointer-events-none" />
                  </div>
                </Link>
              )
            )}
          </motion.div>

          {/* BOTTOM ROW */}
          <motion.div
            className="flex gap-5 w-max"
            animate={{
              x: ["-50%", "0%"],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...developers, ...developers].map(
              (developer, index) => (
                <Link
                  key={`bottom-${developer._id}-${index}`}
                  href={`/developers/${developer.slug}`}
                >
                  <div
                    className="
                      group
                      relative
                      w-[240px]
                      h-[120px]
                      rounded-[24px]
                      border
                      border-black/10
                      bg-white
                      overflow-hidden
                      shadow-[0_4px_25px_rgba(0,0,0,0.04)]
                      hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]
                      transition-all
                      duration-500
                      cursor-pointer
                    "
                  >
                    {/* LIGHT EFFECT */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#c89d58]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                    {/* SHINE */}
                    <div className="absolute top-0 -left-[120%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent rotate-12 group-hover:left-[140%] transition-all duration-1000" />

                    {/* LOGO */}
                    <div className="h-full w-full flex items-center justify-center p-2">

                      <img
                        src={developer.logo}
                        alt={developer.name}
                        className="
                          max-h-[90px]
                          max-w-[90%]
                          object-contain
                          transition-all
                          duration-500
                          group-hover:scale-105
                        "
                      />

                    </div>

                    {/* BORDER */}
                    <div className="absolute inset-0 rounded-[24px] border border-white/40 pointer-events-none" />
                  </div>
                </Link>
              )
            )}
          </motion.div>

        </div>

      </div>

    </div>

  </div>
</section>

);
}
