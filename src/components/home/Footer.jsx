"use client";

import Link from "next/link";

import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  ArrowRight,
} from "lucide-react";

import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
} from "react-icons/fa";

const quickLinks = [
  "Home",
  "About Us",
  "Luxury Projects",
  "Branded Residences",
  "New Launches",
  "Contact Us",
];

const cities = [
  "Flats in Gurgaon",
  "Flats in Delhi",
  "Flats in Noida",
  "Flats in Dubai",
  "Flats in Mumbai",
  "Flats in Goa",
];

const locations = [
  "Golf Course Road",
  "Dwarka Expressway",
  "Sohna Road",
  "New Gurgaon",
  "SPR Road",
  "DLF City",
];

const services = [
  "EMI Calculator",
  "Property Consultation",
  "Investment Advisory",
  "Luxury Rentals",
  "NRI Services",
  "Commercial Spaces",
];

export default function Footer() {
  return (
    <footer className="bg-[#7d0c16] text-white overflow-hidden">

      {/* TOP SECTION */}
      <div className="relative">

        {/* GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#8d0f18] via-[#9d101c] to-[#8d0f18]" />

        <div className="relative max-w-[1450px] mx-auto px-4 py-20">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div>

              {/* LOGO */}
              <div className="flex items-center gap-4 mb-8">

                <img
                  src="/logo.png"
                  alt="logo"
                  className="w-14 h-14 object-contain"
                />

                <div>

                  <h2 className="text-3xl font-black">
                    Property Bouquet
                  </h2>

                  <p className="text-white/70 mt-1">
                    Luxury Real Estate Company
                  </p>
                </div>
              </div>

              {/* TEXT */}
              <p className="text-lg leading-9 text-white/90 max-w-2xl">
                Property Bouquet specializes in premium luxury
                residences, branded developments, and investment
                opportunities across Gurgaon, Dubai and Delhi NCR.
                Discover elite homes crafted for modern luxury
                living and long-term investment growth.
              </p>

              {/* CONTACT */}
              <div className="mt-10 space-y-5">

                {/* PHONE */}
                <div className="flex items-center gap-5">

                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">

                    <Phone size={22} />
                  </div>

                  <div>

                    <p className="text-white/60 text-sm">
                      Call Us
                    </p>

                    <h4 className="font-bold text-xl">
                      +91 9958-328-555
                    </h4>
                  </div>
                </div>

                {/* EMAIL */}
                <div className="flex items-center gap-5">

                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">

                    <Mail size={22} />
                  </div>

                  <div>

                    <p className="text-white/60 text-sm">
                      Email Address
                    </p>

                    <h4 className="font-bold text-xl">
                      support@propertybouquet.com
                    </h4>
                  </div>
                </div>

                {/* WHATSAPP */}
                <div className="flex items-center gap-5">

                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">

                    <MessageCircle size={22} />
                  </div>

                  <div>

                    <p className="text-white/60 text-sm">
                      WhatsApp
                    </p>

                    <h4 className="font-bold text-xl">
                      wa.me/propertybouquet
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="relative">

              {/* GLOW */}
              <div className="absolute inset-0 bg-white/5 blur-3xl rounded-[40px]" />

              <div className="relative bg-white/8 backdrop-blur-xl border border-white/10 rounded-[36px] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

                {/* HEADING */}
                <div className="text-center">

                  <h3 className="text-4xl font-black">
                    Get Instant Callback
                  </h3>

                  <p className="text-white/70 mt-3 text-lg">
                    Get expert advice on your luxury property
                    investment
                  </p>
                </div>

                {/* FORM */}
                <div className="mt-10 space-y-5">

                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full h-16 rounded-2xl bg-white/10 border border-white/10 px-6 text-white placeholder:text-white/50 outline-none focus:border-white/30"
                  />

                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full h-16 rounded-2xl bg-white/10 border border-white/10 px-6 text-white placeholder:text-white/50 outline-none focus:border-white/30"
                  />

                  <button className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#f2c48f] to-[#e5d0a5] text-[#5a0912] font-black text-lg hover:scale-[1.01] transition-all duration-300 shadow-2xl">

                    Contact Now
                  </button>
                </div>

                {/* BOTTOM */}
                <p className="text-center text-white/60 text-sm mt-6 leading-7">
                  Our luxury property consultants will contact
                  you within 30 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LINKS SECTION */}
      <div className="border-t border-white/10 bg-[#730913]">

        <div className="max-w-[1450px] mx-auto px-4 py-16">

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* COLUMN 1 */}
            <div>

              <h3 className="text-2xl font-bold mb-8">
                Quick Links
              </h3>

              <div className="space-y-4">

                {quickLinks.map((item) => (
                  <Link
                    key={item}
                    href="/"
                    className="group flex items-center gap-3 text-white/75 hover:text-white transition"
                  >

                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition"
                    />

                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* COLUMN 2 */}
            <div>

              <h3 className="text-2xl font-bold mb-8">
                Popular Cities
              </h3>

              <div className="space-y-4">

                {cities.map((item) => (
                  <Link
                    key={item}
                    href="/"
                    className="group flex items-center gap-3 text-white/75 hover:text-white transition"
                  >

                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition"
                    />

                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* COLUMN 3 */}
            <div>

              <h3 className="text-2xl font-bold mb-8">
                Prime Locations
              </h3>

              <div className="space-y-4">

                {locations.map((item) => (
                  <Link
                    key={item}
                    href="/"
                    className="group flex items-center gap-3 text-white/75 hover:text-white transition"
                  >

                    <MapPin size={16} />

                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* COLUMN 4 */}
            <div>

              <h3 className="text-2xl font-bold mb-8">
                Tools & Services
              </h3>

              <div className="space-y-4">

                {services.map((item) => (
                  <Link
                    key={item}
                    href="/"
                    className="group flex items-center gap-3 text-white/75 hover:text-white transition"
                  >

                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition"
                    />

                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10 bg-[#630710]">

        <div className="max-w-[1450px] mx-auto px-4 py-6">

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

            {/* LEFT */}
            <p className="text-white/60 text-sm text-center lg:text-left">
              © 2026 Property Bouquet. All Rights Reserved.
            </p>

            {/* CENTER */}
            <div className="flex items-center gap-2 text-white/60 text-sm">

              <MapPin size={15} />

              Gurgaon • Dubai • Delhi NCR
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

              <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-white hover:text-[#7d0c16] transition-all duration-300 flex items-center justify-center">

                <FaInstagram size={18} />
              </button>

              <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-white hover:text-[#7d0c16] transition-all duration-300 flex items-center justify-center">

                <FaFacebookF size={18} />
              </button>

              <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-white hover:text-[#7d0c16] transition-all duration-300 flex items-center justify-center">

                <FaLinkedinIn size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}