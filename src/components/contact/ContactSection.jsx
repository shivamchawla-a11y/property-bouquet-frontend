"use client";

import {
  Phone,
  Mail,
  MapPin,
  Clock3,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function ContactSection() {
  return (
    <section className="bg-[#F8F5EF] py-24">

      <div className="max-w-[1450px] mx-auto px-10 lg:px-16">

        <div className="grid grid-cols-[360px_1fr] gap-16 items-start">

          {/* LEFT */}

          <div>

            <p className="uppercase tracking-[4px] text-[11px] font-semibold text-[#C89B4F]">
              Get In Touch
            </p>

            <h2 className="mt-5 font-playfair text-[46px] leading-[1.15] text-[#222]">
              Let's Find the Right
              <br />
              Property for You
            </h2>

            <div className="w-14 h-[2px] bg-[#C89B4F] mt-7 mb-7" />

            <p className="text-[#666] text-[15px] leading-8 max-w-[340px]">
              Whether you're looking to invest, buy or explore premium
              opportunities, our team is ready to assist you.
            </p>

            <div className="mt-12 space-y-6">

              <InfoCard
                icon={<Phone size={18} />}
                title="Phone"
                value="+91 9090 106 101"
              />

              <InfoCard
                icon={<Mail size={18} />}
                title="Email"
                value="connect@propertybouquet.com"
              />

              <InfoCard
                icon={<MapPin size={18} />}
                title="Our Office"
                value="Suncity Success Tower, Golf Course Extension Road, Sector 65, Gurugram"
              />

              <InfoCard
                icon={<Clock3 size={18} />}
                title="Working Hours"
                value={
                  <>
                    Mon – Sat : 10:00 AM – 7:00 PM
                    <br />
                    Sunday : By Appointment Only
                  </>
                }
              />

            </div>

          </div>

          {/* RIGHT */}

          <div className="rounded-[24px] bg-[#041E19] border border-[#1A493D] p-10 shadow-[0_20px_60px_rgba(0,0,0,.15)]">

            <p className="uppercase tracking-[4px] text-[11px] font-semibold text-[#C89B4F]">
              Send Us A Message
            </p>

            <div className="w-12 h-[2px] bg-[#C89B4F] mt-5 mb-8" />

            <form className="space-y-5">

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="text"
                  placeholder="Full Name"
                  className="luxuryInput"
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="luxuryInput"
                />

              </div>

              <input
                type="email"
                placeholder="Email Address"
                className="luxuryInput"
              />

              <select className="luxuryInput">

                <option>I'm Interested In</option>

                <option>Buying Property</option>

                <option>Luxury Apartment</option>

                <option>Investment</option>

                <option>Commercial</option>

              </select>

              <textarea
                rows={5}
                placeholder="Your Message"
                className="luxuryInput resize-none"
              />

              <button
                className="
                  group
                  mt-2
                  h-[52px]
                  px-8
                  rounded-md
                  bg-[#D7AF67]
                  text-[#111]
                  font-semibold
                  text-[14px]
                  inline-flex
                  items-center
                  gap-4
                  hover:bg-[#E2BC79]
                  transition
                "
              >
                Send Message

                <ArrowRight
                  size={17}
                  className="group-hover:translate-x-1 transition"
                />

              </button>

              <div className="flex items-center gap-2 pt-2 text-white/55 text-[13px]">

                <Lock
                  size={15}
                  className="text-[#C89B4F]"
                />

                Your information is 100% safe and secure with us.

              </div>

            </form>

          </div>

        </div>

      </div>

    </section>
  );
}

function InfoCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="flex items-start gap-4">

      <div
        className="
          w-[50px]
          h-[50px]
          rounded-full
          bg-[#041E19]
          text-[#C89B4F]
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        {icon}
      </div>

      <div>

        <p className="text-[#888] text-[13px]">
          {title}
        </p>

        <div className="mt-1 text-[#222] text-[15px] leading-7">
          {value}
        </div>

      </div>

    </div>
  );
}