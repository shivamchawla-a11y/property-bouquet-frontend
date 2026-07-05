"use client";

import Image from "next/image";
import Link from "next/link";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaGem,
  FaShieldAlt,
  FaUser,
  FaKey,
  FaBuilding,
  FaLock,
  FaArrowRight,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
} from "react-icons/fa";

const exploreLinks = [
  "Properties",
  "Locations",
  "Developers",
  "New Launches",
  "Luxury Homes",
  "Commercial",
  "Plots & Land",
  "Farmhouses",
];

const knowledgeLinks = [
  "Buying Guides",
  "Investment Guides",
  "Area Guides",
  "Legal & RERA",
  "Home Loans",
  "NRI Corner",
  "Tax & Finance",
  "Real Estate Dictionary",
];

const insightLinks = [
  "Market Updates",
  "Infrastructure News",
  "Investment Analysis",
  "Project Reviews",
  "Luxury Living",
  "Expert Opinions",
  "Research Reports",
  "Podcast & Videos",
];

const featureCards = [
  {
    icon: <FaGem />,
    title: "Curated",
    subtitle: "Properties",
  },
  {
    icon: <FaShieldAlt />,
    title: "Trusted",
    subtitle: "Advisory",
  },
  {
    icon: <FaUser />,
    title: "Client",
    subtitle: "First",
  },
  {
    icon: <FaKey />,
    title: "Expert",
    subtitle: "Guidance",
  },
  {
    icon: <FaBuilding />,
    title: "Market",
    subtitle: "Insights",
  },
  {
    icon: <FaLock />,
    title: "Secure",
    subtitle: "& Transparent",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#07140F] text-white border-t border-[#8e6b2e]/40">

      <div className="max-w-[1500px] mx-auto px-8 lg:px-14 py-20">

        
{/* ================= TOP ================= */}

<div className="grid lg:grid-cols-[1.8fr_1fr_1fr_1fr] gap-12">

  {/* LEFT */}
  <div className="pr-10 border-r border-[#8e6b2e]/40">

    {/* LOGO (SMALLER FIX) */}
    <div className="h-[34px] w-[140px] flex items-center">

<Image
  src="/logowhole.webp"
  alt="Property Bouquet"
  width={140}
  height={34}
  priority
  className="max-h-full max-w-full object-contain"
  style={{
    transformOrigin: "left center",
  }}
/>
    </div>

    <p className="mt-8 text-[13px] leading-[1.85] text-white/75 max-w-[520px]">
      Property Bouquet is a luxury real estate platform offering curated properties,
      expert insights & intelligent tools to help you make confident decisions.
    </p>

    {/* SOCIAL */}
    <div className="flex gap-6 mt-14">

      {[
        <FaFacebookF />,
        <FaInstagram />,
        <FaLinkedinIn />,
        <FaYoutube />,
      ].map((icon, index) => (
        <button
          key={index}
          className="
            w-12 h-12 rounded-full border border-[#B58A44]
            text-[#C89B4F]
            flex items-center justify-center
            text-lg
            hover:bg-[#C89B4F]
            hover:text-black
            transition-all duration-300
          "
        >
          {icon}
        </button>
      ))}

    </div>

  </div>

  {/* EXPLORE */}
  <div className="border-r border-[#8e6b2e]/40 pr-10">

    <h3 className="uppercase tracking-[3px] text-[#C89B4F] text-[11px] font-medium">
      Explore
    </h3>

    <div className="w-8 h-[2px] bg-[#C89B4F] mt-4 mb-7" />

    <ul className="space-y-3 text-[12px] leading-[1.8] text-white/80">

      {exploreLinks.map((item) => (
        <li
          key={item}
          className="hover:text-[#C89B4F] cursor-pointer transition-all duration-300"
        >
          {item}
        </li>
      ))}

    </ul>

  </div>

  {/* KNOWLEDGE */}
  <div className="border-r border-[#8e6b2e]/40 pr-10">

    <h3 className="uppercase tracking-[3px] text-[#C89B4F] text-[11px] font-medium">
      Knowledge Centre
    </h3>

    <div className="w-8 h-[2px] bg-[#C89B4F] mt-4 mb-7" />

    <ul className="space-y-3 text-[12px] leading-[1.8] text-white/80">

      {knowledgeLinks.map((item) => (
        <li
          key={item}
          className="hover:text-[#C89B4F] cursor-pointer transition-all duration-300"
        >
          {item}
        </li>
      ))}

    </ul>

  </div>

  {/* INSIGHTS */}
  <div>

    <h3 className="uppercase tracking-[3px] text-[#C89B4F] text-[11px] font-medium">
      Property Insights
    </h3>

    <div className="w-8 h-[2px] bg-[#C89B4F] mt-4 mb-7" />

    <ul className="space-y-3 text-[12px] leading-[1.8] text-white/80">

      {insightLinks.map((item) => (
        <li
          key={item}
          className="hover:text-[#C89B4F] cursor-pointer transition-all duration-300"
        >
          {item}
        </li>
      ))}

    </ul>

  </div>

</div>

{/* ================= FEATURES STRIP ================= */}

<div className="mt-16 border border-[#8e6b2e]/60 rounded-xl overflow-hidden">

  <div className="grid lg:grid-cols-6 divide-x divide-[#8e6b2e]/30">

    {featureCards.map((item, index) => (
      <div
        key={index}
        className="flex items-center gap-4 px-6 py-6 hover:bg-[#0b1c15] transition-all duration-300"
      >

        <div className="text-[#C89B4F] text-xl">
          {item.icon}
        </div>

        <div>

          <h4 className="uppercase tracking-[2px] text-[11px] text-white/90">
            {item.title}
          </h4>

          <p className="uppercase tracking-[1px] text-[10px] text-white/70 mt-1">
            {item.subtitle}
          </p>

        </div>

      </div>
    ))}

  </div>

</div>

        {/* ================= LOWER SECTION ================= */}

<div className="grid lg:grid-cols-[1.25fr_1.2fr_1.15fr_0.9fr] gap-12 mt-20">

  {/* BRAND */}
  <div className="border-r border-[#8e6b2e]/30 pr-10">

    <p className="uppercase tracking-[3px] text-[#C89B4F] text-[11px] font-medium">
      A Brand By
    </p>

    <h3 className="text-[18px] lg:text-[20px] font-light mt-5 tracking-wide text-white">
      AMETHYST LANDBASE
    </h3>

    <div className="w-14 h-[2px] bg-[#C89B4F] mt-6 mb-7" />

    <p className="text-white/70 text-[13px] leading-[1.9]">

      Luxury Property Advisory &nbsp; | &nbsp; 5+ Years of Trust
      <br />
      1000+ Families Served &nbsp; | &nbsp; ₹1000+ Cr Advisory Value

    </p>

  </div>

  {/* NEWSLETTER */}
  <div className="border-r border-[#8e6b2e]/30 pr-10">

    <h3 className="uppercase tracking-[3px] text-[#C89B4F] text-[11px] font-medium">
      Stay Updated
    </h3>

    <p className="text-white/70 mt-6 text-[13px] leading-[1.8]">
      Insights on luxury real estate, market trends, and exclusive opportunities.
    </p>

    <div className="flex mt-10 h-[52px]">

      <input
        type="email"
        placeholder="Enter your email address"
        className="flex-1 bg-transparent border border-[#8e6b2e]/50 px-5 outline-none text-white placeholder:text-white/40 text-[13px]"
      />

      <button
        className="w-16 bg-[#C89B4F] text-black hover:bg-[#d7ae63] duration-300 flex items-center justify-center"
      >
        <FaArrowRight />
      </button>

    </div>

  </div>

  {/* CONTACT */}
  <div>

    <h3 className="uppercase tracking-[3px] text-[#C89B4F] text-[11px] font-medium">
      Contact Us
    </h3>

    <div className="space-y-5 mt-8 text-[13px] leading-[1.8] text-white/80">

      <div className="flex items-center gap-3">
        <FaPhoneAlt className="text-[#C89B4F]" />
        <a
  href="tel:+919090106101"
  className="hover:text-[#C89B4F] transition-colors"
>
  +91 90901 06101
</a>
      </div>

      <div className="flex items-center gap-3">
        <FaEnvelope className="text-[#C89B4F]" />
        <a
  href="mailto:propertybouquet@gmail.com"
  className="hover:text-[#C89B4F] transition-colors"
>
  propertybouquet@gmail.com
</a>
      </div>

      <div className="flex items-start gap-3">
        <FaMapMarkerAlt className="text-[#C89B4F] mt-1" />
        <span>Gurugram | Delhi NCR | Noida </span>
      </div>

      <div className="flex items-center gap-3">
        <FaClock className="text-[#C89B4F]" />
        <span>Mon - Sun : 10:00 AM - 7:00 PM</span>
      </div>

    </div>

  </div>

 {/* WHATSAPP CARD */}

<a
  href="https://wa.me/919090106101?text=Hi%20Property%20Bouquet,%20I'm%20interested%20in%20a%20property.%20Please%20assist%20me."
  target="_blank"
  rel="noopener noreferrer"
  className="
    border border-[#8e6b2e]/60 rounded-xl p-7 h-full
    flex flex-col justify-between
    hover:border-[#C89B4F]
    hover:bg-[#0b1c15]
    transition-all duration-300
    group
  "
>
  <div className="flex gap-4 items-start">

    <div
      className="
        w-14 h-14 rounded-full border border-[#C89B4F]
        flex items-center justify-center
        text-[#C89B4F] text-2xl
        group-hover:bg-[#C89B4F]
        group-hover:text-black
        transition-all duration-300
      "
    >
      <FaWhatsapp />
    </div>

    <div>
      <p className="text-[#C89B4F] text-[11px] tracking-[3px] font-medium uppercase">
        Talk to our
      </p>

      <h4 className="text-[18px] font-light mt-1 text-white">
        Property Expert
      </h4>

      <p className="mt-2 text-sm text-white/60">
        Get instant assistance on WhatsApp
      </p>
    </div>
  </div>

  <div
    className="
      mt-10 flex justify-between items-center
      text-[14px] text-white/80
      group-hover:text-[#C89B4F]
      transition-all
    "
  >
    <span>+91 90901 06101</span>

    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
  </div>
</a>

</div>

        {/* PART 3 STARTS HERE */}

                {/* ================= BOTTOM BAR ================= */}

        <div className="mt-20 pt-8 border-t border-[#8e6b2e]/30">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

            {/* LEFT */}

            <p className="text-white/60 text-[13px] leading-[1.9]">
              © 2026 Property Bouquet. All Rights Reserved.
            </p>

            {/* CENTER */}

            <div className="flex flex-wrap justify-center items-center">

              {[
                "Privacy Policy",
                "Terms of Use",
                "Disclaimer",
                "Sitemap",
              ].map((item, index) => (

                <div
                  key={item}
                  className="flex items-center"
                >

                  <button
                    className="
                    px-6
                    text-white/65
                    hover:text-[#C89B4F]
                    transition-all
                    duration-300
                    "
                  >
                    {item}
                  </button>

                  {index !== 3 && (
                    <span className="text-[#8e6b2e]/50">
                      |
                    </span>
                  )}

                </div>

              ))}

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-3 text-white/65">

              <FaLock className="text-[#C89B4F]" />

              <span className="text-[15px]">
                Your data is 100% safe and secure
              </span>

            </div>

          </div>

        </div>

      </div>

    </footer>

  );
}