"use client";

import React, { useState, useEffect } from "react";
import StepMedia from "./StepMedia";
import { useRouter } from "next/navigation";
import PropertyPreview from "./PropertyPreview";

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

    coreDetails: {
  title: "",
  developerRef: "",
  developerName: "",
  developerLogo: "", // ✅ ADD THIS
  startingPrice: "",
  maxPrice: "",
},

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

    keyMetrics: {
      landArea: "",
      possession: "",
      status: "",
    },

    overview: {
  description: "",
  aboutImageUrl: "",
  highlights: [],
},

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

    media: {
      heroImageUrl: "",
      gallery: [], // ✅ NOT [""] ❌
      walkthroughUrl: "",
    },

    locationData: {
  locationRef: "",   // ObjectId from DB
  locationName: "",  // store name for preview
  customLocation: "", // if user types manually
  address: "",
  mapEmbedUrl: "",
  landmarks: [{ name: "", distance: "" }],
},

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

    categoryData: {
  categoryRef: "",
  categoryName: "",
  customCategory: "",
},

    seoEngine: {
      metaTitle: "",
      metaDescription: "",
    },

    faqs: [{ question: "", answer: "" }],
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

  // ================= NAVIGATION =================
  const goNext = () => setStep((prev) => prev + 1);
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

    if (res.ok) {
      alert("Property Added ✅");
    } else {
      console.error(data);
      alert(data.message || "Forbidden ❌");
    }

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

 return (
  <div className="app-bg p-4 md:p-6 lg:p-10 overflow-x-hidden min-h-screen">

    {/* HEADER */}
    <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6 mb-10">

      {/* LEFT */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          Add Property
        </h1>

        <p className="text-gray-300">
          Step {step} of 6
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full xl:w-auto">

        {/* BUTTONS */}
        <div className="flex flex-wrap gap-3">

          {/* PREVIEW BUTTON */}
          <button
            onClick={() =>
              setPreviewMode(!previewMode)
            }
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold whitespace-nowrap"
          >
            {previewMode
              ? "← Back to Edit"
              : "👁 Full Preview"}
          </button>

          {/* FORM MODE BUTTON */}
          <button
            onClick={() =>
              setFullFormMode(!fullFormMode)
            }
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold whitespace-nowrap"
          >
            {fullFormMode
              ? "↔ Split View"
              : "📝 Full Form"}
          </button>
        </div>

        {/* PROGRESS */}
        <div className="w-full md:w-64 bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gold h-2 rounded-full transition-all"
            style={{
              width: `${(step / 6) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>

    {previewMode ? (

      // ================= FULL PREVIEW =================
      <div className="w-full max-w-full h-[80vh] overflow-y-auto overflow-x-hidden bg-white rounded-xl p-2 md:p-4">

        <div className="w-full overflow-x-hidden">
          <PropertyPreview form={previewData} />
        </div>

      </div>

    ) : (

      // ================= EDIT MODE =================
      <div className="flex flex-col xl:flex-row gap-6 w-full overflow-hidden">

        {/* ================= LEFT SIDE ================= */}
        <div
          className={`${
            fullFormMode
              ? "w-full"
              : "xl:w-1/2 w-full"
          } overflow-y-auto overflow-x-hidden h-[80vh] pr-2 min-w-0`}
        >

    <div className="space-y-8">

        {/* ================= STEP 1 ================= */}
{step === 1 && (
  <div className="section">
    <h2 className="section-title">Core Details</h2>

    <input
      className="input"
      placeholder="Slug"
      value={form.slug}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          slug: e.target.value,
        }))
      }
    />

    <input
      className="input"
      placeholder="Title"
      value={form.coreDetails.title}
      onChange={(e) =>
        handleChange(
          "coreDetails",
          "title",
          e.target.value
        )
      }
    />

    {/* ================= DEVELOPER ================= */}
    <div className="space-y-2">
      <label className="text-sm text-white/70 font-medium">
        Developer
      </label>

      {!useCustomDeveloper ? (
        <select
          className="input"
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

    {/* ================= CATEGORY ================= */}
    <div className="space-y-2">
      <label className="text-sm text-white/70 font-medium">
        Category
      </label>

      {!useCustomCategory ? (
        <select
          className="input"
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

    <input
      className="input"
      placeholder="Starting Price"
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
      placeholder="Max Price"
      value={form.coreDetails.maxPrice}
      onChange={(e) =>
        handleChange(
          "coreDetails",
          "maxPrice",
          e.target.value
        )
      }
    />

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
          className="input min-h-[120px]"
          placeholder="Hero Description"
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

    {/* ================= KEY METRICS ================= */}
    <div className="mt-6">
      <h3 className="font-semibold mb-2 text-white">
        Key Metrics
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <input
          className="input"
          placeholder="Status (e.g. New Launch)"
          value={form.keyMetrics.status}
          onChange={(e) =>
            handleChange(
              "keyMetrics",
              "status",
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
          value={
            form.keyMetrics.totalUnits ||
            ""
          }
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
          value={
            form.keyMetrics.totalTowers ||
            ""
          }
          onChange={(e) =>
            handleChange(
              "keyMetrics",
              "totalTowers",
              e.target.value
            )
          }
        />

        <input
          className="input"
          placeholder="Floors"
          value={
            form.keyMetrics.floors || ""
          }
          onChange={(e) =>
            handleChange(
              "keyMetrics",
              "floors",
              e.target.value
            )
          }
        />

        <input
          className="input col-span-2"
          placeholder="RERA Number"
          value={
            form.keyMetrics.reraNumber ||
            ""
          }
          onChange={(e) =>
            handleChange(
              "keyMetrics",
              "reraNumber",
              e.target.value
            )
          }
        />
      </div>
    </div>
  </div>
)}

        

        {/* ================= STEP 2 ================= */}
{/* ================= STEP 2 ================= */}
{step === 2 && (
  <div className="section">

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
        className="input min-h-[140px] mb-4"
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

      {/* ABOUT IMAGE */}
      <input
        className="input"
        placeholder="About Image URL"
        value={form.overview.aboutImageUrl || ""}
        onChange={(e) =>
          handleChange(
            "overview",
            "aboutImageUrl",
            e.target.value
          )
        }
      />
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
              className="input mb-4"
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

  {/* HEADING LINE 2 (GOLD) */}
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

          const selected =
            form.overview.highlights.some((h) => {

              const name =
                typeof h === "string"
                  ? h
                  : h.name;

              return name === item.name;
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
                      form.overview.highlights.filter(
                        (h) => {

                          const name =
                            typeof h === "string"
                              ? h
                              : h.name;

                          return name !== item.name;
                        }
                      );

                  } else {

                    updated = [
                      ...form.overview.highlights,
                      {
                        name: item.name,
                        icon: item.name,
                      },
                    ];
                  }

                  handleChange(
                    "overview",
                    "highlights",
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

                <span className="text-xs">
                  {item.name}
                </span>
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
            name: customAmenity,
            icon: selectedCustomIcon,
          };

          handleChange(
            "overview",
            "highlights",
            [
              ...form.overview.highlights,
              amenityObject,
            ]
          );

          setCustomAmenity("");
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

        {form.overview.highlights.map(
          (item, i) => {

            const itemName =
              typeof item === "string"
                ? item
                : item.name;

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
                      form.overview.highlights.filter(
                        (_, idx) =>
                          idx !== i
                      );

                    handleChange(
                      "overview",
                      "highlights",
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
  <div className="section space-y-6">

    {/* HEADING */}
    <div>
      <h2 className="text-2xl font-bold text-[#1f3d2b]">
        Location Details
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Add project location, map & nearby landmarks
      </p>
    </div>

    {/* LOCATION SELECT */}
    <div className="space-y-2">

      <label className="text-sm font-medium text-gray-600">
        Select Location
      </label>

      {!useCustomLocation ? (
        <select
          className="input w-full"
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
          <option value="">Select Location</option>

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
            className="input flex-1"
            placeholder="Enter custom location"
            value={form.locationData.customLocation}
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
            className="px-5 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>

    {/* ADDRESS */}
    <div className="space-y-2">

      <label className="text-sm font-medium text-gray-600">
        Full Address
      </label>

      <input
        className="input w-full"
        placeholder="Enter full property address"
        value={form.locationData.address || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "address",
            e.target.value
          )
        }
      />
    </div>

    {/* GOOGLE MAP URL */}
    <div className="space-y-2">

      <label className="text-sm font-medium text-gray-600">
        Google Maps Embed URL
      </label>

      <input
        className="input w-full"
        placeholder="https://www.google.com/maps/embed?pb=..."
        value={form.locationData.mapEmbedUrl || ""}
        onChange={(e) =>
          handleChange(
            "locationData",
            "mapEmbedUrl",
            e.target.value
          )
        }
      />

      <p className="text-xs text-gray-400">
        Paste Google Maps iframe embed URL here
      </p>
    </div>

    {/* LANDMARKS */}
    <div className="space-y-4">

      <div className="flex items-center justify-between">

        <label className="text-sm font-medium text-gray-600">
          Nearby Landmarks
        </label>

        <button
          type="button"
          onClick={() =>
            setForm((prev) => ({
              ...prev,
              locationData: {
                ...prev.locationData,
                landmarks: [
                  ...prev.locationData.landmarks,
                  {
                    name: "",
                    distance: "",
                  },
                ],
              },
            }))
          }
          className="px-4 py-2 rounded-lg bg-[#1f3d2b] text-white text-sm hover:opacity-90 transition"
        >
          + Add Landmark
        </button>
      </div>

      {form.locationData.landmarks.map((l, i) => (

        <div
          key={i}
          className="grid grid-cols-1 md:grid-cols-[1fr_180px_60px] gap-3"
        >

          {/* LANDMARK NAME */}
          <input
            className="input w-full"
            value={l.name}
            placeholder="Landmark Name"
            onChange={(e) => {

              const arr = [...form.locationData.landmarks];
              arr[i].name = e.target.value;

              setForm((prev) => ({
                ...prev,
                locationData: {
                  ...prev.locationData,
                  landmarks: arr,
                },
              }));
            }}
          />

          {/* DISTANCE */}
          <input
            className="input w-full"
            value={l.distance}
            placeholder="Distance"
            onChange={(e) => {

              const arr = [...form.locationData.landmarks];
              arr[i].distance = e.target.value;

              setForm((prev) => ({
                ...prev,
                locationData: {
                  ...prev.locationData,
                  landmarks: arr,
                },
              }));
            }}
          />

          {/* DELETE */}
          <button
            type="button"
            onClick={() => {

              const arr =
                form.locationData.landmarks.filter(
                  (_, idx) => idx !== i
                );

              setForm((prev) => ({
                ...prev,
                locationData: {
                  ...prev.locationData,
                  landmarks: arr,
                },
              }));
            }}
            className="rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>
)}

        {/* ================= STEP 6 ================= */}
        {step === 6 && (
          <div className="section">
            <div className="mt-6">
  <h3 className="font-semibold mb-2">Brochure</h3>

  <input
    className="input"
    placeholder="Brochure PDF URL (Google Drive / CDN link)"
    value={form.gatedContent.brochurePdfUrl}
    onChange={(e) =>
      setForm(prev => ({
        ...prev,
        gatedContent: {
          ...prev.gatedContent,
          brochurePdfUrl: e.target.value,
        }
      }))
    }
  />
</div>
            <h2>FAQs</h2>

            {form.faqs.map((f, i) => (
              <div key={i} className="space-y-2">
                <input value={f.question} placeholder="Question"
                  onChange={(e) => {
                    const arr = [...form.faqs];
                    arr[i].question = e.target.value;
                    setForm(prev => ({ ...prev, faqs: arr }));
                  }}
                />

                <input value={f.answer} placeholder="Answer"
                  onChange={(e) => {
                    const arr = [...form.faqs];
                    arr[i].answer = e.target.value;
                    setForm(prev => ({ ...prev, faqs: arr }));
                  }}
                />

                <button onClick={() => {
                  const arr = form.faqs.filter((_, idx) => idx !== i);
                  setForm(prev => ({ ...prev, faqs: arr }));
                }}>
                  ❌ Remove
                </button>
              </div>
            ))}

            <button onClick={() =>
              setForm(prev => ({
                ...prev,
                faqs: [...prev.faqs, { question: "", answer: "" }]
              }))
            }>
              + Add FAQ
            </button>
          </div>
        )}
        

      </div>

      <div className="flex justify-between mt-10 max-w-4xl mx-auto">
        {step > 1 && <button onClick={goPrev}>Back</button>}

        {step < 6 ? (
          <button onClick={goNext}>Next</button>
        ) : (
          <button onClick={handleSubmit}>🚀 Publish</button>
        )}
    </div>
  </div>

   {/* RIGHT SIDE — LIVE PREVIEW */}
  {!fullFormMode && (
  <div className="w-1/2 overflow-y-auto h-[80vh] border-l pl-4 bg-white rounded-xl">
    <PropertyPreview form={previewData} />
  </div>
)}

  

</div>
)}
</div>

  );
}