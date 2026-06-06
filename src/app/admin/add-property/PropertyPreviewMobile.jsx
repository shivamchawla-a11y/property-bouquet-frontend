"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
   Phone,
  Mail,
  MessageCircle,
  ArrowRight,

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

export default function PropertyPreviewMobile({ form, insideAdmin = false, developers = [] }) {
  if (!form) return null;

const {
  coreDetails = {},
  overview = {},
  media = {},
  locationData = {},
  masterPlanData = {}, // ✅ ADD THIS
  faqs = [],
  faqSection = {}, // ADD THIS
  keyMetrics = {},
  gatedContent = {},
  heroSection = {},
  categoryData = {},
  configurationSection = {},
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

  // ================= DEVELOPER IMAGE RESOLVER =================
function getDeveloperImage() {

  // ✅ Direct custom image
  if (coreDetails?.developerImage) {
    return coreDetails.developerImage;
  }

  // ✅ If populated object from backend
  if (
    coreDetails?.developerRef &&
    typeof coreDetails.developerRef === "object"
  ) {
    return coreDetails.developerRef.image || "";
  }

  // ✅ If only ID exists
  if (coreDetails?.developerRef) {
    const dev = developers.find(
      (d) => d._id === coreDetails.developerRef
    );

    return dev?.image || "";
  }

  return "";
}

  const unitConfigurations = gatedContent?.floorPlans || [];
  const [activePlan, setActivePlan] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const developerLogo = getDeveloperLogo(); // ✅ ADD THIS LINE
  const developerImage = getDeveloperImage();
  const [selectedImage, setSelectedImage] = useState(null);
const [selectedIndex, setSelectedIndex] = useState(0);
const [scrolled, setScrolled] = useState(false);
const [activeSection, setActiveSection] = useState("overview");
const [mobileMenuOpen, setMobileMenuOpen] =
  useState(false);
  const [developerProjects, setDeveloperProjects] =
  useState([]);
  const [showAboutMore, setShowAboutMore] =
  useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 80);
  };

  window.addEventListener("scroll", handleScroll);

  return () =>
    window.removeEventListener("scroll", handleScroll);
}, []);

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

useEffect(() => {
  const sections = [
    "overview",
    "about",
    "highlights",
    "amenities",
    "configuration",
    "gallery",
    "location",
    "contact",
  ];

  const handleScrollSpy = () => {
    const scrollPosition = window.scrollY + 140;

    sections.forEach((sectionId) => {
      const section =
        document.getElementById(sectionId);

      if (section) {
        const offsetTop = section.offsetTop;
        const offsetHeight = section.offsetHeight;

        if (
          scrollPosition >= offsetTop &&
          scrollPosition <
            offsetTop + offsetHeight
        ) {
          setActiveSection(sectionId);
        }
      }
    });
  };

  window.addEventListener(
    "scroll",
    handleScrollSpy
  );

  return () =>
    window.removeEventListener(
      "scroll",
      handleScrollSpy
    );
}, []);

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

  // ================= DEVELOPER DESCRIPTION RESOLVER =================
const getDeveloperDescription = () => {

  // ✅ Direct custom description
  if (coreDetails?.developerDescription?.trim()) {
    return coreDetails.developerDescription;
  }

  // ✅ If populated object from backend
  if (
    coreDetails?.developerRef &&
    typeof coreDetails.developerRef === "object"
  ) {
    return (
      coreDetails.developerRef.description || ""
    );
  }

  // ✅ If only ID exists
  if (coreDetails?.developerRef) {

    const dev = developers.find(
      (d) => d._id === coreDetails.developerRef
    );

    return dev?.description || "";
  }

  return "";
};

const developerDescription =
  getDeveloperDescription();


useEffect(() => {

  if (!developerName) return;

  const fetchDeveloperProjects = async () => {

    try {

      const developerSlug = developerName
        ?.toLowerCase()
        ?.replace(/\s+/g, "-");

      const res = await fetch(
        `https://property-bouquet-backend.onrender.com/api/developers/${developerSlug}`
      );

      const data = await res.json();

      if (res.ok) {

        // ✅ PROJECTS
        setDeveloperProjects(
          data.properties || []
        );

        // ✅ AUTO LOAD DESCRIPTION
        if (
          data.developer?.description &&
          !coreDetails?.developerDescription
        ) {
          form.coreDetails.developerDescription =
            data.developer.description;
        }

        // ✅ AUTO LOAD IMAGE
        if (
          data.developer?.image &&
          !coreDetails?.developerImage
        ) {
          form.coreDetails.developerImage =
            data.developer.image;
        }

        // ✅ AUTO LOAD LOGO
        if (
          data.developer?.logo &&
          !coreDetails?.developerLogo
        ) {
          form.coreDetails.developerLogo =
            data.developer.logo;
        }

      } else {

        setDeveloperProjects([]);

      }

    } catch (err) {

      console.error(
        "Error fetching developer projects:",
        err
      );

      setDeveloperProjects([]);

    }
  };

  fetchDeveloperProjects();

}, [developerName]);

const getShortLocation = (location) => {

  if (!location) return "Gurgaon";

  if (location.includes(">")) {

    const parts = location
      .split(">")
      .map((p) => p.trim());

    return parts[parts.length - 1];
  }

  if (location.includes(",")) {
    return location.split(",")[0].trim();
  }

  return location;
};

  return (
    <div className="relative overflow-hidden bg-black">

{/* ================= MOBILE PREMIUM NAVBAR ================= */}
<div
  className={`
    relative
    overflow-hidden
    border-b
    border-white/10
    bg-[rgba(4,7,7,0.92)]
    backdrop-blur-3xl
  `}
>
  {/* GLOW */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,166,75,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(201,166,75,0.10),transparent_30%)]" />

  {/* CONTENT */}
  <div className="relative z-10 h-[64px] px-4 flex items-center justify-between">

    {/* LOGO */}
    <div className="flex items-center min-w-0">

      {developerLogo?.trim() ? (
        <img
          src={developerLogo}
          alt={developerName}
          className="
            h-7
            max-w-[110px]
            object-contain
          "
          onError={(e) =>
            (e.target.style.display = "none")
          }
        />
      ) : (
        <h2
          className="
            text-white
            text-[13px]
            tracking-[2px]
            truncate
            max-w-[180px]
          "
          style={{
            fontFamily:
              "Georgia, Times New Roman, serif",
          }}
        >
          {developerName}
        </h2>
      )}
    </div>

    {/* HAMBURGER */}
    <button
      onClick={() =>
        setMobileMenuOpen(
          !mobileMenuOpen
        )
      }
      className="
        relative
        w-[40px]
        h-[40px]
        rounded-full
        border
        border-white/10
        bg-white/5
        flex
        items-center
        justify-center
      "
    >
      <div className="flex flex-col gap-[4px]">

        <span
          className={`
            block
            w-[18px]
            h-[1.5px]
            bg-white
            transition-all
            duration-300
            ${
              mobileMenuOpen
                ? "rotate-45 translate-y-[5px]"
                : ""
            }
          `}
        />

        <span
          className={`
            block
            w-[18px]
            h-[1.5px]
            bg-white
            transition-all
            duration-300
            ${
              mobileMenuOpen
                ? "opacity-0"
                : ""
            }
          `}
        />

        <span
          className={`
            block
            w-[18px]
            h-[1.5px]
            bg-white
            transition-all
            duration-300
            ${
              mobileMenuOpen
                ? "-rotate-45 -translate-y-[6px]"
                : ""
            }
          `}
        />

      </div>
    </button>

  </div>

  {/* ================= MOBILE MENU ================= */}
  <AnimatePresence>
    {mobileMenuOpen && (
      <motion.div
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -15,
        }}
        transition={{
          duration: 0.25,
        }}
        className="
          border-t
          border-white/10
          bg-[rgba(5,8,8,0.98)]
          backdrop-blur-3xl
        "
      >
        <div className="px-5 py-5 space-y-1">

          {[
            {
              label: "Overview",
              id: "overview",
            },
            {
              label: "About Project",
              id: "about",
            },
            {
              label: "Highlights",
              id: "highlights",
            },
            {
              label: "Amenities",
              id: "amenities",
            },
            {
              label: "Floor Plan",
              id: "configuration",
            },
            {
              label: "Gallery",
              id: "gallery",
            },
            {
              label: "Location",
              id: "location",
            },
            {
              label: "Contact",
              id: "contact",
            },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setMobileMenuOpen(false);

                const section =
                  document.getElementById(
                    item.id
                  );

                if (section) {
                  section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="
                w-full
                flex
                items-center
                justify-between
                py-4
                border-b
                border-white/5
                text-left
                text-white/80
              "
            >
              <span
                className="
                  text-[11px]
                  tracking-[2px]
                  uppercase
                "
                style={{
                  fontFamily:
                    "Inter, sans-serif",
                }}
              >
                {item.label}
              </span>

              <span className="text-[#c9a64b] text-[16px]">
                →
              </span>
            </button>
          ))}

          {/* BROCHURE BUTTON */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setShowModal(true);
            }}
            className="
              mt-5
              w-full
              h-[50px]
              rounded-[10px]
              bg-[#c9a64b]
              text-[#111]
              text-[11px]
              tracking-[1.4px]
              font-semibold
              flex
              items-center
              justify-center
              gap-3
            "
          >
            <Download size={15} />
            DOWNLOAD BROCHURE
          </button>

        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

{/* ================= MOBILE CINEMATIC HERO ================= */}
<motion.div
  id="overview"
  initial={{
    scale: 1.03,
    opacity: 0,
  }}
  animate={{
    scale: 1,
    opacity: 1,
  }}
  transition={{
    duration: 1,
  }}
  className="
    relative
    min-h-[88vh]
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

  {/* OVERLAYS */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40" />

  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

  <div className="absolute left-[5%] top-[10%] w-[180px] h-[180px] bg-[#c89d58]/10 blur-[90px] rounded-full" />

  {/* CONTENT */}
  <motion.div
    variants={staggerContainer}
    initial="hidden"
    animate="visible"
    className="
      relative
      z-20
      w-full
      px-5
      pb-6
      pt-24
    "
  >

    <div className="w-full">

      {/* STATUS */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 mb-5"
      >
        <div className="w-8 h-[1px] bg-[#d8b46b]" />

        <p
          className="
            text-[#d8b46b]
            text-[9px]
            tracking-[2px]
            uppercase
            font-semibold
          "
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
          text-[32px]
          leading-[1]
          tracking-[-1px]
          break-words
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
        className="
          mt-5
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            w-9
            h-9
            rounded-full
            bg-white/10
            border
            border-white/10
            flex
            items-center
            justify-center
            shrink-0
          "
        >
          <MapPin
            size={15}
            className="text-[#d8b46b]"
          />
        </div>

        <p
          className="
            text-[13px]
            text-white/80
            leading-relaxed
          "
        >
          {locationName}
        </p>
      </motion.div>

      {/* DESCRIPTION */}
      <motion.p
        variants={fadeUp}
        className="
          mt-6
          text-[13px]
          leading-[1.9]
          text-white/70
        "
      >
        {heroSection?.heroDescription ||
          "A rare fusion of architectural brilliance and low-density luxury living."}
      </motion.p>

      {/* BUTTONS */}
      <motion.div
        variants={fadeUp}
        className="
          flex
          flex-col
          gap-4
          mt-8
        "
      >

        <button
          onClick={() => setShowModal(true)}
          className="
            h-[48px]
            rounded-[8px]
            bg-[#c9a64b]
            text-[#111]
            text-[11px]
            tracking-[1.5px]
            font-semibold
            flex
            items-center
            justify-center
            gap-3
          "
        >
          <Download size={15} />

          {heroSection?.brochureButtonText ||
            "DOWNLOAD BROCHURE"}
        </button>

        {media?.walkthroughUrl?.trim() && (
          <a
            href={media.walkthroughUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              items-center
              gap-4
            "
          >
            <div
              className="
                w-[50px]
                h-[50px]
                rounded-full
                bg-white/10
                border
                border-white/10
                flex
                items-center
                justify-center
              "
            >
              <Play
                size={15}
                fill="currentColor"
                className="text-white ml-[2px]"
              />
            </div>

            <div>
              <p
                className="
                  text-[10px]
                  tracking-[2px]
                  uppercase
                  text-white
                "
              >
                {heroSection?.videoButtonText ||
                  "WATCH PROJECT VIDEO"}
              </p>

              <p
                className="
                  text-[9px]
                  text-[#d8b46b]
                  mt-1
                "
              >
                Cinematic Walkthrough
              </p>
            </div>
          </a>
        )}
      </motion.div>

      {/* METRICS */}
      <motion.div
        variants={fadeUp}
        className="mt-10"
      >
        <div
          className="
            grid
            grid-cols-2
            rounded-[18px]
            overflow-hidden
            border
            border-white/10
            bg-[rgba(8,18,15,0.85)]
            backdrop-blur-xl
          "
        >

          <div className="p-4 text-center border-r border-b border-white/10">
            <LayoutGrid
              size={15}
              className="mx-auto mb-2 text-[#d8b46b]"
            />
            <p className="text-white text-[18px]">
              {keyMetrics?.landArea || "1.83"}
            </p>
            <p className="text-white/60 text-[9px] uppercase">
              Acres
            </p>
          </div>

          <div className="p-4 text-center border-b border-white/10">
            <Building2
              size={15}
              className="mx-auto mb-2 text-[#d8b46b]"
            />
            <p className="text-white text-[18px]">
              {keyMetrics?.totalTowers || "2"}
            </p>
            <p className="text-white/60 text-[9px] uppercase">
              Towers
            </p>
          </div>

          <div className="p-4 text-center border-r border-b border-white/10">
            <Users
              size={15}
              className="mx-auto mb-2 text-[#d8b46b]"
            />
            <p className="text-white text-[18px]">
              {keyMetrics?.totalUnits || "95"}
            </p>
            <p className="text-white/60 text-[9px] uppercase">
              Units
            </p>
          </div>

          <div className="p-4 text-center border-b border-white/10">
            <CalendarDays
              size={15}
              className="mx-auto mb-2 text-[#d8b46b]"
            />
            <p className="text-white text-[16px]">
              {keyMetrics?.possession || "2030"}
            </p>
            <p className="text-white/60 text-[9px] uppercase">
              Possession
            </p>
          </div>

          <div className="col-span-2 p-5 text-center">
            <IndianRupee
              size={15}
              className="mx-auto mb-2 text-[#d8b46b]"
            />

            <p className="text-white/60 text-[9px] uppercase mb-2">
              Starts At
            </p>

            <p
              className="
                text-[#dfbc67]
                text-[24px]
              "
              style={{
                fontFamily:
                  "Georgia, Times New Roman, serif",
              }}
            >
              ₹ {formatPrice(coreDetails?.startingPrice)}
            </p>
          </div>

        </div>
      </motion.div>

    </div>
  </motion.div>
</motion.div>

{/* ================= MOBILE ABOUT ================= */}
<motion.section
  id="about"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={fadeUp}
  className="
    relative
    bg-[#f7f3ec]
    py-10
    px-4
    overflow-hidden
  "
>
  <div className="max-w-md mx-auto">

    {/* IMAGE */}
    <div className="relative mb-8">

      {/* GOLD FRAME */}
      <div className="absolute inset-0 border border-[#d7bc88] rounded-[14px] translate-x-2 translate-y-2" />

      <div className="relative overflow-hidden rounded-[14px]">
        <img
          src={
            overview?.aboutImageUrl ||
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
          }
          alt="About"
          className="
            w-full
            h-[260px]
            object-cover
          "
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5" />
      </div>
    </div>

    {/* LABEL */}
    <div className="flex items-center gap-2 mb-4">

      <p
        className="
          text-[#b89149]
          text-[10px]
          tracking-[2px]
          uppercase
          font-semibold
        "
      >
        {aboutSectionNumber}
      </p>

      <div className="w-6 h-[1px] bg-[#c9a64b]" />

      <p
        className="
          text-[#233c31]
          text-[10px]
          tracking-[2px]
          uppercase
        "
      >
        {overview?.aboutLabel || "Luxury Living"}
      </p>
    </div>

    {/* TITLE */}
    <h2
      className="
        text-[#183126]
        text-[30px]
        leading-[1]
        tracking-[-1px]
      "
      style={{
        fontFamily:
          "Georgia, Times New Roman, serif",
      }}
    >
      {overview?.aboutTitleLine1 ||
        "Crafted For Elevated"}

      <br />

      {overview?.aboutTitleLine2 ||
        "Luxury Living"}
    </h2>

    {/* DIVIDER */}
    <div className="flex items-center gap-3 mt-5 mb-6">

      <div className="w-10 h-[1px] bg-[#c9a64b]" />

      <div className="w-[5px] h-[5px] rotate-45 border border-[#c9a64b]" />
    </div>

    {/* DESCRIPTION */}
    <div
      className="
        text-[#505050]
        text-[14px]
        leading-[1.9]
      "
    >
      {(() => {

        const paragraph1 =
          overview?.description ||
          "Eldeco Camelot is envisioned for those who value space, privacy and refined living.";

        const paragraph2 =
          aboutParagraph2 ||
          "Designed with an emphasis on elegance and functionality.";

        const combinedText =
          `${paragraph1} ${paragraph2}`;

        const shouldTruncate =
          combinedText.length > 280;

        const previewText =
          combinedText.slice(0, 280);

        return (
          <>
            <p>
              {showAboutMore || !shouldTruncate
                ? combinedText
                : `${previewText}...`}
            </p>

            {shouldTruncate && (
              <button
                type="button"
                onClick={() =>
                  setShowAboutMore(
                    !showAboutMore
                  )
                }
                className="
                  mt-4
                  text-[#b89149]
                  text-[12px]
                  uppercase
                  tracking-[1px]
                  font-semibold
                "
              >
                {showAboutMore
                  ? "Read Less"
                  : "Read More"}
              </button>
            )}
          </>
        );
      })()}
    </div>

    {/* FEATURES */}
    <div className="mt-10 grid grid-cols-2 gap-3">

      {featureBar
        .slice(0, 4)
        .map((item, index) => (
          <div
            key={index}
            className="
              bg-[#03261d]
              rounded-xl
              p-4
              text-center
            "
          >

            <div className="flex justify-center mb-3">

              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  border
                  border-[#c9a64b]/40
                  flex
                  items-center
                  justify-center
                  text-[#d8b46b]
                "
              >
                {item?.icon || "✦"}
              </div>

            </div>

            <h3
              className="
                text-[#d7b367]
                text-[10px]
                uppercase
                tracking-[1px]
                mb-2
              "
            >
              {item?.title}
            </h3>

            <p
              className="
                text-white/60
                text-[11px]
                leading-[1.6]
              "
            >
              {item?.desc}
            </p>

          </div>
      ))}
    </div>

  </div>
</motion.section>

{/* ================= MOBILE HIGHLIGHTS ================= */}
<motion.section
  id="highlights"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={fadeUp}
  className="
    bg-[#f7f3ec]
    py-10
    px-4
  "
>
  <div className="max-w-md mx-auto">

    {/* HEADER */}
    <div className="text-center mb-8">

      <div className="flex items-center justify-center gap-2 mb-4">

        <p
          className="
            text-[#b89149]
            text-[10px]
            tracking-[2px]
            uppercase
            font-semibold
          "
        >
          03
        </p>

        <div className="w-8 h-[1px] bg-[#c9a64b]" />

        <p
          className="
            text-[#233c31]
            text-[10px]
            tracking-[2px]
            uppercase
          "
        >
          Property Highlights
        </p>

      </div>

      <h2
        className="
          text-[#183126]
          text-[30px]
          leading-[1]
          tracking-[-1px]
        "
        style={{
          fontFamily:
            "Georgia, Times New Roman, serif",
        }}
      >
        {overview?.highlightsHeading ||
          "Crafted for Elevated"}

        <br />

        {overview?.highlightsSubheading ||
          "Modern Living"}
      </h2>

      <div className="flex justify-center items-center gap-3 mt-5">

        <div className="w-10 h-[1px] bg-[#c9a64b]" />

        <div className="w-[5px] h-[5px] rotate-45 border border-[#c9a64b]" />

      </div>
    </div>

    {/* CARDS */}
    <div className="space-y-4">

      {(
        overview?.highlights?.some(
          (item) =>
            item?.heading ||
            item?.subheading
        )
          ? overview.highlights
          : [
              {
                heading:
                  "A Landmark Address",
                subheading:
                  "Positioned within one of the city's most prestigious locations.",
                icon: "▥",
              },
              {
                heading:
                  "Private Living",
                subheading:
                  "Expansive residences designed for privacy and peace.",
                icon: "◈",
              },
              {
                heading:
                  "Luxury Amenities",
                subheading:
                  "Wellness, leisure and social experiences.",
                icon: "✦",
              },
              {
                heading:
                  "Future Investment",
                subheading:
                  "Long-term appreciation potential.",
                icon: "↗",
              },
            ]
      )
        .slice(0, 6)
        .map((item, index) => (
          <div
            key={index}
            className="
              relative
              rounded-2xl
              border
              border-[#dfd3c0]
              bg-[#fbf8f2]
              p-5
              shadow-sm
            "
          >

            {/* NUMBER */}
            <p
              className="
                text-[#bc924c]
                text-[10px]
                tracking-[2px]
                uppercase
                mb-3
              "
            >
              {String(index + 1).padStart(
                2,
                "0"
              )}
            </p>

            {/* ICON */}
            <div
              className="
                absolute
                right-4
                top-4
                text-[#d6bc88]/25
                text-[42px]
              "
            >
              {item.icon || "✦"}
            </div>

            {/* TITLE */}
            <h3
              className="
                text-[#21392f]
                text-[20px]
                leading-[1.2]
                mb-3
                pr-10
              "
              style={{
                fontFamily:
                  "Georgia, Times New Roman, serif",
              }}
            >
              {item.heading || item.name}
            </h3>

            {/* DESC */}
            <p
              className="
                text-[#5c5c5c]
                text-[13px]
                leading-[1.8]
              "
            >
              {item.subheading || item.desc}
            </p>

            <div className="w-8 h-[1px] bg-[#c9a64b] mt-5" />

          </div>
      ))}
    </div>

    {/* QUOTE */}
    <div
      className="
        mt-10
        rounded-2xl
        bg-[#efe9de]
        border
        border-[#e0d3be]
        p-6
        text-center
      "
    >
      <p
        className="
          text-[#4d4d4d]
          italic
          text-[20px]
          leading-[1.7]
        "
        style={{
          fontFamily:
            "Georgia, Times New Roman, serif",
        }}
      >
        {overview?.highlightQuote ||
          `At ${coreDetails.title}, every detail is designed for a lifetime of elevated living.`}
      </p>

      <div className="w-12 h-[1px] bg-[#c9a64b] mx-auto mt-5" />
    </div>

  </div>
</motion.section>

{/* ================= MOBILE PREMIUM AMENITIES ================= */}
<motion.section
  id="amenities"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={staggerContainer}
  className="
    relative
    overflow-hidden
    py-10
    px-4
    bg-[#031611]
  "
>

  {/* BACKGROUND */}
  <div
    className="absolute inset-0"
    style={{
      background:
        "radial-gradient(circle at top, rgba(7,51,40,0.55) 0%, rgba(2,22,17,1) 55%, rgba(0,0,0,1) 100%)",
    }}
  />

  <div className="absolute top-[10%] left-[10%] w-[220px] h-[220px] bg-[#c9a64b]/10 blur-[90px] rounded-full" />

  <div className="absolute bottom-[10%] right-[5%] w-[200px] h-[200px] bg-[#0d4b3c]/25 blur-[80px] rounded-full" />

  <div
    className="absolute inset-0 opacity-[0.03]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
      backgroundSize: "50px 50px",
    }}
  />

  <div className="relative z-10">

    {/* SECTION LABEL */}
    <motion.div
      variants={fadeUp}
      className="flex items-center justify-center gap-2 mb-4"
    >
      <p
        className="
          text-[#c9a64b]
          text-[10px]
          tracking-[2px]
          uppercase
          font-semibold
        "
      >
        {overview?.amenitiesSectionNumber || "04"}
      </p>

      <div className="w-6 h-[1px] bg-[#c9a64b]" />

      <p
        className="
          text-white/70
          text-[10px]
          tracking-[2px]
          uppercase
        "
      >
        {overview?.amenitiesSectionLabel ||
          "Project Amenities"}
      </p>
    </motion.div>

    {/* HEADING */}
    <motion.h2
      variants={fadeUp}
      className="
        text-center
        text-white
        text-[30px]
        leading-[1]
        tracking-[-1px]
      "
      style={{
        fontFamily:
          "Georgia, Times New Roman, serif",
      }}
    >
      {overview?.amenitiesHeadingLine1 ||
        "Every Detail."}

      <br />

      {overview?.amenitiesHeadingLine3 ||
        "Beyond Expectation."}
    </motion.h2>

    {/* DIVIDER */}
    <motion.div
      variants={fadeUp}
      className="
        flex
        items-center
        justify-center
        gap-3
        mt-5
      "
    >
      <div className="w-10 h-[1px] bg-[#c9a64b]" />

      <div className="w-[5px] h-[5px] rotate-45 border border-[#c9a64b]" />

      <div className="w-10 h-[1px] bg-[#c9a64b]" />
    </motion.div>

    {/* SUBTEXT */}
    <motion.p
      variants={fadeUp}
      className="
        mt-5
        text-center
        text-white/72
        text-[13px]
        leading-[1.9]
        px-2
      "
      style={{
        fontFamily: "Inter, sans-serif",
      }}
    >
      {overview?.amenitiesSubheading ||
        "A seamless blend of thoughtful design, modern technology and lifestyle-focused amenities curated for elevated living."}
    </motion.p>

    {/* AMENITIES GRID */}
    {Array.isArray(overview?.amenities) &&
      overview.amenities.filter(Boolean).length > 0 && (
        <motion.div
          variants={fadeUp}
          className="
            grid
            grid-cols-2
            gap-3
            mt-10
          "
        >
          {overview.amenities
            .filter((h) => h)
            .slice(0, 8)
            .map((h, i) => {

              const amenityName =
                typeof h === "string"
                  ? h
                  : h?.heading ||
                    h?.icon ||
                    "Amenity";

              const iconKey =
                typeof h === "string"
                  ? "Home"
                  : h?.icon || "Home";

              const IconComponent =
                CUSTOM_ICONS.find(
                  (item) =>
                    item.name === iconKey
                )?.icon || Home;

              return (
                <motion.div
                  key={i}
                  whileHover={{
                    y: -3,
                  }}
                  className="
                    relative
                    overflow-hidden
                    rounded-[16px]
                    border
                    border-[#8f6a2c]/40
                    bg-[rgba(4,31,24,0.75)]
                    backdrop-blur-xl
                    p-4
                    text-center
                  "
                >

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,166,75,0.12),transparent_65%)]" />

                  <div className="relative flex justify-center mb-3">

                    <div
                      className="
                        w-[52px]
                        h-[52px]
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
                        size={24}
                        className="text-[#d7b367]"
                        strokeWidth={1.5}
                      />
                    </div>

                  </div>

                  <h3
                    className="
                      relative
                      text-white
                      text-[11px]
                      uppercase
                      tracking-[1px]
                      leading-[1.6]
                    "
                    style={{
                      fontFamily:
                        "Inter, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {amenityName}
                  </h3>

                  <div className="relative w-8 h-[1px] bg-[#c9a64b] mx-auto mt-3" />

                </motion.div>
              );
            })}
        </motion.div>
      )}

    {/* BOTTOM STRIP */}
    <motion.div
      variants={fadeUp}
      className="
        mt-10
        rounded-[18px]
        border
        border-[#8f6a2c]/40
        bg-[rgba(5,30,24,0.80)]
        backdrop-blur-xl
        p-6
      "
    >

      <div className="text-center">

        <div className="text-[#d7b367] text-[34px] mb-3">
          ✺
        </div>

        <h3
          className="
            text-[#d7b367]
            text-[22px]
            leading-[1.4]
          "
          style={{
            fontFamily:
              "Georgia, Times New Roman, serif",
          }}
        >
          {overview?.bottomStripTitle1 ||
            "Thoughtfully by Design."}
        </h3>

        <h4
          className="
            text-white
            text-[22px]
            leading-[1.4]
            mt-1
          "
          style={{
            fontFamily:
              "Georgia, Times New Roman, serif",
          }}
        >
          {overview?.bottomStripTitle2 ||
            "Crafted for the Exceptional."}
        </h4>

      </div>

      <div className="mt-6 space-y-3">

        {[
          overview?.bottomStripFeature1 ||
            "Premium Specifications",

          overview?.bottomStripFeature2 ||
            "Finest Quality Materials",

          overview?.bottomStripFeature3 ||
            "Curated for Discerning Families",
        ].map((item, index) => (
          <div
            key={index}
            className="
              flex
              items-center
              gap-3
              rounded-xl
              bg-white/[0.03]
              border
              border-white/5
              px-4
              py-3
            "
          >
            <span className="text-[#d7b367]">
              ✦
            </span>

            <p
              className="
                text-white/85
                text-[13px]
                leading-[1.6]
              "
            >
              {item}
            </p>
          </div>
        ))}

      </div>

    </motion.div>

  </div>

</motion.section>

{/* ================= ULTRA PREMIUM AMENITIES SECTION ================= */}
<motion.section
  id="amenities"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.15 }}
  variants={staggerContainer}
  className="
    relative
    overflow-hidden
    py-12
    bg-[#031611]
  "
>

  {/* ================= BACKGROUND ================= */}

  <div
    className="absolute inset-0"
    style={{
      background:
        "radial-gradient(circle at top, rgba(7,51,40,0.55) 0%, rgba(2,22,17,1) 55%, rgba(0,0,0,1) 100%)",
    }}
  />

  <div className="absolute top-[5%] left-[10%] w-[180px] h-[180px] bg-[#c9a64b]/10 blur-[80px] rounded-full" />

  <div className="absolute bottom-[10%] right-[5%] w-[180px] h-[180px] bg-[#0d4b3c]/20 blur-[80px] rounded-full" />

  <div
    className="absolute inset-0 opacity-[0.04]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
      backgroundSize: "50px 50px",
    }}
  />

  <div className="relative z-10 px-4">

    {/* ================= LABEL ================= */}
    <motion.div
      variants={fadeUp}
      className="flex items-center justify-center gap-2 mb-4"
    >
      <p
        className="text-[#c9a64b] text-[10px] tracking-[2px] uppercase"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
        }}
      >
        {overview?.amenitiesSectionNumber || "04"}
      </p>

      <div className="w-6 h-[1px] bg-[#c9a64b]" />

      <p
        className="text-white/70 text-[10px] tracking-[2px] uppercase text-center"
        style={{
          fontFamily: "Inter, sans-serif",
        }}
      >
        {overview?.amenitiesSectionLabel ||
          "Project Amenities"}
      </p>
    </motion.div>

    {/* ================= HEADING ================= */}
    <motion.h2
      variants={fadeUp}
      className="
        text-center
        text-white
        text-[32px]
        leading-[1.05]
        tracking-[-1px]
      "
      style={{
        fontFamily:
          "Georgia, Times New Roman, serif",
        fontWeight: 400,
      }}
    >
      {overview?.amenitiesHeadingLine1 ||
        "Every Detail."}

      <br />

      {overview?.amenitiesHeadingLine3 ||
        "Beyond Expectation."}
    </motion.h2>

    {/* DIVIDER */}
    <motion.div
      variants={fadeUp}
      className="flex items-center justify-center gap-3 mt-5"
    >
      <div className="w-10 h-[1px] bg-[#c9a64b]" />

      <div className="w-[5px] h-[5px] rotate-45 border border-[#c9a64b]" />

      <div className="w-10 h-[1px] bg-[#c9a64b]" />
    </motion.div>

    {/* SUBTEXT */}
    <motion.p
      variants={fadeUp}
      className="
        mt-5
        text-center
        text-white/70
        text-[13px]
        leading-[1.9]
        max-w-[600px]
        mx-auto
      "
      style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 300,
      }}
    >
      {overview?.amenitiesSubheading ||
        "Eldeco Camelot is a seamless blend of thoughtful design, cutting-edge technology and world-class amenities curated for an extraordinary lifestyle."}
    </motion.p>

    {/* ================= AMENITIES GRID ================= */}
    {Array.isArray(overview?.amenities) &&
      overview.amenities.filter(Boolean).length > 0 && (

      <motion.div
        variants={fadeUp}
        className="
          grid
          grid-cols-2
          gap-3
          mt-10
        "
      >
        {overview.amenities
          .filter((h) => h)
          .slice(0, 8)
          .map((h, i) => {

            const amenityName =
              typeof h === "string"
                ? h
                : h?.heading ||
                  h?.icon ||
                  "Amenity";

            const iconKey =
              typeof h === "string"
                ? "Home"
                : h?.icon || "Home";

            const IconComponent =
              CUSTOM_ICONS.find(
                (item) =>
                  item.name === iconKey
              )?.icon || Home;

            return (
              <motion.div
                key={i}
                whileHover={{
                  y: -4,
                }}
                className="
                  relative
                  overflow-hidden
                  rounded-[14px]
                  border
                  border-[#8f6a2c]/40
                  bg-[rgba(4,31,24,0.72)]
                  backdrop-blur-xl
                  p-4
                  text-center
                "
              >

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,166,75,0.12),transparent_60%)]" />

                <div className="relative flex justify-center mb-4">
                  <div
                    className="
                      w-[56px]
                      h-[56px]
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
                      size={24}
                      className="text-[#d7b367]"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                <h3
                  className="
                    relative
                    text-white
                    text-[11px]
                    uppercase
                    tracking-[1px]
                    leading-[1.6]
                  "
                  style={{
                    fontFamily:
                      "Inter, sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {amenityName}
                </h3>

                <div className="relative w-8 h-[1px] bg-[#c9a64b] mx-auto mt-3" />

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
        rounded-[16px]
        overflow-hidden
        border
        border-[#8f6a2c]/40
        bg-[rgba(5,30,24,0.75)]
        backdrop-blur-2xl
      "
    >

      {/* TOP */}
      <div className="px-5 py-6 text-center border-b border-white/10">

        <div className="text-[#d7b367] text-[34px] mb-3">
          ✺
        </div>

        <p
          className="
            text-[#d7b367]
            text-[18px]
            leading-[1.5]
          "
          style={{
            fontFamily:
              "Georgia, Times New Roman, serif",
          }}
        >
          {overview?.bottomStripTitle1 ||
            "Thoughtfully by Design."}
        </p>

        <p
          className="
            text-white
            text-[18px]
            leading-[1.5]
          "
          style={{
            fontFamily:
              "Georgia, Times New Roman, serif",
          }}
        >
          {overview?.bottomStripTitle2 ||
            "Crafted for the Exceptional."}
        </p>

      </div>

      {/* FEATURES */}
      <div className="divide-y divide-white/10">

        {[
          overview?.bottomStripFeature1 ||
            "Premium Specifications",

          overview?.bottomStripFeature2 ||
            "Finest Quality Materials",

          overview?.bottomStripFeature3 ||
            "Curated for Discerning Families",
        ].map((item, index) => (
          <div
            key={index}
            className="
              flex
              items-center
              gap-3
              px-5
              py-4
            "
          >
            <span className="text-[#d7b367]">
              ✦
            </span>

            <p
              className="
                text-white/85
                text-[13px]
                leading-[1.6]
              "
              style={{
                fontFamily:
                  "Inter, sans-serif",
              }}
            >
              {item}
            </p>
          </div>
        ))}

      </div>
    </motion.div>

  </div>
</motion.section>

</div>
  );
}