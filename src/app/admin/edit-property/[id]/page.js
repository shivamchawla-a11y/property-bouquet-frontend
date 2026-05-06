"use client";

import { useState, useEffect } from "react";
import StepMedia from "../../add-property/StepMedia";
import { useRouter } from "next/navigation";
import PropertyPreview from "../../add-property/PropertyPreview";
import { useParams } from "next/navigation";

import {
  Waves,
  Dumbbell,
  Building,
  Trees,
  Car,
  ArrowUpDown,
  Shield,
  Zap,
  Home,
  Baby,
  Footprints,
  Camera,
  Gamepad2,
  Sparkles,
  ShoppingBag,
  Phone,
  Wind,
} from "lucide-react";

// ✅ Amenities with icons
const AMENITIES = [
  { name: "Swimming Pool", icon: Waves },
  { name: "Gym", icon: Dumbbell },
  { name: "Clubhouse", icon: Building },
  { name: "Garden", icon: Trees },
  { name: "Parking", icon: Car },
  { name: "Lift", icon: ArrowUpDown },
  { name: "Security", icon: Shield },
  { name: "Power Backup", icon: Zap },
  { name: "Balcony", icon: Home },
  { name: "Kids Play Area", icon: Baby },
  { name: "Jogging Track", icon: Footprints },
  { name: "CCTV", icon: Camera },
  { name: "Indoor Games", icon: Gamepad2 },
  { name: "Spa", icon: Sparkles },
  { name: "Shopping Center", icon: ShoppingBag },
  { name: "WiFi", icon: Zap },
  { name: "Fire Safety", icon: Shield },
  { name: "Rainwater Harvesting", icon: Trees },
  { name: "Intercom", icon: Phone },
  { name: "Air Conditioning", icon: Wind },
];

export default function EditProperty() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    slug: "",
    marketType: "Primary",

    coreDetails: {
  title: "",
  developerRef: "",
  developerName: "",
  developerLogo: "",   // ✅ ADD THIS
  startingPrice: "",
  maxPrice: "",
},

    keyMetrics: {
      landArea: "",
      possession: "",
      status: "",
    },

    overview: {
      description: "",
      aboutImageUrl: "",
      highlights: [""],
    },

    unitConfigurations: [
      { unitType: "", area: "", price: "", paymentPlan: "" }
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
      floorPlans: [{ title: "", image: "" }],
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
    const [loading, setLoading] = useState(true);

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
    ...property,

    coreDetails: {
      title: "",
      developerRef: "",
      developerName: "",
      startingPrice: "",
      maxPrice: "",
      ...property.coreDetails,
    },

    keyMetrics: {
      landArea: "",
      possession: "",
      status: "",
      totalUnits: "",
      totalTowers: "",
      floors: "",
      reraNumber: "",
      ...property.keyMetrics,
    },

    overview: {
      description: "",
      aboutImageUrl: "",
      highlights: property.overview?.highlights?.length
        ? property.overview.highlights
        : [""],
      ...property.overview,
    },

    unitConfigurations:
      property.unitConfigurations?.length > 0
        ? property.unitConfigurations
        : [{ unitType: "", area: "", price: "", paymentPlan: "" }],

    media: {
      heroImageUrl: "",
      gallery: property.media?.gallery || [],
      walkthroughUrl: "",
      ...property.media,
    },

    locationData: {
      locationRef: "",
      locationName: "",
      customLocation: "",
      address: "",
      mapEmbedUrl: "",
      landmarks:
        property.locationData?.landmarks?.length > 0
          ? property.locationData.landmarks
          : [{ name: "", distance: "" }],
      ...property.locationData,
    },

    gatedContent: {
      brochurePdfUrl: "",
      floorPlans:
        property.gatedContent?.floorPlans?.length > 0
          ? property.gatedContent.floorPlans
          : [{ title: "", image: "" }],
      ...property.gatedContent,
    },

    categoryData: {
      categoryRef: "",
      categoryName: "",
      customCategory: "",
      ...property.categoryData,
    },

    seoEngine: {
      metaTitle: "",
      metaDescription: "",
      ...property.seoEngine,
    },

    faqs:
      property.faqs?.length > 0
        ? property.faqs
        : [{ question: "", answer: "" }],
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
  const handleUpdate = async () => {
  try {
    const token = localStorage.getItem("token");

if (!token) {
  alert("Session expired ❌");
  router.push("/login");
  return;
}

    const cleanedConfigurations = form.unitConfigurations.filter(
      (u) =>
        u.unitType?.trim() ||
        u.area?.trim() ||
        u.price?.trim() ||
        u.paymentPlan?.trim()
    );

    const validConfigurations = cleanedConfigurations.filter(
      (u) => u.price && u.price.trim() !== ""
    );

    const cleanedForm = {
      ...form,

      coreDetails: {
        ...form.coreDetails,
        developerRef: useCustomDeveloper
          ? null
          : form.coreDetails.developerRef,
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

      unitConfigurations: validConfigurations,

      keyMetrics: {
  ...form.keyMetrics,
  totalUnits: Number(form.keyMetrics.totalUnits) || 0,
  totalTowers: Number(form.keyMetrics.totalTowers) || 0,
},
    };

    const res = await fetch(
      `https://property-bouquet-backend.onrender.com/api/properties/${id}`,
      {
        method: "PATCH", // 🔥 CHANGE HERE
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedForm),
      }
    );

    const data = await res.json();

    if (res.ok) {
  alert("Property Updated ✅");
  router.push("/admin/properties"); // ✅ ADD THIS
    } else {
      alert(data.message || "Update failed ❌");
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
if (loading) {
  return <div className="text-white p-10">Loading property...</div>;
}
  return (
    <div className="app-bg p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
  <div>
    <h1 className="text-4xl font-bold text-white">Edit Property</h1>
    <p className="text-gray-300">Step {step} of 6</p>
  </div>

  <div className="flex items-center gap-4">
    {/* PREVIEW TOGGLE */}
    <button
      onClick={() => setPreviewMode(!previewMode)}
      className="bg-white text-black px-4 py-2 rounded-lg font-semibold"
    >
      {previewMode ? "← Back to Edit" : "👁 Full Preview"}
    </button>

    {/* PROGRESS BAR */}
    <div className="w-64 bg-white/20 rounded-full h-2">
      <div
        className="bg-gold h-2 rounded-full transition-all"
        style={{ width: `${(step / 6) * 100}%` }}
      />
    </div>
  </div>
</div>

      {previewMode ? (
  // ================= FULL PREVIEW MODE =================
  <div className="w-full h-[80vh] overflow-y-auto bg-white rounded-xl p-4">
    <PropertyPreview form={previewData} />
  </div>
) : (
  // ================= EDIT MODE =================
  <div className="flex gap-6">

  {/* LEFT SIDE — FORM */}
  <div className="w-1/2 overflow-y-auto h-[80vh] pr-4">
    <div className="space-y-8">

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="section">
            <h2 className="section-title">Core Details</h2>

            <input className="input" placeholder="Slug"
              value={form.slug}
              onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
            />

            <input className="input" placeholder="Title"
              value={form.coreDetails.title}
              onChange={(e) => handleChange("coreDetails", "title", e.target.value)}
            />

            <div className="space-y-2">
  <label className="text-sm text-gray-500">Developer</label>

  {!useCustomDeveloper ? (
    <select
  className="input"
  value={form.coreDetails.developerRef || ""}
  onChange={(e) => {
  if (e.target.value === "OTHER") {
    setUseCustomDeveloper(true);

    setForm(prev => ({
      ...prev,
      coreDetails: {
        ...prev.coreDetails,
        developerRef: "",
        developerName: "",
        developerLogo: "", // ✅ ADD THIS
      }
    }));

  } else {
    const selectedDev = developers.find(
      d => d._id === e.target.value
    );

    setUseCustomDeveloper(false);

    setForm(prev => ({
      ...prev,
      coreDetails: {
        ...prev.coreDetails,
        developerRef: selectedDev?._id || "",
        developerName: selectedDev?.name || "",
        developerLogo: selectedDev?.logo || "", // ✅ IMPORTANT
      }
    }));
  }
}}
>
  <option value="">Select Developer</option>

  {developers.map((dev) => (
    <option key={dev._id} value={dev._id}>
      {dev.name}
    </option>
  ))}

  <option value="OTHER">+ Add Custom Developer</option>
</select>
  ) : (
    <div className="flex gap-2">
      <input
  className="input flex-1"
  placeholder="Enter developer name"
  value={form.coreDetails.developerName}
  onChange={(e) =>
    handleChange("coreDetails", "developerName", e.target.value)
  }
/>

      <button
        type="button"
       onClick={() => {
  setUseCustomDeveloper(false);

  setForm(prev => ({
    ...prev,
    coreDetails: {
      ...prev.coreDetails,
      developerRef: "",
      developerName: "",
    }
  }));
}}
        className="px-3 rounded bg-gray-200 hover:bg-gray-300"
      >
        Cancel
      </button>
    </div>
  )}
            </div>

              {/* ================= CATEGORY ================= */}
<div className="space-y-2">
  <label className="text-sm text-gray-500">Category</label>

  {!useCustomCategory ? (
    <select
      className="input"
      value={form.categoryData.categoryRef || ""}
      onChange={(e) => {
        if (e.target.value === "OTHER") {
          setUseCustomCategory(true);

          setForm(prev => ({
            ...prev,
            categoryData: {
              categoryRef: "",
              categoryName: "",
              customCategory: "",
            }
          }));
        } else {
          const selected = categories.find(
            c => c._id === e.target.value
          );

          setUseCustomCategory(false);

          setForm(prev => ({
            ...prev,
            categoryData: {
              categoryRef: selected?._id || "",
              categoryName: selected?.name || "",
              customCategory: "",
            }
          }));
        }
      }}
    >
      <option value="">Select Category</option>

      {categories.map((cat) => (
        <option key={cat._id} value={cat._id}>
          {cat.name}
        </option>
      ))}

      <option value="OTHER">+ Add Custom Category</option>
    </select>
  ) : (
    <div className="flex gap-2">
      <input
        className="input flex-1"
        placeholder="Enter custom category"
        value={form.categoryData.customCategory}
        onChange={(e) =>
          setForm(prev => ({
            ...prev,
            categoryData: {
              ...prev.categoryData,
              customCategory: e.target.value,
            }
          }))
        }
      />

      <button
        type="button"
        onClick={() => {
          setUseCustomCategory(false);

          setForm(prev => ({
            ...prev,
            categoryData: {
              categoryRef: "",
              categoryName: "",
              customCategory: "",
            }
          }));
        }}
        className="px-3 rounded bg-gray-200 hover:bg-gray-300"
      >
        Cancel
      </button>
    </div>
  )}
</div>

              <input className="input" placeholder="Starting Price"
              value={form.coreDetails.startingPrice}
              onChange={(e) => handleChange("coreDetails", "startingPrice", e.target.value)}
            />

            <input className="input" placeholder="Max Price"
              value={form.coreDetails.maxPrice}
              onChange={(e) => handleChange("coreDetails", "maxPrice", e.target.value)}
            />

            <div className="mt-6">
  <h3 className="font-semibold mb-2">Key Metrics</h3>

  <div className="grid grid-cols-2 gap-4">

    <input
      className="input"
      placeholder="Status (e.g. New Launch)"
      value={form.keyMetrics.status}
      onChange={(e) =>
        handleChange("keyMetrics", "status", e.target.value)
      }
    />

    <input
      className="input"
      placeholder="Possession (e.g. 2028)"
      value={form.keyMetrics.possession}
      onChange={(e) =>
        handleChange("keyMetrics", "possession", e.target.value)
      }
    />

    <input
      className="input"
      placeholder="Land Area (e.g. 10 Acres)"
      value={form.keyMetrics.landArea}
      onChange={(e) =>
        handleChange("keyMetrics", "landArea", e.target.value)
      }
    />

    <input
      className="input"
      placeholder="Total Units"
      value={form.keyMetrics.totalUnits || ""}
      onChange={(e) =>
        handleChange("keyMetrics", "totalUnits", e.target.value)
      }
    />

    <input
      className="input"
      placeholder="Total Towers"
      value={form.keyMetrics.totalTowers || ""}
      onChange={(e) =>
        handleChange("keyMetrics", "totalTowers", e.target.value)
      }
    />

    <input
      className="input"
      placeholder="Floors"
      value={form.keyMetrics.floors || ""}
      onChange={(e) =>
        handleChange("keyMetrics", "floors", e.target.value)
      }
    />

    <input
      className="input col-span-2"
      placeholder="RERA Number"
      value={form.keyMetrics.reraNumber || ""}
      onChange={(e) =>
        handleChange("keyMetrics", "reraNumber", e.target.value)
      }
    />

  </div>
</div>
          </div>
          
        )}

        

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
  <div className="section">
    <h2>Overview</h2>

    <textarea
      className="input"
      placeholder="Description"
      value={form.overview.description}
      onChange={(e) =>
        handleChange("overview", "description", e.target.value)
      }
    />

    <input
      className="input"
      placeholder="About Image URL"
      value={form.overview.aboutImageUrl}
      onChange={(e) =>
        handleChange("overview", "aboutImageUrl", e.target.value)
      }
    />

    {/* ================= AMENITIES ================= */}
    <h3 className="mt-6 font-semibold text-lg">Amenities</h3>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
      {AMENITIES.map((item) => {
        const selected = form.overview.highlights.includes(item.name);
        const Icon = item.icon;

        return (
          <label
            key={item.name}
            className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border transition ${
              selected
                ? "bg-green-100 border-green-400"
                : "bg-gray-100 border-gray-200"
            }`}
          >
            <input
              type="checkbox"
              checked={selected}
              onChange={() => {
                let updated;

                if (selected) {
                  updated = form.overview.highlights.filter(
                    (h) => h !== item.name
                  );
                } else {
                  updated = [...form.overview.highlights, item.name];
                }

                handleChange("overview", "highlights", updated);
              }}
            />

            <Icon size={18} className="text-gray-700" />
            <span>{item.name}</span>
          </label>
        );
      })}
    </div>

    {/* ================= CUSTOM AMENITY ================= */}
    <div className="mt-5 flex gap-2">
      <input
        className="input flex-1"
        placeholder="Add custom amenity"
        value={customAmenity}
        onChange={(e) => setCustomAmenity(e.target.value)}
      />

      <button
        type="button"
        className="bg-black text-white px-4 rounded"
        onClick={() => {
          if (!customAmenity.trim()) return;

          if (!form.overview.highlights.includes(customAmenity)) {
            handleChange("overview", "highlights", [
              ...form.overview.highlights,
              customAmenity,
            ]);
          }

          setCustomAmenity("");
        }}
      >
        + Add
      </button>
    </div>

    {/* ================= SELECTED ================= */}
    <div className="mt-5 flex flex-wrap gap-2">
      {form.overview.highlights.map((item, i) => (
        <div
          key={i}
          className="bg-black text-white px-3 py-1 rounded-full flex items-center gap-2"
        >
          {item}
          <button
            onClick={() => {
              const updated = form.overview.highlights.filter(
                (_, idx) => idx !== i
              );
              handleChange("overview", "highlights", updated);
            }}
          >
            ❌
          </button>
        </div>
      ))}
    </div>
  </div>
)}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
  <div className="section">
    <h2>Configurations</h2>

    {form.unitConfigurations.map((u, i) => (
      <div key={i} className="grid grid-cols-5 gap-2">
        
        <input
          className="input"
          value={u.unitType}
          placeholder="Type"
          onChange={(e) => {
            const arr = [...form.unitConfigurations];
            arr[i].unitType = e.target.value;
            setForm(prev => ({ ...prev, unitConfigurations: arr }));
          }}
        />

        <input
          className="input"
          value={u.area}
          placeholder="Area"
          onChange={(e) => {
            const arr = [...form.unitConfigurations];
            arr[i].area = e.target.value;
            setForm(prev => ({ ...prev, unitConfigurations: arr }));
          }}
        />

        <input
          className="input"
          value={u.price}
          placeholder="Price (e.g. 5 Cr)"
          onChange={(e) => {
            const arr = [...form.unitConfigurations];
            arr[i].price = e.target.value; // ✅ STRING
            setForm(prev => ({ ...prev, unitConfigurations: arr }));
          }}
        />

        <input
          className="input"
          value={u.paymentPlan}
          placeholder="Plan"
          onChange={(e) => {
            const arr = [...form.unitConfigurations];
            arr[i].paymentPlan = e.target.value;
            setForm(prev => ({ ...prev, unitConfigurations: arr }));
          }}
        />

        <button onClick={() => {
          const arr = form.unitConfigurations.filter((_, idx) => idx !== i);
          setForm(prev => ({ ...prev, unitConfigurations: arr }));
        }}>
          ❌
        </button>
      </div>
    ))}

    <button onClick={() =>
      setForm(prev => ({
        ...prev,
        unitConfigurations: [
          ...prev.unitConfigurations,
          { unitType: "", area: "", price: "", paymentPlan: "" }
        ]
      }))
    }>
      + Add Configuration
    </button>
  </div>
)}

        {/* ================= STEP 4 ================= */}
        {step === 4 && (
          <StepMedia form={form} setForm={setForm} />
        )}

        {/* ================= STEP 5 ================= */}
        {step === 5 && (
          <div className="section">
  <h2>Location</h2>

  {/* LOCATION SELECT */}
  <div className="space-y-2">
    <label className="text-sm text-gray-500">Select Location</label>

    {!useCustomLocation ? (
      <select
        className="input"
        value={form.locationData.locationRef || ""}
        onChange={(e) => {
          if (e.target.value === "OTHER") {
            setUseCustomLocation(true);

            setForm(prev => ({
              ...prev,
              locationData: {
                ...prev.locationData,
                locationRef: "",
                locationName: "",
                customLocation: "",
              }
            }));

          } else {
            const selected = buildOptions(locations).find(
              l => l._id === e.target.value
            );

            setUseCustomLocation(false);

            setForm(prev => ({
              ...prev,
              locationData: {
                ...prev.locationData,
                locationRef: selected?._id || "",
                locationName: selected?.label || "",
                customLocation: "",
              }
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

        <option value="OTHER">+ Add Custom Location</option>
      </select>
    ) : (
      <div className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Enter custom location"
          value={form.locationData.customLocation}
          onChange={(e) =>
            setForm(prev => ({
              ...prev,
              locationData: {
                ...prev.locationData,
                customLocation: e.target.value,
              }
            }))
          }
        />

        <button
          type="button"
          onClick={() => {
            setUseCustomLocation(false);

            setForm(prev => ({
              ...prev,
              locationData: {
                ...prev.locationData,
                locationRef: "",
                locationName: "",
                customLocation: "",
              }
            }));
          }}
          className="px-3 rounded bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    )}
  </div>

  {/* ADDRESS */}
  <input
    className="input"
    placeholder="Full Address"
    value={form.locationData.address}
    onChange={(e) =>
      handleChange("locationData", "address", e.target.value)
    }
  />

  {/* LANDMARKS */}
  {form.locationData.landmarks.map((l, i) => (
    <div key={i} className="flex gap-2">
      <input
        value={l.name}
        placeholder="Name"
        onChange={(e) => {
          const arr = [...form.locationData.landmarks];
          arr[i].name = e.target.value;
          setForm(prev => ({
            ...prev,
            locationData: { ...prev.locationData, landmarks: arr }
          }));
        }}
      />

      <input
        value={l.distance}
        placeholder="Distance"
        onChange={(e) => {
          const arr = [...form.locationData.landmarks];
          arr[i].distance = e.target.value;
          setForm(prev => ({
            ...prev,
            locationData: { ...prev.locationData, landmarks: arr }
          }));
        }}
      />

      <button onClick={() => {
        const arr = form.locationData.landmarks.filter((_, idx) => idx !== i);
        setForm(prev => ({
          ...prev,
          locationData: { ...prev.locationData, landmarks: arr }
        }));
      }}>
        ❌
      </button>
    </div>
  ))}

  <button onClick={() =>
    setForm(prev => ({
      ...prev,
      locationData: {
        ...prev.locationData,
        landmarks: [...prev.locationData.landmarks, { name: "", distance: "" }]
      }
    }))
  }>
    + Add Landmark
  </button>
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
          <button onClick={handleUpdate}>💾 Update Property</button>
        )}
    </div>
  </div>

   {/* RIGHT SIDE — LIVE PREVIEW */}
  <div className="w-1/2 overflow-y-auto h-[80vh] border-l pl-4 bg-white rounded-xl">
    <PropertyPreview form={previewData} />
  </div>


</div>
)}
</div>

  );
}