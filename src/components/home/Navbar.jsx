"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navItems = [
  {
    title: "Properties",
    key: "properties",
    href: "/properties",
  },
  {
    title: "Locations",
    key: "locations",
  },
  {
    title: "Developers",
    key: "developers",
  },
  {
    title: "Knowledge Centre",
    href: "/knowledge",
    items: [
      "Buying Guides",
      "Home Loans",
      "Legal Guides",
      "Investment Guides",
    ],
  },
  {
    title: "Property Insights",
    href: "/insights",
    items: [
      "Market Reports",
      "Luxury News",
      "Investment Trends",
    ],
  },
  {
    title: "Tools",
    href: "/tools",
    items: [
      "EMI Calculator",
      "ROI Calculator",
      "Affordability Calculator",
      "Area Converter",
    ],
  },
  {
    title: "About Us",
    href: "/about",
    items: [
      "Company",
      "Our Team",
      "Careers",
    ],
  },
];

export default function Navbar({
  onConsultationClick,
  forceSolid = false,
}) {
  const [active, setActive] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
  useState(false);

  const [accountDropdown, setAccountDropdown] =
  useState(false);

const [mobileDropdown, setMobileDropdown] =
  useState(null);

  const [showConsultationModal, setShowConsultationModal] =
  useState(false);

  const [locations, setLocations] = useState([]);
const [developers, setDevelopers] = useState([]);
const [propertyTypes, setPropertyTypes] = useState([]);

const [properties, setProperties] = useState([]);

const [showLocationModal, setShowLocationModal] =
  useState(false);

const [locationSearch, setLocationSearch] =
  useState("");

const [showDeveloperModal, setShowDeveloperModal] =
  useState(false);

const [developerSearch, setDeveloperSearch] =
  useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const lightNavbar = forceSolid || scrolled;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(
          "/api/properties"
        );
  
        const data = await res.json();
  
        if (res.ok) {
         const propertyData =
  data.data || [];

setProperties(propertyData);
          // LOCATIONS
          const uniqueLocations = [
            ...new Set(
              propertyData.flatMap(
                (property) => {
                  const location =
                    property?.locationData
                      ?.locationName;
  
                  if (!location) return [];
  
                  return location
                    .split(">")
                    .map((item) =>
                      item.trim()
                    )
                    .filter(Boolean);
                }
              )
            ),
          ].sort();
  
          setLocations(
            uniqueLocations
          );
  
  // DEVELOPERS
  const uniqueDevelopers = [
    ...new Map(
      propertyData
        .filter((property) => property?.coreDetails?.developerName)
        .map((property) => {
          const developer = property.coreDetails.developerRef;
  
          return [
            property.coreDetails.developerName,
            {
              name: property.coreDetails.developerName,
              logo:
                developer?.logo ||
                developer?.image ||
                property.coreDetails.developerLogo ||
                property.coreDetails.developerImage ||
                "/placeholder.png",
            },
          ];
        })
    ).values(),
  ].sort((a, b) => a.name.localeCompare(b.name));
  
  setDevelopers(uniqueDevelopers);
          const uniqueCategories = [
    ...new Set(
      propertyData
        .map(
          (property) =>
            property?.categoryData
              ?.categoryName
        )
        .filter(Boolean)
    ),
  ].sort();
  
  setPropertyTypes(
    uniqueCategories
  );
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchProperties();
  }, []);

const mobileItems = navItems.map((item) => {
  let items = item.items || [];

  if (item.key === "properties") {
    items = propertyTypes;
  }

  if (item.key === "locations") {
    items = [
      ...locations.slice(0, 5),
      "View All Locations →",
    ];
  }

  if (item.key === "developers") {
    items = [
      ...developers
        .slice(0, 5)
        .map((d) => d.name),
      "View All Developers →",
    ];
  }

  return {
    ...item,
    items,
  };
});
  
  return (
    <header
  className={`fixed top-0 left-0 w-full z-[999] transition-all duration-500 ${
    lightNavbar
      ? "bg-[#0b0b0b]/90 backdrop-blur-xl border-b border-white/10"
      : "bg-transparent"
  }`}
>
      <div className="max-w-[1450px] mx-auto px-5 xl:px-8">
        
        <div className="h-[72px] flex items-center justify-between">
          
          {/* LEFT */}
          <div className="flex items-center gap-10">

            {/* LOGO */}
            <Link
  href="/"
  className="
    flex
    items-center
    gap-4
    shrink-0
    group
    transition-all
    duration-500
  "
>
              <Image
  src="/logo.webp"
  alt="Property Bouquet"
  width={52}
  height={52}
  priority
  className="
    w-[46px]
    h-[46px]
    xl:w-[52px]
    xl:h-[52px]
    object-contain
    transition-all
    duration-500
    group-hover:scale-105
    drop-shadow-[0_6px_14px_rgba(0,0,0,.3)]
  "
/>
              <div className="flex flex-col leading-none">

  <h2
    className="
      text-[24px]
xl:text-[27px]
      font-light
      tracking-[0.08em]
      text-white
      uppercase
      drop-shadow-[0_2px_12px_rgba(0,0,0,.35)]
    "
    style={{
      fontFamily: "Cormorant Garamond, serif",
    }}
  >
    PROPERTY
  </h2>

  <div className="flex items-center gap-3 shrink-0 group">

    <div
      className="
        h-px
        w-8
        bg-gradient-to-r
        from-transparent
        via-[#D4AF37]
        to-[#D4AF37]
      "
    />

    <span
      className="
        mx-3
        text-[#D4AF37]
        text-[10px]
tracking-[0.38em]
        uppercase
        font-semibold
      "
    >
      BOUQUET
    </span>

    <div
      className="
        h-px
        flex-1
        bg-gradient-to-l
        from-transparent
        via-[#D4AF37]
        to-[#D4AF37]
      "
    />

  </div>

</div>
            </Link>

            {/* DESKTOP MENU */}
            <nav className="hidden xl:flex items-center gap-[2px]">
              {navItems.map((item) => {

  let dropdownItems = item.items || [];

  if (item.key === "properties") {
    dropdownItems = propertyTypes;
  }

  if (item.key === "locations") {
    dropdownItems = [
      ...locations.slice(0, 5),
      "View All Locations →",
    ];
  }

  if (item.key === "developers") {
    dropdownItems = [
      ...developers
        .slice(0, 5)
        .map((dev) => dev.name),
      "View All Developers →",
    ];
  }

  return (
               <div
  key={item.title}
  className="relative"
  onMouseEnter={() => setActive(item.title)}
  onMouseLeave={() => setActive(null)}
>
  {/* MENU TITLE */}
  <div className="flex items-center h-9">
    <Link
      href={item.href || "#"}
      className="
        flex
        items-center
        text-white/85
        hover:text-[#d6aa53]
        transition
        text-[10px]
        xl:text-[11px]
        font-medium
        tracking-[0.08em]
        pl-2.5
      "
    >
      {item.title}
    </Link>

    <button
      type="button"
      className="px-1 text-white/85 hover:text-[#d6aa53]"
    >
      <ChevronDown
        size={13}
        className={`transition duration-300 ${
          active === item.title ? "rotate-180" : ""
        }`}
      />
    </button>
  </div>

  <AnimatePresence>
    {active === item.title && (
      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: 8,
        }}
        transition={{
          duration: 0.2,
        }}
        className="absolute top-[48px] left-0 w-[240px]"
      >
        <div className="rounded-[22px] border border-white/10 bg-[#0b0b0b]/95 backdrop-blur-2xl p-3 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">

          <div className="space-y-1">
            {dropdownItems.length > 0 &&
              dropdownItems.map((sub) => (
                <button
                  key={sub}
                  onClick={() => {

                    // PROPERTIES
                    if (item.key === "properties") {
                      window.location.href =
                        `/properties?propertyType=${encodeURIComponent(sub)}`;
                      return;
                    }

                    // LOCATIONS
                    if (item.key === "locations") {

                      if (sub === "View All Locations →") {
                        setShowLocationModal(true);
                        return;
                      }

                      window.location.href =
                        `/properties?location=${encodeURIComponent(sub)}`;
                      return;
                    }

                    // DEVELOPERS
                    if (item.key === "developers") {

                      if (sub === "View All Developers →") {
                        setShowDeveloperModal(true);
                        return;
                      }

                      window.location.href =
                        `/properties?developer=${encodeURIComponent(sub)}`;
                      return;
                    }

                    // KNOWLEDGE CENTRE
                    if (item.title === "Knowledge Centre") {
                      window.location.href =
                        `/knowledge?category=${encodeURIComponent(sub)}`;
                      return;
                    }

                    // PROPERTY INSIGHTS
                    if (item.title === "Property Insights") {
                      window.location.href =
                        `/insights?category=${encodeURIComponent(sub)}`;
                      return;
                    }

                    // TOOLS
                    if (item.title === "Tools") {

                      const routes = {
                        "EMI Calculator": "/tools/emi-calculator",
                        "ROI Calculator": "/tools/roi-calculator",
                        "Affordability Calculator": "/tools/affordability-calculator",
                        "Area Converter": "/tools/area-converter",
                      };

                      window.location.href = routes[sub];
                      return;
                    }

                    // ABOUT
                    if (item.title === "About Us") {

                      const routes = {
                        Company: "/about/company",
                        "Our Team": "/about/team",
                        Careers: "/about/careers",
                      };

                      window.location.href = routes[sub];
                      return;
                    }

                  }}
                  className="
                    w-full
                    text-left
                    px-4
                    py-3
                    rounded-xl
                    text-white/75
                    hover:bg-white/5
                    hover:text-[#d6aa53]
                    transition
                    text-[13px]
                  "
                >
                  {sub}
                </button>
              ))}
          </div>

        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
             );
})}
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3 relative">

            {/* CONSULTATION BUTTON */}
            <button
  onClick={onConsultationClick}
  className="hidden lg:flex h-[44px] px-6 rounded-xl bg-gradient-to-b from-[#d9b061] to-[#b8862e] text-black font-semibold text-[11px] tracking-[0.12em] shadow-[0_10px_35px_rgba(0,0,0,0.35)] hover:scale-[1.03] transition uppercase items-center"
>
  Private Consultation
</button>

            {/* MENU */}
            {/* DESKTOP ACCOUNT MENU */}
<div className="relative hidden xl:block">
  <button
    onClick={() =>
      setAccountDropdown(
        !accountDropdown
      )
    }
    className="
      w-[46px]
      h-[46px]
      rounded-full
      border
      border-[#b8862e]/40
      bg-black/30
      backdrop-blur-xl
      flex
      items-center
      justify-center
      text-[#d9b061]
      hover:bg-[#d9b061]
      hover:text-black
      transition-all
      duration-300
    "
  >
    <Menu size={18} />
  </button>
  

  <AnimatePresence>
    {accountDropdown && (
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: 10,
        }}
        transition={{
          duration: 0.2,
        }}
        className="
          absolute
          right-0
          top-[58px]
          w-[260px]
          rounded-[24px]
          border
          border-white/10
          bg-[#0b0b0b]/95
          backdrop-blur-2xl
          p-3
          shadow-[0_20px_80px_rgba(0,0,0,0.45)]
        "
      >
        <div className="space-y-3">

  {/* Premium Card */}
  <div
    className="
      rounded-2xl
      border
      border-[#d9b061]/20
      bg-gradient-to-br
      from-[#d9b061]/10
      via-transparent
      to-transparent
      p-5
    "
  >
    <p className="text-white text-base font-semibold">
      Welcome to Property Bouquet
    </p>

    <p className="text-white/60 text-sm mt-2 leading-6">
      India's luxury real estate marketplace for premium buyers,
      investors and property owners.
    </p>
  </div>


  <Link
    href="/auth"
    className="
      flex
      items-center
      justify-center
      h-[48px]
      rounded-xl
      border
      border-white/10
      text-white
      hover:bg-white/5
      hover:text-[#d9b061]
      transition
    "
  >
    Login
  </Link>

  <Link
    href="/auth"
    className="
      flex
      items-center
      justify-center
      h-[48px]
      rounded-xl
      bg-white
      text-black
      font-semibold
      hover:scale-[1.02]
      transition
    "
  >
    Create Account
  </Link>

  <Link
    href="/contact"
    className="
      flex
      items-center
      justify-center
      h-[48px]
      rounded-xl
      border
      border-white/10
      text-white
      hover:bg-white/5
      hover:text-[#d9b061]
      transition
    "
  >
      Contact Us
  </Link>

</div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

{/* MOBILE MENU BUTTON - KEEP ORIGINAL BEHAVIOUR */}
<button
  onClick={() =>
    setMobileMenuOpen(
      !mobileMenuOpen
    )
  }
  className="
    xl:hidden
    w-[46px]
    h-[46px]
    rounded-full
    border
    border-[#b8862e]/40
    bg-black/30
    backdrop-blur-xl
    flex
    items-center
    justify-center
    text-[#d9b061]
    hover:bg-[#d9b061]
    hover:text-black
    transition-all
    duration-300
  "
>
  {mobileMenuOpen ? (
    <X size={18} />
  ) : (
    <Menu size={18} />
  )}
</button>

          </div>
        </div>
      </div>

      <AnimatePresence>
  {mobileMenuOpen && (
    <>
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() =>
          setMobileMenuOpen(false)
        }
        className="
          fixed
          inset-0
          bg-black/70
          backdrop-blur-md
          z-[998]
          xl:hidden
        "
      />

      {/* DRAWER */}
      <motion.div
        initial={{
          x: "100%",
        }}
        animate={{
          x: 0,
        }}
        exit={{
          x: "100%",
        }}
        transition={{
          type: "spring",
          damping: 28,
          stiffness: 250,
        }}
        className="
          fixed
          top-0
          right-0
          h-screen
          w-[90%]
          max-w-[380px]
          bg-[#0b0b0b]
          border-l
          border-white/10
          z-[999]
          overflow-y-auto
          xl:hidden
        "
      >
        {/* HEADER */}
        <div
          className="
            sticky
            top-0
            bg-[#0b0b0b]
            border-b
            border-white/10
            px-6
            py-5
            flex
            items-center
            justify-between
          "
        >
          <h3
            className="
              text-white
              font-semibold
              text-lg
            "
          >
            Menu
          </h3>

          <button
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="
              w-10
              h-10
              rounded-full
              bg-white/5
              text-white
              flex
              items-center
              justify-center
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* NAV ITEMS */}
        <div className="p-4">
  {mobileItems.map((item) => (
    <div
      key={item.title}
      className="border-b border-white/10"
    >
      <button
        onClick={() =>
          setMobileDropdown(
            mobileDropdown === item.title
              ? null
              : item.title
          )
        }
        className="
          w-full
          flex
          items-center
          justify-between
          py-5
          text-left
          text-white
          font-medium
        "
      >
        {item.title}

        <ChevronDown
          size={18}
          className={`transition ${
            mobileDropdown === item.title
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {mobileDropdown === item.title && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            className="overflow-hidden pb-4"
          >
            {item.items.map((sub) => (
              <button
                key={sub}
                onClick={() => {

                  if (item.key === "properties") {
                    window.location.href =
                      `/properties?propertyType=${encodeURIComponent(sub)}`;
                    return;
                  }

                  if (item.key === "locations") {

                    if (
                      sub ===
                      "View All Locations →"
                    ) {
                      setShowLocationModal(true);
                      return;
                    }

                    window.location.href =
                      `/properties?location=${encodeURIComponent(sub)}`;
                    return;
                  }

                  if (item.key === "developers") {

                    if (
                      sub ===
                      "View All Developers →"
                    ) {
                      setShowDeveloperModal(true);
                      return;
                    }

                    window.location.href =
                      `/properties?developer=${encodeURIComponent(sub)}`;
                    return;
                  }

                }}
                className="
                  block
                  w-full
                  text-left
                  px-4
                  py-3
                  rounded-xl
                  text-white/70
                  hover:bg-white/5
                  hover:text-[#d6aa53]
                  transition
                "
              >
                {sub}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ))}


          {/* CONSULTATION BUTTON */}
          <button
  onClick={onConsultationClick}
  className="
    w-full
    mt-6
    h-[52px]
    rounded-xl
    bg-gradient-to-b
    from-[#d9b061]
    to-[#b8862e]
    text-black
    font-semibold
    uppercase
    tracking-[0.12em]
  "
>
  Private Consultation
</button>
        </div>
        <div className="space-y-3 mb-8">

  <div className="grid grid-cols-2 gap-3">

    <Link
      href="/auth"
      className="
        h-[48px]
        rounded-xl
        border
        border-white/10
        flex
        items-center
        justify-center
        text-white
      "
    >
      Login
    </Link>

    <Link
      href="/auth"
      className="
        h-[48px]
        rounded-xl
        bg-white
        text-black
        font-semibold
        flex
        items-center
        justify-center
      "
    >
      Sign Up
    </Link>

  </div>

  <Link
    href="/contact"
    className="
      h-[48px]
      rounded-xl
      border
      border-white/10
      flex
      items-center
      justify-center
      text-white
    "
  >
      Contact Us
  </Link>

</div>
      </motion.div>
    </>
  )}
</AnimatePresence>
<AnimatePresence>
  {showDeveloperModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed
        inset-0
        z-[999999]
        bg-black/45
        backdrop-blur-[5px]
        flex
        items-start
        justify-center
        pt-[110px]
        pb-8
        px-4
      "
      onClick={() =>
        setShowDeveloperModal(false)
      }
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.96,
          y: 20,
        }}
        transition={{
          duration: 0.25,
        }}
        onClick={(e) =>
          e.stopPropagation()
        }
        className="
          relative
          w-full
          max-w-[540px]
          rounded-[28px]
          border
          border-[#c89d58]/15
          bg-[#0b0b0b]
          shadow-[0_40px_120px_rgba(0,0,0,0.65)]
          overflow-hidden
        "
      >
        {/* GOLD TOP LINE */}
        <div
          className="
            h-[2px]
            bg-gradient-to-r
            from-transparent
            via-[#c89d58]
            to-transparent
          "
        />

        {/* HEADER */}
        <div
          className="
            sticky
            top-0
            z-20
            bg-[#0b0b0b]
            border-b
            border-white/10
            px-6
            py-5
          "
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="
                  text-[#c89d58]
                  text-[10px]
                  uppercase
                  tracking-[3px]
                  mb-2
                "
              >
                Developer Directory
              </p>

              <h3
                className="
                  text-white
                  text-[22px]
                  font-semibold
                  leading-none
                "
              >
                Select Developer
              </h3>

              <p
                className="
                  text-white/45
                  text-[13px]
                  mt-2
                "
              >
                Browse all developer partners
              </p>
            </div>

            <button
              onClick={() =>
                setShowDeveloperModal(false)
              }
              className="
                w-9
                h-9
                rounded-full
                bg-white/5
                hover:bg-white/10
                text-white/60
                transition-all
                flex
                items-center
                justify-center
              "
            >
              ✕
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div
          className="
            sticky
            top-[104px]
            z-10
            bg-[#0b0b0b]
            p-5
            border-b
            border-white/10
          "
        >
          <input
            value={developerSearch}
            onChange={(e) =>
              setDeveloperSearch(
                e.target.value
              )
            }
            placeholder="Search developer..."
            className="
              w-full
              h-[50px]
              rounded-[16px]
              bg-white/[0.04]
              border
              border-white/10
              px-5
              text-white
              placeholder:text-white/35
              outline-none
              focus:border-[#c89d58]/40
              transition-all
            "
          />
        </div>

        {/* LIST */}
        <div
  className="
    max-h-[260px]
    overflow-y-auto
    scrollbar-thin
    scrollbar-thumb-white/10
  "
>
  {developers
  .filter((developer) =>
    developer.name
      .toLowerCase()
      .includes(
        developerSearch.toLowerCase()
      )
  )
    .map((developer) => (
      <button
        key={developer.name}
        onClick={() => {
  setShowDeveloperModal(false);

  window.location.href =
    `/properties?developer=${encodeURIComponent(
      developer.name
    )}`;
}}
        className="
          w-full
          px-6
          py-4
          flex
          items-center
          gap-4
          border-b
          border-white/[0.04]
          hover:bg-white/[0.03]
          transition-all
          text-left
          group
        "
      >
        <img
  src={developer.logo}
  alt={developer.name}
  onError={(e) => {
    e.currentTarget.src = "/placeholder.png";
  }}
  className="
    w-12
    h-12
    rounded-xl
    object-cover
    border
    border-white/10
    bg-white/5
    shrink-0
  "
/>
        <div className="flex-1">
          <p
            className="
              text-white
              text-[15px]
              font-medium
              group-hover:text-[#c89d58]
              transition-colors
            "
          >
            {developer.name}
          </p>

          <p
            className="
              text-white/40
              text-[12px]
              mt-0.5
            "
          >
            Developer Partner
          </p>
        </div>
      </button>
    ))}

  {developers.filter((developer) =>
    developer.name
      .toLowerCase()
      .includes(developerSearch.toLowerCase())
  ).length === 0 && (
    <div className="py-14 text-center">
      <p className="text-white/40">
        No developers found
      </p>
    </div>
  )}
</div>
      </motion.div>
    </motion.div>
  )}
  {showLocationModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed
        inset-0
        z-[999999]
        bg-black/45
        backdrop-blur-[5px]
        flex
        items-start
        justify-center
        pt-[110px]
        pb-8
        px-4
      "
      onClick={() => setShowLocationModal(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          w-full
          max-w-[540px]
          rounded-[28px]
          border
          border-[#c89d58]/15
          bg-[#0b0b0b]
          shadow-[0_40px_120px_rgba(0,0,0,0.65)]
          overflow-hidden
        "
      >
        {/* TOP LINE */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#c89d58] to-transparent" />

        {/* HEADER */}
        <div className="px-6 py-5 border-b border-white/10">
          <p className="text-[#c89d58] text-[10px] uppercase tracking-[3px] mb-2">
            Location Directory
          </p>

          <h3 className="text-white text-[22px] font-semibold">
            Select Location
          </h3>

          <p className="text-white/45 text-[13px] mt-2">
            Browse all available locations
          </p>
        </div>

        {/* SEARCH */}
        <div className="p-5 border-b border-white/10">
          <input
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            placeholder="Search location..."
            className="
              w-full
              h-[50px]
              rounded-[16px]
              bg-white/[0.04]
              border
              border-white/10
              px-5
              text-white
              placeholder:text-white/35
              outline-none
              focus:border-[#c89d58]/40
            "
          />
        </div>

        {/* LIST */}
        <div className="max-h-[260px] overflow-y-auto">
          {locations
            .filter((loc) =>
              loc.toLowerCase().includes(locationSearch.toLowerCase())
            )
            .map((loc) => (
              <button
                key={loc}
                onClick={() => {
  setShowLocationModal(false);

  window.location.href =
    `/properties?location=${encodeURIComponent(
      loc
    )}`;
}}
                className="
                  w-full
                  px-6
                  py-4
                  flex
                  items-center
                  justify-between
                  border-b
                  border-white/[0.04]
                  hover:bg-white/[0.03]
                  transition-all
                  text-left
                "
              >
                <span className="text-white text-[14px] group-hover:text-[#c89d58]">
                  {loc}
                </span>

                <span className="text-[#c89d58] text-[16px]">
                  →
                </span>
              </button>
            ))}

          {locations.filter((loc) =>
            loc.toLowerCase().includes(locationSearch.toLowerCase())
          ).length === 0 && (
            <div className="py-14 text-center text-white/40">
              No locations found
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </header>
  );
}