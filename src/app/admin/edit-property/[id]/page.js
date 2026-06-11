"use client";

import React, { useState, useEffect } from "react";
import StepMedia from "../../add-property/StepMedia";
import { useParams, useRouter } from "next/navigation";
import PropertyPreview from "../../add-property/PropertyPreview";
import PropertyPreviewMobile from "../../add-property/PropertyPreviewMobile";
import toast from "react-hot-toast";
import HeroImageUpload from "../../add-property/HeroImageUpload";

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
  Search,
  Bus,
  Store,
  Phone,
  Wind,
  Monitor,
  Tablet,
  Smartphone,
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

import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as GiIcons from "react-icons/gi";
import * as TbIcons from "react-icons/tb";
import * as IoIcons from "react-icons/io5";
import * as BsIcons from "react-icons/bs";

export default function EditProperty() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { id } = useParams();

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
  
    customMetrics: [],
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
       const [loading, setLoading] = useState(true);
       const [selectedCustomIcon, setSelectedCustomIcon] =
     useState("FaHome");
       const [uploading, setUploading] = useState(false);
       const [
     customAmenitySubheading,
     setCustomAmenitySubheading,
   ] = useState("");
   const [errors, setErrors] = useState({});
   const [errorList, setErrorList] = useState([]);
   const [previewDevice, setPreviewDevice] =
     useState("mobile");
     const [iconSearch, setIconSearch] = useState("");
       const [showLocationModal, setShowLocationModal] = useState(false);
     
     const [newLocationName, setNewLocationName] = useState("");
     
     const [newLocationParent, setNewLocationParent] = useState("");
     
     const [creatingLocation, setCreatingLocation] = useState(false);
     
     const [showLocationSearch, setShowLocationSearch] =
       useState(false);
     
     const [locationSearch, setLocationSearch] =
       useState("");
     
       const [showDeveloperSearch, setShowDeveloperSearch] =
       useState(false);
     
     const [developerSearch, setDeveloperSearch] =
       useState("");
     
     const [showDeveloperModal, setShowDeveloperModal] =
       useState(false);

         const [showIconPicker, setShowIconPicker] = useState(false);
       const [activeMetricIndex, setActiveMetricIndex] = useState(null);
       const [activeMetric, setActiveMetric] = useState(null);
       const [expandedMetric, setExpandedMetric] = useState(null);
   
   // Massive icon library
   const ICONS = {
     ...FaIcons,
     ...MdIcons,
     ...GiIcons,
     ...TbIcons,
     ...IoIcons,
     ...BsIcons,
   };
   
   // Search results
   const filteredIcons = Object.keys(ICONS)
     .filter((iconName) =>
       iconName
         .toLowerCase()
         .includes(iconSearch.toLowerCase())
     )
     .slice(0, 200);
   
       const API = "https://property-bouquet-backend.onrender.com/api";

    useEffect(() => {
  const fetchProperty = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://property-bouquet-backend.onrender.com/api/properties/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
  const property = data.data;


// ✅ SAFE NORMALIZATION (NO CRASHES)
const safeForm = {
  slug: property.slug || "",

  marketType: property.marketType || "Primary",

  // ================= CORE DETAILS =================
  coreDetails: {
    title: property.coreDetails?.title || "",

    developerRef:
      typeof property.coreDetails?.developerRef === "object"
        ? property.coreDetails?.developerRef?._id || ""
        : property.coreDetails?.developerRef || "",

    developerName:
      property.coreDetails?.developerName || "",

    developerLogo:
      property.coreDetails?.developerLogo || "",

    developerImage:
      property.coreDetails?.developerImage || "",

    startingPrice:
      property.coreDetails?.startingPrice || "",

    maxPrice:
      property.coreDetails?.maxPrice || "",
  },

  // ================= CATEGORY =================
  categoryData: {
    categoryRef:
      typeof property.categoryData?.categoryRef === "object"
        ? property.categoryData?.categoryRef?._id || ""
        : property.categoryData?.categoryRef || "",

    categoryName:
      property.categoryData?.categoryName || "",

    customCategory:
      property.categoryData?.customCategory || "",
  },

  // ================= HERO =================
  heroSection: {
    propertyStatus:
      property.heroSection?.propertyStatus ||
      "PRIVATE DIGITAL MANDATE",

    heroDescription:
      property.heroSection?.heroDescription || "",

    brochureButtonText:
      property.heroSection?.brochureButtonText ||
      "DOWNLOAD BROCHURE",

    videoButtonText:
      property.heroSection?.videoButtonText ||
      "WATCH PROJECT VIDEO",

    taglineItems:
      property.heroSection?.taglineItems || [],
  },

  // ================= KEY METRICS =================
  keyMetrics: {
    landArea:
      property.keyMetrics?.landArea || "",

    possession:
      property.keyMetrics?.possession || "",

    status:
      property.keyMetrics?.status || "",

    totalUnits:
      property.keyMetrics?.totalUnits || "",

    totalTowers:
      property.keyMetrics?.totalTowers || "",

    floors:
      property.keyMetrics?.floors || "",

    reraNumber:
      property.keyMetrics?.reraNumber || "",
  },

  // ================= OVERVIEW =================
  overview: {
    aboutSectionNumber:
      property.overview?.aboutSectionNumber || "02",

    aboutLabel:
      property.overview?.aboutLabel ||
      "About The Project",

    aboutTitleLine1:
      property.overview?.aboutTitleLine1 ||
      "A Vision That",

    aboutTitleLine2:
      property.overview?.aboutTitleLine2 ||
      "Transcends the Ordinary",

    description:
      property.overview?.description || "",

    aboutParagraph2:
      property.overview?.aboutParagraph2 || "",

    aboutImageUrl:
      property.overview?.aboutImageUrl || "",

    featureBar:
      property.overview?.featureBar || [],

    highlightsHeading:
      property.overview?.highlightsHeading ||
      "Crafted for Elevated",

    highlightsSubheading:
      property.overview?.highlightsSubheading ||
      "Modern Living",

    // ✅ FIX HIGHLIGHTS
    highlights:
      property.overview?.highlights?.length > 0
        ? property.overview.highlights.map((h) => {

            if (typeof h === "string") {
              return {
                heading: h,
                subheading: "",
                icon: "Home",
              };
            }

            return {
              heading: h.heading || "",
              subheading: h.subheading || "",
              icon: h.icon || "Home",
            };
          })
        : [],

    // ✅ FIX AMENITIES
    amenities:
      property.overview?.amenities?.length > 0
        ? property.overview.amenities.map((a) => {

            if (typeof a === "string") {
              return {
                heading: a,
                subheading: "",
                icon: "Home",
              };
            }

            return {
              heading: a.heading || "",
              subheading: a.subheading || "",
              icon: a.icon || "Home",
            };
          })
        : [],

    highlightQuote:
      property.overview?.highlightQuote || "",

    amenitiesSectionNumber:
      property.overview?.amenitiesSectionNumber ||
      "04",

    amenitiesSectionLabel:
      property.overview?.amenitiesSectionLabel ||
      "Project Amenities",

    amenitiesHeadingLine1:
      property.overview?.amenitiesHeadingLine1 ||
      "Every Detail.",

    amenitiesHeadingLine2:
      property.overview?.amenitiesHeadingLine2 ||
      "Elevated",

    amenitiesHeadingLine3:
      property.overview?.amenitiesHeadingLine3 ||
      "Beyond Expectation.",

    amenitiesSubheading:
      property.overview?.amenitiesSubheading || "",

    bottomStripTitle1:
      property.overview?.bottomStripTitle1 ||
      "Thoughtfully by Design.",

    bottomStripTitle2:
      property.overview?.bottomStripTitle2 ||
      "Crafted for the Exceptional.",

    bottomStripFeature1:
      property.overview?.bottomStripFeature1 ||
      "Premium Specifications",

    bottomStripFeature2:
      property.overview?.bottomStripFeature2 ||
      "Finest Quality Materials",

    bottomStripFeature3:
      property.overview?.bottomStripFeature3 ||
      "Curated for Discerning Families",
  },

  // ================= CONFIGURATION SECTION =================
  configurationSection: {
    sectionNumber:
      property.configurationSection?.sectionNumber ||
      "05",

    sectionLabel:
      property.configurationSection?.sectionLabel ||
      "Residence Configurations",

    titleLine1:
      property.configurationSection?.titleLine1 ||
      "Residences Tailored",

    titleLine2:
      property.configurationSection?.titleLine2 ||
      "to Your Lifestyle",

    subheading:
      property.configurationSection?.subheading ||
      "",

    features:
      property.configurationSection?.features || [],

    buttonText:
      property.configurationSection?.buttonText ||
      "View Details",
  },

  // ================= UNIT CONFIGURATIONS =================
  unitConfigurations:
    property.unitConfigurations?.length > 0
      ? property.unitConfigurations.map((u) => ({
          unitType: u.unitType || "",
          area: u.area || "",
          price: u.price || "",
          paymentPlan: u.paymentPlan || "",
          bedrooms: u.bedrooms || "",
          bathrooms: u.bathrooms || "",
          balconies: u.balconies || "",
        }))
      : [
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
    heroImageUrl:
      property.media?.heroImageUrl || "",

    gallery:
      property.media?.gallery || [],

    walkthroughUrl:
      property.media?.walkthroughUrl || "",
  },

  // ================= LOCATION =================
  locationData: {
    locationRef:
      typeof property.locationData?.locationRef === "object"
        ? property.locationData?.locationRef?._id || ""
        : property.locationData?.locationRef || "",

    locationName:
      property.locationData?.locationName || "",

    customLocation:
      property.locationData?.customLocation || "",

    address:
      property.locationData?.address || "",

    mapEmbedUrl:
      property.locationData?.mapEmbedUrl || "",

    landmarks:
      property.locationData?.landmarks?.length > 0
        ? property.locationData.landmarks.map((l) => ({
            name: l.name || "",
            distance: l.distance || "",
            subtitle:
              l.subtitle || "Premium Connectivity",
            icon: l.icon || "✦",
          }))
        : [
            {
              name: "",
              distance: "",
              subtitle: "Premium Connectivity",
              icon: "✦",
            },
          ],

    bottomStrip:
      property.locationData?.bottomStrip || [],
  },

  // ================= MASTER PLAN =================
  masterPlanSection: {
    ...property.masterPlanSection,

    masterPlanImage:
      property.masterPlanSection?.masterPlanImage || "",
  },

  // ================= GATED =================
  gatedContent: {
    brochurePdfUrl:
      property.gatedContent?.brochurePdfUrl || "",

    requireLogin:
      property.gatedContent?.requireLogin ?? true,

    floorPlans:
      property.gatedContent?.floorPlans?.length > 0
        ? property.gatedContent.floorPlans.map((f) => ({
            unitType: f.unitType || "",
            area: f.area || "",
            price: f.price || "",
            paymentPlan: f.paymentPlan || "",
            bedrooms: f.bedrooms || "",
            bathrooms: f.bathrooms || "",
            balconies: f.balconies || "",
            image: f.image || "",
          }))
        : [
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
    metaTitle:
      property.seoEngine?.metaTitle || "",

    metaDescription:
      property.seoEngine?.metaDescription || "",
  },

  // ================= FAQ SECTION =================
  faqSection: {
    sectionNumber:
      property.faqSection?.sectionNumber || "09",

    topLabel:
      property.faqSection?.topLabel || "FAQ",

    headingLine1:
      property.faqSection?.headingLine1 ||
      "Frequently Asked Questions",

    headingHighlight:
      property.faqSection?.headingHighlight || "",

    description:
      property.faqSection?.description || "",

    developerLabel:
      property.faqSection?.developerLabel ||
      "Luxury Developer",

    contactTitle:
      property.faqSection?.contactTitle ||
      "Still have questions?",

    contactDescription:
      property.faqSection?.contactDescription || "",

    phone:
      property.faqSection?.phone || "",

    timing:
      property.faqSection?.timing || "",

    ctaTitle:
      property.faqSection?.ctaTitle || "",

    ctaDescription:
      property.faqSection?.ctaDescription || "",

    ctaButtonText:
      property.faqSection?.ctaButtonText ||
      "Book A Site Visit",

    callLabel:
      property.faqSection?.callLabel ||
      "Call Us",

    whatsappLabel:
      property.faqSection?.whatsappLabel ||
      "WhatsApp",
  },

  // ================= FAQS =================
  faqs:
    property.faqs?.length > 0
      ? property.faqs.map((f) => ({
          question: f.question || "",
          answer: f.answer || "",
        }))
      : [
          {
            question: "",
            answer: "",
          },
        ],
};

setForm(safeForm);
setPreviewData(safeForm);


  // ✅ toggles
  if (!property.coreDetails?.developerRef) setUseCustomDeveloper(true);
  if (!property.locationData?.locationRef) setUseCustomLocation(true);
  if (!property.categoryData?.categoryRef) setUseCustomCategory(true);

  setLoading(false); // 🔥 IMPORTANT
}
    } catch (err) {
      console.error(err);
    }
  };

  if (id) fetchProperty();
}, [id]);

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
const handleUpdate = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired ❌ Please login again");
      window.location.href = "/login";
      return;
    }

    
// 🔥 CLEAN CONFIGS SAFELY
const cleanedConfigurations =
  (form.unitConfigurations || []).filter((u) => {

    return (
      String(u.unitType || "").trim() ||
      String(u.area || "").trim() ||
      String(u.price || "").trim() ||
      String(u.paymentPlan || "").trim() ||
      String(u.bedrooms || "").trim() ||
      String(u.bathrooms || "").trim() ||
      String(u.balconies || "").trim()
    );
  });

// ✅ PREVENT EMPTY ARRAY
const validConfigurations =
  cleanedConfigurations.length > 0
    ? cleanedConfigurations
    : [
        {
          unitType: "",
          area: "",
          price: "",
          paymentPlan: "",
          bedrooms: "",
          bathrooms: "",
          balconies: "",
        },
      ];

    const normalizedHighlights =
      form.overview.highlights.map((h) => {

        // OLD STRING FORMAT
        if (typeof h === "string") {
          return {
            name: h,
            icon: h,
          };
        }

        return h;
      });

    const normalizedAmenities =
  form.overview.amenities.map((a) => {

    // OLD STRING FORMAT
    if (typeof a === "string") {
      return {
        heading: a,
        icon: "Home",
      };
    }

    return a;
  });

    // ================= FINAL PAYLOAD =================
    const cleanedForm = {
      ...form,

      overview: {
        ...form.overview,
        highlights: normalizedHighlights,
        amenities: normalizedAmenities,
      },

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

  customMetrics:
    form.keyMetrics.customMetrics || [],

  totalUnits:
    Number(form.keyMetrics.totalUnits) || 0,

  totalTowers:
    Number(form.keyMetrics.totalTowers) || 0,
},
      configurationSection: {
        ...form.configurationSection,
      },

      unitConfigurations: validConfigurations,
    };

    console.log("🚀 UPDATE PAYLOAD:", cleanedForm);

    const res = await fetch(
      `https://property-bouquet-backend.onrender.com/api/properties/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedForm),
      }
    );

    const data = await res.json();

    // ================= SUCCESS =================
    if (res.ok) {

      alert("Property Updated ✅");

      // clear old errors
      setErrors({});
      setErrorList([]);

      router.push("/admin/properties");

      return;
    }

    // ================= VALIDATION ERRORS =================
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

    // move to first invalid step
    if (firstStep !== Infinity) {
      setStep(firstStep);
    }

    // optional log
    if (data.message) {
      console.log("Validation:", data.message);
    }

    // scroll top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  } catch (err) {
    console.error(err);

    alert("Server error ❌");
  }
};

const handleCreateLocation = async () => {
  try {
    if (!newLocationName.trim()) {
      toast.error("Location name required");
      return;
    }

    setCreatingLocation(true);

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newLocationName,
        parent: newLocationParent || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to create location");
      return;
    }

    const created = data.data;

    await fetchLocations();

    setForm((prev) => ({
      ...prev,
      locationData: {
        ...prev.locationData,
        locationRef: created._id,
        locationName: created.name,
      },
    }));

    toast.success("Location created successfully");

    setShowLocationModal(false);
    setNewLocationName("");
    setNewLocationParent("");

  } catch (err) {
    console.error(err);
    toast.error("Failed to create location");
  } finally {
    setCreatingLocation(false);
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
  // "keyMetrics.possession": 1,
  // "keyMetrics.landArea": 1,
  // "keyMetrics.totalUnits": 1,
  // "keyMetrics.totalTowers": 1,
  // "keyMetrics.floors": 1,
  // "keyMetrics.reraNumber": 1,

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
  // "keyMetrics.possession": "Possession",
  // "keyMetrics.landArea": "Land Area",
  // "keyMetrics.totalUnits": "Total Units",
  // "keyMetrics.totalTowers": "Total Towers", 
  // "keyMetrics.floors": "Floors",
  // "keyMetrics.reraNumber": "RERA Number",

  "overview.description": "About Description",
"overview.aboutImageUrl": "About Image",
"overview.highlightsHeading": "Highlights Heading",
"overview.highlights": "Highlight Cards",
};

if (loading) {
  return <div className="text-white p-10">Loading property...</div>;
}
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
        Edit Property
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
      <div
  className="
    flex
    flex-col
    xl:flex-row
    gap-6
    w-full

    h-[80vh]
    min-h-0
    overflow-hidden
  "
>

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
       <div className="flex gap-3">

  <select
    className={`input flex-1 transition-all duration-200 ${
      hasError("coreDetails.developerRef")
        ? "border-red-500 ring-2 ring-red-500 shadow-[0_0_10px_rgba(255,0,0,0.25)]"
        : ""
    }`}
    value={
  typeof form.coreDetails.developerRef === "object"
    ? form.coreDetails.developerRef?._id
    : form.coreDetails.developerRef || ""
}
    onChange={(e) => {
      const value = e.target.value;

      if (value === "CREATE_NEW") {
        setShowDeveloperModal(true);
        return;
      }

      if (value === "OTHER") {
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

        return;
      }

      const selectedDev = developers.find(
        (d) => d._id === value
      );

      setUseCustomDeveloper(false);

      setForm((prev) => ({
        ...prev,
        coreDetails: {
          ...prev.coreDetails,
          developerRef: selectedDev?._id || "",
          developerName: selectedDev?.name || "",
          developerLogo: selectedDev?.logo || "",
        },
      }));
    }}
  >
    <option value="">
      Select Developer
    </option>

    {developers.map((dev) => (
      <option key={dev._id} value={dev._id}>
        {dev.name}
      </option>
    ))}

    <option value="CREATE_NEW">
      + Create New Developer
    </option>

    <option value="OTHER">
      + Add Custom Developer
    </option>
  </select>

  {/* SEARCH BUTTON */}
  <button
    type="button"
    onClick={() => setShowDeveloperSearch(true)}
    className="
      h-[48px]
      w-[48px]
      flex
      items-center
      justify-center
      rounded-xl
      bg-white/10
      border
      border-white/10
      text-white
      hover:bg-white/20
      transition
      shrink-0
    "
  >
    <Search size={18} />
  </button>

  {/* NEW BUTTON */}
  <button
    type="button"
    onClick={() => setShowDeveloperModal(true)}
    className="
      h-[48px]
      px-4
      rounded-xl
      bg-emerald-600
      text-white
      text-sm
      font-medium
      hover:bg-emerald-700
      transition
      shrink-0
    "
  >
    + New
  </button>

</div>
        
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
<div className="flex gap-3">
    <select
      className={`input flex-1 transition-all duration-200 ${
        hasError("locationData.locationRef")
          ? "border-red-500 ring-2 ring-red-500 shadow-[0_0_10px_rgba(255,0,0,0.25)]"
          : ""
      }`}
      value={
  typeof form.locationData.locationRef === "object"
    ? form.locationData.locationRef?._id
    : form.locationData.locationRef || ""
}
      onChange={(e) => {

  const value = e.target.value;

  // CREATE NEW LOCATION
  if (value === "CREATE_NEW") {
    setShowLocationModal(true);
    return;
  }

  // CUSTOM LOCATION
  if (value === "OTHER") {

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

    return;
  }

  // EXISTING LOCATION
  const selected = buildOptions(locations).find(
    (loc) => loc._id === value
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

      <option value="CREATE_NEW">
  + Create New Location
</option>

<option value="OTHER">
  + Add Custom Location
</option>
    </select>
    <button
  type="button"
  onClick={() => setShowLocationSearch(true)}
  className="
    h-[48px]
    w-[48px]
    flex
    items-center
    justify-center
    rounded-xl
    bg-white/10
    border
    border-white/10
    text-white
    hover:bg-white/20
    transition
  "
>
  <Search size={18} />
</button>
<button
  type="button"
  onClick={() => setShowLocationModal(true)}
  className="
    px-4
    rounded-xl
    bg-emerald-600
    text-white
    text-sm
    font-medium
    hover:bg-emerald-700
  "
>
  + New
</button>
</div>
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
          value={
  typeof form.categoryData.categoryRef === "object"
    ? form.categoryData.categoryRef?._id
    : form.categoryData.categoryRef || ""
}
          onChange={(e) => {

  const value = e.target.value;

  if (value === "OTHER") {

    setUseCustomCategory(true);

    setForm((prev) => ({
      ...prev,
      categoryData: {
        ...prev.categoryData,
        categoryRef: "",
        categoryName: "",
        customCategory: "",
      },
    }));

    return;
  }

  const selectedCategory = categories.find(
    (cat) => cat._id === value
  );

  setUseCustomCategory(false);

  setForm((prev) => ({
    ...prev,
    categoryData: {
      categoryRef: selectedCategory?._id || "",
      categoryName: selectedCategory?.name || "",
      customCategory: "",
    },
  }));

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
{/* <div className="mt-6">
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
</div> */}

{/* ================= CUSTOM KEY METRICS ================= */}

<div className="glass p-6 rounded-2xl border border-white/10 mb-8">

  <div className="mb-5">
    <h3 className="font-semibold text-xl text-white">
      Key Metrics
    </h3>
  </div>

 {(form.keyMetrics.customMetrics || []).map(
  (item, index) => {

    const SelectedIcon =
      ICONS[item.icon] || FaIcons.FaBuilding;

    const isOpen =
      expandedMetric === index;

    return (
      <div
        key={index}
        className="
          rounded-2xl
          mb-4
          overflow-hidden
          border
          border-white/10
          bg-white/5
        "
      >

        {/* COLLAPSED HEADER */}
        <button
          type="button"
          onClick={() =>
            setExpandedMetric(
              isOpen ? null : index
            )
          }
          className="
            w-full
            flex
            items-center
            justify-between
            p-4
            text-left
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                h-12
                w-12
                rounded-xl
                bg-[#D4AF37]/20
                border
                border-[#D4AF37]/30
                flex
                items-center
                justify-center
              "
            >
              <SelectedIcon
                size={20}
                className="text-[#D4AF37]"
              />
            </div>

            <div>

              <h4 className="text-white font-medium">
                {item.label ||
                  `Metric #${index + 1}`}
              </h4>

              <p className="text-white/50 text-sm">
                {item.value ||
                  "No value entered"}
              </p>

            </div>

          </div>

          <div className="text-white/60 text-xl">
            {isOpen ? "−" : "+"}
          </div>

        </button>

        {/* EXPANDED CONTENT */}
        {isOpen && (
          <div className="px-4 pb-4">

            <input
              className="input mb-4"
              placeholder="Metric Label"
              value={item.label || ""}
              onChange={(e) => {

                const updated = [
                  ...(form.keyMetrics
                    .customMetrics || [])
                ];

                updated[index].label =
                  e.target.value;

                handleChange(
                  "keyMetrics",
                  "customMetrics",
                  updated
                );
              }}
            />

            <input
              className="input mb-4"
              placeholder="Metric Value"
              value={item.value || ""}
              onChange={(e) => {

                const updated = [
                  ...(form.keyMetrics
                    .customMetrics || [])
                ];

                updated[index].value =
                  e.target.value;

                handleChange(
                  "keyMetrics",
                  "customMetrics",
                  updated
                );
              }}
            />

            <div className="flex gap-3">

              <button
                type="button"
                onClick={() => {
                  setActiveMetricIndex(index);
                  setShowIconPicker(true);
                }}
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-[#D4AF37]
                  text-black
                  font-medium
                "
              >
                Change Icon
              </button>

              <button
                type="button"
                onClick={() => {

                  const updated =
                    form.keyMetrics.customMetrics.filter(
                      (_, i) => i !== index
                    );

                  handleChange(
                    "keyMetrics",
                    "customMetrics",
                    updated
                  );

                  if (
                    expandedMetric === index
                  ) {
                    setExpandedMetric(null);
                  }
                }}
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-red-500
                  text-white
                "
              >
                Delete
              </button>

            </div>

          </div>
        )}

      </div>
    );
  }
)}

  <button
  type="button"
  onClick={() => {

    const updated = [
      ...(form.keyMetrics.customMetrics || []),
      {
        label: "",
        value: "",
        icon: "FaBuilding",
      },
    ];

    handleChange(
      "keyMetrics",
      "customMetrics",
      updated
    );

    // Open only newly created metric
    setExpandedMetric(updated.length - 1);
  }}
  className="
    w-full
    py-4
    rounded-2xl
    bg-[#D4AF37]
    text-black
    font-semibold
    text-lg
    hover:opacity-90
    transition
  "
>
  + Add Metric
</button>

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

      <div className="mb-5">

  <h3 className="font-semibold text-xl text-white">
    Feature Bar
  </h3>

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

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);

  }}
  className="
    w-full
    py-4
    rounded-2xl
    bg-[#D4AF37]
    text-black
    font-semibold
    text-lg
    hover:opacity-90
    transition
    mt-2
  "
>
  + Add Feature
</button>
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

  {/* HEADER */}
  <div className="mb-6">

    <h3 className="font-semibold text-xl text-white">
      Highlight Cards
    </h3>

    <p className="text-white/60 text-sm mt-1">
      Add luxury property highlights shown in the About section.
    </p>

    {hasError("overview.highlights") && (
      <p className="text-red-400 text-sm mt-2">
        At least one highlight card is required
      </p>
    )}
  </div>

  {/* CARDS */}
  {(form.overview.highlights || []).map(
    (item, index) => (
      <div
        key={index}
        className="
          rounded-2xl
          p-5
          mb-5
          bg-white/5
          border
          border-white/10
        "
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
            className="
              bg-red-500
              hover:bg-red-600
              text-white
              px-4
              py-2
              rounded-xl
              transition
            "
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

        {/* DESCRIPTION */}
        <textarea
          className="input min-h-[120px] mb-4"
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

  {/* ADD BUTTON MOVED TO BOTTOM */}
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

      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }}
    className="
      w-full
      py-4
      rounded-2xl
      bg-[#D4AF37]
      text-black
      font-semibold
      text-lg
      hover:opacity-90
      transition
      mt-2
    "
  >
    + Add Highlight
  </button>

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
    Search & Select Icon
  </p>

  <input
    className="input mb-4"
    placeholder="Search icons... (pool, gym, spa, golf, security)"
    value={iconSearch}
    onChange={(e) => setIconSearch(e.target.value)}
  />

  <div
    className="
      bg-black/20
      border border-white/10
      rounded-2xl
      p-4
      max-h-[500px]
      overflow-y-auto
    "
  >
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">

      {filteredIcons.map((iconName) => {
        const Icon = ICONS[iconName];

        return (
          <button
  key={iconName}
  type="button"
  onClick={() => setSelectedCustomIcon(iconName)}
  className={`
    h-14
    w-14
    rounded-xl
    border
    flex
    items-center
    justify-center
    transition-all
    ${
      selectedCustomIcon === iconName
        ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]"
        : "border-white/10 bg-white/5 text-white/80"
    }
  `}
>
  <Icon size={24} />
</button>
        );
      })}
    </div>
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

      <div className="mb-5">

  <h3 className="font-semibold text-xl text-white">
    Nearby Landmarks
  </h3>

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

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);

  }}
  className="
    w-full
    py-4
    rounded-2xl
    bg-[#D4AF37]
    text-black
    font-semibold
    text-lg
    hover:opacity-90
    transition
    mt-2
  "
>
  + Add Landmark
</button>
    </div>

    {/* ================= BOTTOM STRIP ================= */}
    <div className="glass p-6 rounded-2xl border border-white/10">

      <div className="mb-5">

  <h3 className="font-semibold text-xl text-white">
    Bottom Strip Features
  </h3>

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

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);

  }}
  className="
    w-full
    py-4
    rounded-2xl
    bg-[#D4AF37]
    text-black
    font-semibold
    text-lg
    hover:opacity-90
    transition
    mt-2
  "
>
  + Add Feature
</button>
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
{/* ================= BROCHURE IMAGE UPLOAD ================= */}
<div className="mb-8">

  <h3 className="font-semibold text-xl mb-5 text-white">
    Brochure Image
  </h3>

  {/* ================= UPLOAD BOX ================= */}
  <div
    onClick={() =>
      document.getElementById("brochureUpload").click()
    }
    className="
      relative
      cursor-pointer
      border-2
      border-dashed
      border-white/20
      rounded-2xl
      p-10
      text-center
      bg-white/5
      hover:bg-white/10
      transition
    "
  >

    <input
      id="brochureUpload"
      type="file"
      accept="image/*"
      hidden
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
          const res = await fetch(
            "https://property-bouquet-backend.onrender.com/api/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          const text = await res.text();
          let data;

          try {
            data = JSON.parse(text);
          } catch (err) {
            throw new Error("Invalid server response: " + text);
          }

          if (res.ok && data.success) {
            setForm((prev) => ({
              ...prev,
              gatedContent: {
                ...prev.gatedContent,
                brochurePdfUrl: data.url,
              },
            }));
          } else {
            alert(data.message || "Upload failed ❌");
          }
        } catch (err) {
          console.error("Upload Error:", err);
          alert("Upload error ❌");
        }
      }}
    />

    <div className="text-white/70">
      <p className="text-lg font-medium">
        Click to upload brochure image
      </p>
      <p className="text-sm mt-2 text-white/40">
        PNG, JPG, WEBP • Max 5MB
      </p>
    </div>
  </div>

  {/* ================= PREVIEW ================= */}
  {form.gatedContent?.brochurePdfUrl && (
    <div className="mt-6">

      <p className="text-white/70 mb-3 text-sm">
        Uploaded Brochure
      </p>

      <div className="relative group w-fit">

        <img
          src={form.gatedContent.brochurePdfUrl}
          alt="Brochure"
          className="
            w-64
            h-40
            object-cover
            rounded-2xl
            border border-white/10
            shadow-lg
            transition
            group-hover:scale-105
          "
        />

        {/* Overlay */}
        <div className="
          absolute inset-0
          bg-black/40
          opacity-0
          group-hover:opacity-100
          transition
          rounded-2xl
          flex items-center justify-center
        ">
          <p className="text-white text-sm">
            Preview
          </p>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() =>
            setForm((prev) => ({
              ...prev,
              gatedContent: {
                ...prev.gatedContent,
                brochurePdfUrl: "",
              },
            }))
          }
          className="
            absolute top-2 right-2
            bg-red-500
            text-white
            w-7 h-7
            rounded-full
            flex items-center justify-center
            text-sm
            hover:scale-110
            transition
          "
        >
          ✕
        </button>

      </div>
    </div>
  )}
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

  <div className="mb-5">
    <h3 className="font-semibold text-xl text-white">
      Bottom Strip Features
    </h3>
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

      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 100);

    }}
    className="
      w-full
      py-4
      rounded-2xl
      bg-[#D4AF37]
      text-black
      font-semibold
      text-lg
      hover:opacity-90
      transition
      mt-2
    "
  >
    + Add Feature
  </button>

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

      <div className="mb-5">

  <h3 className="font-semibold text-xl text-white">
    FAQs
  </h3>

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
      <button
  type="button"
  onClick={() => {

    setForm((prev) => ({
      ...prev,
      faqs: [
        ...(prev.faqs || []),
        {
          question: "",
          answer: "",
        },
      ],
    }));

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);

  }}
  className="
    w-full
    py-4
    rounded-2xl
    bg-[#D4AF37]
    text-black
    font-semibold
    text-lg
    hover:opacity-90
    transition
    mt-2 
  "
>
  + Add FAQ
</button>
    </div>
  </div>
)}

      </div>

     
  </div>

{/* ================= LIVE PREVIEW ================= */}
{!fullFormMode && (

  <div className="flex flex-col h-full bg-[#041a14]">

    {/* ================= PREMIUM TOP BAR ================= */}
    <div
      className="
        sticky
        top-0
        z-30
        backdrop-blur-2xl
        bg-[#06281f]/95
        border-b
        border-white/10
        px-5
        py-4
        shadow-[0_10px_30px_rgba(0,0,0,0.25)]
      "
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* LEFT */}
        <div>
          <h3 className="text-white text-lg font-semibold">
            Live Preview
          </h3>

          <p className="text-white/50 text-xs mt-1">
            Preview exactly how your property page will appear across devices.
          </p>
        </div>

        {/* DEVICE SWITCHER */}
        <div
          className="
            flex
            items-center
            gap-1
            p-1
            rounded-2xl
            bg-white/5
            border
            border-white/10
            backdrop-blur-xl
            w-fit
          "
        >

          {/* DESKTOP */}
          <button
            onClick={() => setPreviewDevice("desktop")}
            className={`
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              text-sm
              font-medium
              transition-all
              duration-300

              ${
                previewDevice === "desktop"
                  ? "bg-[#c8a45d] text-black shadow-lg"
                  : "text-white hover:bg-white/5"
              }
            `}
          >
            <Monitor size={16} />
            Desktop
          </button>

          {/* TABLET */}
          <button
            onClick={() => setPreviewDevice("tablet")}
            className={`
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              text-sm
              font-medium
              transition-all
              duration-300

              ${
                previewDevice === "tablet"
                  ? "bg-[#c8a45d] text-black shadow-lg"
                  : "text-white hover:bg-white/5"
              }
            `}
          >
            <Tablet size={16} />
            Tablet
          </button>

          {/* MOBILE */}
          <button
            onClick={() => setPreviewDevice("mobile")}
            className={`
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              text-sm
              font-medium
              transition-all
              duration-300

              ${
                previewDevice === "mobile"
                  ? "bg-[#c8a45d] text-black shadow-lg"
                  : "text-white hover:bg-white/5"
              }
            `}
          >
            <Smartphone size={16} />
            Mobile
          </button>

        </div>

      </div>
    </div>

    {/* ================= PREVIEW AREA ================= */}
<div
  className="
    flex-1
    min-h-0
    overflow-hidden

    bg-gradient-to-br
    from-[#031611]
    via-[#06281f]
    to-[#031611]
  "
>
  <div
    className="
      h-full
      overflow-y-auto
      hide-scrollbar

      px-6
      py-6
    "
  >
    <div
      className={`
        mx-auto
        transition-all
        duration-500

        ${
          previewDevice === "desktop"
            ? "w-full"
            : previewDevice === "tablet"
            ? "w-[820px] max-w-full"
            : "w-[390px] max-w-full"
        }
      `}
    >

      {/* ================= DESKTOP ================= */}
      {previewDevice === "desktop" ? (

        <div
          className="
            overflow-hidden
            rounded-[32px]

            border
            border-white/10

            bg-white

            shadow-[0_50px_120px_rgba(0,0,0,0.45)]
          "
        >
          <PropertyPreview
            form={previewData}
            insideAdmin={true}
          />
        </div>

      ) : (

        /* ================= DEVICE FRAME ================= */
        <div
          className="
            relative

            rounded-[42px]

            bg-gradient-to-b
            from-[#171717]
            to-[#090909]

            p-[10px]

            border
            border-white/10

            shadow-[0_50px_150px_rgba(0,0,0,0.65)]

            mx-auto
          "
        >

          {/* OUTER GLOW */}
          <div
            className="
              absolute
              inset-0
              rounded-[42px]
              bg-[radial-gradient(circle_at_top,rgba(200,164,93,0.18),transparent_55%)]
              pointer-events-none
            "
          />

          {/* CAMERA ISLAND */}
          <div
            className="
              absolute
              top-[16px]
              left-1/2
              -translate-x-1/2
              z-30

              w-[120px]
              h-[30px]

              rounded-full
              bg-black

              flex
              items-center
              justify-center
            "
          >
            <div className="w-2 h-2 rounded-full bg-white/30" />
          </div>

          {/* SCREEN */}
          <div
            className="
              overflow-hidden
              rounded-[32px]
              bg-white
            "
          >
            <PropertyPreviewMobile
              form={previewData}
              insideAdmin={true}
            />
          </div>

        </div>

      )}

    </div>
  </div>
</div>

  </div>

)}

  

</div>


)}

{/* ================= PREMIUM STICKY ACTION BAR ================= */}
<div className="sticky bottom-0 left-0 z-50 mt-10">

  <div
    className="
      backdrop-blur-2xl
      bg-[#031611]/95
      border
      border-white/10
      rounded-[32px]
      overflow-hidden
      shadow-[0_-15px_50px_rgba(0,0,0,0.45)]
    "
  >

    {/* GOLD TOP ACCENT */}
    <div className="h-[3px] bg-gradient-to-r from-[#c8a45d] via-[#f5d488] to-[#c8a45d]" />

    <div className="px-6 md:px-8 py-5">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        {/* ================= LEFT ================= */}
        <div className="flex-1">

          {/* STEP */}
          <div className="flex items-center gap-3 mb-2">

            <span className="px-3 py-1 rounded-full bg-[#c8a45d]/15 border border-[#c8a45d]/30 text-[#f5d488] text-xs font-bold uppercase tracking-wider">
              Step {step} of 7
            </span>

          </div>

          {/* TITLE */}
          <h3 className="text-white font-bold text-xl">
            {
              [
                "Core Details",
                "About Project",
                "Amenities",
                "Gallery & Floor Plans",
                "Location",
                "Master Plan",
                "FAQ & Publish",
              ][step - 1]
            }
          </h3>

          {/* PROGRESS BAR */}
          <div className="mt-4">

            <div className="flex justify-between text-xs mb-2">

              <span className="text-gray-400">
                Progress
              </span>

              <span className="text-[#f5d488] font-semibold">
                {Math.round((step / 7) * 100)}%
              </span>

            </div>

            <div className="h-2 rounded-full bg-white/10 overflow-hidden">

              <div
                className="
                  h-full
                  bg-gradient-to-r
                  from-[#c8a45d]
                  to-[#f5d488]
                  transition-all
                  duration-500
                "
                style={{
                  width: `${(step / 7) * 100}%`,
                }}
              />

            </div>

          </div>

        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-3 flex-wrap lg:justify-end">

          {/* BACK */}
          {step > 1 && (
            <button
              onClick={goPrev}
              className="
                px-6 py-3
                rounded-2xl
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
                px-7 py-3
                rounded-2xl
                bg-gradient-to-r
                from-[#c8a45d]
                to-[#f5d488]
                text-black
                font-bold
                shadow-[0_10px_35px_rgba(245,212,136,0.25)]
                hover:scale-[1.03]
                transition-all duration-300
              "
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              className="
                px-7 py-3
                rounded-2xl
                bg-gradient-to-r
                from-emerald-500
                to-green-400
                text-black
                font-bold
                shadow-[0_10px_35px_rgba(16,185,129,0.3)]
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
{showLocationModal && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">

    <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#071b16] p-6 shadow-2xl">

      <h3 className="text-xl font-bold text-white mb-5">
        Create New Location
      </h3>

      {/* LOCATION NAME */}
      <div className="mb-4">
        <label className="block text-white/70 text-sm mb-2">
          Location Name
        </label>

        <input
          value={newLocationName}
          onChange={(e) =>
            setNewLocationName(e.target.value)
          }
          className="input w-full"
          placeholder="Example: Golf Course Extension Road"
        />
      </div>

      {/* PARENT */}
      <div className="mb-6">
        <label className="block text-white/70 text-sm mb-2">
          Parent Location (Optional)
        </label>

        <select
          value={newLocationParent}
          onChange={(e) =>
            setNewLocationParent(e.target.value)
          }
          className="input w-full"
        >
          <option value="">
            Root Location
          </option>

          {buildOptions(locations).map((loc) => (
            <option
              key={loc._id}
              value={loc._id}
            >
              {loc.label}
            </option>
          ))}
        </select>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">

        <button
          onClick={() =>
            setShowLocationModal(false)
          }
          className="
            px-5
            py-3
            rounded-xl
            bg-white/10
            text-white
          "
        >
          Cancel
        </button>

        <button
          onClick={handleCreateLocation}
          disabled={creatingLocation}
          className="
            px-5
            py-3
            rounded-xl
            bg-[#c8a45d]
            text-black
            font-semibold
          "
        >
          {creatingLocation
            ? "Creating..."
            : "Create Location"}
        </button>

      </div>

    </div>

  </div>
)}
{showLocationSearch && (
  <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">

    <div className="w-full max-w-xl rounded-3xl bg-[#111] border border-white/10 p-6">

      <h3 className="text-xl font-semibold text-white mb-4">
        Search Location
      </h3>

      <input
        type="text"
        placeholder="Type location..."
        value={locationSearch}
        onChange={(e) =>
          setLocationSearch(e.target.value)
        }
        className="input w-full mb-4"
      />

      <div className="max-h-[400px] overflow-y-auto space-y-2">

        {buildOptions(locations)
          .filter((loc) =>
            loc.label
              .toLowerCase()
              .includes(
                locationSearch.toLowerCase()
              )
          )
          .map((loc) => (
            <button
              key={loc._id}
              type="button"
              onClick={() => {

                setForm((prev) => ({
                  ...prev,
                  locationData: {
                    ...prev.locationData,
                    locationRef: loc._id,
                    locationName: loc.label,
                    customLocation: "",
                  },
                }));

                setShowLocationSearch(false);
                setLocationSearch("");
              }}
              className="
                w-full
                text-left
                px-4
                py-3
                rounded-xl
                bg-white/5
                hover:bg-white/10
                text-white
              "
            >
              {loc.label}
            </button>
          ))}
      </div>

      <div className="flex justify-end mt-5">
        <button
          onClick={() => {
            setShowLocationSearch(false);
            setLocationSearch("");
          }}
          className="
            px-5
            py-3
            rounded-xl
            bg-white/10
            text-white
          "
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
{showDeveloperSearch && (
  <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">

    <div className="w-full max-w-2xl rounded-3xl bg-[#0f0f0f] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] overflow-hidden">

      <div className="p-6 border-b border-white/10">

        <h3 className="text-xl font-semibold text-white">
          Search Developer
        </h3>

        <p className="text-sm text-white/50 mt-1">
          Find a developer instantly
        </p>

      </div>

      <div className="p-6">

        <input
          type="text"
          placeholder="Search developer..."
          value={developerSearch}
          onChange={(e) =>
            setDeveloperSearch(e.target.value)
          }
          autoFocus
          className="
            w-full
            h-12
            px-4
            rounded-xl
            bg-white/5
            border border-white/10
            text-white
            outline-none
          "
        />

        <div className="mt-4 max-h-[400px] overflow-y-auto space-y-2">

          {developers
            .filter((dev) =>
              dev.name
                .toLowerCase()
                .includes(
                  developerSearch.toLowerCase()
                )
            )
            .map((dev) => (
              <button
                key={dev._id}
                type="button"
                onClick={() => {

                  setUseCustomDeveloper(false);

                  setForm((prev) => ({
                    ...prev,
                    coreDetails: {
                      ...prev.coreDetails,
                      developerRef: dev._id,
                      developerName: dev.name,
                      developerLogo: dev.logo || "",
                    },
                  }));

                  setShowDeveloperSearch(false);
                  setDeveloperSearch("");
                }}
                className="
                  w-full
                  text-left
                  p-4
                  rounded-2xl
                  bg-white/[0.03]
                  border
                  border-white/5
                  hover:bg-white/[0.07]
                  hover:border-white/10
                  transition
                "
              >
                <div className="font-medium text-white">
                  {dev.name}
                </div>
              </button>
            ))}

        </div>

      </div>

      <div className="p-5 border-t border-white/10 flex justify-end">

        <button
          onClick={() => {
            setShowDeveloperSearch(false);
            setDeveloperSearch("");
          }}
          className="
            px-5
            py-2.5
            rounded-xl
            bg-white/10
            text-white
            hover:bg-white/15
          "
        >
          Close
        </button>

      </div>

    </div>

  </div>
)}
{showIconPicker && (
  <div
    className="
      fixed
      inset-0
      z-[999]
      bg-black/70
      backdrop-blur-sm
      flex
      items-center
      justify-center
      p-6
    "
  >
    <div
      className="
        w-full
        max-w-4xl
        max-h-[80vh]
        overflow-hidden
        rounded-3xl
        bg-[#111]
        border
        border-white/10
      "
    >

      {/* HEADER */}
      <div className="p-5 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-white font-semibold text-lg">
          Select Icon
        </h3>

        <button
          onClick={() => setShowIconPicker(false)}
          className="text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* SEARCH */}
      <div className="p-5">
        <input
          className="input"
          placeholder="Search icon..."
          value={iconSearch}
          onChange={(e) =>
            setIconSearch(e.target.value)
          }
        />
      </div>

      {/* ICONS */}
      <div className="p-5 overflow-y-auto max-h-[500px]">

        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">

          {filteredIcons.map((iconName) => {

            const IconComponent =
              ICONS[iconName];

            return (
              <button
                key={iconName}
                type="button"
                onClick={() => {

                  const updated = [
                    ...(form.keyMetrics.customMetrics || [])
                  ];

                  updated[activeMetricIndex].icon =
                    iconName;

                  handleChange(
                    "keyMetrics",
                    "customMetrics",
                    updated
                  );

                  setShowIconPicker(false);
                }}
                className="
                  h-12
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  border
                  border-white/10
                  bg-white/5
                  hover:bg-[#D4AF37]/20
                  hover:border-[#D4AF37]
                  transition
                "
              >
                <IconComponent
                  size={18}
                  className="text-white"
                />
              </button>
            );
          })}

        </div>

      </div>

    </div>
  </div>
)}
</div>

  );
}