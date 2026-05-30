"use client";

import React, { useState, useEffect } from "react";
import StepMedia from "./StepMedia";
import { useRouter } from "next/navigation";
import PropertyPreview from "./PropertyPreview";
import toast from "react-hot-toast";
import HeroImageUpload from "./HeroImageUpload";

import {
  Waves,
  Dumbbell,
  Building2,
  Trees,
  Car,
  ArrowUpDown,
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
  Phone,
  Wind,
} from "lucide-react";

// ✅ Amenities with icons
// ✅ Amenities with icons
const AMENITIES = [
  { name: "Swimming Pool", icon: Waves },
  { name: "Gym", icon: Dumbbell },
  { name: "Clubhouse", icon: Building2 },
  { name: "Garden", icon: Trees },
  { name: "Parking", icon: Car },
  { name: "Lift", icon: ArrowUpDown },
  { name: "Security", icon: ShieldCheck },
  { name: "Power Backup", icon: Zap },
  { name: "Balcony", icon: Home },
  { name: "Kids Play Area", icon: Baby },
  { name: "Jogging Track", icon: Footprints },
  { name: "CCTV", icon: Camera },
  { name: "Indoor Games", icon: Gamepad2 },
  { name: "Spa", icon: Sparkles },
  { name: "Shopping Center", icon: ShoppingBag },
  { name: "WiFi", icon: Wifi },
  { name: "Fire Safety", icon: ShieldCheck },
  { name: "Rainwater Harvesting", icon: Trees },
  { name: "Intercom", icon: Phone },
  { name: "Air Conditioning", icon: Wind },
];

const CUSTOM_ICONS = [
  { name: "Home", icon: Home },
  { name: "Swimming", icon: Waves },
  { name: "Gym", icon: Dumbbell },
  { name: "Club", icon: Building2 },
  { name: "Garden", icon: Trees },
  { name: "Parking", icon: Car },
  { name: "Lift", icon: ArrowUpDown },
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

export default function AddProperty() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [form, setForm] = useState({
  slug: "",

  marketType: "Primary",

  // ================= CORE DETAILS =================
  coreDetails: {
    title: "",

    developerRef: "",

    developerName: "",

    developerLogo: "",

    developerImage: "",

    startingPrice: "",

    maxPrice: "",
  },

  // ================= CATEGORY =================
  categoryData: {
    categoryRef: "",

    categoryName: "",

    customCategory: "",
  },

  // ================= HERO SECTION =================
  heroSection: {
    propertyStatus: "PRIVATE DIGITAL MANDATE",

    heroDescription: "",

    brochureButtonText: "DOWNLOAD BROCHURE",

    videoButtonText: "WATCH PROJECT VIDEO",

    taglineItems: [
      "Ultra-Luxury Residences",
      "Low-Density Living",
      "Exclusive Community",
    ],
  },

  // ================= KEY METRICS =================
  keyMetrics: {
    landArea: "",

    possession: "",

    status: "",

    totalUnits: "",

    totalTowers: "",

    floors: "",

    reraNumber: "",
  },

  // ================= OVERVIEW =================
  overview: {

    // ABOUT SECTION
    aboutSectionNumber: "02",

    aboutLabel: "About The Project",

    aboutTitleLine1: "A Vision That",

    aboutTitleLine2: "Transcends the Ordinary",

    description: "",

    aboutParagraph2: "",

    aboutImageUrl: "",

    // FEATURE BAR
    featureBar: [],

    // HIGHLIGHTS
    highlightsHeading: "Crafted for Elevated",

    highlightsSubheading: "Modern Living",

    highlights: [],

    amenities: [],

    // QUOTE
    highlightQuote: "",

    // AMENITIES
    amenitiesSectionNumber: "04",

    amenitiesSectionLabel: "Project Amenities",

    amenitiesHeadingLine1: "Every Detail.",

    amenitiesHeadingLine2: "Elevated",

    amenitiesHeadingLine3: "Beyond Expectation.",

    amenitiesSubheading: "",

    // BOTTOM STRIP
    bottomStripTitle1: "Thoughtfully by Design.",

    bottomStripTitle2: "Crafted for the Exceptional.",

    bottomStripFeature1: "Premium Specifications",

    bottomStripFeature2: "Finest Quality Materials",

    bottomStripFeature3:
      "Curated for Discerning Families",
  },

  // ================= CONFIGURATION SECTION =================
  configurationSection: {

    sectionNumber: "05",

    sectionLabel: "Residence Configurations",

    titleLine1: "Residences Tailored",

    titleLine2: "to Your Lifestyle",

    subheading:
      "Thoughtfully designed layouts that redefine space, privacy and luxury.",

    features: [],

    buttonText: "View Details",
  },

  // ================= UNIT CONFIGURATIONS =================
  unitConfigurations: [
    {
      unitType: "",

      area: "",

      price: "",

      paymentPlan: "",

      bedrooms: "",

      bathrooms: "",

      balconies: "",
    },
  ],

  // ================= MEDIA =================
  media: {
    heroImageUrl: "",

    gallery: [],

    walkthroughUrl: "",
  },

  // ================= LOCATION DATA =================
  locationData: {

    // BASIC
    locationRef: "",

    locationName: "",

    customLocation: "",

    address: "",

    mapEmbedUrl: "",

    // SECTION HEADER
    sectionNumber: "07",

    topLabel: "PRIME LOCATION",

    headingLine1: "A Location That",

    headingHighlight: "Defines Privilege.",

    description: "",

    // LEFT CARD
    leftCardTag: "Prime Connectivity",

    leftCardTitleLine1: "Everything",

    leftCardTitleLine2: "Within Reach",

    leftCardDescription:
      "Strategically positioned near major business hubs, expressways, hospitals, schools and premium lifestyle destinations.",

    // MAP SECTION
    mapSectionTag: "Interactive Location Map",

    mapSectionTitle: "Discover The Neighborhood",

    // BADGE
    badgeTitle: "Prime",

    badgeSubtitle: "Location Advantage",

    // FLOATING CARD
    floatingCardTag: "Signature Address",

    floatingCardTitle: "Prime Sector Connectivity",

    floatingCardDescription:
      "Positioned in one of the fastest growing luxury corridors with seamless access to major destinations.",

    // LANDMARKS
    landmarks: [
      {
        name: "",

        distance: "",

        subtitle: "Premium Connectivity",

        icon: "✦",
      },
    ],

    // BOTTOM STRIP
    bottomStrip: [
      {
        title: "Location that enhances life.",

        desc: "Investment that appreciates.",

        icon: "✦",
      },

      {
        title: "Strategically Connected",

        desc:
          "Seamless access to major hubs and expressways.",

        icon: "✦",
      },

      {
        title: "Thriving Neighborhood",

        desc:
          "Surrounded by premium communities and landmarks.",

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
    ],
  },

  // ================= MASTER PLAN SECTION =================
  masterPlanSection: {

    sectionNumber: "08",

    topLabel: "MASTER PLAN",

    headingLine1: "Crafted With Vision.",

    headingHighlight: "Designed For Legacy.",

    description:
      "Explore the thoughtfully designed master plan featuring elegant layouts, landscaped greens, premium amenities, and seamless connectivity crafted for elevated living.",

    enableSideStrips: true,

    topFloatingLabel:
      "Premium Architectural Planning",

    centerTitle: "The Master Plan",

    centerDescription:
      "Every space is carefully envisioned to create harmony between luxury, comfort, and timeless architecture.",

    buttonText: "View Master Plan",

    masterPlanImage: "",

    bottomStrip: [
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
    ],
  },

  // ================= GATED CONTENT =================
  gatedContent: {

    brochurePdfUrl: "",

    requireLogin: true,

    floorPlans: [
      {
        unitType: "",

        area: "",

        price: "",

        paymentPlan: "",

        bedrooms: "",

        bathrooms: "",

        balconies: "",

        image: "",
      },
    ],
  },

  // ================= SEO =================
  seoEngine: {
    metaTitle: "",

    metaDescription: "",
  },


  // ================= FAQS =================
  faqSection: {

  sectionNumber: "09",

  topLabel: "FAQ",

  headingLine1: "Frequently Asked Questions",

  headingHighlight: "",

  description:
    "Find answers to common questions about the project and your journey to your dream home.",

  developerLabel: "Luxury Developer",

  contactTitle: "Still have questions?",

  contactDescription:
    "Connect with our luxury property specialists and discover every detail crafted for elevated living.",

  phone: "+91 99999 99999",

  timing: "Monday — Sunday | 10 AM — 7 PM",

  ctaTitle:
    "Ready to experience your dream home?",

  ctaDescription:
    "Book a site visit and take the first step towards your dream home.",

  ctaButtonText: "Book A Site Visit",

  callLabel: "Call Us",

  whatsappLabel: "WhatsApp",
},

});

    const [previewData, setPreviewData] = useState(form);
    const [previewMode, setPreviewMode] = useState(false);
    const [developers, setDevelopers] = useState([]);
    const [useCustomDeveloper, setUseCustomDeveloper] = useState(false);
    const [locations, setLocations] = useState([]);
    const [useCustomLocation, setUseCustomLocation] = useState(false);
    const [categories, setCategories] = useState([]);
    const [useCustomCategory, setUseCustomCategory] = useState(false);
    const [customAmenity, setCustomAmenity] = useState("");
    const [fullFormMode, setFullFormMode] = useState(false);
    const [selectedCustomIcon, setSelectedCustomIcon] = useState("Home");
    const [uploading, setUploading] = useState(false);
    const [
  customAmenitySubheading,
  setCustomAmenitySubheading,
] = useState("");
const [errors, setErrors] = useState({});
const [errorList, setErrorList] = useState([]);

    const API = "https://property-bouquet-backend.onrender.com/api";

    useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/categories`);
      const data = await res.json();

      if (res.ok) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchCategories();
}, []);

    useEffect(() => {
  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API}/locations/tree`);
      const data = await res.json();

      if (res.ok) {
        setLocations(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchLocations();
}, []);

    useEffect(() => {
  const fetchDevelopers = async () => {
    try {
      const res = await fetch(`${API}/developers`);
      const data = await res.json();

      if (res.ok) {
        setDevelopers(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchDevelopers();
}, []);

  useEffect(() => {
  const t = setTimeout(() => {
    setPreviewData(form);
  }, 200);

  return () => clearTimeout(t);
}, [form]);

const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

// ================= NAVIGATION =================
const goNext = () => {

  const missing = [];

  // ================= STEP 1 VALIDATION =================
  if (step === 1) {

    // SLUG
    if (!form.slug?.trim()) {
      missing.push({
        path: "slug",
        label: "Slug",
      });
    }

    // TITLE
    if (!form.coreDetails.title?.trim()) {
      missing.push({
        path: "coreDetails.title",
        label: "Project Title",
      });
    }

    // ================= DEVELOPER VALIDATION =================
    if (useCustomDeveloper) {

      if (!form.coreDetails.developerName?.trim()) {
        missing.push({
          path: "coreDetails.developerRef",
          label: "Developer",
        });
      }

    } else {

      if (!form.coreDetails.developerRef?.trim()) {
        missing.push({
          path: "coreDetails.developerRef",
          label: "Developer",
        });
      }
    }

    // ================= LOCATION VALIDATION =================
if (useCustomLocation) {

  if (!form.locationData.customLocation?.trim()) {
    missing.push({
      path: "locationData.locationRef",
      label: "Location",
    });
  }

} else {

  if (!form.locationData.locationRef?.trim()) {
    missing.push({
      path: "locationData.locationRef",
      label: "Location",
    });
  }
}

    // ================= CATEGORY VALIDATION =================
    if (useCustomCategory) {

      if (!form.categoryData.customCategory?.trim()) {
        missing.push({
          path: "categoryData.categoryRef",
          label: "Category",
        });
      }

    } else {

      if (!form.categoryData.categoryRef?.trim()) {
        missing.push({
          path: "categoryData.categoryRef",
          label: "Category",
        });
      }
    }

    // ================= HERO DESCRIPTION =================
    if (!form.heroSection.heroDescription?.trim()) {
      missing.push({
        path: "heroSection.heroDescription",
        label: "Hero Description",
      });
    }
  }

  // ================= STEP 2 VALIDATION =================
  if (step === 2) {

    // ABOUT DESCRIPTION
    if (!form.overview.description?.trim()) {
      missing.push({
        path: "overview.description",
        label: "About Description",
      });
    }

    // ABOUT IMAGE
    if (!form.overview.aboutImageUrl?.trim()) {
      missing.push({
        path: "overview.aboutImageUrl",
        label: "About Image",
      });
    }

    // HIGHLIGHTS HEADING
    if (!form.overview.highlightsHeading?.trim()) {
      missing.push({
        path: "overview.highlightsHeading",
        label: "Highlights Heading",
      });
    }

    // HIGHLIGHTS SUBHEADING
    if (!form.overview.highlightsSubheading?.trim()) {
      missing.push({
        path: "overview.highlightsSubheading",
        label: "Highlights Subheading",
      });
    }

    // HIGHLIGHT CARDS
    if (
      !form.overview.highlights ||
      form.overview.highlights.length === 0
    ) {
      missing.push({
        path: "overview.highlights",
        label: "Highlight Cards",
      });
    }

    // CHECK EMPTY HIGHLIGHT CARDS
    form.overview.highlights?.forEach((item, index) => {

      if (!item.heading?.trim()) {
        missing.push({
          path: `overview.highlights.${index}.heading`,
          label: `Highlight Card ${index + 1} Heading`,
        });
      }

      if (!item.subheading?.trim()) {
        missing.push({
          path: `overview.highlights.${index}.subheading`,
          label: `Highlight Card ${index + 1} Description`,
        });
      }
    });
  }

  // ================= ERROR UI =================
  if (missing.length > 0) {

    const newErrors = {};

    missing.forEach((field) => {
      newErrors[field.path] = true;
    });

    setErrors(newErrors);

    toast.error(
      `Please fill required fields:\n${missing
        .map((e) => `• ${e.label}`)
        .join("\n")}`,
      {
        duration: 5000,
        style: {
          whiteSpace: "pre-line",
          background: "#1f1f1f",
          color: "#fff",
          border: "1px solid #ef4444",
        },
      }
    );

    return;
  }

  // ================= CLEAR OLD ERRORS =================
  setErrors({});

  // ================= NEXT STEP =================
  setStep((prev) => prev + 1);
};
  const goPrev = () => setStep((prev) => prev - 1);

  // ================= COMMON HANDLER =================
  const handleChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

 // ================= SUBMIT =================
const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired ❌ Please login again");
      window.location.href = "/login";
      return;
    }

    // 🔥 CLEAN CONFIGS
    const cleanedConfigurations =
      form.unitConfigurations.filter(
        (u) =>
          u.unitType?.trim() ||
          u.area?.trim() ||
          u.price?.trim() ||
          u.paymentPlan?.trim() ||
          u.bedrooms?.trim() ||
          u.bathrooms?.trim() ||
          u.balconies?.trim()
      );

    const validConfigurations = cleanedConfigurations;

    const cleanedForm = {
      ...form,

      coreDetails: {
        ...form.coreDetails,
        developerRef: useCustomDeveloper
          ? null
          : form.coreDetails.developerRef,
        developerName: form.coreDetails.developerName,
      },

      categoryData: {
        categoryRef: useCustomCategory
          ? null
          : form.categoryData.categoryRef,
        categoryName: useCustomCategory
          ? form.categoryData.customCategory
          : form.categoryData.categoryName,
      },

      locationData: {
        ...form.locationData,
        locationRef: useCustomLocation
          ? null
          : form.locationData.locationRef,
        locationName: useCustomLocation
          ? form.locationData.customLocation
          : form.locationData.locationName,
      },

      keyMetrics: {
        ...form.keyMetrics,
        totalUnits: Number(form.keyMetrics.totalUnits) || 0,
        totalTowers: Number(form.keyMetrics.totalTowers) || 0,
      },

      configurationSection: {
        ...form.configurationSection,
      },

      unitConfigurations: validConfigurations,
    };

    console.log("🚀 FINAL PAYLOAD:", cleanedForm);

    const res = await fetch(
      "https://property-bouquet-backend.onrender.com/api/properties",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 MOST IMPORTANT FIX
        },
        body: JSON.stringify(cleanedForm),
      }
    );

    const data = await res.json();

    // ================= SUCCESS =================
    if (res.ok) {
      alert("Property Added ✅");

      // reset errors
      setErrors({});
      setErrorList([]);

      return;
    }

    // ================= NON-VALIDATION ERRORS =================
if (
  !data.missingFields ||
  data.missingFields.length === 0
) {
  toast.error(
    data.message || "Something went wrong ❌"
  );

  console.error(
    "Server Error:",
    data.message
  );

  return;
}

   const missing = data.missingFields || [];

const fieldErrors = {};
const errorMessages = [];

let firstStep = Infinity;

missing.forEach((field) => {
  fieldErrors[field] = true;

  const label = labelMap?.[field] || field;
  errorMessages.push(label);

  const stepNo = fieldStepMap?.[field];

  if (stepNo && stepNo < firstStep) {
    firstStep = stepNo;
  }
});

setErrors(fieldErrors);
setErrorList(errorMessages);

toast.error(
  `Missing required fields:\n${errorMessages
    .map((e) => `• ${e}`)
    .join("\n")}`,
  {
    duration: 6000,
    style: {
      whiteSpace: "pre-line",
      background: "#1f1f1f",
      color: "#fff",
      border: "1px solid #ef4444",
    },
  }
);

if (firstStep !== Infinity) {
  setStep(firstStep);
}

// optional fallback log
if (data.message) {
  console.log("Validation:", data.message);
}

// move user to first step with error
setStep(firstStep);

// scroll to top
window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  }
};


const buildOptions = (nodes, prefix = "") => {
  let options = [];

  nodes.forEach((node) => {
    const label = prefix ? `${prefix} > ${node.name}` : node.name;

    options.push({
      _id: node._id,
      name: node.name,
      label,
    });

    if (node.children && node.children.length > 0) {
      options = options.concat(buildOptions(node.children, label));
    }
  });

  return options;
};

const hasError = (fieldPath) => {
  return Boolean(errors?.[fieldPath]);
};

const fieldStepMap = {
  slug: 1,
  "coreDetails.title": 1,
  "coreDetails.developerRef": 1,
  "locationData.locationRef": 1,
  "categoryData.categoryRef": 1,

  "heroSection.heroDescription": 1,
  "keyMetrics.possession": 1,
  "keyMetrics.landArea": 1,
  "keyMetrics.totalUnits": 1,
  "keyMetrics.totalTowers": 1,
  "keyMetrics.floors": 1,
  "keyMetrics.reraNumber": 1,

  "overview.description": 2,
"overview.aboutImageUrl": 2,
"overview.highlightsHeading": 2,
"overview.highlights": 2,
};

const labelMap = {
  slug: "Slug",
  "coreDetails.title": "Project Title",
  "coreDetails.developerRef": "Developer",
  "locationData.locationRef": "Location",
  "categoryData.categoryRef": "Category",


  "heroSection.heroDescription": "Hero Description",
  "keyMetrics.possession": "Possession",
  "keyMetrics.landArea": "Land Area",
  "keyMetrics.totalUnits": "Total Units",
  "keyMetrics.totalTowers": "Total Towers", 
  "keyMetrics.floors": "Floors",
  "keyMetrics.reraNumber": "RERA Number",

  "overview.description": "About Description",
"overview.aboutImageUrl": "About Image",
"overview.highlightsHeading": "Highlights Heading",
"overview.highlights": "Highlight Cards",
};
 return (
  <div className="app-bg min-h-screen overflow-x-hidden px-4 md:px-6 xl:px-8 py-6">

    {/* ================= PREMIUM TOP SECTION ================= */}
    <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-[#06281f] via-[#0b3b2f] to-[#0d4a39] p-5 md:p-7 xl:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.45)] mb-8">

      {/* GLOW EFFECTS */}
      <div className="absolute top-[-120px] right-[-80px] w-[260px] h-[260px] rounded-full bg-[#f5d488]/10 blur-3xl" />
      <div className="absolute bottom-[-120px] left-[-80px] w-[220px] h-[220px] rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10">

        {/* ================= HEADER ================= */}
<div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

  {/* LEFT */}
  <div className="flex items-start gap-4">

    {/* ICON (smaller) */}
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c8a45d] to-[#f5d488] flex items-center justify-center shadow-[0_10px_30px_rgba(245,212,136,0.25)]">
      <span className="text-2xl">🏢</span>
    </div>

    {/* TEXT */}
    <div>
      <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
        Add Property
      </h1>
    </div>

  </div>

  {/* RIGHT ACTIONS */}
  <div className="flex flex-wrap items-center gap-3">

    {/* PREVIEW BUTTON */}
    <button
      onClick={() => setPreviewMode(!previewMode)}
      className="group relative overflow-hidden px-5 py-3 rounded-2xl bg-white text-black font-semibold transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(255,255,255,0.18)]"
    >
      <span className="relative z-10 flex items-center gap-2">
        {previewMode ? "← Back to Edit" : "👁 Full Preview"}
      </span>
    </button>

    {/* FORM MODE BUTTON */}
    <button
      onClick={() => setFullFormMode(!fullFormMode)}
      className="px-5 py-3 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl text-white font-semibold hover:bg-white/10 transition-all duration-300"
    >
      {fullFormMode ? "↔ Split View" : "📝 Full Form"}
    </button>

  </div>
</div>

        {/* ================= PREMIUM STEPPER ================= */}
        <div className="relative">

          {/* MAIN LINE */}
          <div className="absolute top-7 left-0 w-full h-[3px] bg-white/10 rounded-full overflow-hidden">

            <div
              className="h-full rounded-full bg-gradient-to-r from-[#c8a45d] to-[#f5d488] transition-all duration-500"
              style={{
                width: `${((step - 1) / 6) * 100}%`,
              }}
            />

          </div>

          {/* STEPS */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-y-8 gap-x-4 relative z-10">

            {[
              {
                no: "01",
                title: "Core Details",
                sub: "Basic Info",
              },
              {
                no: "02",
                title: "About Project",
                sub: "Highlights",
              },
              {
                no: "03",
                title: "Amenities",
                sub: "Lifestyle",
              },
              {
                no: "04",
                title: "Gallery & Floor Plans",
                sub: "Media",
              },
              {
                no: "05",
                title: "Location",
                sub: "Connectivity",
              },
              {
                no: "06",
                title: "Master Plan",
                sub: "Brochure",
              },
              {
                no: "07",
                title: "FAQ & Publish",
                sub: "Finalize",
              },
            ].map((item, index) => {

              const currentStep = index + 1;
              const active = step === currentStep;
              const completed = step > currentStep;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center relative"
                >

                  {/* STEP CIRCLE */}
                  <div
                    className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center
                      text-sm font-bold border transition-all duration-300

                      ${
                        active
                          ? "bg-gradient-to-br from-[#c8a45d] to-[#f5d488] border-[#f5d488] text-black scale-110 shadow-[0_0_35px_rgba(245,212,136,0.45)]"
                          : completed
                          ? "bg-[#c8a45d] border-[#c8a45d] text-black"
                          : "bg-white/5 border-white/10 text-gray-400 backdrop-blur-xl"
                      }
                    `}
                  >
                    {completed ? "✓" : item.no}
                  </div>

                  {/* TEXT */}
                  <div className="mt-4">

                    <p
                      className={`text-sm font-semibold leading-tight ${
                        active
                          ? "text-white"
                          : completed
                          ? "text-[#f5d488]"
                          : "text-gray-400"
                      }`}
                    >
                      {item.title}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {item.sub}
                    </p>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        
      </div>
    </div>

    {previewMode ? (

      // ================= FULL PREVIEW =================
      <div className="w-full rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-3 md:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

        <div className="h-[82vh] overflow-y-auto rounded-2xl bg-white overflow-x-hidden">

          <PropertyPreview
            form={previewData}
            insideAdmin={true}
          />

        </div>
      </div>

    ) : (

      // ================= EDIT MODE =================
      <div className="flex flex-col xl:flex-row gap-6 w-full overflow-hidden">

        {/* ================= LEFT SIDE ================= */}
        <div
          className={`
            ${
              fullFormMode
                ? "w-full"
                : "xl:w-1/2 w-full"
            }

            overflow-y-auto
            overflow-x-hidden
            h-[80vh]
            min-w-0

            rounded-[30px]
            border border-white/10
            bg-white/5
            backdrop-blur-xl
            shadow-[0_20px_60px_rgba(0,0,0,0.35)]

            px-5 md:px-7 py-7
          `}
        >

          <div className="space-y-8">

        {/* ================= STEP 1 ================= */}
{step === 1 && (
  <div className="section">
    <h2 className="section-title">Core Details</h2>

    <input
      className={`input transition-all duration-200 ${
  hasError("slug")
    ? "border-red-500 ring-2 ring-red-500 shadow-[0_0_10px_rgba(255,0,0,0.25)]"
    : ""
}`}
  placeholder="Slug *"
      value={form.slug}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          slug: e.target.value,
        }))
      }
    />

    {hasError("slug") && (
  <p className="text-red-400 text-sm mt-1 animate-pulse">
    Slug is required
  </p>
)}

    <input
  className={`input transition-all duration-200 ${
    hasError("coreDetails.title")
      ? "border-red-500 ring-2 ring-red-500 shadow-[0_0_10px_rgba(255,0,0,0.25)]"
      : ""
  }`}
  placeholder="Title *"
  value={form.coreDetails.title}
  onChange={(e) =>
    handleChange("coreDetails", "title", e.target.value)
  }
/>

    {hasError("coreDetails.title") && (
  <p className="text-red-400 text-sm">Title is required</p>
)}

{/* ================= HERO SECTION ================= */}
    <div className="mt-8">
      <h3 className="font-semibold mb-4 text-white">
        Hero Section
      </h3>

      <div className="grid grid-cols-1 gap-4">
        <input
          className="input"
          placeholder="propertyStatus Text"
          value={
            form.heroSection
              ?.propertyStatus || ""
          }
          onChange={(e) =>
            handleChange(
              "heroSection",
              "propertyStatus",
              e.target.value
            )
          }
        />

        <textarea
  className={`input min-h-[120px] ${
    hasError("heroSection.heroDescription")
      ? "border-red-500 ring-2 ring-red-500"
      : ""
  }`}
          placeholder="Hero Description *"
          value={
            form.heroSection
              ?.heroDescription || ""
          }
          onChange={(e) =>
            handleChange(
              "heroSection",
              "heroDescription",
              e.target.value
            )
          }
        />

        {hasError("heroSection.heroDescription") && (
  <p className="text-red-400 text-sm">
    Hero Description is required
  </p>
)}

        <input
          className="input"
          placeholder="Brochure Button Text"
          value={
            form.heroSection
              ?.brochureButtonText || ""
          }
          onChange={(e) =>
            handleChange(
              "heroSection",
              "brochureButtonText",
              e.target.value
            )
          }
        />

        <input
          className="input"
          placeholder="Video Button Text"
          value={
            form.heroSection
              ?.videoButtonText || ""
          }
          onChange={(e) =>
            handleChange(
              "heroSection",
              "videoButtonText",
              e.target.value
            )
          }
        />
      </div>
    </div>

    {/* ================= HERO IMAGE ================= */}
<div className="mt-8">
  <label className="block text-white font-semibold mb-3">
    Hero Image
  </label>

  <div
    onClick={() =>
      document
        .getElementById("heroImageUpload")
        .click()
    }
    className={`
      relative
      group
      cursor-pointer
      overflow-hidden
      rounded-2xl
      border-2
      border-dashed
      transition-all
      duration-300
      ${
        hasError("media.heroImageUrl")
          ? "border-red-500 bg-red-500/10"
          : "border-white/20 bg-white/5 hover:border-[#C6A15B] hover:bg-white/10"
      }
    `}
  >

    {/* IMAGE EXISTS */}
    {form.media?.heroImageUrl ? (
      <div className="relative">
        <img
          src={form.media.heroImageUrl}
          alt="Hero Preview"
          className="
            w-full
            h-[300px]
            object-cover
          "
        />

        {/* Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-black/50
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-300
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <svg
            className="w-8 h-8 text-white mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l-4-4m4 4l4-4"
            />
          </svg>

          <p className="text-white font-medium">
            Change Hero Image
          </p>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();

            setForm((prev) => ({
              ...prev,
              media: {
                ...prev.media,
                heroImageUrl: "",
              },
            }));
          }}
          className="
            absolute
            top-3
            right-3
            h-9
            w-9
            rounded-full
            bg-red-500
            text-white
            flex
            items-center
            justify-center
            shadow-lg
            hover:scale-110
            transition
          "
        >
          ✕
        </button>
      </div>
    ) : (
      /* EMPTY STATE */
      <div
        className="
          py-16
          px-6
          flex
          flex-col
          items-center
          justify-center
          text-center
        "
      >
        <div
          className="
            h-16
            w-16
            rounded-full
            bg-white/10
            flex
            items-center
            justify-center
            mb-4
          "
        >
          <svg
            className="w-8 h-8 text-[#C6A15B]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <h4 className="text-white font-semibold text-lg">
          Upload Hero Image
        </h4>

        <p className="text-gray-400 text-sm mt-2">
          Click to upload your property hero image
        </p>

        <p className="text-gray-500 text-xs mt-1">
          JPG, PNG, WEBP • Max 5MB
        </p>
      </div>
    )}
  </div>

  {hasError("media.heroImageUrl") && (
    <p className="text-red-400 text-sm mt-2">
      Hero Image is required
    </p>
  )}

  <input
    id="heroImageUpload"
    type="file"
    hidden
    accept="image/*"
    onChange={async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Only image files allowed ❌");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Max file size is 5MB ❌");
        return;
      }

      try {
        setUploading(true);

        const data = new FormData();
        data.append("file", file);

        const res = await fetch(
          "https://property-bouquet-backend.onrender.com/api/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const result = await res.json();

        if (!res.ok || !result.url) {
          throw new Error(
            result.message || "Upload failed"
          );
        }

        setForm((prev) => ({
          ...prev,
          media: {
            ...prev.media,
            heroImageUrl: result.url,
          },
        }));
      } catch (err) {
        console.error(err);
        alert("Upload failed ❌");
      } finally {
        setUploading(false);
      }

      e.target.value = "";
    }}
  />
</div>

    {/* ================= DEVELOPER ================= */}
    <div className="space-y-2">
      <label className="text-sm text-white/70 font-medium">
        Developer
      </label>

      {!useCustomDeveloper ? (
        <select
  className={`input transition-all duration-200 ${
    hasError("coreDetails.developerRef")
      ? "border-red-500 ring-2 ring-red-500 shadow-[0_0_10px_rgba(255,0,0,0.25)]"
      : ""
  }`}
          value={form.coreDetails.developerRef || ""}
          onChange={(e) => {
            if (e.target.value === "OTHER") {
              setUseCustomDeveloper(true);

              setForm((prev) => ({
                ...prev,
                coreDetails: {
                  ...prev.coreDetails,
                  developerRef: "",
                  developerName: "",
                  developerLogo: "",
                },
              }));
            } else {
              const selectedDev = developers.find(
                (d) => d._id === e.target.value
              );

              setUseCustomDeveloper(false);

              setForm((prev) => ({
                ...prev,
                coreDetails: {
                  ...prev.coreDetails,
                  developerRef:
                    selectedDev?._id || "",
                  developerName:
                    selectedDev?.name || "",
                  developerLogo:
                    selectedDev?.logo || "",
                },
              }));
            }
          }}
        >
          <option value="">
            Select Developer
          </option>

          {developers.map((dev) => (
            <option
              key={dev._id}
              value={dev._id}
            >
              {dev.name}
            </option>
          ))}

          <option value="OTHER">
            + Add Custom Developer
          </option>
        </select>
        
      ) : (
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Enter developer name"
            value={
              form.coreDetails.developerName
            }
            onChange={(e) =>
              handleChange(
                "coreDetails",
                "developerName",
                e.target.value
              )
            }
          />

          <button
            type="button"
            onClick={() => {
              setUseCustomDeveloper(false);

              setForm((prev) => ({
                ...prev,
                coreDetails: {
                  ...prev.coreDetails,
                  developerRef: "",
                  developerName: "",
                },
              }));
            }}
            className="px-4 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>

    {hasError("coreDetails.developerRef") && (
  <p className="text-red-400 text-sm">
    Developer is required
  </p>
)}

{/* LOCATION SELECT */}
<div className="mb-5">

  <label className="block text-sm text-white/70 mb-2">
    Select Location
  </label>

  {!useCustomLocation ? (

    <select
      className={`input transition-all duration-200 ${
        hasError("locationData.locationRef")
          ? "border-red-500 ring-2 ring-red-500 shadow-[0_0_10px_rgba(255,0,0,0.25)]"
          : ""
      }`}
      value={form.locationData.locationRef || ""}
      onChange={(e) => {

        if (e.target.value === "OTHER") {

          setUseCustomLocation(true);

          setForm((prev) => ({
            ...prev,
            locationData: {
              ...prev.locationData,
              locationRef: "",
              locationName: "",
              customLocation: "",
            },
          }));

        } else {

          const selected = buildOptions(locations).find(
            (l) => l._id === e.target.value
          );

          setUseCustomLocation(false);

          setForm((prev) => ({
            ...prev,
            locationData: {
              ...prev.locationData,
              locationRef: selected?._id || "",
              locationName: selected?.label || "",
              customLocation: "",
            },
          }));
        }
      }}
    >
      <option value="">
        Select Location
      </option>

      {buildOptions(locations).map((loc) => (
        <option key={loc._id} value={loc._id}>
          {loc.label}
        </option>
      ))}

      <option value="OTHER">
        + Add Custom Location
      </option>
    </select>

  ) : (

    <div className="flex flex-col md:flex-row gap-3">

      <input
        className={`input flex-1 transition-all duration-200 ${
          hasError("locationData.locationRef")
            ? "border-red-500 ring-2 ring-red-500 shadow-[0_0_10px_rgba(255,0,0,0.25)]"
            : ""
        }`}
        placeholder="Enter custom location"
        value={form.locationData.customLocation || ""}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            locationData: {
              ...prev.locationData,
              customLocation: e.target.value,
            },
          }))
        }
      />

      <button
        type="button"
        onClick={() => {

          setUseCustomLocation(false);

          setForm((prev) => ({
            ...prev,
            locationData: {
              ...prev.locationData,
              locationRef: "",
              locationName: "",
              customLocation: "",
            },
          }));
        }}
        className="px-5 py-3 rounded-xl bg-white/10 text-white border border-white/10 hover:bg-white/20 transition"
      >
        Cancel
      </button>
    </div>
  )}

  {hasError("locationData.locationRef") && (
    <p className="text-red-400 text-sm mt-2">
      Location is required
    </p>
  )}
</div>


    {/* ================= CATEGORY ================= */}
    <div className="space-y-2">
      <label className="text-sm text-white/70 font-medium">
        Category
      </label>

      {!useCustomCategory ? (
        <select
  className={`input transition-all duration-200 ${
    hasError("categoryData.categoryRef")
      ? "border-red-500 ring-2 ring-red-500 shadow-[0_0_10px_rgba(255,0,0,0.25)]"
      : ""
  }`}
          value={form.categoryData.categoryRef || ""}
          onChange={(e) => {
            if (e.target.value === "OTHER") {
              setUseCustomCategory(true);

              setForm((prev) => ({
                ...prev,
                categoryData: {
                  categoryRef: "",
                  categoryName: "",
                  customCategory: "",
                },
              }));
            } else {
              const selected = categories.find(
                (c) => c._id === e.target.value
              );

              setUseCustomCategory(false);

              setForm((prev) => ({
                ...prev,
                categoryData: {
                  categoryRef:
                    selected?._id || "",
                  categoryName:
                    selected?.name || "",
                  customCategory: "",
                },
              }));
            }
          }}
        >
          <option value="">
            Select Category
          </option>

          {categories.map((cat) => (
            <option
              key={cat._id}
              value={cat._id}
            >
              {cat.name}
            </option>
          ))}

          <option value="OTHER">
            + Add Custom Category
          </option>
        </select>
      ) : (
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Enter custom category"
            value={
              form.categoryData.customCategory
            }
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                categoryData: {
                  ...prev.categoryData,
                  customCategory:
                    e.target.value,
                },
              }))
            }
          />

          <button
            type="button"
            onClick={() => {
              setUseCustomCategory(false);

              setForm((prev) => ({
                ...prev,
                categoryData: {
                  categoryRef: "",
                  categoryName: "",
                  customCategory: "",
                },
              }));
            }}
            className="px-4 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>

    {hasError("categoryData.categoryRef") && (
  <p className="text-red-400 text-sm">
    Category is required
  </p>
)}

    {/* ================= KEY METRICS ================= */}
<div className="mt-6">
  <h3 className="font-semibold mb-2 text-white">
    Key Metrics
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <input
      className="input"
      placeholder="Starting Price (e.g. ₹2 Cr)"
      value={form.coreDetails.startingPrice}
      onChange={(e) =>
        handleChange(
          "coreDetails",
          "startingPrice",
          e.target.value
        )
      }
    />

    <input
      className="input"
      placeholder="Max Price (e.g. ₹10 Cr)"
      value={form.coreDetails.maxPrice}
      onChange={(e) =>
        handleChange(
          "coreDetails",
          "maxPrice",
          e.target.value
        )
      }
    />

    <input
      className="input"
      placeholder="Possession (e.g. 2028)"
      value={form.keyMetrics.possession}
      onChange={(e) =>
        handleChange(
          "keyMetrics",
          "possession",
          e.target.value
        )
      }
    />

    <input
      className="input"
      placeholder="Land Area (e.g. 10 Acres)"
      value={form.keyMetrics.landArea}
      onChange={(e) =>
        handleChange(
          "keyMetrics",
          "landArea",
          e.target.value
        )
      }
    />

    <input
      className="input"
      placeholder="Total Units"
      value={form.keyMetrics.totalUnits || ""}
      onChange={(e) =>
        handleChange(
          "keyMetrics",
          "totalUnits",
          e.target.value
        )
      }
    />

    <input
      className="input"
      placeholder="Total Towers"
      value={form.keyMetrics.totalTowers || ""}
      onChange={(e) =>
        handleChange(
          "keyMetrics",
          "totalTowers",
          e.target.value
        )
      }
    />

  </div>
</div>

    {/* ================= TAGLINES ================= */}
    <div className="mt-6">
      <h4 className="font-medium mb-3 text-white">
        Tagline Items
      </h4>

      {form.heroSection?.taglineItems?.map(
        (item, index) => (
          <div
            key={index}
            className="flex gap-2 mb-2"
          >
            <input
              className="input flex-1"
              placeholder={`Tagline ${
                index + 1
              }`}
              value={item}
              onChange={(e) => {
                const updated = [
                  ...form.heroSection
                    .taglineItems,
                ];

                updated[index] =
                  e.target.value;

                setForm((prev) => ({
                  ...prev,
                  heroSection: {
                    ...prev.heroSection,
                    taglineItems: updated,
                  },
                }));
              }}
            />

            <button
              type="button"
              onClick={() => {
                const updated =
                  form.heroSection.taglineItems.filter(
                    (_, i) => i !== index
                  );

                setForm((prev) => ({
                  ...prev,
                  heroSection: {
                    ...prev.heroSection,
                    taglineItems: updated,
                  },
                }));
              }}
              className="px-4 bg-red-500 text-white rounded-xl"
            >
              X
            </button>
          </div>
        )
      )}

      <button
        type="button"
        onClick={() => {
          setForm((prev) => ({
            ...prev,
            heroSection: {
              ...prev.heroSection,
              taglineItems: [
                ...prev.heroSection
                  .taglineItems,
                "",
              ],
            },
          }));
        }}
        className="mt-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-medium hover:opacity-90 transition"
      >
        + Add Tagline
      </button>
    </div>
  </div>
)}

        

        {/* ================= STEP 2 ================= */}
{/* ================= STEP 2 ================= */}
{step === 2 && (
  <div className="section">

    {/* ================= LOADER ================= */}
{uploading && (
  <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center">
    <p className="text-white text-lg animate-pulse">
      Uploading...
    </p>
  </div>
)}

    <h2 className="section-title">
      About & Property Highlights
    </h2>

    {/* ================= ABOUT SECTION ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10 mb-8">

      <h3 className="font-semibold text-xl mb-5 text-white">
        About Section
      </h3>

      {/* SECTION NUMBER */}
      <input
        className="input mb-4"
        placeholder="Section Number (Example: 02)"
        value={form.overview.aboutSectionNumber || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "aboutSectionNumber",
            e.target.value
          )
        }
      />

      {/* ABOUT LABEL */}
      <input
        className="input mb-4"
        placeholder="About Label"
        value={form.overview.aboutLabel || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "aboutLabel",
            e.target.value
          )
        }
      />

      {/* ABOUT TITLE LINE 1 */}
      <input
        className="input mb-4"
        placeholder="About Title Line 1"
        value={form.overview.aboutTitleLine1 || ""}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            overview: {
              ...prev.overview,
              aboutTitleLine1: e.target.value,
            },
          }))
        }
      />

      {/* ABOUT TITLE LINE 2 */}
      <input
        className="input mb-4"
        placeholder="About Title Line 2"
        value={form.overview.aboutTitleLine2 || ""}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            overview: {
              ...prev.overview,
              aboutTitleLine2: e.target.value,
            },
          }))
        }
      />

      {/* ABOUT DESCRIPTION */}
      <textarea
        className={`input min-h-[140px] mb-4 transition-all duration-200 ${
  hasError("overview.description")
    ? "border-red-500 ring-2 ring-red-500 shadow-[0_0_10px_rgba(255,0,0,0.25)]"
    : ""
}`}
        placeholder="About Description"
        value={form.overview.description || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "description",
            e.target.value
          )
        }
      />

      {hasError("overview.description") && (
  <p className="text-red-400 text-sm">
    About Description is required
  </p>
)}

      {/* SECOND PARAGRAPH */}
      <textarea
        className="input min-h-[120px] mb-4"
        placeholder="Second Paragraph"
        value={form.overview.aboutParagraph2 || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "aboutParagraph2",
            e.target.value
          )
        }
      />

      {/* ================= ABOUT IMAGE ================= */}
<div className="mt-6">
  <label className="block text-white font-semibold mb-3">
    About Section Image
  </label>

  <div
    onClick={() =>
      document
        .getElementById("aboutImageUpload")
        .click()
    }
    className={`
      relative
      group
      cursor-pointer
      overflow-hidden
      rounded-2xl
      border-2
      border-dashed
      transition-all
      duration-300
      ${
        hasError("overview.aboutImageUrl")
          ? "border-red-500 bg-red-500/10"
          : "border-white/20 bg-white/5 hover:border-[#C6A15B] hover:bg-white/10"
      }
    `}
  >
    {/* IMAGE EXISTS */}
    {form.overview?.aboutImageUrl ? (
      <div className="relative">
        <img
          src={form.overview.aboutImageUrl}
          alt="About Preview"
          className="
            w-full
            h-[260px]
            object-cover
          "
        />

        {/* Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-black/50
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-300
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <svg
            className="w-8 h-8 text-white mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l-4-4m4 4l4-4"
            />
          </svg>

          <p className="text-white font-medium">
            Change Image
          </p>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();

            setForm((prev) => ({
              ...prev,
              overview: {
                ...prev.overview,
                aboutImageUrl: "",
              },
            }));
          }}
          className="
            absolute
            top-3
            right-3
            h-9
            w-9
            rounded-full
            bg-red-500
            text-white
            flex
            items-center
            justify-center
            shadow-lg
            hover:scale-110
            transition
          "
        >
          ✕
        </button>
      </div>
    ) : (
      /* EMPTY STATE */
      <div
        className="
          py-14
          px-6
          flex
          flex-col
          items-center
          justify-center
          text-center
        "
      >
        <div
          className="
            h-16
            w-16
            rounded-full
            bg-white/10
            flex
            items-center
            justify-center
            mb-4
          "
        >
          <svg
            className="w-8 h-8 text-[#C6A15B]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <h4 className="text-white font-semibold text-lg">
          Upload About Image
        </h4>

        <p className="text-gray-400 text-sm mt-2">
          Drag & drop or click to upload
        </p>

        <p className="text-gray-500 text-xs mt-1">
          JPG, PNG, WEBP • Max 5MB
        </p>
      </div>
    )}
  </div>

  {hasError("overview.aboutImageUrl") && (
    <p className="text-red-400 text-sm mt-2">
      About Image is required
    </p>
  )}

  <input
    id="aboutImageUpload"
    type="file"
    hidden
    accept="image/*"
    onChange={async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Only image files allowed ❌");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Max file size is 5MB ❌");
        return;
      }

      try {
        setUploading(true);

        const data = new FormData();
        data.append("file", file);

        const res = await fetch(
          "https://property-bouquet-backend.onrender.com/api/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const result = await res.json();

        if (!res.ok || !result.url) {
          throw new Error(
            result.message || "Upload failed"
          );
        }

        setForm((prev) => ({
          ...prev,
          overview: {
            ...prev.overview,
            aboutImageUrl: result.url,
          },
        }));
      } catch (err) {
        console.error(err);
        alert("Upload failed ❌");
      } finally {
        setUploading(false);
      }

      e.target.value = "";
    }}
  />
</div>
    </div>

    {/* ================= FEATURE BAR ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10 mb-8">

      <div className="flex items-center justify-between mb-5">

        <h3 className="font-semibold text-xl text-white">
          Feature Bar
        </h3>

        <button
          type="button"
          onClick={() => {

            const updated = [
              ...(form.overview.featureBar || []),
              {
                title: "",
                desc: "",
                icon: "✦",
              },
            ];

            handleChange(
              "overview",
              "featureBar",
              updated
            );
          }}
          className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-medium hover:opacity-90 transition"
        >
          + Add Feature
        </button>
      </div>

      {(form.overview.featureBar || []).map(
        (item, index) => (
          <div
            key={index}
            className="rounded-2xl p-5 mb-5 bg-white/5 border border-white/10"
          >

            {/* TOP */}
            <div className="flex items-center justify-between mb-4">

              <h4 className="font-semibold text-white">
                Feature #{index + 1}
              </h4>

              <button
                type="button"
                onClick={() => {

                  const updated =
                    form.overview.featureBar.filter(
                      (_, i) => i !== index
                    );

                  handleChange(
                    "overview",
                    "featureBar",
                    updated
                  );
                }}
                className="bg-red-500 text-white px-3 py-1 rounded-lg"
              >
                Delete
              </button>
            </div>

            {/* TITLE */}
            <input
              className={`input mb-4 transition-all duration-200 ${
  hasError("overview.highlightsHeading")
    ? "border-red-500 ring-2 ring-red-500 shadow-[0_0_10px_rgba(255,0,0,0.25)]"
    : ""
}`}
              placeholder="Feature Title"
              value={item.title || ""}
              onChange={(e) => {

                const updated = [
                  ...form.overview.featureBar,
                ];

                updated[index].title =
                  e.target.value;

                handleChange(
                  "overview",
                  "featureBar",
                  updated
                );
              }}
            />

            {hasError("overview.highlightsHeading") && (
  <p className="text-red-400 text-sm mb-3">
    Highlights Heading is required
  </p>
)}

            {/* DESCRIPTION */}
            <textarea
              className="input min-h-[100px] mb-4"
              placeholder="Feature Description"
              value={item.desc || ""}
              onChange={(e) => {

                const updated = [
                  ...form.overview.featureBar,
                ];

                updated[index].desc =
                  e.target.value;

                handleChange(
                  "overview",
                  "featureBar",
                  updated
                );
              }}
            />

            {/* ICON */}
            <input
              className="input"
              placeholder="Icon (✦ ◈ ⌂ ▣)"
              value={item.icon || ""}
              onChange={(e) => {

                const updated = [
                  ...form.overview.featureBar,
                ];

                updated[index].icon =
                  e.target.value;

                handleChange(
                  "overview",
                  "featureBar",
                  updated
                );
              }}
            />
          </div>
        )
      )}
    </div>

    {/* ================= PROPERTY HIGHLIGHTS HEADER ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10 mb-8">

      <h3 className="font-semibold text-xl mb-5 text-white">
        Property Highlights Header
      </h3>

      {/* FIXED ISSUE */}
      <input
        className="input mb-4"
        placeholder="Highlights Heading"
        value={form.overview.highlightsHeading || ""}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            overview: {
              ...prev.overview,
              highlightsHeading: e.target.value,
            },
          }))
        }
      />

      {/* FIXED ISSUE */}
      <input
        className="input"
        placeholder="Highlights Subheading"
        value={form.overview.highlightsSubheading || ""}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            overview: {
              ...prev.overview,
              highlightsSubheading: e.target.value,
            },
          }))
        }
      />
    </div>

    {/* ================= HIGHLIGHTS CARDS ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10 mb-8">

      <div className="flex items-center justify-between mb-5">

        <h3 className="font-semibold text-xl text-white">
          Highlight Cards
        </h3>

        {hasError("overview.highlights") && (
  <p className="text-red-400 text-sm mt-2">
    At least 1 Highlight Card is required
  </p>
)}

        <button
          type="button"
          onClick={() => {

            const updated = [
              ...(form.overview.highlights || []),
              {
                heading: "",
                subheading: "",
                icon: "✦",
              },
            ];

            handleChange(
              "overview",
              "highlights",
              updated
            );
          }}
          className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-medium hover:opacity-90 transition"
        >
          + Add Highlight
        </button>
      </div>

      {(form.overview.highlights || []).map(
        (item, index) => (
          <div
            key={index}
            className="rounded-2xl p-5 mb-5 bg-white/5 border border-white/10"
          >

            {/* TOP */}
            <div className="flex items-center justify-between mb-4">

              <h4 className="font-semibold text-white">
                Highlight #{index + 1}
              </h4>

              <button
                type="button"
                onClick={() => {

                  const updated =
                    form.overview.highlights.filter(
                      (_, i) => i !== index
                    );

                  handleChange(
                    "overview",
                    "highlights",
                    updated
                  );
                }}
                className="bg-red-500 text-white px-3 py-1 rounded-lg"
              >
                Delete
              </button>
            </div>

            {/* HEADING */}
            <input
              className="input mb-4"
              placeholder="Card Heading"
              value={item.heading || ""}
              onChange={(e) => {

                const updated = [
                  ...form.overview.highlights,
                ];

                updated[index].heading =
                  e.target.value;

                handleChange(
                  "overview",
                  "highlights",
                  updated
                );
              }}
            />

            {/* SUBHEADING */}
            <textarea
              className="input min-h-[100px] mb-4"
              placeholder="Card Description"
              value={item.subheading || ""}
              onChange={(e) => {

                const updated = [
                  ...form.overview.highlights,
                ];

                updated[index].subheading =
                  e.target.value;

                handleChange(
                  "overview",
                  "highlights",
                  updated
                );
              }}
            />

            {/* ICON */}
            <input
              className="input"
              placeholder="Icon (✦ ◈ ↗ ▣)"
              value={item.icon || ""}
              onChange={(e) => {

                const updated = [
                  ...form.overview.highlights,
                ];

                updated[index].icon =
                  e.target.value;

                handleChange(
                  "overview",
                  "highlights",
                  updated
                );
              }}
            />
          </div>
        )
      )}
    </div>

    {/* ================= QUOTE SECTION ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10">

      <h3 className="font-semibold text-xl mb-5 text-white">
        Quote Section
      </h3>

      <textarea
        className="input min-h-[120px]"
        placeholder="Highlight Quote"
        value={form.overview.highlightQuote || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "highlightQuote",
            e.target.value
          )
        }
      />
    </div>
  </div>
)}

  {/* ================= STEP 3 ================= */}
{step === 3 && (
  <div className="section">

    {/* ================= AMENITIES HEADER ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10 mb-8">

      <h3 className="font-semibold text-xl text-white mb-5">
        Amenities Section Content
      </h3>

      {/* SECTION NUMBER */}
      <input
        className="input mb-4"
        placeholder="Section Number (Example: 04)"
        value={form.overview.amenitiesSectionNumber || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "amenitiesSectionNumber",
            e.target.value
          )
        }
      />

      {/* SECTION LABEL */}
      <input
        className="input mb-4"
        placeholder="Section Label"
        value={form.overview.amenitiesSectionLabel || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "amenitiesSectionLabel",
            e.target.value
          )
        }
      />

      {/* HEADING LINE 1 */}
      <input
        className="input mb-4"
        placeholder="Heading Line 1"
        value={form.overview.amenitiesHeadingLine1 || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "amenitiesHeadingLine1",
            e.target.value
          )
        }
      />

      {/* HEADING LINE 2 */}
      <input
        className="input mb-4"
        placeholder="Heading Line 2 (Gold Text)"
        value={form.overview.amenitiesHeadingLine2 || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "amenitiesHeadingLine2",
            e.target.value
          )
        }
      />

      {/* HEADING LINE 3 */}
      <input
        className="input mb-4"
        placeholder="Heading Line 3"
        value={form.overview.amenitiesHeadingLine3 || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "amenitiesHeadingLine3",
            e.target.value
          )
        }
      />

      {/* SUBHEADING */}
      <textarea
        className="input min-h-[120px]"
        placeholder="Amenities Subheading"
        value={form.overview.amenitiesSubheading || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "amenitiesSubheading",
            e.target.value
          )
        }
      />
    </div>

    <h2 className="section-title">
      Amenities
    </h2>

    {/* ================= SELECT AMENITIES ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10 mb-8">

      <h3 className="font-semibold text-xl text-white mb-5">
        Select Amenities
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

        {AMENITIES.map((item) => {

          // ✅ FIXED → use amenities instead of highlights
          const selected =
            (form.overview.amenities || []).some((h) => {

              const amenityName =
                typeof h === "string"
                  ? h
                  : h?.heading || h?.name;

              return amenityName === item.name;
            });

          const Icon = item.icon;

          return (
            <label
              key={item.name}
              className={`
                flex items-center gap-3 cursor-pointer
                p-4 rounded-2xl border transition-all
                ${
                  selected
                    ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white"
                    : "bg-white/5 border-white/10 text-white/70"
                }
              `}
            >

              <input
                type="checkbox"
                checked={selected}
                onChange={() => {

                  let updated;

                  if (selected) {

                    updated =
                      (form.overview.amenities || []).filter(
                        (h) => {

                          const amenityName =
                            typeof h === "string"
                              ? h
                              : h?.heading || h?.name;

                          return amenityName !== item.name;
                        }
                      );

                  } else {

                    updated = [
                      ...(form.overview.amenities || []),
                      {
                        heading: item.name,
                        subheading:
                          "Luxury-crafted spaces designed for elevated comfort and timeless sophistication.",
                        icon: item.name,
                      },
                    ];
                  }

                  handleChange(
                    "overview",
                    "amenities",
                    updated
                  );
                }}
              />

              <Icon
                size={18}
                className="text-[#D4AF37]"
              />

              <span className="text-sm font-medium">
                {item.name}
              </span>
            </label>
          );
        })}
      </div>
    </div>

    {/* ================= CUSTOM AMENITY ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10 mb-8">

      <h3 className="font-semibold text-xl text-white mb-5">
        Add Custom Amenity
      </h3>

      {/* INPUT */}
      <input
        className="input w-full"
        placeholder="Enter amenity name"
        value={customAmenity}
        onChange={(e) =>
          setCustomAmenity(e.target.value)
        }
      />

      <textarea
        className="input w-full mt-4 min-h-[100px]"
        placeholder="Amenity Description / Subheading (Optional)"
        value={customAmenitySubheading}
        onChange={(e) =>
          setCustomAmenitySubheading(
            e.target.value
          )
        }
      />

      {/* ICON SELECTOR */}
      <div className="mt-6">

        <p className="text-sm text-white/60 mb-4">
          Select Icon
        </p>

        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">

          {CUSTOM_ICONS.map((item) => {

            const Icon = item.icon;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() =>
                  setSelectedCustomIcon(
                    item.name
                  )
                }
                className={`
                  p-4 rounded-2xl border
                  flex flex-col items-center gap-2
                  transition-all
                  ${
                    selectedCustomIcon ===
                    item.name
                      ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white"
                      : "bg-white/5 border-white/10 text-white/70"
                  }
                `}
              >

                <Icon size={22} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ADD BUTTON */}
      <button
        type="button"
        className="
          mt-6 px-5 py-3 rounded-xl
          bg-[#D4AF37]
          text-black font-semibold
          hover:opacity-90 transition
        "
        onClick={() => {

          if (!customAmenity.trim())
            return;

          const amenityObject = {
            heading: customAmenity,

            subheading:
              customAmenitySubheading.trim() ||
              "Luxury-crafted spaces designed for elevated comfort and timeless sophistication.",

            icon: selectedCustomIcon,
          };

          handleChange(
            "overview",
            "amenities",
            [
              ...(form.overview.amenities || []),
              amenityObject,
            ]
          );

          setCustomAmenity("");
          setCustomAmenitySubheading("");
          setSelectedCustomIcon("Home");
        }}
      >
        + Add Custom Amenity
      </button>
    </div>

    {/* ================= SELECTED AMENITIES ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10">

      <h3 className="font-semibold text-xl text-white mb-5">
        Selected Amenities
      </h3>

      <div className="flex flex-wrap gap-3">

        {(form.overview.amenities || []).map(
          (item, i) => {

            const itemName =
              typeof item === "string"
                ? item
                : item?.heading || item?.name;

            return (
              <div
                key={i}
                className="
                  bg-[#D4AF37]
                  text-black
                  px-4 py-2
                  rounded-full
                  flex items-center gap-2
                  font-medium
                "
              >

                {itemName}

                <button
                  type="button"
                  onClick={() => {

                    const updated =
                      (form.overview.amenities || []).filter(
                        (_, idx) =>
                          idx !== i
                      );

                    handleChange(
                      "overview",
                      "amenities",
                      updated
                    );
                  }}
                  className="text-black"
                >
                  ✕
                </button>
              </div>
            );
          }
        )}
      </div>
    </div>

    {/* ================= BOTTOM STRIP ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10 mt-8">

      <h3 className="font-semibold text-xl text-white mb-5">
        Bottom Strip Content
      </h3>

      {/* LEFT TITLE 1 */}
      <input
        className="input mb-4"
        placeholder="Left Title Line 1"
        value={form.overview.bottomStripTitle1 || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "bottomStripTitle1",
            e.target.value
          )
        }
      />

      {/* LEFT TITLE 2 */}
      <input
        className="input mb-4"
        placeholder="Left Title Line 2"
        value={form.overview.bottomStripTitle2 || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "bottomStripTitle2",
            e.target.value
          )
        }
      />

      {/* FEATURE 1 */}
      <input
        className="input mb-4"
        placeholder="Feature 1"
        value={form.overview.bottomStripFeature1 || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "bottomStripFeature1",
            e.target.value
          )
        }
      />

      {/* FEATURE 2 */}
      <input
        className="input mb-4"
        placeholder="Feature 2"
        value={form.overview.bottomStripFeature2 || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "bottomStripFeature2",
            e.target.value
          )
        }
      />

      {/* FEATURE 3 */}
      <input
        className="input"
        placeholder="Feature 3"
        value={form.overview.bottomStripFeature3 || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "bottomStripFeature3",
            e.target.value
          )
        }
      />
    </div>
  </div>
)}

        {/* ================= STEP 4 ================= */}
        {step === 4 && (
          <StepMedia form={form} setForm={setForm} />
        )}

        {/* ================= STEP 5 ================= */}
{step === 5 && (
  <div className="section">

    <h2 className="section-title">
      Location Details
    </h2>

    {/* ================= BASIC LOCATION ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10 mb-8">

      <h3 className="font-semibold text-xl mb-5 text-white">
        Basic Location Details
      </h3>

      {/* ADDRESS */}
      <input
        className="input mb-4"
        placeholder="Full Property Address"
        value={form.locationData.address || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "address",
            e.target.value
          )
        }
      />

      {/* MAP URL */}
      <input
        className="input"
        placeholder="Google Maps Embed URL"
        value={form.locationData.mapEmbedUrl || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "mapEmbedUrl",
            e.target.value
          )
        }
      />
    </div>

    {/* ================= SECTION CONTENT ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10 mb-8">

      <h3 className="font-semibold text-xl mb-5 text-white">
        Section Content
      </h3>

      {/* SECTION NUMBER */}
      <input
        className="input mb-4"
        placeholder="Section Number"
        value={form.locationData.sectionNumber || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "sectionNumber",
            e.target.value
          )
        }
      />

      {/* TOP LABEL */}
      <input
        className="input mb-4"
        placeholder="Top Label"
        value={form.locationData.topLabel || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "topLabel",
            e.target.value
          )
        }
      />

      {/* HEADING LINE 1 */}
      <input
        className="input mb-4"
        placeholder="Heading Line 1"
        value={form.locationData.headingLine1 || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "headingLine1",
            e.target.value
          )
        }
      />

      {/* HEADING HIGHLIGHT */}
      <input
        className="input mb-4"
        placeholder="Heading Highlight"
        value={form.locationData.headingHighlight || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "headingHighlight",
            e.target.value
          )
        }
      />

      {/* DESCRIPTION */}
      <textarea
        className="input min-h-[140px]"
        placeholder="Section Description"
        value={form.locationData.description || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "description",
            e.target.value
          )
        }
      />
    </div>

    {/* ================= LEFT CARD ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10 mb-8">

      <h3 className="font-semibold text-xl mb-5 text-white">
        Left Card Content
      </h3>

      {/* SMALL LABEL */}
      <input
        className="input mb-4"
        placeholder="Left Card Small Label"
        value={form.locationData.leftCardTag || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "leftCardTag",
            e.target.value
          )
        }
      />

      {/* TITLE LINE 1 */}
      <input
        className="input mb-4"
        placeholder="Left Card Title Line 1"
        value={form.locationData.leftCardTitleLine1 || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "leftCardTitleLine1",
            e.target.value
          )
        }
      />

      {/* TITLE LINE 2 */}
      <input
        className="input mb-4"
        placeholder="Left Card Title Line 2"
        value={form.locationData.leftCardTitleLine2 || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "leftCardTitleLine2",
            e.target.value
          )
        }
      />

      {/* DESCRIPTION */}
      <textarea
        className="input min-h-[120px]"
        placeholder="Left Card Description"
        value={form.locationData.leftCardDescription || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "leftCardDescription",
            e.target.value
          )
        }
      />
    </div>

    {/* ================= MAP SECTION ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10 mb-8">

      <h3 className="font-semibold text-xl mb-5 text-white">
        Map Section
      </h3>

      {/* MAP TAG */}
      <input
        className="input mb-4"
        placeholder="Map Section Tag"
        value={form.locationData.mapSectionTag || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "mapSectionTag",
            e.target.value
          )
        }
      />

      {/* MAP TITLE */}
      <input
        className="input"
        placeholder="Map Section Title"
        value={form.locationData.mapSectionTitle || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "mapSectionTitle",
            e.target.value
          )
        }
      />
    </div>

    {/* ================= BADGE ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10 mb-8">

      <h3 className="font-semibold text-xl mb-5 text-white">
        Badge Content
      </h3>

      {/* BADGE TITLE */}
      <input
        className="input mb-4"
        placeholder="Badge Title"
        value={form.locationData.badgeTitle || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "badgeTitle",
            e.target.value
          )
        }
      />

      {/* BADGE SUBTITLE */}
      <input
        className="input"
        placeholder="Badge Subtitle"
        value={form.locationData.badgeSubtitle || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "badgeSubtitle",
            e.target.value
          )
        }
      />
    </div>

    {/* ================= FLOATING CARD ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10 mb-8">

      <h3 className="font-semibold text-xl mb-5 text-white">
        Floating Card
      </h3>

      {/* TAG */}
      <input
        className="input mb-4"
        placeholder="Floating Card Tag"
        value={form.locationData.floatingCardTag || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "floatingCardTag",
            e.target.value
          )
        }
      />

      {/* TITLE */}
      <input
        className="input mb-4"
        placeholder="Floating Card Title"
        value={form.locationData.floatingCardTitle || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "floatingCardTitle",
            e.target.value
          )
        }
      />

      {/* DESCRIPTION */}
      <textarea
        className="input min-h-[120px]"
        placeholder="Floating Card Description"
        value={form.locationData.floatingCardDescription || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "floatingCardDescription",
            e.target.value
          )
        }
      />
    </div>

    {/* ================= LANDMARKS ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10 mb-8">

      <div className="flex items-center justify-between mb-5">

        <h3 className="font-semibold text-xl text-white">
          Nearby Landmarks
        </h3>

        <button
          type="button"
          onClick={() => {

            const updated = [
              ...(form.locationData.landmarks || []),
              {
                name: "",
                distance: "",
                subtitle: "",
                icon: "✦",
              },
            ];

            handleChange(
              "locationData",
              "landmarks",
              updated
            );
          }}
          className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-medium hover:opacity-90 transition"
        >
          + Add Landmark
        </button>
      </div>

      {(form.locationData.landmarks || []).map(
        (item, index) => (
          <div
            key={index}
            className="rounded-2xl p-5 mb-5 bg-white/5 border border-white/10"
          >

            {/* TOP */}
            <div className="flex items-center justify-between mb-4">

              <h4 className="font-semibold text-white">
                Landmark #{index + 1}
              </h4>

              <button
                type="button"
                onClick={() => {

                  const updated =
                    form.locationData.landmarks.filter(
                      (_, i) => i !== index
                    );

                  handleChange(
                    "locationData",
                    "landmarks",
                    updated
                  );
                }}
                className="bg-red-500 text-white px-3 py-1 rounded-lg"
              >
                Delete
              </button>
            </div>

            {/* NAME */}
            <input
              className="input mb-4"
              placeholder="Landmark Name"
              value={item.name || ""}
              onChange={(e) => {

                const updated = [
                  ...form.locationData.landmarks,
                ];

                updated[index].name =
                  e.target.value;

                handleChange(
                  "locationData",
                  "landmarks",
                  updated
                );
              }}
            />

            {/* DISTANCE */}
            <input
              className="input mb-4"
              placeholder="Distance"
              value={item.distance || ""}
              onChange={(e) => {

                const updated = [
                  ...form.locationData.landmarks,
                ];

                updated[index].distance =
                  e.target.value;

                handleChange(
                  "locationData",
                  "landmarks",
                  updated
                );
              }}
            />

            {/* SUBTITLE */}
            <input
              className="input mb-4"
              placeholder="Subtitle"
              value={item.subtitle || ""}
              onChange={(e) => {

                const updated = [
                  ...form.locationData.landmarks,
                ];

                updated[index].subtitle =
                  e.target.value;

                handleChange(
                  "locationData",
                  "landmarks",
                  updated
                );
              }}
            />

            {/* ICON */}
            <input
              className="input"
              placeholder="Icon (✦ ⌂ ➜ ☁)"
              value={item.icon || ""}
              onChange={(e) => {

                const updated = [
                  ...form.locationData.landmarks,
                ];

                updated[index].icon =
                  e.target.value;

                handleChange(
                  "locationData",
                  "landmarks",
                  updated
                );
              }}
            />
          </div>
        )
      )}
    </div>

    {/* ================= BOTTOM STRIP ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10">

      <div className="flex items-center justify-between mb-5">

        <h3 className="font-semibold text-xl text-white">
          Bottom Strip Features
        </h3>

        <button
          type="button"
          onClick={() => {

            const updated = [
              ...(form.locationData.bottomStrip || []),
              {
                title: "",
                desc: "",
                icon: "✦",
              },
            ];

            handleChange(
              "locationData",
              "bottomStrip",
              updated
            );
          }}
          className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-medium hover:opacity-90 transition"
        >
          + Add Feature
        </button>
      </div>

      {(form.locationData.bottomStrip || []).map(
        (item, index) => (
          <div
            key={index}
            className="rounded-2xl p-5 mb-5 bg-white/5 border border-white/10"
          >

            {/* TOP */}
            <div className="flex items-center justify-between mb-4">

              <h4 className="font-semibold text-white">
                Feature #{index + 1}
              </h4>

              <button
                type="button"
                onClick={() => {

                  const updated =
                    form.locationData.bottomStrip.filter(
                      (_, i) => i !== index
                    );

                  handleChange(
                    "locationData",
                    "bottomStrip",
                    updated
                  );
                }}
                className="bg-red-500 text-white px-3 py-1 rounded-lg"
              >
                Delete
              </button>
            </div>

            {/* TITLE */}
            <input
              className="input mb-4"
              placeholder="Feature Title"
              value={item.title || ""}
              onChange={(e) => {

                const updated = [
                  ...form.locationData.bottomStrip,
                ];

                updated[index].title =
                  e.target.value;

                handleChange(
                  "locationData",
                  "bottomStrip",
                  updated
                );
              }}
            />

            {/* DESCRIPTION */}
            <textarea
              className="input min-h-[100px] mb-4"
              placeholder="Feature Description"
              value={item.desc || ""}
              onChange={(e) => {

                const updated = [
                  ...form.locationData.bottomStrip,
                ];

                updated[index].desc =
                  e.target.value;

                handleChange(
                  "locationData",
                  "bottomStrip",
                  updated
                );
              }}
            />

            {/* ICON */}
            <input
              className="input"
              placeholder="Icon (✦ ◈ ⌂ ▣)"
              value={item.icon || ""}
              onChange={(e) => {

                const updated = [
                  ...form.locationData.bottomStrip,
                ];

                updated[index].icon =
                  e.target.value;

                handleChange(
                  "locationData",
                  "bottomStrip",
                  updated
                );
              }}
            />
          </div>
        )
      )}
    </div>
  </div>
)}


       {/* ================= STEP 6 ================= */}
{step === 6 && (
  <div className="section space-y-8">

    {/* ================= HEADING ================= */}
    <div>
      <h2 className="section-title">
        Master Plan Section
      </h2>

      <p className="text-sm text-gray-400 mt-2">
        Configure premium master plan section content
      </p>
    </div>

    {/* ================= BROCHURE ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10">

      <h3 className="font-semibold text-xl mb-5 text-white">
        Brochure PDF
      </h3>

      <input
        className="input"
        placeholder="Brochure PDF URL (Google Drive / CDN link)"
        value={form.gatedContent.brochurePdfUrl || ""}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            gatedContent: {
              ...prev.gatedContent,
              brochurePdfUrl: e.target.value,
            },
          }))
        }
      />
    </div>

    {/* ================= MASTER PLAN CONTENT ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10">

      <h3 className="font-semibold text-xl mb-5 text-white">
        Master Plan Content
      </h3>

      {/* SECTION NUMBER */}
      <input
        className="input mb-4"
        placeholder="Section Number"
        value={form.masterPlanSection?.sectionNumber || ""}
        onChange={(e) =>
          handleChange(
            "masterPlanSection",
            "sectionNumber",
            e.target.value
          )
        }
      />

      {/* TOP LABEL */}
      <input
        className="input mb-4"
        placeholder="Top Label"
        value={form.masterPlanSection?.topLabel || ""}
        onChange={(e) =>
          handleChange(
            "masterPlanSection",
            "topLabel",
            e.target.value
          )
        }
      />

      {/* HEADING LINE 1 */}
      <input
        className="input mb-4"
        placeholder="Heading Line 1"
        value={form.masterPlanSection?.headingLine1 || ""}
        onChange={(e) =>
          handleChange(
            "masterPlanSection",
            "headingLine1",
            e.target.value
          )
        }
      />

      {/* HEADING HIGHLIGHT */}
      <input
        className="input mb-4"
        placeholder="Heading Highlight"
        value={form.masterPlanSection?.headingHighlight || ""}
        onChange={(e) =>
          handleChange(
            "masterPlanSection",
            "headingHighlight",
            e.target.value
          )
        }
      />

      {/* DESCRIPTION */}
      <textarea
        className="input min-h-[120px] mb-4"
        placeholder="Section Description"
        value={form.masterPlanSection?.description || ""}
        onChange={(e) =>
          handleChange(
            "masterPlanSection",
            "description",
            e.target.value
          )
        }
      />

      {/* TOP FLOATING LABEL */}
      <input
        className="input mb-4"
        placeholder="Top Floating Label"
        value={form.masterPlanSection?.topFloatingLabel || ""}
        onChange={(e) =>
          handleChange(
            "masterPlanSection",
            "topFloatingLabel",
            e.target.value
          )
        }
      />

      {/* CENTER TITLE */}
      <input
        className="input mb-4"
        placeholder="Center Title"
        value={form.masterPlanSection?.centerTitle || ""}
        onChange={(e) =>
          handleChange(
            "masterPlanSection",
            "centerTitle",
            e.target.value
          )
        }
      />

      {/* CENTER DESCRIPTION */}
      <textarea
        className="input min-h-[120px] mb-4"
        placeholder="Center Description"
        value={form.masterPlanSection?.centerDescription || ""}
        onChange={(e) =>
          handleChange(
            "masterPlanSection",
            "centerDescription",
            e.target.value
          )
        }
      />

      {/* BUTTON TEXT */}
      <input
        className="input mb-4"
        placeholder="Button Text"
        value={form.masterPlanSection?.buttonText || ""}
        onChange={(e) =>
          handleChange(
            "masterPlanSection",
            "buttonText",
            e.target.value
          )
        }
      />

      {/* IMAGE */}
      <input
        className="input"
        placeholder="Master Plan Image URL"
        value={form.masterPlanSection?.masterPlanImage || ""}
        onChange={(e) =>
          handleChange(
            "masterPlanSection",
            "masterPlanImage",
            e.target.value
          )
        }
      />
    </div>

    {/* ================= BOTTOM STRIP ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10">

      <div className="flex items-center justify-between mb-5">

        <h3 className="font-semibold text-xl text-white">
          Bottom Strip Features
        </h3>

        <button
          type="button"
          onClick={() => {

            const updated = [
              ...(form.masterPlanSection?.bottomStrip || []),
              {
                title: "",
                desc: "",
                icon: "✦",
              },
            ];

            handleChange(
              "masterPlanSection",
              "bottomStrip",
              updated
            );
          }}
          className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-medium hover:opacity-90 transition"
        >
          + Add Feature
        </button>
      </div>

      {(form.masterPlanSection?.bottomStrip || []).map(
        (item, index) => (
          <div
            key={index}
            className="rounded-2xl p-5 mb-5 bg-white/5 border border-white/10"
          >

            {/* TOP */}
            <div className="flex items-center justify-between mb-4">

              <h4 className="font-semibold text-white">
                Feature #{index + 1}
              </h4>

              <button
                type="button"
                onClick={() => {

                  const updated =
                    form.masterPlanSection.bottomStrip.filter(
                      (_, i) => i !== index
                    );

                  handleChange(
                    "masterPlanSection",
                    "bottomStrip",
                    updated
                  );
                }}
                className="bg-red-500 text-white px-3 py-1 rounded-lg"
              >
                Delete
              </button>
            </div>

            {/* TITLE */}
            <input
              className="input mb-4"
              placeholder="Feature Title"
              value={item.title || ""}
              onChange={(e) => {

                const updated = [
                  ...form.masterPlanSection.bottomStrip,
                ];

                updated[index].title =
                  e.target.value;

                handleChange(
                  "masterPlanSection",
                  "bottomStrip",
                  updated
                );
              }}
            />

            {/* DESCRIPTION */}
            <textarea
              className="input min-h-[100px] mb-4"
              placeholder="Feature Description"
              value={item.desc || ""}
              onChange={(e) => {

                const updated = [
                  ...form.masterPlanSection.bottomStrip,
                ];

                updated[index].desc =
                  e.target.value;

                handleChange(
                  "masterPlanSection",
                  "bottomStrip",
                  updated
                );
              }}
            />

            {/* ICON */}
            <input
              className="input"
              placeholder="Icon (✦ ◈ ↗ ▣)"
              value={item.icon || ""}
              onChange={(e) => {

                const updated = [
                  ...form.masterPlanSection.bottomStrip,
                ];

                updated[index].icon =
                  e.target.value;

                handleChange(
                  "masterPlanSection",
                  "bottomStrip",
                  updated
                );
              }}
            />
          </div>
        )
      )}
    </div>
  </div>
)}

{/* ================= STEP 7 ================= */}
{step === 7 && (
  <div className="section space-y-8">

    {/* ================= HEADING ================= */}
    <div>
      <h2 className="section-title">
        FAQs Section
      </h2>

      <p className="text-sm text-gray-400 mt-2">
        Fully dynamic FAQ content for property preview page
      </p>
    </div>

    {/* ================= FAQ SECTION SETTINGS ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10 space-y-5">

      <h3 className="font-semibold text-xl text-white">
        FAQ Section Content
      </h3>

      {/* SECTION NUMBER */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Section Number
        </label>

        <input
          className="input"
          placeholder="09"
          value={form.faqSection?.sectionNumber || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              faqSection: {
                ...prev.faqSection,
                sectionNumber: e.target.value,
              },
            }))
          }
        />
      </div>

      {/* TOP LABEL */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Top Label
        </label>

        <input
          className="input"
          placeholder="FAQ"
          value={form.faqSection?.topLabel || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              faqSection: {
                ...prev.faqSection,
                topLabel: e.target.value,
              },
            }))
          }
        />
      </div>

      {/* HEADING */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Main Heading
        </label>

        <input
          className="input"
          placeholder="Frequently Asked Questions"
          value={form.faqSection?.heading || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              faqSection: {
                ...prev.faqSection,
                heading: e.target.value,
              },
            }))
          }
        />
      </div>

      {/* SUBHEADING */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Subheading
        </label>

        <textarea
          className="input min-h-[100px]"
          placeholder="Find answers to common questions about the project and your journey to your dream home."
          value={form.faqSection?.subheading || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              faqSection: {
                ...prev.faqSection,
                subheading: e.target.value,
              },
            }))
          }
        />
      </div>

      {/* ================= LEFT CARD ================= */}

      <div className="border-t border-white/10 pt-6">
        <h3 className="font-semibold text-lg text-white mb-5">
          Left Developer Card
        </h3>

        {/* CONTACT TITLE */}
        <div className="mb-5">
          <label className="block text-sm text-gray-300 mb-2">
            Contact Card Title
          </label>

          <input
            className="input"
            placeholder="Still have questions?"
            value={form.faqSection?.contactTitle || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                faqSection: {
                  ...prev.faqSection,
                  contactTitle: e.target.value,
                },
              }))
            }
          />
        </div>

        {/* CONTACT DESCRIPTION */}
        <div className="mb-5">
          <label className="block text-sm text-gray-300 mb-2">
            Contact Description
          </label>

          <textarea
            className="input min-h-[120px]"
            placeholder="Connect with our luxury property specialists and discover every detail crafted for elevated living."
            value={form.faqSection?.contactDescription || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                faqSection: {
                  ...prev.faqSection,
                  contactDescription: e.target.value,
                },
              }))
            }
          />
        </div>

        {/* PHONE */}
        <div className="mb-5">
          <label className="block text-sm text-gray-300 mb-2">
            Contact Number
          </label>

          <input
            className="input"
            placeholder="+91 99999 99999"
            value={form.faqSection?.contactPhone || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                faqSection: {
                  ...prev.faqSection,
                  contactPhone: e.target.value,
                },
              }))
            }
          />
        </div>

        {/* TIMINGS */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Working Hours
          </label>

          <input
            className="input"
            placeholder="Monday — Sunday | 10 AM — 7 PM"
            value={form.faqSection?.contactTiming || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                faqSection: {
                  ...prev.faqSection,
                  contactTiming: e.target.value,
                },
              }))
            }
          />
        </div>
      </div>

      {/* ================= BOTTOM CTA ================= */}

      <div className="border-t border-white/10 pt-6">
        <h3 className="font-semibold text-lg text-white mb-5">
          Bottom CTA Section
        </h3>

        {/* CTA TITLE */}
        <div className="mb-5">
          <label className="block text-sm text-gray-300 mb-2">
            CTA Heading
          </label>

          <input
            className="input"
            placeholder="Ready to experience your dream home?"
            value={form.faqSection?.ctaTitle || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                faqSection: {
                  ...prev.faqSection,
                  ctaTitle: e.target.value,
                },
              }))
            }
          />
        </div>

        {/* CTA DESCRIPTION */}
        <div className="mb-5">
          <label className="block text-sm text-gray-300 mb-2">
            CTA Description
          </label>

          <textarea
            className="input min-h-[100px]"
            placeholder="Book a site visit and take the first step towards your dream home."
            value={form.faqSection?.ctaDescription || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                faqSection: {
                  ...prev.faqSection,
                  ctaDescription: e.target.value,
                },
              }))
            }
          />
        </div>

        {/* CTA BUTTON */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            CTA Button Text
          </label>

          <input
            className="input"
            placeholder="Book A Site Visit"
            value={form.faqSection?.ctaButtonText || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                faqSection: {
                  ...prev.faqSection,
                  ctaButtonText: e.target.value,
                },
              }))
            }
          />
        </div>
      </div>
    </div>

    {/* ================= FAQS ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10">

      <div className="flex items-center justify-between mb-5">

        <h3 className="font-semibold text-xl text-white">
          FAQs
        </h3>

        <button
          type="button"
          onClick={() =>
            setForm((prev) => ({
              ...prev,
              faqs: [
  ...(prev.faqs || []),
                {
                  question: "",
                  answer: "",
                },
              ],
            }))
          }
          className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-medium hover:opacity-90 transition"
        >
          + Add FAQ
        </button>
      </div>

      {(form.faqs || []).map((f, i) => (

        <div
          key={i}
          className="rounded-2xl p-5 mb-5 bg-white/5 border border-white/10"
        >

          {/* TOP */}
          <div className="flex items-center justify-between mb-4">

            <h4 className="font-semibold text-white">
              FAQ #{i + 1}
            </h4>

            <button
              type="button"
              onClick={() => {

                const arr =
                  form.faqs.filter(
                    (_, idx) => idx !== i
                  );

                setForm((prev) => ({
                  ...prev,
                  faqs: arr,
                }));
              }}
              className="bg-red-500 text-white px-3 py-1 rounded-lg"
            >
              Delete
            </button>
          </div>

          {/* QUESTION */}
          <input
            className="input mb-4"
            value={f.question || ""}
            placeholder="Question"
            onChange={(e) => {

              const arr = [...form.faqs];

              arr[i].question =
                e.target.value;

              setForm((prev) => ({
                ...prev,
                faqs: arr,
              }));
            }}
          />

          {/* ANSWER */}
          <textarea
            className="input min-h-[120px]"
            value={f.answer || ""}
            placeholder="Answer"
            onChange={(e) => {

              const arr = [...form.faqs];

              arr[i].answer =
                e.target.value;

              setForm((prev) => ({
                ...prev,
                faqs: arr,
              }));
            }}
          />
        </div>
      ))}
    </div>
  </div>
)}

      </div>

     
  </div>

   {/* RIGHT SIDE — LIVE PREVIEW */}
  {!fullFormMode && (
  <div className="w-1/2 overflow-y-auto h-[80vh] border-l pl-4 bg-white rounded-xl">
  <PropertyPreview
    form={previewData}
    insideAdmin={true}
  />
</div>
)}

  

</div>


)}

 {/* ================= STICKY BOTTOM ACTION BAR ================= */}
<div className="sticky bottom-0 left-0 z-50 mt-10">

  <div className="backdrop-blur-2xl bg-[#07251d]/85 border border-white/10 rounded-3xl px-5 md:px-7 py-4 shadow-[0_-10px_40px_rgba(0,0,0,0.35)]">

    <div className="flex items-center justify-between gap-4 flex-wrap">

      {/* LEFT INFO */}
      <div>
        <p className="text-white font-semibold text-lg">
          Step {step} of 7
        </p>

        <p className="text-sm text-gray-400">
          Complete all required property details
        </p>
      </div>

      {/* RIGHT BUTTONS */}
      <div className="flex items-center gap-3 ml-auto">

        {/* BACK BUTTON */}
        {step > 1 && (
          <button
            onClick={goPrev}
            className="
              px-6 py-3 rounded-2xl
              border border-white/10
              bg-white/5
              text-white
              font-semibold
              hover:bg-white/10
              transition-all duration-300
            "
          >
            ← Back
          </button>
        )}

        {/* NEXT / PUBLISH */}
        {step < 7 ? (
          <button
            onClick={goNext}
            className="
              px-7 py-3 rounded-2xl
              bg-gradient-to-r from-[#c8a45d] to-[#f5d488]
              text-black
              font-bold
              shadow-[0_10px_30px_rgba(245,212,136,0.25)]
              hover:scale-[1.03]
              transition-all duration-300
            "
          >
            Next Step →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="
              px-7 py-3 rounded-2xl
              bg-gradient-to-r from-emerald-500 to-green-400
              text-black
              font-bold
              shadow-[0_10px_30px_rgba(16,185,129,0.3)]
              hover:scale-[1.03]
              transition-all duration-300
            "
          >
            🚀 Publish Property
          </button>
        )}

      </div>
    </div>
  </div>
</div>
</div>

  );
}