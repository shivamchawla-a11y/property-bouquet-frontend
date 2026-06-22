"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    title: "PROPERTIES",
    items: ["Apartments", "Penthouses", "Villas", "Plots"],
  },
  {
    title: "INVESTMENT INTELLIGENCE",
    items: ["Market Reports", "ROI Analysis", "Luxury Trends"],
  },
  {
    title: "LOCATIONS",
    items: ["Dubai", "Gurgaon", "Goa", "London"],
  },
  {
    title: "ADVISORY",
    items: ["Private Advisory", "Investment Planning"],
  },
  {
    title: "MARKET INSIGHTS",
    items: ["Insights", "Guides", "Luxury News"],
  },
  {
    title: "ABOUT US",
    items: ["Our Story", "Clients", "Vision"],
  },
];

export default function Navbar({
  onConsultationClick,
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[999] transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1450px] mx-auto px-5 xl:px-8">
        
        <div className="h-[82px] flex items-center justify-between">
          
          {/* LEFT */}
          <div className="flex items-center gap-10">

            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center gap-3 shrink-0"
            >
              <img
                src="/logo.png"
                alt="logo"
                className="w-[48px] h-[48px] object-contain"
              />

              <div className="leading-none">
                <h2 className="text-[24px] xl:text-[26px] font-semibold text-white tracking-tight font-heading">
                  PROPERTY
                </h2>

                <p className="text-[#c59d4f] tracking-[4px] text-[11px] xl:text-[12px] font-medium mt-1">
                  BOUQUET
                </p>
              </div>
            </Link>

            {/* DESKTOP MENU */}
            <nav className="hidden xl:flex items-center gap-[2px]">
              {navItems.map((item) => (
                <div
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => setActive(item.title)}
                  onMouseLeave={() => setActive(null)}
                >
                  <button className="flex items-center gap-1 text-white/85 hover:text-[#d6aa53] transition text-[11px] xl:text-[12px] font-medium tracking-[0.08em] px-2.5 h-9 uppercase">
                    {item.title}

                    <ChevronDown
                      size={13}
                      className={`transition duration-300 ${
                        active === item.title
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

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
    {item.items.map((sub) => (
      <Link
        key={sub}
        href="#"
        className="
          block
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
      </Link>
    ))}
  </div>

</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
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
          {navItems.map((item) => (
            <div
              key={item.title}
              className="
                border-b
                border-white/10
              "
            >
              <button
                onClick={() =>
                  setMobileDropdown(
                    mobileDropdown ===
                      item.title
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
                  tracking-wide
                "
              >
                {item.title}

                <ChevronDown
                  size={18}
                  className={`transition ${
                    mobileDropdown ===
                    item.title
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {mobileDropdown ===
                  item.title && (
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
                    className="
                      overflow-hidden
                      pb-4
                    "
                  >
                    {item.items.map(
                      (sub) => (
                        <button
                          key={sub}
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
                      )
                    )}
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
</AnimatePresence>
    </header>
  );
}