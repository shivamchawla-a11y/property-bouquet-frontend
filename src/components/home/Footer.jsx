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
    <footer className="relative overflow-hidden bg-[#f6f3ee] border-t border-black/10">

      {/* TOP SECTION */}
      <div className="relative overflow-hidden">

        {/* BACKGROUND GLOW */}
        <div className="absolute top-[-150px] left-[-120px] w-[420px] h-[420px] rounded-full bg-[#c89d58]/10 blur-[140px]" />

        <div className="absolute bottom-[-180px] right-[-120px] w-[420px] h-[420px] rounded-full bg-[#c89d58]/10 blur-[150px]" />

        <div className="max-w-[1450px] mx-auto px-5 py-20">

          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">

            {/* LEFT */}
            <div className="relative z-10">

              {/* TAG */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#c89d58]/20 bg-white/70 backdrop-blur-xl mb-8 shadow-sm">

                <div className="w-2 h-2 rounded-full bg-[#c89d58]" />

                <span className="text-[11px] tracking-[2px] uppercase text-[#9a6f2f] font-semibold">
                  Luxury Real Estate Advisory
                </span>
              </div>

              {/* LOGO */}
              <div className="flex items-center gap-5 mb-8">

                <div className="w-[74px] h-[74px] rounded-[24px] bg-gradient-to-br from-[#021f1b] via-[#032821] to-[#04150f] flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.18)] border border-[#c89d58]/10">

                  <img
                    src="/logo.png"
                    alt="logo"
                    className="w-[72px] h-[72px] object-contain"
                  />
                </div>

                <div>

                  <h2
                    className="text-[40px] leading-none text-[#171717]"
                    style={{
                      fontFamily:
                        "Georgia, Times New Roman, serif",
                    }}
                  >
                    Property Bouquet
                  </h2>

                  <p className="text-black/45 mt-2 text-[15px] tracking-wide">
                    Curating Luxury Investments Across India & Dubai
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}
              <p className="text-[16px] leading-[2] text-black/60 max-w-[720px]">
                Property Bouquet specializes in premium luxury
                residences, branded developments, and investment
                opportunities across Gurgaon, Dubai and Delhi NCR.
                Discover elite homes crafted for modern luxury
                living and long-term investment growth.
              </p>

              {/* CONTACT */}
              <div className="mt-12 grid sm:grid-cols-3 gap-5">

                {/* PHONE */}
                <div className="group rounded-[26px] border border-black/5 bg-white/70 backdrop-blur-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-500">

                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#02231d] to-[#04150f] text-[#d4ae67] flex items-center justify-center shadow-lg">

                    <Phone size={18} />
                  </div>

                  <p className="text-black/45 text-[12px] mt-5 uppercase tracking-[1.5px] font-semibold">
                    Call Us
                  </p>

                  <h4 className="text-[#171717] text-[18px] font-semibold mt-1">
                    +91 9958-328-555
                  </h4>
                </div>

                {/* EMAIL */}
                <div className="group rounded-[26px] border border-black/5 bg-white/70 backdrop-blur-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-500">

                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#02231d] to-[#04150f] text-[#d4ae67] flex items-center justify-center shadow-lg">

                    <Mail size={18} />
                  </div>

                  <p className="text-black/45 text-[12px] mt-5 uppercase tracking-[1.5px] font-semibold">
                    Email
                  </p>

                  <h4 className="text-[#171717] text-[16px] font-semibold mt-1 break-all">
                    support@propertybouquet.com
                  </h4>
                </div>

                {/* WHATSAPP */}
<div className="group rounded-[26px] border border-black/5 bg-white/70 backdrop-blur-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-500 overflow-hidden">

  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#02231d] to-[#04150f] text-[#d4ae67] flex items-center justify-center shadow-lg">

    <MessageCircle size={18} />
  </div>

  <p className="text-black/45 text-[12px] mt-5 uppercase tracking-[1.5px] font-semibold">
    WhatsApp
  </p>

  <h4 className="text-[#171717] text-[15px] font-semibold mt-1 break-all leading-[1.5]">
    wa.me/propertybouquet
  </h4>
</div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="relative">

              {/* OUTER GLOW */}
              <div className="absolute inset-0 bg-[#c89d58]/10 blur-[80px] rounded-[40px]" />

              {/* CARD */}
              <div className="relative overflow-hidden rounded-[38px] border border-black/5 bg-white/75 backdrop-blur-2xl p-8 md:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.08)]">

                {/* TOP LIGHT */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4ae67]/60 to-transparent" />

                {/* HEADER */}
                <div className="text-center">

                  <p className="text-[11px] tracking-[2px] uppercase text-[#b98b3c] font-semibold mb-4">
                    Private Consultation
                  </p>

                  <h3
                    className="text-[42px] leading-[1.08] text-[#171717]"
                    style={{
                      fontFamily:
                        "Georgia, Times New Roman, serif",
                    }}
                  >
                    Get Instant
                    <br />
                    Callback
                  </h3>

                  <p className="text-black/50 mt-5 text-[15px] leading-8 max-w-[420px] mx-auto">
                    Get expert advice on your luxury property
                    investment from our senior advisory team.
                  </p>
                </div>

                {/* FORM */}
                <div className="mt-10 space-y-5">

                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full h-[62px] rounded-2xl border border-black/8 bg-[#fbf9f5] px-6 text-[#171717] placeholder:text-black/35 outline-none focus:border-[#c89d58]/40 transition-all"
                  />

                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full h-[62px] rounded-2xl border border-black/8 bg-[#fbf9f5] px-6 text-[#171717] placeholder:text-black/35 outline-none focus:border-[#c89d58]/40 transition-all"
                  />

                  <button className="group relative overflow-hidden w-full h-[62px] rounded-2xl bg-gradient-to-r from-[#d8b36c] to-[#b88731] text-black font-semibold text-[15px] shadow-[0_15px_40px_rgba(212,174,103,0.35)] hover:scale-[1.01] transition-all duration-500">

                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />

                    <span className="relative flex items-center justify-center gap-2">

                      Contact Now

                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition"
                      />
                    </span>
                  </button>
                </div>

                {/* BOTTOM */}
                <p className="text-center text-black/40 text-[13px] mt-6 leading-7">
                  Our luxury property consultants will contact
                  you within 30 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PREMIUM FOOTER WRAPPER */}
<div className="relative overflow-hidden border-t border-[#E6C87A]/10">

  {/* BACKGROUND IMAGE */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
    style={{
      backgroundImage: "url('/bg-waves.png')",
    }}
  />

  {/* PREMIUM OVERLAY */}
  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(4,12,10,0.58),rgba(4,12,10,0.74))]" />

  {/* GOLDEN LIGHT EFFECT */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(230,200,122,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(201,162,77,0.18),transparent_32%)]" />

  {/* TOP GOLD GLOW */}
  <div className="absolute top-[-80px] left-[8%] w-[420px] h-[420px] rounded-full bg-[#E6C87A]/20 blur-[160px]" />

  {/* RIGHT GLOW */}
  <div className="absolute top-[20%] right-[5%] w-[380px] h-[380px] rounded-full bg-[#C9A24D]/15 blur-[150px]" />

  {/* BOTTOM GLOW */}
  <div className="absolute bottom-[-140px] left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-[#E6C87A]/14 blur-[180px]" />

  <div className="relative z-10">

    {/* LINKS SECTION */}
    <div className="max-w-[1450px] mx-auto px-5 py-20">

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-16">

        {/* COLUMN */}
        {[
          {
            title: "Quick Links",
            items: quickLinks,
            icon: "arrow",
          },
          {
            title: "Popular Cities",
            items: cities,
            icon: "arrow",
          },
          {
            title: "Prime Locations",
            items: locations,
            icon: "location",
          },
          {
            title: "Tools & Services",
            items: services,
            icon: "arrow",
          },
        ].map((section, index) => (
          <div key={index}>

            {/* HEADING */}
            <h3
              className="text-[32px] text-white mb-9 tracking-wide drop-shadow-[0_0_18px_rgba(230,200,122,0.18)]"
              style={{
                fontFamily:
                  "Georgia, Times New Roman, serif",
              }}
            >
              {section.title}
            </h3>

            {/* LINKS */}
            <div className="space-y-5">

              {section.items.map((item) => (
                <Link
                  key={item}
                  href="/"
                  className="group flex items-center gap-3 text-white/75 hover:text-[#F5D98B] transition-all duration-300"
                >

                  {section.icon === "arrow" ? (
                    <ArrowRight
                      size={15}
                      className="text-[#E6C87A]/80 group-hover:text-[#F5D98B] group-hover:translate-x-1 transition-all duration-300"
                    />
                  ) : (
                    <MapPin
                      size={15}
                      className="text-[#E6C87A]/80 group-hover:text-[#F5D98B] transition-all duration-300"
                    />
                  )}

                  <span className="text-[15px] tracking-[0.3px] group-hover:drop-shadow-[0_0_12px_rgba(230,200,122,0.35)] transition-all duration-300">
                    {item}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* BOTTOM BAR */}
    <div className="border-t border-[#E6C87A]/10 backdrop-blur-md bg-black/10">

      <div className="max-w-[1450px] mx-auto px-5 py-7">

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

          {/* LEFT */}
          <p className="text-white/55 text-[13px] text-center lg:text-left tracking-[0.4px]">
            © 2026 Property Bouquet. All Rights Reserved.
          </p>

          {/* CENTER */}
          <div className="flex items-center gap-2 text-white/60 text-[13px] tracking-[0.3px]">

            <MapPin
              size={14}
              className="text-[#E6C87A]"
            />

            Gurgaon • Dubai • Delhi NCR
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {[
              FaInstagram,
              FaFacebookF,
              FaLinkedinIn,
            ].map((Icon, index) => (
              <button
                key={index}
                className="group relative overflow-hidden w-12 h-12 rounded-full border border-[#E6C87A]/10 bg-white/[0.05] backdrop-blur-2xl hover:border-[#E6C87A]/40 transition-all duration-500 flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_0_35px_rgba(230,200,122,0.22)]"
              >

                {/* GOLDEN HOVER EFFECT */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-[#E6C87A]/30 via-transparent to-transparent" />

                <Icon
                  size={17}
                  className="relative z-10 text-white/70 group-hover:text-[#F5D98B] transition-all duration-300"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    </footer>
  );
}