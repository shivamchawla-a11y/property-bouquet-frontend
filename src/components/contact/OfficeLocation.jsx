"use client";

import {
  MapPin,
  ArrowUpRight,
} from "lucide-react";

export default function OfficeLocation() {
  return (
    <section className="bg-[#F8F5EF] py-24">

      <div className="max-w-[1360px] mx-auto px-10 lg:px-14">

        <div className="grid grid-cols-[380px_1fr] gap-16 items-center">

          {/* LEFT */}

          <div>

            <p className="uppercase tracking-[4px] text-[11px] font-semibold text-[#C89B4F]">
              OUR OFFICE
            </p>

            <h2 className="mt-5 font-playfair text-[46px] leading-[1.08] text-[#202020]">
              Visit Our
              <br />
              Experience Centre
            </h2>

            <div className="w-14 h-px bg-[#C89B4F] mt-7 mb-7" />

            <p className="text-[16px] leading-8 text-[#666]">
              Meet our advisors, discover luxury developments,
              explore investment opportunities and receive
              personalised guidance in a comfortable premium
              environment.
            </p>

            {/* ADDRESS */}

            <div className="mt-10 flex items-start gap-5">

              <div className="w-12 h-12 rounded-full bg-[#05221B] text-[#C89B4F] flex items-center justify-center shrink-0">

                <MapPin size={18} />

              </div>

              <div>

                <p className="text-[13px] uppercase tracking-[2px] text-[#777]">
                  Property Bouquet
                </p>

                <p className="mt-2 text-[15px] leading-7 text-[#202020]">
                  Suncity Success Tower
                  <br />
                  Golf Course Extension Road
                  <br />
                  Sector 65
                  <br />
                  Gurugram, Haryana 122101
                </p>

              </div>

            </div>

            <a
              href="https://maps.app.goo.gl/Nxrk8ecGVzH9qmLs9"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                gap-3
                mt-10
                h-[50px]
                px-7
                rounded-lg
                border
                border-[#C89B4F]
                text-[14px]
                font-medium
                text-[#222]
                transition-all
                duration-300
                hover:bg-[#C89B4F]
                hover:text-white
              "
            >
              Get Directions

              <ArrowUpRight size={17} />

            </a>

          </div>

          {/* RIGHT */}

          <div
            className="
              overflow-hidden
              rounded-[22px]
              border
              border-[#E8DEC8]
              shadow-[0_18px_60px_rgba(0,0,0,0.08)]
              bg-white
            "
          >

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3509.340948908157!2d77.06799217408417!3d28.408967294200494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d233e08b28137%3A0x7bd9c359469c52f7!2sProperty%20Bouquet!5e0!3m2!1sen!2sin!4v1785999730838!5m2!1sen!2sin"
              width="100%"
              height="470"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />

          </div>

        </div>

      </div>

    </section>
  );
}