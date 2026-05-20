"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { formatPrice } from "@/utils/formatPrice";

import {
  Waves,
  Dumbbell,
  Building2,
  Trees,
  Car,
  ArrowUpCircle,
  ShieldCheck,
  Zap,
  Home,
  Baby,
  Footprints,
  Camera,
  Gamepad2,
  Sparkles,
  ShoppingBag,
  Coffee,
  School,
  Hospital,
  Wifi,
  Utensils,
  Film,
  Landmark,
  Bus,
  Store,
  MapPin,

  // ADD THESE
  Download,
  Play,
  LayoutGrid,
  Users,
  CalendarDays,
  IndianRupee,

} from "lucide-react";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
    },
  },
};

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2,
    },
  },
};

const amenityIcons = {
  "Swimming Pool": <Waves size={28} />,
  Gym: <Dumbbell size={28} />,
  Clubhouse: <Building2 size={28} />,
  Garden: <Trees size={28} />,
  Parking: <Car size={28} />,
  Lift: <ArrowUpCircle size={28} />,
  Security: <ShieldCheck size={28} />,
  "Power Backup": <Zap size={28} />,
  Balcony: <Home size={28} />,
  "Kids Play Area": <Baby size={28} />,
  "Jogging Track": <Footprints size={28} />,
  CCTV: <Camera size={28} />,
  "Indoor Games": <Gamepad2 size={28} />,
  Spa: <Sparkles size={28} />,
  "Shopping Center": <ShoppingBag size={28} />,
};

const CUSTOM_ICONS = [
  { name: "Home", icon: Home },
  { name: "Swimming", icon: Waves },
  { name: "Gym", icon: Dumbbell },
  { name: "Club", icon: Building2 },
  { name: "Garden", icon: Trees },
  { name: "Parking", icon: Car },
  { name: "Lift", icon: ArrowUpCircle },
  { name: "Security", icon: ShieldCheck },
  { name: "Power", icon: Zap },
  { name: "Kids", icon: Baby },
  { name: "Track", icon: Footprints },
  { name: "CCTV", icon: Camera },
  { name: "Games", icon: Gamepad2 },
  { name: "Spa", icon: Sparkles },
  { name: "Shopping", icon: ShoppingBag },
  { name: "Cafe", icon: Coffee },
  { name: "School", icon: School },
  { name: "Hospital", icon: Hospital },
  { name: "Wifi", icon: Wifi },
  { name: "Restaurant", icon: Utensils },
  { name: "Cinema", icon: Film },
  { name: "Temple", icon: Landmark },
  { name: "Bus", icon: Bus },
  { name: "Store", icon: Store },
];

export default function PropertyPreview({ form, developers = [] }) {
  if (!form) return null;

const {
  coreDetails = {},
  overview = {},
  media = {},
  unitConfigurations = [],
  locationData = {},
  faqs = [],
  keyMetrics = {},
  gatedContent = {},
  heroSection = {},
  categoryData = {},
} = form;

const aboutSectionNumber =
  overview?.aboutSectionNumber || "02";

const aboutSectionLabel =
  overview?.aboutSectionLabel || "About The Project";

const aboutHeadingLine1 =
  overview?.aboutHeadingLine1 || "A Vision That";

const aboutHeadingLine2 =
  overview?.aboutHeadingLine2 || "Transcends the Ordinary";

const aboutParagraph2 =
  overview?.aboutParagraph2 ||
  "More than just a residence, it is a legacy in the making — crafted for discerning individuals and families who seek exclusivity in every detail of life.";

const featureBar =
  overview?.featureBar?.length > 0
    ? overview.featureBar
    : [
        {
          title: "TIMELESS ARCHITECTURE",
          desc: "Modern design rooted in elegance and longevity.",
          icon: "◈",
        },
        {
          title: "SPACES DESIGNED FOR LIFE",
          desc: "Expansive layouts that adapt to every moment.",
          icon: "⌂",
        },
        {
          title: "CURATED EXPERIENCE",
          desc: "Every detail carefully chosen for elevated living.",
          icon: "✦",
        },
        {
          title: "PRIVACY BY DESIGN",
          desc: "Low-density planning for unmatched seclusion.",
          icon: "▣",
        },
      ];

  function getDeveloperLogo() {
  // ✅ 1. Direct logo (highest priority)
  if (coreDetails?.developerLogo) {
    return coreDetails.developerLogo;
  }

  // ✅ 2. Populated object
  if (
    coreDetails?.developerRef &&
    typeof coreDetails.developerRef === "object"
  ) {
    return coreDetails.developerRef.logo || "";
  }

  // ✅ 3. Lookup from developers list
  if (coreDetails?.developerRef) {
    const dev = developers.find(
      (d) => d._id === coreDetails.developerRef
    );
    return dev?.logo || "";
  }

  return "";
}


  const floorPlans = gatedContent?.floorPlans || [];
  const [activePlan, setActivePlan] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const developerLogo = getDeveloperLogo(); // ✅ ADD THIS LINE
  const [selectedImage, setSelectedImage] = useState(null);
const [selectedIndex, setSelectedIndex] = useState(0);

const gallery =
  media.gallery?.filter((img) => img && img.trim()) || [];

/* KEYBOARD NAVIGATION */
useEffect(() => {
  const handleKeyDown = (e) => {
    if (selectedImage === null) return;

    if (e.key === "Escape") {
      setSelectedImage(null);
    }

    if (e.key === "ArrowRight") {
      const newIndex =
        selectedIndex === gallery.length - 1
          ? 0
          : selectedIndex + 1;

      setSelectedIndex(newIndex);
      setSelectedImage(gallery[newIndex]);
    }

    if (e.key === "ArrowLeft") {
      const newIndex =
        selectedIndex === 0
          ? gallery.length - 1
          : selectedIndex - 1;

      setSelectedIndex(newIndex);
      setSelectedImage(gallery[newIndex]);
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () =>
    window.removeEventListener("keydown", handleKeyDown);
}, [selectedImage, selectedIndex, gallery]);

  const handleLeadSubmit = async () => {
  if (!leadName.trim() || !leadPhone.trim()) {
    alert("Please fill all fields");
    return;
  }

  try {
    setSubmitting(true);

    const res = await fetch(
      "https://property-bouquet-backend.onrender.com/api/leads",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: leadName,
          phone: leadPhone,
          property: coreDetails?.title || "",
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed ❌");
      return;
    }

    // ✅ CLOSE MODAL
    setShowModal(false);

    // ✅ DOWNLOAD PDF
    window.open(gatedContent.brochurePdfUrl, "_blank");

    // RESET
    setLeadName("");
    setLeadPhone("");

  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  } finally {
    setSubmitting(false);
  }
};

  // ================= FIX: DEVELOPER NAME RESOLVER =================
  const getDeveloperName = () => {
  // ✅ Custom name (highest priority)
  if (coreDetails?.developerName?.trim()) {
    return coreDetails.developerName;
  }

  // ✅ If populated object from backend
  if (
    coreDetails?.developerRef &&
    typeof coreDetails.developerRef === "object"
  ) {
    return coreDetails.developerRef.name || "DEVELOPER";
  }

  // ✅ If only ID (fallback case)
  if (coreDetails?.developerRef) {
    const dev = developers.find(
      (d) => d._id === coreDetails.developerRef
    );

    if (dev) return dev.name;
  }

  return "DEVELOPER";
};

  // ================= CATEGORY NAME RESOLVER =================
const getCategoryName = () => {
  if (form?.categoryData?.customCategory?.trim()) {
    return form.categoryData.customCategory;
  }

  if (form?.categoryData?.categoryName?.trim()) {
    return form.categoryData.categoryName;
  }

  return "CATEGORY";
};


// ================= LOCATION NAME RESOLVER =================
const getLocationName = () => {
  if (locationData?.customLocation?.trim()) {
    return locationData.customLocation;
  }

  if (locationData?.locationName?.includes(">")) {
    const parts = locationData.locationName.split(">").map(p => p.trim());

    // 🔥 SHOW LAST 2 LEVELS ONLY
    if (parts.length >= 2) {
      return `${parts[parts.length - 1]}, ${parts[parts.length - 2]}`;
    }

    return parts[0];
  }

  if (locationData?.locationName) {
    return locationData.locationName;
  }

  return "Location";
};

const categoryName = getCategoryName();
const locationName = getLocationName();

  const developerName = getDeveloperName();

  return (
    <div className="relative overflow-hidden bg-black">

    {/* ================= ULTRA PREMIUM FLOATING NAVBAR ================= */}
    <div className="absolute top-0 left-0 w-full z-50 px-3 md:px-5 lg:px-8 pt-4">

      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[rgba(7,10,10,0.52)] backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.55)]">

        {/* PREMIUM GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,166,75,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(201,166,75,0.12),transparent_30%)]" />

        {/* BORDER SHINE */}
        <div className="absolute inset-0 rounded-[24px] border border-white/5" />

        <div className="relative z-10 h-[68px] lg:h-[74px] px-4 md:px-6 lg:px-8 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            {developerLogo &&
            developerLogo.trim() !== "" ? (
              <img
                src={developerLogo}
                alt={developerName}
                className="h-9 md:h-10 max-w-[150px] object-contain opacity-95"
                onError={(e) =>
                  (e.target.style.display =
                    "none")
                }
              />
            ) : (
              <h2
                className="text-white text-[17px] tracking-[4px]"
                style={{
                  fontFamily:
                    "Georgia, Times New Roman, serif",
                }}
              >
                {developerName}
              </h2>
            )}
          </div>

          {/* CENTER NAV */}
          <div className="hidden xl:flex items-center gap-7 2xl:gap-9">

            {[
              "OVERVIEW",
              "CONFIGURATION",
              "AMENITIES",
              "LOCATION",
              "GALLERY",
              "INVESTMENT",
              "CONTACT",
            ].map((item, index) => (
              <button
                key={index}
                className={`relative text-[10px] tracking-[2.5px] transition-all duration-300 ${
                  index === 0
                    ? "text-[#d8b46b]"
                    : "text-white/65 hover:text-[#d8b46b]"
                }`}
                style={{
                  fontFamily:
                    "Inter, sans-serif",
                }}
              >
                {item}

                {index === 0 && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-6 h-[1px] bg-[#d8b46b]" />
                )}
              </button>
            ))}
          </div>

          {/* RIGHT BUTTON */}
<button
  onClick={() => setShowModal(true)}
  className="
    group
    relative
    overflow-hidden
    h-[36px]
    md:h-[38px]
    px-5
    md:px-6
    rounded-[4px]
    bg-[#c9a64b]
    text-[#111]
    text-[10px]
    tracking-[1.3px]
    font-[600]
    transition-all
    duration-300
    hover:brightness-110
    shadow-[0_8px_24px_rgba(201,166,75,0.22)]
  "
  style={{
    fontFamily: "Inter, sans-serif",
  }}
>
  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-300" />

  <div className="relative flex items-center gap-2">
    <Download size={13} strokeWidth={2.2} />
    DOWNLOAD BROCHURE
  </div>
</button>
        </div>
      </div>
    </div>

    {/* ================= CINEMATIC HERO ================= */}
<motion.div
  initial={{
    scale: 1.05,
    opacity: 0,
  }}
  animate={{
    scale: 1,
    opacity: 1,
  }}
  transition={{
    duration: 1.4,
  }}
  className="
    relative
    min-h-screen
    overflow-hidden
    flex
    items-end
    isolate
  "
  style={{
    backgroundImage: media?.heroImageUrl
      ? `url(${media.heroImageUrl})`
      : "linear-gradient(#000,#111)",
    backgroundSize: "cover",
    backgroundPosition: "center center",
  }}
>

  {/* ================= LUXURY OVERLAYS ================= */}
  <div className="absolute inset-0">

    {/* LEFT DARK */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#020806]/95 via-[#07120f]/70 to-transparent" />

    {/* RIGHT GOLD */}
    <div className="absolute inset-0 bg-gradient-to-l from-[#c89d581f] via-transparent to-transparent" />

    {/* BOTTOM DEPTH */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />

    {/* GOLD LIGHT */}
    <div className="absolute left-[6%] top-[14%] w-[520px] h-[520px] bg-[#c89d58]/10 blur-[140px] rounded-full" />

    {/* EXTRA AMBIENT LIGHT */}
    <div className="absolute right-[10%] bottom-[10%] w-[380px] h-[380px] bg-[#d8b46b]/10 blur-[120px] rounded-full" />
  </div>

  {/* ================= CONTENT ================= */}
  <motion.div
    variants={staggerContainer}
    initial="hidden"
    animate="visible"
    className="relative z-20 w-full px-5 lg:px-10 pb-10 md:pb-14 xl:pb-16 pt-28 md:pt-32"
  >

    <div className="max-w-[1450px] mx-auto w-full">

      <div className="max-w-[860px]">

        {/* LABEL */}
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-3 mb-6"
        >
          <div className="w-10 h-[1px] bg-[#d8b46b]" />

          <p
            className="text-[#d8b46b] text-[11px] tracking-[4px] uppercase font-semibold"
            style={{
              fontFamily:
                "Inter, sans-serif",
            }}
          >
            {heroSection?.propertyStatus ||
              "PRIVATE DIGITAL MANDATE"}
          </p>
        </motion.div>

        {/* TITLE */}
        <motion.h1
          variants={fadeUp}
          className="
            text-white
            font-normal
            leading-[0.92]
            tracking-[-3px]
            text-[44px]
            sm:text-[56px]
            md:text-[72px]
            xl:text-[92px]
            2xl:text-[105px]
            max-w-[950px]
          "
          style={{
            fontFamily:
              "Georgia, Times New Roman, serif",
          }}
        >
          {coreDetails?.title}
        </motion.h1>

        {/* LOCATION */}
        <motion.div
          variants={fadeUp}
          className="mt-7 flex items-center gap-3 text-white/82"
        >

          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center">

            <MapPin
              size={18}
              className="text-[#d8b46b]"
            />
          </div>

          <p
            className="text-[16px] md:text-[24px] font-light tracking-wide"
            style={{
              fontFamily:
                "Inter, sans-serif",
            }}
          >
            {locationName}
          </p>
        </motion.div>

        {/* DIVIDER */}
        <motion.div
          variants={fadeUp}
          className="w-[90px] h-[1px] bg-gradient-to-r from-[#c9a64b] to-transparent mt-8"
        />

        {/* DESCRIPTION */}
        <motion.p
          variants={fadeUp}
          className="
            mt-7
            max-w-[620px]
            text-[15px]
            md:text-[17px]
            leading-[2]
            text-white/72
            font-light
          "
          style={{
            fontFamily:
              "Inter, sans-serif",
          }}
        >
          {heroSection?.heroDescription ||
            "A rare fusion of architectural brilliance and low-density luxury living."}
        </motion.p>

        {/* BUTTONS */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center gap-5 mt-12"
        >

          {/* DOWNLOAD */}
          <button
            onClick={() => setShowModal(true)}
            className="
              group
              relative
              overflow-hidden
              h-[50px]
              px-7
              rounded-[5px]
              bg-[#c9a64b]
              text-[#111]
              text-[11px]
              tracking-[1.5px]
              font-[600]
              transition-all
              duration-300
              hover:brightness-110
              shadow-[0_10px_30px_rgba(201,166,75,0.28)]
            "
            style={{
              fontFamily: "Inter, sans-serif",
            }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-300" />

            <div className="relative flex items-center gap-3">
              <Download size={15} strokeWidth={2.2} />

              {heroSection?.brochureButtonText ||
                "DOWNLOAD BROCHURE"}
            </div>
          </button>

          {/* WATCH VIDEO */}
<a
  href={
    media?.walkthroughUrl?.trim()
      ? media.walkthroughUrl
      : "#"
  }
  target="_blank"
  rel="noopener noreferrer"
  onClick={(e) => {
    if (!media?.walkthroughUrl?.trim()) {
      e.preventDefault();
    }
  }}
  className="group relative flex items-center gap-4 transition-all duration-500"
  style={{
    fontFamily: "Inter, sans-serif",
    opacity: media?.walkthroughUrl?.trim()
      ? 1
      : 0.72,
  }}
>

  {/* OUTER GLOW */}
  <div className="relative">

    {/* GOLD AMBIENT */}
    <div className="absolute inset-0 rounded-full bg-[#c89d58]/30 blur-2xl opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />

    {/* RING GLOW */}
    <div className="absolute inset-0 rounded-full border border-[#d8b46b]/20 scale-[1.18] opacity-0 group-hover:opacity-100 group-hover:scale-[1.28] transition-all duration-700" />

    {/* MAIN BUTTON */}
    <div
      className="
        relative
        w-[58px]
        h-[58px]
        rounded-full
        flex
        items-center
        justify-center
        overflow-hidden
        border
        border-white/15
        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
        backdrop-blur-2xl
        transition-all
        duration-500
        group-hover:scale-105
        group-hover:border-[#d8b46b]/40
      "
      style={{
        background: `
          linear-gradient(
            145deg,
            rgba(255,255,255,0.10),
            rgba(255,255,255,0.03)
          )
        `,
      }}
    >

      {/* INNER GOLD SHINE */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d8b46b]/10 via-transparent to-transparent opacity-60" />

      {/* PLAY ICON */}
      <Play
        size={17}
        fill="currentColor"
        className="
          relative
          z-10
          ml-[2px]
          text-white
          group-hover:text-[#f3d38d]
          transition-all
          duration-500
        "
      />
    </div>
  </div>

  {/* TEXT */}
  <div className="flex flex-col">

    <span
      className="
        text-[11px]
        tracking-[2.8px]
        uppercase
        text-white/78
        group-hover:text-white
        transition-all
        duration-500
      "
    >
      {heroSection?.videoButtonText ||
        "WATCH PROJECT VIDEO"}
    </span>

    <span className="text-[10px] text-[#d8b46b]/70 tracking-[1.5px] mt-[2px]">
      Cinematic Walkthrough
    </span>
  </div>
</a>
        </motion.div>
      </div>

      {/* ================= PREMIUM METRICS ================= */}
      <motion.div
        variants={fadeUp}
        className="mt-14"
      >

        <div
          className="
            relative
            overflow-hidden
            rounded-[22px]
            border
            border-white/12
            backdrop-blur-xl
            shadow-[0_20px_60px_rgba(0,0,0,0.38)]
          "
          style={{
            background:
              `
              linear-gradient(
                90deg,
                rgba(7,20,18,0.82) 0%,
                rgba(8,30,24,0.78) 28%,
                rgba(15,40,30,0.72) 52%,
                rgba(28,45,34,0.66) 72%,
                rgba(42,48,36,0.58) 100%
              )
              `,
          }}
        >

          {/* PREMIUM TINT */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at left center, rgba(0,180,120,0.08), transparent 32%),
                radial-gradient(circle at center, rgba(201,166,75,0.10), transparent 35%),
                radial-gradient(circle at right center, rgba(201,166,75,0.08), transparent 30%)
              `,
            }}
          />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-5">

            {/* ACRES */}
            <div className="py-4 lg:py-5 px-4 text-center border-r border-white/10">

              <div className="flex justify-center mb-2">
                <LayoutGrid
                  size={18}
                  className="text-[#d8b46b]"
                />
              </div>

              <p
                className="text-[22px] md:text-[28px] leading-none text-white font-light"
                style={{
                  fontFamily:
                    "Georgia, Times New Roman, serif",
                }}
              >
                {keyMetrics?.landArea || "1.83"}
              </p>

              <p
                className="mt-1 text-white/55 text-[10px] tracking-[2px] uppercase"
                style={{
                  fontFamily:
                    "Inter, sans-serif",
                }}
              >
                Acres
              </p>
            </div>

            {/* TOWERS */}
            <div className="py-4 lg:py-5 px-4 text-center border-r border-white/10">

              <div className="flex justify-center mb-2">
                <Building2
                  size={18}
                  className="text-[#d8b46b]"
                />
              </div>

              <p
                className="text-[22px] md:text-[28px] leading-none text-white font-light"
                style={{
                  fontFamily:
                    "Georgia, Times New Roman, serif",
                }}
              >
                {keyMetrics?.totalTowers || "2"}
              </p>

              <p
                className="mt-1 text-white/55 text-[10px] tracking-[2px] uppercase"
                style={{
                  fontFamily:
                    "Inter, sans-serif",
                }}
              >
                Towers
              </p>
            </div>

            {/* UNITS */}
            <div className="py-4 lg:py-5 px-4 text-center border-r border-white/10">

              <div className="flex justify-center mb-2">
                <Users
                  size={18}
                  className="text-[#d8b46b]"
                />
              </div>

              <p
                className="text-[22px] md:text-[28px] leading-none text-white font-light"
                style={{
                  fontFamily:
                    "Georgia, Times New Roman, serif",
                }}
              >
                {keyMetrics?.totalUnits || "95"}
              </p>

              <p
                className="mt-1 text-white/55 text-[10px] tracking-[2px] uppercase"
                style={{
                  fontFamily:
                    "Inter, sans-serif",
                }}
              >
                Units
              </p>
            </div>

            {/* POSSESSION */}
            <div className="py-4 lg:py-5 px-4 text-center border-r border-white/10">

              <div className="flex justify-center mb-2">
                <CalendarDays
                  size={18}
                  className="text-[#d8b46b]"
                />
              </div>

              <p
                className="text-white/60 text-[10px] tracking-[1.5px] uppercase mb-2"
                style={{
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Possession
              </p>

              <p
                className="text-[20px] md:text-[28px] leading-none text-white font-[400]"
                style={{
                  fontFamily:
                    "Georgia, Times New Roman, serif",
                }}
              >
                {keyMetrics?.possession || "May 2030"}
              </p>
            </div>

            {/* PRICE */}
            <div className="py-4 lg:py-5 px-4 text-center">

              <div className="flex justify-center mb-2">
                <IndianRupee
                  size={18}
                  className="text-[#d8b46b]"
                />
              </div>

              <p
                className="text-white/60 text-[10px] tracking-[1.5px] uppercase mb-2"
                style={{
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Starts At
              </p>

              <p
                className="text-[24px] md:text-[34px] leading-none text-[#dfbc67] font-[400]"
                style={{
                  fontFamily:
                    "Georgia, Times New Roman, serif",
                }}
              >
                ₹ {formatPrice(coreDetails?.startingPrice)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================= TAGLINE ================= */}
<motion.div
  variants={fadeUp}
  className="flex flex-wrap items-center justify-center gap-4 mt-8 text-[#d8b46b]/90 text-[10px] tracking-[4px] uppercase text-center"
  style={{
    fontFamily: "Inter, sans-serif",
  }}
>

  <div className="w-16 h-[1px] bg-[#c9a64b]/40" />

  {(
    heroSection?.taglineItems?.filter(
      item => item?.trim() !== ""
    )?.length > 0
      ? heroSection.taglineItems.filter(
          item => item?.trim() !== ""
        )
      : [
          "Ultra-Luxury Residences",
          "Low-Density Living",
          "Exclusive Community",
        ]
  ).map((item, index, arr) => (
    <React.Fragment key={index}>
      <span>{item}</span>

      {index !== arr.length - 1 && (
        <span>|</span>
      )}
    </React.Fragment>
  ))}

  <div className="w-16 h-[1px] bg-[#c9a64b]/40" />
</motion.div>
    </div>
  </motion.div>
</motion.div>

{/* ================= REFINED ULTRA PREMIUM ABOUT SECTION ================= */}
<motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.15 }}
  variants={fadeUp}
  className="relative bg-[#f7f3ec] py-14 md:py-20 overflow-hidden"
>
  {/* SOFT AMBIENT GLOW */}
  <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-[#c9a64b]/8 blur-[120px] rounded-full" />

  <div className="relative z-10 max-w-[1320px] mx-auto px-4 lg:px-6">

    {/* ================= MAIN GRID ================= */}
    <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 xl:gap-10 items-start">

      {/* ================= LEFT IMAGE ================= */}
      <div className="relative">

        {/* THIN GOLD FRAME */}
        <div className="absolute inset-0 border border-[#d7bc88] rounded-[18px] translate-x-3 translate-y-3" />

        {/* IMAGE WRAPPER */}
        <motion.div
          whileHover={{
            scale: 1.01,
          }}
          transition={{
            duration: 0.45,
          }}
          className="relative overflow-hidden rounded-[14px]"
        >
          <img
            src={
              overview?.aboutImageUrl ||
              "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
            }
            alt="About"
            className="
              w-full
              h-[340px]
              md:h-[500px]
              object-cover
            "
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5" />
        </motion.div>
      </div>

      {/* ================= RIGHT CONTENT ================= */}
      <div className="pt-2 lg:pt-6">

        {/* ================= TOP LABEL ================= */}
        <div className="flex items-center gap-3 mb-4">

          {/* SECTION NUMBER */}
          <p
            className="text-[#b89149] text-[11px] tracking-[2.5px] uppercase font-semibold"
            style={{
              fontFamily: "Inter, sans-serif",
            }}
          >
            {aboutSectionNumber}
          </p>

          <div className="w-8 h-[1px] bg-[#c9a64b]" />

          {/* SECTION LABEL */}
          <p
            className="text-[#233c31] text-[11px] tracking-[2.5px] uppercase"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
            }}
          >
            {aboutSectionLabel}
          </p>
        </div>

        {/* ================= TITLE ================= */}
        <h2
          className="
            text-[#183126]
            text-[38px]
            md:text-[62px]
            leading-[0.98]
            tracking-[-2.5px]
            max-w-[620px]
          "
          style={{
            fontFamily: "Georgia, Times New Roman, serif",
            fontWeight: 400,
          }}
        >
          {aboutHeadingLine1}

          <br />

          {aboutHeadingLine2}
        </h2>

        {/* ================= GOLD DIVIDER ================= */}
        <div className="flex items-center gap-3 mt-6 mb-7">

          <div className="w-14 h-[1px] bg-[#c9a64b]" />

          <div className="w-[5px] h-[5px] rotate-45 border border-[#c9a64b]" />
        </div>

        {/* ================= DESCRIPTION ================= */}
        <div
          className="
            text-[#505050]
            text-[14px]
            md:text-[15px]
            leading-[2]
            font-[350]
            space-y-5
            max-w-[560px]
          "
          style={{
            fontFamily: "Inter, sans-serif",
          }}
        >

          {/* PARAGRAPH 1 */}
          <p>
            {overview?.description ||
              "Eldeco Camelot is envisioned for those who value space, privacy and refined living. Every element of this address reflects thoughtful planning, timeless design and an uncompromising commitment to quality."}
          </p>

          {/* PARAGRAPH 2 */}
          <p>
            {aboutParagraph2}
          </p>
        </div>
      </div>
    </div>

    {/* ================= FULL WIDTH FEATURE BAR ================= */}
    <div
      className="
        relative
        mt-10
        rounded-[12px]
        overflow-hidden
        border
        border-[#123126]
        shadow-[0_25px_45px_rgba(0,0,0,0.10)]
      "
      style={{
        background:
          "linear-gradient(90deg,#03261d 0%,#073328 50%,#05251d 100%)",
      }}
    >

      {/* SUBTLE GLOW */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at left, rgba(201,166,75,0.10), transparent 25%), radial-gradient(circle at right, rgba(201,166,75,0.08), transparent 25%)",
        }}
      />

      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4">

        {featureBar
          .slice(0, 4)
          .map((item, index) => (
            <div
              key={index}
              className="
                relative
                px-5
                py-7
                md:py-8
                text-center
                border-r
                last:border-r-0
                border-white/10
              "
            >

              {/* ICON */}
              <div className="flex justify-center mb-4">

                <div
                  className="
                    w-11
                    h-11
                    rounded-full
                    border
                    border-[#c9a64b]/35
                    flex
                    items-center
                    justify-center
                    text-[#d8b46b]
                    text-[18px]
                  "
                >
                  {item?.icon || "✦"}
                </div>
              </div>

              {/* TITLE */}
              <h3
                className="
                  text-[#d7b367]
                  text-[10px]
                  md:text-[11px]
                  leading-[1.7]
                  tracking-[1.4px]
                  uppercase
                  mb-2
                "
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                }}
              >
                {item?.title}
              </h3>

              {/* DESC */}
              <p
                className="
                  text-white/60
                  text-[10px]
                  md:text-[11px]
                  leading-[1.8]
                  max-w-[180px]
                  mx-auto
                "
                style={{
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {item?.desc}
              </p>
            </div>
          ))}
      </div>
    </div>
  </div>
</motion.section>


{/* ================= PROPERTY HIGHLIGHTS SECTION ================= */}
<motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.15 }}
  variants={fadeUp}
  className="relative bg-[#f8f5ef] pb-16 md:pb-24 overflow-hidden"
>

  {/* AMBIENT GLOW */}
  <div className="absolute right-[-120px] top-[120px] w-[320px] h-[320px] bg-[#c9a64b]/10 blur-[120px] rounded-full" />

  <div className="relative z-10 max-w-[1320px] mx-auto px-4 lg:px-6">

    {/* ================= SECTION HEADER ================= */}
    <div className="text-center mb-14">

      <div className="flex items-center justify-center gap-3 mb-4">

        <p
          className="text-[#b89149] text-[11px] tracking-[2.5px] uppercase font-semibold"
          style={{
            fontFamily: "Inter, sans-serif",
          }}
        >
          03
        </p>

        <div className="w-10 h-[1px] bg-[#c9a64b]" />

        <p
          className="text-[#233c31] text-[11px] tracking-[2.5px] uppercase"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
          }}
        >
          Property Highlights
        </p>
      </div>

      <h2
        className="
          text-[#183126]
          text-[36px]
          md:text-[62px]
          leading-[1]
          tracking-[-2px]
        "
        style={{
          fontFamily: "Georgia, Times New Roman, serif",
          fontWeight: 400,
        }}
      >
        {overview?.highlightsHeading ||
          "Crafted for Elevated"}
        <br />
        {overview?.highlightsSubheading ||
          "Modern Living"}
      </h2>

      <div className="flex items-center justify-center gap-3 mt-6">

        <div className="w-14 h-[1px] bg-[#c9a64b]" />

        <div className="w-[5px] h-[5px] rotate-45 border border-[#c9a64b]" />
      </div>
    </div>

    {/* ================= HIGHLIGHTS GRID ================= */}
<div
  className={`
    grid
    gap-5
    ${
      (overview?.highlights?.length || 0) <= 2
        ? "md:grid-cols-2"
        : (overview?.highlights?.length || 0) <= 4
        ? "md:grid-cols-2 xl:grid-cols-4"
        : "md:grid-cols-2 xl:grid-cols-4"
    }
  `}
>

  {(
    overview?.highlights?.some(
      (item) => item?.heading || item?.subheading
    )
      ? overview.highlights
      : [
          {
            heading: "A Landmark in Dwarka",
            subheading:
              "An iconic address in one of Delhi’s most prestigious and fastest-growing neighbourhoods.",
            icon: "▥",
          },
          {
            heading: "Crafted for Generations",
            subheading:
              "Built with the finest materials and global standards to stand the test of time.",
            icon: "⌘",
          },
          {
            heading: "An Elevated Lifestyle",
            subheading:
              "World-class amenities curated for wellness, comfort and celebration.",
            icon: "✿",
          },
          {
            heading: "A Smart Investment",
            subheading:
              "A rare combination of luxury living and strong long-term value appreciation.",
            icon: "↗",
          },

          /* ================= EXTRA STATIC FALLBACK CARDS ================= */

          {
            heading: "Private Low-Density Living",
            subheading:
              "Exclusively planned residences offering privacy, peace and expansive open spaces.",
            icon: "◈",
          },
          {
            heading: "World-Class Amenities",
            subheading:
              "Curated wellness, leisure and lifestyle experiences designed for refined living.",
            icon: "✦",
          },
          {
            heading: "Prime Urban Connectivity",
            subheading:
              "Seamless access to business districts, airports and premium social infrastructure.",
            icon: "⌂",
          },
          {
            heading: "Legacy Address",
            subheading:
              "A timeless destination crafted to elevate status, comfort and future value.",
            icon: "▣",
          },
        ]
  )
    .slice(0, 8)
    .map((item, index) => (
      <motion.div
        key={index}
        whileHover={{
          y: -6,
        }}
        transition={{
          duration: 0.35,
        }}
        className="
          relative
          overflow-hidden
          rounded-[16px]
          border
          border-[#dfd3c0]
          bg-[#fbf8f2]
          px-6
          py-7
          shadow-[0_12px_30px_rgba(0,0,0,0.05)]
        "
      >

        {/* GOLD GLOW */}
        <div className="absolute top-[-40px] right-[-40px] w-[120px] h-[120px] bg-[#c9a64b]/10 blur-[50px] rounded-full" />

        {/* NUMBER */}
        <p
          className="
            relative
            z-10
            text-[#bc924c]
            text-[11px]
            tracking-[2px]
            uppercase
            mb-4
          "
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </p>

        {/* ICON */}
        <div
          className="
            absolute
            right-5
            top-5
            text-[#d6bc88]/35
            text-[52px]
            leading-none
          "
          style={{
            fontFamily: "Georgia, serif",
          }}
        >
          {item.icon || "✦"}
        </div>

        {/* TITLE */}
        <h3
          className="
            relative
            z-10
            text-[#21392f]
            text-[24px]
            leading-[1.15]
            mb-4
            max-w-[240px]
          "
          style={{
            fontFamily: "Georgia, Times New Roman, serif",
            fontWeight: 400,
          }}
        >
          {item.heading || item.name}
        </h3>

        {/* DESCRIPTION */}
        <p
          className="
            relative
            z-10
            text-[#5c5c5c]
            text-[13px]
            leading-[1.9]
          "
          style={{
            fontFamily: "Inter, sans-serif",
          }}
        >
          {item.subheading || item.desc}
        </p>

        {/* BOTTOM GOLD LINE */}
        <div className="relative z-10 w-10 h-[1px] bg-[#c9a64b] mt-6" />
      </motion.div>
    ))}
</div>

    {/* ================= QUOTE SECTION ================= */}
    <div
      className="
        mt-12
        rounded-[12px]
        bg-[#efe9de]
        border
        border-[#e0d3be]
        px-6
        md:px-10
        py-8
        md:py-10
        relative
        overflow-hidden
      "
    >

      {/* LEFT QUOTE */}
      <div
        className="
          absolute
          left-6
          top-5
          text-[#c9a64b]/40
          text-[70px]
          leading-none
        "
        style={{
          fontFamily: "Georgia, serif",
        }}
      >
        “
      </div>

      {/* RIGHT QUOTE */}
      <div
        className="
          absolute
          right-6
          bottom-0
          text-[#c9a64b]/40
          text-[70px]
          leading-none
        "
        style={{
          fontFamily: "Georgia, serif",
        }}
      >
        ”
      </div>

      <p
        className="
          text-[#4d4d4d]
          italic
          text-[22px]
          md:text-[34px]
          leading-[1.5]
          text-center
          max-w-[900px]
          mx-auto
        "
        style={{
          fontFamily: "Georgia, Times New Roman, serif",
          fontWeight: 400,
        }}
      >
        {overview?.highlightQuote ||
          `At ${coreDetails.title}, every detail is designed not just for today, but for a lifetime of unparalleled living.`}
      </p>

      <div className="w-24 h-[1px] bg-[#c9a64b] mx-auto mt-6" />
    </div>
  </div>
</motion.section>

{/* ================= ULTRA PREMIUM HIGHLIGHTS SECTION ================= */}
<motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.15 }}
  variants={staggerContainer}
  className="
    relative
    overflow-hidden
    py-16
    md:py-24
    bg-[#031611]
  "
>
  {/* ================= CINEMATIC BACKGROUND ================= */}
  <div className="absolute inset-0">

    {/* MAIN GRADIENT */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at top, rgba(7,51,40,0.55) 0%, rgba(2,22,17,1) 55%, rgba(0,0,0,1) 100%)",
      }}
    />

    {/* GOLD GLOW */}
    <div className="absolute top-[10%] left-[15%] w-[420px] h-[420px] bg-[#c9a64b]/10 blur-[140px] rounded-full" />

    {/* RIGHT GLOW */}
    <div className="absolute bottom-[5%] right-[10%] w-[350px] h-[350px] bg-[#0d4b3c]/25 blur-[120px] rounded-full" />

    {/* SUBTLE GRID */}
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
        backgroundSize: "70px 70px",
      }}
    />
  </div>

  <div className="relative z-10 max-w-[1380px] mx-auto px-5 lg:px-8">

    {/* ================= TOP LABEL ================= */}
    <motion.div
      variants={fadeUp}
      className="flex items-center justify-center gap-3 mb-4"
    >
      <p
        className="text-[#c9a64b] text-[11px] tracking-[3px] uppercase"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
        }}
      >
        04
      </p>

      <div className="w-8 h-[1px] bg-[#c9a64b]" />

      <p
        className="text-white/70 text-[11px] tracking-[3px] uppercase"
        style={{
          fontFamily: "Inter, sans-serif",
        }}
      >
        Project Highlights
      </p>
    </motion.div>

    {/* ================= HEADING ================= */}
    <motion.h2
      variants={fadeUp}
      className="
        text-center
        text-white
        leading-[1.05]
        tracking-[-2px]
        text-[38px]
        md:text-[72px]
        max-w-[1200px]
        mx-auto
      "
      style={{
        fontFamily: "Georgia, Times New Roman, serif",
        fontWeight: 400,
      }}
    >
      Every Detail.
      <span className="text-[#d7b367]">
        {" "}
        Elevated{" "}
      </span>
      Beyond Expectation.
    </motion.h2>

    {/* GOLD DIVIDER */}
    <motion.div
      variants={fadeUp}
      className="flex items-center justify-center gap-3 mt-6"
    >
      <div className="w-16 h-[1px] bg-[#c9a64b]" />

      <div className="w-[6px] h-[6px] rotate-45 border border-[#c9a64b]" />

      <div className="w-16 h-[1px] bg-[#c9a64b]" />
    </motion.div>

    {/* SUBTEXT */}
    <motion.p
      variants={fadeUp}
      className="
        mt-6
        text-center
        text-white/72
        text-[14px]
        md:text-[18px]
        leading-[1.9]
        max-w-[850px]
        mx-auto
      "
      style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 300,
      }}
    >
      Eldeco Camelot is a seamless blend of thoughtful design,
      cutting-edge technology and world-class amenities curated
      for an extraordinary lifestyle.
    </motion.p>

    {/* ================= PREMIUM GRID ================= */}
    {Array.isArray(overview.highlights) &&
      overview.highlights.filter(Boolean).length > 0 && (

        <motion.div
          variants={fadeUp}
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-5
            mt-14
          "
        >
          {overview.highlights
            .filter((h) => h)
            .slice(0, 8)
            .map((h, i) => {

              const amenityName =
                typeof h === "string"
                  ? h
                  : h?.name || "Amenity";

              const iconKey =
                typeof h === "string"
                  ? "Home"
                  : h?.icon || "Home";

              const IconComponent =
                CUSTOM_ICONS.find(
                  (item) => item.name === iconKey
                )?.icon || Home;

              return (
                <motion.div
                  key={i}
                  whileHover={{
                    y: -6,
                    scale: 1.01,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="
                    relative
                    overflow-hidden
                    rounded-[14px]
                    border
                    border-[#8f6a2c]/45
                    bg-[rgba(4,31,24,0.72)]
                    backdrop-blur-xl
                    px-7
                    py-9
                    text-center
                    shadow-[0_15px_40px_rgba(0,0,0,0.28)]
                  "
                >

                  {/* CARD GLOW */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,166,75,0.12),transparent_60%)] opacity-70" />

                  {/* ICON */}
                  <div className="relative flex justify-center mb-5">

                    <div
                      className="
                        w-[72px]
                        h-[72px]
                        rounded-full
                        border
                        border-[#c9a64b]/30
                        bg-[#08271f]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <IconComponent
                        size={34}
                        className="text-[#d7b367]"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  {/* TITLE */}
                  <h3
                    className="
                      relative
                      text-white
                      text-[15px]
                      md:text-[16px]
                      uppercase
                      tracking-[1.3px]
                      leading-[1.6]
                    "
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {amenityName}
                  </h3>

                  {/* GOLD LINE */}
                  <div className="relative w-10 h-[1px] bg-[#c9a64b] mx-auto my-4" />

                  {/* DESCRIPTION */}
                  <p
                    className="
                      relative
                      text-white/65
                      text-[13px]
                      leading-[2]
                    "
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    Luxury-crafted spaces designed for elevated
                    comfort, timeless sophistication and effortless
                    modern living.
                  </p>
                </motion.div>
              );
            })}
        </motion.div>
      )}

    {/* ================= BOTTOM STRIP ================= */}
    <motion.div
      variants={fadeUp}
      className="
        mt-10
        rounded-[14px]
        overflow-hidden
        border
        border-[#8f6a2c]/40
        bg-[rgba(5,30,24,0.75)]
        backdrop-blur-2xl
        shadow-[0_20px_45px_rgba(0,0,0,0.20)]
      "
    >
      <div className="grid md:grid-cols-4">

        {/* LEFT BIG TEXT */}
        <div
          className="
            flex
            items-center
            gap-5
            px-7
            py-7
            border-r
            border-white/10
            md:col-span-1
          "
        >
          <div className="text-[#d7b367] text-[42px]">
            ✺
          </div>

          <div>
            <p
              className="
                text-[#d7b367]
                text-[16px]
                leading-[1.5]
              "
              style={{
                fontFamily:
                  "Georgia, Times New Roman, serif",
                fontWeight: 400,
              }}
            >
              Thoughtfully by Design.
            </p>

            <p
              className="
                text-white
                text-[16px]
                leading-[1.5]
              "
              style={{
                fontFamily:
                  "Georgia, Times New Roman, serif",
                fontWeight: 400,
              }}
            >
              Crafted for the Exceptional.
            </p>
          </div>
        </div>

        {/* RIGHT FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:col-span-3">

          {[
            "Premium Specifications",
            "Finest Quality Materials",
            "Curated for Discerning Families",
          ].map((item, index) => (
            <div
              key={index}
              className="
                flex
                items-center
                justify-center
                gap-3
                px-5
                py-6
                border-r
                last:border-r-0
                border-white/10
              "
            >
              <div className="text-[#d7b367] text-[24px]">
                ✦
              </div>

              <p
                className="
                  text-white/85
                  text-[13px]
                  tracking-[0.4px]
                "
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
</motion.section>

      {/* ================= ULTRA PREMIUM CONFIGURATION SECTION ================= */}
{unitConfigurations.length > 0 && (
  <motion.section
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
    variants={staggerContainer}
    className="
      relative
      py-16
      md:py-24
      bg-[#f7f3ec]
      overflow-hidden
    "
  >

    {/* SOFT GLOW */}
    <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-[#c9a64b]/10 blur-[130px] rounded-full" />

    <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-6">

      {/* ================= SECTION LABEL ================= */}
      <motion.div
        variants={fadeUp}
        className="flex items-center justify-center gap-3 mb-4"
      >
        <p
          className="text-[#b89149] text-[11px] tracking-[3px] uppercase"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
          }}
        >
          05
        </p>

        <div className="w-8 h-[1px] bg-[#c9a64b]" />

        <p
          className="text-[#2d4137] text-[11px] tracking-[3px] uppercase"
          style={{
            fontFamily: "Inter, sans-serif",
          }}
        >
          Residence Configurations
        </p>
      </motion.div>

      {/* ================= TITLE ================= */}
      <motion.h2
        variants={fadeUp}
        className="
          text-center
          text-[#183126]
          text-[38px]
          md:text-[72px]
          leading-[1]
          tracking-[-2px]
          max-w-[1100px]
          mx-auto
        "
        style={{
          fontFamily: "Georgia, Times New Roman, serif",
          fontWeight: 400,
        }}
      >
        Residences Tailored to Your Lifestyle
      </motion.h2>

      {/* GOLD DIVIDER */}
      <motion.div
        variants={fadeUp}
        className="flex items-center justify-center gap-3 mt-6"
      >
        <div className="w-14 h-[1px] bg-[#c9a64b]" />

        <div className="w-[5px] h-[5px] rotate-45 border border-[#c9a64b]" />

        <div className="w-14 h-[1px] bg-[#c9a64b]" />
      </motion.div>

      {/* SUBTEXT */}
      <motion.p
        variants={fadeUp}
        className="
          mt-6
          text-center
          text-[#5d5d5d]
          text-[14px]
          md:text-[18px]
          leading-[1.9]
          max-w-[780px]
          mx-auto
        "
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 300,
        }}
      >
        Thoughtfully designed layouts that redefine space,
        privacy and luxury. Choose the perfect home that
        complements your life today and tomorrow.
      </motion.p>

      {/* ================= MAIN PREMIUM CARD ================= */}
      <motion.div
        variants={fadeUp}
        className="
          mt-14
          bg-[#f9f7f3]
          border
          border-[#e4dac8]
          rounded-[22px]
          shadow-[0_20px_60px_rgba(0,0,0,0.08)]
          overflow-hidden
        "
      >

        <div className="grid lg:grid-cols-[280px_1fr]">

          {/* ================= LEFT CONFIG TABS ================= */}
          <div className="border-r border-[#e6dccb] bg-[#f5f0e7]">

            {unitConfigurations.map((u, i) => (
              <button
                key={i}
                onClick={() => setActivePlan(i)}
                className={`
                  group
                  relative
                  w-full
                  text-left
                  px-7
                  py-6
                  border-b
                  border-[#e6dccb]
                  transition-all
                  duration-300
                  ${
                    activePlan === i
                      ? "bg-[#03261d] text-white"
                      : "hover:bg-[#f1eadf]"
                  }
                `}
              >

                {/* ACTIVE GOLD BAR */}
                {activePlan === i && (
                  <div className="absolute left-0 top-0 h-full w-[3px] bg-[#c9a64b]" />
                )}

                <div className="flex items-center justify-between">

                  <div>

                    {/* TITLE */}
                    <h3
                      className={`
                        text-[22px]
                        leading-none
                        mb-2
                        ${
                          activePlan === i
                            ? "text-white"
                            : "text-[#1e352b]"
                        }
                      `}
                      style={{
                        fontFamily:
                          "Georgia, Times New Roman, serif",
                        fontWeight: 400,
                      }}
                    >
                      {u.unitType}
                    </h3>

                    {/* SUBTEXT */}
                    <p
                      className={`
                        text-[13px]
                        ${
                          activePlan === i
                            ? "text-[#d7b367]"
                            : "text-[#666]"
                        }
                      `}
                      style={{
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Luxury Residences
                    </p>
                  </div>

                  {/* ARROW */}
                  <div
                    className={`
                      text-[20px]
                      transition-all
                      duration-300
                      ${
                        activePlan === i
                          ? "text-[#d7b367] translate-x-1"
                          : "text-[#b89149]"
                      }
                    `}
                  >
                    →
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ================= RIGHT CONTENT ================= */}
          <div className="p-7 lg:p-8">

            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">

              {/* ================= LEFT DETAILS ================= */}
              <div>

                {/* TITLE */}
                <h3
                  className="
                    text-[#1b3127]
                    text-[42px]
                    leading-none
                  "
                  style={{
                    fontFamily:
                      "Georgia, Times New Roman, serif",
                    fontWeight: 400,
                  }}
                >
                  {unitConfigurations[activePlan]?.unitType}
                </h3>

                {/* SUBTEXT */}
                <p
                  className="
                    mt-3
                    text-[#b89149]
                    text-[18px]
                  "
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  Luxury Residences
                </p>

                {/* GOLD LINE */}
                <div className="w-14 h-[1px] bg-[#c9a64b] mt-7 mb-7" />

                {/* ================= METRICS ================= */}
                <div className="grid grid-cols-4 gap-4">

                  {[
                    {
                      label: "Super Area",
                      value:
                        unitConfigurations[activePlan]?.area ||
                        "2450",
                      icon: "◫",
                    },
                    {
                      label: "Bedrooms",
                      value:
                        unitConfigurations[activePlan]
                          ?.bedrooms || "3",
                      icon: "⌂",
                    },
                    {
                      label: "Bathrooms",
                      value:
                        unitConfigurations[activePlan]
                          ?.bathrooms || "3",
                      icon: "◉",
                    },
                    {
                      label: "Balconies",
                      value:
                        unitConfigurations[activePlan]
                          ?.balconies || "2",
                      icon: "▤",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="
                        border-r
                        last:border-r-0
                        border-[#e2d6c2]
                        pr-2
                      "
                    >

                      {/* ICON */}
                      <div className="text-[#c9a64b] text-[20px] mb-2">
                        {item.icon}
                      </div>

                      {/* VALUE */}
                      <p
                        className="
                          text-[#1f352c]
                          text-[18px]
                          leading-none
                        "
                        style={{
                          fontFamily:
                            "Georgia, Times New Roman, serif",
                          fontWeight: 400,
                        }}
                      >
                        {item.value}
                      </p>

                      {/* LABEL */}
                      <p
                        className="
                          mt-2
                          text-[#6a6a6a]
                          text-[11px]
                          leading-[1.7]
                        "
                        style={{
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ================= FEATURES ================= */}
                <div className="mt-10 space-y-4">

                  {[
                    "Spacious living & dining area",
                    "Wide balconies for natural light & ventilation",
                    "Master suite with walk-in wardrobe",
                    "Dedicated utility area",
                    "2–3 car parking",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >

                      <div className="mt-[5px] text-[#c9a64b]">
                        ⊚
                      </div>

                      <p
                        className="
                          text-[#4f4f4f]
                          text-[14px]
                          leading-[1.9]
                        "
                        style={{
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                {/* BUTTON */}
                <button
                  className="
                    mt-10
                    h-[52px]
                    px-8
                    rounded-[8px]
                    bg-[#03261d]
                    hover:bg-[#0a3328]
                    transition-all
                    duration-300
                    text-white
                    flex
                    items-center
                    gap-3
                    shadow-[0_10px_30px_rgba(3,38,29,0.18)]
                  "
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                  }}
                >
                  View Details

                  <span className="text-[#d7b367] text-[18px]">
                    →
                  </span>
                </button>
              </div>

              {/* ================= FLOOR PLAN IMAGE ================= */}
              <div className="relative">

                <div
                  className="
                    relative
                    rounded-[18px]
                    border
                    border-[#e3d7c5]
                    bg-[#f6f2eb]
                    p-5
                    shadow-[0_12px_35px_rgba(0,0,0,0.06)]
                  "
                >

                  {/* IMAGE */}
                  {floorPlans.filter((fp) => fp.image).length > 0 && (
                    <img
                      src={floorPlans[activePlan]?.image}
                      alt="floor-plan"
                      className="
                        w-full
                        h-[320px]
                        md:h-[500px]
                        object-contain
                      "
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </motion.section>
)}

{/* ================= PREMIUM GALLERY SECTION ================= */}
{media.gallery?.filter(Boolean).length > 0 && (
  <>
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={staggerContainer}
      className="relative bg-[#f7f3ee] py-24 overflow-hidden"
    >

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #17342d 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-[1500px] mx-auto px-5">

        {/* ================= HEADING ================= */}
        <motion.div
          variants={fadeUp}
          className="text-center mb-16"
        >
          <p className="uppercase tracking-[4px] text-[#b58b47] text-sm font-medium mb-4">
            06 | GALLERY
          </p>

          <h2
            className="text-4xl md:text-6xl font-light text-[#17342d] leading-tight"
            style={{
              fontFamily: "Cormorant Garamond, serif",
            }}
          >
            A Glimpse Into
            <span className="text-[#b58b47]">
              {" "}Elevated Living.
            </span>
          </h2>

          <div className="w-24 h-[1px] bg-[#c8a66a] mx-auto mt-5 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#c8a66a]" />
          </div>

          <p className="max-w-3xl mx-auto mt-7 text-[#6b6b6b] text-base md:text-lg leading-relaxed">
            Discover elegant architecture, luxurious interiors, lush landscapes,
            and thoughtfully curated experiences designed for a timeless lifestyle.
          </p>
        </motion.div>

        {/* ================= GALLERY WRAPPER ================= */}
        <div className="relative rounded-[40px] border border-[#e6d7c3] bg-white/80 backdrop-blur-xl p-5 md:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.10)] overflow-hidden">

          {/* SOFT GLOW */}
          <div className="absolute -top-32 -left-20 w-72 h-72 bg-[#d4b071]/10 blur-3xl rounded-full" />

          <div className="relative z-10">

            {/* TOP BAR */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

              <div>
                <p className="uppercase tracking-[4px] text-[#b58b47] text-xs font-semibold mb-3">
                  Premium Lifestyle Showcase
                </p>

                <h3
                  className="text-3xl md:text-5xl text-[#17342d] font-light"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                  }}
                >
                  Curated Spaces & Experiences
                </h3>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() => {
                  setSelectedImage(
                    media.gallery.filter(Boolean)[0]
                  );
                  setSelectedIndex(0);
                }}
                className="group bg-gradient-to-r from-[#08211c] to-[#0f3a30] border border-[#d4b071] text-[#e0bd7d] px-8 py-4 rounded-2xl flex items-center gap-4 uppercase tracking-[2px] text-sm font-semibold shadow-lg hover:shadow-[0_0_35px_rgba(212,176,113,0.25)] transition-all duration-500"
              >

                <div className="w-11 h-11 rounded-full border border-[#d4b071] flex items-center justify-center group-hover:rotate-12 transition duration-500">
                  ✦
                </div>

                Open Full Gallery

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 group-hover:translate-x-1 transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </motion.button>
            </div>

{/* ================= PREMIUM MASONRY GRID ================= */}
<div className="grid grid-cols-12 gap-5 auto-rows-[220px] md:auto-rows-[260px]">

  {gallery.map((img, i) => {

    /* PREMIUM BALANCED LAYOUT */
    let spanClass =
      "col-span-12 sm:col-span-6 lg:col-span-3 row-span-1";

    if (i % 7 === 0)
      spanClass =
        "col-span-12 lg:col-span-6 row-span-2";

    else if (i % 5 === 0)
      spanClass =
        "col-span-12 sm:col-span-6 lg:col-span-3 row-span-2";

    return (
      <motion.div
        key={i}
        variants={fadeUp}
        whileHover={{
          y: -8,
        }}
        transition={{
          duration: 0.4,
        }}
        onClick={() => {
          setSelectedImage(img);
          setSelectedIndex(i);
        }}
        className={`group relative overflow-hidden cursor-pointer rounded-[34px]
        bg-white
        border border-[#ebe1d4]
        shadow-[0_18px_45px_rgba(0,0,0,0.08)]
        hover:shadow-[0_30px_80px_rgba(0,0,0,0.16)]
        transition-all duration-500
        ${spanClass}`}
      >

        {/* IMAGE */}
        <img
          src={img}
          alt=""
          className="w-full h-full object-cover transition duration-[1200ms] ease-out group-hover:scale-110"
        />

        {/* SOFT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

        {/* LUXURY SHINE */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-1000 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)] translate-x-[-120%] group-hover:translate-x-[120%]" />

        {/* VIEW ICON */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">

          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H9m0 0l3-3m-3 3l3 3"
              />
            </svg>

          </div>
        </div>

      </motion.div>
    );
  })}
</div>
          </div>
        </div>
      </div>
    </motion.section>

    {/* ================= FULLSCREEN GALLERY ================= */}
<AnimatePresence>
  {selectedImage && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center"
    >

      {/* CLOSE */}
      <button
        onClick={() => setSelectedImage(null)}
        className="absolute top-6 right-6 z-50 w-14 h-14 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center backdrop-blur-xl hover:bg-white/20 transition"
      >
        ✕
      </button>

      {/* LEFT */}
      <button
        onClick={() => {
          const newIndex =
            selectedIndex === 0
              ? gallery.length - 1
              : selectedIndex - 1;

          setSelectedIndex(newIndex);
          setSelectedImage(gallery[newIndex]);
        }}
        className="absolute left-5 md:left-10 z-50 w-14 h-14 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center backdrop-blur-xl hover:bg-white/20 transition"
      >
        ←
      </button>

      {/* IMAGE */}
      <motion.img
        key={selectedImage}
        initial={{
          opacity: 0,
          scale: 0.92,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          scale: 0.92,
        }}
        transition={{
          duration: 0.35,
        }}
        src={selectedImage}
        alt=""
        className="max-w-[94vw] max-h-[90vh] object-contain rounded-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
      />

      {/* RIGHT */}
      <button
        onClick={() => {
          const newIndex =
            selectedIndex === gallery.length - 1
              ? 0
              : selectedIndex + 1;

          setSelectedIndex(newIndex);
          setSelectedImage(gallery[newIndex]);
        }}
        className="absolute right-5 md:right-10 z-50 w-14 h-14 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center backdrop-blur-xl hover:bg-white/20 transition"
      >
        →
      </button>

    </motion.div>
  )}
</AnimatePresence>
  </>
)}

{/* ================= LOCATION ADVANTAGES PREMIUM SECTION ================= */}
<motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.15 }}
  variants={staggerContainer}
  className="bg-[#f7f3ee] py-20 overflow-hidden"
>
  <div className="max-w-[1450px] mx-auto px-5">

    {/* TOP HEADING */}
    <motion.div
      variants={fadeUp}
      className="text-center mb-14"
    >
      <p className="uppercase tracking-[4px] text-[#b58b47] text-sm font-medium mb-4">
        07 | PRIME LOCATION
      </p>

      <h2
        className="text-4xl md:text-6xl font-light text-[#17342d] leading-tight"
        style={{
          fontFamily: "Cormorant Garamond, serif",
        }}
      >
        A Location That{" "}
        <span className="text-[#b58b47]">
          Defines Privilege.
        </span>
      </h2>

      <p className="max-w-3xl mx-auto mt-6 text-[#555] text-base md:text-lg leading-relaxed">
        {coreDetails.title}
      </p>
    </motion.div>

    {/* ================= MAIN GRID ================= */}
<div className="grid lg:grid-cols-[360px_1fr] gap-6 items-stretch">

  {/* ================= LEFT SIDE LOCATION CARDS ================= */}
  <motion.div
    variants={fadeLeft}
    className="rounded-[30px] overflow-hidden border border-[#dcc8a8] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
  >

    {/* TOP HEADER */}
    <div className="relative overflow-hidden bg-gradient-to-br from-[#08211c] via-[#0f3a30] to-[#123f34] px-8 py-10">

      {/* GLOW */}
      <div className="absolute -top-20 -right-20 w-52 h-52 bg-[#d4b071]/20 blur-3xl rounded-full" />

      <div className="relative z-10">
        <p className="uppercase tracking-[4px] text-[#d4b071] text-xs font-semibold mb-4">
          Prime Connectivity
        </p>

        <h3
          className="text-4xl text-white leading-tight font-light"
          style={{
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          Everything <br />
          Within Reach
        </h3>

        <p className="text-white/70 mt-5 leading-relaxed text-sm">
          Strategically positioned near major business hubs,
          expressways, hospitals, schools and premium lifestyle destinations.
        </p>
      </div>
    </div>

    {/* LOCATION LIST */}
    <div className="p-5 space-y-4 bg-[#fcfaf7] h-full">

      {locationData.landmarks?.map((l, i) => (
        l.name && (
          <motion.div
            key={i}
            whileHover={{
              y: -3,
              scale: 1.01,
            }}
            transition={{
              duration: 0.3,
            }}
            className="group relative overflow-hidden rounded-[22px] border border-[#eadfce] bg-white p-5 shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-500"
          >

            {/* GOLD HOVER */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[linear-gradient(120deg,transparent,rgba(212,176,113,0.08),transparent)] translate-x-[-100%] group-hover:translate-x-[100%]" />

            <div className="relative z-10 flex items-center justify-between gap-4">

              {/* LEFT */}
              <div className="flex items-center gap-4">

                {/* ICON */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#08211c] to-[#123f34] text-[#d4b071] flex items-center justify-center shadow-lg flex-shrink-0">

                  {i === 0 && "✚"}
                  {i === 1 && "⌂"}
                  {i === 2 && "✦"}
                  {i === 3 && "☁"}
                  {i === 4 && "▣"}
                  {i === 5 && "➜"}

                </div>

                {/* TEXT */}
                <div>
                  <h4 className="text-[#17342d] font-semibold text-[15px] uppercase tracking-wide">
                    {l.name}
                  </h4>

                  <p className="text-[#777] text-sm mt-1">
                    Premium Connectivity
                  </p>
                </div>
              </div>

              {/* DISTANCE */}
              <div className="text-right flex-shrink-0">

                <p className="text-2xl font-light text-[#b58b47] leading-none">
                  {l.distance}
                </p>

                <span className="uppercase tracking-[2px] text-[10px] text-[#999]">
                  Away
                </span>
              </div>
            </div>
          </motion.div>
        )
      ))}
    </div>
  </motion.div>

  {/* ================= MAP SECTION ================= */}
  <motion.div
    variants={fadeUp}
    className="relative rounded-[34px] overflow-hidden border border-[#dcc8a8] shadow-[0_20px_60px_rgba(0,0,0,0.12)] bg-white flex flex-col h-full"
  >

    {/* MAP TOP BAR */}
    <div className="relative z-20 flex items-center justify-between px-7 py-5 border-b border-[#ece2d3] bg-white">

      <div>
        <p className="uppercase tracking-[3px] text-[#b58b47] text-xs font-semibold mb-2">
          Interactive Location Map
        </p>

        <h3
          className="text-3xl text-[#17342d] font-light"
          style={{
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          Discover The Neighborhood
        </h3>
      </div>

      {/* BADGE */}
      <div className="hidden md:flex items-center gap-3 bg-gradient-to-r from-[#08211c] to-[#0f3a30] text-[#d4b071] px-5 py-3 rounded-2xl border border-[#d4b071]/30 shadow-lg">

        <div className="w-10 h-10 rounded-full border border-[#d4b071] flex items-center justify-center">
          ✦
        </div>

        <div>
          <p className="uppercase tracking-[2px] text-[10px]">
            Prime
          </p>

          <p className="text-sm text-white">
            Location Advantage
          </p>
        </div>
      </div>
    </div>

    {/* MAP */}
    <div className="relative flex-1 min-h-[720px]">

  {locationData.mapEmbedUrl ? (
    <iframe
      src={locationData.mapEmbedUrl}
      className="absolute inset-0 w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          style={{
            border: 0,
            filter:
              "grayscale(0.15) contrast(1.05) brightness(0.98)",
            pointerEvents: "auto",
          }}
        />
      ) : (
        <div className="h-[750px] flex items-center justify-center bg-[#08211c] text-white">
          Map Not Available
        </div>
      )}

      {/* FLOATING INFO CARD */}
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
        }}
       className="absolute left-6 bottom-8 z-20 max-w-sm backdrop-blur-xl bg-white/90 border border-white/60 rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.18)]"
      >

        <div className="flex items-start gap-4">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#08211c] to-[#0f3a30] text-[#d4b071] flex items-center justify-center shadow-lg flex-shrink-0 text-xl">
            ✦
          </div>

          <div>
            <p className="uppercase tracking-[3px] text-[#b58b47] text-[11px] font-semibold mb-2">
              Signature Address
            </p>

            <h4 className="text-[#17342d] text-xl font-semibold leading-tight">
              Prime Sector Connectivity
            </h4>

            <p className="text-[#666] text-sm mt-3 leading-relaxed">
              Positioned in one of the fastest growing luxury corridors with seamless access to major destinations.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  </motion.div>
</div>

    {/* BOTTOM STRIP */}
    <motion.div
      variants={fadeUp}
      className="mt-8 rounded-[24px] overflow-hidden border border-[#c9a96a] bg-gradient-to-r from-[#07211c] to-[#0f3a30]"
    >
      <div className="grid md:grid-cols-5">

        {[
          {
            title: "Location that enhances life.",
            desc: "Investment that appreciates.",
          },
          {
            title: "Strategically Connected",
            desc: "Seamless access to major hubs and expressways.",
          },
          {
            title: "Thriving Neighborhood",
            desc: "Surrounded by premium communities and landmarks.",
          },
          {
            title: "Future-Ready Development",
            desc: "Infrastructure and growth that future-proofs your investment.",
          },
          {
            title: "High Investment Potential",
            desc: "Prime location ensures long-term value appreciation.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{
              y: -4,
            }}
            className="p-7 border-r border-white/10 last:border-r-0"
          >
            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-full border border-[#c9a96a] flex items-center justify-center text-[#d8b06b] flex-shrink-0">
                ✦
              </div>

              <div>
                <h4 className="text-[#d8b06b] text-sm uppercase tracking-wide font-semibold leading-relaxed">
                  {item.title}
                </h4>

                <p className="text-white/70 text-sm mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
</motion.section>

{/* ================= MASTER PLAN PREMIUM SECTION ================= */}
{gatedContent?.brochurePdfUrl && (
  <section className="relative bg-[#f7f3ee] py-24 overflow-hidden">

    {/* SOFT PATTERN */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "radial-gradient(circle, #17342d 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />

    <div className="relative z-10 max-w-[1450px] mx-auto px-5">

      {/* ================= HEADING ================= */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="text-center mb-16"
      >
        <p className="uppercase tracking-[4px] text-[#b58b47] text-sm font-medium mb-4">
          08 | MASTER PLAN
        </p>

        <h2
          className="text-4xl md:text-6xl font-light text-[#17342d] leading-tight"
          style={{
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          Crafted With Vision.
          <span className="text-[#b58b47]">
            {" "}Designed For Legacy.
          </span>
        </h2>

        <div className="w-24 h-[1px] bg-[#c8a66a] mx-auto mt-5 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#c8a66a]" />
        </div>

        <p className="max-w-3xl mx-auto mt-7 text-[#6b6b6b] text-base md:text-lg leading-relaxed">
          Explore the thoughtfully designed master plan featuring elegant
          layouts, landscaped greens, premium amenities, and seamless
          connectivity crafted for elevated living.
        </p>
      </motion.div>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="relative max-w-7xl mx-auto">

        {/* SIDE STRIPS */}
        <div className="absolute inset-y-24 left-0 w-[22%] bg-gradient-to-b from-[#08211c] to-[#0f3a30] rounded-l-[40px]" />

        <div className="absolute inset-y-24 right-0 w-[22%] bg-gradient-to-b from-[#b58b47] to-[#d4b071] rounded-r-[40px]" />

        {/* MAIN CARD */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          whileHover={{
            y: -6,
          }}
          className="relative z-10 max-w-6xl mx-auto rounded-[32px] overflow-hidden border border-[#dfd5c8] shadow-[0_20px_60px_rgba(0,0,0,0.12)] bg-white"
        >

          {/* IMAGE WRAPPER */}
          <div className="relative overflow-hidden">

            {/* IMAGE */}
            <img
              src={
                media?.gallery?.[0] ||
                media?.heroImageUrl ||
                "/placeholder.jpg"
              }
              alt="Master Plan"
              className="w-full h-[720px] object-cover scale-[1.02]"
            />

            {/* OVERLAYS */}
            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

            {/* TOP LABEL */}
            <div className="absolute top-8 left-8 z-20">

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 flex items-center gap-3">

                <div className="w-3 h-3 rounded-full bg-[#d4b071] animate-pulse" />

                <span className="uppercase tracking-[3px] text-white text-xs font-medium">
                  Premium Architectural Planning
                </span>
              </div>
            </div>

            {/* CENTER CONTENT */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">

              {/* GOLD EMBLEM */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-32 h-32 rounded-full border border-[#d4b071] bg-[#08211c]/70 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(212,176,113,0.35)] mb-8"
              >
                <div className="w-24 h-24 rounded-full border border-[#d4b071]/70 flex items-center justify-center">

                  <span className="text-[#d4b071] text-5xl">
                    ✦
                  </span>
                </div>
              </motion.div>

              {/* TITLE */}
              <h3
                className="text-white text-5xl md:text-7xl font-light leading-tight"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                The Master Plan
              </h3>

              <p className="max-w-2xl mx-auto mt-6 text-white/80 text-lg leading-relaxed">
                Every space is carefully envisioned to create harmony between
                luxury, comfort, and timeless architecture.
              </p>

              {/* BUTTON */}
              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() => setShowModal(true)}
                className="mt-10 bg-gradient-to-r from-[#08211c] to-[#0f3a30] border border-[#d4b071] hover:shadow-[0_0_35px_rgba(212,176,113,0.35)] transition-all duration-300 text-[#e0bd7d] px-10 py-5 rounded-2xl flex items-center gap-5 uppercase tracking-[2px] text-sm font-semibold"
              >

                {/* ICON */}
                <div className="w-12 h-12 rounded-full border border-[#d4b071] flex items-center justify-center">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7l9-4 9 4-9 4-9-4zm0 5l9 4 9-4m-18 5l9 4 9-4"
                    />
                  </svg>
                </div>

                <span>
                  View Master Plan
                </span>

                {/* ARROW */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </motion.button>
            </div>

            {/* BOTTOM INFO STRIP */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-[#08211c]/95 to-[#0f3a30]/95 backdrop-blur-md border-t border-white/10 z-20">

              <div className="grid md:grid-cols-4">

                {[
                  {
                    title: "Thoughtful Layouts",
                    desc: "Optimized space planning",
                  },
                  {
                    title: "Landscape Greens",
                    desc: "Open green environments",
                  },
                  {
                    title: "Premium Amenities",
                    desc: "Luxury lifestyle experiences",
                  },
                  {
                    title: "Future-Ready Living",
                    desc: "Modern & sustainable planning",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-6 border-r border-white/10 last:border-r-0"
                  >
                    <div className="flex items-start gap-4">

                      {/* ICON */}
                      <div className="w-11 h-11 rounded-full border border-[#d4b071] flex items-center justify-center text-[#d4b071] flex-shrink-0">
                        ✦
                      </div>

                      {/* TEXT */}
                      <div>
                        <h4 className="text-[#d4b071] uppercase tracking-wide text-sm font-semibold">
                          {item.title}
                        </h4>

                        <p className="text-white/70 text-sm mt-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)}

{/* ================= PREMIUM FAQ SECTION ================= */}
{faqs.filter((f) => f.question).length > 0 && (
  <section className="relative bg-[#f7f3ee] py-24 overflow-hidden">

    {/* SOFT BACKGROUND */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "radial-gradient(circle, #17342d 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />

    <div className="relative z-10 max-w-[1450px] mx-auto px-5">

      {/* ================= HEADING ================= */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="text-center mb-16"
      >
        <p className="uppercase tracking-[4px] text-[#b58b47] text-sm font-medium mb-4">
          09 | FAQ
        </p>

        <h2
          className="text-4xl md:text-6xl font-light text-[#17342d] leading-tight"
          style={{
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          Frequently Asked Questions
        </h2>

        <div className="w-24 h-[1px] bg-[#c8a66a] mx-auto mt-5 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#c8a66a]" />
        </div>

        <p className="max-w-2xl mx-auto mt-7 text-[#6b6b6b] text-base leading-relaxed">
          Find answers to common questions about the project and your
          journey to your dream home.
        </p>
      </motion.div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid lg:grid-cols-[320px_1fr] gap-8 items-start">

        {/* ================= LEFT CARD ================= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeLeft}
          className="rounded-[20px] overflow-hidden border border-[#dfd5c8] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
        >

          {/* IMAGE */}
          <div className="relative h-[340px] overflow-hidden">
            <img
              src="/location6.webp"
              alt="faq"
              className="w-full h-full object-cover"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/10" />

            {/* LOGO */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">

                <div className="w-20 h-20 mx-auto rounded-full border border-[#d6b16f] flex items-center justify-center mb-4 backdrop-blur-sm bg-white/10">
                  <span className="text-4xl text-[#e0ba74]">✦</span>
                </div>

                <h3
                  className="text-4xl font-light"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                  }}
                >
                  SIGNATURE
                </h3>

                <p className="uppercase tracking-[4px] text-sm mt-1">
                  GLOBAL
                </p>
              </div>
            </div>
          </div>

          {/* CONTACT BOX */}
          <div className="bg-gradient-to-r from-[#08211c] to-[#0f3a30] p-7 text-white">

            <div className="flex items-start gap-4">

              {/* ICON */}
              <div className="w-14 h-14 rounded-full border border-[#c8a66a] flex items-center justify-center text-[#d6b16f] flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5h18M9 3v2m6-2v2m-7 8h8m-8 4h5m-9 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {/* TEXT */}
              <div>
                <h4
                  className="text-2xl font-light"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                  }}
                >
                  Still have questions?
                </h4>

                <p className="text-white/70 text-sm leading-relaxed mt-2">
                  Our experts are just a call away.
                </p>

                <div className="mt-5 space-y-3">

                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[#d6b16f]">✦</span>
                    <span>+91 99999 99999</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[#d6b16f]">✦</span>
                    <span>Monday — Sunday | 10 AM — 7 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= FAQ ACCORDION ================= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeRight}
          className="space-y-4"
        >

          {faqs.map(
            (f, i) =>
              f.question && (
                <details
                  key={i}
                  open={i === 0}
                  className="group rounded-[18px] border border-[#e3d9cc] bg-[#fbf9f6] overflow-hidden shadow-sm transition-all duration-300"
                >

                  {/* QUESTION */}
                  <summary className="list-none cursor-pointer px-7 py-6 flex items-center justify-between">

                    <div className="flex items-center gap-5">

                      {/* ICON */}
                      <div className="w-12 h-12 rounded-full border border-[#dbc7a0] flex items-center justify-center text-[#c8a66a] flex-shrink-0">

                        {i % 6 === 0 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 21h18M5 21V8l7-5 7 5v13"
                            />
                          </svg>
                        )}

                        {i % 6 === 1 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12h6m-3-3v6m9 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}

                        {i % 6 === 2 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.657 16.657L13.414 12.414m0 0A6 6 0 1012 18a6 6 0 001.414-5.586z"
                            />
                          </svg>
                        )}

                        {i % 6 === 3 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 17v-2m3 2v-4m3 4v-6"
                            />
                          </svg>
                        )}

                        {i % 6 === 4 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7V3m8 4V3m-9 8h10"
                            />
                          </svg>
                        )}

                        {i % 6 === 5 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 16h8M8 12h8m-8-4h8"
                            />
                          </svg>
                        )}
                      </div>

                      {/* QUESTION */}
                      <h3 className="text-[#1c2d28] text-lg md:text-[19px] font-medium leading-relaxed">
                        {f.question}
                      </h3>
                    </div>

                    {/* ARROW */}
                    <div className="ml-5 flex-shrink-0 text-[#17342d] transition-transform duration-300 group-open:rotate-180">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </summary>

                  {/* ANSWER */}
                  <div className="px-24 pb-7 text-[#666] text-[15px] leading-[1.9] border-t border-[#ece3d8]">
                    <div className="pt-6 max-w-4xl">
                      {f.answer}
                    </div>
                  </div>
                </details>
              )
          )}
        </motion.div>
      </div>

      {/* ================= BOTTOM CTA ================= */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="mt-10 rounded-[24px] border border-[#e0d6ca] bg-[#fbf8f4] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
      >
        <div className="grid lg:grid-cols-[1fr_auto_auto_auto] items-center">

          {/* LEFT */}
          <div className="flex items-center gap-5 p-7">

            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#08211c] to-[#0f3a30] flex items-center justify-center text-[#d6b16f] shadow-lg flex-shrink-0">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10"
                />
              </svg>
            </div>

            <div>
              <h3
                className="text-3xl text-[#17342d] font-light"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                Ready to experience your dream home?
              </h3>

              <p className="text-[#777] mt-2 leading-relaxed">
                Book a site visit and take the first step towards your dream
                home.
              </p>
            </div>
          </div>

          {/* BUTTON */}
          <div className="border-l border-[#e5ddd2] p-6">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-[#08211c] to-[#0f3a30] hover:scale-[1.03] transition-all duration-300 text-[#d6b16f] px-10 py-4 rounded-xl flex items-center gap-4 uppercase tracking-wide text-sm font-semibold shadow-lg"
            >
              Book A Site Visit

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>

          {/* CALL */}
          <div className="border-l border-[#e5ddd2] p-6 flex flex-col items-center justify-center text-center min-w-[120px]">
            <div className="w-12 h-12 rounded-full border border-[#d6b16f] flex items-center justify-center text-[#b58b47] mb-3">
              ☎
            </div>

            <p className="text-[#17342d] text-sm font-medium">
              Call Us
            </p>
          </div>

          {/* WHATSAPP */}
          <div className="border-l border-[#e5ddd2] p-6 flex flex-col items-center justify-center text-center min-w-[120px]">
            <div className="w-12 h-12 rounded-full border border-[#d6b16f] flex items-center justify-center text-[#b58b47] mb-3">
              ✦
            </div>

            <p className="text-[#17342d] text-sm font-medium">
              WhatsApp
            </p>
          </div>
        </div>
      </motion.div>

    </div>
  </section>
)}

        {/* ================= PREMIUM LEAD MODAL ================= */}
{showModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">

    <div className="w-[92%] max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#c9a64b] to-[#1f3d2b] px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">
          Get Instant Access
        </h2>

        <button
          onClick={() => setShowModal(false)}
          className="text-white text-xl"
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="p-6 space-y-4">

        <p className="text-sm text-gray-600 text-center">
          Fill details to download brochure instantly
        </p>

        {/* NAME FIELD */}
        <div className="relative">
          <input
            type="text"
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-[#1f3d2b]"
            placeholder=" "
          />
          <label className="absolute left-4 top-2 text-xs text-gray-500">
            Full Name *
          </label>
        </div>

        {/* PHONE FIELD */}
        <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#1f3d2b]">

          <div className="px-3 flex items-center bg-gray-50 text-sm">
            🇮🇳 +91
          </div>

          <input
            type="tel"
            value={leadPhone}
            onChange={(e) => setLeadPhone(e.target.value)}
            className="flex-1 px-4 py-3 outline-none"
            placeholder="Enter phone number"
          />
        </div>

        {/* CTA BUTTON */}
        <button
          onClick={handleLeadSubmit}
          disabled={submitting}
          className="w-full bg-gradient-to-r from-[#c9a64b] to-[#1f3d2b] text-white py-3 rounded-lg font-semibold hover:scale-[1.02] transition"
        >
          {submitting ? "Processing..." : "Download Brochure →"}
        </button>

        {/* TRUST TEXT */}
        <p className="text-xs text-gray-500 text-center">
          🔒 Your details are safe & never shared
        </p>

      </div>
    </div>
  </div>
)}

    </div>
  );
}