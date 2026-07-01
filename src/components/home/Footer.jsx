"use client";

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

        <div className="grid lg:grid-cols-[1.8fr_1fr_1fr_1fr] gap-14">

          {/* LEFT */}

          <div className="pr-10 border-r border-[#8e6b2e]/40">

           {/* Logo */}

<div className="mb-10">
  <img
    src="/logowhole.png"
    alt="Property Bouquet"
    className="
      w-full
      max-w-[430px]
      h-auto
      object-contain
      object-left
      select-none
    "
    draggable={false}
  />
</div>

            <p className="mt-10 text-[23px] leading-[2.1] text-white/80 max-w-[700px]">
              Property Bouquet is a luxury real estate platform offering
              curated properties, expert insights & intelligent tools to help
              you make confident decisions.
            </p>

            {/* SOCIAL */}

            <div className="flex gap-7 mt-16">

              {[
                <FaFacebookF />,
                <FaInstagram />,
                <FaLinkedinIn />,
                <FaYoutube />,
              ].map((icon, index) => (

                <button
                  key={index}
                  className="w-16 h-16 rounded-full border border-[#B58A44] text-[#C89B4F]
                  flex items-center justify-center
                  text-xl
                  hover:bg-[#C89B4F]
                  hover:text-black
                  duration-300"
                >
                  {icon}
                </button>

              ))}

            </div>

          </div>

          {/* EXPLORE */}

          <div className="border-r border-[#8e6b2e]/40 pr-10">

            <h3 className="uppercase tracking-[3px] text-[#C89B4F] text-lg">
              Explore
            </h3>

            <div className="w-10 h-[2px] bg-[#C89B4F] mt-4 mb-8"></div>

            <ul className="space-y-4 text-[22px] text-white/85">

              {exploreLinks.map((item) => (

                <li
                  key={item}
                  className="hover:text-[#C89B4F] cursor-pointer duration-300"
                >
                  {item}
                </li>

              ))}

            </ul>

          </div>

          {/* KNOWLEDGE */}

          <div className="border-r border-[#8e6b2e]/40 pr-10">

            <h3 className="uppercase tracking-[3px] text-[#C89B4F] text-lg">
              Knowledge Centre
            </h3>

            <div className="w-10 h-[2px] bg-[#C89B4F] mt-4 mb-8"></div>

            <ul className="space-y-4 text-[22px] text-white/85">

              {knowledgeLinks.map((item) => (

                <li
                  key={item}
                  className="hover:text-[#C89B4F] cursor-pointer duration-300"
                >
                  {item}
                </li>

              ))}

            </ul>

          </div>

          {/* INSIGHTS */}

          <div>

            <h3 className="uppercase tracking-[3px] text-[#C89B4F] text-lg">
              Property Insights
            </h3>

            <div className="w-10 h-[2px] bg-[#C89B4F] mt-4 mb-8"></div>

            <ul className="space-y-4 text-[22px] text-white/85">

              {insightLinks.map((item) => (

                <li
                  key={item}
                  className="hover:text-[#C89B4F] cursor-pointer duration-300"
                >
                  {item}
                </li>

              ))}

            </ul>

          </div>

        </div>

        {/* PART 2 STARTS HERE */}

        {/* ================= FEATURES STRIP ================= */}

        <div className="mt-20 border border-[#8e6b2e]/60 rounded-xl overflow-hidden">

          <div className="grid lg:grid-cols-6 divide-x divide-[#8e6b2e]/40">

            {featureCards.map((item, index) => (

              <div
                key={index}
                className="flex items-center gap-5 px-8 py-8 hover:bg-[#0b1c15] transition-all duration-300"
              >

                <div className="text-[#C89B4F] text-[34px]">
                  {item.icon}
                </div>

                <div>

                  <h4 className="uppercase tracking-[2px] text-[13px] text-white/90">
                    {item.title}
                  </h4>

                  <p className="uppercase tracking-[1px] text-[13px] text-white/75 mt-1">
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

            <p className="uppercase tracking-[2px] text-[#C89B4F] text-sm">
              A Brand By
            </p>

            <h3 className="text-[34px] font-light mt-5 tracking-wide">
              AMETHYST LANDBASE
            </h3>

            <div className="w-16 h-[2px] bg-[#C89B4F] mt-7 mb-8"></div>

            <p className="text-white/75 text-[18px] leading-9">

              Luxury Property Advisory &nbsp; | &nbsp;
              5+ Years of Trust

              <br />

              1000+ Families Served &nbsp; | &nbsp;
              ₹1000+ Cr Advisory Value

            </p>

          </div>

          {/* NEWSLETTER */}

          <div className="border-r border-[#8e6b2e]/30 pr-10">

            <h3 className="uppercase tracking-[3px] text-[#C89B4F] text-lg">
              Stay Updated
            </h3>

            <p className="text-white/70 mt-6 text-[18px] leading-8">

              Insights on luxury real estate,
              market trends,
              and exclusive opportunities.

            </p>

            <div className="flex mt-10 h-[64px]">

              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-transparent border border-[#8e6b2e]/50 px-6 outline-none text-white placeholder:text-white/40"
              />

              <button
                className="w-20 bg-[#C89B4F] text-black text-2xl hover:bg-[#d7ae63] duration-300 flex items-center justify-center"
              >
                <FaArrowRight />
              </button>

            </div>

          </div>

          {/* CONTACT */}

          <div>

            <h3 className="uppercase tracking-[3px] text-[#C89B4F] text-lg">
              Contact Us
            </h3>

            <div className="space-y-6 mt-8 text-[18px] text-white/80">

              <div className="flex items-center gap-4">
                <FaPhoneAlt className="text-[#C89B4F]" />
                <span>+91 99900 12345</span>
              </div>

              <div className="flex items-center gap-4">
                <FaEnvelope className="text-[#C89B4F]" />
                <span>connect@propertybouquet.com</span>
              </div>

              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-[#C89B4F] mt-1" />
                <span>
                  Gurugram | Delhi NCR | Pune | Mumbai
                </span>
              </div>

              <div className="flex items-center gap-4">
                <FaClock className="text-[#C89B4F]" />
                <span>Mon - Sat : 10:00 AM - 7:00 PM</span>
              </div>

            </div>

          </div>

          {/* WHATSAPP CARD */}

          <div>

            <div
              className="
              border
              border-[#8e6b2e]/60
              rounded-xl
              p-8
              h-full
              flex
              flex-col
              justify-between
              hover:border-[#C89B4F]
              transition-all
              duration-300
              "
            >

              <div className="flex gap-5">

                <div
                  className="
                  w-16
                  h-16
                  rounded-full
                  border
                  border-[#C89B4F]
                  flex
                  items-center
                  justify-center
                  text-[#C89B4F]
                  text-3xl
                  "
                >
                  <FaWhatsapp />
                </div>

                <div>

                  <p className="text-[#C89B4F] text-lg">
                    Talk to our
                  </p>

                  <h4 className="text-[26px] font-light mt-2">
                    Property Expert
                  </h4>

                </div>

              </div>

              <button
                className="
                mt-10
                flex
                justify-between
                items-center
                text-[26px]
                hover:text-[#C89B4F]
                transition-all
                "
              >
                <span>+91 99900 12345</span>

                <FaArrowRight />
              </button>

            </div>

          </div>

        </div>

        {/* PART 3 STARTS HERE */}

                {/* ================= BOTTOM BAR ================= */}

        <div className="mt-20 pt-8 border-t border-[#8e6b2e]/30">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

            {/* LEFT */}

            <p className="text-white/60 text-[16px]">
              © 2024 Property Bouquet. All Rights Reserved.
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