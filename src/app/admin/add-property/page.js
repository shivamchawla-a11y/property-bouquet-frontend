"use client";

import { useState } from "react";
import StepMedia from "./StepMedia";

export default function AddProperty() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    slug: "",
    marketType: "Primary",

    coreDetails: {
      title: "",
      developerRef: "",
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
      gallery: [],
      walkthroughUrl: "",
    },

    locationData: {
      address: "",
      mapEmbedUrl: "",
      landmarks: [{ name: "", distance: "" }],
    },

    gatedContent: {
      brochurePdfUrl: "",
      floorPlans: [],
    },

    seoEngine: {
      metaTitle: "",
      metaDescription: "",
    },

    faqs: [{ question: "", answer: "" }],
  });

  const next = () => setStep((prev) => prev + 1);
  const prev = () => setStep((prev) => prev - 1);

  const handleChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
  try {
    const res = await fetch(
      "https://property-bouquet-backend.onrender.com/api/properties",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 THIS FIXES AUTH
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Property Added ✅");
    } else {
      alert(data.message || "Error ❌");
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
          <h1 className="text-4xl font-bold text-white">
            Add Property
          </h1>
          <p className="text-gray-300">
            Step {step} of 5
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-64 bg-white/20 rounded-full h-2">
          <div
            className="bg-gold h-2 rounded-full transition-all"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto space-y-8">

        {/* STEP 1 */}
        {step === 1 && (
          <div className="section">
            <h2 className="section-title">Core Details</h2>

            <div className="input-group">
              <input
                placeholder=" "
                className="input"
                onChange={(e) =>
                  setForm({ ...form, slug: e.target.value })
                }
              />
              <label className="input-label">Slug</label>
            </div>

            <div className="input-group">
              <input
                placeholder=" "
                className="input"
                onChange={(e) =>
                  handleChange("coreDetails", "title", e.target.value)
                }
              />
              <label className="input-label">Property Title</label>
            </div>

            <div className="input-group">
              <input
                placeholder=" "
                className="input"
                onChange={(e) =>
                  handleChange("coreDetails", "developerRef", e.target.value)
                }
              />
              <label className="input-label">Developer</label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="input-group">
                <input
                  placeholder=" "
                  className="input"
                  onChange={(e) =>
                    handleChange("coreDetails", "startingPrice", e.target.value)
                  }
                />
                <label className="input-label">Starting Price</label>
              </div>

              <div className="input-group">
                <input
                  placeholder=" "
                  className="input"
                  onChange={(e) =>
                    handleChange("coreDetails", "maxPrice", e.target.value)
                  }
                />
                <label className="input-label">Max Price</label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="section">
            <h2 className="section-title">Overview</h2>

            <textarea
              className="input"
              placeholder="Description"
              onChange={(e) =>
                handleChange("overview", "description", e.target.value)
              }
            />

            <h3 className="text-white font-semibold">Highlights</h3>

            {form.overview.highlights.map((h, i) => (
              <input
                key={i}
                value={h}
                onChange={(e) => {
                  const arr = [...form.overview.highlights];
                  arr[i] = e.target.value;
                  handleChange("overview", "highlights", arr);
                }}
                className="input"
              />
            ))}

            <button
              onClick={() =>
                handleChange("overview", "highlights", [
                  ...form.overview.highlights,
                  "",
                ])
              }
              className="text-gold"
            >
              + Add Highlight
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="section">
            <h2 className="section-title">Configurations</h2>

            {form.unitConfigurations.map((u, i) => (
              <div key={i} className="grid grid-cols-4 gap-3">
                <input className="input" placeholder="Type"
                  onChange={(e) => {
                    const arr = [...form.unitConfigurations];
                    arr[i].unitType = e.target.value;
                    setForm({ ...form, unitConfigurations: arr });
                  }}
                />

                <input className="input" placeholder="Area"
                  onChange={(e) => {
                    const arr = [...form.unitConfigurations];
                    arr[i].area = e.target.value;
                    setForm({ ...form, unitConfigurations: arr });
                  }}
                />

                <input className="input" placeholder="Price"
                  onChange={(e) => {
                    const arr = [...form.unitConfigurations];
                    arr[i].price = e.target.value;
                    setForm({ ...form, unitConfigurations: arr });
                  }}
                />

                <input className="input" placeholder="Payment Plan"
                  onChange={(e) => {
                    const arr = [...form.unitConfigurations];
                    arr[i].paymentPlan = e.target.value;
                    setForm({ ...form, unitConfigurations: arr });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <StepMedia form={form} setForm={setForm} />
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="section">
            <h2 className="section-title">SEO</h2>

            <input
              className="input"
              placeholder="Meta Title"
              onChange={(e) =>
                handleChange("seoEngine", "metaTitle", e.target.value)
              }
            />

            <textarea
              className="input"
              placeholder="Meta Description"
              onChange={(e) =>
                handleChange("seoEngine", "metaDescription", e.target.value)
              }
            />
          </div>
        )}

      </div>

      {/* NAV */}
      <div className="flex justify-between mt-10 max-w-4xl mx-auto">

        {step > 1 && (
          <button onClick={prev} className="btn-secondary">
            ← Back
          </button>
        )}

        {step < 5 ? (
          <button onClick={next} className="btn-primary">
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-primary">
            🚀 Publish Property
          </button>
        )}

      </div>

    </div>
  );
}