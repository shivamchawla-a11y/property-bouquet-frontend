"use client";

import { motion } from "framer-motion";

const partners = [
  "/logo1.png",
  "/logo2.jpg",
  "/logo3.png",
  "/logo4.png",
  "/logo5.png",
  "/logo6.png",
];

export default function PremiumPartners() {
  return (
    <section className="bg-[#f6f3ee] pb-20">

      <div className="max-w-[1440px] mx-auto px-5">

        {/* TOP BORDER */}
        <div className="border-t border-black/10 pt-12">

          <div className="grid lg:grid-cols-[220px_1fr] gap-10 items-center">

            {/* LEFT */}
            <div>

              <p className="text-[11px] tracking-[2.5px] uppercase text-black/45 font-semibold font-body mb-3">
                Platinum Partners
              </p>

              <h3 className="font-heading text-[34px] leading-[1.2] text-[#161616]">
                Trusted By
                <br />
                Industry Leaders.
              </h3>
            </div>

            {/* LOGOS */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">

              {partners.map((logo, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 25,
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
                    y: -4,
                  }}
                  className="group relative h-[110px] rounded-[22px] border border-black/6 bg-white/80 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
                >

                  {/* LIGHT EFFECT */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#c89d58]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                  {/* SHINE */}
                  <div className="absolute top-0 -left-[120%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent rotate-12 group-hover:left-[140%] transition-all duration-1000" />

                  {/* LOGO */}
                  <div className="relative z-10 h-full flex items-center justify-center px-6">

                    <img
                      src={logo}
                      alt="partner"
                      className="max-h-[42px] w-auto object-contain opacity-85 group-hover:opacity-100 transition-all duration-500"
                    />
                  </div>

                  {/* BORDER EFFECT */}
                  <div className="absolute inset-0 rounded-[22px] border border-white/40 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}