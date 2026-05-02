"use client";

import { useState, useEffect } from "react";
import StepMedia from "./StepMedia";
import { useRouter } from "next/navigation";
import PropertyPreview from "./PropertyPreview";

export default function AddProperty() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [form, setForm] = useState({
    slug: "",
    marketType: "Primary",

    coreDetails: {
  title: "",
  developerRef: "",     // ObjectId
  developerName: "",    // Custom name
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
      address: "",
      mapEmbedUrl: "",
      landmarks: [{ name: "", distance: "" }],
    },

    gatedContent: {
      brochurePdfUrl: "",
      floorPlans: [{ title: "", image: "" }],
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

    const API = "https://property-bouquet-backend.onrender.com/api";

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
    developerName: form.coreDetails.developerName,
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

  return (
    <div className="app-bg p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
  <div>
    <h1 className="text-4xl font-bold text-white">Add Property</h1>
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
          developerName: selectedDev?.name || "", // ✅ STORE NAME
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

            <input className="input" placeholder="Starting Price"
              value={form.coreDetails.startingPrice}
              onChange={(e) => handleChange("coreDetails", "startingPrice", e.target.value)}
            />

            <input className="input" placeholder="Max Price"
              value={form.coreDetails.maxPrice}
              onChange={(e) => handleChange("coreDetails", "maxPrice", e.target.value)}
            />
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="section">
            <h2>Overview</h2>

            <textarea className="input" placeholder="Description"
              value={form.overview.description}
              onChange={(e) => handleChange("overview", "description", e.target.value)}
            />

            <input className="input" placeholder="About Image URL"
              value={form.overview.aboutImageUrl}
              onChange={(e) => handleChange("overview", "aboutImageUrl", e.target.value)}
            />

            <h3>Highlights</h3>

            {form.overview.highlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="input flex-1"
                  value={h}
                  onChange={(e) => {
                    const arr = [...form.overview.highlights];
                    arr[i] = e.target.value;
                    handleChange("overview", "highlights", arr);
                  }}
                />

                <button onClick={() => {
                  const arr = form.overview.highlights.filter((_, idx) => idx !== i);
                  handleChange("overview", "highlights", arr);
                }}>
                  ❌
                </button>
              </div>
            ))}

            <button onClick={() =>
              handleChange("overview", "highlights", [...form.overview.highlights, ""])
            }>
              + Add Highlight
            </button>
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

            <input className="input" placeholder="Address"
              value={form.locationData.address}
              onChange={(e) => handleChange("locationData", "address", e.target.value)}
            />

            {form.locationData.landmarks.map((l, i) => (
              <div key={i} className="flex gap-2">
                <input value={l.name} placeholder="Name"
                  onChange={(e) => {
                    const arr = [...form.locationData.landmarks];
                    arr[i].name = e.target.value;
                    setForm(prev => ({ ...prev, locationData: { ...prev.locationData, landmarks: arr } }));
                  }}
                />

                <input value={l.distance} placeholder="Distance"
                  onChange={(e) => {
                    const arr = [...form.locationData.landmarks];
                    arr[i].distance = e.target.value;
                    setForm(prev => ({ ...prev, locationData: { ...prev.locationData, landmarks: arr } }));
                  }}
                />

                <button onClick={() => {
                  const arr = form.locationData.landmarks.filter((_, idx) => idx !== i);
                  setForm(prev => ({ ...prev, locationData: { ...prev.locationData, landmarks: arr } }));
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
  <div className="w-1/2 overflow-y-auto h-[80vh] border-l pl-4 bg-white rounded-xl">
    <PropertyPreview form={previewData} />
  </div>

  

</div>
)}
</div>

  );
}