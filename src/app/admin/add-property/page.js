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

  // 🔥 FINAL SUBMIT
  const handleSubmit = async () => {
    const res = await fetch("http://localhost:5000/api/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Property Added ✅");
      console.log(data);
    } else {
      alert(data.message || "Error ❌");
    }
  };

  return (
    <div className="p-10 bg-lightBg min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark">Add Property</h1>
        <p className="text-gray-500">Step {step} of 5</p>
      </div>

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <div className="card">
          <h2 className="section-title">Core Details</h2>

          <input
            className="input"
            placeholder="Slug"
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />

          <input
            className="input"
            placeholder="Title"
            onChange={(e) =>
              handleChange("coreDetails", "title", e.target.value)
            }
          />

          <input
            className="input"
            placeholder="Developer"
            onChange={(e) =>
              handleChange("coreDetails", "developerRef", e.target.value)
            }
          />

          <input
            className="input"
            placeholder="Starting Price"
            onChange={(e) =>
              handleChange("coreDetails", "startingPrice", e.target.value)
            }
          />
        </div>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <div className="card">
          <h2 className="section-title">Overview</h2>

          <textarea
            className="input"
            placeholder="Description"
            onChange={(e) =>
              handleChange("overview", "description", e.target.value)
            }
          />

          <h3 className="mt-4 font-semibold">Highlights</h3>

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
            className="text-primary"
          >
            + Add Highlight
          </button>
        </div>
      )}

      {/* ================= STEP 3 ================= */}
      {step === 3 && (
        <div className="card">
          <h2 className="section-title">Unit Configurations</h2>

          {form.unitConfigurations.map((u, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              <input
                placeholder="Type"
                className="input"
                onChange={(e) => {
                  const arr = [...form.unitConfigurations];
                  arr[i].unitType = e.target.value;
                  setForm({ ...form, unitConfigurations: arr });
                }}
              />
              <input
                placeholder="Area"
                className="input"
                onChange={(e) => {
                  const arr = [...form.unitConfigurations];
                  arr[i].area = e.target.value;
                  setForm({ ...form, unitConfigurations: arr });
                }}
              />
              <input
                placeholder="Price"
                className="input"
                onChange={(e) => {
                  const arr = [...form.unitConfigurations];
                  arr[i].price = e.target.value;
                  setForm({ ...form, unitConfigurations: arr });
                }}
              />
              <input
                placeholder="Payment Plan"
                className="input"
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

      {/* ================= STEP 4 (🔥 CLOUDINARY) ================= */}
      {step === 4 && (
        <StepMedia form={form} setForm={setForm} />
      )}

      {/* ================= STEP 5 ================= */}
      {step === 5 && (
        <div className="card">
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

      {/* NAV BUTTONS */}
      <div className="flex justify-between mt-10">
        {step > 1 && (
          <button onClick={prev} className="btn-secondary">
            Back
          </button>
        )}

        {step < 5 ? (
          <button onClick={next} className="btn-primary">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-primary">
            Submit
          </button>
        )}
        
      </div>
    </div>
  );
}