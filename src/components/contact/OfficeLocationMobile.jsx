"use client";

import {
  MapPin,
  ArrowUpRight,
} from "lucide-react";

export default function OfficeLocationMobile() {
  return (
    <section className="bg-[#F9F8F4] py-16">

      <div className="max-w-md mx-auto px-5">

        {/* Heading */}

        <p className="uppercase tracking-[3px] text-[11px] font-semibold text-[#C89B4F]">
          OUR OFFICE
        </p>

        <h2 className="mt-4 font-playfair text-[34px] leading-tight text-[#202020]">
          Visit Our
          <br />
          Experience Centre
        </h2>

        <div className="w-12 h-px bg-[#C89B4F] mt-5 mb-6" />

        <p className="text-[15px] leading-7 text-[#666]">
          Meet our advisors, discover luxury developments,
          explore investment opportunities and receive
          personalised guidance in a comfortable premium
          environment.
        </p>

        {/* Address Card */}

        <div
          className="
            mt-8
            rounded-2xl
            bg-white
            border
            border-[#ECE5D5]
            p-5
            shadow-[0_10px_30px_rgba(0,0,0,.05)]
          "
        >

          <div className="flex items-start gap-4">

            <div
              className="
                w-12
                h-12
                rounded-full
                bg-[#041E19]
                text-[#C89B4F]
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <MapPin size={18} />
            </div>

            <div>

              <p className="uppercase tracking-[2px] text-[11px] text-[#888]">
                Property Bouquet
              </p>

              <p className="mt-2 text-[14px] leading-7 text-[#222]">
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
              mt-6
              w-full
              h-12
              rounded-xl
              border
              border-[#C89B4F]
              text-[#222]
              font-medium
              text-[14px]
              flex
              items-center
              justify-center
              gap-2
              hover:bg-[#C89B4F]
              hover:text-white
              transition-all
            "
          >
            Get Directions

            <ArrowUpRight size={16} />
          </a>

        </div>

        {/* Google Map */}

        <div
          className="
            mt-8
            overflow-hidden
            rounded-2xl
            border
            border-[#ECE5D5]
            shadow-[0_10px_30px_rgba(0,0,0,.06)]
          "
        >

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3509.340948908157!2d77.06799217408417!3d28.408967294200494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d233e08b28137%3A0x7bd9c359469c52f7!2sProperty%20Bouquet!5e0!3m2!1sen!2sin!4v1785999730838!5m2!1sen!2sin"
            width="100%"
            height="320"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />

        </div>

      </div>

    </section>
  );
}