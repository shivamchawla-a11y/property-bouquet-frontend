"use client";

import {
  CheckCircle2,
  MapPin,
} from "lucide-react";

export default function AboutAreaConverter() {
  return (
    <section className="bg-[#faf9f6]">

      <div className="mx-auto max-w-[1450px] px-5 pb-14 xl:px-8">

        <div
          className="
            relative
            overflow-hidden
            rounded-[10px]
            border
            border-[#eee7db]
            bg-[#f5f1e9]
            px-6
            py-7
            md:px-8
            md:py-8
          "
        >

          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr_220px]">

            {/* TEXT */}
            <div>

              <h2
                className="
                  font-serif
                  text-[23px]
                  text-[#17342b]
                  md:text-[26px]
                "
              >
                What is an Area Converter?
              </h2>

              <p className="mt-4 max-w-[570px] text-[11px] leading-6 text-gray-600 md:text-[12px]">
                An area converter helps you convert different
                units of measurement for land and property.
                It is an essential tool in real estate for
                buyers, sellers, investors, architects and
                builders to compare property sizes accurately
                across different units like Square Feet,
                Square Yards, Acres, Hectares, Gunthas and more.
              </p>

            </div>

            {/* BENEFITS */}
            <div className="space-y-3">

              {[
                "Useful for property comparison",
                "Helps in accurate pricing & valuation",
                "Essential for legal & documentation work",
                "Saves time and reduces calculation errors",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2
                    size={15}
                    className="shrink-0 text-[#123d31]"
                  />

                  <span className="text-[11px] text-gray-600">
                    {item}
                  </span>
                </div>
              ))}

            </div>

            {/* ILLUSTRATION */}
            <div className="hidden justify-end lg:flex">

              <div
                className="
                  relative
                  h-[130px]
                  w-[190px]
                  text-[#42675c]/45
                "
              >

                <div className="absolute bottom-5 left-3 h-[70px] w-[150px] rotate-[-10deg] border border-current" />

                <MapPin
                  size={52}
                  strokeWidth={1}
                  className="absolute left-[70px] top-1"
                />

                <div className="absolute bottom-0 left-12 h-7 w-px bg-current" />
                <div className="absolute bottom-0 left-20 h-10 w-px bg-current" />
                <div className="absolute bottom-0 left-32 h-6 w-px bg-current" />

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}