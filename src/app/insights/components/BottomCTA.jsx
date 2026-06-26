"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  "Luxury Market Reports",
  "Investment Guides",
  "Expert Property Analysis",
  "Luxury Lifestyle",
];

export default function BottomCTA() {
  return (
    <section className="bg-[#faf8f3] py-24">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          className="
            rounded-[32px]
            border
            border-[#ECE6DB]
            bg-white
            px-8
            py-14
            md:px-14
            md:py-16
            text-center
            shadow-[0_15px_45px_rgba(0,0,0,.04)]
          "
        >

          <span
            className="
              inline-block
              rounded-full
              border
              border-[#D8C19A]
              px-5
              py-2
              text-[11px]
              uppercase
              tracking-[2px]
              text-[#C89D58]
              font-semibold
            "
          >
            PROPERTY BOUQUET INSIGHTS
          </span>

          <h2
            className="
              mt-8
              text-4xl
              md:text-5xl
              leading-tight
              text-[#111]
            "
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            Stay Ahead in
            <br />
            Luxury Real Estate
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-[17px] leading-8 text-[#666]">
            Explore expert insights, investment intelligence,
            luxury lifestyle trends and curated property knowledge
            designed for modern buyers and investors.
          </p>

          {/* Features */}

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">

            {features.map((item) => (

              <div
                key={item}
                className="
                  rounded-2xl
                  border
                  border-[#ECE6DB]
                  bg-[#FCFBF8]
                  py-6
                  px-5
                  font-medium
                  text-[#111]
                "
              >
                ✓ {item}
              </div>

            ))}

          </div>

          <Link
            href="/insights"
            className="
              mt-12
              inline-flex
              items-center
              gap-3
              rounded-full
              bg-[#111]
              px-8
              py-4
              text-white
              transition-all
              hover:bg-[#C89D58]
            "
          >
            Explore All Insights

            <ArrowRight size={18} />

          </Link>

        </motion.div>

      </div>
    </section>
  );
}