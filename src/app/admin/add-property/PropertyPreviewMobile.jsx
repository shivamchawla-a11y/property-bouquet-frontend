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
  ArrowUpDown,
  Wind,

} from "lucide-react";


const PREDEFINED_AMENITY_ICONS = {
  "Swimming Pool": Waves,
  Gym: Dumbbell,
  Clubhouse: Building2,
  Garden: Trees,
  Parking: Car,
  Lift: ArrowUpDown,
  Security: ShieldCheck,
  "Power Backup": Zap,
  Balcony: Home,
  "Kids Play Area": Baby,
  "Jogging Track": Footprints,
  CCTV: Camera,
  "Indoor Games": Gamepad2,
  Spa: Sparkles,
  "Shopping Center": ShoppingBag,
  WiFi: Wifi,
  "Fire Safety": ShieldCheck,
  "Rainwater Harvesting": Trees,
  Intercom: Phone,
  "Air Conditioning": Wind,
};

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


import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as GiIcons from "react-icons/gi";
import * as TbIcons from "react-icons/tb";
import * as IoIcons from "react-icons/io5";
import * as BsIcons from "react-icons/bs";

const ICONS = {
  ...FaIcons,
  ...MdIcons,
  ...GiIcons,
  ...TbIcons,
  ...IoIcons,
  ...BsIcons,
};

export default function PropertyPreview({ form, insideAdmin = false, developers = [] }) {
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

  // ================= METRIC ICONS =================
const metricIcons = {
  ...FaIcons,
  ...MdIcons,
  ...GiIcons,
  ...TbIcons,
  ...IoIcons,
  ...BsIcons,
};

// ================= METRICS (BACKWARD COMPATIBLE) =================
const displayMetrics = (() => {
  const customMetrics =
    keyMetrics?.customMetrics || [];

  const metrics = [];

 // ================= PRICE METRICS =================

if (coreDetails?.priceOnRequest === true) {
  metrics.push({
    label: "Price",
    value: "On Request",
    icon: "FaTag",
    isPriceRequest: true, // 👈 important
  });
} else {
  const startPrice = coreDetails?.startingPrice;
  const maxPrice = coreDetails?.maxPrice;

  if (startPrice && maxPrice) {
    metrics.push({
      label: "Price Range",
      value: `${formatPrice(startPrice)} - ${formatPrice(maxPrice)}`,
      icon: "FaTag",
    });
  } else if (startPrice) {
    metrics.push({
      label: "Starting Price",
      value: formatPrice(startPrice),
      icon: "FaTag",
    });
  }
}

  // ================= CUSTOM METRICS =================

  if (customMetrics.length > 0) {
    return [
      ...metrics,
      ...customMetrics,
    ];
  }

  // ================= OLD PROPERTY FALLBACK =================

  return [
    ...metrics,

    keyMetrics?.possession && {
      label: "Possession",
      value: keyMetrics.possession,
      icon: "FaCalendarAlt",
    },

    keyMetrics?.landArea && {
      label: "Land Area",
      value: keyMetrics.landArea,
      icon: "FaMapMarkedAlt",
    },

    keyMetrics?.totalUnits && {
      label: "Units",
      value: keyMetrics.totalUnits,
      icon: "FaBuilding",
    },

    keyMetrics?.totalTowers && {
      label: "Towers",
      value: keyMetrics.totalTowers,
      icon: "FaCity",
    },

    keyMetrics?.floors && {
      label: "Floors",
      value: keyMetrics.floors,
      icon: "FaLayerGroup",
    },

    keyMetrics?.reraNumber && {
      label: "RERA",
      value: keyMetrics.reraNumber,
      icon: "FaCertificate",
    },
  ].filter(Boolean);
})();
  

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
      "/api/leads",
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
        `/api/developers/${developerSlug}`
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

         {displayMetrics.map((metric, index) => {
         
             const Icon =
               metricIcons[metric.icon] ||
               FaIcons.FaHome;
         
             return (
               <div
           key={index}
           className="
             flex-1
             min-w-[140px]
             py-4
             lg:py-5
             px-3
             sm:px-4
             text-center
             border-r
             border-white/10
           "
         >
                 <div className="flex justify-center mb-2">
                   <Icon
                     size={16}
                     className="text-[#d8b46b]"
                   />
                 </div>
         
                 {metric.isPriceRequest ? (
           <button
             onClick={() => setShowModal(true)}
             className="
               text-[16px]
               sm:text-[18px]
               md:text-[22px]
               px-4
               py-2
               rounded-full
               border
               border-[#d8b46b]/40
               bg-[#d8b46b]/10
               text-[#d8b46b]
               hover:bg-[#d8b46b]
               hover:text-black
               transition-all
               duration-300
               cursor-pointer
               font-medium
             "
           >
             On Request
           </button>
         ) : (
           <p
             className="
               text-[20px]
               sm:text-[22px]
               md:text-[28px]
               leading-none
               text-white
               font-light
             "
             style={{
               fontFamily:
                 "Georgia, Times New Roman, serif",
             }}
           >
             {metric.value}
           </p>
         )}
         
                 <p
                   className="
                     mt-1
                     text-white/55
                     text-[9px]
                     sm:text-[10px]
                     tracking-[1.5px]
                     sm:tracking-[2px]
                     uppercase
                   "
                 >
                   {metric.label}
                 </p>
               </div>
             );
           })}

        

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

  const isHtml = (text = "") => /<\/?[a-z][\s\S]*>/i.test(text);

  const plainText = `${paragraph1} ${paragraph2}`.replace(
    /<[^>]*>/g,
    ""
  );

  const shouldTruncate = plainText.length > 280;

  return (
    <>
      <div
        className={`relative overflow-hidden transition-all duration-500 ${
          showAboutMore || !shouldTruncate
            ? "max-h-[5000px]"
            : "max-h-[180px]"
        }`}
      >
        {/* FIRST PARAGRAPH */}
        {isHtml(paragraph1) ? (
          <div
            className="prose-luxury whitespace-normal break-words"
            style={{ fontFamily: "Inter, sans-serif" }}
            dangerouslySetInnerHTML={{
              __html: paragraph1,
            }}
          />
        ) : (
          <p className="whitespace-pre-line break-words">
            {paragraph1}
          </p>
        )}

        {/* SECOND PARAGRAPH */}
        {paragraph2 &&
          (isHtml(paragraph2) ? (
            <div
              className="
                mt-4
                whitespace-normal
                break-words

                [&_p]:mb-4
                [&_p]:leading-[1.8]
                [&_p]:text-[14px]
                [&_p]:text-[#505050]

                [&_strong]:font-semibold

                [&_ul]:list-disc
                [&_ul]:pl-5

                [&_ol]:list-decimal
                [&_ol]:pl-5

                [&_li]:mb-2
              "
              style={{
                fontFamily: "Inter, sans-serif",
              }}
              dangerouslySetInnerHTML={{
                __html: paragraph2,
              }}
            />
          ) : (
            <p className="mt-4 whitespace-pre-line break-words">
              {paragraph2}
            </p>
          ))}

        {/* Fade */}
        {!showAboutMore && shouldTruncate && (
          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              h-16
              bg-gradient-to-t
              from-[#f7f4ef]
              via-[#f7f4ef]/80
              to-transparent
              pointer-events-none
            "
          />
        )}
      </div>

      {shouldTruncate && (
        <button
          type="button"
          onClick={() =>
            setShowAboutMore(!showAboutMore)
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
    ? h
    : h?.icon || h?.heading;

let IconComponent;

// OLD PREDEFINED AMENITIES
if (PREDEFINED_AMENITY_ICONS[iconKey]) {
  IconComponent =
    PREDEFINED_AMENITY_ICONS[iconKey];
}

// CUSTOM REACT-ICON AMENITIES
else if (ICONS[iconKey]) {
  IconComponent = ICONS[iconKey];
}

// FALLBACK
else {
  IconComponent = Home;
}

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
                    {IconComponent && (
                      <IconComponent
                        size={34}
                        className="text-[#d7b367]"
                      />
                    )}
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

{/* ================= ULTRA PREMIUM CONFIGURATION SECTION ================= */}
{gatedContent?.floorPlans?.length > 0 && (() => {

  // ✅ ACTIVE FLOOR PLAN
  const activeFloorPlan =
    gatedContent.floorPlans?.[activePlan] || {};

  const hasFloorPlanImage =
    activeFloorPlan?.image &&
    activeFloorPlan.image.trim() !== "";

  return (
    <motion.section
      id="configuration"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={staggerContainer}
      className="
        relative
        py-12
        sm:py-14
        md:py-20
        bg-[#f7f3ec]
        overflow-hidden
        "
    >

      {/* SOFT GLOW */}
      <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-[#c9a64b]/10 blur-[130px] rounded-full" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6">

        {/* ================= SECTION LABEL ================= */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center gap-2 sm:gap-3 mb-4"
        >
          <p
            className="text-[#b89149] text-[10px] sm:text-[11px] tracking-[2px] sm:tracking-[3px] uppercase"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
            }}
          >
            {configurationSection?.sectionNumber || "05"}
          </p>

          <div className="w-6 sm:w-8 h-[1px] bg-[#c9a64b]" />

          <p
            className="text-[#2d4137] text-[10px] sm:text-[11px] tracking-[2px] sm:tracking-[3px] uppercase text-center"
            style={{
              fontFamily: "Inter, sans-serif",
            }}
          >
            {configurationSection?.sectionLabel ||
              "Residence Configurations"}
          </p>
        </motion.div>

        {/* ================= TITLE ================= */}
        <motion.h2
          variants={fadeUp}
          className="
            text-center
            text-[#183126]
            text-[28px]
            sm:text-[38px]
            md:text-[56px]
            lg:text-[72px]
            leading-[0.95]
            tracking-[-1px]
            md:tracking-[-2px]
            max-w-[1100px]
            mx-auto
            px-2
          "
          style={{
            fontFamily:
              "Georgia, Times New Roman, serif",
            fontWeight: 400,
          }}
        >
          <span className="block">
            {configurationSection?.titleLine1 ||
              "Residences Tailored"}
          </span>

          <span className="block text-[#b89149] mt-1 sm:mt-2">
            {configurationSection?.titleLine2 ||
              "to Your Lifestyle"}
          </span>
        </motion.h2>

        {/* GOLD DIVIDER */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center gap-3 mt-5 sm:mt-6"
        >
          <div className="w-10 sm:w-14 h-[1px] bg-[#c9a64b]" />

          <div className="w-[5px] h-[5px] rotate-45 border border-[#c9a64b]" />

          <div className="w-10 sm:w-14 h-[1px] bg-[#c9a64b]" />
        </motion.div>

        {/* SUBTEXT */}
        <motion.p
          variants={fadeUp}
          className="
            mt-5
            sm:mt-6
            text-center
            text-[#5d5d5d]
            text-[13px]
            sm:text-[15px]
            md:text-[18px]
            leading-[1.9]
            max-w-[780px]
            mx-auto
            px-2
          "
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 300,
          }}
        >
          {configurationSection?.subheading ||
            "Thoughtfully designed layouts that redefine space, privacy and luxury."}
        </motion.p>

        {/* ================= MAIN CARD ================= */}
        <motion.div
          variants={fadeUp}
          className="
            mt-10
            md:mt-14
            bg-[#f9f7f3]
            border
            border-[#e4dac8]
            rounded-[18px]
            md:rounded-[22px]
            shadow-[0_20px_60px_rgba(0,0,0,0.08)]
            overflow-hidden
          "
        >

         <div className="flex flex-col">

            {/* ================= LEFT TABS ================= */}
            <div className="border-b border-[#e6dccb] bg-[#f5f0e7] overflow-x-auto">

              <div
  className="
    flex
    gap-2
    px-2
    overflow-x-auto
    scrollbar-hide
  "
>

                {gatedContent.floorPlans.map((u, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePlan(i)}
                    className={`
                      group
  relative
  flex-shrink-0
  text-left
  px-5
  sm:px-6
  py-5
  border-r
  border-[#e6dccb]
  transition-all
  duration-300
  min-w-[180px]
  sm:min-w-[220px]
                      ${
                        activePlan === i
                          ? "bg-[#03261d] text-white"
                          : "hover:bg-[#f1eadf]"
                      }
                    `}
                  >

                    {/* ACTIVE BAR */}
                    {activePlan === i && (
                      <div className="absolute left-0 top-0 h-full w-[3px] bg-[#c9a64b]" />
                    )}

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <h3
                          className={`
                            text-[20px]
                            sm:text-[22px]
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
                          {u?.unitType || "Luxury Unit"}
                        </h3>

                        <p
                          className={`
                            text-[12px]
                            sm:text-[13px]
                            ${
                              activePlan === i
                                ? "text-[#d7b367]"
                                : "text-[#666]"
                            }
                          `}
                        >
                          {u?.area || "Luxury Residences"}
                        </p>
                      </div>

                      <div
                        className={`
                          text-[18px]
                          sm:text-[20px]
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
            </div>

            {/* ================= RIGHT CONTENT ================= */}
            <div className="p-5 sm:p-6">

              <div
  className="
    flex
    flex-col-reverse
    gap-8
    items-start
  "
>

                {/* ================= DETAILS ================= */}
                <div>

                  <h3
                    className="
                      text-[#1b3127]
                      text-[28px]
                      sm:text-[34px]
                      md:text-[42px]
                      leading-none
                    "
                    style={{
                      fontFamily:
                        "Georgia, Times New Roman, serif",
                    }}
                  >
                    {activeFloorPlan?.unitType || "Luxury Unit"}
                  </h3>

                  <p
                    className="
                      mt-3
                      text-[#b89149]
                      text-[16px]
                      sm:text-[18px]
                    "
                  >
                    {activeFloorPlan?.area || "Luxury Residences"}
                  </p>

                  <div className="w-14 h-[1px] bg-[#c9a64b] mt-6 sm:mt-7 mb-6 sm:mb-7" />

                  {/* ================= METRICS ================= */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">

                    {[
                      {
                        label: "Bedrooms",
                        value: activeFloorPlan?.bedrooms || "3",
                        icon: "⌂",
                      },
                      {
                        label: "Bathrooms",
                        value: activeFloorPlan?.bathrooms || "3",
                        icon: "◉",
                      },
                      {
                        label: "Balconies",
                        value: activeFloorPlan?.balconies || "2",
                        icon: "▤",
                      },
                      {
                        label: "Price",
                        value: activeFloorPlan?.price || "On Request",
                        icon: "₹",
                      },
                      {
                        label: "Payment Plan",
                        value:
                          activeFloorPlan?.paymentPlan || "Flexible",
                        icon: "◌",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="
                          border-r
                          even:border-r-0
                          sm:even:border-r
                          sm:last:border-r-0
                          border-[#e2d6c2]
                          pr-3
                        "
                      >

                        <div className="text-[#c9a64b] text-[18px] sm:text-[20px] mb-2">
                          {item.icon}
                        </div>

                        <p
                          className="
                            text-[#1f352c]
                            text-[16px]
                            sm:text-[18px]
                            leading-snug
                            break-words
                          "
                          style={{
                            fontFamily:
                              "Georgia, Times New Roman, serif",
                          }}
                        >
                          {item.value}
                        </p>

                        <p
                          className="
                            mt-2
                            text-[#6a6a6a]
                            text-[10px]
                            sm:text-[11px]
                            leading-[1.7]
                            uppercase
                            tracking-[1px]
                          "
                        >
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* ================= FEATURES ================= */}
                  <div className="mt-8 sm:mt-10 space-y-4">

                    {(configurationSection?.features?.length > 0
                      ? configurationSection.features
                      : [
                          "Spacious living & dining area",
                          "Wide balconies for natural light & ventilation",
                          "Master suite with walk-in wardrobe",
                          "Dedicated utility area",
                          "2–3 car parking",
                        ]
                    ).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3"
                      >

                        <div className="mt-[5px] text-[#c9a64b] text-[14px]">
                          ⊚
                        </div>

                        <p
                          className="
                            text-[#4f4f4f]
                            text-[13px]
                            sm:text-[14px]
                            leading-[1.9]
                          "
                        >
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() => setShowModal(true)}
                    className="
                      mt-8
                      sm:mt-10
                      w-full
                      sm:w-auto
                      h-[50px]
                      sm:h-[52px]
                      px-7
                      sm:px-8
                      rounded-[8px]
                      bg-[#03261d]
                      hover:bg-[#0a3328]
                      transition-all
                      duration-300
                      text-white
                      flex
                      items-center
                      justify-center
                      gap-3
                      text-[14px]
                      sm:text-[15px]
                    "
                  >
                    {configurationSection?.buttonText ||
                      "Unlock Floor Plan"}

                    <span className="text-[#d7b367] text-[18px]">
                      →
                    </span>
                  </button>
                </div>

                {/* ================= FLOOR PLAN ================= */}
<div className="relative">

  <div
    className="
      relative
      rounded-[16px]
      md:rounded-[18px]
      border
      border-[#e3d7c5]
      bg-[#f6f2eb]
      p-3
      sm:p-4
      md:p-5
      shadow-[0_12px_35px_rgba(0,0,0,0.06)]
      overflow-hidden
    "
  >

    {/* ================= IF FLOOR PLAN EXISTS ================= */}
    {hasFloorPlanImage ? (

      <img
        src={activeFloorPlan.image}
        alt="floor-plan"
        className="
w-full
h-[220px]
sm:h-[320px]
object-contain
"
      />

    ) : (

      <>
        {/* PLACEHOLDER BLUR */}
        <div className="relative h-[220px] sm:h-[320px] overflow-hidden rounded-[12px] bg-gradient-to-br from-[#f3ede2] to-[#ece3d4]">

          {/* FAKE FLOOR PLAN LINES */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-10 left-10 w-40 h-24 border border-[#cbb58c]" />
            <div className="absolute top-40 left-28 w-56 h-32 border border-[#cbb58c]" />
            <div className="absolute bottom-20 right-20 w-44 h-28 border border-[#cbb58c]" />
          </div>

          {/* BLUR OVERLAY */}
          <div className="absolute inset-0 backdrop-blur-[5px] bg-white/30" />

          {/* LOCK CONTENT */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">

            {/* LOCK ICON */}
            <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/50">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-9 text-[#0b2c23]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 10-8 0v4m-2 0h12a2 2 0 012 2v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5a2 2 0 012-2z"
                />
              </svg>
            </div>

            {/* TITLE */}
            <h4
              className="mt-7 text-[#17342d] text-[22px] sm:text-[28px] md:text-[34px]"
              style={{
                fontFamily:
                  "Georgia, Times New Roman, serif",
              }}
            >
              Unlock Floor Plan
            </h4>


            {/* BUTTON */}
            <button
              onClick={() => setShowModal(true)}
              className="
                mt-7
                h-[52px]
                px-8
                rounded-full
                bg-[#03261d]
                hover:bg-[#0a3328]
                text-white
                text-[14px]
                tracking-[1px]
                uppercase
                flex
                items-center
                gap-3
                transition-all
                duration-300
                shadow-xl
              "
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-[#d7b367]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1V7a5 5 0 00-10 0v4H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>

              Unlock Now
            </button>
          </div>
        </div>
      </>
    )}
  </div>
</div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
})()}

{/* ================= MOBILE GALLERY ================= */}
<div className="block md:hidden">

  <section
    id="gallery"
    className="bg-[#f7f3ee] py-12 overflow-hidden"
  >

    <div className="px-4">

      {/* HEADING */}
      <div className="text-center mb-8">

        <p className="uppercase tracking-[3px] text-[#b58b47] text-[10px] font-semibold mb-3">
          06 | GALLERY
        </p>

        <h2
          className="text-[30px] leading-[1.05] text-[#17342d]"
          style={{
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          A Glimpse Into
          <span className="text-[#b58b47]">
            {" "}Elevated Living
          </span>
        </h2>

        <p className="mt-4 text-[13px] leading-relaxed text-[#6b6b6b]">
          Discover elegant architecture, luxurious interiors,
          lush landscapes and premium experiences.
        </p>

      </div>

      {/* MAIN IMAGE */}
      <div
        onClick={() => {
          setSelectedImage(gallery[0]);
          setSelectedIndex(0);
        }}
        className="mb-3 overflow-hidden rounded-[22px]"
      >
        <img
          src={gallery[0]}
          alt=""
          className="w-full h-[240px] object-cover"
        />
      </div>

      {/* THUMBNAILS */}
      <div className="grid grid-cols-2 gap-3">

        {gallery.slice(1, 5).map((img, i) => (
          <div
            key={i}
            onClick={() => {
              setSelectedImage(img);
              setSelectedIndex(i + 1);
            }}
            className="overflow-hidden rounded-[18px]"
          >
            <img
              src={img}
              alt=""
              className="w-full h-[140px] object-cover"
            />
          </div>
        ))}

      </div>

      {/* MORE PHOTOS */}
      {gallery.length > 5 && (
        <button
          onClick={() => {
            setSelectedImage(gallery[0]);
            setSelectedIndex(0);
          }}
          className="
            mt-5
            w-full
            h-[52px]
            rounded-xl
            bg-[#08211c]
            text-white
            text-[14px]
            font-medium
          "
        >
          View All {gallery.length} Photos
        </button>
      )}

    </div>

  </section>

</div>

{/* ================= LOCATION ADVANTAGES PREMIUM SECTION ================= */}
<motion.section
  id="location"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.15 }}
  variants={staggerContainer}
  className="bg-[#f7f3ee] py-16 md:py-20 overflow-hidden"
>
  <div className="max-w-[1450px] mx-auto px-4 sm:px-5">

    {/* TOP HEADING */}
    <motion.div
      variants={fadeUp}
      className="text-center mb-12 md:mb-14"
    >
      <p className="uppercase tracking-[3px] md:tracking-[4px] text-[#b58b47] text-[11px] sm:text-sm font-medium mb-4">
        {locationData.sectionNumber || "07"} |{" "}
        {locationData.topLabel || "PRIME LOCATION"}
      </p>

      <h2
        className="text-[34px] sm:text-5xl md:text-6xl font-light text-[#17342d] leading-[1.05] md:leading-tight px-2"
        style={{
          fontFamily: "Cormorant Garamond, serif",
        }}
      >
        {locationData.headingLine1 || "A Location That"}{" "}
        <span className="text-[#b58b47]">
          {locationData.headingHighlight || "Defines Privilege."}
        </span>
      </h2>

      <p className="max-w-3xl mx-auto mt-5 md:mt-6 text-[#555] text-[14px] sm:text-base md:text-lg leading-relaxed px-2">
        {locationData.description || coreDetails.title}
      </p>
    </motion.div>

    {/* ================= MAIN GRID ================= */}
    <div className="grid lg:grid-cols-[360px_1fr] gap-5 md:gap-6 items-stretch">

      {/* ================= LEFT SIDE LOCATION CARDS ================= */}
      <motion.div
        variants={fadeLeft}
        className="rounded-[24px] md:rounded-[30px] overflow-hidden border border-[#dcc8a8] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
      >

        {/* TOP HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#08211c] via-[#0f3a30] to-[#123f34] px-5 sm:px-7 md:px-8 py-8 sm:py-10">

          {/* GLOW */}
          <div className="absolute -top-20 -right-20 w-52 h-52 bg-[#d4b071]/20 blur-3xl rounded-full" />

          <div className="relative z-10">
            <p className="uppercase tracking-[3px] md:tracking-[4px] text-[#d4b071] text-[10px] sm:text-xs font-semibold mb-4">
              {locationData.leftCardTag || "Prime Connectivity"}
            </p>

            <h3
              className="text-[34px] sm:text-[42px] md:text-4xl text-white leading-tight font-light"
              style={{
                fontFamily: "Cormorant Garamond, serif",
              }}
            >
              {locationData.leftCardTitleLine1 || "Everything"} <br />
              {locationData.leftCardTitleLine2 || "Within Reach"}
            </h3>

            <p className="text-white/70 mt-5 leading-relaxed text-[13px] sm:text-sm">
              {locationData.leftCardDescription ||
                "Strategically positioned near major business hubs, expressways, hospitals, schools and premium lifestyle destinations."}
            </p>
          </div>
        </div>

        {/* LOCATION LIST */}
        <div className="p-4 sm:p-5 space-y-4 bg-[#fcfaf7] h-full">

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
                className="group relative overflow-hidden rounded-[18px] sm:rounded-[22px] border border-[#eadfce] bg-white p-4 sm:p-5 shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-500"
              >

                {/* GOLD HOVER */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[linear-gradient(120deg,transparent,rgba(212,176,113,0.08),transparent)] translate-x-[-100%] group-hover:translate-x-[100%]" />

                <div className="relative z-10 flex items-center justify-between gap-3 sm:gap-4">

                  {/* LEFT */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">

                    {/* ICON */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#08211c] to-[#123f34] text-[#d4b071] flex items-center justify-center shadow-lg flex-shrink-0 text-sm sm:text-base">

                      {l.icon || "✦"}

                    </div>

                    {/* TEXT */}
                    <div className="min-w-0">
                      <h4 className="text-[#17342d] font-semibold text-[13px] sm:text-[15px] uppercase tracking-wide truncate">
                        {l.name}
                      </h4>

                      <p className="text-[#777] text-[12px] sm:text-sm mt-1 leading-relaxed">
                        {l.subtitle || "Premium Connectivity"}
                      </p>
                    </div>
                  </div>

                  {/* DISTANCE */}
                  <div className="text-right flex-shrink-0">

                    <p className="text-xl sm:text-2xl font-light text-[#b58b47] leading-none">
                      {l.distance}
                    </p>

                    <span className="uppercase tracking-[1.5px] sm:tracking-[2px] text-[9px] sm:text-[10px] text-[#999]">
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
        className="relative rounded-[24px] md:rounded-[34px] overflow-hidden border border-[#dcc8a8] shadow-[0_20px_60px_rgba(0,0,0,0.12)] bg-white flex flex-col h-full"
      >

        {/* MAP TOP BAR */}
        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 px-5 sm:px-6 md:px-7 py-5 border-b border-[#ece2d3] bg-white">

          <div>
            <p className="uppercase tracking-[2px] sm:tracking-[3px] text-[#b58b47] text-[10px] sm:text-xs font-semibold mb-2">
              {locationData.mapSectionTag || "Interactive Location Map"}
            </p>

            <h3
              className="text-[28px] sm:text-3xl text-[#17342d] font-light leading-tight"
              style={{
                fontFamily: "Cormorant Garamond, serif",
              }}
            >
              {locationData.mapSectionTitle || "Discover The Neighborhood"}
            </h3>
          </div>

          {/* BADGE */}
          <div className="flex sm:self-start md:self-auto items-center gap-3 bg-gradient-to-r from-[#08211c] to-[#0f3a30] text-[#d4b071] px-4 sm:px-5 py-3 rounded-2xl border border-[#d4b071]/30 shadow-lg w-fit">

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#d4b071] flex items-center justify-center text-sm sm:text-base">
              ✦
            </div>

            <div>
              <p className="uppercase tracking-[2px] text-[9px] sm:text-[10px]">
                {locationData.badgeTitle || "Prime"}
              </p>

              <p className="text-[12px] sm:text-sm text-white leading-tight">
                {locationData.badgeSubtitle || "Location Advantage"}
              </p>
            </div>
          </div>
        </div>

        {/* MAP */}
        <div className="relative flex-1 min-h-[420px] sm:min-h-[520px] md:min-h-[720px]">

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
            <div className="h-[420px] sm:h-[520px] md:h-[750px] flex items-center justify-center bg-[#08211c] text-white text-sm sm:text-base">
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
            className="absolute left-3 right-3 sm:left-6 sm:right-auto bottom-4 sm:bottom-8 z-20 sm:max-w-sm backdrop-blur-xl bg-white/90 border border-white/60 rounded-[22px] sm:rounded-[28px] p-4 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.18)]"
          >

            <div className="flex items-start gap-3 sm:gap-4">

              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#08211c] to-[#0f3a30] text-[#d4b071] flex items-center justify-center shadow-lg flex-shrink-0 text-lg sm:text-xl">
                ✦
              </div>

              <div>
                <p className="uppercase tracking-[2px] sm:tracking-[3px] text-[#b58b47] text-[10px] sm:text-[11px] font-semibold mb-2">
                  {locationData.floatingCardTag || "Signature Address"}
                </p>

                <h4 className="text-[#17342d] text-[18px] sm:text-xl font-semibold leading-tight">
                  {locationData.floatingCardTitle || "Prime Sector Connectivity"}
                </h4>

                <p className="text-[#666] text-[12px] sm:text-sm mt-3 leading-relaxed">
                  {locationData.floatingCardDescription ||
                    "Positioned in one of the fastest growing luxury corridors with seamless access to major destinations."}
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
      className="mt-6 md:mt-8 rounded-[20px] md:rounded-[24px] overflow-hidden border border-[#c9a96a] bg-gradient-to-r from-[#07211c] to-[#0f3a30]"
    >
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          (locationData.bottomStrip?.length || 0) >= 5
            ? "lg:grid-cols-5"
            : (locationData.bottomStrip?.length || 0) === 4
            ? "lg:grid-cols-4"
            : (locationData.bottomStrip?.length || 0) === 3
            ? "lg:grid-cols-3"
            : "lg:grid-cols-2"
        }`}
      >

        {(locationData.bottomStrip?.length
          ? locationData.bottomStrip
          : [
              {
                title: "Location that enhances life.",
                desc: "Investment that appreciates.",
                icon: "✦",
              },
              {
                title: "Strategically Connected",
                desc: "Seamless access to major hubs and expressways.",
                icon: "✦",
              },
              {
                title: "Thriving Neighborhood",
                desc: "Surrounded by premium communities and landmarks.",
                icon: "✦",
              },
              {
                title: "Future-Ready Development",
                desc:
                  "Infrastructure and growth that future-proofs your investment.",
                icon: "✦",
              },
              {
                title: "High Investment Potential",
                desc:
                  "Prime location ensures long-term value appreciation.",
                icon: "✦",
              },
            ]).map((item, i) => (
          <motion.div
            key={i}
            whileHover={{
              y: -4,
            }}
            className="p-5 sm:p-6 md:p-7 border-b sm:border-b-0 sm:border-r border-white/10 last:border-r-0"
          >
            <div className="flex items-start gap-4">

              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#c9a96a] flex items-center justify-center text-[#d8b06b] flex-shrink-0 text-sm sm:text-base">
                {item.icon || "✦"}
              </div>

              <div>
                <h4 className="text-[#d8b06b] text-[12px] sm:text-sm uppercase tracking-wide font-semibold leading-relaxed">
                  {item.title}
                </h4>

                <p className="text-white/70 text-[12px] sm:text-sm mt-2 leading-relaxed">
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
  <section className="relative bg-[#f7f3ee] py-16 md:py-24 overflow-hidden">

    {/* SOFT PATTERN */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "radial-gradient(circle, #17342d 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />

    <div className="relative z-10 max-w-[1450px] mx-auto px-4 md:px-5">

      {/* ================= HEADING ================= */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="text-center mb-12 md:mb-16"
      >
        <p className="uppercase tracking-[3px] md:tracking-[4px] text-[#b58b47] text-[11px] md:text-sm font-medium mb-4">
          {masterPlanData?.sectionNumber || "08"} |{" "}
          {masterPlanData?.topLabel || "MASTER PLAN"}
        </p>

        <h2
          className="text-[34px] sm:text-5xl md:text-6xl font-light text-[#17342d] leading-[1.08] md:leading-tight"
          style={{
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          {masterPlanData?.headingLine1 || "Crafted With Vision."}

          <span className="text-[#b58b47]">
            {" "}
            {masterPlanData?.headingHighlight ||
              "Designed For Legacy."}
          </span>
        </h2>

        <div className="w-24 h-[1px] bg-[#c8a66a] mx-auto mt-5 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#c8a66a]" />
        </div>

        <p className="max-w-3xl mx-auto mt-6 md:mt-7 text-[#6b6b6b] text-[14px] md:text-base lg:text-lg leading-relaxed px-2 md:px-0">
          {masterPlanData?.description ||
            "Explore the thoughtfully designed master plan featuring elegant layouts, landscaped greens, premium amenities, and seamless connectivity crafted for elevated living."}
        </p>
      </motion.div>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="relative max-w-7xl mx-auto">

        {/* SIDE STRIPS - DESKTOP ONLY */}
        <div className="hidden lg:block absolute inset-y-24 left-0 w-[22%] bg-gradient-to-b from-[#08211c] to-[#0f3a30] rounded-l-[40px]" />

        <div className="hidden lg:block absolute inset-y-24 right-0 w-[22%] bg-gradient-to-b from-[#b58b47] to-[#d4b071] rounded-r-[40px]" />

        {/* MAIN CARD */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          whileHover={{
            y: -6,
          }}
          className="relative z-10 max-w-6xl mx-auto rounded-[26px] md:rounded-[32px] overflow-hidden border border-[#dfd5c8] shadow-[0_20px_60px_rgba(0,0,0,0.12)] bg-white"
        >

          {/* IMAGE WRAPPER */}
          <div className="relative overflow-hidden">

            {/* IMAGE */}
            <img
              src={
                masterPlanData?.imageUrl ||
                media?.gallery?.[0] ||
                media?.heroImageUrl ||
                "/placeholder.jpg"
              }
              alt="Master Plan"
              className="w-full h-[640px] sm:h-[700px] md:h-[720px] object-cover scale-[1.02]"
            />

            {/* OVERLAYS */}
            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

            {/* TOP LABEL */}
            <div className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 z-20">

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 sm:px-5 md:px-6 py-2.5 md:py-3 flex items-center gap-3 max-w-[92vw]">

                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#d4b071] animate-pulse flex-shrink-0" />

                <span className="uppercase tracking-[2px] md:tracking-[3px] text-white text-[9px] sm:text-[10px] md:text-xs font-medium">
                  {masterPlanData?.topBadge ||
                    "Premium Architectural Planning"}
                </span>
              </div>
            </div>

            {/* CENTER CONTENT */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6">

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
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border border-[#d4b071] bg-[#08211c]/70 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(212,176,113,0.35)] mb-6 md:mb-8"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border border-[#d4b071]/70 flex items-center justify-center">

                  <span className="text-[#d4b071] text-3xl sm:text-4xl md:text-5xl">
                    {masterPlanData?.centerIcon || "✦"}
                  </span>
                </div>
              </motion.div>

              {/* TITLE */}
              <h3
                className="text-white text-[38px] sm:text-5xl md:text-7xl font-light leading-[1.05] md:leading-tight"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                {masterPlanData?.centerTitle ||
                  "The Master Plan"}
              </h3>

              <p className="max-w-2xl mx-auto mt-5 md:mt-6 text-white/80 text-[14px] sm:text-[16px] md:text-lg leading-relaxed px-2">
                {masterPlanData?.centerDescription ||
                  "Every space is carefully envisioned to create harmony between luxury, comfort, and timeless architecture."}
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
                className="mt-7 md:mt-10 bg-gradient-to-r from-[#08211c] to-[#0f3a30] border border-[#d4b071] hover:shadow-[0_0_35px_rgba(212,176,113,0.35)] transition-all duration-300 text-[#e0bd7d] px-6 sm:px-8 md:px-10 py-4 md:py-5 rounded-2xl flex items-center gap-3 md:gap-5 uppercase tracking-[1.5px] md:tracking-[2px] text-[11px] md:text-sm font-semibold w-full sm:w-auto justify-center max-w-[320px]"
              >

                {/* ICON */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#d4b071] flex items-center justify-center flex-shrink-0">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 md:w-6 md:h-6"
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
                  {masterPlanData?.buttonText ||
                    "View Master Plan"}
                </span>

                {/* ARROW */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 md:w-5 md:h-5"
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

            {/* ================= DESKTOP BOTTOM INFO STRIP ================= */}
            <div className="hidden md:block absolute bottom-0 left-0 w-full bg-gradient-to-r from-[#08211c]/95 to-[#0f3a30]/95 backdrop-blur-md border-t border-white/10 z-20">

              <div
                className={`grid md:grid-cols-${
                  masterPlanData?.bottomStrip?.length || 4
                }`}
              >

                {(masterPlanData?.bottomStrip || []).map(
                  (item, i) => (
                    <div
                      key={i}
                      className="p-6 border-r border-white/10 last:border-r-0"
                    >
                      <div className="flex items-start gap-4">

                        {/* ICON */}
                        <div className="w-11 h-11 rounded-full border border-[#d4b071] flex items-center justify-center text-[#d4b071] flex-shrink-0">
                          {item.icon || "✦"}
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
                  )
                )}

                {/* FALLBACK STATIC */}
                {(!masterPlanData?.bottomStrip ||
                  masterPlanData.bottomStrip.length === 0) && (
                  <>
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

                          <div className="w-11 h-11 rounded-full border border-[#d4b071] flex items-center justify-center text-[#d4b071] flex-shrink-0">
                            ✦
                          </div>

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
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= MOBILE FEATURES ================= */}
        <div className="md:hidden mt-5 grid grid-cols-1 gap-3">

          {(masterPlanData?.bottomStrip?.length
            ? masterPlanData.bottomStrip
            : [
                {
                  title: "Thoughtful Layouts",
                  desc: "Optimized space planning",
                  icon: "✦",
                },
                {
                  title: "Landscape Greens",
                  desc: "Open green environments",
                  icon: "✦",
                },
                {
                  title: "Premium Amenities",
                  desc: "Luxury lifestyle experiences",
                  icon: "✦",
                },
                {
                  title: "Future-Ready Living",
                  desc: "Modern & sustainable planning",
                  icon: "✦",
                },
              ]).map((item, i) => (
            <div
              key={i}
              className="bg-gradient-to-r from-[#08211c] to-[#0f3a30] border border-[#d4b071]/20 rounded-[20px] p-5 shadow-lg"
            >
              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-full border border-[#d4b071] flex items-center justify-center text-[#d4b071] flex-shrink-0">
                  {item.icon || "✦"}
                </div>

                <div>
                  <h4 className="text-[#d4b071] uppercase tracking-wide text-[13px] font-semibold">
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
  </section>
)}

{/* ================= PREMIUM FAQ SECTION ================= */}
{faqs.filter((f) => f.question).length > 0 && (
  <section
    id="contact"
    className="relative bg-[#f7f3ee] py-24 overflow-hidden"
  >

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
          {(faqSection?.sectionNumber || "10")} |{" "}
          {(faqSection?.topLabel || "FAQ")}
        </p>

        <h2
          className="text-4xl md:text-6xl font-light text-[#17342d] leading-tight"
          style={{
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          {faqSection?.heading ||
            "Frequently Asked Questions"}
        </h2>

        <div className="w-24 h-[1px] bg-[#c8a66a] mx-auto mt-5 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#c8a66a]" />
        </div>

        <p className="max-w-2xl mx-auto mt-7 text-[#6b6b6b] text-base leading-relaxed">
          {faqSection?.subheading ||
            "Find answers to common questions about the project and your journey to your dream home."}
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
          className="rounded-[24px] overflow-hidden border border-[#dfd5c8] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        >

          {/* IMAGE */}
          <div className="relative h-[380px] overflow-hidden group">

            {/* DEVELOPER IMAGE */}
            <img
              src={
                developerImage ||
                "/location6.webp"
              }
              alt={developerName}
              className="w-full h-full object-cover transition duration-[2500ms] group-hover:scale-110"
            />

            {/* PREMIUM OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

            {/* GOLDEN GLOW */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,177,111,0.18),transparent_60%)]" />

            {/* CONTENT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">

              {/* LOGO */}
              {developerLogo && (
                <div className="relative mb-6">

                  {/* OUTER RING */}
                  <div className="absolute inset-0 rounded-full border border-[#d6b16f]/30 scale-125 animate-pulse" />

                  {/* LOGO HOLDER */}
                  <div className="w-28 h-28 rounded-full border border-[#d6b16f] bg-white/10 backdrop-blur-xl flex items-center justify-center overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.35)]">

                    <img
                      src={developerLogo}
                      alt={developerName}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* DEVELOPER NAME */}
              <h3
                className="text-4xl md:text-5xl xl:text-6xl text-white font-light leading-tight drop-shadow-[0_5px_25px_rgba(0,0,0,0.5)]"
                style={{
                  fontFamily:
                    "Cormorant Garamond, serif",
                }}
              >
                {developerName}
              </h3>

              {/* GOLD LINE */}
              <div className="w-24 h-[1px] bg-[#d6b16f] my-5 relative">

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-[#d6b16f]" />
              </div>

              {/* SUBTEXT */}
              <p className="uppercase tracking-[6px] text-xs md:text-sm text-[#f0d29a] font-semibold">
                Luxury Developer
              </p>
            </div>
          </div>

          {/* CONTACT BOX */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#08211c] via-[#0c2d25] to-[#0f3a30] p-8 text-white">

            {/* BACKGROUND GLOW */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#d6b16f]/10 blur-3xl rounded-full" />

            <div className="relative z-10 flex items-start gap-5">

              {/* ICON */}
              <div className="w-16 h-16 rounded-full border border-[#c8a66a] bg-white/5 backdrop-blur-md flex items-center justify-center text-[#d6b16f] flex-shrink-0 shadow-lg">

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
              <div className="flex-1">

                <h4
                  className="text-3xl font-light"
                  style={{
                    fontFamily:
                      "Cormorant Garamond, serif",
                  }}
                >
                  {faqSection?.contactTitle ||
                    "Still have questions?"}
                </h4>

                <p className="text-white/70 text-sm leading-relaxed mt-3 max-w-md">
                  {faqSection?.contactDescription ||
                    "Connect with our luxury property specialists and discover every detail crafted for elevated living."}
                </p>

                {/* CONTACT DETAILS */}
                <div className="mt-6 space-y-4">

                  <div className="flex items-center gap-3 text-sm">

                    <div className="w-7 h-7 rounded-full bg-[#d6b16f]/10 border border-[#d6b16f]/30 flex items-center justify-center text-[#d6b16f] text-xs">
                      ✦
                    </div>

                    <span className="text-white/90">
                      {faqSection?.contactPhone ||
                        "+91 90901 06101"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">

                    <div className="w-7 h-7 rounded-full bg-[#d6b16f]/10 border border-[#d6b16f]/30 flex items-center justify-center text-[#d6b16f] text-xs">
                      ✦
                    </div>

                    <span className="text-white/90">
                      {faqSection?.contactTiming ||
                        "Monday — Sunday | 10 AM — 7 PM"}
                    </span>
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
                {faqSection?.ctaTitle ||
                  "Ready to experience your dream home?"}
              </h3>

              <p className="text-[#777] mt-2 leading-relaxed">
                {faqSection?.ctaDescription ||
                  "Book a site visit and take the first step towards your dream home."}
              </p>
            </div>
          </div>

          {/* BUTTON */}
          <div className="border-l border-[#e5ddd2] p-6">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-[#08211c] to-[#0f3a30] hover:scale-[1.03] transition-all duration-300 text-[#d6b16f] px-10 py-4 rounded-xl flex items-center gap-4 uppercase tracking-wide text-sm font-semibold shadow-lg"
            >
              {faqSection?.ctaButtonText ||
                "Book A Site Visit"}

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

{/* ================= DEVELOPER PROJECTS PREMIUM SECTION ================= */}
{developerProjects.length > 0 && (
  <section className="relative bg-[#f7f3ee] py-28 overflow-hidden">

    {/* BACKGROUND PATTERN */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "radial-gradient(circle, #17342d 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />

    {/* GOLD GLOW */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[320px] bg-[#d4b071]/10 blur-3xl rounded-full" />

    {/* SIDE GLOW */}
    <div className="absolute right-0 top-1/3 w-[300px] h-[300px] bg-[#17342d]/[0.04] blur-3xl rounded-full" />

    <div className="relative z-10 max-w-[1500px] mx-auto px-5">

      {/* ================= MAIN HEADING ================= */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="text-center mb-20"
      >

        <div className="inline-flex items-center gap-4 mb-6">

          <div className="w-14 h-[1px] bg-[#c8a66a]" />

          <p className="uppercase tracking-[5px] text-[#b58b47] text-xs md:text-sm font-medium">
            10 | Developer Portfolio
          </p>

          <div className="w-14 h-[1px] bg-[#c8a66a]" />
        </div>

        <h2
          className="text-5xl md:text-7xl leading-[1.05] font-light text-[#17342d]"
          style={{
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          More Signature Creations By

          <span className="block text-[#b58b47] mt-2">
            {developerName}
          </span>
        </h2>

        <div className="w-28 h-[1px] bg-[#c8a66a] mx-auto mt-7 relative">

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-[#c8a66a]" />
        </div>

      </motion.div>

      {/* ================= ABOUT DEVELOPER ================= */}
      {developerDescription && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-28"
        >

          <div className="relative overflow-hidden rounded-[42px] border border-[#ddd2c4] bg-gradient-to-br from-white via-[#fcfaf7] to-[#f5ede1] shadow-[0_30px_80px_rgba(0,0,0,0.08)]">

            {/* GOLD TOP LINE */}
            <div className="h-[4px] w-full bg-gradient-to-r from-[#b58b47] via-[#f0cf92] to-[#b58b47]" />

            {/* DECOR */}
            <div className="absolute -top-32 right-0 w-[340px] h-[340px] bg-[#d4b071]/10 blur-3xl rounded-full" />

            <div className="absolute bottom-0 left-0 w-[260px] h-[260px] bg-[#17342d]/[0.03] blur-3xl rounded-full" />

            <div className="relative z-10 p-7 md:p-14 lg:p-16">

              <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">

                {/* ================= LEFT ================= */}
                <div>

                  {/* LABEL */}
                  <div className="inline-flex items-center gap-3 mb-6">

                    <div className="w-10 h-[1px] bg-[#c8a66a]" />

                    <p className="uppercase tracking-[4px] text-[#b58b47] text-xs font-medium">
                      About The Developer
                    </p>
                  </div>

                  {/* HEADING */}
                  <h2
                    className="text-5xl md:text-6xl leading-[1.05] font-light text-[#17342d]"
                    style={{
                      fontFamily:
                        "Cormorant Garamond, serif",
                    }}
                  >
                    The Legacy Of

                    <span className="block text-[#b58b47] mt-2">
                      {developerName}
                    </span>
                  </h2>

                  {/* DIVIDER */}
                  <div className="w-24 h-[1px] bg-[#c8a66a] mt-8 mb-8 relative">

                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#c8a66a]" />
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-[#5f5f5f] text-[16px] md:text-[18px] leading-[2.1] whitespace-pre-line font-light max-w-3xl">
                    {developerDescription}
                  </p>

                  
                </div>

                {/* ================= RIGHT IMAGE ================= */}
                <div className="relative">

                  <div className="relative overflow-hidden rounded-[36px] border border-[#dccfbf] bg-[#17342d] h-[580px] shadow-[0_30px_70px_rgba(0,0,0,0.18)]">

                    {/* IMAGE */}
                    {developerImage ? (
                      <img
                        src={developerImage}
                        alt={developerName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f2c26] to-[#17342d]">

                        <Building2
                          className="text-[#d4b071]"
                          size={90}
                        />
                      </div>
                    )}

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081b18] via-[#081b18]/20 to-transparent" />

                    {/* LOGO */}
                    {developerLogo && (
                      <div className="absolute top-7 left-7 w-24 h-24 rounded-[24px] bg-white/90 backdrop-blur-md border border-white/40 flex items-center justify-center p-3 shadow-2xl">

                        <img
                          src={developerLogo}
                          alt={developerName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    {/* BOTTOM CARD */}
                    <div className="absolute bottom-7 left-7 right-7">

                      <div className="rounded-[30px] border border-white/10 bg-white/10 backdrop-blur-xl p-7">

                        <p className="text-white/60 text-[10px] uppercase tracking-[3px] mb-3">
                          Signature Developments
                        </p>

                        <h3
                          className="text-white text-3xl md:text-4xl leading-tight font-light"
                          style={{
                            fontFamily:
                              "Cormorant Garamond, serif",
                          }}
                        >
                          Crafted With Vision,
                          Elegance & Trust
                        </h3>

                        <div className="w-16 h-[1px] bg-[#d4b071] mt-6 relative">

                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#d4b071]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ================= OTHER PROJECTS HEADING ================= */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="text-center mb-16"
      >
        <h2
          className="text-4xl md:text-6xl leading-[1.1] font-light text-[#17342d]"
          style={{
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          Other Landmark Projects By

          <span className="block text-[#b58b47] mt-2">
            {developerName}
          </span>
        </h2>

        <div className="w-24 h-[1px] bg-[#c8a66a] mx-auto mt-6 relative">

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#c8a66a]" />
        </div>
      </motion.div>

      {/* ================= PROJECT GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">

        {developerProjects
          .slice(0, 4)
          .map((project, i) => (

            <motion.div
              key={project._id || i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              whileHover={{
                y: -10,
              }}
              className="group relative rounded-[34px] overflow-hidden border border-[#ddd2c4] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)] transition-all duration-700"
            >

              {/* IMAGE */}
              <div className="relative h-[460px] overflow-hidden">

                <img
                  src={
                    project?.media?.heroImageUrl ||
                    "/placeholder.jpg"
                  }
                  alt={
                    project?.coreDetails?.title
                  }
                  className="w-full h-full object-cover transition duration-[2500ms] group-hover:scale-110"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#081b18] via-[#081b18]/35 to-transparent" />

                {/* BADGE */}
                <div className="absolute top-6 left-6 z-20">

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-2">

                    <div className="w-2 h-2 rounded-full bg-[#d4b071] animate-pulse" />

                    <span className="uppercase tracking-[2px] text-white text-[10px] font-medium">
                      Premium Development
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">

                  {/* LOCATION */}
                  <div className="mb-6">

                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full">

                      <MapPin className="w-3.5 h-3.5 text-[#e0bd7d]" />

                      <span className="text-white text-[11px] uppercase tracking-[2px] font-medium">

                        {getShortLocation(
                          project?.locationData?.locationName
                        )}

                      </span>
                    </div>
                  </div>

                  {/* TITLE */}
                  <div>

                    <h3
                      className="text-white text-[32px] md:text-[36px] leading-[1.08] font-light tracking-wide"
                      style={{
                        fontFamily:
                          "Cormorant Garamond, serif",
                      }}
                    >
                      {project?.coreDetails?.title}
                    </h3>

                    <div className="w-16 h-[1px] bg-[#d4b071] mt-5 mb-7 relative">

                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#d4b071]" />
                    </div>
                  </div>

                  {/* BOTTOM */}
                  <div className="flex items-end justify-between gap-4">

                    {/* PRICE */}
                    <div>

                      <p className="text-white/40 text-[10px] uppercase tracking-[3px] mb-2">
                        Starting Price
                      </p>

                      <h4 className="text-[#f0cf92] text-[28px] font-semibold tracking-wide">
                        ₹{" "}
                        {formatPrice(
                          project?.coreDetails?.startingPrice
                        )}
                      </h4>
                    </div>

                    {/* BUTTON */}
                    <div className="group/button shrink-0 w-14 h-14 rounded-full border border-[#d4b071]/70 bg-white/5 backdrop-blur-md flex items-center justify-center text-[#d4b071] hover:bg-[#d4b071] hover:text-[#08211c] transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 group-hover/button:translate-x-0.5 transition duration-300"
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
                    </div>
                  </div>
                </div>

                {/* LINK */}
                <Link
                  href={`/${project.slug}`}
                  className="absolute inset-0 z-30"
                />
              </div>
            </motion.div>
          ))}
      </div>

      {/* ================= CTA ================= */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="mt-20 flex justify-center"
      >

        <Link
          href={`/developers/${developerName
            ?.toLowerCase()
            ?.replace(/\s+/g, "-")}`}
          className="group relative overflow-hidden bg-gradient-to-r from-[#08211c] to-[#0f3a30] border border-[#d4b071] hover:shadow-[0_0_40px_rgba(212,176,113,0.3)] transition-all duration-500 px-10 md:px-14 py-5 rounded-[24px] flex items-center gap-5"
        >

          {/* SHINE */}
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)] translate-x-[-120%] group-hover:translate-x-[120%] transition duration-1000" />

          {/* ICON */}
          <div className="relative z-10 w-12 h-12 rounded-full border border-[#d4b071] flex items-center justify-center text-[#d4b071]">

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

          {/* TEXT */}
          <div className="relative z-10 text-left">

            <p className="text-white/50 text-[11px] uppercase tracking-[3px] mb-1">
              Explore Complete Portfolio
            </p>

            <h4 className="text-[#e0bd7d] text-sm md:text-base uppercase tracking-[2px] font-semibold">
              View All Projects By {developerName}
            </h4>
          </div>

          {/* ARROW */}
          <div className="relative z-10 text-[#d4b071] group-hover:translate-x-1 transition duration-300">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
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
          </div>
        </Link>
      </motion.div>
    </div>
  </section>
)}
  {/* ================= PREMIUM LEAD MODAL ================= */}
{showModal && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">

    {/* BACKDROP */}
    <div
      className="
        absolute
        inset-0
        bg-black/65
        backdrop-blur-sm
      "
      onClick={() => setShowModal(false)}
    />

    {/* MODAL */}
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.4,
      }}
      className="
        relative
        w-[92%]
        max-w-md
        overflow-hidden
        rounded-[24px]
        border
        border-white/10
        bg-[rgba(7,10,10,0.58)]
        backdrop-blur-3xl
        shadow-[0_20px_80px_rgba(0,0,0,0.55)]
      "
    >

      {/* PREMIUM GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,166,75,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(201,166,75,0.10),transparent_30%)]" />

      {/* BORDER SHINE */}
      <div className="absolute inset-0 rounded-[24px] border border-white/5" />

      {/* ================= HEADER ================= */}
      <div className="relative z-10 px-6 pt-6 pb-5 border-b border-white/10">

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setShowModal(false)}
          className="
            absolute
            right-5
            top-5
            w-8
            h-8
            rounded-full
            bg-white/5
            border
            border-white/10
            flex
            items-center
            justify-center
            text-white/70
            hover:text-white
            hover:bg-white/10
            transition-all
            duration-300
          "
        >
          ✕
        </button>

        {/* TOP LABEL */}
        <div className="flex items-center gap-3 mb-4">

          <div className="w-10 h-[1px] bg-[#d8b46b]" />

          <p
            className="
              text-[#d8b46b]
              text-[10px]
              tracking-[3px]
              uppercase
            "
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
            }}
          >
            Private Access
          </p>
        </div>

        {/* TITLE */}
        <h2
          className="
            text-white
            text-[34px]
            leading-[1]
            tracking-[-1.5px]
          "
          style={{
            fontFamily:
              "Georgia, Times New Roman, serif",
            fontWeight: 400,
          }}
        >
          Download
          <br />
          Brochure
        </h2>

        {/* DESCRIPTION */}
        <p
          className="
            mt-4
            text-white/60
            text-[13px]
            leading-[1.9]
            max-w-[320px]
          "
          style={{
            fontFamily: "Inter, sans-serif",
          }}
        >
          Get instant access to pricing, floor plans,
          payment details and exclusive inventory.
        </p>
      </div>

      {/* ================= FORM ================= */}
      <div className="relative z-10 px-6 py-6 space-y-5">

        {/* NAME FIELD */}
        <div>

          <label
            className="
              block
              mb-2
              text-[10px]
              tracking-[2px]
              uppercase
              text-[#d8b46b]
            "
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
            }}
          >
            Full Name
          </label>

          <input
            type="text"
            value={leadName}
            onChange={(e) =>
              setLeadName(e.target.value)
            }
            placeholder="Enter your full name"
            className="
              w-full
              h-[52px]
              px-4
              rounded-[12px]
              border
              border-white/10
              bg-white/5
              backdrop-blur-xl
              text-white
              placeholder:text-white/30
              outline-none
              transition-all
              duration-300
              focus:border-[#d8b46b]
              focus:bg-white/[0.07]
            "
            style={{
              fontFamily: "Inter, sans-serif",
            }}
          />
        </div>

        {/* PHONE FIELD */}
        <div>

          <label
            className="
              block
              mb-2
              text-[10px]
              tracking-[2px]
              uppercase
              text-[#d8b46b]
            "
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
            }}
          >
            Mobile Number
          </label>

          <div
            className="
              flex
              items-center
              h-[52px]
              rounded-[12px]
              border
              border-white/10
              bg-white/5
              backdrop-blur-xl
              overflow-hidden
              transition-all
              duration-300
              focus-within:border-[#d8b46b]
            "
          >

            {/* COUNTRY CODE */}
            <div
              className="
                h-full
                px-4
                flex
                items-center
                border-r
                border-white/10
                text-white/70
                text-sm
              "
              style={{
                fontFamily: "Inter, sans-serif",
              }}
            >
              🇮🇳 +91
            </div>

            {/* INPUT */}
            <input
              type="tel"
              value={leadPhone}
              onChange={(e) =>
                setLeadPhone(e.target.value)
              }
              placeholder="Enter mobile number"
              className="
                flex-1
                h-full
                bg-transparent
                px-4
                text-white
                placeholder:text-white/30
                outline-none
              "
              style={{
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>
        </div>

        {/* CTA BUTTON */}
        <button
          onClick={handleLeadSubmit}
          disabled={submitting}
          className="
            group
            relative
            overflow-hidden
            w-full
            h-[52px]
            rounded-[12px]
            bg-[#c9a64b]
            text-[#111]
            text-[10px]
            tracking-[2px]
            uppercase
            font-semibold
            transition-all
            duration-300
            hover:brightness-110
            shadow-[0_10px_30px_rgba(201,166,75,0.28)]
          "
          style={{
            fontFamily: "Inter, sans-serif",
          }}
        >

          {/* HOVER SHINE */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-300" />

          <div className="relative flex items-center justify-center gap-2">

            {submitting ? (
              "Processing..."
            ) : (
              <>
                DOWNLOAD BROCHURE
                <span>→</span>
              </>
            )}
          </div>
        </button>

        {/* TRUST TEXT */}
        <p
          className="
            text-center
            text-white/40
            text-[11px]
            tracking-[1px]
            pt-1
          "
          style={{
            fontFamily: "Inter, sans-serif",
          }}
        >
          Your information remains completely private.
        </p>
      </div>
    </motion.div>
  </div>
)}
    </div>
  );
}
